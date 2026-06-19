"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";

export default function ForYouPage() {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<any[]>([]);

  useEffect(() => {
    async function getSelectedBook() {
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

      setRecommendedBooks(data);
    }

    async function getSuggestedBooks() {
      const response = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
      );
      const data = await response.json();

      setSuggestedBooks(data);
    }

    getSelectedBook();
    getRecommendedBooks();
    getSuggestedBooks();
  }, []);

  return (
    <div className="for-you-page">
      <Sidebar />

      <main className="for-you">
        <Searchbar />

        <section className="for-you__selected">
          <h2>Selected just for you</h2>

          <div className="selected-book">
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
          </div>
        </section>

        <section className="for-you__recommended">
          <h2>Recommended For You</h2>
          <p>We think you&apos;ll like these</p>

          <div className="for-you__books">
            {recommendedBooks.slice(0, 5).map((book) => (
              <div className="for-you__book" key={book.id}>
                {book.subscriptionRequired && (
                  <span className="book-pill">Premium</span>
                )}
                <img src={book.imageLink} alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.subTitle}</p>
              <div className="selected-book__time">
                {/* <span>⏱ {book.duration || "03:24"}</span> */}
                <span>☆ {book.rating || "4.4"}</span>
              </div>
              </div>
            ))}
          </div>
        </section>

        <section className="for-you__suggested">
          <h2>Suggested Books</h2>

          <div className="for-you__books">
            {suggestedBooks.slice(0, 5).map((book) => (
              <div className="for-you__book" key={book.id}>
                {book.subscriptionRequired && (
                  <span className="book-pill">Premium</span>
                )}

                <img src={book.imageLink} alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.subTitle}</p>
                <div className="selected-book__time">
                  {/* <span>⏱ {book.duration || "03:24"}</span> */}
                  <span>☆ {book.rating || "4.4"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}