import type { Metadata } from 'next';
import Hanayasai from '@/components/hanayasai/topTitle';
import Fruhata from '@/components/fruitshatake/topTitle';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: '花野菜農園・フルーツとやさい畑',
  description: 'さいたま新都心・浦和 / プライベートパーク付きレンタル農園',
};

export default function Home() {
  return (
    <div className='w-full text-center'>
      <Header />
      <div className='mb-8'>
        <p className='underline text-lg sm:text-2xl whitespace-nowrap text-[#444444]'>
          プライベートパーク付きレンタル農園
        </p>
        <p className='font-bold text-lg sm:text-xl no-underline text-[#444444]'>さいたま新都心</p>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 text-center'>
        <div>
          <Link href='/hanayasai'>
            <Hanayasai subTitle={false} />
          </Link>
        </div>
        <div>
          <Link href='/fruitshatake'>
            <Fruhata subTitle={false} />
          </Link>
        </div>
      </div>

      <Footer text='花野菜農園・フルーツとやさい畑' />
    </div>
  );
}
