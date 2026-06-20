import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagBadge } from "@/components/TagBadge";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import { getLandingPage, getPublishedLandingPages } from "@/content/landing-pages";
import { SITE_NAME } from "@/lib/constants";
import { selfAlternates } from "@/lib/i18n-routing";
import { faqMainEntity } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedLandingPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: selfAlternates("it", { type: "guide", page }),
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "article",
      images: [{ url: page.heroImage, alt: page.heroAlt }]
    }
  };
}

export default async function EventGuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    image: page.heroImage,
    dateModified: page.updatedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME
    },
    mainEntityOfPage: `/guide-eventi/${page.slug}`
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://organizzaevento.com/guide-eventi/${page.slug}#faq`,
    mainEntity: faqMainEntity(page.faqs, `https://organizzaevento.com/guide-eventi/${page.slug}`)
  };

  return (
    <article className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="relative isolate min-h-[68vh] overflow-hidden">
        <img
          src={page.heroImage}
          alt={page.heroAlt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.86),rgba(47,36,48,0.54),rgba(47,36,48,0.16))]" />
        <div className="relative mx-auto flex min-h-[68vh] max-w-6xl flex-col justify-center px-4 py-16 text-white">
          <div className="flex flex-wrap gap-2">
            <TagBadge tone="violet">{page.eyebrow}</TagBadge>
            <span className="rounded-lg border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white">
              {page.city}, {page.region}
            </span>
            <span className="rounded-lg border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white">
              {page.readingMinutes} min
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">{page.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-rose-50 sm:text-lg">{page.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/fai-domanda?categoria=matrimoni"
              className="focus-ring inline-flex justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-ink shadow-soft transition hover:bg-petal"
            >
              Chiedi un parere
            </Link>
            <VibesSupplierCta variant="dark" className="px-6 text-base shadow-none">
              Trova fornitori
            </VibesSupplierCta>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {page.quickFacts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-cta">{fact.label}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-ink">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Da tenere a mente</p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted">
              {page.checklist.slice(0, 5).map((item) => (
                <li key={item} className="rounded-xl bg-petal px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Apri una conversazione</p>
            <div className="mt-4 grid gap-3">
              {page.communityPrompts.map((prompt) => (
                <Link
                  key={prompt}
                  href={`/fai-domanda?titolo=${encodeURIComponent(prompt)}`}
                  className="focus-ring rounded-xl border border-line bg-cream px-4 py-3 text-sm font-semibold leading-6 text-ink transition hover:bg-petal"
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Guida</p>
            <div className="mt-6 grid gap-9">
              {page.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-semibold leading-tight tracking-tight text-ink">{section.title}</h2>
                  <p className="mt-4 text-base leading-8 text-muted">{section.body}</p>
                  {section.bullets ? (
                    <ul className="mt-4 grid gap-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="rounded-xl bg-cream px-4 py-3 text-sm leading-6 text-muted">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </div>

          <section className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Checklist prima di firmare</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
                {page.checklist.map((item) => (
                  <li key={item} className="border-b border-line pb-3 last:border-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Errori da evitare</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
                {page.mistakes.map((item) => (
                  <li key={item} className="border-b border-line pb-3 last:border-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Domande veloci prima di decidere</h2>
            <div className="mt-6 grid gap-3">
              {page.faqs.map((item) => (
                <details key={item.question} className="group rounded-xl border border-line bg-cream p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-ink">
                    <span>{item.question}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-violet-cta transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-line bg-petal p-5 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Prossimo passo</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Porta il tuo caso dentro la community.</h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Una guida ti aiuta a non partire da zero. Una conversazione ti aiuta a capire cosa fare nel tuo caso, con
              budget, città, numero invitati e preventivi reali davanti.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {page.relatedLinks.map((link) =>
                link.href === "/trova-fornitori" ? (
                  <VibesSupplierCta
                    key={`${link.href}-${link.label}`}
                    className="min-h-0 items-start justify-start rounded-xl bg-white p-4 text-left shadow-none hover:bg-cream"
                    logoClassName="h-7 w-7"
                  >
                    <span className="block font-semibold text-ink">{link.label}</span>
                    <span className="mt-1 block text-sm font-normal leading-6 text-muted">{link.description}</span>
                  </VibesSupplierCta>
                ) : (
                  <Link key={link.href} href={link.href} className="focus-ring rounded-xl bg-white p-4 transition hover:bg-cream">
                    <span className="block font-semibold text-ink">{link.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{link.description}</span>
                  </Link>
                )
              )}
            </div>
          </section>
        </div>
      </section>
    </article>
  );
}
