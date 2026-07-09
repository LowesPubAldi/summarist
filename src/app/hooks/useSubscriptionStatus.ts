"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { initFirebase } from "../firebase";

export function useSubscriptionStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [isPremium, setIsPremium] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);

  useEffect(() => {
    const app = initFirebase();
    const auth = getAuth(app);
    const db = getFirestore(app);

    let unsubscribeSubscriptions = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeSubscriptions();

      if (!user) {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
        setIsPremium(false);
        setIsSubscriptionLoading(false);
        return;
      }

      setIsLoggedIn(true);
      setIsSubscriptionLoading(true);

      const subscriptionsQuery = query(
        collection(db, "customers", user.uid, "subscriptions"),
        where("status", "in", ["trialing", "active"])
      );

      unsubscribeSubscriptions = onSnapshot(
        subscriptionsQuery,
        (snapshot) => {
          setIsPremium(!snapshot.empty);
          setIsSubscriptionLoading(false);
        },
        () => {
          setIsPremium(false);
          setIsSubscriptionLoading(false);
        }
      );
    });

    return () => {
      unsubscribeSubscriptions();
      unsubscribeAuth();
    };
  }, []);

  return {
    isLoggedIn,
    isPremium,
    isSubscriptionLoading,
  };
}