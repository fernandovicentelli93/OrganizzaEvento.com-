import { SupplierTaxonomyRequestWizard } from "@/components/SupplierTaxonomyRequestWizard";

export const metadata = {
  title: "Anteprima ricerca fornitori smart | OrganizzaEvento"
};

export default function SupplierTaxonomyPreviewPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-cta">Anteprima interna</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
            Ricerca fornitori con stile OrganizzaEvento.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Il modulo cambia domande e filtri in base al tipo di fornitore scelto. L'obiettivo è trasformare una richiesta
            vaga in una ricerca chiara, utile e bella da usare, senza sembrare un pannello tecnico.
          </p>
        </div>
        <SupplierTaxonomyRequestWizard />
      </div>
    </main>
  );
}
