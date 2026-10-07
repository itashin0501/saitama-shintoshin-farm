import { Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const ACTIVITIES_COLLECTION = "hanayasaiActivities";
export const EVENTS_COLLECTION = "hanayasaiEvents";

// TOPページ「利用の様子」の写真
export type HanayasaiActivity = {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
  isPublished: boolean;
  createdAt?: Timestamp;
};

export type HanayasaiEventType = "announcement" | "report";

export const EVENT_TYPE_LABELS: Record<HanayasaiEventType, string> = {
  announcement: "告知",
  report: "レポート",
};

export type EventPhoto = {
  url: string;
  caption: string;
};

export type HanayasaiEvent = {
  id: string;
  type: HanayasaiEventType;
  title: string;
  eventDate: Timestamp | null;
  timeRange: string;
  place: string;
  body: string;
  coverImage: string;
  photos: EventPhoto[];
  isPublished: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export async function uploadHanayasaiImage(
  file: File,
  folder: "activities" | "events"
): Promise<string> {
  const storageRef = ref(
    storage,
    `hanayasai/${folder}/${Date.now()}_${file.name}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// "YYYY-MM-DD" をローカルタイムの日付として扱う（UTC解釈による日付ずれを防ぐ）
export function dateInputToTimestamp(value: string): Timestamp | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return Timestamp.fromDate(new Date(y, m - 1, d));
}

export function timestampToDateInput(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  const date = ts.toDate();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatEventDate(ts: Timestamp | null | undefined): string {
  if (!ts) return "日程未定";
  return ts.toDate().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function isUpcoming(ts: Timestamp | null | undefined): boolean {
  if (!ts) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return ts.toDate() >= today;
}
