import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: '花野菜農園・フルーツとやさい畑',
  description: 'さいたま新都心・浦和 / プライベートパーク付きレンタル農園',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body>
        <> {children}</>
      </body>
    </html>
  );
}
