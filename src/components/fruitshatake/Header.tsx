"use client";
import LogoImage from "./logoImage";
import Link from "next/link";

const linkStyle =
  "hover:text-blue-300 transition-colors bg-[url(/images/linkbk.png)] bg-[length:100%_100%] bg-center bg-no-repeat px-5 py-2 block";

export default function HeaderFruitshatake() {
  return (
    <div className="bg-[url(/images/headbk.png)] bg-cover bg-no-repeat">
      <div className="flex justify-center items-center h-16 md:h-20 lg:h-24">
        <LogoImage />
      </div>
      <nav className="">
        <ul className="flex justify-center gap-4 md:gap-6 lg:gap-8 py-3 text-blue-800 text-sm md:text-base lg:text-lg font-semibold">
          <li>
            <Link href="/fruitshatake/facilities" className={linkStyle}>
              設備
            </Link>
          </li>
          <li>
            <Link href="/fruitshatake/pricing" className={linkStyle}>
              金額
            </Link>
          </li>
          <li>
            <Link href="/fruitshatake/events" className={linkStyle}>
              イベント
            </Link>
          </li>
          <li>
            <Link href="/fruitshatake/faq" className={linkStyle}>
              よくある質問
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
