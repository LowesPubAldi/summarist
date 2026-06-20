import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

export const getCheckoutUrl = async (
  app: FirebaseApp,
  priceId: string
): Promise<string> => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const db = getFirestore(app);
  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const data = snap.data() as {
        error?: { message: string };
        url?: string;
      };

      if (data?.error) {
        unsubscribe();
        reject(new Error(`An error occurred: ${data.error.message}`));
      }

      if (data?.url) {
        unsubscribe();
        resolve(data.url);
      }
    });
  });
};

export const getPortalUrl = async (app: FirebaseApp): Promise<string> => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const functions = getFunctions(app, "us-central1");
  const functionRef = httpsCallable(
    functions,
    "ext-firestore-stripe-payments-createPortalLink"
  );

  const { data } = await functionRef({
    customerId: user.uid,
    returnUrl: window.location.origin,
  });

  const dataWithUrl = data as { url: string };

  if (!dataWithUrl.url) {
    throw new Error("No url returned");
  }

  return dataWithUrl.url;
};