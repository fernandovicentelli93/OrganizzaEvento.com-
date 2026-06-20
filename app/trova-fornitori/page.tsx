import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SupplierTaxonomyRequestWizard } from "@/components/SupplierTaxonomyRequestWizard";
import { SUPPORT_EMAIL, SUPPORT_EMAIL_LINK, VIBES_PLANNER_URL } from "@/lib/constants";
import { selfAlternates } from "@/lib/i18n-routing";

export const metadata: Metadata = {
  title: "Trova fornitori per eventi in Italia | OrganizzaEvento",
  description:
    "Cerca e prenota fornitori per matrimoni, compleanni, feste private ed eventi aziendali. Aggiungi location, musica, planner, catering e servizi senza perdere il contesto evento.",
  alternates: selfAlternates("it", { type: "static", key: "findSuppliers" })
};

const quickBenefits = [
  "Parti dal fornitore che ti serve davvero",
  "Zona, invitati e budget restano sempre attivi",
  "Puoi aggiungere più categorie senza riscrivere tutto",
  "I fornitori suggeriti arrivano da vetrine Vibes Planner"
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
    answer: "No. Puoi iniziare senza registrazione obbligatoria. L'iscrizione servirà solo per gestire meglio profilo, richieste e storico."
  },
  {
    question: "Posso partire dalla musica invece che dalla location?",
    answer: "Sì. Il modulo ti fa scegliere il primo fornitore: musica, location, planner, catering, foto e video o un'altra categoria."
  },
  {
    question: "Che ruolo ha Vibes Planner?",
    answer: "OrganizzaEvento resta una community indipendente. La collaborazione con Vibes Planner serve a leggere categorie e vetrine reali del settore eventi."
  }
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">{children}</p>;
}

export default function SupplierLandingPage() {
  return (
    <main className="bg-[#FFFDF7]">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8">
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

        <div className="grid gap-8 py-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:py-12">
          <div>
            <SectionEyebrow>Cerco fornitori</SectionEyebrow>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
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

          <div className="rounded-md border border-line bg-white p-4 shadow-soft sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {quickBenefits.map((item) => (
                <div key={item} className="rounded-md border border-line bg-cream p-4">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-violet-cta text-sm font-bold text-white">✓</span>
                  <p className="mt-3 text-sm font-bold leading-6 text-ink">{item}</p>
                </div>
              ))}
            </div>
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

      <section id="modulo-fornitori" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <SectionEyebrow>Modulo completo</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Prenota più fornitori partendo da un brief unico.
            </h2>
          </div>
          <p className="text-base leading-8 text-muted">
            Questo è il modulo completo: numero invitati, via o zona evento, budget e periodo restano attivi per tutte
            le ricerche. La parte musicale apre campi dedicati per formazione, musicista e genere.
          </p>
        </div>
        <SupplierTaxonomyRequestWizard />
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
