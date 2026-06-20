import eventGuidesData from "./generated/event-guides.json";

export type InternationalEventGuideLink = {
  label: string;
  href: string;
};

export type InternationalEventGuide = {
  id: string;
  sourceType: "country-event-planning" | "international-content-map";
  slug: string;
  slugTail: string;
  vertical: string;
  cluster: string;
  pageType: string;
  targetAudience: string;
  searchIntent: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  seoTitle: string;
  h1: string;
  metaDescription: string;
  uniqueAngle: string;
  targetPersona: string;
  userProblem: string;
  usefulForForeignUsers: string;
  nonDuplicableElement: string;
  dataExamplesNeeded: string;
  ctaText: string;
  ctaHref: string;
  internalLinks: InternationalEventGuideLink[];
  schemaMarkup: string;
  priorityScore: number;
  duplicationRisk: number | string;
  qualityNotes: string;
  layoutVariant: number;
  lastmod: string;
};

const eventGuides = eventGuidesData as InternationalEventGuide[];
const bySlug = new Map(eventGuides.map((page) => [page.slug, page]));

function normalizePath(path: string | string[]) {
  const rawPath = Array.isArray(path) ? path.join("/") : path;
  return rawPath.replace(/^\/+/, "").replace(/^en\/+/, "").replace(/\/+$/, "");
}

export function getAllInternationalEventGuides() {
  return eventGuides;
}

export function getInternationalEventGuideByPath(path: string | string[]) {
  return bySlug.get(normalizePath(path)) ?? null;
}

export function getInternationalEventGuideCanonicalUrl(page: InternationalEventGuide) {
  return `https://organizzaevento.com/en/${page.slug}`;
}

export function internationalEventGuidePriority(page: InternationalEventGuide) {
  if (page.sourceType === "country-event-planning") {
    const priority = typeof page.priorityScore === "number" ? page.priorityScore : 4;
    return priority >= 5 ? 0.9 : priority >= 4 ? 0.86 : 0.82;
  }

  const score = typeof page.priorityScore === "number" ? page.priorityScore : 3;
  if (score <= 1) return 0.86;
  if (score === 2) return 0.82;
  if (score === 3) return 0.78;
  if (score === 4) return 0.74;
  return 0.7;
}
