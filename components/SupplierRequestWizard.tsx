"use client";

import { useMemo, useState } from "react";
import { COMMON_EVENT_TYPES, VIBES_TAXONOMY, type VibesTaxonomyCategory } from "@/lib/vibes-taxonomy";

type WizardStep = "brief" | "suppliers" | "review" | "contact";

type SupplierDraft = {
  id: number;
  categorySlug: string;
  subcategories: string[];
  budgetRange: string;
  duration: string;
  services: string[];
  musicFormation: string[];
  musicGenres: string[];
  notes: string;
  showSubcategoryMenu: boolean;
  showMoreMusic: boolean;
};

type EventBrief = {
  eventType: string;
  region: string;
  province: string;
  cityOrArea: string;
  guestsCount: string;
  totalBudget: string;
  eventPeriod: string;
};

const steps: { id: WizardStep; label: string }[] = [
  { id: "brief", label: "Evento" },
  { id: "suppliers", label: "Fornitori" },
  { id: "review", label: "Riepilogo" },
  { id: "contact", label: "Contatto" }
];

const regionProvinceOptions = [
  { region: "Abruzzo", provinces: ["Chieti", "L'Aquila", "Pescara", "Teramo"] },
  { region: "Basilicata", provinces: ["Matera", "Potenza"] },
  { region: "Calabria", provinces: ["Catanzaro", "Cosenza", "Crotone", "Reggio Calabria", "Vibo Valentia"] },
  { region: "Campania", provinces: ["Avellino", "Benevento", "Caserta", "Napoli", "Salerno"] },
  { region: "Emilia-Romagna", provinces: ["Bologna", "Ferrara", "Forli-Cesena", "Modena", "Parma", "Piacenza", "Ravenna", "Reggio Emilia", "Rimini"] },
  { region: "Friuli-Venezia Giulia", provinces: ["Gorizia", "Pordenone", "Trieste", "Udine"] },
  { region: "Lazio", provinces: ["Frosinone", "Latina", "Rieti", "Roma", "Viterbo"] },
  { region: "Liguria", provinces: ["Genova", "Imperia", "La Spezia", "Savona"] },
  { region: "Lombardia", provinces: ["Bergamo", "Brescia", "Como", "Cremona", "Lecco", "Lodi", "Mantova", "Milano", "Monza e Brianza", "Pavia", "Sondrio", "Varese"] },
  { region: "Marche", provinces: ["Ancona", "Ascoli Piceno", "Fermo", "Macerata", "Pesaro e Urbino"] },
  { region: "Molise", provinces: ["Campobasso", "Isernia"] },
  { region: "Piemonte", provinces: ["Alessandria", "Asti", "Biella", "Cuneo", "Novara", "Torino", "Verbano-Cusio-Ossola", "Vercelli"] },
  { region: "Puglia", provinces: ["Bari", "Barletta-Andria-Trani", "Brindisi", "Foggia", "Lecce", "Taranto"] },
  { region: "Sardegna", provinces: ["Cagliari", "Nuoro", "Oristano", "Sassari", "Sud Sardegna"] },
  { region: "Sicilia", provinces: ["Agrigento", "Caltanissetta", "Catania", "Enna", "Messina", "Palermo", "Ragusa", "Siracusa", "Trapani"] },
  { region: "Toscana", provinces: ["Arezzo", "Firenze", "Grosseto", "Livorno", "Lucca", "Massa-Carrara", "Pisa", "Pistoia", "Prato", "Siena"] },
  { region: "Trentino-Alto Adige", provinces: ["Bolzano", "Trento"] },
  { region: "Umbria", provinces: ["Perugia", "Terni"] },
  { region: "Valle d'Aosta", provinces: ["Aosta"] },
  { region: "Veneto", provinces: ["Belluno", "Padova", "Rovigo", "Treviso", "Venezia", "Verona", "Vicenza"] }
];

const totalBudgets = ["Da definire", "Fino a 5.000 euro", "5.000 - 10.000 euro", "10.000 - 20.000 euro", "20.000 - 40.000 euro", "Oltre 40.000 euro"];
const fallbackBudgets = ["Da definire", "Da concordare", "Fino a 1.500 euro", "1.500 - 3.000 euro", "3.000 - 5.000 euro", "Oltre 5.000 euro"];
const fallbackDurations = ["Da definire", "1 ora", "2 ore", "Mezza giornata", "Giornata intera", "Serata completa", "Più giorni"];
const musicFormations = ["Solista", "Duo", "Trio", "Quartetto", "Band", "Orchestra"];
const musicGenres = ["Commerciale", "Dance", "Pop italiano", "Jazz", "House", "Disco", "Funk", "Soul", "Reggaeton", "Latino", "Swing", "Rock", "Acustico", "Anni 80/90"];
const contactPreferences = ["Mattina", "Pomeriggio", "Sera", "Weekend", "Fascia da concordare"];

function categoryBySlug(slug: string) {
  return VIBES_TAXONOMY.find((category) => category.slug === slug) ?? VIBES_TAXONOMY[0];
}

function categoryBudgetOptions(category: VibesTaxonomyCategory) {
  const options = category.filters.budget?.length ? category.filters.budget : fallbackBudgets;
  return options.includes("Da definire") ? options : ["Da definire", ...options];
}

function durationOptions(category: VibesTaxonomyCategory) {
  return category.filters.durata?.length ? category.filters.durata : fallbackDurations;
}

function serviceOptions(category: VibesTaxonomyCategory) {
  return [
    ...(category.filters.serviziInclusi ?? []),
    ...(category.filters.spazi ?? []),
    ...(category.filters.cucina ?? []),
    ...(category.filters.extraTecnici ?? []),
    ...(category.filters.logistica ?? []),
    ...(category.filters.modalitaLavoro ?? []),
    ...(category.filters.target ?? [])
  ].filter((item, index, list) => item && list.indexOf(item) === index);
}

function createSupplier(id: number, categorySlug = "location"): SupplierDraft {
  const category = categoryBySlug(categorySlug);
  return {
    id,
    categorySlug,
    subcategories: [],
    budgetRange: categoryBudgetOptions(category)[0] ?? "Da definire",
    duration: durationOptions(category)[0] ?? "Da definire",
    services: [],
    musicFormation: [],
    musicGenres: [],
    notes: "",
    showSubcategoryMenu: false,
    showMoreMusic: false
  };
}

function toggleValue(value: string, list: string[], max?: number) {
  if (list.includes(value)) return list.filter((item) => item !== value);
  const next = [...list, value];
  return max ? next.slice(0, max) : next;
}

function parseBudgetAmount(value: string) {
  if (!value || /definire|concordare|riservata|tariffa/i.test(value)) return null;
  const numbers = [...value.matchAll(/\d+(?:[.,]\d+)?/g)].map((match) => Number(match[0].replace(/\./g, "").replace(",", ".")));
  return numbers.length ? numbers[numbers.length - 1] : null;
}

function formatEuro(value: number | null) {
  if (value === null) return "Da definire";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function noteIsValid(note: string) {
  return note.trim().length >= 30;
}

function Chip({
  children,
  selected,
  disabled,
  onClick
}: {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-h-10 rounded-md border px-3 py-2 text-xs font-semibold leading-tight transition ${
        selected
          ? "border-violet-cta bg-violet-cta text-white"
          : disabled
            ? "cursor-not-allowed border-line bg-white text-muted/50"
            : "border-line bg-cream text-ink hover:border-violet-cta hover:bg-petal"
      }`}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-semibold text-ink">{children}</span>;
}

export function SupplierRequestWizard() {
  const [step, setStep] = useState<WizardStep>("brief");
  const [brief, setBrief] = useState<EventBrief>({
    eventType: "Matrimonio",
    region: "",
    province: "",
    cityOrArea: "",
    guestsCount: "",
    totalBudget: "Da definire",
    eventPeriod: ""
  });
  const [suppliers, setSuppliers] = useState<SupplierDraft[]>([createSupplier(1)]);
  const [showSupplierPicker, setShowSupplierPicker] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPreference, setContactPreference] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [createdCode, setCreatedCode] = useState("");

  const stepIndex = steps.findIndex((item) => item.id === step);
  const provinceOptions = useMemo(
    () => regionProvinceOptions.find((item) => item.region === brief.region)?.provinces ?? [],
    [brief.region]
  );
  const briefComplete = Boolean(brief.eventType && brief.region && brief.province && brief.guestsCount && brief.totalBudget && brief.eventPeriod);
  const suppliersComplete = suppliers.every((supplier) => supplier.subcategories.length && supplier.budgetRange && supplier.duration && noteIsValid(supplier.notes));
  const estimatedBudget = suppliers.reduce((total, supplier) => total + (parseBudgetAmount(supplier.budgetRange) ?? 0), 0);

  function updateBrief(update: Partial<EventBrief>) {
    setBrief((current) => ({ ...current, ...update }));
  }

  function updateSupplier(id: number, update: Partial<SupplierDraft>) {
    setSuppliers((current) => current.map((supplier) => (supplier.id === id ? { ...supplier, ...update } : supplier)));
  }

  function addSupplier(categorySlug: string) {
    setSuppliers((current) => [...current, createSupplier(Math.max(...current.map((item) => item.id)) + 1, categorySlug)]);
    setShowSupplierPicker(false);
    setStep("suppliers");
  }

  function removeSupplier(id: number) {
    setSuppliers((current) => (current.length > 1 ? current.filter((supplier) => supplier.id !== id) : current));
  }

  function nextStep() {
    const next = steps[Math.min(stepIndex + 1, steps.length - 1)];
    setStep(next.id);
  }

  function previousStep() {
    const previous = steps[Math.max(stepIndex - 1, 0)];
    setStep(previous.id);
  }

  function sendOtp() {
    if (!firstName.trim() || !email.includes("@") || phone.replace(/\D/g, "").length < 8 || !contactPreference) return;
    setOtpSent(true);
    setOtpVerified(false);
    setOtpCode("");
  }

  function verifyOtp() {
    if (otpCode.trim() === "123456") setOtpVerified(true);
  }

  async function submitRequest() {
    if (!briefComplete || !suppliersComplete || !otpVerified || !privacyAccepted || submitState === "sending") return;
    setSubmitState("sending");
    setCreatedCode("");

    try {
      const response = await fetch("/api/leads/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          contactPreference,
          eventType: brief.eventType,
          region: brief.region,
          province: brief.province,
          cityOrArea: brief.cityOrArea,
          guestsCount: brief.guestsCount,
          eventDate: brief.eventPeriod,
          eventPeriod: brief.eventPeriod,
          totalBudgetRange: brief.totalBudget,
          requestType: "lead_interno",
          source: "organizzaevento",
          sourcePath: "/richiesta-fornitori",
          otpVerified: true,
          privacyAccepted,
          categories: suppliers.map((supplier) => {
            const category = categoryBySlug(supplier.categorySlug);
            return {
              macroCategory: category.label,
              category: supplier.subcategories[0] ?? category.label,
              supplierProfile: supplier.subcategories.join(", "),
              budgetRange: supplier.budgetRange,
              duration: supplier.duration,
              subcategories: supplier.subcategories,
              services: category.slug === "musica" ? [...supplier.musicFormation, ...supplier.musicGenres] : supplier.services,
              musicFormation: supplier.musicFormation,
              musicGenres: supplier.musicGenres,
              notes: supplier.notes
            };
          })
        })
      });
      const data = (await response.json()) as { ok?: boolean; requestCode?: string };
      if (!response.ok || !data.ok) throw new Error("request_failed");
      setCreatedCode(data.requestCode ?? "");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <section className="overflow-hidden rounded-md border border-line bg-white shadow-soft">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">Richiesta fornitori</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Raccontaci l'evento, poi scegli chi vuoi trovare.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                Compili pochi passaggi: evento, fornitori, budget, note e contatto verificato. La richiesta arriva già ordinata.
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {steps.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={`min-h-11 rounded-md border px-3 py-2 text-xs font-bold transition ${
                    step === item.id ? "border-violet-cta bg-violet-cta text-white" : "border-line bg-cream text-ink hover:bg-petal"
                  }`}
                >
                  {index + 1}. {item.label}
                </button>
              ))}
            </div>
          </div>

          {step === "brief" ? (
            <div className="mt-6">
              <div className="rounded-md border border-line bg-petal p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">Step 1</p>
                    <h3 className="mt-2 text-2xl font-semibold text-ink">Brief evento</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">Questi dati restano attivi per tutti i fornitori che cerchi.</p>
                  </div>
                  <span className="rounded-md bg-white px-3 py-2 text-xs font-bold text-muted">Zona evento opzionale</span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <label>
                    <FieldLabel>Tipo evento *</FieldLabel>
                    <select value={brief.eventType} onChange={(event) => updateBrief({ eventType: event.target.value })} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink">
                      {COMMON_EVENT_TYPES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <FieldLabel>Regione *</FieldLabel>
                    <select value={brief.region} onChange={(event) => updateBrief({ region: event.target.value, province: "" })} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink">
                      <option value="">Scegli regione</option>
                      {regionProvinceOptions.map((item) => (
                        <option key={item.region} value={item.region}>{item.region}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <FieldLabel>Provincia *</FieldLabel>
                    <select value={brief.province} onChange={(event) => updateBrief({ province: event.target.value })} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink">
                      <option value="">Scegli provincia</option>
                      {provinceOptions.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <FieldLabel>Zona evento</FieldLabel>
                    <input value={brief.cityOrArea} onChange={(event) => updateBrief({ cityOrArea: event.target.value })} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink" placeholder="Es. centro, via, zona mare" />
                  </label>
                  <label>
                    <FieldLabel>Numero invitati *</FieldLabel>
                    <input value={brief.guestsCount} onChange={(event) => updateBrief({ guestsCount: event.target.value.replace(/[^\d]/g, "") })} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink" placeholder="Es. 120" inputMode="numeric" />
                  </label>
                  <label>
                    <FieldLabel>Budget massimo complessivo *</FieldLabel>
                    <select value={brief.totalBudget} onChange={(event) => updateBrief({ totalBudget: event.target.value })} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink">
                      {totalBudgets.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="md:col-span-2 xl:col-span-3">
                    <FieldLabel>Data o periodo *</FieldLabel>
                    <input value={brief.eventPeriod} onChange={(event) => updateBrief({ eventPeriod: event.target.value })} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink" placeholder="Es. 12 settembre 2026, luglio 2027 o ancora da definire" />
                  </label>
                </div>
              </div>
            </div>
          ) : null}

          {step === "suppliers" ? (
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">Step 2</p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">Trova il fornitore o i fornitori che ti servono</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Ogni blocco ha budget, sottocategorie e note proprie. Le note sono obbligatorie e devono avere almeno 30 caratteri.
                </p>
              </div>
              {suppliers.map((supplier, index) => {
                const category = categoryBySlug(supplier.categorySlug);
                const services = serviceOptions(category).slice(0, 10);
                const budgetOptions = categoryBudgetOptions(category);
                const duration = durationOptions(category);
                const isMusic = category.slug === "musica";
                const shownGenres = supplier.showMoreMusic ? musicGenres : musicGenres.slice(0, 5);

                return (
                  <article key={supplier.id} className="rounded-md border border-line bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">{index + 1}</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">Fornitore</p>
                          <h4 className="mt-1 text-2xl font-semibold text-ink">{category.label}</h4>
                          <p className="mt-1 text-sm leading-6 text-muted">Scegli sottocategorie, budget e note. Puoi cambiare categoria se serve.</p>
                        </div>
                      </div>
                      {suppliers.length > 1 ? (
                        <button type="button" onClick={() => removeSupplier(supplier.id)} className="focus-ring rounded-md border border-line bg-cream px-3 py-2 text-xs font-bold text-muted hover:bg-petal">
                          Rimuovi
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-3">
                      <label>
                        <FieldLabel>Categoria *</FieldLabel>
                        <select
                          value={supplier.categorySlug}
                          onChange={(event) => updateSupplier(supplier.id, createSupplier(supplier.id, event.target.value))}
                          className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink"
                        >
                          {VIBES_TAXONOMY.map((item) => (
                            <option key={item.slug} value={item.slug}>{item.label}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <FieldLabel>Budget per questo fornitore *</FieldLabel>
                        <select value={supplier.budgetRange} onChange={(event) => updateSupplier(supplier.id, { budgetRange: event.target.value })} className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink">
                          {budgetOptions.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <FieldLabel>Durata *</FieldLabel>
                        <select value={supplier.duration} onChange={(event) => updateSupplier(supplier.id, { duration: event.target.value })} className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink">
                          {duration.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="mt-4 rounded-md border border-line bg-petal p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-ink">Sottocategorie *</p>
                          <p className="mt-1 text-xs leading-5 text-muted">Apri la lista e spunta le voci: vengono salvate subito.</p>
                        </div>
                        <button type="button" onClick={() => updateSupplier(supplier.id, { showSubcategoryMenu: !supplier.showSubcategoryMenu })} className="focus-ring flex min-h-10 items-center justify-center rounded-md bg-violet-cta px-4 text-sm font-bold leading-none text-white">
                          {supplier.showSubcategoryMenu ? "Nascondi lista" : "+ Scegli"}
                        </button>
                      </div>
                      {supplier.subcategories.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {supplier.subcategories.map((item) => (
                            <span key={item} className="rounded-md bg-violet-cta px-3 py-2 text-xs font-bold text-white">{item}</span>
                          ))}
                        </div>
                      ) : null}
                      {supplier.showSubcategoryMenu ? (
                        <div className="mt-3 max-h-72 overflow-y-auto rounded-md border border-line bg-white p-3">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {category.subcategories.map((item) => (
                              <label key={item} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${supplier.subcategories.includes(item) ? "border-violet-cta bg-petal text-violet-cta" : "border-line bg-cream text-ink"}`}>
                                <input type="checkbox" checked={supplier.subcategories.includes(item)} onChange={() => updateSupplier(supplier.id, { subcategories: toggleValue(item, supplier.subcategories) })} className="h-4 w-4 accent-[#C9567B]" />
                                {item}
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {isMusic ? (
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-md border border-line bg-white p-4">
                          <p className="text-sm font-bold text-ink">Formazione live</p>
                          <p className="mt-1 text-xs leading-5 text-muted">Compare per musicisti, cantanti e band. Non serve per il solo DJ.</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {musicFormations.map((item) => (
                              <Chip key={item} selected={supplier.musicFormation.includes(item)} onClick={() => updateSupplier(supplier.id, { musicFormation: toggleValue(item, supplier.musicFormation) })}>
                                {item}
                              </Chip>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-md border border-line bg-white p-4">
                          <p className="text-sm font-bold text-ink">Generi musicali</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {shownGenres.map((item) => (
                              <Chip key={item} selected={supplier.musicGenres.includes(item)} onClick={() => updateSupplier(supplier.id, { musicGenres: toggleValue(item, supplier.musicGenres) })}>
                                {item}
                              </Chip>
                            ))}
                          </div>
                          <button type="button" onClick={() => updateSupplier(supplier.id, { showMoreMusic: !supplier.showMoreMusic })} className="focus-ring mt-3 rounded-md border border-line bg-petal px-3 py-2 text-xs font-bold text-violet-cta">
                            {supplier.showMoreMusic ? "Mostra meno" : "+ Vedi più generi"}
                          </button>
                        </div>
                      </div>
                    ) : services.length ? (
                      <div className="mt-4 rounded-md border border-line bg-white p-4">
                        <p className="text-sm font-bold text-ink">Servizi utili per {category.label}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {services.map((item) => (
                            <Chip key={item} selected={supplier.services.includes(item)} onClick={() => updateSupplier(supplier.id, { services: toggleValue(item, supplier.services, 6) })}>
                              {item}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <label className="mt-4 block">
                      <FieldLabel>Note per {category.label} * <span className="text-xs text-muted">(minimo 30 caratteri)</span></FieldLabel>
                      <textarea
                        value={supplier.notes}
                        onChange={(event) => updateSupplier(supplier.id, { notes: event.target.value })}
                        rows={4}
                        className={`focus-ring mt-2 w-full rounded-md border bg-cream px-4 py-3 text-sm leading-6 text-ink ${noteIsValid(supplier.notes) ? "border-line" : "border-[#E7B8C8]"}`}
                        placeholder="Scrivi cosa ti serve, stile, vincoli, orari o preferenze. Non inserire dati sensibili."
                      />
                      <span className="mt-1 block text-xs font-semibold text-muted">{supplier.notes.trim().length}/30 caratteri</span>
                    </label>
                  </article>
                );
              })}

              <div className="rounded-md border border-line bg-petal p-4">
                <h4 className="text-lg font-semibold text-ink">Ti serve un altro fornitore?</h4>
                <p className="mt-1 text-sm leading-6 text-muted">Apri il menu e scegli la prossima categoria. Il brief evento resta già compilato.</p>
                <button type="button" onClick={() => setShowSupplierPicker((current) => !current)} className="focus-ring mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-violet-cta px-5 py-3 text-sm font-bold text-white">
                  + Trova un altro fornitore
                </button>
                {showSupplierPicker ? (
                  <div className="mt-4 grid gap-2 rounded-md border border-line bg-white p-3 sm:grid-cols-2 lg:grid-cols-3">
                    {VIBES_TAXONOMY.map((category) => (
                      <button key={category.slug} type="button" onClick={() => addSupplier(category.slug)} className="focus-ring rounded-md border border-line bg-cream p-3 text-left text-sm font-bold text-ink hover:border-violet-cta hover:bg-petal">
                        {category.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "review" ? (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">Step 3</p>
              <h3 className="mt-2 text-2xl font-semibold text-ink">Controlla prima dell'invio</h3>
              <p className="mt-2 text-sm leading-6 text-muted">Prima della verifica contatto mostriamo cosa sta cercando la persona, con budget e sottocategorie per ogni fornitore.</p>
              <div className="mt-5 grid gap-4">
                {suppliers.map((supplier) => {
                  const category = categoryBySlug(supplier.categorySlug);
                  return (
                    <article key={supplier.id} className="rounded-md border border-line bg-cream p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-cta">{category.label}</p>
                          <h4 className="mt-1 text-lg font-semibold text-ink">{supplier.budgetRange}</h4>
                        </div>
                        <span className={`rounded-md px-3 py-2 text-xs font-bold ${noteIsValid(supplier.notes) && supplier.subcategories.length ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                          {noteIsValid(supplier.notes) && supplier.subcategories.length ? "Completo" : "Da completare"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">Sottocategorie: {supplier.subcategories.join(", ") || "da scegliere"}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">Durata: {supplier.duration}</p>
                      <p className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-ink">{supplier.notes || "Note ancora da compilare."}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === "contact" ? (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">Step 4</p>
              <h3 className="mt-2 text-2xl font-semibold text-ink">Verifica contatto</h3>
              <p className="mt-2 text-sm leading-6 text-muted">Nome, email, telefono e fascia oraria servono per far contattare il cliente nel momento giusto.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label>
                  <FieldLabel>Nome *</FieldLabel>
                  <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink" />
                </label>
                <label>
                  <FieldLabel>Cognome</FieldLabel>
                  <input value={lastName} onChange={(event) => setLastName(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink" />
                </label>
                <label>
                  <FieldLabel>Email *</FieldLabel>
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink" placeholder="nome@email.it" />
                </label>
                <label>
                  <FieldLabel>Telefono *</FieldLabel>
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink" placeholder="+39 ..." />
                </label>
                <label className="md:col-span-2">
                  <FieldLabel>Preferenza oraria contatto *</FieldLabel>
                  <select value={contactPreference} onChange={(event) => setContactPreference(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink">
                    <option value="">Scegli fascia oraria</option>
                    {contactPreferences.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-5 rounded-md border border-line bg-petal p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-ink">Conferma OTP</p>
                    <p className="mt-1 text-xs leading-5 text-muted">Demo locale: dopo il click usa il codice 123456. In produzione si colleghera al servizio SMS.</p>
                  </div>
                  <button type="button" onClick={sendOtp} className="focus-ring rounded-md bg-ink px-4 py-3 text-sm font-bold text-white">
                    Invia codice OTP
                  </button>
                </div>
                {otpSent ? (
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input value={otpCode} onChange={(event) => setOtpCode(event.target.value)} className="focus-ring min-h-12 flex-1 rounded-md border border-line bg-white px-4 text-sm text-ink" placeholder="Inserisci codice" inputMode="numeric" />
                    <button type="button" onClick={verifyOtp} className="focus-ring rounded-md bg-violet-cta px-5 py-3 text-sm font-bold text-white">
                      Verifica
                    </button>
                  </div>
                ) : null}
                {otpVerified ? <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">Contatto verificato.</p> : null}
              </div>

              <label className="mt-5 flex gap-3 rounded-md border border-line bg-cream p-4 text-sm leading-6 text-muted">
                <input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-[#C9567B]" />
                <span>Accetto privacy e condizioni. I dati verranno usati per gestire questa richiesta e far contattare il cliente dai fornitori più in target.</span>
              </label>

              {submitState === "success" ? (
                <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-900">
                  Richiesta salvata correttamente. Codice: {createdCode}
                </div>
              ) : null}
              {submitState === "error" ? (
                <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
                  Non siamo riusciti a salvare la richiesta. Controlla i dati e riprova.
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={previousStep} disabled={stepIndex === 0} className="focus-ring min-h-11 rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-40">
              Indietro
            </button>
            {step !== "contact" ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={(step === "brief" && !briefComplete) || (step === "suppliers" && !suppliersComplete)}
                className="focus-ring min-h-11 rounded-md bg-violet-cta px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continua
              </button>
            ) : (
              <button
                type="button"
                onClick={submitRequest}
                disabled={!otpVerified || !privacyAccepted || submitState === "sending"}
                className="focus-ring min-h-11 rounded-md bg-violet-cta px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitState === "sending" ? "Invio in corso..." : "Invia richiesta"}
              </button>
            )}
          </div>
        </div>

        <aside className="border-t border-line bg-[#FFF8FB] p-4 sm:p-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">Resoconto</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">{suppliers.length} fornitori richiesti</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Budget per categoria e contatto restano separati, così la dashboard è più leggibile.</p>
          <div className="mt-5 space-y-3">
            <article className="rounded-md border border-line bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Evento</p>
              <p className="mt-2 text-sm font-semibold text-ink">{brief.eventType}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{[brief.province, brief.region].filter(Boolean).join(", ") || "Luogo da completare"}</p>
            </article>
            {suppliers.map((supplier) => {
              const category = categoryBySlug(supplier.categorySlug);
              return (
                <article key={supplier.id} className="rounded-md border border-line bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-cta">{category.label}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{supplier.budgetRange}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{supplier.subcategories.join(", ") || "Sottocategorie da scegliere"}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-5 rounded-md bg-ink p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Totale budget fornitori</p>
            <p className="mt-2 text-3xl font-semibold">{formatEuro(estimatedBudget || null)}</p>
            <p className="mt-3 text-xs leading-5 text-white/70">Budget massimo evento: {brief.totalBudget}. Il valore è indicativo.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
