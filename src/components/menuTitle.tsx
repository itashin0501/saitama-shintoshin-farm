interface MenuTitleProps {
  title: string;
}

export default function MenuTitle({ title }: MenuTitleProps) {
  return (
    <>
      <div className="w-fit min-w-28 pb-4 bg-[url(/images/chara_bk.png)] bg-no-repeat menu-bk">
        <p className="font-semibold text-xl">{title}</p>
      </div>

      <style>
        {`
  .menu-bk {
    background-position: top 8px left 4px;
  }
`}
      </style>
    </>
  );
}
