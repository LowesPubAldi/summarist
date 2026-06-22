"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
};

export default function Modal({
  isOpen,
  onClose,
  onLoginSuccess,
}: ModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const finishLogin = () => {
    setError("");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isGuest", "true");
    onClose();

    if (onLoginSuccess) {
      onLoginSuccess();
      return;
    }

    router.push("/for-you");
  };

  const handleLogin = () => {
    if (email === "guest@gmail.com" && password === "guest123") {
      finishLogin();
    } else {
      setError("Invalid email or password");
    }
  };

  const handleGuestLogin = () => {
    finishLogin();
  };

  return (
    <div className="modal__backdrop">
      <div className="modal">
        <button type="button" className="modal__close" onClick={onClose}>
          ×
        </button>

        <h2>Log in to Summarist</h2>

        <button className="modal__guest" onClick={handleGuestLogin}>
          <span className="modal__guest-icon">
            <FaUser />
          </span>
          Login as a Guest
        </button>

        <div className="modal__divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <button
          className="modal__google"
          onClick={() =>
            setError("Google login is not available in this demo")
          }
        >
          <img src="/google.png" alt="Google" className="modal__google-icon" />
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

        {error && <p className="modal__error">{error}</p>}

        <button className="modal__login" onClick={handleLogin}>
          Login
        </button>

        <p
          className="modal__forgot"
          onClick={() =>
            setError("Password reset is not available in this demo")
          }
        >
          Forgot your password?
        </p>

        <p
          className="modal__register"
          onClick={() =>
            setError("Account creation is not available in this demo")
          }
        >
          Don&apos;t have an account?
        </p>
      </div>
    </div>
  );
}