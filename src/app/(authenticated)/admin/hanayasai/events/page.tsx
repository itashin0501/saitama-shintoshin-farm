"use client";

import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  EVENTS_COLLECTION,
  EVENT_TYPE_LABELS,
  formatEventDate,
  isUpcoming,
  type HanayasaiEvent,
} from "@/lib/hanayasai";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function HanayasaiEventsAdminPage() {
  const [events, setEvents] = useState<HanayasaiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, EVENTS_COLLECTION));
      setEvents(
        snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }) as HanayasaiEvent)
          .sort(
            (a, b) =>
              (b.eventDate?.toMillis() ?? Number.MAX_SAFE_INTEGER) -
              (a.eventDate?.toMillis() ?? Number.MAX_SAFE_INTEGER)
          )
      );
    } catch (error) {
      console.error("イベント取得エラー:", error);
      alert("イベントの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (event: HanayasaiEvent) => {
    if (
      !confirm(
        `「${event.title}」を削除してもよろしいですか？\nこの操作は取り消せません。`
      )
    ) {
      return;
    }
    try {
      await deleteDoc(doc(db, EVENTS_COLLECTION, event.id));
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
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
              <EventIcon className="text-green-600 mr-3" fontSize="large" />
              <h1 className="text-3xl font-bold text-gray-800">
                花野菜農園 イベント管理
              </h1>
            </div>
            <Link
              href="/admin/hanayasai/events/new"
              className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <AddIcon className="mr-2" />
              告知・レポートを作成
            </Link>
          </div>
        </div>

        {/* 一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">登録済み一覧</h2>

          {loading ? (
            <p className="text-center text-gray-500 py-8">読み込み中...</p>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">まだ登録されていません</p>
              <Link
                href="/admin/hanayasai/events/new"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
              >
                <AddIcon className="mr-1" />
                最初の告知を作成する
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const thumbnail = event.coverImage || event.photos?.[0]?.url;
                const ended =
                  event.type === "announcement" && !isUpcoming(event.eventDate);
                return (
                  <div
                    key={event.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors flex items-start gap-4"
                  >
                    {thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt={event.title}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            event.type === "report"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {EVENT_TYPE_LABELS[event.type]}
                        </span>
                        {event.isPublished ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            公開中
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
                            下書き
                          </span>
                        )}
                        {ended && (
                          <span
                            className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"
                            title="開催日を過ぎた告知は公開ページの一覧に表示されません"
                          >
                            開催終了（一覧に非表示）
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📅 {formatEventDate(event.eventDate)}
                        {event.photos?.length > 0 &&
                          ` ・ 写真 ${event.photos.length}枚`}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/hanayasai/events/${event.id}`}
                        target="_blank"
                        className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        <VisibilityIcon fontSize="small" className="mr-1" />
                        表示
                      </Link>
                      <Link
                        href={`/admin/hanayasai/events/edit/${event.id}`}
                        className="flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        <EditIcon fontSize="small" className="mr-1" />
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(event)}
                        className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors text-sm"
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
    </div>
  );
}
