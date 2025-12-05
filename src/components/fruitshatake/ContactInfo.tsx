import Link from "next/link";

export default function ContactInfo() {
  return (
    <div className="bg-white rounded-lg p-4">
      <p className="font-semibold text-lg">フルーツとやさい畑 担当：イタモト</p>
      <p className="text-xl text-green-700 font-bold mt-2">
        ０９０−３３１１−８８２４
      </p>
      <p className="text-gray-600 mt-1">
        受付 : 10:00〜18:00（土日祝も受付中）
      </p>
      <p className="mt-2">
        Email :{" "}
        <a
          href="mailto:fruits.hatake@gmail.com"
          className="text-blue-600 underline hover:text-blue-800"
        >
          fruits.hatake@gmail.com
        </a>
      </p>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/fruitshatake/contact"
          className="inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          お問い合わせフォームはこちら
        </Link>
      </div>
    </div>
  );
}
