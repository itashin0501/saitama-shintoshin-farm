"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventDetail, { type Event } from "@/components/EventDetail";

export default function EventDatePage() {
  const params = useParams();
  const date = params?.event_date;

  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!date) return;
    const fetchEvent = async () => {
      const docRef = doc(db, "events", date as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEvent(docSnap.data() as Event);
      } else {
        setEvent(null);
      }
    };
    fetchEvent();
  }, [date]);

  return (
    <EventDetail
      event={event}
      eventId={date as string}
      showRegistrationForm={false}
    />
  );
}
