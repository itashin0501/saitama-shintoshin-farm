"use client";
import Link from "next/link";

export default function HeaderHanayasai() {
  return (
    <div className="pr-12 flex bg-[url(/images/headbk.png)] bg-cover bg-no-repeat h-16 md:h-20 lg:h-24 flex items-center justify-start">
      <Link href="/" className="text-white font-bold text-lg pl-20">
        TOPへ
      </Link>
      <Link
        href="/fruitshatake"
        className="text-white font-bold text-lg ml-auto"
      >
        「フルーツとやさい畑」へ
      </Link>
    </div>
  );
}
