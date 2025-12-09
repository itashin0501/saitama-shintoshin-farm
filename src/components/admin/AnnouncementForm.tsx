"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type AnnouncementFormProps = {
  mode: "create" | "edit";
  announcementId?: string;
};

type AnnouncementData = {
  title: string;
  content: string;
  isPublished: boolean;
  createdAt?: Timestamp;
  publishedAt?: Timestamp;
};

export default function AnnouncementForm({
  mode,
  announcementId,
}: AnnouncementFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AnnouncementData>({
    title: "",
    content: "",
    isPublished: false,
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!announcementId) return;
      try {
        const docRef = doc(db, "announcements", announcementId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as AnnouncementData;
          setFormData(data);
        }
      } catch (error) {
        console.error("お知らせ取得エラー:", error);
        alert("お知らせの取得に失敗しました");
      }
    };

    if (mode === "edit" && announcementId) {
      fetchAnnouncement();
    }
  }, [mode, announcementId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert("タイトルと内容を入力してください");
      return;
    }

    setLoading(true);

    try {
      if (mode === "create") {
        const newAnnouncement = {
          ...formData,
          createdAt: serverTimestamp(),
          publishedAt: formData.isPublished ? serverTimestamp() : null,
        };
        await addDoc(collection(db, "announcements"), newAnnouncement);
        alert("お知らせを作成しました");
      } else {
        const updateData: Partial<AnnouncementData> & {
          publishedAt?: any;
        } = {
          title: formData.title,
          content: formData.content,
          isPublished: formData.isPublished,
        };

        // 公開状態が変更された場合、publishedAtを更新
        if (formData.isPublished && !formData.publishedAt) {
          updateData.publishedAt = serverTimestamp();
        }

        await updateDoc(doc(db, "announcements", announcementId!), updateData);
        alert("お知らせを更新しました");
      }
      router.push("/admin/announcements");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* タイトル */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">基本情報</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="お知らせのタイトル"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="お知らせの内容"
            required
          />
        </div>
      </div>

      {/* 公開設定 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">公開設定</h2>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData({ ...formData, isPublished: e.target.checked })
            }
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label
            htmlFor="isPublished"
            className="text-base font-medium text-gray-700 cursor-pointer"
          >
            このお知らせを公開する
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2 ml-8">
          チェックを入れると、トップページのお知らせ欄に表示されます
        </p>
      </div>

      {/* 保存ボタン */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push("/admin/announcements")}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? "保存中..." : mode === "create" ? "作成" : "更新"}
        </button>
      </div>
    </form>
  );
}
