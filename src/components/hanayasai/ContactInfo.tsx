import Link from "next/link";

export default function ContactInfo() {
  return (
    <div className="bg-white rounded-lg p-4">
      <p className="font-semibold text-lg">花野菜農園倶楽部 担当：金子</p>
      <p className="text-xl text-green-700 font-bold mt-2">
        ０８０−９３８９−９７５０
      </p>
      <p className="text-gray-600 mt-1">
        受付 : 10:00〜18:00（土日祝も受付中）
      </p>
      <p className="mt-2">
        Email :{" "}
        <a
          href="mailto:info@hanayasainouen.com"
          className="text-blue-600 underline hover:text-blue-800"
        >
          info@hanayasainouen.com
        </a>
      </p>
    </div>
  );
}
