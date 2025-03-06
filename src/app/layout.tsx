import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: '花野菜農園',
  description: 'プライベートパーク付きレンタル農園',
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
        <Footer />
      </body>
    </html>
  );
}
