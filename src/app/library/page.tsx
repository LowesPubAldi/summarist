"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";
import { formatDuration } from "@/app/utils/formatDuration";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import styles from "./page.module.css";

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
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const { isLoggedIn } = useAuthStatus();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedBooks(JSON.parse(localStorage.getItem("savedBooks") || "[]"));
  }, []);

  return (
    <div className={`${styles.page} library`}>
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
                        {book.imageLink && (
                          <Image src={book.imageLink} alt={book.title} width={180} height={270} />
                        )}

                        <div className="library__book-info">
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <p>{book.subTitle}</p>

                          <p className="library__rating">
                            ⭐ {book.averageRating}
                          </p>

                          <p className="library__duration">
                            ⏱ {formatDuration(book.totalDuration)}
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
              <Image src="/login.png" alt="" width={420} height={320} />
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

          const books = JSON.parse(localStorage.getItem("savedBooks") || "[]");
          setSavedBooks(books);
        }}
        />
    </div>
  );
}