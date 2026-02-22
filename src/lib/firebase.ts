import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4LKOCgsPnN4mRlC0MN9SDUmyKxAE5Jy8",
  authDomain: "mrburguer-c5f7d.firebaseapp.com",
  projectId: "mrburguer-c5f7d",
  storageBucket: "mrburguer-c5f7d.firebasestorage.app",
  messagingSenderId: "690349800884",
  appId: "1:690349800884:web:a6fd7ae67a5a44924d86e1",
  measurementId: "G-3XV9G6E3WN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
