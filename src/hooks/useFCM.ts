"use client";

import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage, MessagePayload } from "firebase/messaging";
import { app } from "@/lib/firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if messaging is supported
    if ("serviceWorker" in navigator && "Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      console.log("FCM is not supported");
      return false;
    }

    try {
      // Register service worker
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === "granted") {
        const messaging = getMessaging(app);

        if (!VAPID_KEY) {
          console.error("VAPID key is not configured");
          return false;
        }

        const currentToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });

        if (currentToken) {
          setToken(currentToken);
          console.log("FCM Token:", currentToken);
          return currentToken;
        } else {
          console.log("No registration token available");
          return false;
        }
      } else {
        console.log("Notification permission not granted");
        return false;
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  };

  const setupMessageListener = () => {
    if (!isSupported) return;

    try {
      const messaging = getMessaging(app);

      // Listen for foreground messages
      onMessage(messaging, (payload: MessagePayload) => {
        console.log("Message received in foreground:", payload);

        const notificationTitle = payload.notification?.title || "New message";
        const notificationOptions = {
          body: payload.notification?.body || "You have a new message",
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png",
        };

        if (Notification.permission === "granted") {
          new Notification(notificationTitle, notificationOptions);
        }
      });
    } catch (error) {
      console.error("Error setting up message listener:", error);
    }
  };

  return {
    token,
    permission,
    isSupported,
    requestPermission,
    setupMessageListener,
  };
}