import Hanayasai from '@/components/hanayasai/topTitle';
import Fruhata from '@/components/fruitshatake/topTitle';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='w-full'>
      <div className='grid gap-8 grid-cols-1 xl:grid-cols-2 mb-8'>
        <Link href='/hanayasai'>
          <Hanayasai subTitle={false} />
        </Link>
        <Link href='/fruitshatake'>
          <Fruhata subTitle={false} />
        </Link>
      </div>
    </div>
  );
}
