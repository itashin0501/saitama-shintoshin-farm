import type { Metadata } from 'next';
import '@/app/fruitshatake.css';
import Favicon from '../../../../public/images/faviconF.ico';
import Header from '@/components/header';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'フルーツとやさい畑',
  description: 'プライベートパーク付きレンタル農園',
  icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className='flex flex-col min-h-screen mx-4 md:mx-8 md:mb-24 items-center sm:items-start'>
        {children}
      </div>
      <Footer text='フルーツとやさい畑' />
    </>
  );
}
