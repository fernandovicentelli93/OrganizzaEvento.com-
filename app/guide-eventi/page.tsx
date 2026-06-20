import type { Metadata } from "next";
import Link from "next/link";
import { GuideSearchExplorer } from "@/components/GuideSearchExplorer";
import { getLandingPagesByRegion, getPublishedLandingPages } from "@/content/landing-pages";
import { selfAlternates } from "@/lib/i18n-routing";

export const metadata: Metadata = {
  title: "Guide pratiche per organizzare eventi",
  description:
    "Guide pratiche su matrimoni, feste private, eventi aziendali, location, budget e fornitori. Pagine chiare, leggibili e pensate per chi deve decidere davvero.",
  alternates: selfAlternates("it", { type: "guideList" })
};

export default function EventGuidesPage() {
  const pages = getPublishedLandingPages();
  const regionalPages = pages.filter((page) => page.guideType === "regional");
  const featuredPages = [...regionalPages.slice(0, 8), ...pages.filter((page) => page.guideType !== "regional").slice(0, 4)];
  const regionGroups = getLandingPagesByRegion();
  const searchPages = pages.map((page) => ({
    slug: page.slug,
    title: page.title,
    intro: page.intro,
    metaDescription: page.metaDescription,
    heroImage: page.heroImage,
    heroAlt: page.heroAlt,
    eyebrow: page.eyebrow,
    eventType: page.eventType,
    city: page.city,
    region: page.region,
    guideType: page.guideType,
    regionSlug: page.regionSlug,
    coordinates: page.coordinates,
    yearFocus: page.yearFocus,
    searchTags: page.searchTags,
    readingMinutes: page.readingMinutes
  }));

  return (
    <div className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Guide pratiche</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Guide locali per decidere senza girare a vuoto.
            </h1>
            <p className="mt-5 text-base leading-8 text-muted">
              Abbiamo preparato guide per città, tipo evento e problema concreto: costi, location, catering, musica,
              foto, open bar, preventivi e fornitori. Ogni pagina porta verso una conversazione o una richiesta privata.
            </p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-line bg-white text-center shadow-sm">
            <div className="border-r border-line p-4">
              <strong className="block text-3xl text-ink">{pages.length}</strong>
              <span className="mt-1 block text-xs text-muted">guide pubblicate</span>
            </div>
            <div className="border-r border-line p-4">
              <strong className="block text-3xl text-ink">{regionGroups.length}</strong>
              <span className="mt-1 block text-xs text-muted">regioni</span>
            </div>
            <div className="p-4">
              <strong className="block text-3xl text-ink">{regionalPages.length}</strong>
              <span className="mt-1 block text-xs text-muted">guide regionali 2026/2027</span>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">In evidenza</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Parti dalle ricerche più pratiche.</h2>
            </div>
            <Link href="/fai-domanda" className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white">
              Fai una domanda
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredPages.map((page) => (
              <Link
                key={page.slug}
                href={`/guide-eventi/${page.slug}`}
                className="focus-ring group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="relative h-56">
                  <img
                    src={page.heroImage}
                    alt={page.heroAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.06),rgba(47,36,48,0.70))]" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{page.eyebrow}</p>
                    <h3 className="mt-2 line-clamp-2 text-xl font-semibold leading-tight">{page.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="line-clamp-3 text-sm leading-7 text-muted">{page.intro}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted">
                    <span className="rounded-lg bg-petal px-2.5 py-1">{page.city}</span>
                    <span className="rounded-lg bg-petal px-2.5 py-1">{page.eventType}</span>
                    <span className="rounded-lg bg-petal px-2.5 py-1">{page.readingMinutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <GuideSearchExplorer pages={searchPages} />

        <section className="mt-14 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Archivio guide</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Tutte le guide, ordinate per regione.</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Le pagine sono molte: apri la regione che ti interessa e scegli il caso più vicino al tuo.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {regionGroups.map((group, index) => (
              <details key={group.region} open={index < 3} className="group rounded-xl border border-line bg-cream p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span>
                    <span className="block font-semibold text-ink">{group.region}</span>
                    <span className="mt-1 block text-xs text-muted">{group.pages.length} guide disponibili</span>
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-violet-cta transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {group.pages.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/guide-eventi/${page.slug}`}
                      className="focus-ring grid overflow-hidden rounded-xl bg-white text-sm transition hover:bg-petal sm:grid-cols-[4.75rem_1fr]"
                    >
                      <span className="relative min-h-20 bg-petal">
                        <img
                          src={page.heroImage}
                          alt={page.heroAlt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </span>
                      <span className="block p-3">
                        <span className="block font-semibold leading-5 text-ink">{page.title}</span>
                        <span className="mt-1 block text-xs text-muted">
                          {page.city} - {page.eventType}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
