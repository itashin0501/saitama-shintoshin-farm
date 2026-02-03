"use client";

import TopicLabel from "@/components/topicLabel";
import ContactInfo from "@/components/hanayasai/ContactInfo";

export default function PricingPage() {
  return (
    <div className="w-full px-4">
      <TopicLabel title="料金について" />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-300">
            <h3 className="text-xl font-bold text-green-800 mb-4">10坪区画</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-yellow-600">¥6,000</span>
              <span className="text-gray-600 ml-2">/ 月</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-blue-800 mb-3">
            お支払いについて
          </h3>
          <ul className="space-y-2 text-base">
            <li>• 年間契約となります</li>
            <li>• お支払い方法: 現金、銀行振込</li>
            <li>• 途中解約の場合、返金はございません</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            詳細・お申し込み
          </h3>
          <p className="text-lg mb-4">
            料金の詳細やお申し込みについては、お気軽にお問い合わせください。
          </p>
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}
