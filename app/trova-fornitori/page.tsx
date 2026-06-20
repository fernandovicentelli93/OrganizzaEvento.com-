import Image from "next/image";
import Link from "next/link";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import { SUPPORT_EMAIL, SUPPORT_EMAIL_LINK, VIBES_PLANNER_CLIENT_REQUEST_URL } from "@/lib/constants";
import { selfAlternates } from "@/lib/i18n-routing";

export const metadata = {
  title: "Trova fornitori italiani per eventi",
  description:
    "Apri il modulo Vibes Planner per cercare fornitori italiani per matrimoni, feste private, compleanni ed eventi aziendali.",
  alternates: selfAlternates("it", { type: "static", key: "findSuppliers" })
};

const steps = [
  {
    title: "Racconta l'evento",
    text: "Tipo evento, città, data indicativa, numero persone e budget se lo hai già in mente."
  },
  {
    title: "Indica cosa ti serve",
    text: "Location, catering, musica, foto, allestimenti, bar o altri fornitori utili."
  },
  {
    title: "Ricevi supporto mirato",
    text: "Il modulo si apre su Vibes Planner: i tuoi dati non vengono pubblicati nel forum."
  }
];

export default function SupplierRequestPage() {
  return (
    <main className="bg-cream">
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Ricerca fornitori</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl xl:text-6xl">
            Trova fornitori italiani per il tuo evento.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
            OrganizzaEvento resta la community dove leggere, chiedere e confrontarti. Per inviare una richiesta privata
            a fornitori italiani usiamo il modulo Vibes Planner, così il percorso è unico e più ordinato.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <VibesSupplierCta variant="pink" className="px-6 text-base" logoClassName="h-8 w-8">
              Apri il modulo fornitori
            </VibesSupplierCta>
            <Link
              href="/fai-domanda"
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-xl border border-line bg-white px-6 py-3 text-base font-semibold text-ink transition hover:bg-petal"
            >
              Chiedi alla community
            </Link>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            Hai bisogno di assistenza prima di compilare? Scrivi a{" "}
            <a className="font-semibold text-ink underline-offset-4 hover:underline" href={SUPPORT_EMAIL_LINK}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>

        <a
          href={VIBES_PLANNER_CLIENT_REQUEST_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="focus-ring group relative block overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-soft transition hover:-translate-y-0.5"
          aria-label="Apri il modulo Vibes Planner per cercare fornitori"
        >
          <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-3 py-2 text-xs font-semibold text-ink shadow-sm">
            <Image
              src="/partners/vibes-planner/logo.jpg"
              alt="Vibes Planner"
              width={32}
              height={32}
              className="h-6 w-6 rounded-md object-cover"
            />
            Modulo Vibes
          </span>
          <Image
            src="/partners/vibes-planner/banner-square.jpg"
            alt="Vibes Planner - richiesta fornitori per eventi"
            width={790}
            height={790}
            priority
            className="aspect-[4/3] w-full rounded-xl object-cover sm:aspect-square"
          />
        </a>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-petal text-sm font-semibold text-violet-cta">
                {index + 1}
              </span>
              <h2 className="mt-5 text-xl font-semibold text-ink">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
