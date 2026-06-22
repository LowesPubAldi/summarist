"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <div className="settings">
      <Sidebar onLoginClick={() => setIsModalOpen(true)} />

      <main className="settings__content">
        <Searchbar />

        <h1>Settings</h1>

        {isLoggedIn ? (
          <div className="settings__account">
            <div className="settings__section">
              <h3>Your Subscription plan</h3>
              <p>{isPremium ? "Premium" : "Basic"}</p>

              {!isPremium && (
                <button
                  className="settings__button"
                  onClick={() => router.push("/choose-plan")}
                  >
                  Upgrade to Premium
              </button>
              )}
            </div>

            <div className="settings__section">
              <h3>Email</h3>
              <p>guest@gmail.com</p>
            </div>
          </div>
        ) : (
          <div className="settings__logged-out">
            <img src="/login.png" alt="" />
            <h2>Log in to your account to see your details.</h2>
            <button
              className="settings__button"
              onClick={() => setIsModalOpen(true)}
            >
              Login
            </button>
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={() => {
        setIsModalOpen(false);
        setIsLoggedIn(true);
        window.location.reload();
        }}
        />
    </div>
  );
}