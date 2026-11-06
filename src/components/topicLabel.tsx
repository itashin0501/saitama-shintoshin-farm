interface TopicProps {
  title: string;
  // 左端を揃えたいコンテンツと同じ幅指定（例: "max-w-4xl mx-auto"）
  className?: string;
}

// TOPページ共通の列幅。体験カード（334/400px）の 1〜3 列グリッドの幅と一致させ、
// どのセクションのラベル・中身も同じ左端に揃える
export const pageColumn =
  "w-full mx-auto max-w-[334px] xs:max-w-[400px] lg:max-w-[832px] xl:max-w-[1264px]";

export default function TopicLabel({ title, className = "" }: TopicProps) {
  return (
    <div className={`w-full mb-4 ${className}`}>
      <h2 className="w-fit min-w-[240px] max-w-full px-10 sm:px-16 py-3 text-center text-xl font-semibold bg-[url(/images/chara_bk02.png)] bg-[length:100%_100%] bg-no-repeat">
        {title}
      </h2>
    </div>
  );
}
