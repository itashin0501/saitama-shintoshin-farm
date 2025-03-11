import type { Metadata } from 'next';
import '@/app/globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';

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
        <Header />
        <main className='flex flex-col min-h-screen mx-4 md:mx-8 items-center sm:items-start'>
          {children}
        </main>
        <Footer text='花野菜農園・フルーツとやさい畑' />
      </body>
    </html>
  );
}
