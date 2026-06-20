import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { QuestionCard } from "@/components/QuestionCard";
import { articleTags } from "@/lib/articles";
import { EDITORIAL_CATEGORIES } from "@/lib/editorial";
import { selfAlternates } from "@/lib/i18n-routing";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Magazine eventi, matrimoni e trend",
  description:
    "Guide e storie utili su matrimoni, feste private, costi, location, fornitori ed eventi aziendali.",
  alternates: selfAlternates("it", { type: "static", key: "magazine" })
};

export const dynamic = "force-dynamic";
const questionCardInclude = {
  category: true,
  account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } }
} as const;

export default async function MagazinePage() {
  const [articles, categoryCounts, communityQuestions] = await Promise.all([
    prisma.editorialArticle.findMany({
      where: { status: "published", publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" }
    }),
    Promise.all(
      EDITORIAL_CATEGORIES.map(async (category) => {
        const count = await prisma.editorialArticle.count({
          where: {
            status: "published",
            publishedAt: { lte: new Date() },
            category: { in: category.articleCategories }
          }
        });
        return [category.slug, count] as const;
      })
    ),
    prisma.question.findMany({
      where: { status: "published" },
      orderBy: [{ usefulVotes: "desc" }, { answersCount: "desc" }, { createdAt: "desc" }],
      take: 3,
      include: questionCardInclude
    })
  ]);

  const [featured, ...rest] = articles;
  const countsByCategory = new Map(categoryCounts);
  const nextTopics = [
    "Matrimoni VIP e privacy",
    "Quanto costa un open bar",
    "Destination wedding in Italia",
    "Team building non cringe"
  ];

  return (
    <div className="bg-[#fffaf6]">
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(252,231,239,0.72),rgba(255,248,243,0.90),rgba(245,232,218,0.62))]" />
        <div className="absolute left-[8%] top-10 h-52 w-52 rounded-full border border-[#C7A27C]/40" aria-hidden="true" />
        <div className="absolute bottom-8 right-[10%] h-28 w-64 rotate-[-8deg] bg-blush/80" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-6xl gap-9 px-4 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-cta">OrganizzaEvento Magazine</p>
            <h1 className="mt-4 text-5xl font-semibold leading-none tracking-tight text-ink sm:text-7xl">
              Idee e guide per non decidere tutto da solo.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
              Qui trovi guide da leggere prima di chiedere un preventivo, scegliere una location o cambiare idea
              all'ultimo. L'obiettivo e arrivare alle decisioni con meno confusione.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#ultimi-articoli"
                className="focus-ring inline-flex justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-cta"
              >
                Leggi gli articoli
              </Link>
              <Link
                href="/domande"
                className="focus-ring inline-flex justify-center rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-petal"
              >
                Leggi le domande
              </Link>
            </div>
          </div>

          {featured ? (
            <Link
              href={`/magazine/${featured.slug}`}
              className="focus-ring group overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft"
            >
              <div className="relative h-[28rem]">
                <img
                  src={featured.heroImage}
                  alt={featured.heroAlt}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.04),rgba(47,36,48,0.72))]" />
                <div className="absolute bottom-0 p-6 text-white sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-100">{featured.kicker}</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{featured.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-rose-50">{featured.excerpt}</p>
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Sottocategorie</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Scegli da dove partire.</h2>
          </div>
          <Link href="/magazine/categorie" className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-violet-cta">
            Vedi tutte
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EDITORIAL_CATEGORIES.slice(0, 4).map((category) => (
            <Link
              key={category.slug}
              href={`/magazine/categorie/${category.slug}`}
              className="focus-ring rounded-[1.25rem] border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-petal"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">{category.eyebrow}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{category.name}</h3>
              <p className="mt-2 text-xs leading-5 text-muted">{countsByCategory.get(category.slug) ?? 0} articoli pubblicati</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-7 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">
              Dopo la lettura
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Se il caso e simile, porta la domanda nel forum.
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted">
            Una guida ti orienta, ma ogni evento ha i suoi vincoli. Città, budget, numero persone e fornitori cambiano
            tutto: per questo sotto trovi domande reali da leggere.
          </p>
        </div>
        <div className="grid gap-5">
          {communityQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </section>

      <section id="ultimi-articoli" className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Ultime uscite</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Nuove guide in uscita.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            Guide brevi, leggibili e con esempi concreti, così arrivi al fornitore con domande più chiare.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <Link
              key={article.id}
              href={`/magazine/${article.slug}`}
              className="focus-ring group overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <img
                src={article.heroImage}
                alt={article.heroAlt}
                loading="lazy"
                decoding="async"
                className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{article.kicker}</p>
                <h3 className="mt-3 text-xl font-semibold leading-tight text-ink">{article.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{article.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {articleTags(article)
                    .slice(0, 3)
                    .map((tag) => (
                      <span key={tag} className="rounded-full bg-petal px-3 py-1 text-xs font-semibold text-muted">
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-[2rem] border border-line bg-ink p-6 text-white shadow-soft sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">Prossimi temi</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Cose che vale la pena chiarire.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {nextTopics.map((topic) => (
              <div key={topic} className="rounded-[1.2rem] border border-white/20 bg-white/10 p-4">
                <p className="text-sm font-semibold">{topic}</p>
                <p className="mt-2 text-xs leading-5 text-rose-100">In arrivo tra le prossime guide.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white/60">
        <FaqSection
          eyebrow="FAQ Magazine"
          title="Come leggere il magazine"
          description="Gli articoli servono a orientarti prima di aprire una domanda o parlare con un fornitore."
          items={[
            {
              question: "Ogni quanto escono nuovi articoli?",
              answer: "La cadenza prevista ? ogni tre giorni, con temi scelti tra ricerche frequenti, costi e trend eventi."
            },
            {
              question: "Perché gli articoli hanno unà parte in breve e FAQ",
              answer: "Per farti capire subito se l'articolo risponde al tuo dubbio oppure se conviene aprire una domanda."
            },
            {
              question: "Posso chiedere alla community partendo da un articolo?",
              answer: "Sì. Ogni articolo può diventare una domanda concreta con città, budget, numero persone e dubbi reali."
            }
          ]}
        />
      </section>
    </div>
  );
}
