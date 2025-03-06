import MenuTitle from './menuTitle';

export default function Header() {
  return (
    <div className='pr-12 flex bg-[url(/headbk.png)] bg-cover bg-no-repeat h-16 md:h-20 lg:h-24 flex items-center justify-end'>
      {false && <MenuTitle title='利用者ログイン' />}
    </div>
  );
}
