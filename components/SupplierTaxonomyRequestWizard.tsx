"use client";

import { useEffect, useMemo, useState } from "react";
import { VIBES_PLANNER_CLIENT_REQUEST_URL } from "@/lib/constants";
import type { VibesSupplierCard } from "@/lib/vibes-suppliers";
import { VIBES_TAXONOMY, type VibesTaxonomyCategory } from "@/lib/vibes-taxonomy";

const budgetFallback = ["Da definire", "Da concordare", "Fino a 1.500 euro", "1.500 - 3.000 euro", "3.000 - 5.000 euro", "Oltre 5.000 euro"];
const totalBudgetFallback = ["Da definire", "Fino a 5.000 euro", "5.000 - 10.000 euro", "10.000 - 20.000 euro", "20.000 - 40.000 euro", "Oltre 40.000 euro"];
const durationFallback = ["Da definire", "1-2 ore", "Mezza giornata", "Giornata intera", "Serata completa", "Più giorni"];
const musicFormations = ["DJ", "Duo", "Trio", "Band", "Solista", "Orchestra"];
const musicTalentTypes = ["DJ", "Violinista", "Pianista", "Sassofonista", "Cantante", "Chitarrista", "Vocalist", "Percussionista"];
const mainMusicGenres = ["Commerciale", "Dance", "House", "Latino", "Reggaeton", "Pop italiano", "Anni 80/90", "Jazz", "Swing", "Rock"];
const moreMusicGenres = ["Soul", "Funk", "Classica", "Acustica", "Bossa nova", "Tango", "R&B", "Blues", "Colonne sonore", "World & ethnic"];
const preferredCategoryOrder = ["location", "musica", "event-planner", "catering-e-gastronomia", "fotografi-e-videomaker"];
const starterCategorySlugs = ["location", "musica", "event-planner", "catering-e-gastronomia", "fotografi-e-videomaker"];
const maxVisibleServiceOptions = 8;
const maxSelectedServices = 6;
const maxVisibleSubcategories = 10;

type EventBrief = {
  eventType: string;
  address: string;
  province: string;
  guestCount: string;
  totalBudget: string;
  eventDate: string;
};

type SupplierStep = {
  id: number;
  categorySlug: string;
  subcategories: string[];
  categoryBudget: string;
  duration: string;
  services: string[];
  styles: string[];
  formations: string[];
  talents: string[];
  genres: string[];
  showMoreGenres: boolean;
  showMoreSubcategories: boolean;
  notes: string;
};

type SupplierSeed = {
  name: string;
  meta: string;
  score: string;
  note: string;
  imageUrl?: string | null;
  url?: string;
  premium?: boolean;
};

type LiveSearchState = {
  status: "idle" | "loading" | "ready" | "error";
  results: VibesSupplierCard[];
};

type SupplierTaxonomyRequestWizardProps = {
  initialCategorySlug?: string;
};

function optionList(category: VibesTaxonomyCategory, key: keyof VibesTaxonomyCategory["filters"], fallback: string[]) {
  return category.filters[key] && category.filters[key]!.length > 0 ? category.filters[key]! : fallback;
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function budgetList(category: VibesTaxonomyCategory) {
  const options = optionList(category, "budget", budgetFallback);
  return options.includes("Da definire") ? options : ["Da definire", ...options];
}

function categoryBySlug(slug: string) {
  return VIBES_TAXONOMY.find((item) => item.slug === slug) ?? VIBES_TAXONOMY[0];
}

function firstOption(category: VibesTaxonomyCategory, key: keyof VibesTaxonomyCategory["filters"], fallback: string[]) {
  return optionList(category, key, fallback)[0] ?? "";
}

function serviceOptionsForCategory(category: VibesTaxonomyCategory) {
  const options = uniqueValues([
    ...(category.filters.serviziInclusi ?? []),
    ...(category.filters.spazi ?? []),
    ...(category.filters.cucina ?? []),
    ...(category.filters.extraTecnici ?? []),
    ...(category.filters.logistica ?? []),
    ...(category.filters.modalitaLavoro ?? []),
    ...(category.filters.target ?? []),
    ...(category.filters.sostenibilita ?? [])
  ]);

  if (options.length) return options.slice(0, maxVisibleServiceOptions);
  return ["Consulenza", "Sopralluogo", "Consegna", "Allestimento", "Assistenza", "Personalizzazione"];
}

function createStep(id: number, categorySlug: string): SupplierStep {
  const category = categoryBySlug(categorySlug);
  const serviceOptions = serviceOptionsForCategory(category);

  return {
    id,
    categorySlug,
    subcategories: [],
    categoryBudget: "Da definire",
    duration: firstOption(category, "durata", durationFallback),
    services: category.slug === "musica" ? [] : serviceOptions.slice(0, Math.min(2, serviceOptions.length)),
    styles: optionList(category, "stile", []).slice(0, 1),
    formations: category.slug === "musica" ? ["DJ"] : [],
    talents: category.slug === "musica" ? ["Sassofonista"] : [],
    genres: category.slug === "musica" ? ["Jazz"] : [],
    showMoreGenres: false,
    showMoreSubcategories: false,
    notes: ""
  };
}

function toggleValue(value: string, current: string[], max?: number) {
  if (current.includes(value)) return current.filter((item) => item !== value);
  const next = [...current, value];
  return typeof max === "number" ? next.slice(0, max) : next;
}

function summarize(values: string[], fallback: string) {
  return values.length > 0 ? values.slice(0, 8).join(", ") : fallback;
}

function budgetNumber(value: string, guestCount?: string) {
  const normalized = value.toLowerCase();
  if (!value || normalized.includes("definire") || normalized.includes("concordare") || normalized.includes("riservata") || normalized.includes("tariffa")) {
    return null;
  }

  const numbers = [...value.matchAll(/\d+(?:[.,]\d+)?/g)].map((match) => Number(match[0].replace(/\./g, "").replace(",", ".")));
  if (!numbers.length) return null;

  const amount = normalized.includes("fino") ? numbers[0] : numbers[numbers.length - 1];
  const guests = Number((guestCount || "").replace(/\D/g, ""));
  if (normalized.includes("persona") && Number.isFinite(guests) && guests > 0) return Math.round(amount * guests);
  return amount;
}

function formatEuro(value: number | null) {
  if (value === null) return "Da definire";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function scoreFromLiveSupplier(supplier: VibesSupplierCard, index: number, isLocation: boolean) {
  const scoreBoost = Math.min(1.35, Math.max(0, supplier.score) / 3200);
  const premiumBoost = supplier.premium ? 0.18 : 0;
  const distanceBoost = isLocation && typeof supplier.distanceKm === "number" && supplier.distanceKm <= 25 ? 0.18 : 0;
  const rankPenalty = index * 0.06;
  const score = Math.max(7.1, Math.min(9.9, 8.2 + scoreBoost + premiumBoost + distanceBoost - rankPenalty));
  return `${score.toFixed(1)}/10`;
}

function liveSupplierNote(supplier: VibesSupplierCard, isLocation: boolean) {
  if (typeof supplier.distanceKm === "number") {
    return `Ordinato per distanza e compatibilità. Distanza stimata: ${supplier.distanceKm.toFixed(1)} km.`;
  }
  if (supplier.serviceArea === "italy") return "Lavora in tutta Italia: utile quando non serve una sede vicinissima.";
  if (supplier.services.length) return `Match basato su ${supplier.services.slice(0, 3).join(", ")} e profilo Vibes Planner.`;
  return isLocation ? "Match calcolato su categoria, sottocategorie e zona evento." : "Match calcolato su categoria, servizi richiesti e copertura dichiarata.";
}

function liveSupplierToSeed(supplier: VibesSupplierCard, index: number, isLocation: boolean): SupplierSeed {
  return {
    name: supplier.name,
    meta: supplier.serviceAreaLabel || supplier.location || "Scheda Vibes Planner",
    score: scoreFromLiveSupplier(supplier, index, isLocation),
    note: liveSupplierNote(supplier, isLocation),
    imageUrl: supplier.imageUrl,
    url: supplier.vibesUrl,
    premium: supplier.premium
  };
}

function buildLiveSupplierQuery(step: SupplierStep, category: VibesTaxonomyCategory, eventBrief: EventBrief) {
  const details =
    category.slug === "musica"
      ? [...step.formations, ...step.talents, ...step.genres]
      : [...step.services, ...step.styles];
  return [
    category.label,
    ...step.subcategories,
    step.categoryBudget,
    step.duration,
    eventBrief.address,
    eventBrief.province,
    eventBrief.guestCount ? `${eventBrief.guestCount} invitati` : "",
    ...details,
    step.notes
  ]
    .filter(Boolean)
    .join(" ");
}

function SupplierCard({ supplier, recommended, isLocation }: { supplier: SupplierSeed; recommended: boolean; isLocation: boolean }) {
  return (
    <article
      className={`flex min-h-[360px] min-w-[272px] snap-start flex-col rounded-md border bg-white p-4 shadow-sm sm:min-w-[292px] xl:min-w-[31%] ${
        recommended ? "border-violet-cta shadow-[0_14px_30px_rgba(201,86,123,0.16)]" : "border-line"
      }`}
    >
      <div className={`relative h-32 overflow-hidden rounded-md ${recommended ? "bg-blush" : "bg-petal"}`}>
        {supplier.imageUrl ? (
          <img src={supplier.imageUrl} alt={supplier.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute right-3 top-3 rounded-md bg-ink px-2.5 py-1 text-xs font-bold text-white">{supplier.score}</div>
        {supplier.premium ? (
          <span className="absolute bottom-2 left-2 rounded-md bg-violet-cta px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
            Premium
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base font-bold leading-snug text-ink">{supplier.name}</h4>
          {recommended ? <span className="rounded-md bg-petal px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-cta">Consigliato</span> : null}
        </div>
        <p className="mt-2 text-xs font-semibold text-muted">{supplier.meta}</p>
        <p className="mt-2 text-xs leading-5 text-muted">{supplier.note}</p>
        <p className="mt-2 text-[11px] font-semibold text-muted">
          {isLocation ? "Voto basato su distanza, categoria e richiesta." : "Voto basato su match AI e copertura del servizio."}
        </p>
        <a
          href={supplier.url ?? VIBES_PLANNER_CLIENT_REQUEST_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-md px-3 py-2 text-sm font-bold transition ${
            recommended ? "bg-violet-cta text-white hover:bg-violet-hover" : "border border-line bg-cream text-ink hover:bg-petal"
          }`}
        >
          Preventivo gratuito
        </a>
      </div>
    </article>
  );
}

function ChipGroup({
  items,
  selected,
  onToggle,
  max
}: {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isSelected = selected.includes(item);
        const isDisabled = !isSelected && typeof max === "number" && selected.length >= max;
        return (
          <button
            key={item}
            type="button"
            disabled={isDisabled}
            onClick={() => onToggle(item)}
            className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
              isSelected
                ? "border-violet-cta bg-violet-cta text-white"
                : isDisabled
                  ? "cursor-not-allowed border-line bg-white text-muted/60"
                  : "border-line bg-cream text-ink hover:border-violet-cta hover:bg-white"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

export function SupplierTaxonomyRequestWizard({ initialCategorySlug = "location" }: SupplierTaxonomyRequestWizardProps) {
  const normalizedInitialCategorySlug = VIBES_TAXONOMY.some((item) => item.slug === initialCategorySlug)
    ? initialCategorySlug
    : "location";
  const [eventBrief, setEventBrief] = useState<EventBrief>({
    eventType: "Matrimonio",
    address: "",
    province: "",
    guestCount: "",
    totalBudget: "Da definire",
    eventDate: ""
  });
  const [steps, setSteps] = useState<SupplierStep[]>([createStep(1, normalizedInitialCategorySlug)]);
  const [liveSearches, setLiveSearches] = useState<Record<number, LiveSearchState>>({});
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);

  useEffect(() => {
    setSteps([createStep(1, normalizedInitialCategorySlug)]);
    setLiveSearches({});
  }, [normalizedInitialCategorySlug]);

  const baseCategory = categoryBySlug(steps[0]?.categorySlug ?? "location");
  const eventOptions = optionList(baseCategory, "tipoEvento", []);

  const completedBriefFields = [eventBrief.eventType, eventBrief.address || eventBrief.province, eventBrief.guestCount, eventBrief.totalBudget].filter(Boolean).length;
  const completionPercent = Math.round((completedBriefFields / 4) * 100);

  const budgetRows = useMemo(
    () =>
      steps.map((step) => {
        const category = categoryBySlug(step.categorySlug);
        const amount = budgetNumber(step.categoryBudget, eventBrief.guestCount);
        return {
          id: step.id,
          category: category.label,
          subcategories: step.subcategories,
          label: step.categoryBudget,
          amount,
          resultCount: liveSearches[step.id]?.results.length ?? 0
        };
      }),
    [eventBrief.guestCount, liveSearches, steps]
  );
  const estimatedSupplierBudget = budgetRows.reduce((total, row) => total + (row.amount ?? 0), 0);
  const eventBudgetLimit = budgetNumber(eventBrief.totalBudget, eventBrief.guestCount);
  const isOverBudget = eventBudgetLimit !== null && estimatedSupplierBudget > eventBudgetLimit;
  const totalSupplierCards = Object.values(liveSearches).reduce((total, search) => total + search.results.length, 0);

  useEffect(() => {
    setShowBudgetWarning(isOverBudget);
  }, [isOverBudget, estimatedSupplierBudget, eventBudgetLimit]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      const searches = steps.map(async (step) => {
        const category = categoryBySlug(step.categorySlug);
        const isSearchReady = Boolean(step.categorySlug && step.subcategories.length);

        if (!isSearchReady) {
          setLiveSearches((current) => ({
            ...current,
            [step.id]: { status: "idle", results: [] }
          }));
          return;
        }

        const params = new URLSearchParams({
          locale: "it",
          category: step.categorySlug,
          subcategory: step.subcategories.join(", "),
          eventType: eventBrief.eventType,
          province: eventBrief.address || eventBrief.province,
          query: buildLiveSupplierQuery(step, category, eventBrief)
        });

        setLiveSearches((current) => ({
          ...current,
          [step.id]: {
            status: "loading",
            results: current[step.id]?.results ?? []
          }
        }));

        try {
          const response = await fetch(`/api/vibes-suppliers/search?${params.toString()}`, {
            cache: "no-store",
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache"
            },
            signal: controller.signal
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = (await response.json()) as { ok?: boolean; results?: VibesSupplierCard[] };
          setLiveSearches((current) => ({
            ...current,
            [step.id]: {
              status: "ready",
              results: data.ok ? (data.results ?? []).slice(0, 100) : []
            }
          }));
        } catch {
          if (controller.signal.aborted) return;
          setLiveSearches((current) => ({
            ...current,
            [step.id]: {
              status: "error",
              results: current[step.id]?.results ?? []
            }
          }));
        }
      });

      void Promise.all(searches);
    }, 650);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [eventBrief, steps]);

  function updateBrief(patch: Partial<EventBrief>) {
    setEventBrief((current) => ({ ...current, ...patch }));
  }

  function updateStep(id: number, patch: Partial<SupplierStep>) {
    setSteps((current) => current.map((step) => (step.id === id ? { ...step, ...patch } : step)));
  }

  function changeCategory(id: number, categorySlug: string) {
    setSteps((current) => current.map((step) => (step.id === id ? { ...createStep(step.id, categorySlug) } : step)));
  }

  function startFromCategory(categorySlug: string) {
    setSteps((current) => {
      const [first, ...rest] = current;
      const firstId = first?.id ?? 1;
      return [{ ...createStep(firstId, categorySlug) }, ...rest.filter((step) => step.categorySlug !== categorySlug)];
    });
  }

  function addSupplier() {
    const used = new Set(steps.map((step) => step.categorySlug));
    const nextSlug = preferredCategoryOrder.find((slug) => !used.has(slug)) ?? VIBES_TAXONOMY.find((item) => !used.has(item.slug))?.slug ?? "location";
    const nextId = Math.max(...steps.map((step) => step.id)) + 1;
    setSteps((current) => [...current, createStep(nextId, nextSlug)]);
  }

  function removeSupplier(id: number) {
    if (steps.length === 1) return;
    setSteps((current) => current.filter((step) => step.id !== id));
  }

  return (
    <section className="overflow-hidden rounded-md border border-line bg-white shadow-soft">
      {showBudgetWarning ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 p-4">
          <div className="w-full max-w-md rounded-md border border-line bg-white p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-cta">Budget da controllare</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Le richieste potrebbero sforare il budget.</h3>
            <p className="mt-3 text-sm leading-7 text-muted">
              La somma dei budget indicativi per i singoli fornitori è superiore al budget massimo complessivo. Puoi
              correggere un budget di categoria o lasciare una voce “Da definire” se vuoi valutarla dopo.
            </p>
            <button
              type="button"
              onClick={() => setShowBudgetWarning(false)}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-violet-cta px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-hover"
            >
              Ho capito
            </button>
          </div>
        </div>
      ) : null}

      <div className="border-b border-line bg-petal/70 px-5 py-6 sm:px-7 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-cta">Booking fornitori</p>
        <div className="mt-4 grid gap-5 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <div>
            <h2 className="max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Prenota uno o più fornitori senza riscrivere ogni volta gli stessi dati.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Scegli da quale categoria partire. La ricerca si attiva dopo categoria e sottocategoria, poi si affina con
              via, invitati, budget del singolo fornitore, servizi e note.
            </p>
          </div>

          <div className="rounded-md border border-line bg-white p-4 xl:mt-1">
            <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <span>Brief evento</span>
              <span className="text-violet-cta">{completedBriefFields}/4</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream">
              <div className="h-full rounded-full bg-violet-cta transition-all" style={{ width: `${completionPercent}%` }} />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">
              {completedBriefFields >= 3 ? "La ricerca può già affinare i fornitori in base al tuo evento." : "Completa invitati, via/zona e budget per migliorare il match."}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-white p-4 sm:p-6 lg:p-8">
        <div className="rounded-md border border-line bg-cream p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Campi sempre attivi</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Brief evento</h3>
            </div>
            <span className="rounded-md bg-white px-3 py-2 text-xs font-bold text-muted">Si applica a tutte le categorie</span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Tipo evento</span>
              <select
                value={eventBrief.eventType}
                onChange={(event) => updateBrief({ eventType: event.target.value })}
                className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
              >
                <option value="">Scegli evento</option>
                {eventOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Via o zona evento</span>
              <input
                value={eventBrief.address}
                onChange={(event) => updateBrief({ address: event.target.value })}
                className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                placeholder="Es. Via Roma 10, Ancona"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Provincia o città</span>
              <input
                value={eventBrief.province}
                onChange={(event) => updateBrief({ province: event.target.value })}
                className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                placeholder="Es. Ancona"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Numero invitati</span>
              <input
                value={eventBrief.guestCount}
                onChange={(event) => updateBrief({ guestCount: event.target.value })}
                inputMode="numeric"
                className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                placeholder="Es. 120"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Budget massimo complessivo</span>
              <select
                value={eventBrief.totalBudget}
                onChange={(event) => updateBrief({ totalBudget: event.target.value })}
                className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
              >
                {totalBudgetFallback.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Data o periodo</span>
              <input
                value={eventBrief.eventDate}
                onChange={(event) => updateBrief({ eventDate: event.target.value })}
                className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                placeholder="Es. settembre 2026"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-[#FFFDF7] p-4 sm:p-6 lg:p-8">
        <div className="rounded-md border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Partenza libera</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Da chi vuoi iniziare</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                Puoi partire da una categoria principale oppure scegliere una delle altre categorie Vibes Planner.
              </p>
            </div>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Altre categorie</span>
              <select
                value={steps[0]?.categorySlug ?? "location"}
                onChange={(event) => startFromCategory(event.target.value)}
                className="mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
              >
                {VIBES_TAXONOMY.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {starterCategorySlugs.map((slug) => {
              const item = categoryBySlug(slug);
              const isActive = steps[0].categorySlug === slug;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => startFromCategory(slug)}
                  className={`min-h-[78px] rounded-md border px-4 py-3 text-left text-sm font-bold leading-snug transition ${
                    isActive
                      ? "border-violet-cta bg-violet-cta text-white shadow-soft"
                      : "border-line bg-cream text-ink hover:border-violet-cta hover:bg-petal"
                  }`}
                >
                  {item.label}
                  <span className={`mt-1 block text-xs font-semibold ${isActive ? "text-white/75" : "text-muted"}`}>
                    {isActive ? "Inizio selezionato" : "Inizia da qui"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5 bg-[#FFFDF7] p-4 sm:p-6 lg:p-8">
          {steps.map((step, index) => {
            const category = categoryBySlug(step.categorySlug);
            const isMusic = category.slug === "musica";
            const budgetOptions = budgetList(category);
            const durationOptions = optionList(category, "durata", durationFallback);
            const styleOptions = optionList(category, "stile", []);
            const serviceOptions = serviceOptionsForCategory(category);
            const visibleSubcategories = step.showMoreSubcategories ? category.subcategories : category.subcategories.slice(0, maxVisibleSubcategories);
            const visibleGenres = step.showMoreGenres ? [...mainMusicGenres, ...moreMusicGenres] : mainMusicGenres;
            const detailsSummary = isMusic
              ? [...step.formations.map((item) => `Formazione: ${item}`), ...step.talents, ...step.genres]
              : step.services;
            const liveSearch = liveSearches[step.id] ?? { status: "idle", results: [] };
            const isSearchReady = Boolean(step.categorySlug && step.subcategories.length);
            const suppliers = liveSearch.results.map((supplier, supplierIndex) => liveSupplierToSeed(supplier, supplierIndex, category.slug === "location"));
            const hasLiveSuppliers = suppliers.length > 0;
            const isSearching = liveSearch.status === "loading";

            return (
              <article key={step.id} className="rounded-md border border-line bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">{index + 1}</span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Fornitore {index + 1}</p>
                      <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{category.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        Scegli una o più sottocategorie: solo dopo parte la ricerca su Vibes Planner.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-petal px-3 py-2 text-xs font-bold text-violet-cta">
                      {isSearching ? "Ricerca AI in corso" : hasLiveSuppliers ? `${suppliers.length} fornitori` : isSearchReady ? "Pronto per cercare" : "Scegli sottocategoria"}
                    </span>
                    {steps.length > 1 ? (
                      <button type="button" onClick={() => removeSupplier(step.id)} className="rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-muted transition hover:bg-petal">
                        Rimuovi
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-ink">Categoria</span>
                    <select
                      value={step.categorySlug}
                      onChange={(event) => changeCategory(step.id, event.target.value)}
                      className="mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                    >
                      {VIBES_TAXONOMY.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-ink">Budget per questo fornitore</span>
                    <select
                      value={step.categoryBudget}
                      onChange={(event) => updateStep(step.id, { categoryBudget: event.target.value })}
                      className="mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                    >
                      {budgetOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-ink">Durata</span>
                    <select
                      value={step.duration}
                      onChange={(event) => updateStep(step.id, { duration: event.target.value })}
                      className="mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                    >
                      {durationOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-5 rounded-md border border-line bg-cream p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">Sottocategorie</p>
                      <p className="mt-1 text-sm leading-6 text-muted">Puoi selezionarne più di una per allargare la ricerca.</p>
                    </div>
                    <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-violet-cta">
                      {step.subcategories.length ? `${step.subcategories.length} selezionate` : "obbligatorio"}
                    </span>
                  </div>
                  <div className="mt-3">
                    <ChipGroup
                      items={visibleSubcategories}
                      selected={step.subcategories}
                      onToggle={(item) => updateStep(step.id, { subcategories: toggleValue(item, step.subcategories) })}
                    />
                  </div>
                  {category.subcategories.length > maxVisibleSubcategories ? (
                    <button
                      type="button"
                      onClick={() => updateStep(step.id, { showMoreSubcategories: !step.showMoreSubcategories })}
                      className="mt-3 rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-violet-cta transition hover:bg-petal"
                    >
                      {step.showMoreSubcategories ? "Mostra meno" : "+ Vedi tutte le sottocategorie"}
                    </button>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-3 rounded-md border border-line bg-cream p-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Evento</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{eventBrief.eventType || "Da definire"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Via o zona</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{eventBrief.address || eventBrief.province || "Da completare"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Invitati</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{eventBrief.guestCount ? `${eventBrief.guestCount} persone` : "Da indicare"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Budget fornitore</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{step.categoryBudget || "Da definire"}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-md border border-line bg-white p-4">
                  {isMusic ? (
                    <div className="grid gap-5 xl:grid-cols-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">Formazione</p>
                        <div className="mt-3">
                          <ChipGroup items={musicFormations} selected={step.formations} onToggle={(item) => updateStep(step.id, { formations: toggleValue(item, step.formations) })} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">Tipo musicista</p>
                        <div className="mt-3">
                          <ChipGroup items={musicTalentTypes} selected={step.talents} onToggle={(item) => updateStep(step.id, { talents: toggleValue(item, step.talents) })} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">Generi musicali</p>
                        <div className="mt-3">
                          <ChipGroup items={visibleGenres} selected={step.genres} onToggle={(item) => updateStep(step.id, { genres: toggleValue(item, step.genres) })} />
                        </div>
                        <button type="button" onClick={() => updateStep(step.id, { showMoreGenres: !step.showMoreGenres })} className="mt-3 rounded-md border border-line bg-petal px-3 py-2 text-xs font-bold text-violet-cta transition hover:bg-blush">
                          {step.showMoreGenres ? "Mostra meno" : "+ Vedi più generi"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-ink">Servizi utili per {category.label}</p>
                          <p className="mt-1 text-sm leading-6 text-muted">Le opzioni cambiano in base alla categoria. Puoi selezionarne massimo {maxSelectedServices}.</p>
                        </div>
                        <span className="rounded-md bg-petal px-3 py-1 text-xs font-semibold text-violet-cta">max {maxSelectedServices}</span>
                      </div>
                      <div className="mt-3">
                        <ChipGroup
                          items={serviceOptions}
                          selected={step.services}
                          max={maxSelectedServices}
                          onToggle={(item) => updateStep(step.id, { services: toggleValue(item, step.services, maxSelectedServices) })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {styleOptions.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-ink">Stile o mood</p>
                    <div className="mt-3">
                      <ChipGroup items={styleOptions.slice(0, 8)} selected={step.styles} onToggle={(item) => updateStep(step.id, { styles: toggleValue(item, step.styles) })} />
                    </div>
                  </div>
                ) : null}

                <label className="mt-5 block">
                  <span className="text-sm font-semibold text-ink">Note per questa categoria</span>
                  <textarea
                    value={step.notes}
                    onChange={(event) => updateStep(step.id, { notes: event.target.value })}
                    rows={3}
                    className="mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                    placeholder={`Es. ${category.aiExamples[0] ?? "Scrivi cosa deve sapere il fornitore..."}`}
                  />
                </label>

                <div className="mt-5 rounded-md border border-line bg-cream p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-bold text-ink">
                        {category.slug === "location" ? "Location suggerite" : `${category.label}: fornitori suggeriti`}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {!isSearchReady
                          ? "Seleziona almeno una sottocategoria per avviare la ricerca."
                          : category.slug === "location"
                            ? "I risultati danno priorità ai fornitori più vicini alla via/zona indicata, poi agli altri in ordine di distanza."
                            : "I risultati danno priorità ai profili più coerenti e ai fornitori che lavorano nella zona o in tutta Italia."}
                      </p>
                    </div>
                    <span className="rounded-md bg-white px-3 py-2 text-xs font-bold text-violet-cta">
                      {isSearching ? "Ricerca AI in corso" : hasLiveSuppliers ? `${suppliers.length} risultati` : isSearchReady ? "Nessun risultato ancora" : "In attesa"}
                    </span>
                  </div>

                  {!isSearchReady ? (
                    <div className="mt-4 rounded-md border border-dashed border-line bg-white p-5 text-sm leading-7 text-muted">
                      Prima scegli categoria e sottocategoria. I fornitori non vengono mostrati in automatico: compaiono solo quando la richiesta ha abbastanza contesto.
                    </div>
                  ) : isSearching && !suppliers.length ? (
                    <div className="mt-4 rounded-md border border-line bg-white p-5 text-sm font-semibold text-ink">
                      Sto cercando profili Vibes Planner coerenti con la tua richiesta...
                    </div>
                  ) : suppliers.length ? (
                    <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-3">
                      {suppliers.map((supplier, supplierIndex) => (
                        <SupplierCard key={`${supplier.name}-${supplierIndex}`} supplier={supplier} recommended={supplierIndex === 0} isLocation={category.slug === "location"} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-md border border-line bg-white p-5 text-sm leading-7 text-muted">
                      Non abbiamo trovato risultati solidi con questi filtri. Prova ad aggiungere una seconda sottocategoria o una zona più ampia.
                    </div>
                  )}
                  {suppliers.length > 3 ? (
                    <p className="mt-2 text-xs font-semibold text-muted">Scorri in orizzontale per vedere gli altri fornitori: ne mostriamo fino a 100 quando disponibili.</p>
                  ) : null}
                </div>

                <div className="mt-4 rounded-md border border-line bg-petal p-4 text-sm leading-6 text-muted">
                  <span className="font-bold text-ink">Dettagli usati per il match:</span>{" "}
                  {summarize([...step.subcategories, ...detailsSummary], "categoria, sottocategoria, zona, invitati e budget")}
                </div>
              </article>
            );
          })}

          <div className="rounded-md border border-line bg-petal p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h3 className="text-xl font-semibold text-ink">Hai bisogno di un altro fornitore</h3>
              <p className="mt-1 text-sm leading-6 text-muted">Aggiungi una nuova categoria: il brief evento resta già compilato e puoi cercare un altro servizio.</p>
            </div>
            <button type="button" onClick={addSupplier} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-violet-cta px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-violet-hover sm:mt-0 sm:w-auto">
              + Aggiungi fornitore
            </button>
          </div>
        </div>

        <aside className="border-t border-line bg-white p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-6">
          <div className="lg:sticky lg:top-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Resoconto budget</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{steps.length} categorie in lavorazione</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Budget indicativo per singolo fornitore. Se la somma supera il budget massimo, ti avvisiamo.
            </p>

            <div className="mt-5 space-y-3">
              {budgetRows.map((row) => (
                <div key={row.id} className="rounded-md border border-line bg-cream p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{row.category}</p>
                  <p className="mt-1 text-sm font-bold text-ink">{row.label || "Da definire"}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{row.subcategories.length ? row.subcategories.join(", ") : "Sottocategoria da scegliere"}</p>
                  <p className="mt-2 text-xs font-semibold text-violet-cta">{row.resultCount ? `${row.resultCount} fornitori da scorrere` : "Ricerca non ancora attiva"}</p>
                </div>
              ))}
            </div>

            <div className={`mt-5 rounded-md border p-5 ${isOverBudget ? "border-violet-cta bg-blush text-ink" : "border-line bg-ink text-white"}`}>
              <p className={`text-xs font-bold uppercase tracking-[0.16em] ${isOverBudget ? "text-violet-cta" : "text-rose-100"}`}>Totale stimato</p>
              <p className="mt-2 text-2xl font-semibold">{formatEuro(estimatedSupplierBudget || null)}</p>
              <p className={`mt-3 text-sm leading-6 ${isOverBudget ? "text-muted" : "text-white/70"}`}>
                Budget massimo: {formatEuro(eventBudgetLimit)}. Risultati attivi: {totalSupplierCards}.
              </p>
            </div>

            <p className="mt-3 text-xs leading-5 text-muted">
              Se invii un preventivo o una richiesta tramite Vibes Planner, potrai essere ricontattato direttamente dai fornitori interessati.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
