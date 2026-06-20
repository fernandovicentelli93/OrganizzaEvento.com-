import type { Metadata } from "next";
import { createSupportRequest } from "@/app/actions";
import { VibesPlannerBanner } from "@/components/VibesPlannerBanner";
import { SUPPORT_EMAIL, SUPPORT_EMAIL_LINK, VIBES_PLANNER_URL } from "@/lib/constants";
import { selfAlternates } from "@/lib/i18n-routing";

export const metadata: Metadata = {
  title: "Collaborazioni",
  description:
    "Richieste di collaborazione e visibilità su OrganizzaEvento.com per realtà del settore eventi.",
  alternates: selfAlternates("it", { type: "static", key: "partnerships" })
};

export default function CollaborationsPage() {
  const startedAt = Date.now();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Collaborazioni</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Proposte per realtà del settore eventi</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          Valutiamo collaborazioni editoriali e spazi visivi coerenti con la piattaforma: banner, loghi, iniziative
          utili per clienti e fornitori che lavorano nel mondo eventi.
        </p>
        <a
          href={VIBES_PLANNER_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="focus-ring mt-6 inline-flex items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3"
        >
          <img
            src="/partners/vibes-planner/logo.jpg"
            alt="Vibes Planner"
            loading="lazy"
            decoding="async"
            className="h-11 w-11 rounded-lg object-contain"
          />
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">Collaborazione attiva</span>
            <span className="block font-semibold text-ink">Vibes Planner</span>
          </span>
        </a>

        <form action={createSupportRequest} className="mt-8 grid gap-4">
          <input type="hidden" name="sourcePath" value="/collaborazioni" />
          <input type="hidden" name="formStartedAt" value={startedAt} />
          <label className="sr-only">
            Non compilare questo campo
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Nome o azienda</span>
            <input name="name" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Email</span>
            <input name="email" type="email" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Che collaborazione vuoi proporre?</span>
            <textarea
              name="message"
              required
              rows={7}
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
              placeholder="Es. banner, contenuto editoriale, iniziativa con fornitori, visibilità per un servizio..."
            />
          </label>
          <button className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white">
            Invia proposta
          </button>
        </form>

        <p className="mt-5 text-sm leading-6 text-muted">
          Puoi anche scrivere direttamente a{" "}
          <a className="font-semibold text-violet-cta" href={SUPPORT_EMAIL_LINK}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
          </div>
          <div className="relative min-h-[30rem] bg-petal">
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=78"
              alt="Sala evento elegante allestita per collaborazioni nel settore eventi"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/70 bg-white/95 p-4 shadow-soft backdrop-blur">
              <p className="text-sm font-semibold text-ink">Spazi pensati per essere utili</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                La visibilità funziona quando aiuta davvero chi sta organizzando un evento.
              </p>
            </div>
          </div>
        </div>
      </div>
      <VibesPlannerBanner variant="footer" className="mt-6" />
    </div>
  );
}
