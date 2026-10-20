import Image from "next/image";

const flyers = [
  {
    label: "表面",
    pdf: "/flyers/hanayasai_flyer_omote.pdf",
    thumbnail: "/flyers/hanayasai_flyer_omote.jpg",
  },
  {
    label: "裏面",
    pdf: "/flyers/hanayasai_flyer_ura.pdf",
    thumbnail: "/flyers/hanayasai_flyer_ura.jpg",
  },
];

export default function FlyerDownload() {
  return (
    <div className="flex flex-col items-center mb-8">
      <p className="text-base md:text-lg text-gray-700 mt-4 mb-6 text-center">
        花野菜農園のチラシをPDFでご覧いただけます。
      </p>
      <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-[640px] w-full px-4">
        {flyers.map((flyer) => (
          <a
            key={flyer.pdf}
            href={flyer.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center"
          >
            <div className="w-full overflow-hidden rounded-lg shadow-md border border-gray-200 transition-transform group-hover:scale-[1.02] group-hover:shadow-lg">
              <Image
                src={flyer.thumbnail}
                width={600}
                height={849}
                alt={`花野菜農園チラシ（${flyer.label}）`}
                className="w-full h-auto"
              />
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-sm md:text-base font-semibold text-green-800 group-hover:text-blue-600">
              チラシ{flyer.label}（PDF）を見る
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
