"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Slideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      3000
    );
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="flex gap-4 items-center justify-center overflow-hidden h-[220px] sm:h-[360px]">
      {images.map((src, i) => (
        <div
          key={src}
          className={
            "transition-opacity duration-700 flex-shrink-0 h-[220px] sm:h-[360px] relative"
          }
          style={{
            opacity: i === index ? 1 : 0.4,
            border: i === index ? "3px solid #38bdf8" : "none",
            borderRadius: "12px",
            background: "#eee",
            display: i === index ? "flex" : "none", // 中央の画像だけ表示
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Image
            src={src}
            alt={`event image ${i + 1}`}
            className="rounded-lg object-cover w-full h-full"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            quality={90}
          />
        </div>
      ))}
    </div>
  );
}
