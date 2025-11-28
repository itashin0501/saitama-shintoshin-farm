"use client";

import { useEffect } from "react";
import Script from "next/script";

type Props = {
  feedId: string;
  className?: string;
};

export default function BeholdWidget({ feedId, className = "" }: Props) {
  return (
    <>
      <div className={className}>
        <behold-widget feed-id={feedId}></behold-widget>
      </div>
      <Script
        src="https://w.behold.so/widget.js"
        strategy="lazyOnload"
        type="module"
      />
    </>
  );
}
