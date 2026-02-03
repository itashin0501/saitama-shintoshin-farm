import Image from "next/image";
import Link from "next/link";

export default function LogoImage({
  width = 1248 / 3,
  height = 171 / 3,
  asLink = true,
}: Readonly<{ width?: number; height?: number; asLink?: boolean }>) {
  const image = (
    <Image
      src="/images/fruitshatakeTitleLogo.png"
      className={"object-contain h-8 sm:h-10 my-4"}
      width={width}
      height={height}
      alt={"title"}
    />
  );

  if (!asLink) {
    return image;
  }

  return <Link href="/fruitshatake">{image}</Link>;
}
