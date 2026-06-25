"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";

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
};

export default function LibraryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(loggedIn);

    const books = JSON.parse(localStorage.getItem("savedBooks") || "[]");
    setSavedBooks(books);
  }, []);

  const handleModalClose = () => {
  setIsModalOpen(false);

  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  setIsLoggedIn(loggedIn);

  const books = JSON.parse(localStorage.getItem("savedBooks") || "[]");
  setSavedBooks(books);
};

  return (
    <div className="library">
      <Sidebar onLoginClick={() => setIsModalOpen(true)} />

      <main className="library__content">
        <Searchbar />

        <section className="library__main">
          {isLoggedIn ? (
            <div className="library__books">
              <section>
                <h2>Saved Books</h2>
                <p>{savedBooks.length} items</p>

                {savedBooks.length > 0 ? (
                  <div className="library__saved-books">
                    {savedBooks.map((book) => (
                      <Link
                        href={`/book/${book.id}`}
                        className="library__book"
                        key={book.id}
                      >
                        <img src={book.imageLink} alt={book.title} />

                        <div className="library__book-info">
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <p>{book.subTitle}</p>

                          <p className="library__rating">
                            ⭐ {book.averageRating}
                          </p>

                          <p className="library__duration">
                            ⏱ {book.totalDuration}
                          </p>

                          <p className="library__subtitle">
                            {book.subTitle}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="library__empty">
                    <h3>Save your favorite books!</h3>
                    <p>When you save a book, it will appear here.</p>
                  </div>
                )}
              </section>

            <section className="library__finished">
                <h2>Finished</h2>
                <p>0 items</p>

              <div className="library__finished-empty">
                <h3>Done and dusted!</h3>
                <p>
                  When you finish a book,
                  <br />
                  you can find it here later.
                  </p>
              </div>
          </section>

            </div>
          ) : (
            <div className="library__card">
              <img src="/login.png" alt="" />
              <h2>Log in to your account to see your library.</h2>
              <button onClick={() => setIsModalOpen(true)}>Login</button>
            </div>
          )}
        </section>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={() => {
          setIsModalOpen(false);
          setIsLoggedIn(true);

        const books = JSON.parse(localStorage.getItem("savedBooks") || "[]");
        setSavedBooks(books);

        window.location.reload();
        }}
        />
    </div>
  );
}