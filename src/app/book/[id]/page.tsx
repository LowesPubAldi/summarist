"use client";

import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { HiOutlineBookOpen, HiOutlinePlay } from "react-icons/hi";

export default function BookPage() {
  const [book, setBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const params = useParams();
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
      );

      const text = await response.text();

      if (!text) {
        return;
      }

      const data = JSON.parse(text);
      setBook(data);

      const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]");
      const bookAlreadySaved = savedBooks.some(
        (savedBook: any) => savedBook.id === data.id
      );

      setIsSaved(bookAlreadySaved);
    };

    fetchData();
  }, [id]);

  const handleReadClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
      return;
    }

    router.push(`/book/${id}`);
  };

  const handleListenClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
      return;
    }

    router.push(`/player/${id}`);
  };

  const handleLibraryClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
      return;
    }

    const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]");

    const bookAlreadySaved = savedBooks.some(
      (savedBook: any) => savedBook.id === book.id
    );

    if (bookAlreadySaved) {
      const updatedBooks = savedBooks.filter(
        (savedBook: any) => savedBook.id !== book.id
      );

      localStorage.setItem("savedBooks", JSON.stringify(updatedBooks));
      setIsSaved(false);
    } else {
      const updatedBooks = [...savedBooks, book];

      localStorage.setItem("savedBooks", JSON.stringify(updatedBooks));
      setIsSaved(true);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book">
      <Sidebar onLoginClick={() => setIsModalOpen(true)} />

      <main className="book__content">
        <Searchbar />

        <section className="book__hero">
          <div className="book__details">
            <h1>{book.title}</h1>
            <p>{book.author}</p>
            <h2>{book.subTitle}</h2>

            <div className="book__stats">
              <div>
                ⭐ {book.averageRating} ({book.totalRating} ratings)
              </div>
              <div>⏱ {book.totalDuration || "4:52"}</div>
              <div>🎙 Audio & Text</div>
              <div>💡 {book.keyIdeas} Key ideas</div>
            </div>

            <div className="book__buttons">
              <button onClick={handleReadClick}>
                <HiOutlineBookOpen />
                Read
              </button>

              <button onClick={handleListenClick}>
                <HiOutlinePlay />
                Listen
              </button>
            </div>

            <p className="book__library" onClick={handleLibraryClick}>
              {isSaved ? <BsBookmarkFill /> : <BsBookmark />}
              {isSaved ? " Saved in My Library" : " Add title to My Library"}
            </p>
          </div>

          <figure className="book__image--wrapper">
            <img src={book.imageLink} alt={book.title} />
          </figure>
        </section>

        <section className="book__about">
          <h3>What's it about?</h3>

          <div className="book__tags">
            {book.tags?.map((tag: string) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <p>{book.bookDescription}</p>

          <h3>About the author</h3>
          <p>{book.authorDescription}</p>
        </section>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}