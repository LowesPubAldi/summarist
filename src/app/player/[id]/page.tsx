"use client";

import {
  HiOutlineHome,
  HiOutlineBookmark,
  HiOutlinePencil,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

import { useState } from "react";
import Modal from "../../components/Modal";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";

export default function PlayerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="player">
      <Sidebar/>
      <main className="player__content">
        <Searchbar />

<div className="player__title">
  <h1>How to Win Friends and Influence People in the Digital Age</h1>

  <img src="/login.png" alt="" />

  <h2>
    Log in to your account to read and listen to the book
  </h2>

<button
    type="button"
    onClick={() => {
      setIsModalOpen(true);
    }}
  >
    Login
  </button>
</div>

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
</main>

      <div className="audio-player">
  <div className="audio-player__book">
    <img src="/landing.png" alt="" /> 

    <div>
      <h4>How to Win Friends and Influence People in the Digital Age</h4>
      <p>Dale Carnegie</p>
    </div>
  </div>

  <div className="audio-player__controls">
    <button>10</button>
    <button className="audio-player__play">▶</button>
    <button>10</button>
  </div>

  <div className="audio-player__progress">
    <span>00:00</span>
    <input type="range" min="0" max="100" aria-label="Audio progress"/>
    <span>03:24</span>
  </div>
</div>
    </div>
  );
}