"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";
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
  const [recommendedBooks, setRecommendedBooks] = useState<Book[] | null>(null);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function getSelectedBook() {

      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);

      const response = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
      );
      const data = await response.json();
      setSelectedBook(data[0]);
    }

    async function getRecommendedBooks() {
      const response = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
      );
      const data = await response.json();
      setRecommendedBooks(data as Book[]);
    }

    async function getSuggestedBooks() {
      const response = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
      );
      const data = await response.json();
      setSuggestedBooks(data as Book[]);
    }

    getSelectedBook();
    getRecommendedBooks();
    getSuggestedBooks();
  }, []);

  return (
    <div className="for-you-page">
      <Sidebar onLoginClick={() => setIsModalOpen(true)} />

      <main className="for-you">
        <Searchbar />

        <section className="for-you__selected">
          <h2>Selected just for you</h2>

          <Link href={`/book/${selectedBook?.id}`} className="selected-book">
            <div className="selected-book__text">
              <p>{selectedBook?.subTitle}</p>
            </div>

            <img src={selectedBook?.imageLink} alt={selectedBook?.title} />

            <div className="selected-book__info">
              <h3>{selectedBook?.title}</h3>
              <p>{selectedBook?.author}</p>

              <div className="selected-book__time">
                <button>▶</button>
                <span>3 mins 23 secs</span>
              </div>
            </div>
          </Link>
        </section>

        <section className="for-you__recommended">
          <h2>Recommended For You</h2>
          <p>We think you&apos;ll like these</p>

          <div className="for-you__books">
            {recommendedBooks?.slice(0, 5).map((book) => (
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
            {suggestedBooks?.slice(0, 5).map((book) => (
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