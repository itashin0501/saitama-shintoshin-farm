"use client";

import TopicLabel from "@/components/topicLabel";
import ContactInfo from "@/components/hanayasai/ContactInfo";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
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

export default function FAQPage() {
  const faqs = [
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
  ];

  return (
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
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-blue-800 mb-3">
            その他のご質問
          </h3>
          <p className="text-base mb-4">
            上記以外のご質問や詳細については、お電話またはメールにてお気軽にお問い合わせください。
          </p>
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}
