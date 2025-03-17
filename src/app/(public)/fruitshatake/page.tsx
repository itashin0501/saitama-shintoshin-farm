import MessageBoard from '@/components/messageBoard';
import Toptitle from '@/components/fruitshatake/topTitle';
import TopicLabel from '@/components/topicLabel';
import Image from 'next/image';
import { introdution, access, experience } from '@/contents/fruhata-messages';
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
          <MessageBoard title='えらぶ' text={experience.select}>
            <Image src='/taikenf-1.png' width={480 / 1.5} height={200 / 1.5} alt={'taiken-1'} />
          </MessageBoard>
          <MessageBoard title='そだてる' text={experience.nurture}>
            <Image
              src='/taikenf-2.png'
              width={350 / 1.8}
              height={220 / 1.8}
              alt={'taiken-2'}
              className='relative left-20 top-0'
            />
          </MessageBoard>
          <MessageBoard title='まなぶ' text={experience.learn}>
            <Image
              src='/taikenf-3.png'
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
              src='/pizza.jpg'
              width={1000 / 3.5}
              height={400 / 3.5}
              alt={'taiken-5'}
              className='rounded-lg'
            />
          </MessageBoardY>
        </div>
      </div>
      <TopicLabel title='アクセス' />
      <div className='flex flex-col mb-8'>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2353.558579724109!2d139.66101556753097!3d35.89142560649142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c177fc239cc5%3A0x5e9e5381eb691d8a!2z44OV44Or44O844OE44Go44KE44GV44GE55WR!5e0!3m2!1sja!2sjp!4v1741616481815!5m2!1sja!2sjp'
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
          <p>フルーツとやさい畑 担当：イタモト</p>
          <p>０９０−３３１１−８８２４</p>
          <p>受付 : 10:00〜18:00（土日祝も受付中）</p>
          <p>
            Email : <a href='mailto:fruits.hatake@gmail.com'>fruits.hatake@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
