"use client";
import { usePathname } from "next/navigation";
import MenuTitle from "./menuTitle";

export default function Header() {
  const pathname = usePathname();
  return (
    <div className="pr-12 flex bg-[url(/images/headbk.png)] bg-cover bg-no-repeat h-16 md:h-20 lg:h-24 flex items-center justify-start">
      {pathname !== "/" && (
        <a href="/" className="text-white font-bold text-lg pl-20">
          TOPへ
        </a>
      )}
      {false && <MenuTitle title="利用者ログイン" />}
    </div>
  );
}
