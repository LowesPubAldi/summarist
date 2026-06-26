"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Modal from "../../components/Modal";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import { MdReplay10, MdForward10 } from "react-icons/md";
import { FaPause } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";

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
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [fontSize, setFontSize] = useState(16);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    async function fetchBook() {
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
      } finally {
        setLoading(false);
      }
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

  if (loading) {
    return (
      <div className="player">
        <Sidebar
          showFontControls
          fontSize={fontSize}
          setFontSize={setFontSize}
          onLoginClick={() => setIsModalOpen(true)}
        />

        <main className="player__content">
          <Searchbar />

          <div className="player__skeleton">
            <div className="player__skeleton-line player__skeleton-title" />
            <div className="player__skeleton-line" />
            <div className="player__skeleton-line" />
            <div className="player__skeleton-line player__skeleton-short" />
            <div className="player__skeleton-line" />
            <div className="player__skeleton-line player__skeleton-shorter" />
          </div>
        </main>

        <div className="audio-player">
          <div className="audio-player__book">
            <div className="player__skeleton-cover-small" />

            <div>
              <div className="player__skeleton-audio-line" />
              <div className="player__skeleton-audio-line player__skeleton-audio-short" />
            </div>
          </div>

          <div className="audio-player__controls">
            <div className="player__skeleton-circle" />
            <div className="player__skeleton-play" />
            <div className="player__skeleton-circle" />
          </div>

          <div className="audio-player__progress">
            <span>00:00</span>
            <div className="player__skeleton-progress" />
            <span>00:00</span>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="player">
      <Sidebar
        showFontControls
        fontSize={fontSize}
        setFontSize={setFontSize}
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

            <div className="player__summary">
              {(book.summary || book.bookDescription || "")
                .split(/\n\s*\n/)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>
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

        <style jsx>{`
          .player__summary {
            font-size: ${fontSize}px;
          }
        `}</style>
      </main>

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
          <button
            className="audio-player__skip"
            onClick={() => skipAudio(-10)}
            aria-label="Rewind 10 seconds"
          >
            <MdReplay10 />
          </button>

          <button className="audio-player__play" onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaCirclePlay />}
          </button>

          <button
            className="audio-player__skip"
            onClick={() => skipAudio(10)}
            aria-label="Forward 10 seconds"
          >
            <MdForward10 />
          </button>
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
    </div>
  );
}