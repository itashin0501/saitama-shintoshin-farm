"use client";

import { useEffect, useState } from "react";

interface CalendarEvent {
  uid: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
}

interface ScheduleProps {
  className?: string;
}

export default function Schedule({ className = "" }: ScheduleProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/calendar");
        const data = await response.json();

        if (data.success) {
          setEvents(data.events);
        } else {
          setError("イベントの取得に失敗しました");
        }
      } catch (err) {
        setError("イベントの取得に失敗しました");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Format in Japan timezone using toLocaleString
    const jstDate = date.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    
    // Parse the formatted string to extract parts
    const parts = jstDate.match(/(\d{1,2})\/(\d{1,2}) \((.)\) (\d{2}):(\d{2})/);
    
    if (parts) {
      return {
        month: parts[1],
        day: parts[2],
        weekday: parts[3],
        time: `${parts[4]}:${parts[5]}`,
      };
    }
    
    // Fallback if parsing fails
    return {
      month: (date.getMonth() + 1).toString(),
      day: date.getDate().toString(),
      weekday: ["日", "月", "火", "水", "木", "金", "土"][date.getDay()],
      time: `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`,
    };
  };

  if (loading) {
    return (
      <div className={`bg-green-100 rounded-xl p-4 mt-4 ${className}`}>
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-gray-600">
            スケジュールを読み込み中...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-green-100 rounded-xl p-4 mt-4 ${className}`}>
        <div className="text-center py-8">
          <div className="text-lg text-red-600 mb-2">{error}</div>
          <div className="text-sm text-gray-600">
            しばらく時間をおいてから再度お試しください
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={`bg-green-100 rounded-xl p-4 mt-4 ${className}`}>
        <div className="text-center py-8">
          <div className="text-lg text-gray-700">
            現在、予定されているイベントはありません
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-green-100 rounded-xl p-4 mt-4 ${className}`}>
      <div className="space-y-4">
        {events.map((event) => {
          const startDate = formatDate(event.start);
          const endDate = formatDate(event.end);

          return (
            <div key={event.uid} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-center">
                  <div className="bg-green-600 text-white rounded-lg px-3 py-2 min-w-[60px]">
                    <div className="text-sm font-bold">
                      {startDate.month}/{startDate.day}
                    </div>
                    <div className="text-xs">({startDate.weekday})</div>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {event.summary}
                  </h3>

                  <div className="text-sm text-gray-600 mb-2">
                    {startDate.time}
                    {endDate.time !== startDate.time && (
                      <>
                        {" - "}
                        {startDate.day === endDate.day
                          ? endDate.time
                          : `${endDate.month}/${endDate.day} ${endDate.time}`}
                      </>
                    )}
                  </div>

                  {event.location && (
                    <div className="text-sm text-gray-600 mb-2">
                      📍 {event.location}
                    </div>
                  )}

                  {event.description && (
                    <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                      {event.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
