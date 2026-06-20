"use client";

import { useMemo, useState } from "react";
import {
  VIBES_EVENT_TYPES,
  VIBES_PROVINCES,
  VIBES_SUPPLIER_CATEGORIES,
  supplierCategoryLabel,
  supplierEventTypeLabel,
  type VibesSupplierCategory
} from "@/lib/vibes-suppliers";

type WizardStep = "event" | "place" | "services" | "details" | "contact";

const steps: { id: WizardStep; label: string }[] = [
  { id: "event", label: "Evento" },
  { id: "place", label: "Luogo" },
  { id: "services", label: "Fornitori" },
  { id: "details", label: "Dettagli" },
  { id: "contact", label: "Contatti" }
];

const budgets = ["Da concordare", "Fino a 1.500 euro", "1.500 - 3.000 euro", "3.000 - 5.000 euro", "5.000 - 10.000 euro", "Oltre 10.000 euro"];

export function SupplierRequestWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [eventType, setEventType] = useState("");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [period, setPeriod] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [accepted, setAccepted] = useState(false);

  const currentStep = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const selectedServices = useMemo(
    () => VIBES_SUPPLIER_CATEGORIES.filter((category) => services.includes(category.slug)),
    [services]
  );

  function toggleService(category: VibesSupplierCategory) {
    setServices((current) =>
      current.includes(category.slug) ? current.filter((slug) => slug !== category.slug) : [...current, category.slug]
    );
  }

  function nextStep() {
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-[0_18px_55px_rgba(47,36,48,0.10)] sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-xl bg-cream p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-cta">Trova fornitori</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">Raccontaci l'evento. Ti aiutiamo a trovare le persone giuste.</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Pochi passaggi, domande semplici e nessuna registrazione obbligatoria. Più dettagli inserisci, più la ricerca sarà precisa.
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-semibold text-muted">
              <span>Completamento</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-violet-cta transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setStepIndex(index)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition ${
                  currentStep.id === step.id ? "border-violet-cta bg-white text-ink shadow-sm" : "border-line bg-white/60 text-muted hover:bg-white"
                }`}
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-petal text-xs font-bold text-violet-cta">{index + 1}</span>
                <span className="font-semibold">{step.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="min-h-[520px] rounded-xl border border-line p-4 sm:p-6">
          {currentStep.id === "event" && (
            <div>
              <h3 className="text-xl font-semibold text-ink">Che tipo di evento stai organizzando?</h3>
              <p className="mt-2 text-sm text-muted">Scegli la voce più vicina. Se non la trovi, useremo "Altro".</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {VIBES_EVENT_TYPES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEventType(item)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      eventType === item ? "border-violet-cta bg-petal text-violet-cta" : "border-line bg-cream text-ink hover:border-violet-cta"
                    }`}
                  >
                    {supplierEventTypeLabel(item, "it")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep.id === "place" && (
            <div>
              <h3 className="text-xl font-semibold text-ink">Dove vuoi organizzarlo?</h3>
              <p className="mt-2 text-sm text-muted">Provincia e zona aiutano a trovare fornitori davvero compatibili.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Regione</span>
                  <input value={region} onChange={(event) => setRegion(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-violet-cta" placeholder="Es. Lazio" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Provincia</span>
                  <select value={province} onChange={(event) => setProvince(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-violet-cta">
                    <option value="">Seleziona provincia</option>
                    {VIBES_PROVINCES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}

          {currentStep.id === "services" && (
            <div>
              <h3 className="text-xl font-semibold text-ink">Di quali fornitori hai bisogno?</h3>
              <p className="mt-2 text-sm text-muted">Puoi selezionare più servizi. La richiesta sarà più chiara già dal primo invio.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {VIBES_SUPPLIER_CATEGORIES.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => toggleService(category)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      services.includes(category.slug) ? "border-violet-cta bg-petal text-violet-cta" : "border-line bg-cream text-ink hover:border-violet-cta"
                    }`}
                  >
                    {supplierCategoryLabel(category, "it")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep.id === "details" && (
            <div>
              <h3 className="text-xl font-semibold text-ink">Aggiungiamo due dettagli pratici</h3>
              <p className="mt-2 text-sm text-muted">Non serve essere perfetti: anche una stima va benissimo.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Data o periodo</span>
                  <input value={period} onChange={(event) => setPeriod(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-violet-cta" placeholder="Es. settembre 2026" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Invitati indicativi</span>
                  <input value={guests} onChange={(event) => setGuests(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-violet-cta" placeholder="Es. 80 persone" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-semibold text-ink">Budget</span>
                  <select value={budget} onChange={(event) => setBudget(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-violet-cta">
                    <option value="">Seleziona una fascia</option>
                    {budgets.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}

          {currentStep.id === "contact" && (
            <div>
              <h3 className="text-xl font-semibold text-ink">Dove possiamo ricontattarti?</h3>
              <p className="mt-2 text-sm text-muted">Useremo questi dati solo per gestire la richiesta fornitori.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Nome</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-violet-cta" placeholder="Il tuo nome" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Email</span>
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-violet-cta" placeholder="nome@email.it" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-semibold text-ink">WhatsApp</span>
                  <input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-violet-cta" placeholder="+39 ..." />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-semibold text-ink">Note utili</span>
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-violet-cta" placeholder="Es. cerco una location con spazio esterno e musica fino a tardi." />
                </label>
                <label className="flex gap-3 rounded-xl border border-line bg-cream p-4 text-sm text-muted sm:col-span-2">
                  <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-violet-cta" />
                  <span>Accetto di essere ricontattato per la richiesta e dichiaro di aver letto privacy e condizioni del servizio.</span>
                </label>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-xl bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Riepilogo</p>
            <p className="mt-2 text-sm text-ink">
              {eventType ? supplierEventTypeLabel(eventType, "it") : "Evento da definire"}
              {province ? ` · ${province}` : ""}
              {budget ? ` · ${budget}` : ""}
            </p>
            {selectedServices.length > 0 && (
              <p className="mt-2 text-xs leading-5 text-muted">
                Servizi: {selectedServices.map((item) => supplierCategoryLabel(item, "it")).join(", ")}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={previousStep} disabled={stepIndex === 0} className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40">
              Indietro
            </button>
            {stepIndex < steps.length - 1 ? (
              <button type="button" onClick={nextStep} className="rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
                Continua
              </button>
            ) : (
              <button type="button" disabled={!accepted || !email} className="rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover disabled:cursor-not-allowed disabled:opacity-50">
                Invia richiesta
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
