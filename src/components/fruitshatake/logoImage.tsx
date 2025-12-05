import Image from "next/image";
import Link from "next/link";

export default function LogoImage({
  width = 1248 / 3,
  height = 171 / 3,
}: Readonly<{ width?: number; height?: number }>) {
  return (
    <Link href="/fruitshatake">
      <Image
        src="/images/fruitshatakeTitleLogo.png"
        className={"object-contain h-8 sm:h-10 my-4"}
        width={width}
        height={height}
        alt={"title"}
      />
    </Link>
  );
}
