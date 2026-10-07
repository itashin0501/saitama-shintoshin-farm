"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  EVENTS_COLLECTION,
  EVENT_TYPE_LABELS,
  dateInputToTimestamp,
  timestampToDateInput,
  uploadHanayasaiImage,
  type EventPhoto,
  type HanayasaiEvent,
  type HanayasaiEventType,
} from "@/lib/hanayasai";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface HanayasaiEventFormProps {
  eventId?: string;
  mode: "create" | "edit";
}

type FormData = Omit<HanayasaiEvent, "id" | "eventDate" | "createdAt" | "updatedAt">;

const inputStyle =
  "w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500";

export default function HanayasaiEventForm({
  eventId,
  mode,
}: HanayasaiEventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [formData, setFormData] = useState<FormData>({
    type: "announcement",
    title: "",
    timeRange: "",
    place: "花野菜農園",
    body: "",
    coverImage: "",
    photos: [],
    isPublished: false,
  });

  useEffect(() => {
    if (mode !== "edit" || !eventId) return;
    const fetchEvent = async () => {
      try {
        const docSnap = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
        if (docSnap.exists()) {
          const data = docSnap.data() as HanayasaiEvent;
          setFormData({
            type: data.type ?? "announcement",
            title: data.title ?? "",
            timeRange: data.timeRange ?? "",
            place: data.place ?? "",
            body: data.body ?? "",
            coverImage: data.coverImage ?? "",
            photos: data.photos ?? [],
            isPublished: data.isPublished ?? false,
          });
          setDateInput(timestampToDateInput(data.eventDate));
        }
      } catch (error) {
        console.error("イベント取得エラー:", error);
        alert("イベントの取得に失敗しました");
      }
    };
    fetchEvent();
  }, [mode, eventId]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadHanayasaiImage(file, "events");
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (error) {
      console.error("画像アップロードエラー:", error);
      alert("画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    try {
      const urls = await Promise.all(
        files.map((file) => uploadHanayasaiImage(file, "events"))
      );
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...urls.map((url) => ({ url, caption: "" }))],
      }));
    } catch (error) {
      console.error("画像アップロードエラー:", error);
      alert("画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const updatePhoto = (index: number, patch: Partial<EventPhoto>) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    setFormData((prev) => {
      if (target < 0 || target >= prev.photos.length) return prev;
      const photos = [...prev.photos];
      [photos[index], photos[target]] = [photos[target], photos[index]];
      return { ...prev, photos };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        eventDate: dateInputToTimestamp(dateInput),
        updatedAt: serverTimestamp(),
      };

      if (mode === "create") {
        await addDoc(collection(db, EVENTS_COLLECTION), {
          ...eventData,
          createdAt: serverTimestamp(),
        });
        alert("イベントを作成しました");
      } else if (eventId) {
        await updateDoc(doc(db, EVENTS_COLLECTION, eventId), eventData);
        alert("イベントを更新しました");
      }

      router.push("/admin/hanayasai/events");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 種別 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">種別</h2>
        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(EVENT_TYPE_LABELS) as HanayasaiEventType[]).map(
            (type) => (
              <label
                key={type}
                className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.type === type
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold text-gray-800">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={() => setFormData({ ...formData, type })}
                  />
                  {EVENT_TYPE_LABELS[type]}
                </span>
                <span className="text-sm text-gray-600 mt-1">
                  {type === "announcement"
                    ? "これから開催するイベントのお知らせ（開催日を過ぎると一覧から自動で非表示）"
                    : "開催したイベントの様子を写真付きで紹介"}
                </span>
              </label>
            )
          )}
        </div>
      </div>

      {/* 基本情報 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">基本情報</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputStyle}
              placeholder="例: 秋の収穫祭"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                開催日
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                時間帯
              </label>
              <input
                type="text"
                value={formData.timeRange}
                onChange={(e) =>
                  setFormData({ ...formData, timeRange: e.target.value })
                }
                className={inputStyle}
                placeholder="例: 10:00〜15:00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              開催場所
            </label>
            <input
              type="text"
              value={formData.place}
              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              本文
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={10}
              className={inputStyle}
              placeholder={
                formData.type === "announcement"
                  ? "イベントの内容、参加方法、料金、持ち物などを入力してください"
                  : "当日の様子や参加者の感想などを入力してください"
              }
            />
          </div>
        </div>
      </div>

      {/* メイン画像 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">メイン画像</h2>
        <p className="text-sm text-gray-600 mb-4">
          一覧のサムネイルと詳細ページの先頭に表示されます（チラシ画像など）
        </p>
        {formData.coverImage && (
          <div className="mb-4 relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.coverImage}
              alt="メイン画像"
              className="max-w-md max-h-80 rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, coverImage: "" })}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700"
              aria-label="メイン画像を削除"
            >
              ×
            </button>
          </div>
        )}
        <label className="flex items-center justify-center w-full px-4 py-6 bg-green-50 border-2 border-green-300 border-dashed rounded-lg cursor-pointer hover:bg-green-100">
          <div className="flex flex-col items-center">
            <CloudUploadIcon className="text-green-600 mb-2" />
            <span className="text-sm text-green-600 font-semibold">
              {uploading ? "アップロード中..." : "メイン画像を選択"}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* 写真 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">写真とキャプション</h2>
        <p className="text-sm text-gray-600 mb-4">
          詳細ページに表示される写真です。複数枚まとめて選択できます
        </p>
        {formData.photos.length > 0 && (
          <div className="space-y-4 mb-4">
            {formData.photos.map((photo, index) => (
              <div
                key={`${photo.url}-${index}`}
                className="flex flex-col md:flex-row gap-4 border-2 border-gray-200 rounded-lg p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={`写真 ${index + 1}`}
                  className="w-full md:w-40 h-32 object-cover rounded-lg flex-shrink-0"
                />
                <textarea
                  value={photo.caption}
                  onChange={(e) => updatePhoto(index, { caption: e.target.value })}
                  rows={3}
                  className={`${inputStyle} flex-1`}
                  placeholder="キャプション（任意）"
                />
                <div className="flex md:flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => movePhoto(index, -1)}
                    disabled={index === 0}
                    className="bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-2 rounded-lg"
                    aria-label="上へ"
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePhoto(index, 1)}
                    disabled={index === formData.photos.length - 1}
                    className="bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-2 rounded-lg"
                    aria-label="下へ"
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <label className="flex items-center justify-center w-full px-4 py-6 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer hover:bg-blue-100">
          <div className="flex flex-col items-center">
            <CloudUploadIcon className="text-blue-600 mb-2" />
            <span className="text-sm text-blue-600 font-semibold">
              {uploading ? "アップロード中..." : "写真を追加"}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotosUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* 公開設定 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">公開設定</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData({ ...formData, isPublished: e.target.checked })
            }
            className="w-5 h-5"
          />
          <span className="text-base font-medium text-gray-700">
            公開する（チェックを外すと下書きとして保存されます）
          </span>
        </label>
      </div>

      {/* 送信ボタン */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors"
        >
          <SaveIcon className="mr-2" />
          {loading ? "保存中..." : mode === "create" ? "作成する" : "変更を保存"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/hanayasai/events")}
          className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-lg transition-colors"
        >
          <CancelIcon className="mr-2" />
          キャンセル
        </button>
      </div>
    </form>
  );
}
