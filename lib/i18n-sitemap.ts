import { Locale } from "@/lib/i18n-basic";
import { getAllInternationalEventGuides, internationalEventGuidePriority } from "@/content/international-seo";
import { getAllQuoteAnalysisPages } from "@/content/quote-analysis";
import { absoluteLocalizedUrl, allLocalizedSitemapRoutes } from "@/lib/i18n-routing";
import {
  SitemapEntry,
  getAllLocalSeoSitemapEntries,
  getCommunitySitemapEntries,
  getGuideEventsSitemapEntries,
  getMagazineSitemapEntries,
  getMainSitemapEntries
} from "@/lib/sitemap-xml";

function localizedPriority(route: ReturnType<typeof allLocalizedSitemapRoutes>[number]) {
  if (route.type === "home") return 1;
  if (route.type === "quoteAnalysis") {
    if (route.page.pageType === "hub") return 0.92;
    if (route.page.pageType === "service") return 0.9;
    if (route.page.pageType === "region") return 0.84;
    return route.page.priorityTier === "P0" ? 0.82 : 0.76;
  }
  if (route.type === "localSeo") return route.page.kind === "city" ? 0.82 : 0.76;
  if (route.type === "guide") return 0.8;
  if (route.type === "localizedConversation") return 0.82;
  if (route.type === "guideList") return 0.86;
  if (route.type === "category" || route.type === "magazineCategory") return 0.74;
  if (route.type === "static" && ["localSuppliers", "suppliers", "findSuppliers", "analyzeQuote"].includes(route.key)) return 0.86;
  return 0.7;
}

function localizedChangefreq(route: ReturnType<typeof allLocalizedSitemapRoutes>[number]): SitemapEntry["changefreq"] {
  if (route.type === "home") return "daily";
  if (route.type === "quoteAnalysis") return route.page.pageType === "city" ? "monthly" : "weekly";
  if (route.type === "guide" || route.type === "localSeo") return "monthly";
  return "weekly";
}

function localizedLastmod(route: ReturnType<typeof allLocalizedSitemapRoutes>[number]) {
  if (route.type === "guide") return route.page.updatedAt;
  if (route.type === "localSeo") return route.page.lastmod;
  if (route.type === "quoteAnalysis") return route.page.lastSignificantUpdate;
  return undefined;
}

export async function getLanguageSitemapEntries(locale: Locale): Promise<SitemapEntry[]> {
  if (locale === "it") {
    const [communityEntries, magazineEntries] = await Promise.all([getCommunitySitemapEntries(), getMagazineSitemapEntries()]);
    return [
      ...getMainSitemapEntries(),
      ...communityEntries,
      ...magazineEntries,
      ...getGuideEventsSitemapEntries(),
      ...getAllLocalSeoSitemapEntries(),
      ...getAllQuoteAnalysisPages("it")
        .filter((page) => page.indexable)
        .map((page) => ({
          loc: page.url,
          lastmod: page.lastSignificantUpdate,
          changefreq: page.pageType === "city" ? ("monthly" as const) : ("weekly" as const),
          priority: page.pageType === "hub" ? 0.92 : page.pageType === "service" ? 0.9 : page.pageType === "region" ? 0.84 : page.priorityTier === "P0" ? 0.82 : 0.76
        }))
    ];
  }

  const localizedEntries = allLocalizedSitemapRoutes(locale).map((route) => ({
    loc: absoluteLocalizedUrl(locale, route),
    lastmod: localizedLastmod(route),
    changefreq: localizedChangefreq(route),
    priority: localizedPriority(route)
  }));

  if (locale !== "en") return localizedEntries;

  return [
    ...localizedEntries,
    ...getAllInternationalEventGuides().map((page) => ({
      loc: `https://organizzaevento.com/en/${page.slug}`,
      lastmod: page.lastmod,
      changefreq: "monthly" as const,
      priority: internationalEventGuidePriority(page)
    }))
  ];
}
