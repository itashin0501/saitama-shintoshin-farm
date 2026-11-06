"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import ActivitySectionCard from "@/components/admin/ActivitySectionCard";
import {
  ACTIVITIES_COLLECTION,
  ACTIVITY_SECTIONS_COLLECTION,
  LEGACY_SECTION_TITLE,
  type HanayasaiActivity,
  type HanayasaiActivitySection,
} from "@/lib/hanayasai";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function HanayasaiActivitiesAdminPage() {
  const [sections, setSections] = useState<HanayasaiActivitySection[]>([]);
  const [activities, setActivities] = useState<HanayasaiActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchAll = async () => {
    try {
      const [sectionSnap, activitySnap] = await Promise.all([
        getDocs(collection(db, ACTIVITY_SECTIONS_COLLECTION)),
        getDocs(collection(db, ACTIVITIES_COLLECTION)),
      ]);
      let sectionList = sectionSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as HanayasaiActivitySection)
        .sort((a, b) => a.order - b.order);
      let activityList = activitySnap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as HanayasaiActivity
      );

      // 項目に属していない写真（項目機能の追加前の写真）を先頭の項目へ移す。
      // 項目が1つも無ければ「利用の様子」項目を作る
      const sectionIds = new Set(sectionList.map((s) => s.id));
      const orphans = activityList.filter(
        (a) => !a.sectionId || !sectionIds.has(a.sectionId)
      );
      if (orphans.length > 0) {
        const batch = writeBatch(db);
        let target = sectionList[0];
        if (!target) {
          const ref = doc(collection(db, ACTIVITY_SECTIONS_COLLECTION));
          target = { id: ref.id, title: LEGACY_SECTION_TITLE, order: 1, isPublished: true };
          batch.set(ref, {
            title: target.title,
            order: target.order,
            isPublished: target.isPublished,
            createdAt: serverTimestamp(),
          });
          sectionList = [target];
        }
        const orphanIds = new Set(orphans.map((a) => a.id));
        orphans.forEach((a) =>
          batch.update(doc(db, ACTIVITIES_COLLECTION, a.id), { sectionId: target.id })
        );
        await batch.commit();
        activityList = activityList.map((a) =>
          orphanIds.has(a.id) ? { ...a, sectionId: target.id } : a
        );
      }

      setSections(sectionList);
      setActivities(activityList);
    } catch (error) {
      console.error("利用の様子取得エラー:", error);
      alert("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    setAdding(true);
    try {
      const order = Math.max(0, ...sections.map((s) => s.order)) + 1;
      const ref = await addDoc(collection(db, ACTIVITY_SECTIONS_COLLECTION), {
        title,
        order,
        isPublished: true,
        createdAt: serverTimestamp(),
      });
      setSections((prev) => [...prev, { id: ref.id, title, order, isPublished: true }]);
      setNewTitle("");
    } catch (error) {
      console.error("項目追加エラー:", error);
      alert("項目の追加に失敗しました");
    } finally {
      setAdding(false);
    }
  };

  const handleSaveTitle = async (id: string, title: string) => {
    try {
      await updateDoc(doc(db, ACTIVITY_SECTIONS_COLLECTION, id), { title });
      setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
      alert("項目名を保存しました");
    } catch (error) {
      console.error("項目名保存エラー:", error);
      alert("保存に失敗しました");
    }
  };

  const handleToggleSectionPublish = async (section: HanayasaiActivitySection) => {
    try {
      await updateDoc(doc(db, ACTIVITY_SECTIONS_COLLECTION, section.id), {
        isPublished: !section.isPublished,
      });
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, isPublished: !s.isPublished } : s))
      );
    } catch (error) {
      console.error("公開設定エラー:", error);
      alert("公開設定の変更に失敗しました");
    }
  };

  // 隣の項目と並び順を入れ替え、全項目の order を 1 始まりの連番に振り直す
  const handleMoveSection = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;

    const reordered = [...sections];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    try {
      const batch = writeBatch(db);
      reordered.forEach((s, i) => {
        batch.update(doc(db, ACTIVITY_SECTIONS_COLLECTION, s.id), { order: i + 1 });
      });
      await batch.commit();
      setSections(reordered.map((s, i) => ({ ...s, order: i + 1 })));
    } catch (error) {
      console.error("並び替えエラー:", error);
      alert("並び替えに失敗しました");
    }
  };

  // 項目と、その項目の写真をまとめて削除する
  const handleDeleteSection = async (section: HanayasaiActivitySection) => {
    const photos = activities.filter((a) => a.sectionId === section.id);
    const message =
      photos.length > 0
        ? `項目「${section.title}」と、含まれる写真${photos.length}枚をすべて削除してもよろしいですか？\nこの操作は取り消せません。`
        : `項目「${section.title}」を削除してもよろしいですか？`;
    if (!confirm(message)) return;

    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, ACTIVITY_SECTIONS_COLLECTION, section.id));
      photos.forEach((a) => batch.delete(doc(db, ACTIVITIES_COLLECTION, a.id)));
      await batch.commit();
      setSections((prev) => prev.filter((s) => s.id !== section.id));
      setActivities((prev) => prev.filter((a) => a.sectionId !== section.id));
    } catch (error) {
      console.error("項目削除エラー:", error);
      alert("項目の削除に失敗しました");
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
                  TOPページ「体験」の下に表示される項目（見出し）と、各項目の写真・キャプションを管理します
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

        {loading ? (
          <p className="text-center text-gray-500 py-8">読み込み中...</p>
        ) : (
          <div className="space-y-6">
            {sections.length === 0 && (
              <p className="text-center text-gray-500 py-8 bg-white rounded-lg shadow-md">
                項目がまだありません。下のフォームから追加してください
              </p>
            )}
            {sections.map((section, index) => (
              <ActivitySectionCard
                key={section.id}
                section={section}
                photos={activities
                  .filter((a) => a.sectionId === section.id)
                  .sort((a, b) => a.order - b.order)}
                isFirst={index === 0}
                isLast={index === sections.length - 1}
                onSaveTitle={(title) => handleSaveTitle(section.id, title)}
                onTogglePublish={() => handleToggleSectionPublish(section)}
                onMove={(direction) => handleMoveSection(index, direction)}
                onDelete={() => handleDeleteSection(section)}
                onPhotosChange={setActivities}
                onReload={fetchAll}
              />
            ))}

            {/* 項目の追加 */}
            <form
              onSubmit={handleAddSection}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-green-300"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">項目を追加</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={adding}
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="例: 収穫体験の様子"
                />
                <button
                  type="submit"
                  disabled={adding || !newTitle.trim()}
                  className="flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  <AddIcon className="mr-1" />
                  {adding ? "追加中..." : "項目を追加"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
