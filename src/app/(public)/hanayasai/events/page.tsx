"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import TopicLabel from "@/components/topicLabel";
import ContactInfo from "@/components/hanayasai/ContactInfo";
import {
  EVENTS_COLLECTION,
  formatEventDate,
  isUpcoming,
  type HanayasaiEvent,
} from "@/lib/hanayasai";

const dateValue = (e: HanayasaiEvent) =>
  e.eventDate?.toMillis() ?? Number.MAX_SAFE_INTEGER;

export default function HanayasaiEventsPage() {
  const [events, setEvents] = useState<HanayasaiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, EVENTS_COLLECTION),
            where("isPublished", "==", true)
          )
        );
        setEvents(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as HanayasaiEvent
          )
        );
      } catch (error) {
        console.error("イベント取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 告知は開催日が近い順（終了したものは非表示）、レポートは新しい順
  const announcements = events
    .filter((e) => e.type === "announcement" && isUpcoming(e.eventDate))
    .sort((a, b) => dateValue(a) - dateValue(b));
  const reports = events
    .filter((e) => e.type === "report")
    .sort((a, b) => (b.eventDate?.toMillis() ?? 0) - (a.eventDate?.toMillis() ?? 0));

  return (
    <div className="w-full px-4">
      <div className="max-w-5xl mx-auto mt-8 space-y-10">
        <Link
          href="/hanayasai"
          className="inline-block text-green-700 hover:text-green-900 underline"
        >
          ← 花野菜農園TOPへ戻る
        </Link>

        <section>
          <TopicLabel title="イベントのお知らせ" />
          {loading ? (
            <p className="text-center text-gray-500">読み込み中...</p>
          ) : announcements.length === 0 ? (
            <p className="text-center text-gray-500 bg-white rounded-xl p-6">
              現在、予定されているイベントはありません。
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {announcements.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        <section>
          <TopicLabel title="イベントレポート" />
          {loading ? (
            <p className="text-center text-gray-500">読み込み中...</p>
          ) : reports.length === 0 ? (
            <p className="text-center text-gray-500 bg-white rounded-xl p-6">
              レポートはまだありません。
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        <section>
          <TopicLabel title="お問い合わせ" />
          <ContactInfo />
        </section>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: HanayasaiEvent }) {
  const thumbnail = event.coverImage || event.photos?.[0]?.url;

  return (
    <Link
      href={`/hanayasai/events/${event.id}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
    >
      {thumbnail && (
        <div className="relative w-full aspect-[4/3] bg-gray-100">
          <Image
            src={thumbnail}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">
          📅 {formatEventDate(event.eventDate)}
          {event.timeRange && ` ${event.timeRange}`}
        </p>
        <h3 className="text-lg font-bold text-green-800 group-hover:text-green-600 transition-colors">
          {event.title}
        </h3>
        {event.body && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {event.body}
          </p>
        )}
        <p className="text-sm text-green-600 font-semibold mt-3">
          詳しく見る →
        </p>
      </div>
    </Link>
  );
}
