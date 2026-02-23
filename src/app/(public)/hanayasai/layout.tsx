import type { Metadata } from "next";
import "@/app/hanayasai.css";
import Favicon from "../../../../public/images/faviconH.ico";
import Header from "@/components/hanayasai/Header";
import Footer from "@/components/hanayasai/Footer";

export const metadata: Metadata = {
  title: "花野菜農園",
  description: "プライベートパーク付きレンタル農園",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="hanayasai-layout">
      <Header />
      <div className="flex flex-col min-h-screen md:pb-24 items-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}
