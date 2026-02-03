"use client";
import Link from "next/link";

const linkStyle =
  "hover:text-yellow-300 transition-colors bg-[url(/images/linkbk.png)] bg-[length:100%_100%] bg-center bg-no-repeat px-5 py-2 block";

export default function HeaderHanayasai() {
  return (
    <div className="bg-[url(/images/headbk.png)] bg-cover bg-no-repeat">
      <nav className="">
        <ul className="flex justify-center gap-4 md:gap-6 lg:gap-8 py-3 text-yellow-700 text-sm md:text-base lg:text-lg font-semibold">
          <li>
            <Link href="/hanayasai/pricing" className={linkStyle}>
              金額
            </Link>
          </li>
          <li>
            <Link href="/hanayasai/faq" className={linkStyle}>
              よくある質問
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
