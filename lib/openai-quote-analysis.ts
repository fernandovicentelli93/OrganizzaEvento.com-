import type { QuoteEventType, QuoteObjective, QuoteServiceType } from "@/lib/quote-analysis-engine";
import { sanitizeSensitiveData } from "@/lib/redaction-engine";

export type OpenAIQuoteAnalysisInput = {
  locale: "it" | "en" | "es" | "fr";
  text: string;
  serviceType: QuoteServiceType;
  eventType: QuoteEventType;
  city: string;
  province: string;
  region: string;
  eventDate: string;
  guestsCount: number | null;
  durationEstimate: string;
  totalAmount: string;
  objective: QuoteObjective;
  selectedDetails: string[];
  fileCount: number;
};

export type OpenAIQuoteAnalysis = {
  user_summary: string;
  public_anonymized_summary: string;
  included_items: string[];
  unclear_items: string[];
  possible_hidden_costs: string[];
  questions_to_ask: string[];
  supplier_message_draft: string;
  recommended_next_action: string;
  score_note: string;
};

export type OpenAIQuoteAnalysisResult = {
  model: string;
  analysis: OpenAIQuoteAnalysis;
};

const fallbackAnalysis: OpenAIQuoteAnalysis = {
  user_summary: "",
  public_anonymized_summary: "",
  included_items: [],
  unclear_items: [],
  possible_hidden_costs: [],
  questions_to_ask: [],
  supplier_message_draft: "",
  recommended_next_action: "",
  score_note: ""
};

function cleanStringArray(value: unknown, max = 7) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? sanitizeSensitiveData(item.trim()).sanitizedText : ""))
    .filter(Boolean)
    .slice(0, max);
}

function cleanString(value: unknown, maxLength = 900) {
  if (typeof value !== "string") return "";
  return sanitizeSensitiveData(value.trim().slice(0, maxLength)).sanitizedText;
}

function extractOutputText(response: unknown) {
  const data = response as { output_text: unknown; output: Array<{ content: Array<{ text: unknown; type: string }> }> };
  if (typeof data.output_text === "string") return data.output_text;

  return (data.output ?? [])
    .flatMap((item) => item.content ?? [])
    .map((content) => (typeof content.text === "string" ? content.text : ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function parseAnalysis(text: string): OpenAIQuoteAnalysis {
  const cleaned = text.trim();
  const fencedMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch?.[1] ?? cleaned;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  const maybeJson = firstBrace >= 0 && lastBrace > firstBrace ? candidate.slice(firstBrace, lastBrace + 1).trim() : candidate;

  let parsed = {} as Partial<OpenAIQuoteAnalysis>;
  try {
    parsed = JSON.parse(maybeJson) as Partial<OpenAIQuoteAnalysis>;
  } catch (_error) {
    const fallbackText = cleaned.replace(/^```(?:json)?\s*|```$/gi, "").trim();
    parsed = {
      user_summary: fallbackText.slice(0, 900),
      public_anonymized_summary: fallbackText.slice(0, 1200),
      included_items: [],
      unclear_items: [],
      possible_hidden_costs: [],
      questions_to_ask: [],
      supplier_message_draft: "",
      recommended_next_action: "",
      score_note: ""
    };
  }

  return {
    ...fallbackAnalysis,
    user_summary: cleanString(parsed.user_summary),
    public_anonymized_summary: cleanString(parsed.public_anonymized_summary, 1200),
    included_items: cleanStringArray(parsed.included_items),
    unclear_items: cleanStringArray(parsed.unclear_items),
    possible_hidden_costs: cleanStringArray(parsed.possible_hidden_costs),
    questions_to_ask: cleanStringArray(parsed.questions_to_ask, 8),
    supplier_message_draft: cleanString(parsed.supplier_message_draft, 900),
    recommended_next_action: cleanString(parsed.recommended_next_action, 500),
    score_note: cleanString(parsed.score_note, 400)
  };
}

function promptForQuote(input: OpenAIQuoteAnalysisInput) {
  const language =
    input.locale === "en" ? "English" : input.locale === "es" ? "Spanish" : input.locale === "fr" ? "French" : "Italian";

  return [
    "You are the internal quote analyst for OrganizzaEvento.com.",
    "Analyze an event supplier quote for a public community discussion.",
    `Write only in ${language}.`,
    "Never invent exact market prices, suppliers, reviews or statistics.",
    "If the quote says starting from, indicative price, on request or reserved negotiation, be careful and do not judge it harshly only because the final amount is missing.",
    "Classify team building, corporate retreats, company events, conventions, meetings, client events, conferences, kickoffs and workshops as corporate/team-building contexts. Do not classify them as catering or venue only because the quote mentions dinner, coffee break, room rental or a location.",
    "For corporate/team-building quotes, focus on attendee count, objectives, facilitation, agenda, AV rehearsals, welcome desk, badges, coffee breaks, room setup, plan B, insurance, language support and schedule-change costs.",
    "Do not replace ordinary prices, ranges, dates, times or guest counts with redaction tags. Only personal data and supplier identifiers must stay hidden.",
    `If serviceType is one of location, catering, team_building, evento_aziendale, fiori, open_bar, dj, band, fotografo or other, treat it as the preferred context for all interpretations.`,
    "Do not override the selected serviceType unless the text is clearly and unambiguously about another complete supplier domain. When serviceType is location, prioritize venue/space and rental details over food/beverage terms, except when text is fully about a different explicit service.",
    "When serviceType is team_building or evento_aziendale, report on corporate/team-building aspects even if words like catering, room rental or coffee break are present in budget lines.",
    "Focus on a natural reading of the offer first, then included items, unclear clauses, hidden extras, practical questions and whether the quote is readable.",
    "The public summary must feel like a real community post, not a checklist, audit, advice article or robotic report.",
    "Write the public summary in first person, as if the user is opening a conversation: start naturally with the local equivalent of 'Hi, I received this quote...' and end with a practical question for the community.",
    "For score_note, be balanced: mention the strongest reason for the score and the one thing that prevents a higher score.",
    "Do not expose personal data, supplier names, phone numbers, emails, addresses, VAT IDs or recognizable references.",
    "Return strict JSON only, with this shape:",
    JSON.stringify({
      user_summary: "short private-facing summary",
      public_anonymized_summary: "summary safe to publish in the community",
      included_items: ["item"],
      unclear_items: ["item"],
      possible_hidden_costs: ["item"],
      questions_to_ask: ["question"],
      supplier_message_draft: "short message the user can send to the supplier",
      recommended_next_action: "one practical next action",
      score_note: "short qualitative note about the quote score"
    }),
    "",
    "Input:",
    JSON.stringify(
      {
        locale: input.locale,
        serviceType: input.serviceType,
        eventType: input.eventType,
        city: input.city,
        province: input.province,
        region: input.region,
        eventDate: input.eventDate,
        guestsCount: input.guestsCount,
        durationEstimate: input.durationEstimate,
        totalAmount: input.totalAmount,
        objective: input.objective,
        selectedDetails: input.selectedDetails,
        fileCount: input.fileCount,
        quoteText: input.text.slice(0, 9000)
      },
      null,
      2
    )
  ].join("\n");
}

async function createResponse(model: string, input: OpenAIQuoteAnalysisInput) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  const body: Record<string, unknown> = {
    model,
    input: promptForQuote(input),
    store: false,
    max_output_tokens: 1200,
    truncation: "auto"
  };

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiError = data as { error: { message: unknown } };
      const message =
        typeof apiError.error.message === "string"
          ? apiError.error.message
          : `OpenAI response failed with status ${response.status}`;
      throw new Error(message);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function createOpenAIQuoteAnalysis(input: OpenAIQuoteAnalysisInput): Promise<OpenAIQuoteAnalysisResult> {
  const primaryModel = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const fallbackModel = process.env.OPENAI_FALLBACK_MODEL || "gpt-5-mini";
  const models = Array.from(new Set([primaryModel, fallbackModel].filter(Boolean)));
  let lastError: unknown;

  for (const model of models) {
    try {
      const data = await createResponse(model, input);
      const outputText = extractOutputText(data);
      if (!outputText) throw new Error("OpenAI returned an empty response");
      return { model, analysis: parseAnalysis(outputText) };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("OpenAI quote analysis failed");
}
