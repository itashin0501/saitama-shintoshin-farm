type Props = {
  title: string;
  text?: string;
  textContent?: React.ReactNode;
  children: React.ReactNode;
};

export default function MessageBoardY({ title, text, textContent, children }: Props) {
  return (
    <div className="flex flex-col items-center w-[334px] h-[270px] xs:w-[400px] xs:h-[323px] bg-yellow-200 rounded-xl">
      <div className="w-fit">
        <p className="mt-5 mb-2 xs:mt-7 xs:mb-3 font-semibold text-center">
          {/* 背景は文字と同じ高さにし、pb分だけ下にずらして文字の上側をはみ出させる */}
          <span className="inline-block px-6 pb-2 leading-6 bg-[url(/images/chara_bk02.png)] bg-[length:100%_24px] bg-bottom bg-no-repeat">
            {title}
          </span>
        </p>
        {textContent ? (
          <div className="pt-4 px-6 text-lg">{textContent}</div>
        ) : (
          <pre className="pt-4 px-6 text-lg whitespace-pre-wrap">{text}</pre>
        )}
      </div>
      {children}
    </div>
  );
}
