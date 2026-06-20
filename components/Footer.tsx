"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_NAME, SUPPORT_EMAIL, SUPPORT_EMAIL_LINK, VIBES_PLANNER_URL } from "@/lib/constants";
import { footerCopy, localeFromPathname, localizedStaticPath } from "@/lib/i18n-basic";

const DesktopSupplierSearch = dynamic(
  () => import("@/components/VibesSupplierSearch").then((mod) => mod.VibesSupplierSearch),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold text-ink">
        Cerco Fornitori
      </span>
    )
  }
);

export function Footer() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const copy = footerCopy[locale];
  const [showDesktopSupplierSearch, setShowDesktopSupplierSearch] = useState(false);
  const supplierFinderCopy =
    locale === "it"
      ? {
          label: "Cerco Fornitori",
          title: "Trova fornitori con AI e Vibes Planner.",
          text: "Apri la ricerca desktop: categoria, zona e servizio vengono letti dal motore AI e ordinati sulle vetrine Vibes.",
          button: "Cerco Fornitori",
          link: "Apri la pagina completa"
        }
      : locale === "en"
        ? {
            label: "Find Suppliers",
            title: "Find Italian suppliers with AI and Vibes Planner.",
            text: "Open the desktop search: category, area and service are read by the AI engine and ranked on Vibes showcases.",
            button: "Find Suppliers",
            link: "Open the full page"
          }
        : locale === "es"
          ? {
              label: "Buscar Proveedores",
              title: "Encuentra proveedores italianos con AI y Vibes Planner.",
              text: "Abre la búsqueda desktop: categoría, zona y servicio se leen con AI y se ordenan sobre vitrinas Vibes.",
              button: "Buscar Proveedores",
              link: "Abrir la página completa"
            }
          : {
              label: "Trouver des Prestataires",
              title: "Trouvez des prestataires italiens avec AI et Vibes Planner.",
              text: "Ouvrez la recherche desktop : catégorie, zone et service sont lus par l'AI et classés sur les vitrines Vibes.",
              button: "Trouver des Prestataires",
              link: "Ouvrir la page complète"
            };
  const cookiePreferencesLabel =
    locale === "it" ? "Preferenze cookie" : locale === "en" ? "Cookie preferences" : locale === "es" ? "Preferencias de cookies" : "Préférences cookies";
  const isLegalPage = [
    "/privacy",
    "/privacy-policy",
    "/cookie-policy",
    "/termini",
    "/regole",
    "/condizioni-commerciali",
    "/terms",
    "/conditions"
  ].some((segment) => pathname.endsWith(segment));

  const openCookiePreferences = () => {
    window.dispatchEvent(new Event("organizzaevento:open-cookie-preferences"));
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setShowDesktopSupplierSearch(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return (
    <footer className="border-t border-line bg-petal">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:max-w-7xl lg:grid-cols-[1.15fr_0.72fr_0.86fr_0.82fr]">
        <div>
          <Image src="/brand/logo.png" alt={SITE_NAME} width={2400} height={720} className="h-12 w-auto object-contain" />
          <p className="mt-4 max-w-md leading-7">{copy.description}</p>
          {!isLegalPage ? (
            <Link
              href={VIBES_PLANNER_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="focus-ring mt-5 inline-flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 transition hover:bg-cream"
              aria-label="Visita Vibes Planner"
            >
              <Image
                src="/partners/vibes-planner/logo.jpg"
                alt="Vibes Planner"
                width={180}
                height={180}
                className="h-10 w-10 rounded-lg object-contain"
              />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">
                  {copy.collaboration}
                </span>
                <span className="block font-semibold text-ink">Vibes Planner</span>
              </span>
            </Link>
          ) : null}
        </div>

        <nav aria-label="Navigazione footer" className="grid gap-2">
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "questions")}>
            {locale === "it" ? "Domande" : locale === "es" ? "Preguntas" : "Questions"}
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "realPrices")}>
            {locale === "it" ? "Quanto costa" : locale === "en" ? "How much does it cost" : locale === "es" ? "Cuánto cuesta" : "Combien ça coûte"}
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "topics")}>
            {locale === "it" ? "Eventi" : locale === "en" ? "Events" : locale === "es" ? "Eventos" : "Événements"}
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "magazine")}>
            Magazine
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "eventGuides")}>
            {locale === "it" ? "Guide pratiche" : locale === "en" ? "Practical guides" : locale === "es" ? "Guías prácticas" : "Guides pratiques"}
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "localSuppliers")}>
            {locale === "it" ? "Fornitori locali" : locale === "en" ? "Local suppliers" : locale === "es" ? "Proveedores locales" : "Prestataires locaux"}
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "suppliers")}>
            {locale === "it" ? "Area fornitori" : locale === "en" ? "Supplier area" : locale === "es" ? "Area proveedores" : "Espace prestataires"}
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "analyzeQuote")}>
            {locale === "it" ? "Analizza preventivo" : locale === "en" ? "Analyze quote" : locale === "es" ? "Analizar presupuesto" : "Analyser devis"}
          </Link>
        </nav>

        {showDesktopSupplierSearch ? (
          <section className="hidden rounded-md border border-line bg-white/80 p-4 shadow-sm lg:block" aria-label={supplierFinderCopy.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{supplierFinderCopy.label}</p>
            <h2 className="mt-2 text-lg font-semibold leading-tight text-ink">{supplierFinderCopy.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{supplierFinderCopy.text}</p>
            <DesktopSupplierSearch locale={locale} variant="light" className="mt-4 w-full rounded-md shadow-none">
              {supplierFinderCopy.button}
            </DesktopSupplierSearch>
            <Link className="mt-3 inline-flex text-xs font-semibold text-violet-cta hover:text-violet-hover" href={localizedStaticPath(locale, "findSuppliers")}>
              {supplierFinderCopy.link}
            </Link>
          </section>
        ) : null}

        <div>
          <p className="font-semibold text-ink">{copy.contacts}</p>
          <p className="mt-2 leading-6">
            {copy.contactText}{" "}
            <a className="font-semibold text-violet-cta hover:text-violet-hover" href={SUPPORT_EMAIL_LINK}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <nav aria-label="Link legali" className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "rules")}>
              {locale === "it" ? "Regole" : locale === "en" ? "Rules" : locale === "es" ? "Reglas" : "Règles"}
            </Link>
            <Link className="focus-ring hover:text-ink" href="/privacy-policy/">
              Privacy Policy
            </Link>
            <Link className="focus-ring hover:text-ink" href="/cookie-policy/">
              Cookie Policy
            </Link>
            <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "terms")}>
              {locale === "it" ? "Termini" : locale === "en" ? "Terms" : locale === "es" ? "Términos" : "Conditions"}
            </Link>
            <Link className="focus-ring hover:text-ink" href="/condizioni-commerciali/">
              Condizioni commerciali
            </Link>
            <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "partnerships")}>
              {locale === "it" ? "Collaborazioni" : locale === "en" ? "Partnerships" : locale === "es" ? "Colaboraciones" : "Partenariats"}
            </Link>
            <button className="focus-ring text-left hover:text-ink" type="button" onClick={openCookiePreferences}>
              {cookiePreferencesLabel}
            </button>
          </nav>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted">
          © {new Date().getFullYear()} OrganizzaEvento.com
        </div>
      </div>
    </footer>
  );
}
