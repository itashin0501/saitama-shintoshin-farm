"use client";

import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export type LightboxImage = {
  src: string;
  caption?: string;
  alt: string;
};

interface LightboxProps {
  images: LightboxImage[];
  index: number | null; // null のときは閉じている
  onIndexChange: (index: number | null) => void;
}

// 大きな画像をオーバーレイ表示する。←→キー・スワイプで前後に移動、Esc・背景クリックで閉じる
export default function Lightbox({ images, index, onIndexChange }: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const open = index !== null && images[index] !== undefined;
  const count = images.length;

  useEffect(() => {
    if (!open || index === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndexChange(null);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % count);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, index, count, onIndexChange]);

  if (!open || index === null) return null;

  const image = images[index];
  const go = (delta: number) => onIndexChange((index + delta + count) % count);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={() => onIndexChange(null)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1);
      }}
    >
      <div className="flex items-center justify-between p-3 text-white">
        <span className="text-sm opacity-80">
          {count > 1 && `${index + 1} / ${count}`}
        </span>
        <button
          type="button"
          onClick={() => onIndexChange(null)}
          className="p-2 rounded-full hover:bg-white/20"
          aria-label="閉じる"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center justify-center px-2 sm:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element -- アップロード時に生成済みの表示用画像をそのまま表示する */}
        <img
          src={image.src}
          alt={image.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-full object-contain rounded"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 sm:left-4 p-2 rounded-full bg-black/40 text-white hover:bg-white/20"
              aria-label="前の画像"
            >
              <ChevronLeftIcon fontSize="large" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 sm:right-4 p-2 rounded-full bg-black/40 text-white hover:bg-white/20"
              aria-label="次の画像"
            >
              <ChevronRightIcon fontSize="large" />
            </button>
          </>
        )}
      </div>

      <div className="min-h-[4rem] p-4 text-center">
        {image.caption && (
          <p
            onClick={(e) => e.stopPropagation()}
            className="inline-block text-white text-base whitespace-pre-wrap max-w-3xl"
          >
            {image.caption}
          </p>
        )}
      </div>
    </div>
  );
}
