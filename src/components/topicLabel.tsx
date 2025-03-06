interface TopicProps {
  title: string;
}

export default function TopicLabel({ title }: TopicProps) {
  return (
    <div className='flex justify-center w-fit min-w-[360px] h-[48px] ml-[-32px] mb-4 bg-contain bg-[url(/charaLabel.png)] bg-no-repeat'>
      <p className='font-semibold pt-3 text-xl'>{title}</p>
    </div>
  );
}
