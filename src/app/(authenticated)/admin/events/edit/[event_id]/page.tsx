"use client";

import { useParams } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params?.event_id as string;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <EditIcon className="text-green-600 mr-3" fontSize="large" />
              <h1 className="text-3xl font-bold text-gray-800">
                イベント編集
              </h1>
            </div>
            <Link
              href="/admin/events"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowBackIcon className="mr-1" />
              一覧に戻る
            </Link>
          </div>
        </div>

        {/* フォーム */}
        <EventForm mode="edit" eventId={eventId} />
      </div>
    </div>
  );
}
