"use client";

import TopicLabel from "@/components/topicLabel";

export default function FacilitiesPage() {
  return (
    <div className="w-full px-4">
      <TopicLabel title="設備について" />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="bg-green-100 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            充実した設備
          </h2>
          <p className="text-lg leading-relaxed">
            農機具や井戸が完備されています。
            <br />
            初心者の方もお気軽にご利用可能です。
            <br />
            十分な広さの駐車スペースもご用意しております。
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-green-800 mb-4">主な設備</h3>
          <ul className="space-y-3 text-lg">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>農機具完備（鍬、スコップ、その他栽培に必要な道具）</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>井戸水利用可能</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>広々とした駐車スペース</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>休憩スペース</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            プライベートパーク利用
          </h3>
          <p className="text-lg leading-relaxed mb-4">
            リモートワークの合間に農作業、お友達と収穫物でピザパーティーも開催できます。
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-base">
              ご契約者様以外のご利用も可能です。
              <br />
              <a
                href="https://www.spacemarket.com/spaces/fruitshatake/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 font-semibold"
              >
                SpaceMarket
              </a>
              からご予約ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
