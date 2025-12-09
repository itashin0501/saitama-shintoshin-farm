"use client";
import Link from "next/link";
import EventIcon from "@mui/icons-material/Event";
import CampaignIcon from "@mui/icons-material/Campaign";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function AdminDashboard() {
  const menuItems = [
    {
      title: "イベント管理",
      description: "イベントの作成、編集、削除が行えます",
      icon: <EventIcon className="text-4xl" />,
      href: "/admin/events",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      title: "お知らせ管理",
      description: "お知らせの作成、編集、削除が行えます",
      icon: <CampaignIcon className="text-4xl" />,
      href: "/admin/announcements",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DashboardIcon className="text-gray-700" fontSize="large" />
          <h1 className="text-3xl font-bold text-gray-800">管理画面</h1>
        </div>
        <p className="text-gray-600">
          各種コンテンツの管理を行うことができます
        </p>
      </div>

      {/* メニューカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
              {/* アイコンヘッダー */}
              <div
                className={`${item.color} ${item.hoverColor} text-white p-6 transition-colors duration-300`}
              >
                <div className="flex items-center justify-center">
                  {item.icon}
                </div>
              </div>

              {/* コンテンツ */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm">{item.description}</p>

                {/* 矢印アイコン */}
                <div className="mt-4 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  管理画面へ
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* フッター情報 */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          管理画面の使い方
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            各カードをクリックすると、対応する管理画面に移動します
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            イベントやお知らせの作成・編集・削除が行えます
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            変更内容は即座に公開サイトに反映されます
          </li>
        </ul>
      </div>
    </div>
  );
}
