"use client";

import { useEffect } from "react";

type Props = {
  embedCode: string;
  className?: string;
};

export default function InstagramEmbed({ embedCode, className = "" }: Props) {
  useEffect(() => {
    // 埋め込みコードにスクリプトが含まれている場合、実行する
    const scripts = document.querySelectorAll('script[data-instagram-embed]');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      newScript.src = script.getAttribute('src') || '';
      newScript.async = true;
      document.body.appendChild(newScript);
    });
  }, []);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: embedCode }}
    />
  );
}
