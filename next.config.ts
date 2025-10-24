import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // 環境に応じて本番URLを設定
    NEXT_PUBLIC_APP_URL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_APP_URL || "https://urawa.farm"
        : "https://localhost:3000",
  },
};

export default nextConfig;
