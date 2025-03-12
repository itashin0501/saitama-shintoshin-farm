import type { Metadata } from 'next';
import '@/app/hanayasai.css';
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
    <>
      <Header />
      <div className='flex flex-col min-h-screen mx-4 md:mx-8 items-center sm:items-start'>
        {children}
      </div>
      <Footer text='花野菜農園' />
    </>
  );
}
