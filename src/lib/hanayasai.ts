import { Timestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { MAX_UPLOAD_BYTES } from "@/lib/uploadLimits";

export const ACTIVITIES_COLLECTION = "hanayasaiActivities";
export const EVENTS_COLLECTION = "hanayasaiEvents";

// TOPページ「利用の様子」の写真
export type HanayasaiActivity = {
  id: string;
  imageUrl: string;
  // サムネイル追加前に登録された写真には無い
  thumbnailUrl?: string;
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
  thumbnailUrl?: string;
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
  coverThumbnail?: string;
  photos: EventPhoto[];
  isPublished: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

// 一覧用の画像。メイン画像 → 1枚目の写真の順に、サムネイルが無ければ元画像を使う
export function eventThumbnail(event: HanayasaiEvent): string | undefined {
  if (event.coverImage) return event.coverThumbnail || event.coverImage;
  const first = event.photos?.[0];
  return first ? first.thumbnailUrl || first.url : undefined;
}

export type UploadedImage = {
  url: string; // 表示用（長辺 1920px）
  thumbnailUrl: string; // 一覧用（長辺 600px）
};

// サーバー（/api/hanayasai/upload）で表示用とサムネイルを生成して Storage に保存する
export async function uploadHanayasaiImage(
  file: File,
  folder: "activities" | "events"
): Promise<UploadedImage> {
  const user = auth.currentUser;
  if (!user) throw new Error("ログインが必要です");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name} は20MBを超えています`);
  }

  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  const res = await fetch("/api/hanayasai/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${await user.getIdToken()}` },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `${file.name} のアップロードに失敗しました`);
  }
  return data as UploadedImage;
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
