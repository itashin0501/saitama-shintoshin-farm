// Firebase Service Worker for FCM
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCUuKOgIEsrqmGtB8uZxH39KNrw5Fsa67E",
  authDomain: "fruits-hatake.firebaseapp.com",
  projectId: "fruits-hatake",
  storageBucket: "fruits-hatake.firebasestorage.app",
  messagingSenderId: "535151453831",
  appId: "1:535151453831:web:614b38b6aac288bf9e7a22",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle =
    payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body || "Background Message body.",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
