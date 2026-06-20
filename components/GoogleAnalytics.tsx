"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __oeAnalyticsBlocked?: boolean;
  }
}

type GoogleAnalyticsProps = {
  measurementId: string;
};

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialPageViewHandled = useRef(false);

  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || !window.gtag || window.__oeAnalyticsBlocked) return;

    if (!initialPageViewHandled.current) {
      initialPageViewHandled.current = true;
      return;
    }

    const queryString = searchParams.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: `${window.location.origin}${pagePath}`,
      page_title: document.title
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}
