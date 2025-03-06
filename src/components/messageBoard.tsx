import MenuTitle from './menuTitle';

type Props = {
  title: string;
  text: string;
  children: React.ReactNode;
};

export default function MessageBoard({ title, text, children }: Props) {
  return (
    <div className='flex flex-col items-center w-[334px] h-[270px] xs:w-[400px] xs:h-[323px] bg-contain bg-[url(/frame01.png)] bg-no-repeat'>
      <div className='mt-[-16] text-center'>
        <MenuTitle title={title} />
      </div>
      <pre className='text-lg px-6 py-4 break-normal whitespace-pre-wrap'>{text}</pre>
      {children}
    </div>
  );
}
