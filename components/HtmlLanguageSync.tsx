"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function localeFromPath(pathname: string) {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr";
  return "it";
}

export function HtmlLanguageSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = localeFromPath(pathname);
  }, [pathname]);

  return null;
}
