"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Event } from "@/components/EventDetail";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface EventFormProps {
  eventId?: string;
  mode: "create" | "edit";
}

export default function EventForm({ eventId, mode }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    subtitle: "",
    description: "",
    place: "",
    timeRange: "",
    adultFee: 0,
    childFee: 0,
    images: [],
    flyerImage: "",
    simpleMode: false,
    notes: [],
    feeNotes: [],
    providedItems: [],
    takeItems: [],
  });

  const [dateInput, setDateInput] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newFeeNote, setNewFeeNote] = useState("");
  const [newProvidedItem, setNewProvidedItem] = useState("");
  const [newTakeItem, setNewTakeItem] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Event;
          setFormData(data);
          if (data.date) {
            setDateInput(
              data.date.toDate().toISOString().split("T")[0]
            );
          }
        }
      } catch (error) {
        console.error("イベント取得エラー:", error);
      }
    };

    if (mode === "edit" && eventId) {
      fetchEvent();
    }
  }, [mode, eventId]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "flyer" | "gallery"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const timestamp = Date.now();
      const storageRef = ref(
        storage,
        `events/${timestamp}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      if (type === "flyer") {
        setFormData((prev) => ({ ...prev, flyerImage: url }));
      } else {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), url],
        }));
      }

      alert("画像をアップロードしました");
    } catch (error) {
      console.error("画像アップロードエラー:", error);
      alert("画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        date: dateInput ? Timestamp.fromDate(new Date(dateInput)) : null,
      };

      if (mode === "create") {
        await addDoc(collection(db, "events"), eventData);
        alert("イベントを作成しました");
      } else if (mode === "edit" && eventId) {
        await updateDoc(doc(db, "events", eventId), eventData);
        alert("イベントを更新しました");
      }

      router.push("/admin/events");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (field: keyof Event, value: string) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...((prev[field] as string[]) || []), value],
    }));
  };

  const removeArrayItem = (field: keyof Event, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: ((prev[field] as string[]) || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本情報 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">基本情報</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              イベント名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="例: いちご狩りイベント"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              サブタイトル
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="例: 春の収穫祭"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              説明文
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="イベントの詳細説明を入力してください"
            />
          </div>
        </div>
      </div>

      {/* 日時・場所 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">日時・場所</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              開催日
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="例: 10:00〜15:00"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            開催場所
          </label>
          <input
            type="text"
            value={formData.place}
            onChange={(e) =>
              setFormData({ ...formData, place: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            placeholder="例: フルーツとやさい畑"
          />
        </div>

        {/* 注意事項リスト */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            注意事項
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="注意事項を入力"
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("notes", newNote);
                setNewNote("");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              追加
            </button>
          </div>
          <ul className="space-y-2">
            {(formData.notes || []).map((note, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span>{note}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem("notes", index)}
                  className="text-red-600 hover:text-red-700"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 料金設定 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">料金設定</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              大人料金（円）
            </label>
            <input
              type="number"
              value={formData.adultFee}
              onChange={(e) =>
                setFormData({ ...formData, adultFee: Number(e.target.value) })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              小学生以下料金（円）
            </label>
            <input
              type="number"
              value={formData.childFee}
              onChange={(e) =>
                setFormData({ ...formData, childFee: Number(e.target.value) })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              min="0"
            />
          </div>
        </div>

        {/* 料金備考 */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            料金に関する備考
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newFeeNote}
              onChange={(e) => setNewFeeNote(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="例: 3歳以下無料"
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("feeNotes", newFeeNote);
                setNewFeeNote("");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              追加
            </button>
          </div>
          <ul className="space-y-2">
            {(formData.feeNotes || []).map((note, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span>{note}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem("feeNotes", index)}
                  className="text-red-600 hover:text-red-700"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 用意するもの */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          当日のご用意
        </h2>

        {/* 運営側で用意するもの */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            運営側で用意するもの
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newProvidedItem}
              onChange={(e) => setNewProvidedItem(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="例: BBQ用具一式"
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("providedItems", newProvidedItem);
                setNewProvidedItem("");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              追加
            </button>
          </div>
          <ul className="space-y-2">
            {(formData.providedItems || []).map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem("providedItems", index)}
                  className="text-red-600 hover:text-red-700"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 持ち込み自由 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            持ち込み自由
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTakeItem}
              onChange={(e) => setNewTakeItem(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="例: お飲み物、レジャーシート"
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("takeItems", newTakeItem);
                setNewTakeItem("");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              追加
            </button>
          </div>
          <ul className="space-y-2">
            {(formData.takeItems || []).map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem("takeItems", index)}
                  className="text-red-600 hover:text-red-700"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 表示モード設定 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">表示モード設定</h2>

        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <input
            type="checkbox"
            id="simpleMode"
            checked={formData.simpleMode}
            onChange={(e) =>
              setFormData({ ...formData, simpleMode: e.target.checked })
            }
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <label
              htmlFor="simpleMode"
              className="block text-base font-semibold text-gray-700 cursor-pointer"
            >
              シンプルモードで表示
            </label>
            <p className="text-sm text-gray-600 mt-1">
              チェックを入れると、イベント詳細ページでチラシ画像と申し込みフォームのみを表示します。
              <br />
              チェックを外すと、日時・場所・料金などの詳細情報とギャラリー画像を表示します。
            </p>
          </div>
        </div>
      </div>

      {/* 画像アップロード */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">画像</h2>

        {/* チラシ画像 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            チラシ画像
            {formData.simpleMode && (
              <span className="ml-2 text-blue-600 text-xs font-normal">
                （シンプルモードで表示されます）
              </span>
            )}
          </label>
          {formData.flyerImage && (
            <div className="mb-4">
              <img
                src={formData.flyerImage}
                alt="チラシ"
                className="max-w-md h-auto rounded-lg border-2 border-gray-200"
              />
            </div>
          )}
          <label className="flex items-center justify-center w-full px-4 py-6 bg-green-50 border-2 border-green-300 border-dashed rounded-lg cursor-pointer hover:bg-green-100">
            <div className="flex flex-col items-center">
              <CloudUploadIcon className="text-green-600 mb-2" />
              <span className="text-sm text-green-600 font-semibold">
                {uploading ? "アップロード中..." : "チラシ画像を選択"}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "flyer")}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* ギャラリー画像 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ギャラリー画像（スライドショー用）
          </label>
          {(formData.images || []).length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {(formData.images || []).map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`ギャラリー ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("images", index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="flex items-center justify-center w-full px-4 py-6 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer hover:bg-blue-100">
            <div className="flex flex-col items-center">
              <CloudUploadIcon className="text-blue-600 mb-2" />
              <span className="text-sm text-blue-600 font-semibold">
                {uploading ? "アップロード中..." : "ギャラリー画像を追加"}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "gallery")}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors"
        >
          <SaveIcon className="mr-2" />
          {loading
            ? "保存中..."
            : mode === "create"
            ? "イベントを作成"
            : "変更を保存"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-lg transition-colors"
        >
          <CancelIcon className="mr-2" />
          キャンセル
        </button>
      </div>
    </form>
  );
}
