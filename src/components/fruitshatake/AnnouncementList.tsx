"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CampaignIcon from "@mui/icons-material/Campaign";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  publishedAt?: Timestamp;
  isPublished: boolean;
};

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(
          collection(db, "announcements"),
          orderBy("publishedAt", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const announcementList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Announcement[];

        // 公開されているもののみをフィルタ
        const publishedAnnouncements = announcementList.filter(a => a.isPublished);
        setAnnouncements(publishedAnnouncements);
      } catch (error) {
        console.error("お知らせの取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <CampaignIcon className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">お知らせ</h2>
        </div>
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <CampaignIcon className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">お知らせ</h2>
        </div>
        <p className="text-gray-500">現在お知らせはありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <CampaignIcon className="text-green-600" fontSize="large" />
        <h2 className="text-2xl font-bold text-gray-800">お知らせ</h2>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="border-l-4 border-green-500 pl-4 py-3 hover:bg-green-50 transition-colors"
          >
            <div className="flex items-start gap-2 mb-2">
              <AccessTimeIcon className="text-gray-400 text-sm mt-1" fontSize="small" />
              <span className="text-sm text-gray-500">
                {announcement.publishedAt?.toDate().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {announcement.title}
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
