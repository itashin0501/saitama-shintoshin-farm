"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  ACTIVITIES_COLLECTION,
  uploadHanayasaiImage,
  type HanayasaiActivity,
} from "@/lib/hanayasai";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function HanayasaiActivitiesAdminPage() {
  const [activities, setActivities] = useState<HanayasaiActivity[]>([]);
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");

  const fetchActivities = async () => {
    try {
      const snapshot = await getDocs(collection(db, ACTIVITIES_COLLECTION));
      const list = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }) as HanayasaiActivity)
        .sort((a, b) => a.order - b.order);
      setActivities(list);
      setCaptions(Object.fromEntries(list.map((a) => [a.id, a.caption])));
    } catch (error) {
      console.error("利用の様子取得エラー:", error);
      alert("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const selectFile = (file: File | null) => {
    setNewFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : "";
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile) {
      alert("写真を選択してください");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadHanayasaiImage(newFile, "activities");
      const maxOrder = Math.max(0, ...activities.map((a) => a.order));
      await addDoc(collection(db, ACTIVITIES_COLLECTION), {
        imageUrl,
        caption: newCaption,
        order: maxOrder + 1,
        isPublished: true,
        createdAt: serverTimestamp(),
      });
      selectFile(null);
      setNewCaption("");
      (e.target as HTMLFormElement).reset();
      await fetchActivities();
    } catch (error) {
      console.error("追加エラー:", error);
      alert("写真の追加に失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCaption = async (id: string) => {
    try {
      await updateDoc(doc(db, ACTIVITIES_COLLECTION, id), {
        caption: captions[id] ?? "",
      });
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, caption: captions[id] } : a))
      );
      alert("キャプションを保存しました");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    }
  };

  const handleTogglePublish = async (activity: HanayasaiActivity) => {
    try {
      await updateDoc(doc(db, ACTIVITIES_COLLECTION, activity.id), {
        isPublished: !activity.isPublished,
      });
      setActivities((prev) =>
        prev.map((a) =>
          a.id === activity.id ? { ...a, isPublished: !a.isPublished } : a
        )
      );
    } catch (error) {
      console.error("公開設定エラー:", error);
      alert("公開設定の変更に失敗しました");
    }
  };

  // 隣の写真と並び順を入れ替え、全件の order を 1 始まりの連番に振り直す
  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= activities.length) return;

    const reordered = [...activities];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    try {
      const batch = writeBatch(db);
      reordered.forEach((a, i) => {
        batch.update(doc(db, ACTIVITIES_COLLECTION, a.id), { order: i + 1 });
      });
      await batch.commit();
      setActivities(reordered.map((a, i) => ({ ...a, order: i + 1 })));
    } catch (error) {
      console.error("並び替えエラー:", error);
      alert("並び替えに失敗しました");
    }
  };

  const handleDelete = async (activity: HanayasaiActivity) => {
    if (!confirm("この写真を削除してもよろしいですか？\nこの操作は取り消せません。")) {
      return;
    }
    try {
      await deleteDoc(doc(db, ACTIVITIES_COLLECTION, activity.id));
      setActivities((prev) => prev.filter((a) => a.id !== activity.id));
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowBackIcon className="mr-1" fontSize="small" />
          管理画面TOPへ戻る
        </Link>

        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <PhotoLibraryIcon className="text-green-600 mr-3" fontSize="large" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  花野菜農園 利用の様子
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  TOPページ「体験」の下に表示される写真とキャプションを管理します
                </p>
              </div>
            </div>
            <Link
              href="/hanayasai"
              target="_blank"
              className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <VisibilityIcon fontSize="small" className="mr-1" />
              公開ページを見る
            </Link>
          </div>
        </div>

        {/* 新規追加 */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-800">写真を追加</h2>
          <label className="flex items-center justify-center w-full px-4 py-6 bg-green-50 border-2 border-green-300 border-dashed rounded-lg cursor-pointer hover:bg-green-100">
            <div className="flex flex-col items-center">
              <CloudUploadIcon className="text-green-600 mb-2" />
              <span className="text-sm text-green-600 font-semibold">
                {newFile ? newFile.name : "写真を選択"}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="プレビュー"
              className="max-h-60 rounded-lg border-2 border-gray-200"
            />
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              キャプション
            </label>
            <textarea
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="例: ご家族でじゃがいもの収穫を楽しまれました"
            />
          </div>
          <button
            type="submit"
            disabled={uploading || !newFile}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <CloudUploadIcon className="mr-2" />
            {uploading ? "アップロード中..." : "追加する"}
          </button>
        </form>

        {/* 一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            登録済みの写真（上から順に表示されます）
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 py-8">読み込み中...</p>
          ) : activities.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              写真がまだ登録されていません
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`border-2 rounded-lg p-4 flex flex-col md:flex-row gap-4 ${
                    activity.isPublished
                      ? "border-gray-200"
                      : "border-gray-200 bg-gray-50 opacity-75"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activity.imageUrl}
                    alt={activity.caption}
                    className="w-full md:w-48 h-36 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0"
                  />

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {activity.isPublished ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          公開中
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
                          非公開
                        </span>
                      )}
                    </div>
                    <textarea
                      value={captions[activity.id] ?? ""}
                      onChange={(e) =>
                        setCaptions((prev) => ({
                          ...prev,
                          [activity.id]: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="キャプション"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveCaption(activity.id)}
                      disabled={captions[activity.id] === activity.caption}
                      className="flex items-center bg-green-50 hover:bg-green-100 disabled:opacity-40 text-green-700 px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      <SaveIcon fontSize="small" className="mr-1" />
                      キャプションを保存
                    </button>
                  </div>

                  {/* 操作 */}
                  <div className="flex md:flex-col gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-2 rounded-lg text-sm"
                      aria-label="上へ"
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === activities.length - 1}
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-2 rounded-lg text-sm"
                      aria-label="下へ"
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(activity)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      {activity.isPublished ? "非公開にする" : "公開する"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(activity)}
                      className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <DeleteIcon fontSize="small" className="mr-1" />
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
