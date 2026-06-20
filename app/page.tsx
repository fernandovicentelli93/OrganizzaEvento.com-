import type { Metadata } from "next";
import Link from "next/link";
import { ConversationEntryGrid } from "@/components/ConversationEntryGrid";
import { EventAreaCards } from "@/components/EventAreaCards";
import { FaqSection } from "@/components/FaqSection";
import { QuestionCard } from "@/components/QuestionCard";
import { VibesSupplierSearch } from "@/components/VibesSupplierSearch";
import { getPublishedLandingPages } from "@/content/landing-pages";
import { getFeaturedLocalSeoPages } from "@/content/local-seo";
import { articleTags } from "@/lib/articles";
import { SITE_NAME, categoryPublicName } from "@/lib/constants";
import { selfAlternates } from "@/lib/i18n-routing";
import { HERO_IMAGE, HOME_STORY_IMAGES } from "@/lib/magazine";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";
const questionCardInclude = {
  category: true,
  account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } }
} as const;

export const metadata: Metadata = {
  title: "Organizza eventi senza impazzire",
  description:
    "Community italiana senza registrazione obbligatoria per leggere conversazioni, fare domande e confrontare costi reali su eventi, matrimoni, feste private e eventi aziendali.",
  alternates: selfAlternates("it", { type: "home" })
};

export default async function HomePage() {
  const [
    latestQuestions,
    usefulQuestions,
    costQuestions,
    editorialArticles
  ] = await Promise.all([
    prisma.question.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: questionCardInclude
    }).catch(() => []),
    prisma.question.findMany({
      where: { status: "published" },
      orderBy: [{ usefulVotes: "desc" }, { answersCount: "desc" }, { createdAt: "desc" }],
      take: 8,
      include: questionCardInclude
    }).catch(() => []),
    prisma.question.findMany({
      where: {
        status: "published",
        OR: [{ postType: "Quanto costa" }, { postType: "Preventivo" }, { category: { slug: "quanto-costa" } }]
      },
      orderBy: [{ usefulVotes: "desc" }, { answersCount: "desc" }, { createdAt: "desc" }],
      take: 4,
      include: questionCardInclude
    }).catch(() => []),
    prisma.editorialArticle.findMany({
      where: { status: "published", publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
      take: 4
    }).catch(() => [])
  ]);

  const heroQuestions = latestQuestions.slice(0, 3);
  const guidePreviewPages = getPublishedLandingPages().filter((page) => page.guideType === "regional").slice(0, 2);
  const localSupplierPreviewPages = getFeaturedLocalSeoPages().slice(0, 3);
  const highlightedQuestion =
    usefulQuestions.find((question) => question.postType === "Preventivo" || question.category?.slug === "quanto-costa") ??
    usefulQuestions[0];
  const [leadArticle, ...secondaryArticles] = editorialArticles;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: siteUrl,
        inLanguage: "it-IT",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/domande?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: siteUrl,
        logo: `${siteUrl}/brand/social-badge.png`
      }
    ]
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative isolate min-h-[76vh] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Allestimento floreale elegante per un evento"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.84),rgba(47,36,48,0.50),rgba(47,36,48,0.18))]" />
        <div className="relative mx-auto flex min-h-[76vh] max-w-6xl flex-col justify-center px-4 py-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">Domande vere, risposte utili</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
            Organizza eventi senza impazzire.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-rose-50 sm:text-lg">
            Hai un preventivo che non ti convince, una location da scegliere o mille dubbi pratici? Racconta il tuo
            caso e confrontati con persone che stanno organizzando qualcosa di simile.
          </p>
          <p className="mt-4 inline-flex max-w-fit rounded-xl border border-white/40 bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            Nessuna registrazione obbligatoria: leggi, cerca e fai una domanda quando vuoi.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/analizza-preventivo"
              className="focus-ring inline-flex min-h-12 justify-center rounded-xl bg-violet-cta px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-violet-hover"
            >
              Analizza preventivo
            </Link>
            <VibesSupplierSearch variant="dark" className="text-base shadow-soft">
              Trova fornitori
            </VibesSupplierSearch>
          </div>

          <div className="mt-7 max-w-4xl rounded-2xl border border-white/40 bg-white/95 p-3 text-ink shadow-soft backdrop-blur">
            <div className="flex flex-col gap-2 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">Domande aperte ora</p>
                <p className="mt-1 text-sm text-muted">Guarda se qualcuno ha già il tuo stesso problema.</p>
              </div>
              <Link href="/domande" className="focus-ring rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
                Vedi tutte
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {heroQuestions.map((question) => (
                <Link
                  key={question.id}
                  href={`/domande/${question.slug}`}
                  className="focus-ring rounded-xl bg-cream px-4 py-3 transition hover:bg-petal"
                >
                  <span className="block text-xs font-semibold text-violet-cta">{question.answersCount} risposte</span>
                  <span className="mt-1 line-clamp-2 block text-sm font-semibold leading-5 text-ink">{question.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-7 px-4 py-14 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Si sta parlando di</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Problemi concreti, non teoria.</h2>
            </div>
            <Link href="/domande" className="focus-ring rounded-xl px-3 py-2 text-sm font-semibold text-violet-cta">
              Vedi tutte
            </Link>
          </div>
          <div className="grid gap-5">
            {latestQuestions.slice(0, 3).map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
          <div className="mt-5 flex justify-center sm:justify-start">
            <Link
              href="/domande"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-cta bg-white px-5 py-3 text-sm font-semibold text-violet-cta shadow-sm transition hover:bg-petal"
            >
              Vedi più articoli
            </Link>
          </div>
          <div className="mt-10">
            <ConversationEntryGrid compact />
          </div>
        </div>

        <aside className="space-y-5">
          {highlightedQuestion ? (
            <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <img
                src={HOME_STORY_IMAGES[0].src}
                alt="Persone che pianificano un evento intorno a un tavolo"
                loading="lazy"
                decoding="async"
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">In evidenza</p>
                <Link href={`/domande/${highlightedQuestion.slug}`} className="focus-ring mt-2 block rounded-md">
                  <h2 className="text-xl font-semibold leading-snug text-ink">{highlightedQuestion.title}</h2>
                </Link>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {highlightedQuestion.usefulVotes} cuori e {highlightedQuestion.answersCount} risposte da persone
                  che hanno già affrontato un caso simile.
                </p>
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-line bg-white/90 p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">Quanto costa</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Cifre, preventivi e dettagli da controllare prima di dire sì.
            </p>
            <div className="mt-4 space-y-3">
              {costQuestions.slice(0, 3).map((question) => (
                <Link key={question.id} href={`/domande/${question.slug}`} className="focus-ring block rounded-xl bg-petal p-4">
                  <span className="text-sm font-semibold leading-6 text-ink">{question.title}</span>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <EventAreaCards />
      </section>

      <section className="border-y border-line bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Magazine</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Guide da leggere quando vuoi farti un'idea.
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Spunti su budget, location, feste private, matrimoni ed eventi aziendali. Poi, se vuoi, porti il tuo
                caso nel forum.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Link href="/magazine" className="focus-ring rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
                Vai al magazine
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            {leadArticle ? (
              <Link
                href={`/magazine/${leadArticle.slug}`}
                className="focus-ring group overflow-hidden rounded-2xl border border-line bg-white shadow-soft"
              >
                <img
                  src={leadArticle.heroImage}
                  alt={leadArticle.heroAlt}
                  loading="lazy"
                  decoding="async"
                  className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{leadArticle.kicker}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-ink">{leadArticle.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{leadArticle.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {articleTags(leadArticle)
                      .slice(0, 3)
                      .map((tag) => (
                        <span key={tag} className="rounded-lg bg-petal px-3 py-1 text-xs font-semibold text-muted">
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="grid gap-3">
              {secondaryArticles.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  href={`/magazine/${article.slug}`}
                  className="focus-ring grid gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm transition hover:bg-petal sm:grid-cols-[7rem_1fr]"
                >
                  <img
                    src={article.heroImage}
                    alt={article.heroAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-28 w-full rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-cta">{article.kicker}</p>
                    <h3 className="mt-2 text-base font-semibold leading-snug text-ink">{article.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">
                      {categoryPublicName({ name: article.category, slug: null })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Guide regionali</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Due guide da leggere prima di scegliere.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                Contenuti locali pensati per 2026/2027: eventi, stagioni, budget e fornitori da controllare prima di bloccare una data.
              </p>
            </div>
            <Link href="/guide-eventi" className="focus-ring rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
              Cerca tra le guide
            </Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {guidePreviewPages.map((page) => (
              <Link
                key={page.slug}
                href={`/guide-eventi/${page.slug}`}
                className="focus-ring group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="relative h-64">
                  <img
                    src={page.heroImage}
                    alt={page.heroAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.04),rgba(47,36,48,0.76))]" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{page.eyebrow}</p>
                    <h3 className="mt-2 text-2xl font-semibold leading-tight">{page.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="line-clamp-3 text-sm leading-7 text-muted">{page.intro}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted">
                    <span className="rounded-lg bg-petal px-2.5 py-1">{page.region}</span>
                    <span className="rounded-lg bg-petal px-2.5 py-1">{page.eventType}</span>
                    <span className="rounded-lg bg-petal px-2.5 py-1">{page.yearFocus ?? "2026/2027"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Fornitori in zona</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                Prima scegli cosa ti serve, poi fai la richiesta.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                Guide rapide per capire cosa chiedere a location, catering, musica e servizi locali prima di inviare un preventivo.
              </p>
            </div>
            <Link href="/fornitori-eventi" className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white shadow-sm">
              Vedi fornitori locali
            </Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {localSupplierPreviewPages.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="focus-ring group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="relative h-56">
                  <img
                    src={page.heroImage}
                    alt={page.heroAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.08),rgba(47,36,48,0.72))]" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{page.region}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">{page.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="line-clamp-3 text-sm leading-7 text-muted">{page.metaDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
    </div>
  );
}
