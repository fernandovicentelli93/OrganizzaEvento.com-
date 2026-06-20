import { sanitizeSensitiveData } from "@/lib/redaction-engine";

export type CommunityModerationContext =
  | "public_question"
  | "public_answer"
  | "public_report"
  | "private_support"
  | "supplier_request";

export type CommunityModerationDecision = "allow" | "review" | "block";

export type CommunityModerationResult = {
  decision: CommunityModerationDecision;
  reason: string;
  categories: string[];
  sanitizedText: string;
  redactionsCount: number;
};

export type CommunityChatInput = {
  locale: "it" | "en" | "es" | "fr";
  message: string;
  sourcePath: string | null;
};

const defaultModerationResult: CommunityModerationResult = {
  decision: "allow",
  reason: "Contenuto compatibile con una community eventi.",
  categories: [],
  sanitizedText: "",
  redactionsCount: 0
};

function outputLanguage(locale: CommunityChatInput["locale"]) {
  if (locale === "en") return "English";
  if (locale === "es") return "Spanish";
  if (locale === "fr") return "French";
  return "Italian";
}

function extractOutputText(response: unknown) {
  const data = response as { output_text: unknown; output: Array<{ content: Array<{ text: unknown }> }> };
  if (typeof data.output_text === "string") return data.output_text;

  return (data.output ?? [])
    .flatMap((item) => item.content ?? [])
    .map((content) => (typeof content.text === "string" ? content.text : ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function safeJsonObject(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned) as Record<string, unknown>;
}

async function createOpenAIResponse(prompt: string, options: { maxOutputTokens: number; timeoutMs: number }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 16000);
  const model = process.env.OPENAI_COMMUNITY_MODEL || process.env.OPENAI_MODEL || "gpt-5.4-mini";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: prompt,
        store: false,
        max_output_tokens: options.maxOutputTokens ?? 700,
        truncation: "auto"
      }),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = data as { error: { message: unknown } };
      throw new Error(typeof error.error.message === "string" ? error.error.message : `OpenAI failed: ${response.status}`);
    }

    return extractOutputText(data);
  } finally {
    clearTimeout(timeout);
  }
}

function shouldForceReviewForContacts(context: CommunityModerationContext, redactionsCount: number) {
  return redactionsCount > 0 && (context === "public_question" || context === "public_answer" || context === "public_report");
}

export async function moderateCommunityContent(input: {
  context: CommunityModerationContext;
  fields: Array<string | null | undefined>;
}): Promise<CommunityModerationResult> {
  const rawText = input.fields.filter(Boolean).join("\n\n").slice(0, 9000);
  const redacted = sanitizeSensitiveData(rawText);
  const baseResult = {
    ...defaultModerationResult,
    sanitizedText: redacted.sanitizedText,
    redactionsCount: redacted.totalRedactions
  };

  if (!rawText.trim()) return baseResult;

  if (shouldForceReviewForContacts(input.context, redacted.totalRedactions)) {
    return {
      ...baseResult,
      decision: "review",
      reason: "Il testo pubblico contiene recapiti o riferimenti riconoscibili da controllare.",
      categories: ["personal_data"]
    };
  }

  if (!process.env.OPENAI_API_KEY) return baseResult;

  try {
    const prompt = [
      "You are the invisible safety moderator for OrganizzaEvento.com, an Italian community about events.",
      "Classify the text without rewriting it.",
      "Be strict with insults, profanity, blasphemy, hate, sexual content, threats, spam, politics, propaganda, public contact details, private third-party data, supplier accusations, defamation, illegal content, scams and aggressive promotion.",
      "Allow normal event questions, budget doubts, supplier quote doubts and emotional but civil messages.",
      "Use review for borderline supplier complaints, possible personal data, vague accusations or unclear risk.",
      "Use block only for clearly unsafe, offensive, political, spammy or defamatory content.",
      "Return JSON only with: decision allow|review|block, reason, categories array.",
      "",
      JSON.stringify({
        context: input.context,
        text: redacted.sanitizedText.slice(0, 7000),
        redactionsCount: redacted.totalRedactions
      })
    ].join("\n");

    const output = await createOpenAIResponse(prompt, { maxOutputTokens: 360, timeoutMs: 12000 });
    const parsed = safeJsonObject(output);
    const decision = parsed.decision === "block" || parsed.decision === "review" ? parsed.decision : "allow";
    const categories = Array.isArray(parsed.categories)
      ? parsed.categories.filter((item): item is string => typeof item === "string").slice(0, 8)
      : [];

    return {
      ...baseResult,
      decision,
      reason: typeof parsed.reason === "string" ? parsed.reason.slice(0, 240) : baseResult.reason,
      categories
    };
  } catch (error) {
    console.error("Moderazione interna non disponibile, uso filtri locali.", error);
    return baseResult;
  }
}

export function assertModerationAllows(result: CommunityModerationResult) {
  if (result.decision === "block") {
    throw new Error("Il contenuto e stato bloccato dai controlli della community. Riscrivilo senza offese, politica, dati personali, accuse o spam.");
  }
}

export async function createCommunityChatReply(input: CommunityChatInput) {
  const redacted = sanitizeSensitiveData(input.message);
  const language = outputLanguage(input.locale);

  if (!redacted.sanitizedText || redacted.sanitizedText.length < 4) {
    return "";
  }

  if (!process.env.OPENAI_API_KEY) {
    return fallbackChatReply(input.locale);
  }

  try {
    const prompt = [
      "You are the discreet support assistant for OrganizzaEvento.com.",
      `Write in ${language}.`,
      "Do not say you are AI. Do not promise legal, financial or professional advice.",
      "Use only the requested language and do not mix languages unless the user wrote a foreign brand name.",
      "Help the user understand the next practical step for event planning in Italy.",
      "If they need venues, catering, music, photo/video, flowers, entertainment or other suppliers, tell them to use the Vibes Planner supplier request button shown below the chat. Do not paste the URL.",
      "If they need to compare a quote, suggest the quote analysis page. If they need community feedback, suggest opening or reading a conversation.",
      "Keep the answer short, warm and practical: 2-4 sentences max.",
      "Use plain text only. No Markdown, no bullet lists, no asterisks and no headings.",
      "Never expose or repeat personal data, supplier names, phone numbers or emails.",
      "",
      JSON.stringify({
        sourcePath: input.sourcePath ?? null,
        message: redacted.sanitizedText.slice(0, 2500)
      })
    ].join("\n");

    const output = await createOpenAIResponse(prompt, { maxOutputTokens: 500, timeoutMs: 14000 });
    return cleanChatReply(sanitizeSensitiveData(output).sanitizedText).slice(0, 1200);
  } catch (error) {
    console.error("Chat supporto interno non disponibile.", error);
    return fallbackChatReply(input.locale);
  }
}

function cleanChatReply(value: string) {
  return value
    .replace(/\*\*(.*)\*\*/g, "$1")
    .replace(/__(.*)__/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\s+\n/g, "\n")
    .trim();
}

export async function createSupplierRequestReply(input: {
  eventType: string;
  city: string | null;
  region: string | null;
  eventDate: Date | null;
  peopleCount: number | null;
  budgetRange: string | null;
  supplierTypes: string[];
  message: string;
  name: string | null;
}) {
  const fallback = fallbackSupplierReply(input);
  if (!process.env.OPENAI_API_KEY) return fallback;

  const redactedMessage = sanitizeSensitiveData(input.message).sanitizedText;

  try {
    const prompt = [
      "You are the internal supplier request assistant for OrganizzaEvento.com.",
      "Write in Italian for the private backend team, not for the public website.",
      "Do not mention AI. Do not invent supplier names or availability.",
      "Create a useful operational note: request summary, missing data, supplier categories to prioritize, questions to ask before sending to suppliers, and risk signals.",
      "Keep it practical and concise.",
      "",
      JSON.stringify({
        eventType: input.eventType,
        city: input.city,
        region: input.region,
        eventDate: input.eventDate?.toISOString() ?? null,
        peopleCount: input.peopleCount,
        budgetRange: input.budgetRange,
        supplierTypes: input.supplierTypes,
        message: redactedMessage.slice(0, 3000),
        name: input.name ? "[NOME_CLIENTE]" : null
      })
    ].join("\n");

    const output = await createOpenAIResponse(prompt, { maxOutputTokens: 800, timeoutMs: 16000 });
    return sanitizeSensitiveData(output).sanitizedText.slice(0, 2200) || fallback;
  } catch (error) {
    console.error("Assistente richiesta fornitori non disponibile.", error);
    return fallback;
  }
}

function fallbackChatReply(locale: CommunityChatInput["locale"]) {
  if (locale === "en") {
    return "Tell me the event type, city or region, guest count and what is unclear. If you need suppliers, use the Vibes Planner button below the chat; if you already have a quote, start from the quote analysis page.";
  }
  if (locale === "es") {
    return "Indica tipo de evento, ciudad o region, invitados y que no esta claro. Si necesitas proveedores, usa el boton de Vibes Planner bajo el chat; si tienes presupuesto, empieza por el analizador.";
  }
  if (locale === "fr") {
    return "Indiquez le type d'événement, la ville ou region, les invités et ce qui n'est pas clair. Si vous cherchez des prestataires, utilisez le bouton Vibes Planner sous le chat; si vous avez un devis, commencez par l'analyse.";
  }
  return "Scrivi tipo evento, zona, numero persone e cosa non ti torna. Se cerchi fornitori, usa il pulsante Vibes Planner sotto la chat; se hai già un preventivo, parti dalla pagina di analisi.";
}

function fallbackSupplierReply(input: {
  eventType: string;
  city: string | null;
  region: string | null;
  eventDate: Date | null;
  peopleCount: number | null;
  budgetRange: string | null;
  supplierTypes: string[];
  message: string;
  name: string | null;
}) {
  const place = [input.city, input.region].filter(Boolean).join(", ") || "zona da definire";
  const missing = [];
  if (!input.city && !input.region) missing.push("zona precisa");
  if (!input.eventDate) missing.push("data o periodo");
  if (!input.peopleCount) missing.push("numero persone");
  if (!input.budgetRange) missing.push("budget indicativo");

  return [
    `Richiesta per ${input.eventType.toLowerCase()} in ${place}.`,
    `Fornitori richiesti: ${input.supplierTypes.join(", ")}.`,
    missing.length ? `Dati da recuperare prima del contatto: ${missing.join(", ")}.` : "La richiesta contiene i dati minimi per iniziare il confronto.",
    "Prima di inviare ai fornitori, preparare una scheda unica con orari, numero persone, stile, budget e servizi già inclusi."
  ].join("\n\n");
}
