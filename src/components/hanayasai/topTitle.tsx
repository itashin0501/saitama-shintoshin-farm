import Image from "next/image";

export default function TopTitle({
  subTitle = true,
}: Readonly<{ subTitle?: boolean }>) {
  return (
    <div className="w-full flex flex-col gap-4 mb-8 items-center">
      <div className="flex justify-center h-26">
        <Image
          src="/images/0971.png"
          className="hidden mr-4 sm:block"
          width={188 / 2}
          height={200 / 2}
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
          <p
            className={`font-bold text-3xl sm:text-4xl text-[#444444] ${
              subTitle ? "my-0" : "mt-10"
            }`}
          >
            花野菜農園
          </p>
        </div>
        <Image
          src="/images/toprImage.png"
          className="hidden ml-4 sm:block"
          width={208 / 2}
          height={187 / 2}
          alt={""}
        />
      </div>

      <Image
        src="/images/top.jpg"
        width={960 / 2}
        height={545 / 2}
        alt={"top"}
        className="rounded-xl"
      />
    </div>
  );
}
