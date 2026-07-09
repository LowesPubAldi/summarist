"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Modal from "../../components/Modal";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import { MdReplay10, MdForward10 } from "react-icons/md";
import { FaPause } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import Link from "next/link";
import { useSubscriptionStatus } from "@/app/hooks/useSubscriptionStatus";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import { useReaderFontSize } from "@/app/hooks/useReaderFontSize";
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

type PlayerProgress = {
  currentTime: number;
  scrollY: number;
  updatedAt: number;
};

type ReadingMode = "compact" | "expanded";

const PLAYER_PROGRESS_KEY_PREFIX = "playerProgress:";
const PLAYER_READING_MODE_KEY = "playerReadingMode";
const PLAYER_PLAYBACK_RATE_KEY = "playerPlaybackRate";
const PLAYBACK_SPEEDS = [1, 1.25, 1.5, 1.75, 2] as const;

const getReadableParagraphs = (value?: string): string[] => {
  if (!value) {
    return [];
  }

  const normalized = value.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  const explicitParagraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (explicitParagraphs.length > 1) {
    return explicitParagraphs;
  }

  const sentenceMatches = normalized.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);
  const sentences = (sentenceMatches ?? [])
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length < 3) {
    return [normalized];
  }

  const groupedParagraphs: string[] = [];

  for (let index = 0; index < sentences.length; index += 2) {
    groupedParagraphs.push(sentences.slice(index, index + 2).join(" "));
  }

  return groupedParagraphs;
};

const getPlayerProgressKey = (bookId: string) =>
  `${PLAYER_PROGRESS_KEY_PREFIX}${bookId}`;

const readPlayerProgress = (bookId: string): PlayerProgress | null => {
  const raw = localStorage.getItem(getPlayerProgressKey(bookId));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;

    const currentTime = Number(parsed.currentTime);
    const scrollY = Number(parsed.scrollY);

    if (!Number.isFinite(currentTime) || !Number.isFinite(scrollY)) {
      return null;
    }

    return {
      currentTime,
      scrollY,
      updatedAt: Number(parsed.updatedAt) || Date.now(),
    };
  } catch {
    return null;
  }
};

export default function PlayerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [readingMode, setReadingMode] = useState<ReadingMode>("expanded");
  const [hasLoadedReadingMode, setHasLoadedReadingMode] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [hasLoadedPlaybackRate, setHasLoadedPlaybackRate] = useState(false);
  const { isPremium, isSubscriptionLoading } = useSubscriptionStatus();
  const { isLoggedIn } = useAuthStatus();
  const { fontSize, setFontSize } = useReaderFontSize();
  const readerFontSizeClass = `reader-font-size-${fontSize}`;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasRestoredAudioRef = useRef(false);
  const hasRestoredScrollRef = useRef(false);
  const lastPersistedSecondRef = useRef(-1);

  const params = useParams();
  const id = params.id as string;

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

  const isPreviewBook = book?.status === "selected";
  const needsSubscription = Boolean(
    book?.subscriptionRequired && !isPreviewBook
  );

  const formatTime = (time: number) => {
    if (!time || Number.isNaN(time)) {
      return "00:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const timeLeft = Math.max(duration - currentTime, 0);

  const saveProgress = (overrides?: { currentTime?: number; scrollY?: number }) => {
    if (!isLoggedIn || !book?.id) {
      return;
    }

    const previous = readPlayerProgress(book.id);

    const current =
      overrides?.currentTime ??
      previous?.currentTime ??
      audioRef.current?.currentTime ??
      currentTime;

    const scrollY = overrides?.scrollY ?? previous?.scrollY ?? window.scrollY;

    localStorage.setItem(
      getPlayerProgressKey(book.id),
      JSON.stringify({
        currentTime: Number.isFinite(current) ? current : 0,
        scrollY: Number.isFinite(scrollY) ? scrollY : 0,
        updatedAt: Date.now(),
      })
    );
  };

  useEffect(() => {
    hasRestoredAudioRef.current = false;
    hasRestoredScrollRef.current = false;
    lastPersistedSecondRef.current = -1;
  }, [book?.id]);

  useEffect(() => {
    const storedMode = localStorage.getItem(PLAYER_READING_MODE_KEY);

    if (storedMode === "compact" || storedMode === "expanded") {
      setReadingMode(storedMode);
    }

    setHasLoadedReadingMode(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedReadingMode) {
      return;
    }

    localStorage.setItem(PLAYER_READING_MODE_KEY, readingMode);
  }, [readingMode, hasLoadedReadingMode]);

  useEffect(() => {
    const storedRate = Number(localStorage.getItem(PLAYER_PLAYBACK_RATE_KEY));

    if (PLAYBACK_SPEEDS.includes(storedRate as (typeof PLAYBACK_SPEEDS)[number])) {
      setPlaybackRate(storedRate);
    }

    setHasLoadedPlaybackRate(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPlaybackRate) {
      return;
    }

    localStorage.setItem(PLAYER_PLAYBACK_RATE_KEY, String(playbackRate));
  }, [playbackRate, hasLoadedPlaybackRate]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate, book?.id]);

  useEffect(() => {
    if (!isLoggedIn || !book?.id || hasRestoredScrollRef.current) {
      return;
    }

    const savedProgress = readPlayerProgress(book.id);
    hasRestoredScrollRef.current = true;

    if (!savedProgress) {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: Math.max(0, savedProgress.scrollY), behavior: "auto" });
    });
  }, [isLoggedIn, book?.id]);

  useEffect(() => {
    if (!isLoggedIn || !book?.id) {
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(() => {
        saveProgress({ scrollY: window.scrollY });
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoggedIn, book?.id]);

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
    saveProgress({ currentTime: newTime });
  };

  const skipAudio = (seconds: number) => {
    if (!audioRef.current) return;

    const newTime = Math.min(
      Math.max(audioRef.current.currentTime + seconds, 0),
      duration
    );

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    saveProgress({ currentTime: newTime });
  };

  const handleCyclePlaybackRate = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(
      playbackRate as (typeof PLAYBACK_SPEEDS)[number]
    );

    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    setPlaybackRate(PLAYBACK_SPEEDS[nextIndex]);
  };

  if (loading) {
    return (
      <div className={`${styles.page} player`}>
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

  if (isLoggedIn && needsSubscription && isSubscriptionLoading) {
    return (
      <div className={`${styles.page} player`}>
        <Sidebar
          showFontControls
          fontSize={fontSize}
          setFontSize={setFontSize}
          onLoginClick={() => setIsModalOpen(true)}
        />

        <main className="player__content">
          <Searchbar />

          <div className="player__title">
            <h2>Checking your subscription</h2>
            <p>We are verifying access to this title.</p>
          </div>
        </main>

        <div className="audio-player" />
      </div>
    );
  }

  if (isLoggedIn && needsSubscription && !isPremium) {
    return (
      <div className={`${styles.page} player`}>
        <Sidebar
          showFontControls
          fontSize={fontSize}
          setFontSize={setFontSize}
          onLoginClick={() => setIsModalOpen(true)}
        />

        <main className="player__content">
          <Searchbar />

          <div className="player__title">
            <Image src="/login.png" alt="" width={400} height={300} />

            <h2>This book needs a Premium subscription</h2>

            <p>Upgrade to unlock the full audio and summary.</p>

            <Link href="/choose-plan" className="plan__trial-btn">
              Go to Choose Plan
            </Link>
          </div>
        </main>

        <div className="audio-player" />
      </div>
    );
  }

  return (
    <div className={`${styles.page} player`}>
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
            <Image src="/login.png" alt="" width={400} height={300} />

            <h2>Log in to your account to read and listen to the book</h2>

            <button type="button" onClick={() => setIsModalOpen(true)}>
              Login
            </button>
          </div>
        ) : (
          <div className="player__title">
            <h1>{book.title}</h1>

            <div className="player__reading-mode" role="group" aria-label="Reading mode">
              <button
                type="button"
                className={readingMode === "compact" ? "is-active" : ""}
                aria-pressed={readingMode === "compact"}
                onClick={() => setReadingMode("compact")}
              >
                Compact
              </button>

              <button
                type="button"
                className={readingMode === "expanded" ? "is-active" : ""}
                aria-pressed={readingMode === "expanded"}
                onClick={() => setReadingMode("expanded")}
              >
                Expanded
              </button>
            </div>

            <div
              className={`player__summary player__summary--${readingMode} reader-font-target ${readerFontSizeClass}`}
            >
              {getReadableParagraphs(book.summary || book.bookDescription).map(
                (paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                )
              )}
            </div>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLoginSuccess={() => setIsModalOpen(false)}
        />

      </main>

      <div className="audio-player">
        <audio
          ref={audioRef}
          src={book.audioLink}
          onLoadedMetadata={() => {
            if (!audioRef.current) return;

            setDuration(audioRef.current.duration);
            audioRef.current.playbackRate = playbackRate;

            if (!isLoggedIn || !book?.id || hasRestoredAudioRef.current) {
              return;
            }

            const savedProgress = readPlayerProgress(book.id);
            hasRestoredAudioRef.current = true;

            if (!savedProgress) {
              return;
            }

            const nextTime = Math.min(
              Math.max(savedProgress.currentTime, 0),
              audioRef.current.duration || 0
            );

            audioRef.current.currentTime = nextTime;
            setCurrentTime(nextTime);
          }}
          onTimeUpdate={() => {
            if (!audioRef.current) return;

            const nextTime = audioRef.current.currentTime;
            setCurrentTime(nextTime);

            if (!isLoggedIn || !book?.id) {
              return;
            }

            if (!hasRestoredAudioRef.current) {
              return;
            }

            const nextSecond = Math.floor(nextTime);

            if (nextSecond !== lastPersistedSecondRef.current) {
              lastPersistedSecondRef.current = nextSecond;
              saveProgress({ currentTime: nextTime });
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="audio-player__book">
          {book.imageLink && (
            <Image src={book.imageLink} alt={book.title} width={48} height={64} />
          )}

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

          <button
            type="button"
            className="audio-player__speed"
            aria-label="Cycle playback speed"
            onClick={handleCyclePlaybackRate}
          >
            {playbackRate}x
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

          <div className="audio-player__time-meta">
            <span>{formatTime(duration)}</span>
            <span className="audio-player__time-left">{formatTime(timeLeft)} left</span>
          </div>
        </div>
      </div>
    </div>
  );
}