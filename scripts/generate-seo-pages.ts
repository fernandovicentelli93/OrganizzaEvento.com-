import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LOCALES } from "@/lib/i18n-basic";
import { getAllQuoteAnalysisPages, getQuoteAnalysisPagesForSitemap, quoteServices } from "@/content/quote-analysis";

const outputDir = path.join(process.cwd(), "content", "quote-analysis", "generated");
const outputFile = path.join(outputDir, "seo-pages.json");

function main() {
  const generatedAt = new Date().toISOString();
  const pages = LOCALES.flatMap((locale) =>
    getAllQuoteAnalysisPages(locale).map((page) => ({
      url: page.url,
      locale,
      pageType: page.pageType,
      serviceId: page.service?.id ?? null,
      istatCode: page.municipality?.istatCode ?? null,
      regioneSlug: page.regionSlug ?? null,
      title: page.title,
      metaDescription: page.metaDescription,
      h1: page.h1,
      canonical: page.canonical,
      robots: page.robots,
      indexable: page.indexable,
      qualityScore: page.qualityScore,
      priorityTier: page.priorityTier,
      finalPriorityScore: page.finalPriorityScore,
      contentFingerprint: page.contentFingerprint,
      lastSignificantUpdate: page.lastSignificantUpdate,
      statusCodeExpected: page.statusCodeExpected
    }))
  );

  const sitemapGroups = [
    { group: "hub", count: LOCALES.reduce((sum, locale) => sum + getQuoteAnalysisPagesForSitemap(locale).filter((page) => page.pageType !== "city").length, 0) },
    ...quoteServices.flatMap((service) =>
      (["P0", "P1", "P2"] as const).map((tier) => ({
        group: `${service.slug}-${tier.toLowerCase()}`,
        count: LOCALES.reduce((sum, locale) => sum + getQuoteAnalysisPagesForSitemap(locale, service.slug, tier).length, 0)
      }))
    )
  ];

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputFile, `${JSON.stringify({ generatedAt, pages, sitemapGroups }, null, 2)}\n`, "utf8");
  console.log(`SEO pages generated: ${pages.length}`);
  console.log(`Output: ${outputFile}`);
}

main();
