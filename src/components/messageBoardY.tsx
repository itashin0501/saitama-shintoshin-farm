type Props = {
  title: string;
  text: string;
  children: React.ReactNode;
};

export default function MessageBoardY({ title, text, children }: Props) {
  return (
    <div className='flex flex-col items-center w-[334px] h-[270px] xs:w-[400px] xs:h-[323px] bg-yellow-200 rounded-xl'>
      <div className='w-fit'>
        <div className='mt-2 xs:py-3 bg-[url(/chara_bk02.png)] bg-contain bg-no-repeat bg-center '>
          <p className='font-semibold h-10 p-2 text-center align-middle'>{title}</p>
        </div>
        <pre className='pt-4 px-6 text-lg whitespace-pre-wrap'>{text}</pre>
      </div>
      {children}
    </div>
  );
}
