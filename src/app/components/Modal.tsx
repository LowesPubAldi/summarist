"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Modal({ isOpen, onClose }: ModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = () => {
    if (
      email === "guest@gmail.com" &&
      password === "guest123"
    ) {
      setError("");
      onClose();
      router.push("/for-you");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleGuestLogin = () => {
    onClose();
    router.push("/for-you");
  };

  return (
    
    <div className="modal__backdrop">
      <div className="modal">
        <button
          className="modal__close"
          onClick={onClose}
        >
          ×
        </button>

        <h2>Log in to Summarist</h2>

        <button 
        className="modal__guest"
        onClick={handleGuestLogin}
        >
            Login as a Guest
            </button>

    <div className="modal__divider">
        <span></span>
        <p>or</p>
        <span></span>
    </div>

        <button
            className="modal__google"
            onClick={() => alert("Google Login")}
            >
         Login with Google
    </button>

    <div className="modal__divider">
        <span></span>
        <p>or</p>
        <span></span>
        </div>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="modal__error">
            {error}
          </p>
        )}

        <button
          className="modal__login"
          onClick={handleLogin}
        >
          Login
        </button>
    <p
        className="modal__forgot"
        onClick={() => alert("Forgot password clicked")}
        >
        Forgot your password?
        </p>

    <p
        className="modal__register"
        onClick={() => alert("Create account clicked")}
        >
        Don't have an account?
        </p>
      </div>
    </div>
  );
}