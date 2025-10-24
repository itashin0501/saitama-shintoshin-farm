"use client";

import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { Send } from "@mui/icons-material";

interface NotificationSenderProps {
  token?: string;
}

export default function NotificationSender({ token }: NotificationSenderProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSendNotification = async () => {
    if (!token) {
      setMessage({ type: "error", text: "通知トークンがありません" });
      return;
    }

    if (!title.trim() || !body.trim()) {
      setMessage({ type: "error", text: "タイトルと本文を入力してください" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title: title.trim(),
          body: body.trim(),
          data: {
            url: "/fruitshatake",
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "通知を送信しました！" });
        setTitle("");
        setBody("");
      } else {
        setMessage({
          type: "error",
          text: result.error || "通知の送信に失敗しました",
        });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      setMessage({ type: "error", text: "通知の送信に失敗しました" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          通知送信
        </Typography>
        <Alert severity="info">
          通知を送信するには、まず「通知を受け取る」ボタンを押して許可を取得してください。
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        通知送信（テスト用）
      </Typography>

      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          label="通知タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="例: 新しいイベントのお知らせ"
        />

        <TextField
          label="通知内容"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
          placeholder="例: 明日から新しいフルーツ狩りが始まります！"
        />

        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={handleSendNotification}
          disabled={isLoading || !title.trim() || !body.trim()}
          sx={{ mt: 2, mb: 2 }}
        >
          {isLoading ? "送信中..." : "通知を送信"}
        </Button>

        {message && (
          <Alert severity={message.type} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}
      </Box>
    </Paper>
  );
}