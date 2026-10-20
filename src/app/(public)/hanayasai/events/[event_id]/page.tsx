"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import ContactInfo from "@/components/hanayasai/ContactInfo";
import TopicLabel from "@/components/topicLabel";
import Lightbox, { type LightboxImage } from "@/components/hanayasai/Lightbox";
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  // ライトボックスではメイン画像 → 写真の順に送れるようにする
  const photos = event.photos ?? [];
  const coverOffset = event.coverImage ? 1 : 0;
  const lightboxImages: LightboxImage[] = [
    ...(event.coverImage ? [{ src: event.coverImage, alt: event.title }] : []),
    ...photos.map((photo, i) => ({
      src: photo.url,
      caption: photo.caption,
      alt: photo.caption || `${event.title} ${i + 1}`,
    })),
  ];

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
            <button
              type="button"
              onClick={() => setOpenIndex(0)}
              className="block w-full cursor-zoom-in"
              aria-label="メイン画像を拡大表示"
            >
              <Image
                src={event.coverImage}
                alt={event.title}
                width={1200}
                height={800}
                sizes="(max-width: 896px) 100vw, 896px"
                className="w-full h-auto"
                priority
              />
            </button>
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

        {photos.length > 0 && (
          <section>
            <TopicLabel title="写真" />
            <p className="text-sm text-gray-600 mb-3">
              写真をタップすると大きく表示されます
            </p>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
              {photos.map((photo, index) => (
                <figure
                  key={`${photo.url}-${index}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(coverOffset + index)}
                    className="relative block w-full aspect-[4/3] bg-gray-100 cursor-zoom-in group"
                    aria-label={`${photo.caption || `写真 ${index + 1}`}を拡大表示`}
                  >
                    <Image
                      src={photo.thumbnailUrl || photo.url}
                      alt={photo.caption || `${event.title} ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 290px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                  {photo.caption && (
                    <figcaption className="p-3 text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        <Lightbox
          images={lightboxImages}
          index={openIndex}
          onIndexChange={setOpenIndex}
        />

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
