"use client";

import TopicLabel from "@/components/topicLabel";
import ContactForm from "@/components/fruitshatake/ContactForm";

export default function ContactPage() {
  return (
    <div className="w-full px-4">
      <TopicLabel title="お問い合わせ" />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="bg-green-100 rounded-xl p-6">
          <p className="text-lg leading-relaxed">
            フルーツとやさい畑に関するご質問やご相談は、下記のフォームにてお気軽にお問い合わせください。
            <br />
            担当者より折り返しご連絡させていただきます。
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
