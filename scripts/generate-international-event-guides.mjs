import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const mapPath = join(root, "docs", "international-seo", "international-seo-content-map-500-en.json");
const countryPath = join(root, "docs", "international-seo", "country-event-planning-page-ideas-en.md");
const outputPath = join(root, "content", "international-seo", "generated", "event-guides.json");

const vibesBaseUrl = "https://www.vibesplanner.com/richiesta-cliente/";
const defaultInternalLinks = [
  { label: "Analyze an Italian quote", href: "/en/analyze-quote" },
  { label: "Find event suppliers in Italy", href: "/en/event-suppliers" },
  { label: "Read community questions", href: "/en/questions" }
];

function clean(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function stripEnglishPrefix(slug) {
  return clean(slug).replace(/^\/+/, "").replace(/^en\/+/, "");
}

function scoreNumber(value, fallback = 3) {
  const match = clean(value).match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

function slugTail(slug) {
  const parts = slug.split("/");
  return parts[parts.length - 1] || slug;
}

function parseInternalLinks(value) {
  const source = clean(value);
  if (!source) return defaultInternalLinks;

  const links = source
    .split(";")
    .map((item) => item.trim())
    .map((item) => {
      const match = item.match(/^(.*?)\s*\((.*?)\)$/);
      if (!match) return null;
      return { label: clean(match[1]), href: clean(match[2]) };
    })
    .filter(Boolean);

  return links.length ? links : defaultInternalLinks;
}

function ctaFromCampaign(text, campaign) {
  const params = new URLSearchParams({
    utm_source: "organizzaevento",
    utm_medium: "seo_content",
    utm_campaign: clean(campaign) || "en_event_guides"
  });

  return {
    text: clean(text) || "Compare Italian event suppliers with Vibes Planner.",
    href: `${vibesBaseUrl}?${params.toString()}#gbc165`
  };
}

function extractCountryPages(markdown) {
  const pages = [];
  const headingRegex = /^### ([A-Z]{2}-IT-\d{3}): (.+)$/gm;
  const matches = Array.from(markdown.matchAll(headingRegex));

  matches.forEach((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    const block = markdown.slice(start, end);
    const fields = {};

    block.split(/\r?\n/).forEach((line) => {
      const fieldMatch = line.match(/^- ([^:]+):\s*(.*)$/);
      if (!fieldMatch) return;
      fields[clean(fieldMatch[1])] = clean(fieldMatch[2]);
    });

    const ctaRaw = fields["CTA toward Vibes Planner"] || "";
    const ctaUrlMatch = ctaRaw.match(/https:\/\/\S+/);
    const ctaHref = ctaUrlMatch ? ctaUrlMatch[0] : ctaFromCampaign("", "en_country_event_planning").href;
    const ctaText = ctaUrlMatch ? clean(ctaRaw.replace(ctaUrlMatch[0], "")) : ctaFromCampaign(ctaRaw, "en_country_event_planning").text;
    const countryCode = match[1].slice(0, 2);
    const countryNames = { US: "United States", AU: "Australia", UK: "United Kingdom", CA: "Canada" };
    const priority = scoreNumber(fields["Priority score"], 4);

    pages.push({
      id: match[1],
      sourceType: "country-event-planning",
      slug: stripEnglishPrefix(fields.Slug),
      slugTail: slugTail(stripEnglishPrefix(fields.Slug)),
      vertical: "Events in Italy from abroad",
      cluster: `${countryNames[countryCode] ?? countryCode} planning`,
      pageType: "Country planning guide",
      targetAudience: `${countryNames[countryCode] ?? countryCode} users planning events in Italy`,
      searchIntent: fields["Search intent"],
      primaryKeyword: fields["Primary keyword"],
      secondaryKeywords: "",
      seoTitle: fields["SEO title"],
      h1: fields.H1,
      metaDescription: fields["Meta description"],
      uniqueAngle: fields["Why this page is different from the generic /en/ version"],
      targetPersona: fields["Specific country angle"],
      userProblem: fields["User problem"],
      usefulForForeignUsers: fields["Italy destination angle"],
      nonDuplicableElement: fields["Specific country angle"],
      dataExamplesNeeded: "Use destination, timing and quote questions visible on the page; no invented suppliers or fake prices.",
      ctaText,
      ctaHref,
      internalLinks: defaultInternalLinks,
      schemaMarkup: "Article + BreadcrumbList",
      priorityScore: priority,
      duplicationRisk: fields["Duplication risk"] || "Low",
      qualityNotes: "Country-specific page generated from the approved international SEO map.",
      layoutVariant: index % 4,
      lastmod: "2026-06-16"
    });
  });

  return pages;
}

const mapRows = JSON.parse(readFileSync(mapPath, "utf8"));
const seoPages = mapRows.map((row, index) => {
  const slug = stripEnglishPrefix(row["URL slug"]);
  const cta = ctaFromCampaign(row["Suggested CTA toward Vibes Planner"], row["Suggested UTM campaign"]);

  return {
    id: clean(row["Page ID"]),
    sourceType: "international-content-map",
    slug,
    slugTail: slugTail(slug),
    vertical: clean(row.Vertical),
    cluster: clean(row.Cluster),
    pageType: clean(row["Page type"]),
    targetAudience: clean(row["Target country or audience"]),
    searchIntent: clean(row["Main search intent"]),
    primaryKeyword: clean(row["Primary keyword"]),
    secondaryKeywords: clean(row["Secondary keywords"]),
    seoTitle: clean(row["SEO title under 58 characters"]),
    h1: clean(row.H1),
    metaDescription: clean(row["Meta description under 155 characters"]),
    uniqueAngle: clean(row["Unique angle"]),
    targetPersona: clean(row["Target persona"]),
    userProblem: clean(row["Specific problem solved"]),
    usefulForForeignUsers: clean(row["Why this page is useful for foreign users"]),
    nonDuplicableElement: clean(row["Non-duplicable element"]),
    dataExamplesNeeded: clean(row["Data/examples needed"]),
    ctaText: cta.text,
    ctaHref: cta.href,
    internalLinks: parseInternalLinks(row["Suggested internal links"]),
    schemaMarkup: clean(row["Suggested schema markup"]),
    priorityScore: scoreNumber(row["Publishing priority from 1 to 5"], 3),
    duplicationRisk: scoreNumber(row["Duplication risk from 1 to 5"], 3),
    qualityNotes: clean(row["Quality notes"]),
    layoutVariant: index % 4,
    lastmod: "2026-06-16"
  };
});

const countryPages = extractCountryPages(readFileSync(countryPath, "utf8"));
const allPages = [...countryPages, ...seoPages];
const seen = new Map();
const duplicates = [];

for (const page of allPages) {
  if (!page.slug.startsWith("event-guides/")) {
    throw new Error(`Invalid slug for ${page.id}: ${page.slug}`);
  }
  if (seen.has(page.slug)) duplicates.push(`${page.id} duplicates ${seen.get(page.slug)} at ${page.slug}`);
  seen.set(page.slug, page.id);
}

if (duplicates.length) {
  throw new Error(`Duplicate international SEO slugs:\n${duplicates.join("\n")}`);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(allPages, null, 2)}\n`);
console.log(`Generated ${allPages.length} international event guide pages at ${outputPath}`);
