import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import { getLocalSeoPage, getPublishedLocalSeoPages } from "@/content/local-seo";
import { SITE_NAME } from "@/lib/constants";
import { selfAlternates } from "@/lib/i18n-routing";
import { faqMainEntity } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedLocalSeoPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLocalSeoPage(slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: selfAlternates("it", { type: "localSeo", page }),
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "website",
      url: page.canonical,
      images: [{ url: page.heroImage, alt: page.heroAlt }]
    }
  };
}

export default async function LocalSeoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getLocalSeoPage(slug);
  if (!page) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://organizzaevento.com/" },
      { "@type": "ListItem", position: 2, name: "Fornitori eventi", item: "https://organizzaevento.com/fornitori-eventi" },
      { "@type": "ListItem", position: 3, name: page.title, item: page.canonical }
    ]
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.h1,
    description: page.metaDescription,
    url: page.canonical,
    inLanguage: "it-IT",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: "https://organizzaevento.com"
    },
    about: {
      "@type": "Service",
      name: page.categoryName,
      areaServed: page.city,
      serviceType: page.categoryName
    },
    dateModified: page.lastmod
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${page.canonical}#faq`,
    mainEntity: faqMainEntity(page.faqs, page.canonical)
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [...page.serviceLinks, ...page.nearbyLinks].slice(0, 10).map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.label,
      url: `https://organizzaevento.com/${link.slug}`
    }))
  };

  return (
    <main className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <section className="relative isolate overflow-hidden">
        <img
          src={page.heroImage}
          alt={page.heroAlt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.88),rgba(47,36,48,0.60),rgba(47,36,48,0.20))]" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 text-white sm:py-20">
          <nav aria-label="Percorso" className="flex flex-wrap gap-2 text-xs font-medium text-white/80">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/fornitori-eventi" className="hover:text-white">
              Fornitori eventi
            </Link>
            <span>/</span>
            <span>{page.categoryName}</span>
          </nav>

          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">
              {page.region} - {page.categoryName}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">{page.h1}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-rose-50 sm:text-lg">{page.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <VibesSupplierCta variant="dark" className="px-6 shadow-soft">
                Trova fornitori in zona
              </VibesSupplierCta>
              <Link
                href={`/fai-domanda?titolo=${encodeURIComponent(`Cerco consiglio su ${page.categoryName} a ${page.city}`)}`}
                className="focus-ring inline-flex justify-center rounded-xl border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Chiedi alla community
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Zona", page.city],
            ["Servizio", page.categoryName],
            ["Da chiarire", "Budget, disponibilità e condizioni"],
            ["Come usarla", "Leggi, confronta, poi chiedi"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-cta">{label}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 lg:grid-cols-[0.74fr_1.26fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Quando ti serve</p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted">
              {page.whenUseful.map((item) => (
                <li key={item} className="rounded-xl bg-petal px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Richiesta rapida</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{page.vibesCtaTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{page.vibesCtaText}</p>
            <VibesSupplierCta variant="pink" className="mt-5 w-full">
              Invia richiesta fornitori
            </VibesSupplierCta>
          </div>
        </aside>

        <div>
          <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Guida locale</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Cosa controllare prima di scegliere.</h2>
            <p className="mt-5 text-base leading-8 text-muted">{page.localSection}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {page.evaluationChecklist.map((item) => (
                <div key={item} className="rounded-xl border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Community first</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Casi tipici che vale la pena chiarire.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Sono esempi realistici costruiti per aiutarti a formulare meglio la richiesta. Se il tuo caso ? simile,
              puoi aprire una conversazione con budget, zona e dubbi precisi.
            </p>
            <div className="mt-6 grid gap-4">
              {page.conversations.map((conversation) => (
                <article key={conversation.title} className="rounded-2xl border border-line bg-cream p-4 sm:p-5">
                  <h3 className="text-lg font-semibold text-ink">{conversation.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{conversation.question}</p>
                  <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm leading-7 text-muted">{conversation.answer}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-violet-cta">{conversation.tip}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Altri servizi in zona</h2>
              <div className="mt-4 grid gap-2">
                {page.serviceLinks.map((link) => (
                  <Link key={link.slug} href={`/${link.slug}`} className="focus-ring rounded-xl bg-petal px-4 py-3 text-sm font-semibold text-ink transition hover:bg-cream">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Zone vicine</h2>
              <div className="mt-4 grid gap-2">
                {page.nearbyLinks.length ? (
                  page.nearbyLinks.map((link) => (
                    <Link key={link.slug} href={`/${link.slug}`} className="focus-ring rounded-xl bg-petal px-4 py-3 text-sm font-semibold text-ink transition hover:bg-cream">
                      {link.label}
                    </Link>
                  ))
                ) : (
                  <Link href="/fornitori-eventi" className="focus-ring rounded-xl bg-petal px-4 py-3 text-sm font-semibold text-ink transition hover:bg-cream">
                    Vedi tutte le zone disponibili
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Domande frequenti prima di inviare richieste.</h2>
            <div className="mt-6 grid gap-3">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-xl border border-line bg-cream p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-ink">
                    <span>{faq.question}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-violet-cta transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
