"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";

export default function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="settings">
      <Sidebar />

      <main className="settings__content">
        <Searchbar />
        <section className="settings__main">
          <h1>Settings</h1>

          <div className="settings__card">
            <img src="/login.png" alt="" />

            <h2>Log in to your account to see your details.</h2>

            <button onClick={() => setIsModalOpen(true)}>Login</button>
          </div>
        </section>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}