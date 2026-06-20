import Link from "next/link";
import type { AccountRole, DisplayMode } from "@prisma/client";
import { EVENT_PHASES, categoryPublicName, postTypePublicLabel } from "@/lib/constants";
import { conversationStatus } from "@/lib/conversation-status";
import { conversationFollowers, dailyConversationViews } from "@/lib/engagement";
import { compactLocation, displayModeLabel, excerpt, formatDate, publicName } from "@/lib/format";
import { accountPublicTag } from "@/lib/account-public";
import { displayQuestionTitle } from "@/lib/question-title-overrides";
import { getQuestionVisual } from "@/lib/visuals";
import { TagBadge } from "@/components/TagBadge";

type QuestionCardProps = {
  question: {
    title: string;
    slug: string;
    content?: string;
    postType: string;
    eventPhase?: string | null;
    eventType?: string | null;
    city?: string | null;
    region?: string | null;
    usefulVotes: number;
    notUsefulVotes: number;
    answersCount: number;
    createdAt: Date;
    displayMode: DisplayMode;
    displayName?: string | null;
    account?: {
      role?: AccountRole | null;
      profileTag?: string | null;
      supplierCategory?: string | null;
      businessName?: string | null;
    } | null;
    category?: {
      name: string;
      slug: string;
    } | null;
  };
};

export function QuestionCard({ question }: QuestionCardProps) {
  const title = displayQuestionTitle(question.title);
  const location = compactLocation(question.city, question.region);
  const viewsToday = dailyConversationViews(question.slug);
  const followers = conversationFollowers(question.slug);
  const phaseLabel = EVENT_PHASES.find((phase) => phase.value === question.eventPhase)?.label;
  const visual = getQuestionVisual({ ...question, category: question.category ?? undefined });
  const answersLabel = question.answersCount === 1 ? "risposta" : "risposte";
  const status = conversationStatus(question.slug, question.answersCount, question.postType);
  const publicTag = accountPublicTag(question.account);
  const categoryLabel = categoryPublicName({
    name: question.category?.name ?? "Conversazione",
    slug: question.category?.slug ?? null
  });
  const categorySlug = question.category?.slug ?? "domande";

  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="grid gap-0 md:grid-cols-[18rem_1fr]">
        <Link
          href={`/domande/${question.slug}`}
          className="focus-ring relative block min-h-[15rem] overflow-hidden bg-petal md:min-h-full"
        >
          <img
            src={visual.src}
            alt={visual.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.04),rgba(47,36,48,0.42))]" />
          <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/70 bg-white/95 px-3 py-2 text-xs font-semibold leading-5 text-ink shadow-sm backdrop-blur">
            Oggi {viewsToday} persone hanno visto questa conversazione
          </div>
        </Link>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex flex-wrap gap-2" aria-label="Dettagli conversazione">
            <TagBadge tone={question.postType === "Quanto costa" ? "green" : "violet"}>
              {postTypePublicLabel(question.postType)}
            </TagBadge>
            <Link href={`/categorie/${categorySlug}`}>
              <TagBadge>{categoryLabel}</TagBadge>
            </Link>
            {phaseLabel ? <TagBadge tone={question.eventPhase === "problema-urgente" ? "amber" : "gray"}>{phaseLabel}</TagBadge> : null}
            <TagBadge>{displayModeLabel(question.displayMode)}</TagBadge>
          </div>

          <Link href={`/domande/${question.slug}`} className="focus-ring mt-3 block rounded-md">
            <h2 className="text-xl font-semibold leading-snug text-ink transition group-hover:text-violet-cta sm:text-2xl">
              {title}
            </h2>
          </Link>

          <p className="mt-2 text-xs font-semibold text-muted">
            Aperta da <span className="text-ink">{publicName(question.displayMode, question.displayName)}</span>
            {publicTag ? (
              <span className="ml-2 inline-flex rounded-full border border-line bg-cream px-2.5 py-1 text-[0.68rem] font-semibold text-muted">
                {publicTag}
              </span>
            ) : null}
          </p>

          {status ? (
            <p className="mt-3 inline-flex rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
              {status.label}
            </p>
          ) : null}

          {question.content ? <p className="mt-3 text-sm leading-6 text-muted">{excerpt(question.content)}</p> : null}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted">
            {question.eventType ? <span>{question.eventType}</span> : null}
            {location ? <span>{location}</span> : null}
            <span>
              {question.answersCount} {answersLabel}
            </span>
            <span>{question.usefulVotes} cuori</span>
            <span>{question.notUsefulVotes} non utili</span>
            <span>{followers} persone seguono</span>
            <time dateTime={question.createdAt.toISOString()}>{formatDate(question.createdAt)}</time>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="rounded-xl bg-petal px-3 py-2 text-xs font-semibold leading-5 text-muted">
              {question.answersCount >= 2
                ? "Discussione attiva: entra e aggiungi il tuo punto di vista."
                : "Puoi essere tra le prime persone ad aiutare davvero."}
            </p>
            <Link
              href={`/domande/${question.slug}`}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-cta"
            >
              Apri conversazione
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
