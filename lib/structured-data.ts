export type FaqStructuredEntry = {
  question: string;
  answer: string;
};

function normalizeStructuredText(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function idSafeSuffix(value: string, fallback: string) {
  const normalized = normalizeStructuredText(value).replace(/\s+/g, "-");
  return normalized || fallback;
}

export function faqMainEntity(entries: ReadonlyArray<FaqStructuredEntry>, baseUrl?: string) {
  const seen = new Set<string>();
  const uniqueEntries = entries.filter((entry) => {
    const key = normalizeStructuredText(entry.question);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniqueEntries.map((entry, index) => {
    const suffix = idSafeSuffix(entry.question, `faq-${index + 1}`);
    const questionId = baseUrl ? `${baseUrl}#faq-${suffix}` : undefined;
    return {
      "@type": "Question",
      ...(questionId ? { "@id": questionId } : {}),
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        ...(questionId ? { "@id": `${questionId}-answer` } : {}),
        text: entry.answer
      }
    };
  });
}

function structuredAnswerKey(answer: Record<string, unknown>) {
  const id = typeof answer["@id"] === "string" ? answer["@id"] : "";
  const url = typeof answer.url === "string" ? answer.url : "";
  const text = normalizeStructuredText(answer.text);
  return id || url || text;
}

export function uniqueSuggestedAnswers<T extends Record<string, unknown>>(answers: T[], acceptedAnswer?: T | null) {
  const seen = new Set<string>();
  if (acceptedAnswer) {
    const acceptedKey = structuredAnswerKey(acceptedAnswer);
    if (acceptedKey) seen.add(acceptedKey);
  }

  return answers.filter((answer) => {
    const key = structuredAnswerKey(answer);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
