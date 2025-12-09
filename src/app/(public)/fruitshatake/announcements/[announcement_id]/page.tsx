"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LogoImage from "@/components/fruitshatake/logoImage";

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  publishedAt?: Timestamp;
  isPublished: boolean;
};

export default function AnnouncementDetailPage() {
  const params = useParams();
  const announcementId = params?.announcement_id as string;
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!announcementId) return;

      try {
        const docRef = doc(db, "announcements", announcementId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAnnouncement({
            id: docSnap.id,
            ...data,
          } as Announcement);
        }
      } catch (error) {
        console.error("お知らせの取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [announcementId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!announcement || !announcement.isPublished) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            お知らせが見つかりませんでした。
          </p>
          <Link
            href="/fruitshatake"
            className="text-green-600 hover:text-green-700 underline"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ロゴ */}
      <div className="container mx-auto px-4 pt-4">
        <LogoImage />
      </div>

      {/* コンテンツ */}
      <div className="container mx-auto px-4 py-8">
        {/* 戻るリンク */}
        <Link
          href="/fruitshatake"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowBackIcon className="mr-1" fontSize="small" />
          トップページに戻る
        </Link>

        {/* お知らせカード */}
        <article className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-4xl mx-auto">
          {/* 日付 */}
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <AccessTimeIcon fontSize="small" />
            <time className="text-sm">
              {announcement.publishedAt
                ?.toDate()
                .toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </time>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b-4 border-green-500 pb-4">
            {announcement.title}
          </h1>

          {/* 本文 */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {announcement.content}
            </p>
          </div>

          {/* フッター */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/fruitshatake"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              <ArrowBackIcon className="mr-1" fontSize="small" />
              お知らせ一覧に戻る
            </Link>
          </div>
        </article>

        {/* お問い合わせへのリンク */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-3">
            ご不明な点がございましたら、お気軽にお問い合わせください
          </p>
          <Link
            href="/fruitshatake/contact"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  );
}
