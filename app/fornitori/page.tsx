import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, VIBES_PLANNER_URL } from "@/lib/constants";
import { selfAlternates } from "@/lib/i18n-routing";
import { faqMainEntity } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Area fornitori: entra nella community eventi",
  description:
    "Pagina per fornitori eventi: rispondi alle conversazioni, costruisci reputazione, completa la scheda professionale e fatti trovare in modo coerente nella community OrganizzaEvento.com.",
  alternates: selfAlternates("it", { type: "static", key: "suppliers" })
};

const supplierConversations = [
  {
    eyebrow: "Budget da spiegare",
    title: "Una coppia non capisce perché una location costa più di un'altra.",
    text: "Risposta utile: chiarisci capienza, orari, personale, piano B, pulizie, extra e cosa confrontare davvero.",
    href: "/domande?category=location"
  },
  {
    eyebrow: "Preventivi da leggere",
    title: "Un cliente ha un preventivo catering e teme costi nascosti.",
    text: "Risposta utile: spiega cosa guardare tra menù, bevande, staff, trasporto, torta, IVA e tempi di conferma.",
    href: "/domande?category=catering-menu"
  },
  {
    eyebrow: "Dubbi pratici",
    title: "Qualcuno chiede se un DJ per 80 persone ha un prezzo normale.",
    text: "Risposta utile: differenzia console, luci, impianto, ore extra, SIAE, sopralluogo e richiesta scritta.",
    href: "/domande?category=musica-dj"
  },
  {
    eyebrow: "Problemi reali",
    title: "Un fornitore non risponde più e il cliente non sa cosa fare.",
    text: "Risposta utile: resta neutrale, suggerisci documenti, scadenze, messaggi chiari e alternative senza accuse.",
    href: "/domande?category=problemi-fornitori"
  }
];

const supplierSteps = [
  {
    title: "Completa la scheda",
    text: "Categoría, zone coperte, servizi, fascia indicativa, tipi evento e piccola bio. Niente recapiti pubblici."
  },
  {
    title: "Segui le conversazioni giuste",
    text: "Location, catering, musica, foto, allestimenti o eventi aziendali: rispondi solo dove puoi essere davvero utile."
  },
  {
    title: "Rispondi come professionista",
    text: "Spiega criteri, voci da controllare, domande da fare e rischi pratici. Non serve vendere in ogni risposta."
  },
  {
    title: "Costruisci fiducia",
    text: "Le risposte utili fanno crescere badge e reputazione: bronzo, argento, oro, platino e diamante."
  }
];

const profileFields = [
  "Nome attività",
  "Categoría principale",
  "Servizi offerti",
  "Tipi di evento seguiti",
  "Città e regione",
  "Zone coperte",
  "Fascia prezzo",
  "Budget minimo",
  "Portfolio",
  "Note disponibilità"
];

const supplierFaqs = [
  {
    question: "Devo registrarmi per leggere le conversazioni?",
    answer: "No. La registrazione serve se vuoi avere un badge fornitore, una dashboard e una scheda professionale ordinata."
  },
  {
    question: "Posso inserire telefono o email nelle risposte",
    answer: "No. La community deve restare pulita: niente recapiti pubblici, spam o inviti aggressivi a contattarti."
  },
  {
    question: "Che cosa rende utile una risposta di un fornitore?",
    answer: "Una risposta utile aiuta a capire voci, tempi, extra, rischi, domande da fare e criteri di scelta."
  },
  {
    question: "Che ruolo ha Vibes Planner?",
    answer: "OrganizzaEvento.com mantiene la sua community. La collaborazione con Vibes Planner resta un collegamento delicato per chi vuole approfondire il tema richieste e fornitori."
  }
];

export default function SuppliersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://organizzaevento.com/fornitori#webpage",
        name: "Area fornitori OrganizzaEvento.com",
        description: metadata.description,
        url: "https://organizzaevento.com/fornitori",
        inLanguage: "it-IT",
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: "https://organizzaevento.com"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://organizzaevento.com/fornitori#faq",
        mainEntity: faqMainEntity(supplierFaqs, "https://organizzaevento.com/fornitori")
      }
    ]
  };

  return (
    <main className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative isolate overflow-hidden border-b border-line">
        <img
          src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1700&q=78"
          alt="Professionisti che preparano un evento elegante"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.88),rgba(47,36,48,0.62),rgba(47,36,48,0.24))]" />
        <div className="relative mx-auto grid min-h-[72vh] max-w-6xl gap-8 px-4 py-16 text-white lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">Area fornitori</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
              Rispondi dove puoi aiutare davvero.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-rose-50 sm:text-lg">
              OrganizzaEvento.com non è una vetrina fredda. È una community verticale dove chi organizza eventi fa domande
              pratiche e i fornitori possono costruire fiducia con risposte chiare, utili e rispettose.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/registrati?tipo=fornitore"
                className="focus-ring inline-flex justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink shadow-soft transition hover:bg-petal"
              >
                Crea profilo fornitore
              </Link>
              <Link
                href="/domande"
                className="focus-ring inline-flex justify-center rounded-xl border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Leggi conversazioni
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/40 bg-white/95 p-4 text-ink shadow-soft backdrop-blur sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Come funziona qui</p>
            <div className="mt-4 grid gap-3">
              {supplierSteps.map((step, index) => (
                <div key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-xl bg-cream p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-petal text-sm font-bold text-violet-cta">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{step.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{step.text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Conversazioni da presidíare</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink">
              Il tuo spazio non è il profilo. Sono le risposte utili.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Il layout resta quello della community: casi concreti, domande vere, risposte pratiche. Un fornitore bravo
              non entra per interrompere, entra per chiarire.
            </p>
            <Link
              href="/registrati?tipo=fornitore"
              className="focus-ring mt-6 inline-flex rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-hover"
            >
              Attiva badge fornitore
            </Link>
          </div>

          <div className="grid gap-4">
            {supplierConversations.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="focus-ring group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="grid md:grid-cols-[12rem_1fr]">
                  <div className="relative min-h-40 bg-petal">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,86,123,0.28),transparent_34%),linear-gradient(135deg,#fff8f3,#fce7ef)]" />
                    <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-cta">
                      {item.eyebrow}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold leading-snug text-ink transition group-hover:text-violet-cta">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{item.text}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-violet-cta">Apri casi simili -&gt;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Scheda professionale</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Una mappatura semplice, utile anche dopo.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              All'iscrizione chiedíamo solo cio che serve a ordinare il profilo e capire quali conversazioni sono coerenti.
              I recapiti restano fuori dalle risposte pubbliche: qui conta la fiducia, non la caccia al contatto.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/registrati?tipo=fornitore" className="focus-ring rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
                Compila scheda fornitore
              </Link>
              <Link href="/dashboard/fornitore" className="focus-ring rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink">
                Vai alla dashboard
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm sm:grid-cols-2">
            {profileFields.map((field) => (
              <div key={field} className="rounded-xl bg-cream px-4 py-3 text-sm font-semibold text-ink">
                {field}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Reputazione</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Badge che premiano presenza e qualità.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              La gamification ? semplice: più partecipi bene, più il profilo diventa credibile dentro la community.
              Non premia chi scrive tanto, ma chi risponde in modo chiaro.
            </p>
            <div className="mt-6 grid gap-2">
              {["Bronzo", "Argento", "Oro", "Platino", "Diamante"].map((level, index) => (
                <div key={level} className="flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                  <span className="font-semibold text-ink">{level}</span>
                  <span className="text-xs font-semibold text-muted">{index === 0 ? "inizio" : `${index * 120}+ punti`}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-petal p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-4">
              <img
                src="/partners/vibes-planner/logo.jpg"
                alt="Vibes Planner"
                loading="lazy"
                decoding="async"
                className="h-12 w-12 rounded-xl bg-white object-contain"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Collaborazione delicata</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Un ponte, non un'invasione.</h2>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-muted">
              OrganizzaEvento.com resta una community indipendente. Il richiamo a Vibes Planner serve solo a collegare,
              con discrezione, il mondo delle conversazioni alle richieste più strutturate per clienti e fornitori.
            </p>
            <a
              href={VIBES_PLANNER_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="focus-ring mt-6 inline-flex rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-cream"
            >
              Scopri Vibes Planner
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">FAQ fornitori</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Domande prima di entrare.</h2>
          <div className="mt-6 grid gap-3">
            {supplierFaqs.map((faq) => (
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
        </div>
      </section>
    </main>
  );
}
