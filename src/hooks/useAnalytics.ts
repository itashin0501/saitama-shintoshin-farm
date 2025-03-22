'use client'; // クライアントコンポーネントとしてマーク

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (analytics && pathname) {
      logEvent(analytics, 'page_view', {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname]); // pathnameが変更されるたびに実行
}
