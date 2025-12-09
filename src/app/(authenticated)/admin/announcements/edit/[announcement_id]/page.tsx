"use client";
import { use } from "react";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export default function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ announcement_id: string }>;
}) {
  const { announcement_id } = use(params);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">お知らせ編集</h1>
      <AnnouncementForm mode="edit" announcementId={announcement_id} />
    </div>
  );
}
