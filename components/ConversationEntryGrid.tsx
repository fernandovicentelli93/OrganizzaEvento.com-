import Link from "next/link";
import { RotatingEventImage } from "@/components/RotatingEventImage";

const entries = [
  {
    label: "Preventivo",
    title: "Analizza un preventivo",
    description: "Se hai ricevuto un prezzo e non capisci cosa è incluso, parti da qui.",
    example: "Carica o incolla il preventivo: togliamo i dati sensibili e prepariamo la discussione.",
    href: "/analizza-preventivo",
    cta: "Analizza preventivo",
    featured: true
  },
  {
    label: "Parere",
    title: "Ho una domanda",
    description: "Per quando non sai bene cosa scegliere e vuoi un parere.",
    example: "Meglio villa o ristorante per 60 persone?",
    href: { pathname: "/fai-domanda", query: { tipo: "Domanda" } },
    cta: "Apri discussione"
  },
  {
    label: "Prezzi",
    title: "Voglio capire quanto costa",
    description: "Per capire se una cifra è normale o se c'è qualcosa da chiarire.",
    example: "DJ, open bar, catering: che cifra ha senso?",
    href: { pathname: "/fai-domanda", query: { tipo: "Quanto costa", categoria: "quanto-costa" } },
    cta: "Confronta prezzi"
  },
  {
    label: "Aiuto",
    title: "Ho un problema",
    description: "Caparra alta, risposte che non arrivano, accordi poco chiari.",
    example: "Il fornitore non risponde più: cosa faccio",
    href: { pathname: "/fai-domanda", query: { tipo: "Problema", categoria: "problemi-fornitori" } },
    cta: "Chiedi aiuto"
  },
  {
    label: "Esperienza",
    title: "Raccontó com'e andata",
    description: "Utile se vuoi dire cosa rifaresti e cosa invece eviteresti.",
    example: "Alla fine ho scelto... e lo rifarei?",
    href: { pathname: "/fai-domanda", query: { tipo: "Esperienza reale" } },
    cta: "Racconta"
  },
  {
    label: "Idee",
    title: "Cerco un'idea",
    description: "Per quando vuoi qualcosa di diverso ma fattibile.",
    example: "Festa adulta elegante, ma non impostata.",
    href: { pathname: "/fai-domanda", query: { tipo: "Idea", categoria: "idee-evento" } },
    cta: "Trova idee"
  }
];

type ConversationEntryGridProps = {
  compact?: boolean;
};

export function ConversationEntryGrid({ compact = false }: ConversationEntryGridProps) {
  const visibleEntries = compact ? entries.slice(0, 4) : entries;

  return (
    <section
      className={
        compact
          ? "overflow-hidden rounded-lg border border-line bg-white shadow-sm"
          : "grid gap-5 lg:grid-cols-[0.72fr_1.28fr]"
      }
    >
      <div className={compact ? "" : "contents"}>
        <div className={compact ? "border-b border-line bg-petal/60 p-5 sm:p-6" : ""}>
          <div className={compact ? "grid gap-5 md:grid-cols-[1fr_18rem] md:items-center" : ""}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Forum community</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink">
                {compact ? "Di cosa vuoi parlare?" : "Parti dal problema, non dal menù."}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
                Scegli il tipo di discussione: chi legge capisce subito se deve darti un prezzo, un parere o un controllo sul preventivo.
              </p>
            </div>
            {compact ? <RotatingEventImage /> : null}
          </div>
        </div>

        <div className={`grid gap-3 ${compact ? "p-4 sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
          {visibleEntries.map((entry, index) => (
            <Link
              key={entry.title}
              href={entry.href}
              className={[
                "focus-ring group rounded-lg border p-4 transition hover:-translate-y-0.5 hover:shadow-sm",
                entry.featured
                  ? "border-violet-cta bg-violet-cta text-white shadow-soft sm:col-span-2 lg:col-span-1"
                  : "border-line bg-cream hover:border-violet-cta hover:bg-white"
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={[
                    "rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] shadow-sm",
                    entry.featured ? "bg-white text-violet-cta" : "bg-white text-violet-cta"
                  ].join(" ")}
                >
                  {entry.label}
                </span>
                <span className={entry.featured ? "text-xs font-semibold text-white/75" : "text-xs font-semibold text-muted"}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className={entry.featured ? "mt-4 text-lg font-semibold leading-snug text-white" : "mt-4 text-lg font-semibold leading-snug text-ink"}>
                {entry.title}
              </h3>
              <p className={entry.featured ? "mt-2 text-sm leading-6 text-white/85" : "mt-2 text-sm leading-6 text-muted"}>{entry.description}</p>
              <div
                className={
                  entry.featured
                    ? "mt-4 border-l-2 border-white/45 pl-3 text-sm leading-6 text-white"
                    : "mt-4 border-l-2 border-violet-cta/40 pl-3 text-sm leading-6 text-ink"
                }
              >
                {entry.example}
              </div>
              <span
                className={
                  entry.featured
                    ? "mt-5 inline-flex min-h-10 items-center rounded-lg bg-white px-3 text-sm font-semibold text-violet-cta transition group-hover:bg-petal"
                    : "mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-violet-cta transition group-hover:text-violet-hover"
                }
              >
                {entry.cta}
                <span aria-hidden="true" className="ml-2 transition group-hover:translate-x-0.5">
                  -&gt;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
