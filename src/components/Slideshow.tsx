"use client";
import { useState, useEffect } from "react";

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
    <div
      className="flex overflow-x-auto gap-4 items-center"
      style={{
        scrollSnapType: "x mandatory",
        height: "180px", // 高さを一定に
      }}
      ref={(el) => {
        if (el) {
          const focused = el.children[index] as HTMLElement;
          if (focused) {
            focused.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest",
            });
          }
        }
      }}
    >
      {images.map((src, i) => (
        <div
          key={src}
          className={`transition-opacity duration-700 flex-shrink-0`}
          style={{
            width: "320px",
            height: "160px",
            opacity: i === index ? 1 : 0.4,
            scrollSnapAlign: "center",
            border: i === index ? "3px solid #38bdf8" : "none",
            borderRadius: "12px",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={src}
            alt={`event image ${i + 1}`}
            className="rounded-lg object-cover w-full h-full"
            style={{ minHeight: 0, minWidth: 0 }}
          />
        </div>
      ))}
    </div>
  );
}
