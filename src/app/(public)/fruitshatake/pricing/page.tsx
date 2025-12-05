"use client";

import TopicLabel from "@/components/topicLabel";
import ContactInfo from "@/components/fruitshatake/ContactInfo";

export default function PricingPage() {
  return (
    <div className="w-full px-4">
      <TopicLabel title="料金について" />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-300">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              10坪 野菜専用区画
            </h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-green-600">
                ¥5,000〜6,000
              </span>
              <span className="text-gray-600 ml-2">/ 月</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-400">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              10坪 果樹と野菜区画
            </h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-yellow-600">
                ¥6,000〜7,000
              </span>
              <span className="text-gray-600 ml-2">/ 月</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-400">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              20坪 果樹と野菜区画
            </h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-yellow-600">
                ¥12,000〜14,000
              </span>
              <span className="text-gray-600 ml-2">/ 月</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-400">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎉</span>
            <h3 className="text-xl font-bold text-orange-800">
              お得な3年契約プラン
            </h3>
          </div>
          <p className="text-lg font-semibold text-orange-700 mb-3">
            3年契約で、1年あたり12,000円の割引
          </p>
          <div className="bg-white bg-opacity-70 rounded-lg p-4">
            <p className="text-base text-gray-700">
              長期でじっくり果樹や野菜づくりに取り組みたい方におすすめです。
              <br />
              1年間契約と比べて、3年間で合計36,000円もお得になります。
            </p>
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
