import { NextResponse } from "next/server";
import {
  createOpenAIQuoteAnalysis,
  type OpenAIQuoteAnalysisInput
} from "@/lib/openai-quote-analysis";
import { type QuoteEventType, type QuoteObjective, type QuoteServiceType } from "@/lib/quote-analysis-engine";
import { sanitizeSensitiveData } from "@/lib/redaction-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const locales = new Set(["it", "en", "es", "fr"]);
const services = new Set(["dj", "band", "fotografo", "catering", "location", "team_building", "evento_aziendale", "fiori", "open_bar", "altro"]);
const eventTypes = new Set(["matrimonio", "compleanno", "aziendale", "festa_privata", "diciottesimo", "cerimonia", "altro"]);
const objectives = new Set(["capire_caro", "cosa_manca", "confrontare", "domande_fornitore", "pubblicare_anonima"]);

function pickString(value: unknown, maxLength = 120) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function pickNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function pickList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim().slice(0, 80) : ""))
    .filter(Boolean)
    .slice(0, 14);
}

function fallbackReason(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("401") || message.includes("api key") || message.includes("unauthorized") || message.includes("auth")) {
    return "openai_auth_failed";
  }
  if (message.includes("quota") || message.includes("billing") || message.includes("credit")) {
    return "openai_quota_or_billing";
  }
  if (message.includes("model") || message.includes("not found")) {
    return "openai_model_unavailable";
  }
  if (message.includes("abort") || message.includes("timeout")) {
    return "openai_timeout";
  }
  return "openai_provider_failed";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const rawText = pickString(body.text, 12000);
    const sanitized = sanitizeSensitiveData(rawText);
    const text = sanitized.sanitizedText;

    if (!text || text.length < 20) {
      return NextResponse.json({ ok: false, error: "quote_text_required" }, { status: 400 });
    }

    const input: OpenAIQuoteAnalysisInput = {
      locale: locales.has(String(body.locale)) ? (body.locale as OpenAIQuoteAnalysisInput["locale"]) : "it",
      text,
      serviceType: services.has(String(body.serviceType)) ? (body.serviceType as QuoteServiceType) : "altro",
      eventType: eventTypes.has(String(body.eventType)) ? (body.eventType as QuoteEventType) : "altro",
      city: pickString(body.city),
      province: pickString(body.province, 30),
      region: pickString(body.region),
      eventDate: pickString(body.eventDate, 40),
      guestsCount: pickNumber(body.guestsCount),
      durationEstimate: pickString(body.durationEstimate, 80),
      totalAmount: pickString(body.totalAmount, 80),
      objective: objectives.has(String(body.objective)) ? (body.objective as QuoteObjective) : "domande_fornitore",
      selectedDetails: pickList(body.selectedDetails),
      fileCount: Math.max(0, Math.min(10, pickNumber(body.fileCount) ?? 0))
    };

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ ok: false, error: "openai_not_configured" }, { status: 503 });
    }

    try {
      const result = await createOpenAIQuoteAnalysis(input);
      return NextResponse.json({ ok: true, source: "openai", ...result });
    } catch (error) {
      console.error("OpenAI quote analysis failed", error);
      return NextResponse.json({ ok: false, error: fallbackReason(error) }, { status: 503 });
    }
  } catch (error) {
    console.error("OpenAI quote analysis failed", error);
    return NextResponse.json({ ok: false, error: "openai_quote_failed" }, { status: 503 });
  }
}
