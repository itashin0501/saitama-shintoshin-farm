"use client";

import TopicLabel from "@/components/topicLabel";
import ContactInfo from "@/components/fruitshatake/ContactInfo";
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
        className="w-full text-left p-6 hover:bg-green-50 transition-colors flex justify-between items-center"
      >
        <span className="text-lg font-semibold text-gray-800 pr-4">
          {question}
        </span>
        <span
          className={`text-2xl text-green-600 transform transition-transform ${
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
        "はい、大丈夫です。初心者の方も安心してご利用いただけます。畑の先輩から土作りや肥料、育て方を教えてもらえますので、お気軽に始めていただけます。",
    },
    {
      question: "どのような野菜や果樹を育てられますか?",
      answer:
        "イチゴ、トマト、ヨーロッパ野菜、ブルーベリーなど、様々な果樹や野菜を育てることができます。果樹の地植えも可能ですので、本格的な果樹栽培にもチャレンジできます。",
    },
    {
      question: "農機具は借りられますか?",
      answer:
        "はい、農機具は完備されており、無料でご利用いただけます。鍬、スコップなど、栽培に必要な道具は揃っていますので、手ぶらでお越しいただけます。",
    },
    {
      question: "水やりはどうすればいいですか?",
      answer:
        "畑には井戸が完備されており、自由に水を使うことができます。ジョウロやホースもご用意していますので、ご自由にご利用ください。",
    },
    {
      question: "車で行けますか?駐車場はありますか?",
      answer:
        "はい、十分な広さの駐車スペースをご用意しております。お車でお越しいただけます。さいたま見沼ICから約3分とアクセスも良好です。",
    },
    {
      question: "いつでも畑に行けますか?",
      answer:
        "ご契約者様は基本的にいつでも畑にお越しいただけます。ただし、イベント開催時など一部制限がある場合がございますので、詳しくはお問い合わせください。",
    },
    {
      question: "友人や家族と一緒に利用できますか?",
      answer:
        "はい、ご家族やご友人と一緒にご利用いただけます。プライベートパークとしても利用可能で、収穫物を使ってピザパーティーなども開催できます。",
    },
    {
      question: "契約期間はどのくらいですか?",
      answer:
        "基本的に年間契約となります。途中解約の場合、返金はございませんのでご了承ください。詳細については、お気軽にお問い合わせください。",
    },
    {
      question: "見学はできますか?",
      answer:
        "はい、見学は随時受け付けております。実際の畑の雰囲気や設備をご覧いただけます。事前にお電話またはメールでご連絡いただけるとスムーズです。",
    },
    {
      question: "料金の支払い方法は?",
      answer:
        "お支払い方法は現金または銀行振込となります。詳しい料金プランについては、料金ページをご覧いただくか、直接お問い合わせください。",
    },
    {
      question: "プライベートパークとして利用できますか?",
      answer:
        "はい、リモートワークの合間に農作業をしたり、お友達と収穫物でピザパーティーを開催したりできます。ご契約者様以外のご利用も可能で、SpaceMarketからご予約いただけます。",
    },
    {
      question: "イベントには参加必須ですか?",
      answer:
        "いいえ、イベント参加は任意です。ご興味のあるイベントにお気軽にご参加ください。季節ごとに様々なイベントを開催していますので、楽しみながら農業を学べます。",
    },
  ];

  return (
    <div className="w-full px-4">
      <TopicLabel title="よくある質問" />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="bg-green-100 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">FAQ</h2>
          <p className="text-lg leading-relaxed">
            フルーツとやさい畑に関するよくある質問をまとめました。
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
