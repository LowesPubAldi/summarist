"use client";

import Image from "next/image";
import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Searchbar from "@/app/components/Searchbar";
import Modal from "@/app/components/Modal";
import { useRouter } from "next/navigation";
import { useSubscriptionStatus } from "@/app/hooks/useSubscriptionStatus";
import styles from "./page.module.css";

export default function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { isLoggedIn, isPremium, isSubscriptionLoading } =
    useSubscriptionStatus();

  return (
    <div className={`${styles.page} settings`}>
      <Sidebar onLoginClick={() => setIsModalOpen(true)} />

      <main className="settings__content">
        <Searchbar />

        <h1>Settings</h1>

        {isLoggedIn ? (
          <div className="settings__account">
            <div className="settings__section">
              <h3>Your Subscription plan</h3>
              <p>
                {isSubscriptionLoading ? "Loading..." : isPremium ? "Premium" : "Basic"}
              </p>

              {!isSubscriptionLoading && !isPremium && (
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
            <Image src="/login.png" alt="Login illustration" width={640} height={480} />
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
        onLoginSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
}