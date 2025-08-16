import Image from "next/image";

export default function LogoImage({
  width = 1248 / 3,
  height = 171 / 3,
}: Readonly<{ width?: number; height?: number }>) {
  return (
    <>
      <Image
        src="/images/fruitshatakeTitleLogo.png"
        className={"object-contain h-8 sm:h-12 my-4 w-full"}
        width={width}
        height={height}
        alt={"title"}
      />
    </>
  );
}
