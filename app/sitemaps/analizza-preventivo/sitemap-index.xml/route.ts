import { sitemapSiteUrl, xmlResponse } from "@/lib/sitemap-xml";
import { quoteServices, type PriorityTier } from "@/content/quote-analysis";

export const dynamic = "force-dynamic";

const tiers: PriorityTier[] = ["P0", "P1"];

export function GET() {
  const files = [
    "sitemap-core.xml.gz",
    ...quoteServices.flatMap((service) => tiers.map((tier) => `sitemap-${service.slug}-${tier.toLowerCase()}.xml.gz`))
  ];
  const rows = files
    .map(
      (file) => `  <sitemap>
    <loc>${sitemapSiteUrl}/sitemaps/analizza-preventivo/${file}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</sitemapindex>
`);
}
