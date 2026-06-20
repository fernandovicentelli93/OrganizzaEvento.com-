import type React from "react";
import { VIBES_PLANNER_CLIENT_REQUEST_URL } from "@/lib/constants";

type VibesSupplierCtaProps = {
  children: React.ReactNode;
  className?: string;
  logoClassName?: string;
  variant?: "light" | "dark" | "pink";
};

const baseClassName =
  "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition";

const variantClassNames = {
  light: "border border-line bg-white text-ink hover:bg-petal",
  dark: "border border-white/70 bg-white/95 text-ink hover:bg-petal",
  pink: "bg-violet-cta text-white hover:bg-violet-hover"
};

export function VibesSupplierCta({ children, className = "", logoClassName = "h-7 w-7", variant = "light" }: VibesSupplierCtaProps) {
  return (
    <a
      href={VIBES_PLANNER_CLIENT_REQUEST_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
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
