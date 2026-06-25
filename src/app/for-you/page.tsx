"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";
import { IoPlayCircle } from "react-icons/io5";
import Link from "next/link";

type Book = {
  id: string;
  title: string;
  author?: string;
  subTitle?: string;
  imageLink?: string;
  summary?: string;
  bookDescription?: string;
  status?: string;
  subscriptionRequired?: boolean;
  audioLink?: string;
  averageRating?: number;
  totalRating?: number;
  totalDuration?: string;
  keyIdeas?: number;
  tags?: string[];
  authorDescription?: string;
  rating?: number | string;
};

export default function ForYouPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBooks() {
      try {
        setLoading(true);

        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);

        const [selectedResponse, recommendedResponse, suggestedResponse] =
          await Promise.all([
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
            ),
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
            ),
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
            ),
          ]);

        const [selectedData, recommendedData, suggestedData] =
          await Promise.all([
            selectedResponse.json(),
            recommendedResponse.json(),
            suggestedResponse.json(),
          ]);

        setSelectedBook(selectedData[0]);
        setRecommendedBooks(recommendedData as Book[]);
        setSuggestedBooks(suggestedData as Book[]);
      } finally {
        setLoading(false);
      }
    }

    getBooks();
  }, []);

  if (loading) {
    return (
      <div className="for-you-page">
        <Sidebar onLoginClick={() => setIsModalOpen(true)} />

        <main className="for-you">
          <Searchbar />

          <section className="for-you__selected">
            <div className="for-you__skeleton-line for-you__skeleton-heading" />

            <div className="selected-book for-you__selected-skeleton">
              <div className="for-you__skeleton-line for-you__skeleton-selected-text" />
              <div className="for-you__skeleton-cover" />

              <div className="selected-book__info">
                <div className="for-you__skeleton-line for-you__skeleton-title" />
                <div className="for-you__skeleton-line for-you__skeleton-author" />
                <div className="for-you__skeleton-line for-you__skeleton-time" />
              </div>
            </div>
          </section>

          <section className="for-you__recommended">
            <div className="for-you__skeleton-line for-you__skeleton-heading" />
            <div className="for-you__skeleton-line for-you__skeleton-subheading" />

            <div className="for-you__books">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="for-you__book for-you__book-skeleton" key={index}>
                  <div className="for-you__skeleton-book-img" />
                  <div className="for-you__skeleton-line" />
                  <div className="for-you__skeleton-line for-you__skeleton-short" />
                  <div className="for-you__skeleton-line for-you__skeleton-medium" />
                </div>
              ))}
            </div>
          </section>

          <section className="for-you__suggested">
            <div className="for-you__skeleton-line for-you__skeleton-heading" />

            <div className="for-you__books">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="for-you__book for-you__book-skeleton" key={index}>
                  <div className="for-you__skeleton-book-img" />
                  <div className="for-you__skeleton-line" />
                  <div className="for-you__skeleton-line for-you__skeleton-short" />
                  <div className="for-you__skeleton-line for-you__skeleton-medium" />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="for-you-page">
      <Sidebar onLoginClick={() => setIsModalOpen(true)} />

      <main className="for-you">
        <Searchbar />

        <section className="for-you__selected">
          <h2>Selected just for you</h2>

          {selectedBook && (
            <Link href={`/book/${selectedBook.id}`} className="selected-book">
              <div className="selected-book__text">
                <p>{selectedBook.subTitle}</p>
              </div>

              <img src={selectedBook.imageLink} alt={selectedBook.title} />

              <div className="selected-book__info">
                <h3>{selectedBook.title}</h3>
                <p>{selectedBook.author}</p>

                <div className="selected-book__time">
                  <IoPlayCircle className="selected-book__play" />
                  <span>3 mins 23 secs</span>
                </div>
              </div>
            </Link>
          )}
        </section>

        <section className="for-you__recommended">
          <h2>Recommended For You</h2>
          <p>We think you&apos;ll like these</p>

          <div className="for-you__books">
            {recommendedBooks.slice(0, 5).map((book) => (
              <Link href={`/book/${book.id}`} className="for-you__book" key={book.id}>
                {book.subscriptionRequired && (
                  <span className="book-pill">Premium</span>
                )}

                <img src={book.imageLink} alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.subTitle}</p>

                <div className="selected-book__time">
                  <span>⭐ {book.rating || "4.4"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="for-you__suggested">
          <h2>Suggested Books</h2>

          <div className="for-you__books">
            {suggestedBooks.slice(0, 5).map((book) => (
              <Link href={`/book/${book.id}`} className="for-you__book" key={book.id}>
                {book.subscriptionRequired && (
                  <span className="book-pill">Premium</span>
                )}

                <img src={book.imageLink} alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.subTitle}</p>

                <div className="selected-book__time">
                  <span>⭐ {book.rating || "4.4"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={() => {
          setIsModalOpen(false);
          setIsLoggedIn(true);
          window.location.reload();
        }}
      />
    </div>
  );
}