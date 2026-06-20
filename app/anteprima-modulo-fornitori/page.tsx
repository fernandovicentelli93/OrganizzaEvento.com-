import { SupplierRequestWizard } from "@/components/SupplierRequestWizard";

export const metadata = {
  title: "Anteprima modulo fornitori | OrganizzaEvento"
};

export default function SupplierRequestWizardPreviewPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-cta">Anteprima interna</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Modulo richiesta fornitori</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Prima bozza in stile OrganizzaEvento, pronta da rifinire e poi collegare al popup Trova fornitori.
          </p>
        </div>
        <SupplierRequestWizard />
      </div>
    </main>
  );
}
