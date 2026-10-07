"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import ContactInfo from "@/components/hanayasai/ContactInfo";
import TopicLabel from "@/components/topicLabel";
import {
  EVENTS_COLLECTION,
  EVENT_TYPE_LABELS,
  formatEventDate,
  type HanayasaiEvent,
} from "@/lib/hanayasai";

export default function HanayasaiEventDetailPage() {
  const params = useParams();
  const eventId = params?.event_id as string | undefined;

  const [event, setEvent] = useState<HanayasaiEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const fetchEvent = async () => {
      try {
        const docSnap = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
        const data = docSnap.exists()
          ? ({ id: docSnap.id, ...docSnap.data() } as HanayasaiEvent)
          : null;
        setEvent(data?.isPublished ? data : null);
      } catch (error) {
        console.error("イベント取得エラー:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            イベントが見つかりませんでした。
          </p>
          <Link
            href="/hanayasai/events"
            className="text-green-600 hover:text-green-700 underline"
          >
            イベント一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <Link
          href="/hanayasai/events"
          className="inline-block text-green-700 hover:text-green-900 underline"
        >
          ← イベント一覧に戻る
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {event.coverImage && (
            <Image
              src={event.coverImage}
              alt={event.title}
              width={1200}
              height={800}
              sizes="(max-width: 896px) 100vw, 896px"
              className="w-full h-auto"
              priority
            />
          )}
          <div className="p-6 md:p-8">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                event.type === "report"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {EVENT_TYPE_LABELS[event.type]}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">
              {event.title}
            </h1>
            <div className="text-gray-700 space-y-1 mb-6">
              <p>
                📅 {formatEventDate(event.eventDate)}
                {event.timeRange && ` ${event.timeRange}`}
              </p>
              {event.place && <p>📍 {event.place}</p>}
            </div>
            {event.body && (
              <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap text-gray-800">
                {event.body}
              </div>
            )}
          </div>
        </article>

        {event.photos?.length > 0 && (
          <section>
            <TopicLabel title="写真" />
            <div className="grid gap-6 sm:grid-cols-2">
              {event.photos.map((photo, index) => (
                <figure
                  key={`${photo.url}-${index}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="relative w-full aspect-[4/3] bg-gray-100">
                    <Image
                      src={photo.url}
                      alt={photo.caption || `${event.title} ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 440px"
                      className="object-cover"
                    />
                  </div>
                  {photo.caption && (
                    <figcaption className="p-4 text-gray-700 whitespace-pre-wrap">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {event.type === "announcement" && (
          <section>
            <TopicLabel title="参加のお申し込み・お問い合わせ" />
            <ContactInfo />
          </section>
        )}
      </div>
    </div>
  );
}
