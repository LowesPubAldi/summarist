"use client";

import { useEffect, useState } from "react";

export const AUTH_EVENT = "summarist-auth-change";

export function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    syncAuthState();

    window.addEventListener(AUTH_EVENT, syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  return {
    isLoggedIn,
  };
}