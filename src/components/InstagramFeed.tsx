"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type InstagramPost = {
  id: string;
  media_url: string;
  media_type: string;
  permalink: string;
  caption?: string;
  timestamp: string;
};

type Props = {
  accessToken: string;
  userId: string;
  limit?: number;
  className?: string;
};

export default function InstagramFeed({
  accessToken,
  userId,
  limit = 5,
  className = "",
}: Props) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch(
          `https://graph.instagram.com/${userId}/media?fields=id,media_url,media_type,permalink,caption,timestamp&access_token=${accessToken}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Instagram posts");
        }

        const data = await response.json();
        const imagePosts = data.data.filter(
          (post: InstagramPost) =>
            post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM"
        );
        setPosts(imagePosts.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, [accessToken, userId, limit]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <p className="text-red-500">エラー: {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <p className="text-lg">投稿が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}>
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
        >
          <Image
            src={post.media_url}
            alt={post.caption?.slice(0, 100) || "Instagram post"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </a>
      ))}
    </div>
  );
}
