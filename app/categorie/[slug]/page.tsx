import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { QuestionCard } from "@/components/QuestionCard";
import { categoryPublicName } from "@/lib/constants";
import { selfAlternates } from "@/lib/i18n-routing";
import { getMagazineArea, uniqueStepCategories } from "@/lib/magazine";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
const questionCardInclude = {
  category: true,
  account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } }
} as const;

function postTypeForStep(categorySlug: string) {
  if (categorySlug === "quanto-costa") return "Quanto costa";
  if (categorySlug === "problemi-fornitori") return "Problema";
  if (categorySlug === "idee-evento") return "Idea";
  return "Domanda";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getMagazineArea(slug);

  if (area) {
    return {
      title: area.name,
      description: area.description,
      alternates: selfAlternates("it", { type: "category", slug: area.slug })
    };
  }

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Categoria non trovata" };

  return {
    title: category.name,
    description: category.description,
    alternates: selfAlternates("it", { type: "category", slug: category.slug })
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getMagazineArea(slug);

  if (area) {
    const stepCategorySlugs = uniqueStepCategories(area);
    const [stepCategories, questions] = await Promise.all([
      prisma.category.findMany({
        where: { slug: { in: stepCategorySlugs } },
        include: { _count: { select: { questions: true } } }
      }),
      prisma.question.findMany({
        where: {
          status: "published",
          OR: [
            { eventType: { in: area.eventTypes } },
            ...(area.slug === "idee-evento" ? [{ postType: "Idea" }, { category: { slug: "idee-evento" } }] : [])
          ]
        },
        orderBy: [{ usefulVotes: "desc" }, { createdAt: "desc" }],
        take: 8,
        include: questionCardInclude
      })
    ]);
    const categoryBySlug = new Map(stepCategories.map((category) => [category.slug, category]));

    return (
      <div>
        <section className="relative isolate overflow-hidden">
          <img
            src={area.image}
            alt={area.name}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.82),rgba(47,36,48,0.42))]" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 text-white">
            <Link href="/categorie" className="focus-ring text-sm font-semibold text-rose-100">
              Catégorie
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">{area.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">{area.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-rose-50">{area.description}</p>
            <Link
              href={{ pathname: "/fai-domanda", query: { tipo: "Domanda" } }}
              className="focus-ring mt-8 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-soft transition hover:bg-petal"
            >
              Apri una conversazione
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Checklist viva</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">10 domande pronte da aprire.</h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Tocca la domanda più simile al tuo problema: puoi leggere conversazioni già aperte o farne una nuova.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {area.steps.map((step, index) => {
              const dbCategory = categoryBySlug.get(step.categorySlug);
              return (
                <article key={`${step.title}-${index}`} className="rounded-[1.45rem] border border-line bg-white/90 p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush text-sm font-semibold text-violet-cta">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold leading-snug text-ink">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/domande?category=${step.categorySlug}`}
                          className="focus-ring rounded-full border border-line bg-cream px-3 py-2 text-xs font-semibold text-ink transition hover:border-violet-cta hover:text-violet-cta"
                        >
                          Leggi domande
                        </Link>
                        <Link
                          href={{
                            pathname: "/fai-domanda",
                            query: { categoria: step.categorySlug, tipo: postTypeForStep(step.categorySlug) }
                          }}
                          className="focus-ring rounded-full bg-violet-cta px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-hover"
                        >
                          Fai questa domanda
                        </Link>
                        {dbCategory?._count.questions ? (
                          <span className="rounded-full bg-petal px-3 py-2 text-xs font-semibold text-muted">
                            {dbCategory._count.questions} domande
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-white/60 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Conversazioni</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Domande utili in {area.name}</h2>
              </div>
              <Link href="/domande" className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-violet-cta">
                Vedi tutte
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {questions.length ? (
                questions.map((question) => <QuestionCard key={question.id} question={question} />)
              ) : (
                <EmptyState
                  title="Nessuna conversazione ancora"
                  description="Apri tu la prima domanda in questa area e rendila utile anche per altre persone."
                />
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      questions: {
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        include: questionCardInclude
      }
    }
  });

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="rounded-[1.8rem] border border-line bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Conversazioni</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{categoryPublicName(category)}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{category.description}</p>
        <Link
          href={{
            pathname: "/fai-domanda",
            query: { categoria: category.slug, tipo: postTypeForStep(category.slug) }
          }}
          className="focus-ring mt-6 inline-flex rounded-full bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-hover"
        >
          Fai una domanda in questa categoria
        </Link>
      </section>

      <section className="mt-8 space-y-4">
        {category.questions.length ? (
          category.questions.map((question) => <QuestionCard key={question.id} question={question} />)
        ) : (
          <EmptyState
            title="Nessuna domanda in questa categoria"
            description="Apri tu la conversazione con un dubbio pratico o un preventivo da confrontare."
          />
        )}
      </section>
    </div>
  );
}
