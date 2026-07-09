"use client";

import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IoBookOutline, IoPlayOutline } from "react-icons/io5";
import { useSubscriptionStatus } from "@/app/hooks/useSubscriptionStatus";
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

export default function BookPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isPremium, isSubscriptionLoading } = useSubscriptionStatus();
  const { isLoggedIn } = useAuthStatus();

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );

        const text = await response.text();

        if (!text) {
          return;
        }

        const data: Book = JSON.parse(text);

        setBook(data);

        const savedBooks: Book[] = JSON.parse(
          localStorage.getItem("savedBooks") || "[]"
        );

        const bookAlreadySaved = savedBooks.some(
          (savedBook) => savedBook.id === data.id
        );

        setIsSaved(bookAlreadySaved);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isPreviewBook = book?.status === "selected";
  const needsSubscription = Boolean(
    book?.subscriptionRequired && !isPreviewBook
  );

  const handleReadClick = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!loggedIn) {
      setIsModalOpen(true);
      return;
    }

    if (needsSubscription && isSubscriptionLoading) {
      return;
    }

    if (needsSubscription && !isPremium) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${id}`);
  };

  const handleListenClick = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!loggedIn) {
      setIsModalOpen(true);
      return;
    }

    if (needsSubscription && isSubscriptionLoading) {
      return;
    }

    if (needsSubscription && !isPremium) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${id}`);
  };

  const handleLibraryClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
      return;
    }

    if (!book) return;

    const savedBooks: Book[] = JSON.parse(
      localStorage.getItem("savedBooks") || "[]"
    );

    const bookAlreadySaved = savedBooks.some(
      (savedBook) => savedBook.id === book.id
    );

    if (bookAlreadySaved) {
      const updatedBooks = savedBooks.filter(
        (savedBook) => savedBook.id !== book.id
      );

      localStorage.setItem("savedBooks", JSON.stringify(updatedBooks));
      setIsSaved(false);
    } else {
      const updatedBooks = [...savedBooks, book];

      localStorage.setItem("savedBooks", JSON.stringify(updatedBooks));
      setIsSaved(true);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.page} book`}>
        <Sidebar onLoginClick={() => setIsModalOpen(true)} />

        <main className="book__content">
          <Searchbar />

          <section className="book__skeleton">
            <div className="book__skeleton-info">
              <div className="book__skeleton-line book__skeleton-title" />
              <div className="book__skeleton-line book__skeleton-author" />
              <div className="book__skeleton-line book__skeleton-subtitle" />

              <div className="book__skeleton-stats">
                <div />
                <div />
                <div />
                <div />
              </div>

              <div className="book__skeleton-buttons">
                <div />
                <div />
              </div>
            </div>

            <div className="book__skeleton-cover" />
          </section>

          <section className="book__skeleton-about">
            <div className="book__skeleton-line book__skeleton-heading" />
            <div className="book__skeleton-tags">
              <div />
              <div />
            </div>
            <div className="book__skeleton-line" />
            <div className="book__skeleton-line" />
            <div className="book__skeleton-line book__skeleton-short" />
          </section>
        </main>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className={`${styles.page} book`}>
      <Sidebar onLoginClick={() => setIsModalOpen(true)} />
    <main className="book__content">
      <Searchbar />

      <div className="book__inner">
        <section className="book__main">
          <div className="book__top">
            <h1>{book.title}</h1>
            <p>{book.author}</p>
            <h2>{book.subTitle}</h2>

            <div className="book__details">
              <div>
                ⭐ {book.averageRating} ({book.totalRating} ratings)
              </div>
              <div>⏱ {formatDuration(book.totalDuration)} </div>
              <div>🎙 Audio & Text</div>
              <div>💡 {book.keyIdeas} Key ideas</div>
            </div>

            <div className="book__buttons">
              <button onClick={handleReadClick}>
                <IoBookOutline />
                Read
              </button>

              <button onClick={handleListenClick}>
                <IoPlayOutline />
                Listen
              </button>
            </div>   

            <p className="book__library" onClick={handleLibraryClick}>
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              {isSaved ? " Saved in My Library" : " Add title to My Library"}
            </p>
          </div>

          <figure className="book__image--wrapper">
            {book.imageLink && (
              <Image src={book.imageLink} alt={book.title} width={300} height={450} />
            )}
          </figure>
        </section>

        <section className="book__about">
          <h3>What&apos;s it about?</h3>

          <div className="book__tags">
            {book.tags?.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <p>{book.bookDescription}</p>

          <h3>About the author</h3>
          <p>{book.authorDescription}</p>
        </section>
      </div>
    </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
}