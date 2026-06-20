import {
  capitalMunicipalities,
  getAllQuoteAnalysisPages,
  getQuoteAnalysisPagesForSitemap,
  quoteAnalysisAlternates,
  quoteServices,
  resolveQuoteAnalysisRoute
} from "@/content/quote-analysis";
import { LOCALES } from "@/lib/i18n-basic";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const expectedItalianPaths = [
  ["dj"],
  ["dj", "milano-mi"],
  ["dj", "roma-rm"],
  ["band", "roma-rm"],
  ["fotografo", "napoli-na"],
  ["fotografo", "bologna-bo"]
];

for (const path of expectedItalianPaths) {
  const page = resolveQuoteAnalysisRoute("it", path);
  assert(page, `Missing Italian quote page: /analizza-preventivo/${path.join("/")}`);
  assert(page?.canonical === page?.url, `Canonical mismatch for ${page?.url}`);
  assert(page?.localizedUrls.en && page.localizedUrls.es && page.localizedUrls.fr, `Missing hreflang URLs for ${page?.url}`);
}

for (const locale of LOCALES) {
  const pages = getAllQuoteAnalysisPages(locale);
  const cityPages = pages.filter((page) => page.pageType === "city");
  assert(cityPages.length === capitalMunicipalities.length * quoteServices.length, `${locale}: city page count is not based on ISTAT capital municipalities`);

  for (const page of pages) {
    const alternates = quoteAnalysisAlternates(page, locale);
    assert(alternates.canonical === page.url, `${locale}: self canonical missing for ${page.url}`);
    assert(alternates.languages["x-default"] === page.localizedUrls.it, `${locale}: x-default should point to Italian root version`);
    if (!page.indexable) assert(page.robots === "noindex, follow", `${locale}: non-indexable page has wrong robots`);
  }

  for (const service of quoteServices) {
    for (const tier of ["P0", "P1"] as const) {
      const sitemapPages = getQuoteAnalysisPagesForSitemap(locale, service.slug, tier);
      for (const page of sitemapPages) {
        assert(page.indexable, `${locale}: noindex page entered sitemap: ${page.url}`);
        assert(page.statusCodeExpected === 200, `${locale}: sitemap page not expected 200: ${page.url}`);
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      ok: true,
      locales: LOCALES.length,
      services: quoteServices.length,
      capitalMunicipalities: capitalMunicipalities.length,
      totalUrls: LOCALES.reduce((sum, locale) => sum + getAllQuoteAnalysisPages(locale).length, 0),
      indexableItalianUrls: getAllQuoteAnalysisPages("it").filter((page) => page.indexable).length
    },
    null,
    2
  )
);
