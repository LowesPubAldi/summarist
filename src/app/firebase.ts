import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB2EZqsTERFPxxGeNhUtZSKB16AJ9h_hjA",
  authDomain: "summarist-5853d.firebaseapp.com",
  projectId: "summarist-5853d",
  storageBucket: "summarist-5853d.firebasestorage.app",
  messagingSenderId: "947672078232",
  appId: "1:947672078232:web:e226efa8a4378b49a8bded"

};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const initFirebase = () => {
  return app;
};