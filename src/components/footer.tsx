export default function Footer({
  text,
}: Readonly<{
  text: string;
}>) {
  return (
    <footer className='xl:fixed xl:bottom-0 w-full bg-[url(/footbk.png)] bg-cover bg-no-repeat h-24 flex items-center justify-center'>
      <p className='text-white text-lg relative top-6 px-2 pt-2 bg-[#7bcd64]'>{text}</p>
    </footer>
  );
}
