"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("メール送信に失敗しました");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("送信エラー:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-green-800 mb-6">
        お問い合わせフォーム
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            placeholder="山田 太郎"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            電話番号
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            placeholder="090-1234-5678"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            お問い合わせ内容 <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
          >
            <option value="">選択してください</option>
            <option value="見学について">見学について</option>
            <option value="料金について">料金について</option>
            <option value="契約について">契約について</option>
            <option value="設備について">設備について</option>
            <option value="イベントについて">イベントについて</option>
            <option value="その他">その他</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            メッセージ <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
            placeholder="お問い合わせ内容をご記入ください"
          />
        </div>

        {submitStatus === "success" && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
            お問い合わせありがとうございます。担当者より折り返しご連絡させていただきます。
          </div>
        )}

        {submitStatus === "error" && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
            送信に失敗しました。お手数ですが、お電話またはメールにてお問い合わせください。
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 active:bg-green-800"
          }`}
        >
          {isSubmitting ? "送信中..." : "送信する"}
        </button>
      </form>
    </div>
  );
}
