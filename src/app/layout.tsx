import type { Metadata } from 'next';
import '@/app/globals.css';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import Favicon from '../../public/images/faviconH.ico';

export const metadata: Metadata = {
  title: '花野菜農園・フルーツとやさい畑',
  description: 'さいたま新都心・浦和 / プライベートパーク付きレンタル農園',
  icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className='min-h-screen'>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
