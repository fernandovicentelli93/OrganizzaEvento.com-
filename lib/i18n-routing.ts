import { getPublishedLandingPages, type LandingPage } from "@/content/landing-pages";
import { getPublishedLocalSeoPages, type LocalSeoPage } from "@/content/local-seo";
import { QuoteAnalysisPage, getAllQuoteAnalysisPages, quoteAnalysisPath, resolveQuoteAnalysisRoute } from "@/content/quote-analysis";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import { EDITORIAL_CATEGORIES } from "@/lib/editorial";
import {
  findLocalizedConversation,
  localizedConversationSlug,
  localizedCommunity,
  type LocalizedConversation
} from "@/lib/localized-community";
import { MAGAZINE_AREAS } from "@/lib/magazine";
import {
  DEFAULT_LOCALE,
  LOCALES,
  Locale,
  RouteKey,
  isLocale,
  localePrefix,
  localizedStaticPath,
  staticRouteSegments
} from "@/lib/i18n-basic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";

function cleanSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const citySlugs: Record<Locale, Record<string, string>> = {
  it: {},
  en: {
    roma: "rome",
    milano: "milan",
    napoli: "naples",
    torino: "turin",
    firenze: "florence",
    genova: "genoa",
    venezia: "venice",
    como: "lake-como",
    siracusa: "syracuse"
  },
  es: {
    roma: "roma",
    milano: "milan",
    napoli: "napoles",
    torino: "turin",
    firenze: "florencia",
    genova: "genova",
    venezia: "venecia",
    como: "como",
    siracusa: "siracusa"
  },
  fr: {
    roma: "rome",
    milano: "milan",
    napoli: "naples",
    torino: "turin",
    firenze: "florence",
    genova: "genes",
    venezia: "venise",
    como: "come",
    siracusa: "syracuse"
  }
};

const categorySlugByLocale: Record<Locale, Record<string, string>> = {
  it: Object.fromEntries(CATEGORIES.map((category) => [category.slug, category.slug])),
  en: {
    "da-dove-inizio": "where-to-start",
    "quanto-costa": "real-prices",
    location: "venues",
    "catering-menu": "catering-menu",
    "musica-dj": "music-dj",
    matrimoni: "weddings",
    "compleanni-feste-private": "birthdays-private-parties",
    "eventi-aziendali": "corporate-events",
    "problemi-fornitori": "supplier-problems",
    "idee-evento": "event-ideas",
    matrimonio: "wedding"
  },
  es: {
    "da-dove-inizio": "por-donde-empezar",
    "quanto-costa": "precios-reales",
    location: "lugares",
    "catering-menu": "catering-menu",
    "musica-dj": "musica-dj",
    matrimoni: "bodas",
    "compleanni-feste-private": "cumpleaños-fiestas-privadas",
    "eventi-aziendali": "eventos-corporativos",
    "problemi-fornitori": "problemas-proveedores",
    "idee-evento": "ideas-eventos",
    matrimonio: "boda"
  },
  fr: {
    "da-dove-inizio": "par-ou-commencer",
    "quanto-costa": "prix-réels",
    location: "lieux",
    "catering-menu": "traiteur-menu",
    "musica-dj": "musique-dj",
    matrimoni: "mariages",
    "compleanni-feste-private": "anniversaires-fêtes-privées",
    "eventi-aziendali": "événements-entreprise",
    "problemi-fornitori": "problèmes-prestataires",
    "idee-evento": "idées-événements",
    matrimonio: "mariage"
  }
};

const localCategoryPrefix: Record<Locale, Record<string, string>> = {
  it: {},
  en: {
    "location-eventi": "event-venues",
    "catering-eventi": "event-catering",
    "musica-eventi": "event-music",
    "intrattenimento-eventi": "event-entertainment",
    "fotografi-videomaker-eventi": "event-photographers-videographers",
    "event-planner": "event-planners",
    "fioristi-allestimenti": "florists-styling",
    "service-audio-luci": "audio-lighting",
    "trasporti-eventi": "event-transport",
    "hostess-promoter": "hostesses-promoters",
    "supporto-eventi": "event-support",
    "servizi-creativi-digitali": "creative-digital-services",
    "trucco-parrucco-eventi": "makeup-hair-events",
    "sicurezza-privata-eventi": "private-security-events",
    "abiti-cerimonia": "ceremony-outfits",
    "bomboniere-regali-eventi": "event-gifts-favors",
    "fedi-gioielli-matrimonio": "wedding-rings-jewelry"
  },
  es: {
    "location-eventi": "lugares-eventos",
    "catering-eventi": "catering-eventos",
    "musica-eventi": "musica-eventos",
    "intrattenimento-eventi": "entretenimiento-eventos",
    "fotografi-videomaker-eventi": "fotografos-videografos-eventos",
    "event-planner": "organizadores-eventos",
    "fioristi-allestimenti": "floristas-décoracion",
    "service-audio-luci": "audio-iluminación",
    "trasporti-eventi": "transporte-eventos",
    "hostess-promoter": "azafatas-promotores",
    "supporto-eventi": "soporte-eventos",
    "servizi-creativi-digitali": "servicios-creativos-digitales",
    "trucco-parrucco-eventi": "maquillaje-peluqueria-eventos",
    "sicurezza-privata-eventi": "seguridad-privada-eventos",
    "abiti-cerimonia": "trajes-ceremonia",
    "bomboniere-regali-eventi": "regalos-detalles-eventos",
    "fedi-gioielli-matrimonio": "alianzas-joyas-boda"
  },
  fr: {
    "location-eventi": "lieux-événements",
    "catering-eventi": "traiteur-événements",
    "musica-eventi": "musique-événements",
    "intrattenimento-eventi": "animation-événements",
    "fotografi-videomaker-eventi": "photographes-videastes-événements",
    "event-planner": "organisateurs-événements",
    "fioristi-allestimenti": "fleuristes-décoration",
    "service-audio-luci": "son-lumiere",
    "trasporti-eventi": "transport-événements",
    "hostess-promoter": "hotesses-promoteurs",
    "supporto-eventi": "support-événements",
    "servizi-creativi-digitali": "services-creatifs-digitaux",
    "trucco-parrucco-eventi": "maquillage-coiffure-événements",
    "sicurezza-privata-eventi": "sécurité-privee-événements",
    "abiti-cerimonia": "tenues-cérémonie",
    "bomboniere-regali-eventi": "cadeaux-invités-événements",
    "fedi-gioielli-matrimonio": "alliances-bijoux-mariage"
  }
};

const terms: Record<Locale, Record<string, string>> = {
  it: {},
  en: {
    "Matrimonio": "Wedding",
    "Compleanni e feste private": "Birthdays and private parties",
    "Evento aziendale": "Corporate event",
    "Eventi aziendali": "Corporate events",
    "Idee evento": "Event ideas",
    "Catering e Gastronomia": "Catering and food",
    "Location": "Venues",
    "Musica": "Music",
    "Fornitori": "Suppliers",
    "Preventivo": "Quote"
  },
  es: {
    "Matrimonio": "Boda",
    "Compleanni e feste private": "Cumpleaños y fiestas privadas",
    "Evento aziendale": "Evento corporativo",
    "Eventi aziendali": "Eventos corporativos",
    "Idee evento": "Ideas para eventos",
    "Catering e Gastronomia": "Catering y gastronomía",
    "Location": "Lugares",
    "Musica": "Música",
    "Fornitori": "Proveedores",
    "Preventivo": "Presupuesto"
  },
  fr: {
    "Matrimonio": "Mariage",
    "Compleanni e feste private": "Anniversaires et fêtes privées",
    "Evento aziendale": "événement d'entreprise",
    "Eventi aziendali": "événements d'entreprise",
    "Idee evento": "Idées d'événement",
    "Catering e Gastronomia": "Traiteur et gastronomie",
    "Location": "Lieux",
    "Musica": "Musique",
    "Fornitori": "Prestataires",
    "Preventivo": "Devis"
  }
};

export function t(locale: Locale, value: string) {
  return terms[locale][value] ?? value;
}

function localizedPlaceSlug(locale: Locale, originalSlug: string, label: string) {
  if (locale === "it") return originalSlug;
  return citySlugs[locale][originalSlug] ?? cleanSlug(label);
}

export function localizedCategorySlug(locale: Locale, slug: string) {
  return categorySlugByLocale[locale][slug] ?? cleanSlug(t(locale, slug));
}

function originalCategoryFromLocalized(locale: Locale, localizedSlug: string) {
  return Object.entries(categorySlugByLocale[locale]).find(([, value]) => value === localizedSlug)?.[0] ?? null;
}

export function localizedGuideSlug(page: LandingPage, locale: Locale) {
  if (locale === "it") return page.slug;
  const translatedEvent = cleanSlug(t(locale, page.eventType));
  const place = localizedPlaceSlug(locale, page.city.toLowerCase().replace(/\s+/g, "-"), page.city);
  const intent =
    page.slug.includes("quanto-costa") ? { en: "costs", es: "costes", fr: "couts" }[locale] :
    page.slug.includes("location") ? { en: "venues", es: "lugares", fr: "lieux" }[locale] :
    page.slug.includes("catering") ? { en: "catering", es: "catering", fr: "traiteur" }[locale] :
    page.slug.includes("musica") ? { en: "music-dj", es: "musica-dj", fr: "musique-dj" }[locale] :
    page.slug.includes("preventivo") ? { en: "quote", es: "presupuesto", fr: "devis" }[locale] :
    page.slug.includes("problemi") ? { en: "supplier-problems", es: "problemas-proveedores", fr: "problèmes-prestataires" }[locale] :
    page.slug.includes("idée") ? { en: "event-ideas", es: "ideas-eventos", fr: "idées-evenements" }[locale] :
    { en: "planning", es: "organizar", fr: "organiser" }[locale];
  return `${intent}-${translatedEvent}-${place}`;
}

export function localizedLocalSeoSlug(page: LocalSeoPage, locale: Locale) {
  if (locale === "it") return page.slug;
  const originalPrefix = Object.keys(localCategoryPrefix.en).find((prefix) => page.slug.startsWith(`${prefix}-`));
  const prefix = originalPrefix ? localCategoryPrefix[locale][originalPrefix] : cleanSlug(t(locale, page.categoryName));
  if (page.kind === "region") return `${prefix}-${cleanSlug(page.region)}`;
  if (page.kind === "province") return `${prefix}-${locale === "fr" ? "province" : locale === "en" ? "province" : "provincia"}-${cleanSlug(page.province)}`;
  const originalCitySlug = originalPrefix ? page.slug.replace(`${originalPrefix}-`, "") : cleanSlug(page.city);
  return `${prefix}-${localizedPlaceSlug(locale, originalCitySlug, page.city)}`;
}

type ResolvedLocalizedRoute =
  | { type: "home" }
  | { type: "static"; key: RouteKey }
  | { type: "category"; slug: string }
  | { type: "guideList" }
  | { type: "guide"; page: LandingPage }
  | { type: "localizedConversation"; locale: Exclude<Locale, "it">; conversation: LocalizedConversation }
  | { type: "localSeo"; page: LocalSeoPage }
  | { type: "magazineCategory"; slug: string }
  | { type: "quoteAnalysis"; page: QuoteAnalysisPage };

export function localizedPath(locale: Locale, route: ResolvedLocalizedRoute): string {
  if (route.type === "home") return locale === "it" ? "/" : `/${locale}/`;
  if (route.type === "static") return localizedStaticPath(locale, route.key);
  if (route.type === "category") return `${localizedStaticPath(locale, "topics")}/${localizedCategorySlug(locale, route.slug)}`;
  if (route.type === "guideList") return localizedStaticPath(locale, "eventGuides");
  if (route.type === "guide") return `${localizedStaticPath(locale, "eventGuides")}/${localizedGuideSlug(route.page, locale)}`;
  if (route.type === "localizedConversation") {
    if (locale === "it") return localizedStaticPath("it", "questions");
    const sourceList = localizedCommunity[route.locale].conversations;
    const targetList = localizedCommunity[locale].conversations;
    const sourceIndex = sourceList.findIndex((conversation) => localizedConversationSlug(conversation) === localizedConversationSlug(route.conversation));
    const targetConversation = targetList[sourceIndex] ?? route.conversation;
    return `${localizedStaticPath(locale, "questions")}/${localizedConversationSlug(targetConversation)}`;
  }
  if (route.type === "localSeo") return `${localePrefix(locale)}/${localizedLocalSeoSlug(route.page, locale)}`;
  if (route.type === "quoteAnalysis") return quoteAnalysisPath(locale, route.page);
  if (route.type === "magazineCategory") {
    const categoriesSegment = locale === "it" ? "categorie" : locale === "es" ? "categorias" : "categories";
    return `${localizedStaticPath(locale, "magazine")}/${categoriesSegment}/${localizedCategorySlug(locale, route.slug)}`;
  }
  return localizedStaticPath(locale, "home");
}

export function absoluteLocalizedUrl(locale: Locale, route: ResolvedLocalizedRoute) {
  return `${siteUrl}${localizedPath(locale, route)}`;
}

export function alternatesFor(route: ResolvedLocalizedRoute) {
  const languages = Object.fromEntries(LOCALES.map((locale) => [locale, absoluteLocalizedUrl(locale, route)]));
  return {
    canonical: absoluteLocalizedUrl(DEFAULT_LOCALE, route),
    languages: {
      ...languages,
      "x-default": absoluteLocalizedUrl(DEFAULT_LOCALE, route)
    }
  };
}

export function selfAlternates(locale: Locale, route: ResolvedLocalizedRoute) {
  const languages = Object.fromEntries(LOCALES.map((item) => [item, absoluteLocalizedUrl(item, route)]));
  return {
    canonical: absoluteLocalizedUrl(locale, route),
    languages: {
      ...languages,
      "x-default": absoluteLocalizedUrl(DEFAULT_LOCALE, route)
    }
  };
}

function staticKeyFromSegment(locale: Locale, segment: string): RouteKey | null {
  return (Object.entries(staticRouteSegments[locale]).find(([, value]) => value === segment)?.[0] as RouteKey | undefined) ?? null;
}

export function resolveLocalizedRoute(locale: Locale, path: string[]): ResolvedLocalizedRoute | null {
  if (path.length === 0) return { type: "home" };

  const [first, second, third] = path;
  const key = staticKeyFromSegment(locale, first);
  if (key === "analyzeQuote" && second) {
    const quoteRoute = resolveQuoteAnalysisRoute(locale, path.slice(1));
    return quoteRoute ? { type: "quoteAnalysis", page: quoteRoute } : null;
  }
  if (key === "eventGuides" && !second) return { type: "guideList" };
  if (key === "eventGuides" && second) {
    const page = getPublishedLandingPages().find((item) => localizedGuideSlug(item, locale) === second);
    return page ? { type: "guide", page } : null;
  }
  if (key === "questions" && second) {
    if (locale === "it") return null;
    const conversation = findLocalizedConversation(locale as Exclude<Locale, "it">, second);
    return conversation ? { type: "localizedConversation", locale: locale as Exclude<Locale, "it">, conversation } : null;
  }
  if (key === "topics" && second) {
    const slug = originalCategoryFromLocalized(locale, second);
    return slug ? { type: "category", slug } : null;
  }
  if (key === "magazine" && second && third) {
    const categorySegment = locale === "it" ? "categorie" : locale === "es" ? "categorias" : "categories";
    if (second === categorySegment) {
      const slug = originalCategoryFromLocalized(locale, third);
      return slug ? { type: "magazineCategory", slug } : null;
    }
  }
  if (key) return { type: key === "eventGuides" ? "guideList" : "static", key };

  const localSeoPage = getPublishedLocalSeoPages().find((page) => localizedLocalSeoSlug(page, locale) === first);
  if (localSeoPage) return { type: "localSeo", page: localSeoPage };
  return null;
}

export function resolveItalianPath(pathname: string): ResolvedLocalizedRoute {
  const path = pathname.split("?")[0].split("/").filter(Boolean);
  if (path.length === 0) return { type: "home" };
  const [first, second, third] = path;
  const key = staticKeyFromSegment("it", first);
  if (key === "analyzeQuote" && second) {
    const quoteRoute = resolveQuoteAnalysisRoute("it", path.slice(1));
    if (quoteRoute) return { type: "quoteAnalysis", page: quoteRoute };
  }
  if (key === "eventGuides" && second) {
    const page = getPublishedLandingPages().find((item) => item.slug === second);
    if (page) return { type: "guide", page };
  }
  if (key === "eventGuides") return { type: "guideList" };
  if (key === "topics" && second) return { type: "category", slug: second };
  if (key === "magazine" && second === "categorie" && third) return { type: "magazineCategory", slug: third };
  if (key) return { type: "static", key };
  const localSeoPage = getPublishedLocalSeoPages().find((page) => page.slug === first);
  if (localSeoPage) return { type: "localSeo", page: localSeoPage };
  return { type: "home" };
}

export function localizedMetadata(locale: Locale, route: ResolvedLocalizedRoute, title: string, description: string) {
  return {
    title,
    description,
    alternates: selfAlternates(locale, route),
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: locale === "it" ? "it_IT" : locale === "en" ? "en_US" : locale === "es" ? "es_ES" : "fr_FR",
      type: "website",
      url: absoluteLocalizedUrl(locale, route)
    }
  };
}

export function allLocalizedSitemapRoutes(locale: Locale): ResolvedLocalizedRoute[] {
  const staticRoutes: ResolvedLocalizedRoute[] = [
    { type: "home" },
    ...(["questions", "ask", "realPrices", "topics", "magazine", "eventGuides", "localSuppliers", "suppliers", "analyzeQuote", "findSuppliers", "partnerships", "faq", "rules", "privacy", "terms", "signup", "login"] as RouteKey[]).map((key) => ({ type: "static", key }) as ResolvedLocalizedRoute)
  ];

  const categoryRoutes: ResolvedLocalizedRoute[] = [
    ...CATEGORIES.map((category) => ({ type: "category", slug: category.slug }) as ResolvedLocalizedRoute),
    ...MAGAZINE_AREAS.map((area) => ({ type: "category", slug: area.slug }) as ResolvedLocalizedRoute),
    ...EDITORIAL_CATEGORIES.map((category) => ({ type: "magazineCategory", slug: category.slug }) as ResolvedLocalizedRoute)
  ];

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...getPublishedLandingPages().map((page) => ({ type: "guide", page }) as ResolvedLocalizedRoute),
    ...(locale === "it"
      ? []
      : localizedCommunity[locale as Exclude<Locale, "it">].conversations.map(
          (conversation) => ({ type: "localizedConversation", locale: locale as Exclude<Locale, "it">, conversation }) as ResolvedLocalizedRoute
        )),
    ...getPublishedLocalSeoPages().map((page) => ({ type: "localSeo", page }) as ResolvedLocalizedRoute),
    ...getAllQuoteAnalysisPages(locale).filter((page) => page.indexable).map((page) => ({ type: "quoteAnalysis", page }) as ResolvedLocalizedRoute)
  ];
}

export function localeFromParam(value: string): Locale | null {
  return isLocale(value) && value !== "it" ? value : null;
}
