import Link from "next/link";
import type { InternationalEventGuide } from "@/content/international-seo";
import { getInternationalEventGuideCanonicalUrl } from "@/content/international-seo";

type InternationalEventGuidePageProps = {
  page: InternationalEventGuide;
};

const decisionHeadings = [
  "Start with the decision you actually need to make",
  "Use this as a remote-planning brief",
  "Read this before you ask for a quote",
  "Turn a vague idea into supplier questions"
];

const visualThemes = {
  venue: {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3auto=format&fit=crop&w=1800&q=78",
    alt: "Elegant Italian event venue prepared for a celebration",
    label: "Italian venues"
  },
  catering: {
    src: "https://images.unsplash.com/photo-1555244162-803834f70033auto=format&fit=crop&w=1800&q=78",
    alt: "Catering buffet and food service for an Italian event",
    label: "Catering and menu"
  },
  music: {
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819auto=format&fit=crop&w=1800&q=78",
    alt: "Concert lights and music setup for an event",
    label: "Music and entertainment"
  },
  flowers: {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aedauto=format&fit=crop&w=1800&q=78",
    alt: "Wedding floral décorations and ceremony setup in Italy",
    label: "Flowers and styling"
  },
  wedding: {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bcauto=format&fit=crop&w=1800&q=78",
    alt: "Wedding couple and guests at an Italian celebration",
    label: "Destination wedding"
  },
  corporate: {
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678auto=format&fit=crop&w=1800&q=78",
    alt: "Corporate event room prepared for a meeting in Italy",
    label: "Corporate events"
  },
  privateParty: {
    src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ceauto=format&fit=crop&w=1800&q=78",
    alt: "Private party table with drinks and warm event lights",
    label: "Private celebrations"
  },
  planning: {
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85auto=format&fit=crop&w=1800&q=78",
    alt: "Event planning documents and quote notes on a desk",
    label: "Remote planning"
  }
};

function visualTheme(page: InternationalEventGuide) {
  const key = `${page.vertical} ${page.cluster} ${page.primaryKeyword} ${page.h1}`.toLowerCase();
  if (page.vertical.toLowerCase().includes("event venues")) return visualThemes.venue;
  if (page.vertical.toLowerCase().includes("catering")) return visualThemes.catering;
  if (page.vertical.toLowerCase().includes("music")) return visualThemes.music;
  if (page.vertical.toLowerCase().includes("flowers")) return visualThemes.flowers;
  if (key.includes("catering") || key.includes("menu") || key.includes("open bar") || key.includes("food")) return visualThemes.catering;
  if (key.includes("music") || key.includes("dj") || key.includes("band") || key.includes("entertainment")) return visualThemes.music;
  if (key.includes("flower") || key.includes("floral") || key.includes("styling")) return visualThemes.flowers;
  if (key.includes("corporate") || key.includes("retreat") || key.includes("company")) return visualThemes.corporate;
  if (key.includes("birthday") || key.includes("private") || key.includes("party") || key.includes("celebration")) return visualThemes.privateParty;
  if (key.includes("wedding") || key.includes("bride") || key.includes("lake como") || key.includes("tuscany")) return visualThemes.wedding;
  if (key.includes("venue") || key.includes("villa") || key.includes("hotel") || key.includes("location")) return visualThemes.venue;
  return visualThemes.planning;
}

const supplierQuestionSets: Record<string, string[]> = {
  venue: [
    "Which spaces are included, and which areas require an extra fee",
    "Is there a rain backup or indoor alternative already included in the quote",
    "What are the exact access, setup, music and closing times",
    "Are cleaning, security, parking, staff meals or technical costs billed separately"
  ],
  catering: [
    "Does the quote include service staff, setup, equipment, water, coffee and VAT",
    "How are children, suppliers, allergies and late guest changes charged",
    "Is the menu final or only a starting proposal with upgrade costs later",
    "What happens if the venue requires a different kitchen setup or extra logistics"
  ],
  music: [
    "How many performance hours are included, and what costs extra",
    "Who handles sound system, lights, setup time and technical requirements",
    "Are SIAE, travel, overtime and late-night limits clearly separated",
    "Can the supplier adapt the set list to an international guest group"
  ],
  flowers: [
    "Which arrangements are included, and which images are only inspiration",
    "Are delivery, setup, breakdown, candles, vases and structure rental included",
    "What changes if seasonal flowers are not available in Italy",
    "Can pieces be moved between ceremony, dinner and party areas"
  ],
  default: [
    "What exactly is included in the quoted amount, line by line",
    "Which items are optional, variable or charged after confirmation",
    "What deposit, cancellation and balance terms should be written down",
    "Which details depend on the Italian venue, city, date or guest count"
  ]
};

function supplierQuestions(page: InternationalEventGuide) {
  const key = `${page.vertical} ${page.cluster} ${page.primaryKeyword}`.toLowerCase();
  if (key.includes("catering") || key.includes("menu") || key.includes("open bar")) return supplierQuestionSets.catering;
  if (key.includes("music") || key.includes("dj") || key.includes("band")) return supplierQuestionSets.music;
  if (key.includes("flower") || key.includes("floral")) return supplierQuestionSets.flowers;
  if (key.includes("venue") || key.includes("villa") || key.includes("location")) return supplierQuestionSets.venue;
  return supplierQuestionSets.default;
}

function supportPoints(page: InternationalEventGuide) {
  const points = [
    page.userProblem,
    page.uniqueAngle,
    page.nonDuplicableElement,
    page.usefulForForeignUsers
  ].filter(Boolean);

  return points.slice(0, 4);
}

function qualityNotes(page: InternationalEventGuide) {
  const notes = [
    "No supplier names, reviews or exact prices are invented on this page.",
    "If a number must be used, it should be validated before publishing as a fixed benchmark.",
    "The goal is to help you ask clearer questions before you commit from abroad."
  ];

  if (page.dataExamplesNeeded.includes("[TO VALIDATE]")) {
    notes.unshift("Any example range connected to this topic should be treated as [TO VALIDATE].");
  }

  return notes;
}

export function InternationalEventGuidePage({ page }: InternationalEventGuidePageProps) {
  const canonicalUrl = getInternationalEventGuideCanonicalUrl(page);
  const questions = supplierQuestions(page);
  const points = supportPoints(page);
  const heading = decisionHeadings[page.layoutVariant % decisionHeadings.length];
  const visual = visualTheme(page);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    inLanguage: "en",
    mainEntityOfPage: canonicalUrl,
    dateModified: page.lastmod,
    publisher: {
      "@type": "Organization",
      name: "OrganizzaEvento.com",
      url: "https://organizzaevento.com"
    },
    about: [page.primaryKeyword, page.vertical, page.cluster].filter(Boolean)
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://organizzaevento.com/en/" },
      { "@type": "ListItem", position: 2, name: "Event guides", item: "https://organizzaevento.com/en/event-guides" },
      { "@type": "ListItem", position: 3, name: page.h1, item: canonicalUrl }
    ]
  };

  return (
    <main className="bg-cream text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="relative isolate overflow-hidden">
        <img src={visual.src} alt={visual.alt} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.90),rgba(47,36,48,0.64),rgba(47,36,48,0.24))]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-16 text-white sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-100">Italy event planning guide</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">{page.h1}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-rose-50">{page.metaDescription}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[visual.label, page.targetAudience, page.cluster].filter(Boolean).map((tag) => (
                <span key={tag} className="rounded-md border border-white/25 bg-white/12 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-white/25 bg-white/92 p-6 text-ink shadow-lg backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-cta">Quick planning summary</p>
            <p className="mt-4 text-base leading-7 text-muted">
              This page helps {page.targetAudience.toLowerCase()} plan an event in Italy by turning the search intent into practical checks,
              supplier questions and next steps before paying deposits or confirming dates.
            </p>
            <dl className="mt-6 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold text-ink">Primary intent</dt>
                <dd className="mt-1 leading-6 text-muted">{page.searchIntent}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Main problem solved</dt>
                <dd className="mt-1 leading-6 text-muted">{page.userProblem}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="space-y-8">
          <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <img src={visual.src} alt={visual.alt} loading="lazy" decoding="async" className="h-72 w-full object-cover lg:h-full" />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-cta">Practical planning lens</p>
                <h2 className="mt-3 text-2xl font-semibold text-ink">{visual.label} in Italy, planned from abroad</h2>
                <p className="mt-4 leading-8 text-muted">
                  Before you compare suppliers, make sure the visual idea, guest experience and written quote describe the same event. This
                  guide keeps the same practical structure used across OrganizzaEvento, with a stronger international planning angle.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">{heading}</h2>
            <div className="mt-5 space-y-4 text-base leading-8 text-muted">
              <p>
                {page.h1} usually becomes difficult when the first quote arrives and every supplier seems to describe inclusions in a
                different way. Use this guide to slow the decision down, separate what is confirmed from what is only implied, and prepare a
                clearer brief for Italian venues and suppliers.
              </p>
              <p>
                The page is built for people planning from outside Italy. That means it focuses on written confirmations, remote comparison,
                logistics, timing, payment language and details that are easy to miss when you cannot inspect the venue or meet every supplier
                in person.
              </p>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {points.map((point, index) => (
              <div key={`${page.id}-point-${index}`} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-cta">Check {index + 1}</p>
                <p className="mt-3 leading-7 text-muted">{point}</p>
              </div>
            ))}
          </section>

          <section className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">Questions to ask Italian suppliers</h2>
            <p className="mt-3 leading-7 text-muted">
              Send these questions before you treat a proposal as comparable. They are deliberately practical, because a beautiful event in
              Italy depends on small written details as much as on the venue or creative idea.
            </p>
            <ol className="mt-5 grid gap-3">
              {questions.map((question, index) => (
                <li key={question} className="rounded-md border border-line bg-cream px-4 py-3">
                  <span className="font-semibold text-violet-cta">{String(index + 1).padStart(2, "0")}</span>
                  <span className="ml-3 text-muted">{question}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">How to compare options from abroad</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-md bg-petal p-4">
                <h3 className="font-semibold text-ink">Make the brief concrete</h3>
                <p className="mt-2 text-sm leading-6 text-muted">Confirm city or region, date flexibility, guest count, event format and must-have services.</p>
              </div>
              <div className="rounded-md bg-petal p-4">
                <h3 className="font-semibold text-ink">Compare like with like</h3>
                <p className="mt-2 text-sm leading-6 text-muted">Separate included services, possible extras, VAT, travel, deposits and cancellation terms.</p>
              </div>
              <div className="rounded-md bg-petal p-4">
                <h3 className="font-semibold text-ink">Ask for written answers</h3>
                <p className="mt-2 text-sm leading-6 text-muted">A short email summary often prevents misunderstandings later, especially when planning remotely.</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">What this page does not invent</h2>
            <ul className="mt-4 space-y-3 text-muted">
              {qualityNotes(page).map((note) => (
                <li key={note} className="border-l-2 border-violet-cta/40 pl-4 leading-7">
                  {note}
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-cta">Next step</p>
            <h2 className="mt-3 text-xl font-semibold text-ink">Need Italian suppliers</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Use this guide first, then send a clearer request to Vibes Planner for Italian supplier options.</p>
            <a
              href={page.ctaHref}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-violet-cta px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover"
            >
              <img src="/partners/vibes-planner/logo.jpg" alt="Vibes Planner" className="h-6 w-6 rounded object-cover" />
              <span>{page.ctaText}</span>
            </a>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-cta">Useful internal links</p>
            <div className="mt-4 space-y-3">
              {page.internalLinks.map((link) => (
                <Link key={`${link.href}-${link.label}`} href={link.href} className="block rounded-md border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink transition hover:bg-petal">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 text-sm leading-7 text-muted shadow-sm">
            <p className="font-semibold text-ink">Editorial note</p>
            <p className="mt-2">
              This page is part of the OrganizzaEvento international planning archive for users organizing events in Italy from abroad.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
