"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type EventSummary = {
  id: string;
  title: string;
  date?: Timestamp;
  place?: string;
  flyerImage?: string;
};

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const eventsQuery = query(
        collection(db, "events"),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(eventsQuery);
      const eventsList: EventSummary[] = [];
      querySnapshot.forEach((doc) => {
        eventsList.push({
          id: doc.id,
          title: doc.data().title,
          date: doc.data().date,
          place: doc.data().place,
          flyerImage: doc.data().flyerImage,
        });
      });
      setEvents(eventsList);
    } catch (error) {
      console.error("イベント取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (
      !confirm(
        `「${eventTitle}」を削除してもよろしいですか？\nこの操作は取り消せません。`
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "events", eventId));
      alert("イベントを削除しました");
      fetchEvents(); // リストを更新
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 戻るリンク */}
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowBackIcon className="mr-1" fontSize="small" />
          管理画面TOPへ戻る
        </Link>

        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <EventIcon className="text-green-600 mr-3" fontSize="large" />
              <h1 className="text-3xl font-bold text-gray-800">
                イベント管理
              </h1>
            </div>
            <Link
              href="/admin/events/new"
              className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <AddIcon className="mr-2" />
              新規イベント作成
            </Link>
          </div>
        </div>

        {/* イベント一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            登録済みイベント一覧
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 py-8">読み込み中...</p>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                イベントがまだ登録されていません
              </p>
              <Link
                href="/admin/events/new"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
              >
                <AddIcon className="mr-1" />
                最初のイベントを作成する
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* チラシ画像サムネイル */}
                        {event.flyerImage && (
                          <div className="flex-shrink-0">
                            <img
                              src={event.flyerImage}
                              alt={event.title}
                              className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                          </div>
                        )}

                        {/* イベント情報 */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {event.title}
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            {event.date && (
                              <p>
                                📅{" "}
                                {event.date.toDate().toLocaleDateString("ja-JP", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  weekday: "short",
                                })}
                              </p>
                            )}
                            {event.place && <p>📍 {event.place}</p>}
                            <p className="text-xs text-gray-400">
                              ID: {event.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Link
                        href={`/fruitshatake/events/${event.id}`}
                        target="_blank"
                        className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        <VisibilityIcon fontSize="small" className="mr-1" />
                        プレビュー
                      </Link>
                      <Link
                        href={`/admin/events/edit/${event.id}`}
                        className="flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        <EditIcon fontSize="small" className="mr-1" />
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        <DeleteIcon fontSize="small" className="mr-1" />
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 参加申し込み一覧へのリンク */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <Link
            href="/admin/event-registrations"
            className="flex items-center text-blue-700 hover:text-blue-800 font-semibold"
          >
            <EventIcon className="mr-2" />
            イベント参加申し込み一覧を見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
