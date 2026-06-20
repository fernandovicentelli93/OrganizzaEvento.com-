import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { AnswerCard } from "@/components/AnswerCard";
import { AnswerForm } from "@/components/AnswerForm";
import { QuestionNotifyForm } from "@/components/QuestionNotifyForm";
import { ReportButton } from "@/components/ReportButton";
import { SupplierHelpNudge } from "@/components/SupplierHelpNudge";
import { TagBadge } from "@/components/TagBadge";
import { VoteButtons } from "@/components/VoteButtons";
import { createCaptchaChallenge } from "@/lib/captcha";
import { conversationStatus } from "@/lib/conversation-status";
import { EVENT_PHASES, SITE_NAME, categoryPublicName, postTypePublicLabel } from "@/lib/constants";
import { conversationFollowers, dailyConversationViews } from "@/lib/engagement";
import { compactLocation, displayModeLabel, formatDate, formatEventDate, publicName } from "@/lib/format";
import { accountPublicTag } from "@/lib/account-public";
import { prisma } from "@/lib/prisma";
import { displayQuestionTitle } from "@/lib/question-title-overrides";
import { uniqueSuggestedAnswers } from "@/lib/structured-data";
import { getQuestionVisual } from "@/lib/visuals";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ fornitori?: string; segnalazione?: string; avviso?: string }>;
};

function toMetadataText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").slice(0, 155);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const question = await prisma.question.findUnique({
      where: { slug },
      select: { title: true, content: true, status: true, category: { select: { name: true, slug: true } } }
    });

    if (!question || question.status !== "published") {
      return {
        title: "Domanda non trovata",
        alternates: {
          canonical: `/domande/${slug}`
        }
      };
    }

    const title = displayQuestionTitle(question.title);
    const description = toMetadataText(question.content);

    return {
      title,
      description,
      alternates: {
        canonical: `/domande/${slug}`
      },
      openGraph: {
        title,
        description,
        type: "article",
        url: `/domande/${slug}`,
        siteName: SITE_NAME
      }
    };
  } catch (error) {
    console.error("generateMetadata error on question detail", { slug, error });
    return {
      title: "Conversazione non disponibile",
      description: "Riprova tra qualche minuto.",
      alternates: {
        canonical: `/domande/${slug}`
      }
    };
  }
}

type QuestionPayload = Prisma.QuestionGetPayload<{
  include: {
    category: true;
    account: { select: { role: true; profileTag: true; supplierCategory: true; businessName: true } };
    answers: {
      include: {
        account: { select: { role: true; profileTag: true; supplierCategory: true; businessName: true } };
      };
    };
  };
}>;

type QuestionWithRelations = Omit<QuestionPayload, "category"> & {
  category: Prisma.CategoryGetPayload<Record<string, never>> | null;
};

export default async function QuestionDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = (await searchParams) ?? {};
  const reportStatus = search.segnalazione?.startsWith("errore")
    ? "error"
    : search.segnalazione === "inviata"
      ? "sent"
      : undefined;
  const notifyStatus = search.avviso === "ok" ? "ok" : search.avviso === "errore" ? "error" : undefined;

  let question: QuestionWithRelations | null = null;

  try {
    question = (await prisma.question.findUnique({
      where: { slug },
      include: {
        category: true,
        account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } },
        answers: {
          where: { status: "published" },
          orderBy: [{ isBestAnswer: "desc" }, { usefulVotes: "desc" }, { createdAt: "asc" }],
          include: {
            account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } }
          }
        }
      }
    })) as QuestionWithRelations | null;
  } catch (error) {
    console.error("Unable to load question", { slug, error });
  }

  if (!question) {
    try {
      const fallback = await prisma.question.findUnique({
        where: { slug },
        include: {
          account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } },
          answers: {
            where: { status: "published" },
            orderBy: [{ isBestAnswer: "desc" }, { usefulVotes: "desc" }, { createdAt: "asc" }],
            include: {
              account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } }
            }
          }
        }
      });
      if (fallback) {
        question = {
          ...fallback,
          category: null
        } as QuestionWithRelations;
      }
    } catch (error) {
      console.error("Unable to load fallback question", { slug, error });
    }
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
          <p className="text-lg font-semibold text-ink">Al momento non riusciamo a caricare questa conversazione.</p>
          <p className="mt-3 text-sm text-muted">
            Riprova tra qualche minuto. Nel frattempo puoi continuare a consultare altre conversazioni.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/domande"
              className="focus-ring inline-flex rounded-lg bg-violet-cta px-4 py-2 text-sm font-semibold text-white"
            >
              Torna alle conversazioni
            </Link>
            <Link
              href={`/domande/${encodeURIComponent(slug)}`}
              className="focus-ring inline-flex rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
            >
              Riprova
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (question.status !== "published") {
    const isPending = question.status === "pending";
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-xl border border-line bg-white p-6 shadow-soft">
          <p className="text-lg font-semibold text-ink">
            {isPending ? "Conversazione in revisione" : "Conversazione non disponibile"}
          </p>
          <p className="mt-3 text-sm text-muted">
            {isPending
              ? "La tua domanda e\'stata ricevuta e deve ancora essere approvata dalla community. Arrivera\' presto nella lista pubblica."
              : "Questa conversazione e\'stata rimossa dai contenuti pubblici. Se pensi sia un errore, contatta il team."}
          </p>
          <div className="mt-6">
            <Link
              href="/domande"
              className="focus-ring inline-flex rounded-lg bg-violet-cta px-4 py-2 text-sm font-semibold text-white"
            >
              Torna alle conversazioni
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const location = compactLocation(question.city, question.region);
  const eventDate = formatEventDate(question.eventDate);
  const returnTo = `/domande/${question.slug}`;
  const viewsToday = dailyConversationViews(question.slug);
  const followers = conversationFollowers(question.slug);
  const phaseLabel = EVENT_PHASES.find((phase) => phase.value === question.eventPhase)?.label;
  const bestAnswer = question.answers.find((answer) => answer.isBestAnswer);
  const highlightedAnswer = bestAnswer ?? question.answers[0] ?? null;
  const latestAnswer = question.answers[question.answers.length - 1];
  const visual = getQuestionVisual({ ...question, category: question.category ?? undefined });
  const status = conversationStatus(question.slug, question.answers.length, question.postType);
  const questionPublicTag = accountPublicTag(question.account);
  const questionTitle = displayQuestionTitle(question.title);
  const categoryLabel = categoryPublicName(question.category ?? { name: "Conversazione", slug: null });
  const categorySlug = question.category?.slug ?? "domande";
  const answerCaptcha = createCaptchaChallenge();
  const supplierCaptcha = createCaptchaChallenge();
  const startedAt = Date.now();
  const pageUrl = `${siteUrl}/domande/${question.slug}`;

  type PublishedAnswer = NonNullable<QuestionWithRelations["answers"]>[number];
  const answerStructuredData = (answer: PublishedAnswer) => {
    const answerUrl = `${pageUrl}#risposta-${answer.id}`;
    return {
      "@type": "Answer",
      "@id": answerUrl,
      text: answer.content,
      datePublished: answer.createdAt.toISOString(),
      upvoteCount: answer.usefulVotes,
      url: answerUrl,
      author: {
        "@type": "Person",
        "@id": `${answerUrl}-autore`,
        name: publicName(answer.displayMode, answer.displayName),
        url: answerUrl
      }
    };
  };
  const acceptedStructuredAnswer = bestAnswer ? answerStructuredData(bestAnswer) : undefined;
  const suggestedStructuredAnswers = uniqueSuggestedAnswers(
    question.answers.filter((answer) => !answer.isBestAnswer).map((answer) => answerStructuredData(answer)),
    acceptedStructuredAnswer
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "QAPage",
        "@id": `${pageUrl}#qa`,
        url: pageUrl,
        mainEntity: {
          "@type": "Question",
          "@id": `${pageUrl}#question`,
          name: questionTitle,
          text: question.content,
          datePublished: question.createdAt.toISOString(),
          dateModified: question.updatedAt.toISOString(),
          answerCount: (acceptedStructuredAnswer ? 1 : 0) + suggestedStructuredAnswers.length,
          upvoteCount: question.usefulVotes,
          url: pageUrl,
          author: {
            "@type": "Person",
            "@id": `${pageUrl}#autore-domanda`,
            name: publicName(question.displayMode, question.displayName),
            url: `${pageUrl}#question-author`
          },
          acceptedAnswer: acceptedStructuredAnswer,
          suggestedAnswer: suggestedStructuredAnswers
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Domande",
            item: `${siteUrl}/domande`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: questionTitle,
            item: pageUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl">
        <div className="min-w-0">
          <article className="overflow-hidden rounded-xl border border-line bg-white shadow-soft">
            <div className="relative h-[16rem] bg-petal sm:h-[22rem]">
              <img
                src={visual.src}
                alt={visual.alt}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.08),rgba(47,36,48,0.62))]" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-6">
                <div className="flex flex-wrap gap-2">
                  <TagBadge tone={question.postType === "Quanto costa" ? "green" : "violet"}>
                    {postTypePublicLabel(question.postType)}
                  </TagBadge>
                  <Link href={`/categorie/${categorySlug}`}>
                    <TagBadge>{categoryLabel}</TagBadge>
                  </Link>
                  {phaseLabel ? (
                    <TagBadge tone={question.eventPhase === "problema-urgente" ? "amber" : "gray"}>{phaseLabel}</TagBadge>
                  ) : null}
                  <TagBadge>{displayModeLabel(question.displayMode)}</TagBadge>
                </div>
                <h1 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  {questionTitle}
                </h1>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                  <span id="autore-domanda">
                    Pubblicata da {publicName(question.displayMode, question.displayName)}
                    {questionPublicTag ? (
                      <span className="ml-2 inline-flex rounded-full border border-line bg-cream px-2.5 py-1 text-xs font-semibold text-muted">
                        {questionPublicTag}
                      </span>
                    ) : null}
                  </span>
                  <time dateTime={question.createdAt.toISOString()}>{formatDate(question.createdAt)}</time>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="#risposte"
                    className="focus-ring rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-cta"
                  >
                    {question.answers.length ? `Leggi ${question.answers.length} risposte` : "Vai alle risposte"}
                  </a>
                  <a
                    href="#rispondi"
                    className="focus-ring rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-petal"
                  >
                    Rispondi
                  </a>
                </div>
              </div>

              <p className="mt-4 inline-flex rounded-lg bg-petal px-3 py-2 text-xs font-semibold text-muted">
                Oggi {viewsToday} persone hanno visto questa domanda - {followers} la seguono.
              </p>
              {status ? (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-semibold text-emerald-900">{status.label}</p>
                  <p className="mt-1 text-sm leading-6 text-emerald-800">{status.note}</p>
                </div>
              ) : null}

              {highlightedAnswer ? (
                <section className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                        {highlightedAnswer.isBestAnswer ? "Risposta più utile" : "Una risposta dalla community"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {publicName(highlightedAnswer.displayMode, highlightedAnswer.displayName)}
                      </p>
                    </div>
                    <a
                      href="#risposte"
                      className="focus-ring rounded-lg bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:bg-petal"
                    >
                      Vedi tutte
                    </a>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink">{highlightedAnswer.content}</p>
                </section>
              ) : null}

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-ink">{question.content}</p>

              <section className="mt-5 rounded-xl border border-line bg-cream p-4">
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
                  <span className="rounded-lg bg-white px-3 py-2">
                    {question.postType === "Preventivo"
                      ? "Controllare un preventivo"
                      : question.postType === "Quanto costa"
                        ? "Capire se il prezzo ci sta"
                        : question.postType === "Problema"
                          ? "Risolvere un problema"
                          : "Chiedere un parere"}
                  </span>
                  <span className="rounded-lg bg-white px-3 py-2">
                    {question.answers.length ? `${question.answers.length} risposte pubblicate` : "Nessuna risposta ancora"}
                  </span>
                  <span className="rounded-lg bg-white px-3 py-2">
                    {bestAnswer
                      ? "Risposta più utile selezionata"
                      : latestAnswer
                        ? `Ultima risposta: ${formatDate(latestAnswer.createdAt)}`
                        : "Puoi aiutare per primo"}
                  </span>
                </div>
              </section>

              <dl className="mt-5 grid gap-3 rounded-xl bg-cream p-4 text-sm sm:grid-cols-2">
                {phaseLabel ? (
                  <div>
                    <dt className="font-semibold text-muted">Fase evento</dt>
                    <dd className="mt-1 text-ink">{phaseLabel}</dd>
                  </div>
                ) : null}
                {question.eventType ? (
                  <div>
                    <dt className="font-semibold text-muted">Tipo evento</dt>
                    <dd className="mt-1 text-ink">{question.eventType}</dd>
                  </div>
                ) : null}
                {location ? (
                  <div>
                    <dt className="font-semibold text-muted">Città / regione</dt>
                    <dd className="mt-1 text-ink">{location}</dd>
                  </div>
                ) : null}
                {question.peopleCount ? (
                  <div>
                    <dt className="font-semibold text-muted">Numero persone</dt>
                    <dd className="mt-1 text-ink">{question.peopleCount}</dd>
                  </div>
                ) : null}
                {question.budgetRange ? (
                  <div>
                    <dt className="font-semibold text-muted">Budget indicativo</dt>
                    <dd className="mt-1 text-ink">{question.budgetRange}</dd>
                  </div>
                ) : null}
                {eventDate ? (
                  <div>
                    <dt className="font-semibold text-muted">Data evento</dt>
                    <dd className="mt-1 text-ink">{eventDate}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <VoteButtons
                  targetType="question"
                  targetId={question.id}
                  usefulVotes={question.usefulVotes}
                  notUsefulVotes={question.notUsefulVotes}
                  returnTo={returnTo}
                />
                <div className="sm:w-72">
                  <ReportButton
                    targetType="question"
                    targetId={question.id}
                    returnTo={returnTo}
                    status={reportStatus}
                  />
                </div>
              </div>

              <div className="mt-5">
                <QuestionNotifyForm questionSlug={question.slug} returnTo={returnTo} status={notifyStatus} />
              </div>

              <SupplierHelpNudge
                questionSlug={question.slug}
                questionTitle={questionTitle}
                eventType={question.eventType}
                city={question.city}
                region={question.region}
                peopleCount={question.peopleCount}
                budgetRange={question.budgetRange}
                captcha={supplierCaptcha}
                startedAt={startedAt}
                sent={search.fornitori === "inviata"}
              />
            </div>
          </article>

          <section id="risposte" className="mt-7 scroll-mt-24">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-ink">Risposte</h2>
                <p className="mt-1 text-sm text-muted">{question.answers.length} risposte pubblicate.</p>
              </div>
            </div>

            <div className="space-y-3">
              {question.answers.length ? (
                question.answers.map((answer) => <AnswerCard key={answer.id} answer={answer} returnTo={returnTo} />)
              ) : (
                <div className="rounded-2xl border border-line bg-white p-6 text-sm text-muted">
                  Nessuna risposta ancora. Puoi essere la prima persona ad aiutare davvero.
                </div>
              )}
            </div>
          </section>

          <section id="rispondi" className="mt-8 scroll-mt-24">
            <h2 className="mb-4 text-xl font-bold text-ink">Rispondi alla domanda</h2>
            <AnswerForm questionSlug={question.slug} captcha={answerCaptcha} startedAt={startedAt} />
          </section>
        </div>
      </div>
    </div>
  );
}
