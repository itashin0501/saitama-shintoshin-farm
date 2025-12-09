import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15では、NEXT_PUBLIC_*変数は自動的にクライアントサイドで利用可能になる
  // apphosting.yamlで設定された環境変数がビルド時に自動的に埋め込まれる
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/**",
      },
    ],
  },
};

export default nextConfig;
