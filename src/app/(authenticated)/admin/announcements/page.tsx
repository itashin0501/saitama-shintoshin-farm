"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  publishedAt?: Timestamp;
  isPublished: boolean;
};

export default function AnnouncementsAdminPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const q = query(
        collection(db, "announcements"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const announcementList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Announcement[];
      setAnnouncements(announcementList);
    } catch (error) {
      console.error("お知らせ取得エラー:", error);
      alert("お知らせの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    announcementId: string,
    announcementTitle: string
  ) => {
    if (!confirm(`「${announcementTitle}」を削除してもよろしいですか？`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "announcements", announcementId));
      alert("お知らせを削除しました");
      fetchAnnouncements();
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 戻るリンク */}
      <Link
        href="/admin"
        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowBackIcon className="mr-1" fontSize="small" />
        管理画面TOPへ戻る
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">お知らせ管理</h1>
        <Link
          href="/admin/announcements/new"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + 新規作成
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">お知らせがまだありません</p>
          <Link
            href="/admin/announcements/new"
            className="text-green-600 hover:text-green-700 underline"
          >
            最初のお知らせを作成する
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  公開日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {announcement.isPublished ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        公開中
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        下書き
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {announcement.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {announcement.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {announcement.createdAt
                      .toDate()
                      .toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {announcement.publishedAt
                      ? announcement.publishedAt
                          .toDate()
                          .toLocaleDateString("ja-JP")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/announcements/edit/${announcement.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(announcement.id, announcement.title)
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
