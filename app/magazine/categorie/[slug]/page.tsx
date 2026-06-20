import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/FaqSection";
import { articleTags } from "@/lib/articles";
import { EDITORIAL_CATEGORIES, getEditorialCategory } from "@/lib/editorial";
import { selfAlternates } from "@/lib/i18n-routing";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return EDITORIAL_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getEditorialCategory(slug);

  if (!category) return { title: "Sottocategoria non trovata" };

  return {
    title: `${category.name} | Magazine OrganizzaEvento.com`,
    description: category.description,
    alternates: selfAlternates("it", { type: "magazineCategory", slug: category.slug })
  };
}

export default async function MagazineCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getEditorialCategory(slug);

  if (!category) notFound();

  const articles = await prisma.editorialArticle.findMany({
    where: {
      status: "published",
      publishedAt: { lte: new Date() },
      category: { in: category.articleCategories }
    },
    orderBy: { publishedAt: "desc" }
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} | Magazine OrganizzaEvento.com`,
    description: category.description,
    url: `/magazine/categorie/${category.slug}`,
    hasPart: articles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      url: `/magazine/${article.slug}`,
      description: article.metaDescription
    }))
  };

  return (
    <div className="bg-[#fffaf6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative isolate overflow-hidden border-b border-line">
        <img
          src={category.image}
          alt={category.name}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.82),rgba(47,36,48,0.42),rgba(47,36,48,0.18))]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-white">
          <Link href="/magazine/categorie" className="focus-ring text-sm font-semibold text-rose-100">
            Sottocategorie magazine
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">{category.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">{category.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-rose-50">{category.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Articoli</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Guide e approfondimenti.</h2>
          </div>
          <Link href="/fai-domanda" className="focus-ring rounded-full bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white">
            Trasforma in domanda
          </Link>
        </div>

        {articles.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
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
                  className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
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
        ) : (
          <div className="rounded-[1.5rem] border border-line bg-white p-6 text-sm leading-6 text-muted shadow-sm">
            Gli articoli di questa sottocategoria sono in preparazione.
          </div>
        )}
      </section>

      <FaqSection
        eyebrow="FAQ editoriali"
        title={`Domande su ${category.name.toLowerCase()}`}
        description="Risposte rapide per capire cosa leggere e quando aprire una conversazione sul forum."
        items={category.faq}
      />
    </div>
  );
}
