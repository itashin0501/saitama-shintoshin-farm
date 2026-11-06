"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { db } from "@/lib/firebase";
import TopicLabel, { pageColumn } from "@/components/topicLabel";
import Lightbox from "@/components/hanayasai/Lightbox";
import {
  ACTIVITIES_COLLECTION,
  ACTIVITY_SECTIONS_COLLECTION,
  LEGACY_SECTION_TITLE,
  type HanayasaiActivity,
  type HanayasaiActivitySection,
} from "@/lib/hanayasai";

type GallerySection = {
  id: string;
  title: string;
  photos: HanayasaiActivity[];
};

export default function ActivityGallery() {
  const [sections, setSections] = useState<GallerySection[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [sectionSnap, activitySnap] = await Promise.all([
          getDocs(
            query(
              collection(db, ACTIVITY_SECTIONS_COLLECTION),
              where("isPublished", "==", true)
            )
          ),
          getDocs(
            query(
              collection(db, ACTIVITIES_COLLECTION),
              where("isPublished", "==", true)
            )
          ),
        ]);
        const photos = activitySnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as HanayasaiActivity)
          .sort((a, b) => a.order - b.order);
        const list: GallerySection[] = sectionSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as HanayasaiActivitySection)
          .sort((a, b) => a.order - b.order)
          .map((s) => ({
            id: s.id,
            title: s.title,
            photos: photos.filter((p) => p.sectionId === s.id),
          }));

        // 項目機能の追加前の写真（管理画面で未移行のもの）は従来どおり「利用の様子」として表示
        const legacy = photos.filter((p) => !p.sectionId);
        if (legacy.length > 0) {
          list.unshift({ id: "legacy", title: LEGACY_SECTION_TITLE, photos: legacy });
        }

        // 公開中の写真がない項目は表示しない
        setSections(list.filter((s) => s.photos.length > 0));
      } catch (error) {
        console.error("利用の様子取得エラー:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <>
      {sections.map((section) => (
        <ActivitySection key={section.id} section={section} />
      ))}
    </>
  );
}

function ActivitySection({ section }: { section: GallerySection }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const { title, photos } = section;

  // 端までスクロールしたら矢印ボタンを無効にする（はみ出していなければ両方無効）
  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateArrows]);

  // 表示幅の9割ずつ送る（スナップで写真の左端に揃う）
  const scrollByPage = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <>
      <TopicLabel title={title} className={pageColumn} />
      <div className="flex justify-center mb-8">
        <div className={`relative ${pageColumn}`}>
          <div
            ref={scrollerRef}
            onScroll={updateArrows}
            className="mt-4 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4"
          >
            {photos.map((activity, index) => (
              <figure
                key={activity.id}
                className="snap-start flex-shrink-0 w-[80%] sm:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-3rem)/3)] bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="relative block w-full aspect-[4/3] bg-gray-100 cursor-zoom-in group"
                  aria-label={`${activity.caption || title}を拡大表示`}
                >
                  <Image
                    src={activity.thumbnailUrl || activity.imageUrl}
                    alt={activity.caption || title}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1280px) 50vw, 430px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
                {activity.caption && (
                  <figcaption className="p-4 text-base text-gray-700 whitespace-pre-wrap">
                    {activity.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>

          {/* PC では左右の矢印で送る（スマホはスワイプ） */}
          {(canPrev || canNext) && (
            <>
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={!canPrev}
                className="hidden sm:flex absolute left-0 top-[40%] -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/90 shadow-md text-gray-700 hover:bg-white disabled:opacity-0 transition-opacity"
                aria-label="前の写真へ"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={!canNext}
                className="hidden sm:flex absolute right-0 top-[40%] -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/90 shadow-md text-gray-700 hover:bg-white disabled:opacity-0 transition-opacity"
                aria-label="次の写真へ"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}
        </div>
      </div>
      <Lightbox
        images={photos.map((a) => ({
          src: a.imageUrl,
          caption: a.caption,
          alt: a.caption || title,
        }))}
        index={openIndex}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
