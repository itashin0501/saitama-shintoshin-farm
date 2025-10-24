"use client";

import { useState, useEffect } from "react";
import { useFCM } from "@/hooks/useFCM";
import { Button } from "@mui/material";
import { Notifications, NotificationsOff } from "@mui/icons-material";

interface PushNotificationButtonProps {
  onTokenReceived?: (token: string) => void;
}

export default function PushNotificationButton({ onTokenReceived }: PushNotificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { token, permission, isSupported, requestPermission, setupMessageListener } = useFCM();

  useEffect(() => {
    if (token && onTokenReceived) {
      onTokenReceived(token);
    }
  }, [token, onTokenReceived]);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const receivedToken = await requestPermission();
      if (receivedToken) {
        setupMessageListener();
        if (onTokenReceived) {
          onTokenReceived(receivedToken);
        }
        console.log("Notifications enabled successfully!");
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  if (permission === "granted") {
    return (
      <Button
        variant="contained"
        startIcon={<Notifications />}
        sx={{
          backgroundColor: "#4CAF50",
          "&:hover": { backgroundColor: "#45a049" },
          mt: 2,
          mb: 2,
        }}
        disabled
      >
        通知が有効です
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      startIcon={<NotificationsOff />}
      onClick={handleEnableNotifications}
      disabled={isLoading}
      sx={{
        backgroundColor: "#ff9800",
        "&:hover": { backgroundColor: "#e68900" },
        mt: 2,
        mb: 2,
      }}
    >
      {isLoading ? "設定中..." : "通知を受け取る"}
    </Button>
  );
}