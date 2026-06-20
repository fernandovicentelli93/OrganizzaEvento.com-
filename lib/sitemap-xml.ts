import { getPublishedLandingPages } from "@/content/landing-pages";
import { getLocalSeoPagesBySitemap, getPublishedLocalSeoPages, localSeoSitemapFiles } from "@/content/local-seo";
import { CATEGORIES } from "@/lib/constants";
import { EDITORIAL_CATEGORIES } from "@/lib/editorial";
import { MAGAZINE_AREAS } from "@/lib/magazine";
import { prisma } from "@/lib/prisma";

export type SitemapEntry = {
  loc: string;
  lastmod?: string | Date;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export const sitemapSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatDate(value?: string | Date) {
  if (!value) return new Date().toISOString();
  return new Date(value).toISOString();
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600"
    }
  });
}

export function sitemapIndexXml(files = localSeoSitemapFiles) {
  const rows = files
    .map(
      (file) => `  <sitemap>
    <loc>${xmlEscape(`${sitemapSiteUrl}/${file}`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</sitemapindex>
`;
}

export function urlSetXml(entries: SitemapEntry[]) {
  const rows = entries
    .map((entry) => {
      const priority = typeof entry.priority === "number" ? `\n    <priority>${entry.priority.toFixed(1)}</priority>` : "";
      const changefreq = entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : "";
      return `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${formatDate(entry.lastmod)}</lastmod>${changefreq}${priority}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>
`;
}

export function getMainSitemapEntries(): SitemapEntry[] {
  const staticPaths = [
    "",
    "/domande",
    "/fai-domanda",
    "/registrati",
    "/quanto-costa",
    "/categorie",
    "/magazine",
    "/guide-eventi",
    "/fornitori-eventi",
    "/fornitori",
    "/analizza-preventivo",
    "/trova-fornitori",
    "/collaborazioni",
    "/faq",
    "/regole",
    "/privacy",
    "/privacy-policy",
    "/cookie-policy",
    "/condizioni-commerciali",
    "/termini"
  ];

  const categorySlugs = Array.from(new Set([...CATEGORIES.map((category) => category.slug), ...MAGAZINE_AREAS.map((area) => area.slug)]));
  const editorialCategorySlugs = EDITORIAL_CATEGORIES.map((category) => category.slug);

  return [
    ...staticPaths.map((path) => ({
      loc: `${sitemapSiteUrl}${path}`,
      changefreq: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : path === "/fornitori-eventi" || path === "/fornitori" ? 0.9 : 0.7
    })),
    ...categorySlugs.map((slug) => ({
      loc: `${sitemapSiteUrl}/categorie/${slug}`,
      changefreq: "weekly" as const,
      priority: 0.75
    })),
    ...editorialCategorySlugs.map((slug) => ({
      loc: `${sitemapSiteUrl}/magazine/categorie/${slug}`,
      changefreq: "weekly" as const,
      priority: 0.72
    }))
  ];
}

export async function getCommunitySitemapEntries(): Promise<SitemapEntry[]> {
  try {
    const questions = await prisma.question.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 3000
    });

    return questions.map((question) => ({
      loc: `${sitemapSiteUrl}/domande/${question.slug}`,
      lastmod: question.updatedAt,
      changefreq: "weekly",
      priority: 0.68
    }));
  } catch {
    return [];
  }
}

export async function getMagazineSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    const articles = await prisma.editorialArticle.findMany({
      where: { status: "published", publishedAt: { lte: new Date() } },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 1000
    });

    return articles.map((article) => ({
      loc: `${sitemapSiteUrl}/magazine/${article.slug}`,
      lastmod: article.updatedAt ?? article.publishedAt,
      changefreq: "monthly",
      priority: 0.78
    }));
  } catch {
    return [];
  }
}

export function getGuideEventsSitemapEntries(): SitemapEntry[] {
  return getPublishedLandingPages().map((page) => ({
    loc: `${sitemapSiteUrl}/guide-eventi/${page.slug}`,
    lastmod: page.updatedAt,
    changefreq: "monthly",
    priority: 0.8
  }));
}

export function getLocalSeoSitemapEntries(sitemap: string): SitemapEntry[] {
  return getLocalSeoPagesBySitemap(sitemap).map((page) => ({
    loc: `${sitemapSiteUrl}/${page.slug}`,
    lastmod: page.lastmod,
    changefreq: page.kind === "city" ? "monthly" : "weekly",
    priority: page.kind === "city" ? 0.82 : 0.76
  }));
}

export function getAllLocalSeoSitemapEntries(): SitemapEntry[] {
  return getPublishedLocalSeoPages().map((page) => ({
    loc: `${sitemapSiteUrl}/${page.slug}`,
    lastmod: page.lastmod,
    changefreq: "monthly",
    priority: page.kind === "city" ? 0.82 : 0.76
  }));
}
