"use client";

import TopicLabel from "@/components/topicLabel";
import Schedule from "@/components/Schedule";
import ContactInfo from "@/components/fruitshatake/ContactInfo";

export default function EventsPage() {
  return (
    <div className="w-full px-4">
      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <TopicLabel title="スケジュール" />
        <div className="flex justify-center mb-8">
          <Schedule className="w-full max-w-[800px]" />
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
