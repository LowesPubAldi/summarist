"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Modal from "../../components/Modal";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";

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

export default function PlayerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setBook(data);
    }

    fetchBook();
  }, [id]);

  const formatTime = (time: number) => {
    if (!time || Number.isNaN(time)) {
      return "00:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipAudio = (seconds: number) => {
    if (!audioRef.current) return;

    const newTime = Math.min(
      Math.max(audioRef.current.currentTime + seconds, 0),
      duration
    );

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="player">
      <Sidebar
        showFontControls
        onLoginClick={() => setIsModalOpen(true)}
      />

      <main className="player__content">
        <Searchbar />

        {!isLoggedIn ? (
          <div className="player__title">

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

         <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLoginSuccess={() => {
          setIsModalOpen(false);
          setIsLoggedIn(true);
          window.location.reload();
          }}
          />
      </main>

      {isLoggedIn && (
        <div className="audio-player">
          <audio
            ref={audioRef}
            src={book.audioLink}
            onLoadedMetadata={() => {
              if (!audioRef.current) return;
              setDuration(audioRef.current.duration);
            }}
            onTimeUpdate={() => {
              if (!audioRef.current) return;
              setCurrentTime(audioRef.current.currentTime);
            }}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="audio-player__book">
            <img src={book.imageLink} alt={book.title} />

            <div>
              <h4>{book.title}</h4>
              <p>{book.author}</p>
            </div>
          </div>

          <div className="audio-player__controls">
            <button onClick={() => skipAudio(-10)}>10</button>

            <button className="audio-player__play" onClick={handlePlayPause}>
              {isPlaying ? "❚❚" : "▶"}
            </button>

            <button onClick={() => skipAudio(10)}>10</button>
          </div>

          <div className="audio-player__progress">
            <span>{formatTime(currentTime)}</span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Audio progress"
            />

            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}