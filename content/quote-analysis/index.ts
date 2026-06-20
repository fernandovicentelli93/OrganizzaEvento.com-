import crypto from "node:crypto";
import municipalityData from "@/content/quote-analysis/generated/italian-municipalities.json";
import { DEFAULT_LOCALE, LOCALES, Locale, localePrefix, localizedStaticPath } from "@/lib/i18n-basic";

export type QuoteServiceSlug = "dj" | "band" | "fotografo";
export type QuotePageType = "hub" | "service" | "region" | "city";
export type PriorityTier = "P0" | "P1" | "P2" | "P3";

export type QuoteMunicipality = {
  istatCode: string;
  comuneName: string;
  comuneSlug: string;
  provinciaSigla: string;
  provinciaNome: string;
  provinciaCode: string;
  regioneNome: string;
  regioneSlug: string;
  isCapoluogo: boolean;
  isMetropolitanCityCapital: boolean;
  isLiberoConsorzioCapital: boolean;
  population: number | null;
  latitude: number | null;
  longitude: number | null;
  active: boolean;
  sourceUpdatedAt: string;
  importedAt: string;
};

export type QuoteService = {
  id: QuoteServiceSlug;
  slug: QuoteServiceSlug;
  nameSingular: string;
  namePlural: string;
  schemaType: string;
  categoryHref: string;
  active: boolean;
  quoteCheckFields: string[];
  commonHiddenCosts: string[];
  requiredQuoteItems: string[];
  serviceSpecificQuestions: string[];
  benchmarkLogic: string;
};

export type QuoteAnalysisPage = {
  pageType: QuotePageType;
  service?: QuoteService;
  municipality?: QuoteMunicipality;
  regionSlug?: string;
  regionName?: string;
  url: string;
  localizedUrls: Record<Locale, string>;
  title: string;
  metaDescription: string;
  h1: string;
  canonical: string;
  robots: "index, follow" | "noindex, follow";
  indexable: boolean;
  qualityScore: number;
  finalPriorityScore: number;
  priorityTier: PriorityTier;
  contentFingerprint: string;
  lastSignificantUpdate: string;
  statusCodeExpected: 200;
  reason: string;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";
const lastSignificantUpdate = "2026-06-15";

export const quoteServices: QuoteService[] = [
  {
    id: "dj",
    slug: "dj",
    nameSingular: "DJ",
    namePlural: "DJ",
    schemaType: "Service",
    categoryHref: "/categorie/musica-dj",
    active: true,
    quoteCheckFields: ["ore musica", "impianto audio", "luci", "microfoni", "SIAE citata", "extra orario", "trasferta"],
    commonHiddenCosts: ["ore extra", "impianto non incluso", "luci escluse", "trasferta", "permessi musicali", "setup separati"],
    requiredQuoteItems: ["durata", "orario montaggio", "cosa include l'impianto", "referente evento", "condizioni extra orario"],
    serviceSpecificQuestions: [
      "L'impianto audio è dimensionato per numero ospiti e spazio?",
      "Luci, microfoni e console sono inclusi o a parte?",
      "Quanto costa ogni ora extra dopo l'orario concordato?",
      "SIAE o permessi musicali sono solo citati o davvero inclusi?"
    ],
    benchmarkLogic: "Usare benchmark città se sample >= 10, altrimenti provincia, regione o fallback Italia con confidenza dichiarata."
  },
  {
    id: "band",
    slug: "band",
    nameSingular: "band",
    namePlural: "band",
    schemaType: "Service",
    categoryHref: "/categorie/musica-dj",
    active: true,
    quoteCheckFields: ["numero musicisti", "durata live", "numero set", "tecnico audio", "impianto", "DJ set", "trasferta"],
    commonHiddenCosts: ["tecnico audio separato", "pasti staff", "pernottamento", "DJ set aggiuntivo", "prove extra", "richieste scaletta"],
    requiredQuoteItems: ["numero musicisti", "durata set", "impianto incluso", "tecnico incluso", "pasti e trasferte"],
    serviceSpecificQuestions: [
      "Quanti musicisti sono inclusi nel prezzo?",
      "Il tecnico audio è incluso o arriva come voce separata",
      "Il DJ set dopo il live è incluso o è un extra",
      "Pasti, trasferta e pernottamento sono già conteggiati"
    ],
    benchmarkLogic: "Per band il confronto deve separare numero musicisti, set live, tecnico, impianto e trasferte."
  },
  {
    id: "fotografo",
    slug: "fotografo",
    nameSingular: "fotografo",
    namePlural: "fotografi",
    schemaType: "Service",
    categoryHref: "/categorie/matrimoni",
    active: true,
    quoteCheckFields: ["ore copertura", "numero fotografi", "secondo shooter", "post-produzione", "album", "file raw", "diritti uso"],
    commonHiddenCosts: ["secondo fotografo", "album", "extra orario", "trasferta", "consegna veloce", "video separato", "raw file"],
    requiredQuoteItems: ["ore copertura", "numero foto consegnate", "post-produzione", "tempi consegna", "diritti utilizzo"],
    serviceSpecificQuestions: [
      "Quante ore reali di copertura sono incluse?",
      "Il secondo fotografo è compreso o è un extra?",
      "Album, post-produzione e tempi di consegna sono scritti chiaramente?",
      "I file raw e i diritti di utilizzo sono inclusi o esclusi?"
    ],
    benchmarkLogic: "Per fotografo il prezzo va letto insieme a ore, numero fotografi, post-produzione, album e diritti."
  }
];

const serviceSlugs: Record<Locale, Record<QuoteServiceSlug, string>> = {
  it: { dj: "dj", band: "band", fotografo: "fotografo" },
  en: { dj: "dj", band: "band", fotografo: "photographer" },
  es: { dj: "dj", band: "banda", fotografo: "fotografo" },
  fr: { dj: "dj", band: "groupe", fotografo: "photographe" }
};

const serviceLabels: Record<Locale, Record<QuoteServiceSlug, string>> = {
  it: { dj: "DJ", band: "band", fotografo: "fotografo" },
  en: { dj: "DJ", band: "band", fotografo: "photographer" },
  es: { dj: "DJ", band: "banda", fotografo: "fotografo" },
  fr: { dj: "DJ", band: "groupe", fotografo: "photographe" }
};

const regionSlugs: Record<Locale, Record<string, string>> = {
  it: {},
  en: {
    abruzzo: "abruzzo",
    basilicata: "basilicata",
    calabria: "calabria",
    campania: "campania",
    "emilia-romagna": "emilia-romagna",
    "friuli-venezia-giulia": "friuli-venezia-giulia",
    lazio: "lazio",
    liguria: "liguria",
    lombardía: "lombardy",
    marche: "marche",
    molise: "molise",
    piemonte: "piedmont",
    puglia: "apulia",
    sardegna: "sardinia",
    sicilia: "sicily",
    toscana: "tuscany",
    "trentino-alto-adige": "trentino-south-tyrol",
    umbria: "umbria",
    "valle-d-aosta": "aosta-valley",
    veneto: "veneto"
  },
  es: {
    lombardía: "lombardía",
    piemonte: "piamonte",
    puglia: "apulia",
    sardegna: "cerdena",
    sicilia: "sicilia",
    toscana: "toscana",
    "trentino-alto-adige": "trentino-alto-adigio",
    "valle-d-aosta": "valle-de-aosta"
  },
  fr: {
    lombardía: "lombardie",
    piemonte: "piemont",
    puglia: "pouilles",
    sardegna: "sardaigne",
    sicilia: "sicile",
    toscana: "toscane",
    "trentino-alto-adige": "trentin-haut-adige",
    "valle-d-aosta": "vallee-d-aoste"
  }
};

const citySlugOverrides: Record<Locale, Record<string, string>> = {
  it: {},
  en: { milano: "milan", roma: "rome", napoli: "naples", torino: "turin", firenze: "florence", genova: "genoa", venezia: "venice" },
  es: { milano: "milan", napoli: "napoles", torino: "turin", firenze: "florencia", venezia: "venecia" },
  fr: { milano: "milan", roma: "rome", napoli: "naples", torino: "turin", firenze: "florence", genova: "genes", venezia: "venise" }
};

const manualPriorityBoostCities = new Set([
  "milano",
  "roma",
  "napoli",
  "torino",
  "bologna",
  "firenze",
  "venezia",
  "verona",
  "padova",
  "monza",
  "bergamo",
  "brescia",
  "parma",
  "modena",
  "reggio-nellemilia",
  "bolzano",
  "trento",
  "genova",
  "bari",
  "palermo",
  "cagliari",
  "como",
  "varese",
  "lecco",
  "treviso",
  "vicenza",
  "rimini"
]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fingerprint(parts: Array<string | number | undefined>) {
  return crypto.createHash("sha1").update(parts.filter(Boolean).join("|")).digest("hex");
}

export const allMunicipalities = (municipalityData.municipalities as QuoteMunicipality[]).filter((item) => item.active);
export const capitalMunicipalities = allMunicipalities.filter((item) => item.isCapoluogo);

export const quoteRegions = Array.from(
  new Map(capitalMunicipalities.map((item) => [item.regioneSlug, { slug: item.regioneSlug, name: item.regioneNome }])).values()
).sort((a, b) => a.name.localeCompare(b.name, "it"));

function translatedRegionSlug(regionSlug: string, locale: Locale) {
  return regionSlugs[locale][regionSlug] ?? regionSlug;
}

function originalRegionSlugFromLocalized(localizedSlug: string, locale: Locale) {
  if (locale === "it") return quoteRegions.some((region) => region.slug === localizedSlug) ? localizedSlug : null;
  const direct = Object.entries(regionSlugs[locale]).find(([, value]) => value === localizedSlug)?.[0];
  if (direct) return direct;
  return quoteRegions.some((region) => region.slug === localizedSlug) ? localizedSlug : null;
}

function translatedCitySlug(municipality: QuoteMunicipality, locale: Locale) {
  return citySlugOverrides[locale][municipality.comuneSlug] ?? municipality.comuneSlug;
}

function originalServiceFromLocalized(slug: string, locale: Locale) {
  const entry = Object.entries(serviceSlugs[locale]).find(([, value]) => value === slug);
  return entry?.[0] as QuoteServiceSlug | undefined;
}

export function getServiceLabel(service: QuoteService, locale: Locale) {
  return serviceLabels[locale][service.id];
}

export function quoteAnalysisPath(locale: Locale, page: Pick<QuoteAnalysisPage, "pageType" | "service" | "municipality" | "regionSlug">) {
  const base = localizedStaticPath(locale, "analyzeQuote");
  if (page.pageType === "hub" || !page.service) return base;
  const serviceSlug = serviceSlugs[locale][page.service.id];
  if (page.pageType === "service") return `${base}/${serviceSlug}`;
  if (page.pageType === "region" && page.regionSlug) return `${base}/${serviceSlug}/${translatedRegionSlug(page.regionSlug, locale)}`;
  if (page.pageType === "city" && page.municipality) {
    return `${base}/${serviceSlug}/${translatedCitySlug(page.municipality, locale)}-${page.municipality.provinciaSigla.toLowerCase()}`;
  }
  return base;
}

export function absoluteQuoteAnalysisUrl(locale: Locale, page: Pick<QuoteAnalysisPage, "pageType" | "service" | "municipality" | "regionSlug">) {
  return `${siteUrl}${quoteAnalysisPath(locale, page)}`;
}

function scoreForMunicipality(municipality?: QuoteMunicipality, service?: QuoteService): { finalPriorityScore: number; priorityTier: PriorityTier; reason: string } {
  if (!municipality) return { finalPriorityScore: service ? 88 : 92, priorityTier: "P0", reason: "Pagina centrale con tool visibile e contenuto utile per chi confronta un preventivo evento." };
  const boosted = manualPriorityBoostCities.has(municipality.comuneSlug);
  const metro = municipality.isMetropolitanCityCapital;
  const base = metro ? 78 : boosted ? 72 : 58;
  const serviceBoost = service?.id === "fotografo" || service?.id === "dj" ? 4 : 2;
  const manualBoost = boosted ? 10 : 0;
  const score = Math.min(96, base + serviceBoost + manualBoost);
  const priorityTier: PriorityTier = score >= 85 ? "P0" : score >= 70 ? "P1" : score >= 55 ? "P2" : "P3";
  const reason = boosted
    ? `${municipality.comuneName} è una città utile per confrontare preventivi evento con contesto locale, servizi richiesti e domande pratiche.`
    : `Pagina locale per aiutare chi deve leggere un preventivo evento a ${municipality.comuneName} senza pubblicare dati sensibili.`;
  return { finalPriorityScore: score, priorityTier, reason };
}

function qualityFor(pageType: QuotePageType, municipality?: QuoteMunicipality) {
  if (pageType === "hub") return 92;
  if (pageType === "service") return 90;
  if (pageType === "region") return 86;
  return municipality ? 84 : 78;
}

function indexableFor(pageType: QuotePageType, qualityScore: number, priorityTier: PriorityTier) {
  if (pageType === "hub" || pageType === "service" || pageType === "region") return qualityScore >= 85;
  if (priorityTier === "P0") return qualityScore >= 84;
  if (priorityTier === "P1") return qualityScore >= 84;
  return false;
}

function pageCopy(locale: Locale, pageType: QuotePageType, service?: QuoteService, municipality?: QuoteMunicipality, regionName?: string) {
  const serviceLabel = service ? getServiceLabel(service, locale) : "";
  const place = municipality?.comuneName ?? regionName;
  if (locale === "en") {
    const title = municipality
      ? `Analyze a ${serviceLabel} quote in ${municipality.comuneName}`
      : service
        ? `Analyze Italian ${serviceLabel} quotes${regionName ? ` in ${regionName}` : ""}`
        : "Analyze an Italian event quote";
    return {
      title,
      h1: title,
      metaDescription: `Upload or paste an Italian ${serviceLabel || "event"} quote and compare price, extras and missing items with Italian clients and suppliers${place ? ` in ${place}` : ""}.`
    };
  }
  if (locale === "es") {
    const title = municipality
      ? `Analiza un presupuesto de ${serviceLabel} en ${municipality.comuneName}`
      : service
        ? `Analiza presupuestos italianos de ${serviceLabel}${regionName ? ` en ${regionName}` : ""}`
        : "Analiza un presupuesto italiano de evento";
    return {
      title,
      h1: title,
      metaDescription: `Sube o pega un presupuesto italiano de ${serviceLabel || "evento"} y compara precio, extras y partidas con clientes y proveedores italianos${place ? ` en ${place}` : ""}.`
    };
  }
  if (locale === "fr") {
    const title = municipality
      ? `Analyser un devis ${serviceLabel} a ${municipality.comuneName}`
      : service
        ? `Analyser des devis italiens ${serviceLabel}${regionName ? ` en ${regionName}` : ""}`
        : "Analyser un devis événementiel italien";
    return {
      title,
      h1: title,
      metaDescription: `Ajoutez ou collez un devis italien ${serviceLabel || "événementiel"} et comparez prix, extras et points manquants avec clients et prestataires italiens${place ? ` a ${place}` : ""}.`
    };
  }
  const title = municipality
    ? `Analizza un preventivo ${serviceLabel} a ${municipality.comuneName}`
    : service
      ? `Analizza preventivi ${serviceLabel}${regionName ? ` in ${regionName}` : ""}`
      : "Analizza il tuo preventivo evento";
  return {
    title,
    h1: title,
    metaDescription: `Carica o incolla un preventivo ${serviceLabel || "evento"} e controlla prezzo, extra, voci mancanti e domande da fare${place ? ` per eventi a ${place}` : ""}.`
  };
}

function makePage(locale: Locale, pageType: QuotePageType, service?: QuoteService, regionSlug?: string, municipality?: QuoteMunicipality): QuoteAnalysisPage {
  const regionName = municipality?.regioneNome ?? quoteRegions.find((region) => region.slug === regionSlug)?.name;
  const qualityScore = qualityFor(pageType, municipality);
  const score = scoreForMunicipality(municipality, service);
  const indexable = indexableFor(pageType, qualityScore, score.priorityTier);
  const copy = pageCopy(locale, pageType, service, municipality, regionName);
  const localizedUrls = Object.fromEntries(
    LOCALES.map((item) => [item, absoluteQuoteAnalysisUrl(item, { pageType, service, municipality, regionSlug })])
  ) as Record<Locale, string>;
  const url = localizedUrls[locale];
  return {
    pageType,
    service,
    municipality,
    regionSlug,
    regionName,
    url,
    localizedUrls,
    title: copy.title,
    metaDescription: copy.metaDescription,
    h1: copy.h1,
    canonical: url,
    robots: indexable ? "index, follow" : "noindex, follow",
    indexable,
    qualityScore,
    finalPriorityScore: score.finalPriorityScore,
    priorityTier: score.priorityTier,
    contentFingerprint: fingerprint([pageType, service?.id, municipality?.istatCode, regionSlug, qualityScore, score.priorityTier]),
    lastSignificantUpdate,
    statusCodeExpected: 200,
    reason: score.reason
  };
}

export function getQuoteAnalysisHubPage(locale: Locale = "it") {
  return makePage(locale, "hub");
}

export function getQuoteAnalysisServicePage(serviceSlug: QuoteServiceSlug, locale: Locale = "it") {
  const service = quoteServices.find((item) => item.slug === serviceSlug && item.active);
  return service ? makePage(locale, "service", service) : null;
}

export function getQuoteAnalysisRegionPage(serviceSlug: QuoteServiceSlug, regionSlug: string, locale: Locale = "it") {
  const service = quoteServices.find((item) => item.slug === serviceSlug && item.active);
  if (!service || !quoteRegions.some((region) => region.slug === regionSlug)) return null;
  return makePage(locale, "region", service, regionSlug);
}

export function getQuoteAnalysisCityPage(serviceSlug: QuoteServiceSlug, istatCode: string, locale: Locale = "it") {
  const service = quoteServices.find((item) => item.slug === serviceSlug && item.active);
  const municipality = capitalMunicipalities.find((item) => item.istatCode === istatCode);
  return service && municipality ? makePage(locale, "city", service, municipality.regioneSlug, municipality) : null;
}

export function resolveQuoteAnalysisRoute(locale: Locale, segments: string[]) {
  if (segments.length === 0) return getQuoteAnalysisHubPage(locale);
  const serviceSlug = originalServiceFromLocalized(segments[0], locale);
  if (!serviceSlug) return null;
  if (segments.length === 1) return getQuoteAnalysisServicePage(serviceSlug, locale);

  const second = segments[1];
  const regionSlug = originalRegionSlugFromLocalized(second, locale);
  if (regionSlug) return getQuoteAnalysisRegionPage(serviceSlug, regionSlug, locale);

  const municipality = capitalMunicipalities.find((item) => `${translatedCitySlug(item, locale)}-${item.provinciaSigla.toLowerCase()}` === second);
  if (municipality) return getQuoteAnalysisCityPage(serviceSlug, municipality.istatCode, locale);
  return null;
}

export function getAllQuoteAnalysisPages(locale: Locale = "it") {
  const pages: QuoteAnalysisPage[] = [getQuoteAnalysisHubPage(locale)];
  for (const service of quoteServices.filter((item) => item.active)) {
    pages.push(makePage(locale, "service", service));
    for (const region of quoteRegions) pages.push(makePage(locale, "region", service, region.slug));
    for (const municipality of capitalMunicipalities) pages.push(makePage(locale, "city", service, municipality.regioneSlug, municipality));
  }
  return pages;
}

export function getQuoteAnalysisPagesForSitemap(locale: Locale, serviceSlug?: QuoteServiceSlug, tier?: PriorityTier) {
  return getAllQuoteAnalysisPages(locale).filter((page) => {
    if (!page.indexable) return false;
    if (serviceSlug && page.service?.slug !== serviceSlug) return false;
    if (tier && page.priorityTier !== tier) return false;
    return page.canonical === page.url && page.statusCodeExpected === 200;
  });
}

export function quoteAnalysisAlternates(page: QuoteAnalysisPage, locale: Locale) {
  return {
    canonical: page.localizedUrls[locale],
    languages: {
      it: page.localizedUrls.it,
      en: page.localizedUrls.en,
      es: page.localizedUrls.es,
      fr: page.localizedUrls.fr,
      "x-default": page.localizedUrls[DEFAULT_LOCALE]
    }
  };
}

export function getNearbyCapitalPages(page: QuoteAnalysisPage, locale: Locale) {
  if (!page.service || !page.municipality) return [];
  return capitalMunicipalities
    .filter((item) => item.istatCode !== page.municipality?.istatCode && (item.regioneSlug === page.municipality?.regioneSlug || item.provinciaSigla !== page.municipality?.provinciaSigla))
    .slice(0, 6)
    .map((municipality) => makePage(locale, "city", page.service, municipality.regioneSlug, municipality));
}

export function quoteAnalysisStats() {
  const all = getAllQuoteAnalysisPages("it");
  return {
    services: quoteServices.filter((item) => item.active).length,
    capitalMunicipalities: capitalMunicipalities.length,
    regions: quoteRegions.length,
    totalItalianUrls: all.length,
    totalAllLanguageUrls: all.length * LOCALES.length,
    indexable: all.filter((page) => page.indexable).length,
    noindex: all.filter((page) => !page.indexable).length,
    sitemap: all.filter((page) => page.indexable && (page.pageType !== "city" || page.priorityTier === "P0")).length,
    p0: all.filter((page) => page.priorityTier === "P0").length,
    p1: all.filter((page) => page.priorityTier === "P1").length,
    p2: all.filter((page) => page.priorityTier === "P2").length,
    p3: all.filter((page) => page.priorityTier === "P3").length,
    averageQualityScore: Math.round(all.reduce((sum, page) => sum + page.qualityScore, 0) / all.length),
    averagePriorityScore: Math.round(all.reduce((sum, page) => sum + page.finalPriorityScore, 0) / all.length)
  };
}

export function quoteLocalePrefix(locale: Locale) {
  return locale === "it" ? "" : localePrefix(locale);
}
