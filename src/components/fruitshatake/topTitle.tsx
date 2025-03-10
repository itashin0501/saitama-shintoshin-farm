import Image from 'next/image';

export default function TopTitle() {
  return (
    <div className='w-full flex flex-col gap-4 mb-8 items-center'>
      <div className='flex justify-center space-x-8'>
        <Image
          src='/0034.png'
          className='hidden sm:block'
          width={172 / 2}
          height={200 / 2}
          alt={''}
        />
        <div className='text-center'>
          <p className='underline'>プライベートパーク付きレンタル農園</p>
          <p className='font-bold'>さいたま新都心</p>
          <Image src='/fruitshatakeTitleLogo.png' width={1248 / 3} height={171 / 3} alt={'title'} />
        </div>
        <Image
          src='/0106.png'
          className='hidden sm:block'
          width={197 / 2}
          height={200 / 2}
          alt={''}
        />
      </div>

      <Image src='/TOP.jpg' width={976 / 2} height={545 / 2} alt={'top'} className='rounded-xl' />
    </div>
  );
}
