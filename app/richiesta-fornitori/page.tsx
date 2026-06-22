import type { Metadata } from "next";
import { SupplierRequestWizard } from "@/components/SupplierRequestWizard";

export const metadata: Metadata = {
  title: "Richiesta fornitori per eventi",
  description:
    "Invia una richiesta strutturata per location, musica, catering, planner, foto e altri fornitori per eventi. Nessuna registrazione obbligatoria.",
  alternates: {
    canonical: "/richiesta-fornitori"
  }
};

export default function SupplierLeadRequestPage() {
  return (
    <main className="bg-cream">
      <section className="border-b border-line bg-petal">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-cta">Richiesta fornitori</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
                Trova il fornitore o i fornitori giusti per il tuo evento.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
                Raccontaci evento, zona, invitati e budget. Poi scegli una o più categorie: location, musica,
                catering, planner, foto, fiori o altri servizi. Alla fine verifichi il contatto e la richiesta viene
                salvata in modo ordinato nel gestionale.
              </p>
            </div>
            <div className="rounded-md border border-line bg-white p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Come funziona</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
                <li>
                  <strong className="text-ink">1.</strong> Inserisci il brief evento una sola volta.
                </li>
                <li>
                  <strong className="text-ink">2.</strong> Aggiungi solo i fornitori che ti servono davvero.
                </li>
                <li>
                  <strong className="text-ink">3.</strong> Confermi telefono ed email prima dell'invio.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 lg:max-w-7xl">
        <SupplierRequestWizard />
      </section>
    </main>
  );
}
