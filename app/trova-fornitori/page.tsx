import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SupplierTaxonomyRequestWizard } from "@/components/SupplierTaxonomyRequestWizard";
import { SUPPORT_EMAIL, SUPPORT_EMAIL_LINK, VIBES_PLANNER_URL } from "@/lib/constants";
import { selfAlternates } from "@/lib/i18n-routing";
import { VIBES_TAXONOMY } from "@/lib/vibes-taxonomy";

export const metadata: Metadata = {
  title: "Trova fornitori per eventi in Italia | OrganizzaEvento",
  description:
    "Cerca e prenota fornitori per matrimoni, compleanni, feste private ed eventi aziendali. Aggiungi location, musica, planner, catering e servizi senza perdere il contesto evento.",
  alternates: selfAlternates("it", { type: "static", key: "findSuppliers" })
};

const quickBenefits = [
  {
    title: "Parti dal fornitore che ti serve davvero",
    text: "Non sei obbligato a iniziare dalla location: puoi partire da musica, catering, foto, fiori o qualunque servizio ti serva."
  },
  {
    title: "Zona, invitati e budget restano attivi",
    text: "Li scrivi una volta sola e restano dentro ogni ricerca, così i risultati sono più coerenti."
  },
  {
    title: "Aggiungi più categorie senza rifare tutto",
    text: "Ogni fornitore ha budget e sottocategorie proprie, ma il contesto evento resta lo stesso."
  },
  {
    title: "Vetrine Vibes Planner, non risultati generici",
    text: "Le schede suggerite vengono filtrate per categoria e coerenza prima di essere mostrate."
  }
];

const supplierBubbles = [
  {
    slug: "location",
    label: "Location",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=240&q=80"
  },
  {
    slug: "musica",
    label: "Musica",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=240&q=80"
  },
  {
    slug: "intrattenimento",
    label: "Intrattenimento",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=240&q=80"
  },
  {
    slug: "catering-e-gastronomia",
    label: "Catering",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=240&q=80"
  },
  {
    slug: "event-planner",
    label: "Planner",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=240&q=80"
  },
  {
    slug: "fotografi-e-videomaker",
    label: "Foto e video",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=240&q=80"
  },
  {
    slug: "fioristi-allestimenti-floreali-e-verde",
    label: "Fiori",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=240&q=80"
  },
  {
    slug: "tecnici-e-allestitori",
    label: "Allestimenti",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=240&q=80"
  }
];

const flowSteps = [
  {
    title: "1. Scrivi il brief",
    text: "Tipo evento, via o zona, invitati, budget e periodo: pochi dati, ma quelli che servono per non perdere tempo."
  },
  {
    title: "2. Scegli da chi partire",
    text: "Location, musica, planner, catering, foto e video: non sei obbligato a seguire un ordine fisso."
  },
  {
    title: "3. Aggiungi fornitori",
    text: "Ogni categoria mantiene il brief generale e ti fa scegliere solo i dettagli davvero utili."
  },
  {
    title: "4. Confronta i match",
    text: "La pagina mostra fornitori consigliati, distanza quando conta e coerenza con la richiesta."
  }
];

const faqs = [
  {
    question: "Devo registrarmi per cercare fornitori?",
    answer: "No. Puoi iniziare senza registrazione obbligatoria. L'iscrizione serve solo per gestire meglio profilo, richieste e storico."
  },
  {
    question: "Posso partire dalla musica invece che dalla location?",
    answer: "Sì. Il modulo ti fa scegliere il primo fornitore: musica, location, planner, catering, foto e video o un'altra categoria."
  },
  {
    question: "Che ruolo ha Vibes Planner?",
    answer:
      "OrganizzaEvento resta una community indipendente. Se invii una richiesta tramite una scheda Vibes Planner, potrai essere ricontattato direttamente dal fornitore."
  }
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">{children}</p>;
}

function sanitizeSupplierCategorySlug(value: string | undefined) {
  if (!value) return "location";
  return VIBES_TAXONOMY.some((item) => item.slug === value) ? value : "location";
}

type SupplierLandingPageProps = {
  searchParams?: Promise<{ categoria?: string }>;
};

export default async function SupplierLandingPage({ searchParams }: SupplierLandingPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedCategorySlug = sanitizeSupplierCategorySlug(resolvedSearchParams?.categoria);

  return (
    <main className="max-w-full overflow-x-hidden bg-[#FFFDF7]">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Torna alla homepage OrganizzaEvento">
            <Image src="/brand/logo.png" alt="OrganizzaEvento" width={190} height={58} priority className="h-12 w-auto object-contain" />
          </Link>
          <a
            href={VIBES_PLANNER_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-ink shadow-sm sm:text-sm"
          >
            <Image src="/partners/vibes-planner/logo.jpg" alt="" width={24} height={24} className="h-6 w-6 rounded object-cover" />
            <span className="hidden sm:inline">In collaborazione con</span>
            <span>Vibes Planner</span>
          </a>
        </header>

        <div className="grid min-w-0 gap-6 py-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:py-12">
          <div className="min-w-0">
            <SectionEyebrow>Cerco fornitori</SectionEyebrow>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Trova i fornitori giusti senza ricominciare da zero ogni volta.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Un unico brief per cercare location, musica, planner, catering, foto, video e altri servizi. Scegli tu da
              quale fornitore partire, poi aggiungi gli altri mantenendo zona, invitati e budget.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#modulo-fornitori"
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md bg-violet-cta px-6 py-3 text-base font-bold text-white shadow-soft transition hover:bg-violet-hover"
              >
                Apri il modulo fornitori
              </a>
              <Link
                href="/fai-domanda"
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-white px-6 py-3 text-base font-bold text-ink transition hover:bg-petal"
              >
                Chiedi alla community
              </Link>
            </div>

          </div>

          <div className="min-w-0 rounded-md border border-line bg-white p-4 shadow-soft sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {quickBenefits.map((item, index) => (
                <div key={item.title} className="rounded-md border border-line bg-cream p-4">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-violet-cta">0{index + 1}</span>
                  <h2 className="mt-3 text-base font-semibold leading-6 text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 min-w-0 rounded-md border border-line bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">Fornitori prenotabili</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Scegli chi vuoi trovare per il tuo evento.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted">
              Ogni cerchio apre il modulo gia impostato sulla categoria giusta. Poi puoi aggiungere gli altri fornitori.
            </p>
          </div>
          <div className="-mx-4 mt-6 flex max-w-[100vw] gap-5 overflow-x-auto px-4 pb-3 sm:mx-0 sm:max-w-full sm:px-0">
            {supplierBubbles.map((item) => {
              const isActive = selectedCategorySlug === item.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/trova-fornitori?categoria=${item.slug}#modulo-fornitori`}
                  className="group min-w-[104px] text-center sm:min-w-[118px]"
                  aria-label={`Cerca fornitori: ${item.label}`}
                >
                  <span
                    className={`mx-auto block h-20 w-20 overflow-hidden rounded-full border bg-petal shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-soft sm:h-24 sm:w-24 ${
                      isActive ? "border-violet-cta ring-4 ring-blush" : "border-line"
                    }`}
                  >
                    <img src={item.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </span>
                  <span className="mt-3 block min-h-[2.4rem] text-sm font-bold leading-tight text-ink group-hover:text-violet-cta">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:px-6 md:grid-cols-4 lg:px-8">
          {flowSteps.map((step) => (
            <article key={step.title} className="rounded-md border border-line bg-[#FFFDF7] p-4">
              <h2 className="text-base font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="modulo-fornitori" className="mx-auto max-w-7xl scroll-mt-10 px-2 py-8 sm:px-6 sm:py-12 lg:px-8">
        <SupplierTaxonomyRequestWizard initialCategorySlug={selectedCategorySlug} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-md border border-line bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <SectionEyebrow>FAQ</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Domande frequenti.</h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                Hai bisogno di assistenza? Scrivi a{" "}
                <a className="font-semibold text-ink underline-offset-4 hover:underline" href={SUPPORT_EMAIL_LINK}>
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>
            <div className="grid gap-3">
              {faqs.map((item) => (
                <details key={item.question} className="group rounded-md border border-line bg-cream p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                    {item.question}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-petal text-violet-cta transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
