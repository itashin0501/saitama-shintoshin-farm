import MessageBoard from '@/components/messageBoard';
import Toptitle from '@/components/topTitle';
import TopicLabel from '@/components/topicLabel';
import Image from 'next/image';
import { introdution, access, experience } from '@/contents/messages';
import MessageBoardY from '@/components/messageBoardY';

export default function Home() {
  return (
    <div className='w-full'>
      <div className=' flex flex-col items-center mb-8'>
        <Toptitle />
        <div className='bg-green-100 rounded-xl p-4 mt-4 w-[400px] lg:w-[800px]'>
          <pre className='text-lg whitespace-pre-wrap'>{introdution}</pre>
        </div>
      </div>

      <TopicLabel title='体験' />
      <div className='flex justify-center mb-8'>
        <div className='mt-4 grid gap-8 lg:max-w-[900px] xl:max-w-[1300px] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          <MessageBoard title='つくる' text={experience.make}>
            <Image
              src='/taiken-1.png'
              width={480 / 2}
              height={200 / 2}
              alt={'taiken-1'}
              className='relative top-4'
            />
          </MessageBoard>
          <MessageBoard title='あそぶ' text={experience.play}>
            <Image
              src='/taiken-2.png'
              width={350 / 2.5}
              height={220 / 2.5}
              alt={'taiken-2'}
              className='relative left-20 -top-16 xs:top-0'
            />
          </MessageBoard>
          <MessageBoard title='まなぶ' text={experience.learn}>
            <Image
              src='/taiken-3.png'
              width={400 / 1.7}
              height={169 / 1.7}
              alt={'taiken-3'}
              className='relative -top-4 xs:top-0'
            />
          </MessageBoard>
          <MessageBoardY title='充実した設備をご用意しております' text={experience.facility}>
            <Image
              src='/taiken-4.png'
              width={284 / 2}
              height={204 / 2}
              alt={'taiken-4'}
              className='relative -top-8 xs:top-2 left-16'
            />
          </MessageBoardY>
          <MessageBoardY title='プライベートパーク利用' text={experience.privatePark}>
            <Image
              src='/remotework.jpg'
              width={640 / 4}
              height={480 / 4}
              alt={'taiken-5'}
              className='rounded-lg'
            />
          </MessageBoardY>
        </div>
      </div>
      <TopicLabel title='アクセス' />
      <div className='flex flex-col mb-8'>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2565.0407512517363!2d139.660448891735!3d35.89113519827244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c1a19204a663%3A0xbdfb95dfe12b7a01!2z6Iqx6YeO6I-c6L6y5ZyS!5e0!3m2!1sja!2sjp!4v1741101175985!5m2!1sja!2sjp'
          className='w-full h-[420px] border-2 border-gray-300 rounded-lg'
          loading='lazy'
        />
        <div className='w-full text-lg bg-green-100 rounded-xl p-4 mt-4'>
          <pre className='text-lg text-left'>{access.address}</pre>
          <pre className='text-sm xs:text-lg text-left mt-2'>{access.byCar}</pre>
          <pre className='text-sm xs:text-lg whitespace-pre-wrap text-left mt-2'>
            {access.byTrain}
          </pre>
        </div>
      </div>

      <TopicLabel title='お気軽にお問い合わせください' />
      <div className='mt-4 grid gap-8 lg:max-w-[900px] xl:max-w-[1300px] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
        <div className='text-xl leading-10'>
          <p>花野菜農園倶楽部 担当：金子</p>
          <p>０８０−９３８９−９７５０</p>
          <p>受付 : 10:00〜18:00（土日祝も受付中）</p>
          <p>
            Email : <a href='mailto:info@hanayasainouen.com'>info@hanayasainouen.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
