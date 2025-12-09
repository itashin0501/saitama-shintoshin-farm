"use client";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export default function NewAnnouncementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        お知らせ新規作成
      </h1>
      <AnnouncementForm mode="create" />
    </div>
  );
}
