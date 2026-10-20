"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { db } from "@/lib/firebase";
import TopicLabel from "@/components/topicLabel";
import Lightbox from "@/components/hanayasai/Lightbox";
import { ACTIVITIES_COLLECTION, type HanayasaiActivity } from "@/lib/hanayasai";

export default function ActivityGallery() {
  const [activities, setActivities] = useState<HanayasaiActivity[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, ACTIVITIES_COLLECTION),
            where("isPublished", "==", true)
          )
        );
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as HanayasaiActivity)
          .sort((a, b) => a.order - b.order);
        setActivities(list);
      } catch (error) {
        console.error("利用の様子取得エラー:", error);
      }
    };

    fetchActivities();
  }, []);

  // 公開中の写真がなければセクションごと非表示
  if (activities.length === 0) return null;

  return (
    <>
      <TopicLabel title="利用の様子" />
      <div className="flex justify-center mb-8 px-4">
        <div className="mt-4 grid gap-6 w-full max-w-[1300px] grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity, index) => (
            <figure
              key={activity.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="relative block w-full aspect-[4/3] bg-gray-100 cursor-zoom-in group"
                aria-label={`${activity.caption || "利用の様子"}を拡大表示`}
              >
                <Image
                  src={activity.thumbnailUrl || activity.imageUrl}
                  alt={activity.caption || "利用の様子"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 430px"
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
      </div>
      <Lightbox
        images={activities.map((a) => ({
          src: a.imageUrl,
          caption: a.caption,
          alt: a.caption || "利用の様子",
        }))}
        index={openIndex}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
