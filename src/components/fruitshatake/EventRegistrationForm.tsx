"use client";

import { useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MessageIcon from "@mui/icons-material/Message";

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle?: string;
}

export default function EventRegistrationForm({
  eventId,
  eventTitle,
}: EventRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    adultCount: 1,
    childCount: 0,
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/event-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          eventTitle,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        adultCount: 1,
        childCount: 0,
        message: "",
      });
    } catch (error) {
      console.error("送信エラー:", error);
      setStatus("error");
      setErrorMessage(
        "送信に失敗しました。もう一度お試しいただくか、お電話にてお問い合わせください。"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "adultCount" || name === "childCount"
          ? parseInt(value) || 0
          : value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
      <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
        <GroupIcon className="mr-2" />
        イベント参加申し込み
      </h3>

      {status === "success" ? (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold text-green-800 mb-2">
            お申し込みありがとうございます！
          </p>
          <p className="text-gray-700">
            ご登録いただいたメールアドレス宛に確認メールをお送りしております。
            <br />
            当日お会いできることを楽しみにしております。
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-green-600 hover:text-green-700 underline"
          >
            別の申し込みをする
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* お名前 */}
          <div>
            <label
              htmlFor="name"
              className="flex items-center text-base font-semibold text-gray-700 mb-2"
            >
              <PersonIcon className="mr-2" fontSize="small" />
              お名前 <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              placeholder="山田 太郎"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label
              htmlFor="email"
              className="flex items-center text-base font-semibold text-gray-700 mb-2"
            >
              <EmailIcon className="mr-2" fontSize="small" />
              メールアドレス <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              placeholder="example@email.com"
            />
          </div>

          {/* 電話番号 */}
          <div>
            <label
              htmlFor="phone"
              className="flex items-center text-base font-semibold text-gray-700 mb-2"
            >
              <PhoneIcon className="mr-2" fontSize="small" />
              電話番号 <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              placeholder="090-1234-5678"
            />
          </div>

          {/* 参加人数 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="adultCount"
                className="flex items-center text-base font-semibold text-gray-700 mb-2"
              >
                <GroupIcon className="mr-2" fontSize="small" />
                大人の人数 <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                id="adultCount"
                name="adultCount"
                value={formData.adultCount}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="childCount"
                className="flex items-center text-base font-semibold text-gray-700 mb-2"
              >
                <GroupIcon className="mr-2" fontSize="small" />
                小学生以下の人数
              </label>
              <input
                type="number"
                id="childCount"
                name="childCount"
                value={formData.childCount}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          {/* メッセージ */}
          <div>
            <label
              htmlFor="message"
              className="flex items-center text-base font-semibold text-gray-700 mb-2"
            >
              <MessageIcon className="mr-2" fontSize="small" />
              メッセージ・ご質問（任意）
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none"
              placeholder="アレルギーやご要望などございましたらご記入ください"
            />
          </div>

          {/* エラーメッセージ */}
          {status === "error" && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <p className="text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* 送信ボタン */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
            >
              {status === "submitting" ? "送信中..." : "参加を申し込む"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
