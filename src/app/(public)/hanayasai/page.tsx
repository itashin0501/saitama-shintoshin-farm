"use client";

import { useState } from "react";
import MessageBoard from "@/components/messageBoard";
import Toptitle from "@/components/hanayasai/topTitle";
import TopicLabel from "@/components/topicLabel";
import Image from "next/image";
import { introdution, access, experience } from "@/contents/messages";
import MessageBoardY from "@/components/messageBoardY";
import ContactInfo from "@/components/hanayasai/ContactInfo";

type TabType = "experience" | "pricing" | "faq" | "access";
const linkStyle =
  "hover:text-blue-300 transition-colors bg-[url(/images/linkbk.png)] bg-[length:100%_100%] bg-center bg-no-repeat px-5 mx-8 py-2 block";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("experience");

  const tabs = [
    { id: "experience" as TabType, label: "体験" },
    { id: "pricing" as TabType, label: "金額" },
    { id: "faq" as TabType, label: "よくある質問" },
    { id: "access" as TabType, label: "アクセス" },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-8">
        <Toptitle />
        <div className="bg-green-100 rounded-xl p-4 mt-4 w-[400px] lg:w-[800px]">
          <pre className="text-lg whitespace-pre-wrap">{introdution}</pre>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="flex justify-center mb-8">
        <div className={linkStyle}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
                activeTab === tab.id ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* タブコンテンツ */}
      {activeTab === "experience" && (
        <>
          <TopicLabel title="体験" />
          <div className="flex justify-center mb-8">
            <div className="mt-4 grid gap-8 lg:max-w-[900px] xl:max-w-[1300px] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              <MessageBoard title="えらぶ" text={experience.make}>
                <Image
                  src="/images/taiken-1.png"
                  width={480 / 2}
                  height={200 / 2}
                  alt={"taiken-1"}
                />
              </MessageBoard>
              <MessageBoard title="あそぶ" text={experience.play}>
                <Image
                  src="/images/taiken-2.png"
                  width={350 / 2.5}
                  height={220 / 2.5}
                  alt={"taiken-2"}
                  className="relative left-20 -top-16 xs:top-0"
                />
              </MessageBoard>
              <MessageBoard title="まなぶ" text={experience.learn}>
                <Image
                  src="/images/taiken-3.png"
                  width={400 / 1.7}
                  height={169 / 1.7}
                  alt={"taiken-3"}
                  className="relative -top-4 xs:top-0"
                />
              </MessageBoard>
              <MessageBoardY
                title="充実した設備をご用意しております"
                text={experience.facility}
              >
                <Image
                  src="/images/taiken-4.png"
                  width={284 / 2}
                  height={204 / 2}
                  alt={"taiken-4"}
                  className="relative -top-8 xs:top-2 left-16"
                />
              </MessageBoardY>
              <MessageBoardY
                title="プライベートパーク利用"
                text={experience.privatePark}
              >
                <Image
                  src="/images/remotework.jpg"
                  width={640 / 4}
                  height={480 / 4}
                  alt={"taiken-5"}
                  className="rounded-lg"
                />
              </MessageBoardY>
            </div>
          </div>
        </>
      )}

      {activeTab === "pricing" && (
        <div className="w-full px-4">
          <TopicLabel title="料金について" />
          <div className="max-w-4xl mx-auto mt-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-300">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  10坪区画
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-yellow-600">
                    ¥6,000
                  </span>
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
            </div>
          </div>
        </div>
      )}

      {activeTab === "faq" && (
        <div className="w-full px-4">
          <TopicLabel title="よくある質問" />
          <div className="max-w-4xl mx-auto mt-8 space-y-8">
            <div className="bg-yellow-100 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4">FAQ</h2>
              <p className="text-lg leading-relaxed">
                花野菜農園に関するよくある質問をまとめました。
                <br />
                その他のご質問がございましたら、お気軽にお問い合わせください。
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "農業の経験がなくても大丈夫ですか?",
                  answer:
                    "大丈夫です。初心者の方も安心してご利用いただけます。畑の先輩から土作りや肥料、育て方を教えてもらえますので、お気軽に始めていただけます。",
                },
                {
                  question: "どのような野菜やお花を育てられますか?",
                  answer:
                    "手入れの楽な、じゃが芋、サトイモ、さつま芋、カボチャなど、日常野菜の人参、長ネギ、玉ねぎ、ナス、キュウリ、トマトや葉物野菜の小松菜、水菜、白菜、チンゲン菜、春菊、ハーブ系のバジル、大葉、パセリ、セージ、ローズマリー等、ヨーロッパ野菜等。お花は、ビオラ、パンジー、マリーゴールド、ナスタチウム、キンレンカなど、サラダのトッピングにお洒落です。",
                },
                {
                  question: "農機具は借りられますか?",
                  answer:
                    "無料農機具：鍬、鋤、レーキ、三角ホー、スコップなど、栽培に必要な農機具は完備されていますので、手ぶらで来園できます。有料農機具：農作業が楽になる草刈り機と耕運機を、各々1回1,000円でレンタルいたします。",
                },
                {
                  question: "水やりはどうすればいいですか?",
                  answer:
                    "園内に井戸が完備されており、自由に水を使うことができます。ジョウロもご用意していますので、ご自由にご利用ください。",
                },
                {
                  question: "車で行けますか?駐車場はありますか?",
                  answer:
                    "はい。十分な広さの駐車スペースをご用意しております。お車でお越しいただけます。首都高5号線「さいたま見沼IC」から3分前後と近いです。",
                },
                {
                  question: "いつでも畑に行けますか?",
                  answer:
                    "ご契約者様はいつでも畑にお越しいただけます。ただし、イベント開催時など一部制限がある場合もまれにございます。ご契約時に「畑利用の仕方」説明書をご用意しています。",
                },
                {
                  question: "友人や家族と一緒に利用できますか?",
                  answer:
                    "はい、賢いご利用方法は「二人で借りれば費用と苦労が半分、お友達を呼んでランチ会など企画すれば、楽しみは2倍3倍になります」。もちろん、ご自分達だけでマイファーム時間を楽しむこともできます。",
                },
                {
                  question: "契約期間はどれくらいですか?",
                  answer:
                    "基本的には年間契約となります。入園時の契約書は年度毎にご利用料金をお支払いただければ自動更新となります。途中解約の場合でもご返金はできませんのでご了承ください。詳しい料金プランについては料金ページをご覧いただくか、直接お問い合わせください。",
                },
                {
                  question: "芝生広場を貸切利用できますか?",
                  answer:
                    "はい、農園ご契約者様は格安でご利用いただけます。ご契約者様以外はビジター料金でご利用いただけます。ご利用方法は直接お問い合わせください。ご利用の参考としては：ご家族や友人・知人を招いてBBQやピザパーティ、ママ友ランチ会、アフタヌーンティー会、「畑の居酒屋会」、屋外作品展示会、CM/MV撮影、お花見会、花火鑑賞会、秋の収穫祭、キッチンカー、フリーマーケットなど。",
                },
                {
                  question: "イベントには参加必須ですか?",
                  answer:
                    "いいえ、イベント参加は任意です。むしろ、ご自分で企画して「マイイベント」を、農園で楽しめればお友達もよろこぶでしょう!",
                },
              ].map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "access" && (
        <>
          <TopicLabel title="アクセス" />
          <div className="flex flex-col mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2565.0407512517363!2d139.660448891735!3d35.89113519827244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c1a19204a663%3A0xbdfb95dfe12b7a01!2z6Iqx6YeO6I-c6L6y5ZyS!5e0!3m2!1sja!2sjp!4v1741101175985!5m2!1sja!2sjp"
              className="w-full h-[420px] border-2 border-gray-300 rounded-lg"
              loading="lazy"
            />
            <div className="w-full text-lg bg-green-100 rounded-xl p-4 mt-4">
              <pre className="text-lg text-left">{access.address}</pre>
              <pre className="text-sm xs:text-lg text-left mt-2">
                {access.byCar}
              </pre>
              <pre className="text-sm xs:text-lg whitespace-pre-wrap text-left mt-2">
                {access.byTrain}
              </pre>
            </div>
          </div>
        </>
      )}

      <div className="w-full px-4 mt-8">
        <TopicLabel title="お問い合わせ" />

        <ContactInfo />
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 hover:bg-yellow-50 transition-colors flex justify-between items-center"
      >
        <span className="text-lg font-semibold text-gray-800 pr-4">
          {question}
        </span>
        <span
          className={`text-2xl text-yellow-600 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="p-6 pt-0 text-gray-700 leading-relaxed border-t border-gray-100">
          {answer}
        </div>
      )}
    </div>
  );
}
