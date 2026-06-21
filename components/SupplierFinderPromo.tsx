"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackMarketingEvent } from "@/lib/client-analytics";
import { localeFromPathname, localizedStaticPath } from "@/lib/i18n-basic";

type SupplierFinderPromoProps = {
  placement: string;
  variant?: "card" | "wide" | "inline";
  className?: string;
};

const promoCopy = {
  it: {
    label: "Cerco fornitori",
    title: "Trova fornitori con AI e Vibes Planner.",
    text: "Scegli il primo fornitore, aggiungi le altre categorie e mantieni sempre attivi zona, invitati e budget.",
    button: "Cerco Fornitori"
  },
  en: {
    label: "Find suppliers",
    title: "Find Italian suppliers with AI and Vibes Planner.",
    text: "Choose the first supplier, add the other categories and keep area, guests and budget active.",
    button: "Find Suppliers"
  },
  es: {
    label: "Buscar proveedores",
    title: "Encuentra proveedores italianos con AI y Vibes Planner.",
    text: "Elige el primer proveedor, añade las otras categorías y mantén zona, invitados y presupuesto activos.",
    button: "Buscar Proveedores"
  },
  fr: {
    label: "Trouver des prestataires",
    title: "Trouvez des prestataires italiens avec AI et Vibes Planner.",
    text: "Choisissez le premier prestataire, ajoutez les autres catégories et gardez zone, invités et budget actifs.",
    button: "Trouver des Prestataires"
  }
};

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function SupplierFinderPromo({ placement, variant = "card", className = "" }: SupplierFinderPromoProps) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const copy = promoCopy[locale];
  const viewedRef = useRef(false);
  const containerRef = useRef<HTMLElement>(null);
  const href = `${localizedStaticPath(locale, "findSuppliers")}?utm_source=organizzaevento&utm_medium=internal_cta&utm_campaign=supplier_finder&utm_content=${encodeURIComponent(
    placement
  )}`;

  useEffect(() => {
    const node = containerRef.current;
    if (!node || viewedRef.current) return;

    const trackView = () => {
      if (viewedRef.current) return;
      viewedRef.current = true;
      trackMarketingEvent("supplier_finder_promo_view", {
        placement,
        locale,
        target: localizedStaticPath(locale, "findSuppliers")
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      const timer = globalThis.setTimeout(trackView, 900);
      return () => globalThis.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.45)) {
          trackView();
          observer.disconnect();
        }
      },
      { threshold: [0.45] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [locale, placement]);

  const onClick = () => {
    trackMarketingEvent("supplier_finder_promo_click", {
      placement,
      locale,
      target: localizedStaticPath(locale, "findSuppliers")
    });
  };

  if (variant === "wide") {
    return (
      <section
        ref={containerRef}
        className={classNames(
          "rounded-md border border-line bg-white p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5",
          className
        )}
        aria-label={copy.label}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{copy.label}</p>
          <h2 className="mt-2 text-xl font-semibold leading-tight text-ink">{copy.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{copy.text}</p>
        </div>
        <Link
          href={href}
          onClick={onClick}
          className="focus-ring mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-violet-cta px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-hover sm:mt-0 sm:w-auto"
        >
          <Image src="/partners/vibes-planner/logo.jpg" alt="" width={24} height={24} className="h-6 w-6 rounded-md bg-white object-contain" />
          {copy.button}
        </Link>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className={classNames(
        "rounded-md border border-line bg-white/85 p-4 shadow-sm",
        variant === "inline" && "bg-petal/75",
        className
      )}
      aria-label={copy.label}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{copy.label}</p>
      <h2 className="mt-2 text-lg font-semibold leading-tight text-ink">{copy.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{copy.text}</p>
      <Link
        href={href}
        onClick={onClick}
        className="focus-ring mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-violet-cta px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-hover"
      >
        <Image src="/partners/vibes-planner/logo.jpg" alt="" width={24} height={24} className="h-6 w-6 rounded-md bg-white object-contain" />
        {copy.button}
      </Link>
    </section>
  );
}
