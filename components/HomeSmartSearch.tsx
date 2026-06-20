"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categoryPublicName, postTypePublicLabel } from "@/lib/constants";
import { displayQuestionTitle } from "@/lib/question-title-overrides";

type SearchQuestion = {
  title: string;
  slug: string;
  content: string;
  postType: string;
  eventType?: string | null;
  city?: string | null;
  region?: string | null;
  budgetRange?: string | null;
  answersCount: number;
  usefulVotes: number;
  category?: {
    name: string;
    slug: string;
  } | null;
};

type HomeSmartSearchProps = {
  questions: SearchQuestion[];
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandTokens(tokens: string[]) {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    if (["budget", "costo", "costi", "prezzo", "prezzi", "spesa", "preventivo"].some((item) => token.includes(item))) {
      ["quanto", "costa", "preventivo", "budget", "prezzo"].forEach((item) => expanded.add(item));
    }

    if (["problema", "problemi", "fornitore", "fornitori", "caparra", "ritardo"].some((item) => token.includes(item))) {
      ["problema", "fornitori", "caparra", "accordi", "ritardi"].forEach((item) => expanded.add(item));
    }

    if (["musica", "dj", "band", "siae"].some((item) => token.includes(item))) {
      ["musica", "dj", "band", "siae"].forEach((item) => expanded.add(item));
    }

    if (["location", "villa", "ristorante", "sala"].some((item) => token.includes(item))) {
      ["location", "villa", "ristorante", "sala"].forEach((item) => expanded.add(item));
    }
  }

  return [...expanded];
}

function scoreQuestion(question: SearchQuestion, query: string) {
  const rawTokens = normalize(query).split(" ").filter((token) => token.length > 1);
  const tokens = expandTokens(rawTokens);
  if (!tokens.length) return 0;

  const title = normalize(displayQuestionTitle(question.title));
  const content = normalize(question.content);
  const category = normalize(`${question.category?.name ?? ""} ${question.category?.slug ?? ""}`);
  const metadata = normalize(
    [
      question.postType,
      question.eventType,
      question.city,
      question.region,
      question.budgetRange,
      question.answersCount ? "risposte consigli" : "",
      question.usefulVotes ? "utile utili" : ""
    ]
      .filter(Boolean)
      .join(" ")
  );

  let score = 0;
  const rawHasProblem = rawTokens.some((token) =>
    ["problema", "problemi", "fornitore", "fornitori", "caparra", "ritardo"].some((item) => token.includes(item))
  );
  const rawHasBudget = rawTokens.some((token) =>
    ["budget", "costo", "costi", "prezzo", "prezzi", "spesa", "preventivo"].some((item) => token.includes(item))
  );

  for (const token of tokens) {
    if (title.includes(token)) score += 8;
    if (category.includes(token)) score += 5;
    if (metadata.includes(token)) score += 4;
    if (content.includes(token)) score += 2;
  }

  const categorySlug = question.category?.slug ?? "";
  if (rawHasProblem && categorySlug === "problemi-fornitori") score += 24;
  if (rawHasProblem && question.postType === "Problema") score += 16;
  if (rawHasBudget && (question.postType === "Quanto costa" || question.postType === "Preventivo")) score += 10;
  if (rawHasBudget && categorySlug === "quanto-costa") score += 8;

  const hasMoneyProblem =
    title.includes("caparra") ||
    title.includes("preventivo") ||
    title.includes("budget") ||
    title.includes("costo") ||
    content.includes("caparra") ||
    content.includes("preventivo") ||
    content.includes("budget") ||
    content.includes("troppo alto");

  if (rawHasProblem && rawHasBudget && categorySlug === "problemi-fornitori") score += 18;
  if (rawHasProblem && rawHasBudget && hasMoneyProblem) score += 14;

  return score;
}

export function HomeSmartSearch({ questions }: HomeSmartSearchProps) {
  const [query, setQuery] = useState("");
  const cleanedQuery = query.trim();
  const searchUrl = `/domande?q=${encodeURIComponent(cleanedQuery)}`;

  const matches = useMemo(() => {
    if (cleanedQuery.length < 2) return [];

    return questions
      .map((question) => ({ question, score: scoreQuestion(question, cleanedQuery) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.question.usefulVotes - a.question.usefulVotes)
      .slice(0, 4)
      .map((item) => item.question);
  }, [cleanedQuery, questions]);

  return (
    <div className="mt-8 max-w-3xl rounded-2xl border border-white/40 bg-white/95 p-3 text-ink shadow-soft backdrop-blur">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">
        Cerca tra le domande già aperte
      </p>
      <form action="/domande" className="flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Cerca conversazioni</span>
          <input
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Es. caparra alta, DJ, open bar, location cara..."
            className="focus-ring min-h-12 w-full rounded-xl border border-line bg-cream px-5 py-3 text-sm text-ink placeholder:text-muted"
          />
        </label>
        <button className="focus-ring min-h-12 rounded-xl bg-violet-cta px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
          Cerca
        </button>
      </form>

      {cleanedQuery.length >= 2 ? (
        <div className="mt-3 rounded-xl border border-line bg-white p-2">
          {matches.length ? (
            <div className="grid gap-1">
              {matches.map((question) => (
                <Link
                  key={question.slug}
                  href={`/domande/${question.slug}`}
                  className="focus-ring rounded-xl px-3 py-3 transition hover:bg-petal"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
                    <span className="rounded-lg bg-blush px-2 py-1 text-violet-cta">{postTypePublicLabel(question.postType)}</span>
                    <span>{categoryPublicName(question.category ? { name: question.category.name, slug: question.category.slug } : { name: "Conversazione", slug: null })}</span>
                    {question.city || question.region ? <span>{[question.city, question.region].filter(Boolean).join(", ")}</span> : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-5 text-ink">{displayQuestionTitle(question.title)}</p>
                  <p className="mt-1 text-xs text-muted">
                    {question.answersCount} risposte ? {question.usefulVotes} cuori
                  </p>
                </Link>
              ))}
              <Link href={searchUrl} className="focus-ring rounded-xl px-3 py-2 text-xs font-semibold text-violet-cta">
                Vedi tutti i risultati per "{cleanedQuery}"
              </Link>
            </div>
          ) : (
            <div className="px-3 py-3 text-sm leading-6 text-muted">
              Non ho trovato un caso identico. Puoi cercare comunque tra tutte le domande o scriverne una tua.
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={searchUrl} className="focus-ring rounded-xl bg-petal px-3 py-2 text-xs font-semibold text-ink">
                  Cerca comunque
                </Link>
                <Link href="/fai-domanda" className="focus-ring rounded-xl bg-violet-cta px-3 py-2 text-xs font-semibold text-white">
                  Fai una domanda
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
