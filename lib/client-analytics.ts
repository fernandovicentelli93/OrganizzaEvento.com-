"use client";

type AnalyticsValue = string | number | boolean | null | undefined;

type MarketingEventPayload = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __oeAnalyticsBlocked?: boolean;
  }
}

function cleanPayload(payload: MarketingEventPayload) {
  return Object.fromEntries(
    Object.entries(payload)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 220) : value])
  );
}

export function trackMarketingEvent(eventName: string, payload: MarketingEventPayload = {}) {
  if (typeof window === "undefined") return;

  const clean = cleanPayload(payload);
  const path = `${window.location.pathname}${window.location.search}`;
  const body = {
    eventName,
    path,
    referrer: document.referrer || null,
    placement: typeof clean.placement === "string" ? clean.placement : null,
    target: typeof clean.target === "string" ? clean.target : null,
    metadata: clean
  };

  if (window.gtag && !window.__oeAnalyticsBlocked) {
    window.gtag("event", eventName, {
      event_category: "organizzaevento_marketing",
      page_path: path,
      ...clean
    });
  }

  const json = JSON.stringify(body);
  const blob = new Blob([json], { type: "application/json" });

  if (navigator.sendBeacon?.("/api/analytics/event", blob)) return;

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
    keepalive: true
  }).catch(() => undefined);
}
