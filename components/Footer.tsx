"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME, VIBES_PLANNER_URL } from "@/lib/constants";
import { footerCopy, localeFromPathname, localizedStaticPath } from "@/lib/i18n-basic";

export function Footer() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const copy = footerCopy[locale];
  const supplierFinderCopy =
    locale === "it"
      ? {
          label: "Cerco Fornitori",
          title: "Trova fornitori con AI e Vibes Planner.",
          text: "Scegli il primo fornitore, aggiungi le altre categorie e mantieni sempre attivi zona, invitati e budget.",
          button: "Cerco Fornitori"
        }
      : locale === "en"
        ? {
            label: "Find Suppliers",
            title: "Find Italian suppliers with AI and Vibes Planner.",
            text: "Choose your first supplier, add more categories and keep area, guests and budget active.",
            button: "Find Suppliers"
          }
        : locale === "es"
          ? {
              label: "Buscar Proveedores",
              title: "Encuentra proveedores italianos con AI y Vibes Planner.",
              text: "Elige el primer proveedor, anade categorias y conserva zona, invitados y presupuesto.",
              button: "Buscar Proveedores"
            }
          : {
              label: "Trouver des Prestataires",
              title: "Trouvez des prestataires italiens avec AI et Vibes Planner.",
              text: "Choisissez le premier prestataire, ajoutez des categories et gardez zone, invites et budget.",
              button: "Trouver des Prestataires"
            };
  const cookiePreferencesLabel =
    locale === "it" ? "Preferenze cookie" : locale === "en" ? "Cookie preferences" : locale === "es" ? "Preferencias de cookies" : "Preferences cookies";
  const supportText =
    locale === "it"
      ? "Per assistenza usa il widget supporto in basso a destra."
      : locale === "en"
        ? "For support, use the help widget in the lower-right corner."
        : locale === "es"
          ? "Para recibir ayuda, usa el widget de soporte en la esquina inferior derecha."
          : "Pour obtenir de l'aide, utilisez le widget de support en bas a droite.";
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
            {locale === "it" ? "Quanto costa" : locale === "en" ? "How much does it cost" : locale === "es" ? "Cuanto cuesta" : "Combien ca coute"}
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "topics")}>
            {locale === "it" ? "Eventi" : locale === "en" ? "Events" : locale === "es" ? "Eventos" : "Evenements"}
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "magazine")}>
            Magazine
          </Link>
          <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "eventGuides")}>
            {locale === "it" ? "Guide pratiche" : locale === "en" ? "Practical guides" : locale === "es" ? "Guias practicas" : "Guides pratiques"}
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

        <section className="rounded-md border border-line bg-white/80 p-4 shadow-sm" aria-label={supplierFinderCopy.label}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{supplierFinderCopy.label}</p>
          <h2 className="mt-2 text-lg font-semibold leading-tight text-ink">{supplierFinderCopy.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{supplierFinderCopy.text}</p>
          <Link
            className="focus-ring mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-violet-cta px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-hover"
            href={localizedStaticPath(locale, "findSuppliers")}
          >
            <Image src="/partners/vibes-planner/logo.jpg" alt="" width={24} height={24} className="h-6 w-6 rounded-md bg-white object-contain" />
            {supplierFinderCopy.button}
          </Link>
          {locale === "it" ? (
            <Link
              className="focus-ring mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-petal"
              href="/richiesta-fornitori"
            >
              Invia richiesta fornitori
            </Link>
          ) : null}
        </section>

        <div>
          <p className="font-semibold text-ink">{copy.contacts}</p>
          <p className="mt-2 leading-6">{supportText}</p>
          <nav aria-label="Link legali" className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "rules")}>
              {locale === "it" ? "Regole" : locale === "en" ? "Rules" : locale === "es" ? "Reglas" : "Regles"}
            </Link>
            <Link className="focus-ring hover:text-ink" href="/privacy-policy/">
              Privacy Policy
            </Link>
            <Link className="focus-ring hover:text-ink" href="/cookie-policy/">
              Cookie Policy
            </Link>
            <Link className="focus-ring hover:text-ink" href={localizedStaticPath(locale, "terms")}>
              {locale === "it" ? "Termini" : locale === "en" ? "Terms" : locale === "es" ? "Terminos" : "Conditions"}
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
