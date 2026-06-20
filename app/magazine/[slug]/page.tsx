import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestionCard } from "@/components/QuestionCard";
import { articleFaqs, articleSections, articleTags, articleTakeaways } from "@/lib/articles";
import { findEditorialCategoryByName } from "@/lib/editorial";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { faqMainEntity } from "@/lib/structured-data";

export const dynamic = "force-dynamic";
const questionCardInclude = {
  category: true,
  account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } }
} as const;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.editorialArticle.findUnique({ where: { slug } });

  if (!article || article.status !== "published") return { title: "Articolo non trovato" };

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `/magazine/${article.slug}`
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.authorName],
      images: [
        {
          url: article.heroImage,
          width: 1600,
          height: 1067,
          alt: article.heroAlt
        }
      ]
    }
  };
}

export default async function MagazineArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await prisma.editorialArticle.findUnique({ where: { slug } });

  if (!article || article.status !== "published") notFound();

  const relatedQuestions = await prisma.question.findMany({
    where: { status: "published" },
    orderBy: [{ usefulVotes: "desc" }, { answersCount: "desc" }, { createdAt: "desc" }],
    take: 2,
    include: questionCardInclude
  });

  const tags = articleTags(article);
  const takeaways = articleTakeaways(article);
  const sections = articleSections(article);
  const faqs = articleFaqs(article);
  const editorialCategory = findEditorialCategoryByName(article.category);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription,
        image: article.heroImage,
        author: {
          "@type": "Organization",
          name: article.authorName
        },
        publisher: {
          "@type": "Organization",
          name: "OrganizzaEvento.com"
        },
        datePublished: article.publishedAt.toISOString(),
        dateModified: article.updatedAt.toISOString(),
        mainEntityOfPage: `/magazine/${article.slug}`,
        articleSection: article.category,
        keywords: tags
      },
      {
        "@type": "FAQPage",
        "@id": `https://organizzaevento.com/magazine/${article.slug}#faq`,
        mainEntity: faqMainEntity(faqs, `https://organizzaevento.com/magazine/${article.slug}`)
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Magazine",
            item: "/magazine"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: article.title,
            item: `/magazine/${article.slug}`
          }
        ]
      }
    ]
  };

  return (
    <article className="bg-[#fffaf6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-line bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <Link href="/magazine" className="focus-ring text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">
              Magazine
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-muted">{article.kicker}</p>
            {editorialCategory ? (
              <Link
                href={`/magazine/categorie/${editorialCategory.slug}`}
                className="focus-ring mt-3 inline-flex rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-violet-cta"
              >
                {editorialCategory.name}
              </Link>
            ) : null}
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl xl:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-muted">{article.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-muted">
              <span>{article.authorName}</span>
              <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>
              <span>{article.readingMinutes} min lettura</span>
            </div>
          </div>
          <img
            src={article.heroImage}
            alt={article.heroAlt}
            fetchPriority="high"
            decoding="async"
            className="h-[24rem] w-full rounded-[2rem] object-cover shadow-soft lg:h-[34rem]"
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.76fr_1.24fr]">
        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">In breve</p>
            <p className="mt-3 text-sm leading-7 text-muted">{article.aiSummary}</p>
          </section>
          <section className="rounded-[1.5rem] border border-line bg-ink p-5 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">Cosa sapere subito</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-rose-50">
              {takeaways.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Tag</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-petal px-3 py-1 text-xs font-semibold text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </aside>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="rounded-[1.6rem] border border-line bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">{section.heading}</h2>
              <div className="mt-5 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-[1.6rem] border border-line bg-cream p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">FAQ</h2>
            <div className="mt-5 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-[1.1rem] border border-line bg-white p-4">
                  <h3 className="font-semibold text-ink">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-line bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Community</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Conversazioni da leggere dopo questo articolo</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Usa l'articolo per orientarti, poi guarda come altre persone hanno raccontato budget, problemi e scelte.
            </p>
            <div className="mt-5 grid gap-4">
              {relatedQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-line bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Hai un caso simile?</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Se ti riconosci in questo tema, racconta città, numero persone, budget e dubbio principale.
            </p>
            <Link
              href="/fai-domanda"
              className="focus-ring mt-5 inline-flex rounded-full bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-hover"
            >
              Fai una domanda
            </Link>
          </section>
        </div>
      </div>
    </article>
  );
}
