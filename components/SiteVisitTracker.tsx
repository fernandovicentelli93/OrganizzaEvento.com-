"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function SiteVisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/api")) return;

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    const controller = new AbortController();
    window.setTimeout(() => {
      void fetch("/api/analytics/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          referrer: document.referrer || null
        }),
        keepalive: true,
        signal: controller.signal
      }).catch(() => undefined);
    }, 900);

    return () => controller.abort();
  }, [pathname, searchParams]);

  return null;
}

