"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ContactInfo from "@/components/fruitshatake/ContactInfo";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

type EventSummary = {
  id: string;
  title: string;
  date?: Timestamp;
  place?: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          });
        });
        setEvents(eventsList);
      } catch (error) {
        console.error("イベント取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full px-4">
      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        {/* イベント一覧 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
            <CalendarMonthIcon className="mr-2" />
            イベント一覧
          </h3>
          {loading ? (
            <p className="text-center text-gray-500">読み込み中...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500">
              現在、予定されているイベントはありません。
            </p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/fruitshatake/events/${event.id}`}
                  className="block bg-green-50 hover:bg-green-100 rounded-lg p-4 border-2 border-green-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-green-800 mb-2">
                        {event.title}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {event.date && (
                          <p className="flex items-center">
                            <CalendarMonthIcon
                              fontSize="small"
                              className="mr-1"
                            />
                            {event.date.toDate().toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "short",
                            })}
                          </p>
                        )}
                        {event.place && <p>会場: {event.place}</p>}
                      </div>
                    </div>
                    <div className="ml-4 text-green-600">
                      <span className="text-sm">詳細 →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-500">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">
            イベント参加について
          </h3>
          <p className="text-base mb-3">
            イベントの詳細や参加申し込みについては、お電話またはメールにてお問い合わせください。
          </p>
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}
