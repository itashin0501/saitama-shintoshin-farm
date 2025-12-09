import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, Messaging, isSupported as isMessagingSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCUuKOgIEsrqmGtB8uZxH39KNrw5Fsa67E",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "fruits-hatake.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fruits-hatake",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "fruits-hatake.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "535151453831",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:535151453831:web:614b38b6aac288bf9e7a22",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3KXRLZHDS3",
};

// Firebaseの初期化
const app: FirebaseApp = initializeApp(firebaseConfig);

// Analyticsの初期化（クライアントサイドのみ）
let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Firestore
const db = getFirestore(app);

// Storage
const storage = getStorage(app);

// FCM Messaging（クライアントサイドのみ）
let messaging: Messaging | undefined;
if (typeof window !== "undefined") {
  isMessagingSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { app, analytics, db, storage, messaging };
