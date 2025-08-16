import Image from "next/image";
import LogoImage from "./logoImage";

export default function TopTitle({
  subTitle = true,
}: Readonly<{ subTitle?: boolean }>) {
  return (
    <div className="w-full flex flex-col gap-4 mb-8 items-center">
      <div className="flex justify-center h-26 items-center">
        <Image
          src="/images/0034.png"
          className="hidden mr-4 sm:block w-[86px] h-[100px]"
          width={86}
          height={100}
          alt={""}
        />
        <div className="text-center align-middle">
          {subTitle && (
            <>
              <p className="underline whitespace-nowrap text-[#444444]">
                プライベートパーク付きレンタル農園
              </p>
              <p className="font-bold no-underline text-[#444444]">
                さいたま新都心
              </p>
            </>
          )}
          <LogoImage />
        </div>
        <Image
          src="/images/0106.png"
          className="hidden ml-4 sm:block w-[98px] h-[100px]"
          width={98}
          height={100}
          alt={""}
        />
      </div>

      <Image
        src="/images/TOPF.jpg"
        width={480}
        height={272}
        alt={"top"}
        className="rounded-xl"
      />
    </div>
  );
}
