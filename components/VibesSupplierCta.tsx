"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { trackMarketingEvent } from "@/lib/client-analytics";
import { VIBES_PLANNER_CLIENT_REQUEST_URL } from "@/lib/constants";
import { localeFromPathname } from "@/lib/i18n-basic";

type VibesSupplierCtaProps = {
  children: React.ReactNode;
  className?: string;
  logoClassName?: string;
  placement?: string;
  variant?: "light" | "dark" | "pink";
};

const baseClassName =
  "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition";

const variantClassNames = {
  light: "border border-line bg-white text-ink hover:bg-petal",
  dark: "border border-white/70 bg-white/95 text-ink hover:bg-petal",
  pink: "bg-violet-cta text-white hover:bg-violet-hover"
};

export function VibesSupplierCta({
  children,
  className = "",
  logoClassName = "h-7 w-7",
  placement = "vibes_direct_request_cta",
  variant = "light"
}: VibesSupplierCtaProps) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);

  return (
    <a
      href={VIBES_PLANNER_CLIENT_REQUEST_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() =>
        trackMarketingEvent("vibes_guided_request_click", {
          placement,
          locale,
          target: VIBES_PLANNER_CLIENT_REQUEST_URL
        })
      }
      className={`${baseClassName} ${variantClassNames[variant]} ${className}`}
    >
        <img
          src="/partners/vibes-planner/logo.jpg"
          alt="Vibes Planner"
          loading="lazy"
          decoding="async"
          className={`${logoClassName} shrink-0 rounded-md object-cover`}
        />
      <span>{children}</span>
    </a>
  );
}
