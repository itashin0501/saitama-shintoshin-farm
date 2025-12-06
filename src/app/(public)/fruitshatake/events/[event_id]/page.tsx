"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventDetail, { type Event } from "@/components/EventDetail";
import Link from "next/link";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.event_id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", eventId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent(docSnap.data() as Event);
        } else {
          setEvent(null);
        }
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
            href="/fruitshatake/events"
            className="text-green-600 hover:text-green-700 underline"
          >
            イベント一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EventDetail
      event={event}
      eventId={eventId as string}
      showLogo={false}
      showRegistrationForm={true}
    />
  );
}
