import type { Metadata } from "next";
import Link from "next/link";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import { getFeaturedLocalSeoPages, getLocalSeoPagesByRegion, localSeoCategories } from "@/content/local-seo";
import { localizedPath, selfAlternates } from "@/lib/i18n-routing";
import { faqMainEntity } from "@/lib/structured-data";

const methodSteps = [
  {
    title: "Scegli la zona",
    text: "Parti dalla città o dalla regione: tempi, spostamenti e disponibilità cambiano molto."
  },
  {
    title: "Scegli il servizio",
    text: "Location, catering, musica, foto o allestimenti: ogni guida ti porta alle domande giuste."
  },
  {
    title: "Controlla il preventivo",
    text: "Prima di confermare, verifica extra, caparre, orari, personale e cosa resta escluso."
  },
  {
    title: "Chiedi un confronto",
    text: "Se hai dubbi, apri una conversazione o richiedi fornitori con una richiesta più precisa."
  }
];

const localSupplierFaqs = [
  {
    question: "Queste pagine sono schede fornitore",
    answer:
      "No. Sono guide locali pensate per capire cosa chiedere prima di contattare o confrontare fornitori eventi."
  },
  {
    question: "Posso chiedere fornitori da questa sezione",
    answer:
      "Si. Il pulsante con il logo Vibes Planner porta al modulo per cercare fornitori adatti alla zona e al tipo di evento."
  },
  {
    question: "Perché partire dalla zona",
    answer:
      "Perché costi, disponibilità, logistica e tempi cambiano molto tra Milano, Roma, province e regioni diverse."
  },
  {
    question: "Posso aprire una domanda alla community",
    answer:
      "Si. Se vuoi un parere pubblico su budget, preventivo o scelta del servizio, puoi aprire una domanda senza registrazione obbligatoria."
  }
];

export const metadata: Metadata = {
  title: "Fornitori per eventi: guide locali, zone e servizi",
  description:
    "Trova guide locali per scegliere fornitori eventi: location, catering, musica, fotografi, event planner, allestimenti e servizi nelle principali zone del Nord e Centro Italia.",
  alternates: selfAlternates("it", { type: "static", key: "localSuppliers" })
};

export default function LocalSuppliersHubPage() {
  const featured = getFeaturedLocalSeoPages();
  const regionGroups = getLocalSeoPagesByRegion();
  const pageUrl = "https://organizzaevento.com/fornitori-eventi";
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Fornitori per eventi: guide locali, zone e servizi",
    description:
      "Guide locali per scegliere fornitori eventi, controllare preventivi e capire quali domande fare prima di confermare.",
    inLanguage: "it-IT",
    url: pageUrl,
    hasPart: featured.slice(0, 9).map((page) => ({
      "@type": "Article",
      headline: page.title,
      url: `https://organizzaevento.com${localizedPath("it", { type: "localSeo", page })}`,
      image: page.heroImage,
      about: page.categoryName,
      spatialCoverage: page.region
    }))
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqMainEntity(localSupplierFaqs, pageUrl)
  };

  return (
    <main className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Fornitori locali</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl xl:text-6xl">
              Scegli servizio e zona prima di chiedere preventivi.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              Qui trovi pagine locali pensate per chi sta davvero organizzando un evento: cosa controllare, quali
              domande fare, quali errori evitare e quando aprire una conversazione con la community.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#zone"
                className="focus-ring inline-flex justify-center rounded-xl bg-violet-cta px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-hover"
              >
                Cerca per zona
              </Link>
              <VibesSupplierCta className="px-6">
                Richiedi fornitori
              </VibesSupplierCta>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-xl border border-line bg-white shadow-sm sm:grid-cols-3">
            <div className="border-b border-line p-5 sm:border-b-0 sm:border-r">
              <strong className="block text-3xl text-ink">{localSeoCategories.length}</strong>
              <span className="mt-1 block text-sm text-muted">servizi mappati</span>
            </div>
            <div className="border-b border-line p-5 sm:border-b-0 sm:border-r">
              <strong className="block text-3xl text-ink">{regionGroups.length}</strong>
              <span className="mt-1 block text-sm text-muted">regioni disponibili</span>
            </div>
            <div className="p-5">
              <strong className="block text-3xl text-ink">{featured.length}</strong>
              <span className="mt-1 block text-sm text-muted">pagine in evidenza</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid overflow-hidden rounded-xl border border-line bg-white shadow-sm lg:grid-cols-[0.82fr_1.18fr]">
          <div className="border-b border-line bg-[#fff8f4] p-6 lg:border-b-0 lg:border-r lg:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Metodo rapido</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Trova la pagina giusta senza perdere tempo.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Questa sezione non è una vetrina: serve a orientarti prima di chiedere preventivi, così ogni click porta a
              una scelta più chiara.
            </p>
          </div>
          <div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {methodSteps.map((step, index) => (
              <div key={step.title} className="p-5 sm:p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">
                  Passo {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Parti da qui</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Ricerche locali ad alta intenzione.</h2>
            </div>
            <Link href="/fai-domanda" className="focus-ring rounded-xl bg-petal px-5 py-3 text-sm font-semibold text-violet-cta">
              Apri una domanda
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="focus-ring group overflow-hidden rounded-xl border border-line bg-cream transition hover:-translate-y-1 hover:bg-white hover:shadow-soft"
              >
                <div className="relative h-56">
                  <img
                    src={page.heroImage}
                    alt={page.heroAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.08),rgba(47,36,48,0.70))]" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-100">{page.region}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">{page.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="line-clamp-3 text-sm leading-7 text-muted">{page.intro}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted">
                    <span className="rounded-lg bg-white px-2.5 py-1">{page.categoryName}</span>
                    <span className="rounded-lg bg-white px-2.5 py-1">Guida locale</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="zone" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Archivio per regione</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Apri la regione e scegli la guida più vicina.</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Le pagine sono pubblicate solo quando hanno utilità: zona, categoria, casi tipici, checklist e link interni
            coerenti. Non sono schede fornitore e non contengono recensioni inventate.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {regionGroups.map((group, index) => (
            <details key={group.region} open={index < 2} className="group rounded-xl border border-line bg-white p-4 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span>
                  <span className="block text-lg font-semibold text-ink">{group.region}</span>
                  <span className="mt-1 block text-sm text-muted">{group.pages.length} guide locali pubblicate</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-petal text-violet-cta transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {group.pages.slice(0, 18).map((page) => (
                  <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    className="focus-ring rounded-xl border border-line bg-cream px-4 py-3 transition hover:bg-petal"
                  >
                    <span className="block font-semibold leading-6 text-ink">{page.title}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {page.categoryName} - {page.city}
                    </span>
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Domande utili</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Prima di chiedere un preventivo.</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Risposte brevi per capire come usare le guide locali e quando passare alla richiesta fornitori.
            </p>
          </div>
          <div className="grid gap-3">
            {localSupplierFaqs.map((item) => (
              <details key={item.question} className="group rounded-xl border border-line bg-white p-4 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                  {item.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-petal text-violet-cta transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
