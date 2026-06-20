"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Modal from "../../components/Modal";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";

export default function PlayerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [book, setBook] = useState<any>(null);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    async function fetchBook() {
      const response = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
      );

      const text = await response.text();

        if (!text) {
        return;
        }

const data = JSON.parse(text);

console.log("PLAYER BOOK:", data);

      setBook(data);
    }

    fetchBook();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="player">
      <Sidebar />

      <main className="player__content">
        <Searchbar />

        {!isLoggedIn ? (
          <div className="player__title">
            <h1>{book.title}</h1>

            <img src="/login.png" alt="" />

            <h2>Log in to your account to read and listen to the book</h2>

            <button type="button" onClick={() => setIsModalOpen(true)}>
              Login
            </button>
          </div>
        ) : (
          <div className="player__title">
            <h1>{book.title}</h1>

            <p>{book.summary || book.bookDescription}</p>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>

      {isLoggedIn && (
        <div className="audio-player">
          <div className="audio-player__book">
            <img src={book.imageLink} alt={book.title} />

            <div>
              <h4>{book.title}</h4>
              <p>{book.author}</p>
            </div>
          </div>

          <div className="audio-player__controls">
            <button>10</button>
            <button className="audio-player__play">▶</button>
            <button>10</button>
          </div>

          <div className="audio-player__progress">
            <span>00:00</span>
            <input type="range" min="0" max="100" aria-label="Audio progress" />
            <span>{book.totalDuration || "03:24"}</span>
          </div>
        </div>
      )}
    </div>
  );
}