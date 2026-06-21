import { NextResponse } from "next/server";
import {
  VIBES_SUPPLIER_CATEGORIES,
  categoryFromSearch,
  normalizeSearchText,
  type VibesSupplierCard
} from "@/lib/vibes-suppliers";
import type { Locale } from "@/lib/i18n-basic";
import {
  distanceKm,
  findItalianAreaLabel,
  isValidGeoPoint,
  italianLocationMatchesArea,
  localizedDistanceLabel,
  nearestItalianProvince,
  type GeoPoint
} from "@/lib/vibes-geo";

const VIBES_BASE_URL = "https://www.vibesplanner.com";
const MAX_VISIBLE_RESULTS = 100;
const MAX_COVERAGE_CANDIDATES = 140;
const MAX_NATIONWIDE_CHECKS_WITH_LOCAL_RESULTS = 18;
const MAX_NATIONWIDE_CHECKS_WITHOUT_LOCAL_RESULTS = 30;
const MIN_LOCAL_RESULTS_BEFORE_SKIPPING_NATIONWIDE = 15;
const MAX_EXACT_ADDRESS_DISTANCE_CHECKS = 10;
const MAX_SELECTED_CATEGORY_PAGES = 5;
const MAX_FALLBACK_CATEGORY_PAGES = 3;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SearchPayload = {
  query: string;
  category: string;
  subcategory: string;
  province: string;
  eventType: string;
  locale: Locale;
  lat: number | null;
  lng: number | null;
};

type ServiceAreaVerdict = {
  compatible: boolean;
  serviceArea: "local" | "italy" | "unknown";
};

type SupplierProfileDetails = {
  text: string;
  address: string;
};

const profileDetailsCache = new Map<string, Promise<SupplierProfileDetails>>();
const geocodeCache = new Map<string, Promise<GeoPoint | null>>();

const fallbackSuppliers: Array<Omit<VibesSupplierCard, "score" | "serviceAreaLabel" | "services"> & { services: string[] }> = [
  {
    id: "1040-le-bateau-erbatici",
    name: "Le Bateau Erbatici",
    category: "Location",
    categorySlug: "location",
    location: "Mezzana Bigli (PV)",
    imageUrl: `${VIBES_BASE_URL}/public/vetrine/galleria/1040/thumb_1771301550-dji-0956.jpg`,
    vibesUrl: `${VIBES_BASE_URL}/vetrine/1040-le-bateau-erbatici/`,
    premium: true,
    serviceArea: "unknown",
    services: ["Location"]
  },
  {
    id: "987-palazzo-antoci",
    name: "Palazzo Antoci",
    category: "Location",
    categorySlug: "location",
    location: "Ragusa (RG)",
    imageUrl: `${VIBES_BASE_URL}/public/vetrine/galleria/987/thumb_1768762628-1000139506.jpg`,
    vibesUrl: `${VIBES_BASE_URL}/vetrine/987-palazzo-antoci/`,
    premium: true,
    serviceArea: "unknown",
    services: ["Location"]
  },
  {
    id: "931-villa-alice",
    name: "Villa Alice",
    category: "Location",
    categorySlug: "location",
    location: "Collecchio (PR)",
    imageUrl: `${VIBES_BASE_URL}/public/vetrine/galleria/931/thumb_1767815708-img-20251007-wa0136.jpg`,
    vibesUrl: `${VIBES_BASE_URL}/vetrine/931-villa-alice/`,
    premium: true,
    serviceArea: "unknown",
    services: ["Location"]
  },
  {
    id: "537-resort-bellavita",
    name: "Resort BellaVita",
    category: "Location",
    categorySlug: "location",
    location: "Ancona (AN)",
    imageUrl: `${VIBES_BASE_URL}/public/vetrine/galleria/537/thumb_1757663153-pagina-vetrina-demo-01.jpg`,
    vibesUrl: `${VIBES_BASE_URL}/vetrine/537-resort-bellavita/`,
    premium: true,
    serviceArea: "unknown",
    services: ["Location"]
  },
  {
    id: "1390-arconova-music-events",
    name: "ArcoNova Music Events",
    category: "Musica",
    categorySlug: "musica",
    location: "Napoli (NA)",
    imageUrl: `${VIBES_BASE_URL}/public/vetrine/galleria/1390/thumb_1775504132-photo-2026-03-25-23-42-59.jpg`,
    vibesUrl: `${VIBES_BASE_URL}/vetrine/1390-arconova-music-events/`,
    premium: true,
    serviceArea: "unknown",
    services: ["Musica", "DJ", "Band"]
  },
  {
    id: "1131-sasha",
    name: "SASHA",
    category: "Musica",
    categorySlug: "musica",
    location: "Martinengo (BG)",
    imageUrl: `${VIBES_BASE_URL}/public/vetrine/galleria/1131/thumb_1772726589-3ec0faf5-1e3c-46d0-b1aa-5f2ef51e1c01.jpg`,
    vibesUrl: `${VIBES_BASE_URL}/vetrine/1131-sasha/`,
    premium: true,
    serviceArea: "unknown",
    services: ["Musica", "DJ"]
  }
];

const PROVINCE_ALIASES: Record<string, string[]> = {
  ancona: ["ancona", "an"],
  bologna: ["bologna", "bo"],
  como: ["como", "co"],
  firenze: ["firenze", "fi", "florence"],
  milano: ["milano", "mi", "milan"],
  napoli: ["napoli", "na", "naples"],
  roma: ["roma", "rm", "rome"],
  torino: ["torino", "to", "turin"],
  venezia: ["venezia", "ve", "venice"],
  verona: ["verona", "vr"],
  treviso: ["treviso", "tv"],
  palermo: ["palermo", "pa"],
  catania: ["catania", "ct"],
  lecce: ["lecce", "le"],
  lucca: ["lucca", "lu"],
  pavia: ["pavia", "pv"],
  ragusa: ["ragusa", "rg"],
  siena: ["siena", "si"]
};

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&egrave;/g, "e")
    .replace(/&agrave;/g, "a")
    .replace(/&igrave;/g, "i")
    .replace(/&ograve;/g, "o")
    .replace(/&ugrave;/g, "u")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(value: string, pattern: RegExp) {
  return value.match(pattern)?.[1] ?? null;
}

function absoluteVibesUrl(value: string | null) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  return `${VIBES_BASE_URL}${value}`;
}

function supplierSlugFromUrl(value: string) {
  const match = value.match(/\/vetrine\/([^/]+)\//);
  return match?.[1] ?? "";
}

function categoryUrl(categorySlug: string, page = 1) {
  const suffix = page > 1 ? `?page=${page}` : "";
  return `${VIBES_BASE_URL}/fornitori/${categorySlug}/${suffix}`;
}

function discoverPageCount(html: string, categorySlug: string) {
  const escapedSlug = categorySlug.replace(/[-/\\^$*+.()|[\]{}]/g, "\\$&");
  const matches = [...html.matchAll(new RegExp(`/fornitori/${escapedSlug}/(?:\\?[^"'<\\s]*)?page=(\\d+)`, "g"))];
  const pages = matches.map((match) => Number(match[1])).filter((page) => Number.isFinite(page) && page > 1);
  return Math.max(1, ...pages);
}

function scoreSupplier(card: VibesSupplierCard, payload: SearchPayload) {
  const query = normalizeSearchText([payload.query, payload.subcategory, payload.eventType].filter(Boolean).join(" "));
  const province = normalizeSearchText(payload.province);
  const haystack = normalizeSearchText([card.name, card.category, card.location, ...card.services].join(" "));
  let score = card.premium ? 1000 : 0;
  if (province && (haystack.includes(province) || italianLocationMatchesArea(card.location, province))) score += 3200;
  for (const token of query.split(" ").filter((item) => item.length > 2)) {
    if (haystack.includes(token)) score += 30;
  }
  return score;
}

function sortWithinTier(a: VibesSupplierCard, b: VibesSupplierCard) {
  return b.score - a.score || a.name.localeCompare(b.name, "it", { sensitivity: "base" });
}

function rankedSuppliers(cards: VibesSupplierCard[], maxResults: number, payload?: SearchPayload) {
  const prepared = cards.map((card) => (payload ? withDistanceFromUser(card, payload) : card));

  if (payload && userGeoPoint(payload)) {
    const sortByDistance = (a: VibesSupplierCard, b: VibesSupplierCard) =>
      (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999) ||
      Number(b.premium) - Number(a.premium) ||
      b.score - a.score ||
      a.name.localeCompare(b.name, "it");

    if (payload.province) {
      const areaMatches = prepared
        .filter((card) => supplierMatchesRequestedProvince(card, payload.province))
        .sort(sortByDistance);
      const otherMatches = prepared
        .filter((card) => !supplierMatchesRequestedProvince(card, payload.province) && typeof card.distanceKm === "number")
        .sort(sortByDistance);
      const withoutDistance = prepared
        .filter((card) => !supplierMatchesRequestedProvince(card, payload.province) && typeof card.distanceKm !== "number")
        .sort((a, b) => Number(b.premium) - Number(a.premium) || b.score - a.score || a.name.localeCompare(b.name, "it"));
      return [...areaMatches, ...otherMatches, ...withoutDistance].slice(0, maxResults);
    }

    const withDistance = prepared
      .filter((card) => typeof card.distanceKm === "number")
      .sort(sortByDistance);
    const withoutDistance = prepared
      .filter((card) => typeof card.distanceKm !== "number")
      .sort((a, b) => Number(b.premium) - Number(a.premium) || b.score - a.score || a.name.localeCompare(b.name, "it"));
    return [...withDistance, ...withoutDistance].slice(0, maxResults);
  }

  const premium = prepared.filter((card) => card.premium).sort(sortWithinTier);
  const base = prepared.filter((card) => !card.premium).sort(sortWithinTier);

  if (!base.length || premium.length < maxResults) {
    return [...premium, ...base].slice(0, maxResults);
  }

  const reservedBaseSlots = Math.min(base.length, Math.max(8, Math.floor(maxResults * 0.25)));
  return [...premium.slice(0, maxResults - reservedBaseSlots), ...base.slice(0, reservedBaseSlots)];
}

function areaLabel(serviceArea: ServiceAreaVerdict["serviceArea"], locale: Locale | undefined) {
  if (serviceArea === "italy") {
    if (locale === "en") return "Works across Italy";
    if (locale === "es") return "Trabaja en toda Italia";
    if (locale === "fr") return "Intervient dans toute l'Italie";
    return "Lavora in tutta Italia";
  }
  if (serviceArea === "local") {
    if (locale === "en") return "Local match";
    if (locale === "es") return "Coincide con la zona";
    if (locale === "fr") return "Correspond à la zone";
    return "Sede in zona";
  }
  if (locale === "en") return "Coverage to verify on Vibes";
  if (locale === "es") return "Cobertura a verificar en Vibes";
  if (locale === "fr") return "Couverture à vérifier sur Vibes";
  return "Copertura da verificare su Vibes";
}

function userGeoPoint(payload: SearchPayload): GeoPoint | null {
  const point = { lat: payload.lat ?? Number.NaN, lng: payload.lng ?? Number.NaN };
  if (!isValidGeoPoint(point)) return null;
  const isItalianArea = point.lat >= 35 && point.lat <= 47.8 && point.lng >= 6 && point.lng <= 19;
  return isItalianArea ? point : null;
}

function noStoreJson(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Netlify-CDN-Cache-Control": "no-store",
      "CDN-Cache-Control": "no-store",
      Vary: "Accept-Language"
    }
  });
}

function distanceScoreBoost(distance: number) {
  if (distance <= 15) return 860;
  if (distance <= 35) return 760;
  if (distance <= 75) return 620;
  if (distance <= 150) return 450;
  if (distance <= 300) return 280;
  return Math.max(0, 220 - Math.round(distance / 10));
}

function withDistanceFromUser(card: VibesSupplierCard, payload: SearchPayload) {
  const userPoint = userGeoPoint(payload);
  if (!userPoint) return card;
  if (card.distanceSource === "address" && typeof card.distanceKm === "number") {
    return {
      ...card,
      serviceAreaLabel: localizedDistanceLabel(card.distanceKm, payload.locale)
    };
  }
  return card;
}

function provinceAliases(province: string | null | undefined) {
  const normalized = normalizeSearchText(province);
  if (!normalized) return [];
  return PROVINCE_ALIASES[normalized] ?? [normalized];
}

function supplierMatchesRequestedProvince(card: VibesSupplierCard, province: string | null | undefined) {
  if (italianLocationMatchesArea(card.location, province)) return true;
  const aliases = provinceAliases(province);
  if (!aliases.length) return false;
  const location = normalizeSearchText(card.location);
  return aliases.some((alias) => {
    if (alias.length <= 2) return new RegExp(`\\b${alias}\\b`).test(location);
    return location.includes(alias);
  });
}

function withLocalCoverageLabel(card: VibesSupplierCard, payload: SearchPayload) {
  return {
    ...card,
    serviceArea: "local" as const,
    serviceAreaLabel:
      typeof card.distanceKm === "number"
        ? localizedDistanceLabel(card.distanceKm, payload.locale)
        : areaLabel("local", payload.locale),
    score: card.score + 180
  };
}

function dedupeSuppliers(cards: VibesSupplierCard[]) {
  const seen = new Set<string>();
  return cards.filter((card) => {
    if (seen.has(card.id)) return false;
    seen.add(card.id);
    return true;
  });
}

function compactProfileText(html: string) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*<\/script>/gi, " ")
      .replace(/<style[\s\S]*<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*<\/noscript>/gi, " ")
  ).slice(0, 7000);
}

function extractSupplierAddress(html: string) {
  const rawAddress = firstMatch(html, /<address[^>]*>([\s\S]*?)<\/address>/i);
  return decodeHtml(rawAddress ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function isSpecificStreetAddress(address: string) {
  const normalized = address.toLowerCase();
  const withoutPostalCodes = normalized.replace(/\b\d{5}\b/g, "");
  const hasStreetMarker =
    /\b(via|viale|piazza|p\.za|corso|strada|c\.da|contrada|largo|vicolo|localita|località|loc\.|frazione|borgo|traversa)\b/i.test(
      normalized
    );
  const hasHouseNumberOrKm = /\b(?:km\s*)?\d+[a-z/]?\b/i.test(withoutPostalCodes);
  return hasStreetMarker || hasHouseNumberOrKm;
}

async function fetchSupplierProfileDetails(card: VibesSupplierCard): Promise<SupplierProfileDetails> {
  if (profileDetailsCache.has(card.vibesUrl)) {
    return profileDetailsCache.get(card.vibesUrl)!;
  }

  const promise = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(card.vibesUrl, {
        headers: {
          "User-Agent": "OrganizzaEvento supplier coverage check (+https://organizzaevento.com)",
          Accept: "text/html"
        },
        next: { revalidate: 60 * 60 },
        signal: controller.signal
      });
      if (!response.ok) return { text: "", address: "" };
      const html = await response.text();
      return {
        text: compactProfileText(html),
        address: extractSupplierAddress(html)
      };
    } catch {
      return { text: "", address: "" };
    } finally {
      clearTimeout(timeout);
    }
  })();

  profileDetailsCache.set(card.vibesUrl, promise);
  return promise;
}

async function fetchSupplierProfileText(card: VibesSupplierCard) {
  return (await fetchSupplierProfileDetails(card)).text;
}

async function geocodeItalianAddress(address: string): Promise<GeoPoint | null> {
  const key = normalizeSearchText(address);
  if (!key) return null;
  if (geocodeCache.has(key)) return geocodeCache.get(key)!;

  const promise = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2800);
    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        limit: "1",
        countrycodes: "it",
        q: address
      });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: {
          "User-Agent": "OrganizzaEvento geocoding (supportoforumevento@gmail.com)",
          Accept: "application/json"
        },
        signal: controller.signal
      });
      if (!response.ok) return null;
      const data = (await response.json()) as Array<{ lat?: string; lon?: string }>;
      const lat = Number(data[0]?.lat);
      const lng = Number(data[0]?.lon);
      const point = { lat, lng };
      return isValidGeoPoint(point) ? point : null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  })();

  geocodeCache.set(key, promise);
  return promise;
}

async function withExactAddressDistance(card: VibesSupplierCard, payload: SearchPayload): Promise<VibesSupplierCard> {
  const userPoint = userGeoPoint(payload);
  if (!userPoint) return card;

  const details = await fetchSupplierProfileDetails(card);
  if (!details.address) return card;
  if (!isSpecificStreetAddress(details.address)) {
    return {
      ...card,
      address: details.address
    };
  }

  const addressPoint = await geocodeItalianAddress(details.address);
  if (!addressPoint) {
    return {
      ...card,
      address: details.address
    };
  }

  const distance = distanceKm(userPoint, addressPoint);
  return {
    ...card,
    address: details.address,
    distanceKm: Math.round(distance * 10) / 10,
    distanceSource: "address",
    serviceArea: distance <= 90 ? "local" : card.serviceArea,
    serviceAreaLabel: localizedDistanceLabel(distance, payload.locale),
    score: card.score + distanceScoreBoost(distance) + 240
  };
}

async function enrichExactAddressDistances(cards: VibesSupplierCard[], payload: SearchPayload) {
  if (!userGeoPoint(payload) || !cards.length) return cards;

  const orderedForAddressCheck = [...cards].sort((a, b) => {
    const bArea = Number(Boolean(payload.province && supplierMatchesRequestedProvince(b, payload.province)));
    const aArea = Number(Boolean(payload.province && supplierMatchesRequestedProvince(a, payload.province)));
    return (
      bArea - aArea ||
      Number(b.premium) - Number(a.premium) ||
      b.score - a.score ||
      a.name.localeCompare(b.name, "it", { sensitivity: "base" })
    );
  });
  const exactDistanceIds = new Set(orderedForAddressCheck.slice(0, MAX_EXACT_ADDRESS_DISTANCE_CHECKS).map((card) => card.id));

  return Promise.all(cards.map((card) => (exactDistanceIds.has(card.id) ? withExactAddressDistance(card, payload) : card)));
}

function deterministicCoverageFromProfile(profileText: string): ServiceAreaVerdict {
  const text = normalizeSearchText(profileText);
  const strongNationwideSignals = [
    "tutta italia",
    "tutta la penisola",
    "tutto il territorio nazionale",
    "su tutto il territorio nazionale",
    "in tutta italia",
    "in tutta la penisola",
    "in tutta la nazione",
    "livello nazionale",
    "territorio nazionale",
    "national territory",
    "across italy",
    "all over italy",
    "italy wide",
    "throughout italy"
  ];

  if (strongNationwideSignals.some((signal) => text.includes(signal))) {
    return { compatible: true, serviceArea: "italy" };
  }

  return { compatible: false, serviceArea: "unknown" };
}

async function assessCoverageWithOpenAI(card: VibesSupplierCard, payload: SearchPayload, profileText: string): Promise<ServiceAreaVerdict> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !payload.province || !profileText) return { compatible: false, serviceArea: "unknown" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5500);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_SUPPLIER_MODEL || process.env.OPENAI_COMMUNITY_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Leggi solo il testo pubblico della scheda fornitore. Devi decidere se il fornitore può essere mostrato per una ricerca in una provincia italiana diversa dalla sua sede. " +
                  "Rispondi solo JSON: {\"compatible\": boolean, \"serviceArea\": \"italy\"|\"unknown\"}. " +
                  "compatible deve essere true solo se il testo indica chiaramente copertura in tutta Italia o sul territorio nazionale. " +
                  "Se e ambiguo, compatible=false.\n\n" +
                  `Provincia richiesta: ${payload.province}\nCategoría: ${card.category}\nFornitore: ${card.name}\nSede card: ${card.location}\nTesto scheda:\n${profileText.slice(0, 5000)}`
              }
            ]
          }
        ],
        text: { format: { type: "json_object" } },
        max_output_tokens: 120
      }),
      signal: controller.signal
    });
    if (!response.ok) return { compatible: false, serviceArea: "unknown" };
    const data = (await response.json()) as { output_text: string; output: Array<{ content: Array<{ text: string }> }> };
    const text =
      data.output_text ?? (data.output ?? [])
        .flatMap((item) => item.content ?? [])
        .map((item) => item.text ?? "")
        .join("")
        .trim();
    const parsed = JSON.parse(text || "{}") as Partial<ServiceAreaVerdict>;
    if (parsed.compatible === true && parsed.serviceArea === "italy") {
      return { compatible: true, serviceArea: "italy" };
    }
    return { compatible: false, serviceArea: "unknown" };
  } catch {
    return { compatible: false, serviceArea: "unknown" };
  } finally {
    clearTimeout(timeout);
  }
}

async function verifySupplierCoverage(card: VibesSupplierCard, payload: SearchPayload): Promise<VibesSupplierCard | null> {
  if (!payload.province) return card;

  if (supplierMatchesRequestedProvince(card, payload.province)) {
    return {
      ...card,
      serviceArea: "local",
      serviceAreaLabel: areaLabel("local", payload.locale)
    };
  }

  const profileText = await fetchSupplierProfileText(card);
  const deterministic = deterministicCoverageFromProfile(profileText);
  if (deterministic.compatible) {
    return {
      ...card,
      serviceArea: deterministic.serviceArea,
      serviceAreaLabel: areaLabel(deterministic.serviceArea, payload.locale),
      score: card.score + 140
    };
  }

  const ai = await assessCoverageWithOpenAI(card, payload, profileText);
  if (!ai.compatible) return null;

  return {
    ...card,
    serviceArea: ai.serviceArea,
    serviceAreaLabel: areaLabel(ai.serviceArea, payload.locale),
    score: card.score + 120
  };
}

function parseSupplierCards(html: string, category: { label: string; slug: string }, payload: SearchPayload) {
  return html
    .split('<div class="gb-exp-tab')
    .slice(1)
    .map((chunk): VibesSupplierCard | null => {
      const href = firstMatch(chunk, /href="(https:\/\/www\.vibesplanner\.com\/vetrine\/[^"]+)"/);
      const name = decodeHtml(firstMatch(chunk, /class="gb-h3"[^>]*>([\s\S]*?)<\/a>/) ?? "");
      const location = decodeHtml(firstMatch(chunk, /<gb-icon class="bi bi-geo-alt"[\s\S]*?<span>([\s\S]*?)<\/span>/) ?? "");
      const imagePath = firstMatch(chunk, /<source srcset="([^"]+thumb_[^"]+\.(?:jpg|jpeg|png|webp))"/i);
      const premium = /Premium Vibes Club/i.test(chunk);
      if (!href || !name) return null;
      const slug = supplierSlugFromUrl(href);
      const services = [category.label, payload.subcategory, payload.eventType].filter((item): item is string => Boolean(item));
      const card: VibesSupplierCard = {
        id: slug || href,
        name,
        category: category.label,
        categorySlug: category.slug,
        location,
        imageUrl: absoluteVibesUrl(imagePath),
        vibesUrl: href,
        premium,
        serviceArea: "unknown",
        serviceAreaLabel: areaLabel("unknown", payload.locale),
        services,
        score: 0
      };
      card.score = scoreSupplier(card, payload);
      return card;
    })
    .filter((item): item is VibesSupplierCard => Boolean(item));
}

async function classifyWithOpenAI(payload: SearchPayload): Promise<Partial<SearchPayload>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !payload.query) return {};

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const categories = VIBES_SUPPLIER_CATEGORIES.map((item) => `${item.slug}: ${item.label} (${item.aliases.join(", ")})`).join("\n");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_COMMUNITY_MODEL || process.env.OPENAI_MODEL || "gpt-5.4-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Return only JSON with optional keys category, subcategory, province, eventType. Choose category from this list:\n${categories}\n\nSearch: ${payload.query}`
              }
            ]
          }
        ],
        text: { format: { type: "json_object" } },
        max_output_tokens: 180
      }),
      signal: controller.signal
    });
    if (!response.ok) return {};
    const data = (await response.json()) as { output_text: string; output: Array<{ content: Array<{ text: string }> }> };
    const text =
      data.output_text ?? (data.output ?? [])
        .flatMap((item) => item.content ?? [])
        .map((item) => item.text ?? "")
        .join("")
        .trim();
    const parsed = JSON.parse(text || "{}") as SearchPayload;
    return parsed;
  } catch {
    return {};
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchCategoryHtml(categorySlug: string, page = 1) {
  try {
    const response = await fetch(categoryUrl(categorySlug, page), {
      headers: {
        "User-Agent": "OrganizzaEvento supplier search (+https://organizzaevento.com)",
        Accept: "text/html"
      },
      next: { revalidate: 60 * 60 }
    });
    if (!response.ok) return "";
    return response.text();
  } catch {
    return "";
  }
}

async function fetchCategoryResults(categorySlug: string, payload: SearchPayload, maxPages: number) {
  const category = VIBES_SUPPLIER_CATEGORIES.find((item) => item.slug === categorySlug);
  if (!category) return [];
  const firstPageHtml = await fetchCategoryHtml(category.slug);
  if (!firstPageHtml) return [];

  const pageCount = Math.min(discoverPageCount(firstPageHtml, category.slug), maxPages);
  const remainingPages = Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => index + 2);
  const remainingHtml = await Promise.all(remainingPages.map((page) => fetchCategoryHtml(category.slug, page).catch(() => "")));

  return [firstPageHtml, ...remainingHtml]
    .filter(Boolean)
    .flatMap((html) => parseSupplierCards(html, category, payload));
}

function fallbackResults(payload: SearchPayload) {
  const detected = categoryFromSearch([payload.category, payload.query, payload.subcategory].filter(Boolean).join(" "));
  const normalized = normalizeSearchText([payload.query, payload.category, payload.subcategory, payload.eventType].filter(Boolean).join(" "));
  const filtered = fallbackSuppliers.filter((supplier) => {
    if (payload.category && supplier.categorySlug !== payload.category) return false;
    if (detected && supplier.categorySlug !== detected.slug) return false;
    if (!normalized) return true;
    const haystack = normalizeSearchText([supplier.name, supplier.category, supplier.location, ...supplier.services].join(" "));
    return normalized.split(" ").filter(Boolean).some((token) => haystack.includes(token)) || haystack.includes(normalized);
  });
  const source = filtered.length ? filtered : payload.category ? fallbackSuppliers.filter((supplier) => supplier.categorySlug === payload.category) : fallbackSuppliers;
  return source.map((supplier) => ({
    ...supplier,
    serviceAreaLabel: areaLabel(supplier.serviceArea, payload.locale),
    score: scoreSupplier({ ...supplier, serviceAreaLabel: areaLabel(supplier.serviceArea, payload.locale), score: 0 }, payload)
  }));
}

function normalizePayload(payload: Partial<SearchPayload>): SearchPayload {
  const normalizeField = (value: string | undefined | null) =>
    normalizeSearchText(value || "").slice(0, 180).trim();
  const normalizeCoordinate = (value: unknown) => {
    const numeric = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
    return Number.isFinite(numeric) ? numeric : null;
  };

  return {
    query: normalizeField(payload.query),
    category: normalizeField(payload.category),
    subcategory: normalizeField(payload.subcategory),
    province: normalizeField(payload.province),
    eventType: normalizeField(payload.eventType),
    locale: payload.locale || "it",
    lat: normalizeCoordinate(payload.lat),
    lng: normalizeCoordinate(payload.lng)
  };
}

async function payloadWithRequestedGeoPoint(payload: SearchPayload): Promise<SearchPayload> {
  if (userGeoPoint(payload)) return payload;

  const addressCandidate = isSpecificStreetAddress(payload.province) ? payload.province : payload.query;
  if (!addressCandidate || !isSpecificStreetAddress(addressCandidate)) return payload;

  const point = await geocodeItalianAddress(addressCandidate);
  return point ? { ...payload, lat: point.lat, lng: point.lng } : payload;
}

async function runSupplierSearch(payload: SearchPayload) {
  try {
    const geoReadyPayload = await payloadWithRequestedGeoPoint(payload);
    const geoPoint = userGeoPoint(geoReadyPayload);
    const explicitArea = findItalianAreaLabel(payload.province) || payload.province || findItalianAreaLabel(payload.query);
    const hasInitialIntent = [payload.query, payload.category, payload.subcategory, payload.eventType, payload.province].some(Boolean);
    const geoProvince = geoPoint && !hasInitialIntent ? nearestItalianProvince(geoPoint).label : "";
    const basePayload = explicitArea || geoProvince ? { ...geoReadyPayload, province: explicitArea || geoProvince } : geoReadyPayload;
    const ai = await classifyWithOpenAI(basePayload);
    const merged: SearchPayload = {
      ...basePayload,
      category: basePayload.category || ai.category || "",
      subcategory: basePayload.subcategory || ai.subcategory || "",
      province: basePayload.province || ai.province || "",
      eventType: basePayload.eventType || ai.eventType || ""
    };

    const detected = categoryFromSearch([merged.category, merged.query, merged.subcategory].filter(Boolean).join(" "));
    const selectedCategory = VIBES_SUPPLIER_CATEGORIES.find((item) => item.slug === merged.category) ?? detected;
    const hasExplicitIntent = [merged.query, merged.category, merged.subcategory, merged.eventType].some(Boolean);
    const categorySlugs = selectedCategory
      ? [selectedCategory.slug]
      : geoPoint && !hasExplicitIntent
        ? VIBES_SUPPLIER_CATEGORIES.map((category) => category.slug)
        : ["location", "catering-e-gastronomia", "musica", "intrattenimento", "fotografi-e-videomaker"];
    const pagesPerCategory = selectedCategory ? MAX_SELECTED_CATEGORY_PAGES : geoPoint && !hasExplicitIntent ? 1 : MAX_FALLBACK_CATEGORY_PAGES;

    const nested = await Promise.all(categorySlugs.map((slug) => fetchCategoryResults(slug, merged, pagesPerCategory)));
    const seen = new Set<string>();
    const uniqueCards = nested
      .flat()
      .filter((card) => {
        if (seen.has(card.id)) return false;
        seen.add(card.id);
        return true;
      });
    const addressAwareCards = await enrichExactAddressDistances(uniqueCards, merged);
    const candidates = rankedSuppliers(addressAwareCards, merged.province ? MAX_COVERAGE_CANDIDATES : MAX_VISIBLE_RESULTS, merged);

    let verifiedResults: VibesSupplierCard[] = [];
    if (merged.province) {
      const directLocalMatches = candidates
        .filter((card) => supplierMatchesRequestedProvince(card, merged.province))
        .map((card) => withLocalCoverageLabel(card, merged));

      verifiedResults.push(...directLocalMatches);

      const shouldCheckNationwide =
        directLocalMatches.length < MIN_LOCAL_RESULTS_BEFORE_SKIPPING_NATIONWIDE ||
        [merged.query, merged.category, merged.subcategory, merged.eventType].some(Boolean);
      const maxNationwideChecks = directLocalMatches.length
        ? MAX_NATIONWIDE_CHECKS_WITH_LOCAL_RESULTS
        : MAX_NATIONWIDE_CHECKS_WITHOUT_LOCAL_RESULTS;

      if (shouldCheckNationwide && verifiedResults.length < MAX_VISIBLE_RESULTS) {
        const nonLocalCandidates = candidates
          .filter((card) => !supplierMatchesRequestedProvince(card, merged.province))
          .slice(0, maxNationwideChecks);

        for (let index = 0; index < nonLocalCandidates.length && verifiedResults.length < MAX_VISIBLE_RESULTS; index += 6) {
          const batch = nonLocalCandidates.slice(index, index + 6);
          const verified = await Promise.all(batch.map((card) => verifySupplierCoverage(card, merged)));
          verifiedResults.push(...verified.filter((card): card is VibesSupplierCard => Boolean(card)));
        }
      }
    } else {
      verifiedResults.push(...candidates);
    }

    verifiedResults = dedupeSuppliers(verifiedResults);
    const liveResults = rankedSuppliers(verifiedResults, MAX_VISIBLE_RESULTS, merged);
    const results = liveResults.length ? liveResults : rankedSuppliers(fallbackResults(merged), MAX_VISIBLE_RESULTS, merged);

    return {
      ok: true,
      query: merged,
      results,
      source: liveResults.length ? "vibesplanner.com" : "vibesplanner.com fallback"
    };
  } catch {
    return {
      ok: true,
      query: payload,
      results: fallbackResults(payload),
      source: "vibesplanner.com fallback"
    };
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const payload = normalizePayload({
    query: url.searchParams.get("query") ?? url.searchParams.get("q") ?? "",
    category: url.searchParams.get("category") ?? "",
    subcategory: url.searchParams.get("subcategory") ?? "",
    province: url.searchParams.get("province") ?? "",
    eventType: url.searchParams.get("eventType") ?? "",
    locale: (url.searchParams.get("locale") as Locale | null) ?? "it",
    lat: Number(url.searchParams.get("lat") ?? Number.NaN),
    lng: Number(url.searchParams.get("lng") ?? Number.NaN)
  });
  return noStoreJson(await runSupplierSearch(payload));
}

export async function POST(request: Request) {
  const payload = normalizePayload((await request.json().catch(() => ({}))) as Partial<SearchPayload>);
  return noStoreJson(await runSupplierSearch(payload));
}

