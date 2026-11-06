"use client";

import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import ImageDropzone from "@/components/admin/ImageDropzone";
import {
  ACTIVITIES_COLLECTION,
  uploadHanayasaiImage,
  type HanayasaiActivity,
  type HanayasaiActivitySection,
} from "@/lib/hanayasai";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

type PendingPhoto = {
  key: string;
  file: File;
  previewUrl: string;
  caption: string;
  error?: string;
};

type Props = {
  section: HanayasaiActivitySection;
  // この項目の写真（order 昇順）
  photos: HanayasaiActivity[];
  isFirst: boolean;
  isLast: boolean;
  onSaveTitle: (title: string) => Promise<void>;
  onTogglePublish: () => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
  // 全写真の一覧を更新する（setActivities をそのまま渡す）
  onPhotosChange: (
    updater: (all: HanayasaiActivity[]) => HanayasaiActivity[]
  ) => void;
  onReload: () => Promise<void>;
};

export default function ActivitySectionCard({
  section,
  photos,
  isFirst,
  isLast,
  onSaveTitle,
  onTogglePublish,
  onMove,
  onDelete,
  onPhotosChange,
  onReload,
}: Props) {
  const [title, setTitle] = useState(section.title);
  // 編集中のキャプション。未編集の写真は保存済みの値を表示する
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  // アンマウント時にプレビュー用の Object URL を解放するため最新値を保持
  const pendingRef = useRef(pending);
  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(
    () => () => pendingRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl)),
    []
  );

  const addPending = (files: File[]) => {
    setPending((prev) => [
      ...prev,
      ...files.map((file) => ({
        key: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        caption: "",
      })),
    ]);
  };

  const updatePending = (key: string, patch: Partial<PendingPhoto>) => {
    setPending((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  };

  const removePending = (key: string) => {
    setPending((prev) => {
      const target = prev.find((p) => p.key === key);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.key !== key);
    });
  };

  // 1枚ずつアップロードし、成功したものから「追加待ち」から外す。失敗したものはエラー表示で残す
  const handleAdd = async () => {
    if (pending.length === 0) return;

    setUploading(true);
    let order = Math.max(0, ...photos.map((a) => a.order));
    let failed = 0;
    for (const item of pending) {
      updatePending(item.key, { error: undefined });
      try {
        const { url, thumbnailUrl } = await uploadHanayasaiImage(item.file, "activities");
        order += 1;
        await addDoc(collection(db, ACTIVITIES_COLLECTION), {
          sectionId: section.id,
          imageUrl: url,
          thumbnailUrl,
          caption: item.caption,
          order,
          isPublished: true,
          createdAt: serverTimestamp(),
        });
        removePending(item.key);
      } catch (error) {
        console.error("追加エラー:", error);
        failed += 1;
        updatePending(item.key, {
          error: error instanceof Error ? error.message : "追加に失敗しました",
        });
      }
    }
    await onReload();
    setUploading(false);
    if (failed > 0) alert(`${failed}枚の写真を追加できませんでした`);
  };

  const handleSaveCaption = async (id: string) => {
    const caption = captions[id] ?? "";
    try {
      await updateDoc(doc(db, ACTIVITIES_COLLECTION, id), { caption });
      onPhotosChange((all) => all.map((a) => (a.id === id ? { ...a, caption } : a)));
      setCaptions((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      alert("キャプションを保存しました");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    }
  };

  const handleTogglePhotoPublish = async (activity: HanayasaiActivity) => {
    try {
      await updateDoc(doc(db, ACTIVITIES_COLLECTION, activity.id), {
        isPublished: !activity.isPublished,
      });
      onPhotosChange((all) =>
        all.map((a) =>
          a.id === activity.id ? { ...a, isPublished: !a.isPublished } : a
        )
      );
    } catch (error) {
      console.error("公開設定エラー:", error);
      alert("公開設定の変更に失敗しました");
    }
  };

  // 項目内で隣の写真と並び順を入れ替え、項目内の order を 1 始まりの連番に振り直す
  const handleMovePhoto = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;

    const reordered = [...photos];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const newOrder = new Map(reordered.map((a, i) => [a.id, i + 1]));

    try {
      const batch = writeBatch(db);
      reordered.forEach((a, i) => {
        batch.update(doc(db, ACTIVITIES_COLLECTION, a.id), { order: i + 1 });
      });
      await batch.commit();
      onPhotosChange((all) =>
        all.map((a) => (newOrder.has(a.id) ? { ...a, order: newOrder.get(a.id)! } : a))
      );
    } catch (error) {
      console.error("並び替えエラー:", error);
      alert("並び替えに失敗しました");
    }
  };

  const handleDeletePhoto = async (activity: HanayasaiActivity) => {
    if (!confirm("この写真を削除してもよろしいですか？\nこの操作は取り消せません。")) {
      return;
    }
    try {
      await deleteDoc(doc(db, ACTIVITIES_COLLECTION, activity.id));
      onPhotosChange((all) => all.filter((a) => a.id !== activity.id));
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    }
  };

  const trimmedTitle = title.trim();

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 space-y-6 ${
        section.isPublished ? "" : "opacity-80"
      }`}
    >
      {/* 項目の見出しと操作 */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 border-b-2 border-gray-100 pb-4">
        <div className="flex items-center gap-2 flex-1">
          {section.isPublished ? (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex-shrink-0">
              公開中
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 flex-shrink-0">
              非公開
            </span>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 text-lg font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            placeholder="項目名（例: 利用の様子）"
          />
          <button
            type="button"
            onClick={() => onSaveTitle(trimmedTitle)}
            disabled={!trimmedTitle || trimmedTitle === section.title}
            className="flex items-center bg-green-50 hover:bg-green-100 disabled:opacity-40 text-green-700 px-3 py-2 rounded-lg text-sm transition-colors flex-shrink-0"
          >
            <SaveIcon fontSize="small" className="mr-1" />
            保存
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={isFirst}
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-2 rounded-lg text-sm"
            aria-label="項目を上へ"
          >
            <ArrowUpwardIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={isLast}
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-2 rounded-lg text-sm"
            aria-label="項目を下へ"
          >
            <ArrowDownwardIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={onTogglePublish}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            {section.isPublished ? "項目を非公開にする" : "項目を公開する"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <DeleteIcon fontSize="small" className="mr-1" />
            項目を削除
          </button>
        </div>
      </div>

      {/* 写真の追加 */}
      <div className="space-y-4">
        <ImageDropzone
          multiple
          onFiles={addPending}
          disabled={uploading}
          label="この項目に追加する写真をここにドラッグ&ドロップ"
        />

        {pending.length > 0 && (
          <>
            <p className="text-sm text-gray-600">
              キャプションを入力して「追加する」を押してください（あとから編集もできます）
            </p>
            <div className="space-y-3">
              {pending.map((item) => (
                <div
                  key={item.key}
                  className={`flex flex-col sm:flex-row gap-3 border-2 rounded-lg p-3 ${
                    item.error ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-full sm:w-36 h-28 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <textarea
                      value={item.caption}
                      onChange={(e) =>
                        updatePending(item.key, { caption: e.target.value })
                      }
                      disabled={uploading}
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="例: ご家族でじゃがいもの収穫を楽しまれました"
                    />
                    {item.error && (
                      <p className="text-sm text-red-600">{item.error}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePending(item.key)}
                    disabled={uploading}
                    className="self-start bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm disabled:opacity-40"
                  >
                    取り消し
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={uploading}
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <CloudUploadIcon className="mr-2" />
              {uploading ? "アップロード中..." : `${pending.length}枚を追加する`}
            </button>
          </>
        )}
      </div>

      {/* 登録済みの写真 */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3">
          登録済みの写真 {photos.length}枚（上から順に、公開ページでは左から横スクロールで表示されます）
        </h3>
        {photos.length === 0 ? (
          <p className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg">
            写真がまだ登録されていません（写真が無い項目は公開ページに表示されません）
          </p>
        ) : (
          <div className="space-y-4">
            {photos.map((activity, index) => {
              const caption = captions[activity.id] ?? activity.caption;
              return (
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
                    src={activity.thumbnailUrl || activity.imageUrl}
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
                      value={caption}
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
                      disabled={caption === activity.caption}
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
                      onClick={() => handleMovePhoto(index, -1)}
                      disabled={index === 0}
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-2 rounded-lg text-sm"
                      aria-label="上へ"
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMovePhoto(index, 1)}
                      disabled={index === photos.length - 1}
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 px-3 py-2 rounded-lg text-sm"
                      aria-label="下へ"
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePhotoPublish(activity)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      {activity.isPublished ? "非公開にする" : "公開する"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(activity)}
                      className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <DeleteIcon fontSize="small" className="mr-1" />
                      削除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
