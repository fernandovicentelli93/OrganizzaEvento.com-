"use client";

import { useEffect, useState } from "react";

export function LogoSparkle() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = window.setTimeout(() => setVisible(true), 90000);
    const hideTimer = window.setTimeout(() => setVisible(false), 99000);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed left-16 top-16 z-50 h-3 w-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.95),0_0_28px_rgba(201,86,123,0.85)] oe-sparkle" />
  );
}
