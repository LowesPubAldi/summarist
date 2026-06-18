"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";

export default function LibraryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = true;

  return (
    <div className="library">
      <Sidebar />

      <main className="library__content">
        <Searchbar />
    <section className="library__main">
  {isLoggedIn ? (
    <div className="libary__books">
        <section>
            <h2>Saved Books</h2>
            <p>0 items</p>

    <div className="library__empty">
        <h3>Save your favorite books!</h3>
            <p>When you save a book, it will appear here.</p>
        </div>
    </section>

        <section>
      <h2>Finished</h2>
      <p>18 items</p>
        </section>
    </div>
  ) : (
    <div className="library__card">
      <img src="/login.png" alt="" />
        <h2>Log in to your account to see your library.</h2>
        <button onClick={() => setIsModalOpen(true)}>
        Login
      </button>
    </div>
  )}
</section>
</main>
</div>
  );
}