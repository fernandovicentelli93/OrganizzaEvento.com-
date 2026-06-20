import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

type LocalSeoPage = {
  slug: string;
  status: string;
  kind: string;
  region: string;
  province: string;
  city: string;
  score: number;
  scoreLabel: string;
  priority: string;
  categoryKey: string;
  categoryName: string;
  categoryGroup: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  url: string;
  canonical: string;
  robots: string;
  sitemap: string;
  lastmod: string;
  intro: string;
  localSection: string;
  whenUseful: string[];
  evaluationChecklist: string[];
  conversations: Array<{ title: string; question: string; answer: string; tip: string }>;
  faqs: Array<{ question: string; answer: string }>;
  serviceLinks: Array<{ slug: string; label: string }>;
  nearbyLinks: Array<{ slug: string; label: string }>;
  vibesCtaUrl: string;
  antiDoorway: {
    realUtility: string;
    uniqueLocalElements: string;
    uniqueConversations: string;
    duplicationRisk: number;
    doorwayRisk: number;
    decision: string;
  };
};

type LocalSeoModule = {
  getPublishedLocalSeoPages: () => LocalSeoPage[];
  localSeoCategories: Array<{ key: string; name: string; sitemap: string; group: string }>;
  localSeoSitemapFiles: string[];
};

const root = process.cwd();
const outDir = path.join(root, "docs", "seo-local");
const landingDir = path.join(outDir, "landing_pages");
const sitemapDir = path.join(outDir, "sitemaps");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";

function ensureInsideWorkspace(target: string) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  if (!resolvedTarget.startsWith(resolvedRoot)) {
    throw new Error(`Percorso non sicuro: ${resolvedTarget}`);
  }
}

function resetDir(target: string) {
  ensureInsideWorkspace(target);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
}

function csv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function writeCsv(fileName: string, headers: string[], rows: unknown[][]) {
  const body = [headers.map(csv).join(","), ...rows.map((row) => row.map(csv).join(","))].join("\n");
  writeFileSync(path.join(outDir, fileName), `${body}\n`, "utf8");
}

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function writeSitemap(fileName: string, sitemapPages: LocalSeoPage[]) {
  const rows = sitemapPages
    .map(
      (page) => `  <url>
    <loc>${xmlEscape(`${siteUrl}/${page.slug}`)}</loc>
    <lastmod>${new Date(page.lastmod).toISOString()}</lastmod>
    <changefreq>${page.kind === "city" ? "monthly" : "weekly"}</changefreq>
    <priority>${page.kind === "city" ? "0.8" : "0.7"}</priority>
  </url>`
    )
    .join("\n");

  writeFileSync(
    path.join(sitemapDir, fileName),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>
`,
    "utf8"
  );
}

async function main() {
  const loaded = (await import("../content/local-seo/index")) as unknown as LocalSeoModule & { default?: LocalSeoModule };
  const seo = loaded.default ?? loaded;
  const pages = seo.getPublishedLocalSeoPages();

  resetDir(outDir);
  mkdirSync(landingDir, { recursive: true });
  mkdirSync(sitemapDir, { recursive: true });

  const pagesBySitemap = new Map<string, LocalSeoPage[]>();
  for (const page of pages) {
    pagesBySitemap.set(page.sitemap, [...(pagesBySitemap.get(page.sitemap) ?? []), page]);
  }

  writeFileSync(
    path.join(outDir, "seo_architecture.md"),
  `# Architettura SEO locale OrganizzaEvento.com

## Obiettivo
Costruire una macchina SEO locale per intercettare ricerche ad alta intenzione su fornitori per eventi e portare l'utente verso:

- lettura di contenuti utili;
- apertura di conversazioni nella community;
- richiesta fornitori tramite CTA tracciata verso Vibes Planner.

## Principio anti-doorway
Non pubblichiamo pagine solo per combinare categoria e citta. Una pagina viene pubblicata solo se contiene:

- intento di ricerca chiaro;
- localita o area realmente plausibile per eventi;
- almeno 3 casi tipici di community;
- checklist specifica per la categoria;
- FAQ leggibili da utenti e assistenti AI;
- link interni verso servizi e zone vicine;
- CTA esterna coerente e tracciata.

## Primo blocco pubblicabile

- Pagine locali pubblicate: ${pages.length}
- Sitemap generate: ${seo.localSeoSitemapFiles.length}
- Categorie servizi: ${seo.localSeoCategories.length}
- Regole crawler: Googlebot, Bingbot, OAI-SearchBot e GPTBot possono leggere i contenuti pubblici; admin, dashboard, login e API restano escluse.

## Hub principali

- ${siteUrl}/fornitori-eventi
- ${siteUrl}/guide-eventi
- ${siteUrl}/domande
- ${siteUrl}/analizza-preventivo

## Strategia AI visibility
Ogni pagina pubblica usa testo HTML leggibile, H1/H2 chiari, FAQ, JSON-LD e collegamenti interni espliciti. Il file /llms.txt riassume struttura, aree, categorie e sitemap per assistenti AI.
`,
  "utf8"
);

writeCsv(
  "seo_matrix.csv",
  [
    "slug",
    "status",
    "kind",
    "region",
    "province",
    "city",
    "category",
    "group",
    "primaryKeyword",
    "score",
    "scoreLabel",
    "priority",
    "sitemap",
    "url",
    "canonical",
    "robots"
  ],
  pages.map((page) => [
    page.slug,
    page.status,
    page.kind,
    page.region,
    page.province,
    page.city,
    page.categoryName,
    page.categoryGroup,
    page.primaryKeyword,
    page.score,
    page.scoreLabel,
    page.priority,
    page.sitemap,
    `${siteUrl}/${page.slug}`,
    page.canonical,
    page.robots
  ])
);

writeCsv(
  "vibes_cta_links.csv",
  ["slug", "category", "city", "campaignUrl"],
  pages.map((page) => [page.slug, page.categoryName, page.city, page.vibesCtaUrl])
);

writeCsv(
  "internal_links.csv",
  ["sourceSlug", "sourceTitle", "linkType", "targetSlug", "anchor"],
  pages.flatMap((page) => [
    ...page.serviceLinks.map((link) => [page.slug, page.title, "servizio_correlato", link.slug, link.label]),
    ...page.nearbyLinks.map((link) => [page.slug, page.title, "zona_vicina", link.slug, link.label])
  ])
);

writeCsv(
  "quality_control.csv",
  [
    "slug",
    "decision",
    "duplicationRisk",
    "doorwayRisk",
    "realUtility",
    "uniqueLocalElements",
    "uniqueConversations",
    "hasThreeConversations",
    "hasFaq",
    "hasInternalLinks",
    "hasVibesCta"
  ],
  pages.map((page) => [
    page.slug,
    page.antiDoorway.decision,
    page.antiDoorway.duplicationRisk,
    page.antiDoorway.doorwayRisk,
    page.antiDoorway.realUtility,
    page.antiDoorway.uniqueLocalElements,
    page.antiDoorway.uniqueConversations,
    page.conversations.length >= 3 ? "yes" : "no",
    page.faqs.length >= 4 ? "yes" : "no",
    page.serviceLinks.length + page.nearbyLinks.length > 0 ? "yes" : "no",
    page.vibesCtaUrl.includes("utm_source=organizzaevento") ? "yes" : "no"
  ])
);

writeFileSync(
  path.join(outDir, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /admin
Disallow: /backend
Disallow: /gestione
Disallow: /dashboard
Disallow: /login
Disallow: /api

User-agent: OAI-SearchBot
Allow: /
Disallow: /admin
Disallow: /backend
Disallow: /gestione
Disallow: /dashboard
Disallow: /login
Disallow: /api

User-agent: GPTBot
Allow: /
Disallow: /admin
Disallow: /backend
Disallow: /gestione
Disallow: /dashboard
Disallow: /login
Disallow: /api

Sitemap: ${siteUrl}/sitemap.xml
`,
  "utf8"
);

writeFileSync(
  path.join(outDir, "search_console_instructions.md"),
  `# Search Console - istruzioni operative

1. Verifica la proprieta dominio di organizzaevento.com.
2. Invia solo l'indice sitemap: ${siteUrl}/sitemap.xml
3. Dopo la prima scansione, controlla le sitemap verticali con piu URL:
   - ${siteUrl}/sitemap-location-eventi.xml
   - ${siteUrl}/sitemap-catering-eventi.xml
   - ${siteUrl}/sitemap-musica-eventi.xml
   - ${siteUrl}/sitemap-event-planner.xml
4. Non inviare manualmente pagine di login, dashboard, backend o API.
5. Se Search Console segnala "Scoperta, non indicizzata", non forzare massa: migliora link interni, conversazioni e segnali reali.
6. Per nuove pubblicazioni mensili, aggiungi prima le pagine a quality_control.csv e pubblica solo quelle con utilita reale.

## Controlli dopo deploy

- Aprire ${siteUrl}/robots.txt
- Aprire ${siteUrl}/sitemap.xml
- Aprire una pagina locale, per esempio ${siteUrl}/${pages[0]?.slug}
- Verificare titolo, H1, FAQ e CTA tracciata.
`,
  "utf8"
);

writeFileSync(
  path.join(sitemapDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seo.localSeoSitemapFiles
  .map(
    (file) => `  <sitemap>
    <loc>${xmlEscape(`${siteUrl}/${file}`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>
`,
  "utf8"
);

for (const file of seo.localSeoSitemapFiles) {
  writeSitemap(file, pagesBySitemap.get(file) ?? []);
}

for (const page of pages) {
  writeFileSync(
    path.join(landingDir, `${page.slug}.md`),
    `---
slug: ${page.slug}
title: ${JSON.stringify(page.title)}
metaTitle: ${JSON.stringify(page.metaTitle)}
metaDescription: ${JSON.stringify(page.metaDescription)}
canonical: ${page.canonical}
robots: ${page.robots}
sitemap: ${page.sitemap}
priority: ${page.priority}
score: ${page.score}
---

# ${page.h1}

${page.intro}

## Perche questa pagina esiste

${page.antiDoorway.realUtility}

## Contesto locale

${page.localSection}

## Cosa controllare

${page.evaluationChecklist.map((item) => `- ${item}`).join("\n")}

## Casi tipici della community

${page.conversations.map((item) => `### ${item.title}\n\n${item.question}\n\n${item.answer}\n\n**Nota pratica:** ${item.tip}`).join("\n\n")}

## FAQ

${page.faqs.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## CTA fornitori

${page.vibesCtaUrl}
`,
    "utf8"
  );
}

  console.log(`SEO locale esportato: ${pages.length} landing, ${seo.localSeoSitemapFiles.length} sitemap, output ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
