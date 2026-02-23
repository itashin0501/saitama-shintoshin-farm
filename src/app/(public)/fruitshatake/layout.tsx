import type { Metadata } from "next";
import "@/app/fruitshatake.css";
import Favicon from "../../../../public/images/faviconF.ico";
import Header from "@/components/fruitshatake/Header";
import Footer from "@/components/fruitshatake/Footer";

export const metadata: Metadata = {
  title: "フルーツとやさい畑",
  description: "プライベートパーク付きレンタル農園",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fruitshatake-layout">
      <Header />
      <div className="flex flex-col min-h-screen md:pb-24 items-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}
