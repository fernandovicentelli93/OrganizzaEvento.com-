import { gzipSync } from "node:zlib";
import { LOCALES, type Locale } from "@/lib/i18n-basic";
import { SitemapEntry, urlSetXml } from "@/lib/sitemap-xml";
import {
  getAllQuoteAnalysisPages,
  getQuoteAnalysisPagesForSitemap,
  quoteServices,
  type PriorityTier,
  type QuoteServiceSlug
} from "@/content/quote-analysis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ file: string }>;
};

const tiers: PriorityTier[] = ["P0", "P1"];

function toEntry(page: ReturnType<typeof getAllQuoteAnalysisPages>[number]): SitemapEntry {
  return {
    loc: page.url,
    lastmod: page.lastSignificantUpdate
  };
}

function corePages() {
  return LOCALES.flatMap((locale) =>
    getAllQuoteAnalysisPages(locale)
      .filter((page) => page.indexable && page.pageType !== "city")
      .map(toEntry)
  );
}

function serviceTierPages(service: QuoteServiceSlug, tier: PriorityTier) {
  return LOCALES.flatMap((locale: Locale) =>
    getQuoteAnalysisPagesForSitemap(locale, service, tier)
      .filter((page) => page.pageType === "city")
      .map(toEntry)
  );
}

function entriesForFile(file: string): SitemapEntry[] | null {
  if (file === "sitemap-core.xml.gz") return corePages();

  const match = file.match(/^sitemap-(dj|band|fotografo)-(p0|p1)\.xml\.gz$/);
  if (!match) return null;

  const service = match[1] as QuoteServiceSlug;
  const tier = match[2].toUpperCase() as PriorityTier;
  if (!quoteServices.some((item) => item.slug === service) || !tiers.includes(tier)) return null;
  return serviceTierPages(service, tier);
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { file } = await params;
  const entries = entriesForFile(file);
  if (!entries) return new Response("Not found", { status: 404 });

  return new Response(gzipSync(urlSetXml(entries)), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "content-encoding": "gzip",
      "cache-control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
