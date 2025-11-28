"use client";

import Script from "next/script";

type Props = {
  feedId: string;
  className?: string;
};

export default function BeholdWidget({ feedId, className = "" }: Props) {
  return (
    <>
      <div
        className={className}
        dangerouslySetInnerHTML={{
          __html: `<behold-widget feed-id="${feedId}"></behold-widget>`
        }}
      />
      <Script
        src="https://w.behold.so/widget.js"
        strategy="lazyOnload"
        type="module"
      />
    </>
  );
}
