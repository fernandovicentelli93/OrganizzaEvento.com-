"use client";

import { useEffect, useMemo, useState } from "react";
import { VIBES_PLANNER_CLIENT_REQUEST_URL } from "@/lib/constants";
import type { VibesSupplierCard } from "@/lib/vibes-suppliers";
import { VIBES_TAXONOMY, type VibesTaxonomyCategory } from "@/lib/vibes-taxonomy";

const budgetFallback = ["Da definire", "Da concordare", "Fino a 1.500 euro", "1.500 - 3.000 euro", "3.000 - 5.000 euro", "Oltre 5.000 euro"];
const totalBudgetFallback = ["Fino a 5.000 euro", "5.000 - 10.000 euro", "10.000 - 20.000 euro", "20.000 - 40.000 euro", "Oltre 40.000 euro"];
const durationFallback = ["Da definire", "1-2 ore", "Mezza giornata", "Giornata intera", "Serata completa", "Più giorni"];
const commonServices = ["Piano pioggia", "Parcheggio", "Catering", "Camere", "Navetta", "Piscina"];
const musicFormations = ["DJ", "Duo", "Trio", "Band"];
const musicTalentTypes = ["Violinista", "Pianista", "Sassofonista", "Cantante", "DJ", "Musicista live"];
const mainMusicGenres = ["Commerciale", "Dance", "House", "Latino", "Reggaeton", "Pop italiano", "Anni 80/90", "Jazz", "Swing", "Rock"];
const moreMusicGenres = ["Soul", "Funk", "Classica", "Acustica", "Bossa nova", "Tango"];
const preferredCategoryOrder = ["location", "musica", "event-planner", "catering-e-gastronomia", "fotografi-e-videomaker"];
const starterCategorySlugs = ["location", "musica", "event-planner", "catering-e-gastronomia", "fotografi-e-videomaker"];

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
  subcategory: string;
  categoryBudget: string;
  duration: string;
  services: string[];
  styles: string[];
  formations: string[];
  talents: string[];
  genres: string[];
  showMoreGenres: boolean;
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
  live?: boolean;
};

type LiveSearchState = {
  status: "idle" | "loading" | "ready" | "error";
  results: VibesSupplierCard[];
};

const supplierSeeds: Record<string, SupplierSeed[]> = {
  location: [
    {
      name: "Villa Aurora Marche",
      meta: "6,4 km dalla zona evento",
      score: "9.7/10",
      note: "Consigliata per capienza, distanza e servizi richiesti."
    },
    {
      name: "Dimora San Clemente",
      meta: "14 km dalla zona evento",
      score: "9.1/10",
      note: "Buon match per ville storiche, giardino e piano pioggia."
    },
    {
      name: "Tenuta La Quercia",
      meta: "23 km dalla zona evento",
      score: "8.6/10",
      note: "Alternativa ampia se serve parcheggio e spazio esterno."
    }
  ],
  musica: [
    {
      name: "Luca M. Live Set",
      meta: "Si sposta in tutta Italia",
      score: "9.4/10",
      note: "Match alto per DJ, sax e repertorio da aperitivo e party."
    },
    {
      name: "White Notes Duo",
      meta: "Trasferta disponibile",
      score: "8.9/10",
      note: "Adatto a cerimonia, aperitivo elegante e musica live."
    },
    {
      name: "Marea DJ Experience",
      meta: "Tour eventi privati",
      score: "8.5/10",
      note: "Buona alternativa per festa serale e generi dance."
    }
  ],
  "event-planner": [
    {
      name: "Studio Evento Chiaro",
      meta: "Copertura locale e remoto",
      score: "9.2/10",
      note: "Consigliato per coordinare timeline e fornitori già scelti."
    },
    {
      name: "Livia Wedding Studio",
      meta: "Lavora in tutta Italia",
      score: "8.8/10",
      note: "Buon match per matrimoni e gestione ospiti da fuori regione."
    },
    {
      name: "Nodo Eventi",
      meta: "Remoto + presenza evento",
      score: "8.4/10",
      note: "Alternativa snella per regia del giorno evento."
    }
  ],
  "catering-e-gastronomia": [
    {
      name: "Cucina di Stagione",
      meta: "Menu evento e staff",
      score: "9.1/10",
      note: "Coerente con buffet, cena servita e intolleranze."
    },
    {
      name: "Banqueting 12",
      meta: "Eventi fino a 180 persone",
      score: "8.8/10",
      note: "Buon match se servono anche mise en place e personale."
    },
    {
      name: "Open Bar Lab",
      meta: "Cocktail e beverage",
      score: "8.3/10",
      note: "Utile se vuoi separare catering e drink."
    }
  ],
  "fotografi-e-videomaker": [
    {
      name: "Frame Vivo Studio",
      meta: "Foto + video evento",
      score: "9.0/10",
      note: "Match alto per reportage naturale e consegna rapida."
    },
    {
      name: "Luce Eventi",
      meta: "Servizi foto privati",
      score: "8.7/10",
      note: "Buona alternativa per compleanni e feste eleganti."
    },
    {
      name: "Reel Day",
      meta: "Video social e contenuti",
      score: "8.2/10",
      note: "Utile se vuoi contenuti brevi durante l'evento."
    }
  ]
};

function optionList(category: VibesTaxonomyCategory, key: keyof VibesTaxonomyCategory["filters"], fallback: string[]) {
  return category.filters[key] && category.filters[key]!.length > 0 ? category.filters[key]! : fallback;
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

function createStep(id: number, categorySlug: string): SupplierStep {
  const category = categoryBySlug(categorySlug);

  return {
    id,
    categorySlug,
    subcategory: category.subcategories[0] ?? "",
    categoryBudget: "Da definire",
    duration: firstOption(category, "durata", durationFallback),
    services: category.slug === "musica" ? [] : commonServices.slice(0, 2),
    styles: optionList(category, "stile", []).slice(0, 1),
    formations: category.slug === "musica" ? ["DJ"] : [],
    talents: category.slug === "musica" ? ["Sassofonista"] : [],
    genres: category.slug === "musica" ? ["Jazz"] : [],
    showMoreGenres: false,
    notes: ""
  };
}

function toggleValue(value: string, current: string[]) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function summarize(values: string[], fallback: string) {
  return values.length > 0 ? values.slice(0, 6).join(", ") : fallback;
}

function scoreFromLiveSupplier(supplier: VibesSupplierCard, index: number, isLocation: boolean) {
  const scoreBoost = Math.min(1.35, Math.max(0, supplier.score) / 3200);
  const premiumBoost = supplier.premium ? 0.18 : 0;
  const distanceBoost = isLocation && typeof supplier.distanceKm === "number" && supplier.distanceKm <= 25 ? 0.18 : 0;
  const rankPenalty = index * 0.12;
  const score = Math.max(7.1, Math.min(9.9, 8.2 + scoreBoost + premiumBoost + distanceBoost - rankPenalty));
  return `${score.toFixed(1)}/10`;
}

function liveSupplierNote(supplier: VibesSupplierCard, isLocation: boolean) {
  if (isLocation && typeof supplier.distanceKm === "number") {
    return `Match alto per distanza, categoria e zona evento. Distanza stimata: ${supplier.distanceKm.toFixed(1)} km.`;
  }
  if (supplier.serviceArea === "italy") return "Match utile: il fornitore risulta disponibile o valutabile su più zone italiane.";
  if (supplier.services.length) return `Match basato su ${supplier.services.slice(0, 2).join(", ")} e profilo Vibes Planner.`;
  return "Match calcolato dalla ricerca AI sulle vetrine pubbliche Vibes Planner.";
}

function liveSupplierToSeed(supplier: VibesSupplierCard, index: number, isLocation: boolean): SupplierSeed {
  return {
    name: supplier.name,
    meta: supplier.serviceAreaLabel || supplier.location || "Scheda Vibes Planner",
    score: scoreFromLiveSupplier(supplier, index, isLocation),
    note: liveSupplierNote(supplier, isLocation),
    imageUrl: supplier.imageUrl,
    url: supplier.vibesUrl,
    premium: supplier.premium,
    live: true
  };
}

function buildLiveSupplierQuery(step: SupplierStep, category: VibesTaxonomyCategory) {
  const details =
    category.slug === "musica"
      ? [...step.formations, ...step.talents, ...step.genres]
      : [...step.services, ...step.styles];
  return [category.label, step.subcategory, step.categoryBudget, step.duration, ...details, step.notes]
    .filter(Boolean)
    .join(" ");
}

function SupplierCard({ supplier, recommended, isLocation }: { supplier: SupplierSeed; recommended: boolean; isLocation: boolean }) {
  return (
    <article
      className={`flex min-h-[330px] min-w-[260px] flex-col rounded-md border bg-white p-4 shadow-sm sm:min-w-0 ${
        recommended ? "border-violet-cta shadow-[0_14px_30px_rgba(201,86,123,0.16)]" : "border-line"
      }`}
    >
      <div className={`relative h-28 overflow-hidden rounded-md ${recommended ? "bg-blush" : "bg-petal"}`}>
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
          {isLocation ? "Voto basato anche su distanza e capienza." : "Voto basato su match e copertura servizio."}
        </p>
        <a
          href={supplier.url ?? VIBES_PLANNER_CLIENT_REQUEST_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-md px-3 py-2 text-sm font-bold transition ${
            recommended ? "bg-violet-cta text-white hover:bg-violet-hover" : "border border-line bg-cream text-ink hover:bg-petal"
          }`}
        >
          {supplier.live ? "Preventivo gratuito" : recommended ? "Prenota consigliato" : "Prenota fornitore"}
        </a>
      </div>
    </article>
  );
}

function ChipGroup({
  items,
  selected,
  onToggle
}: {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onToggle(item)}
          className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
            selected.includes(item)
              ? "border-violet-cta bg-violet-cta text-white"
              : "border-line bg-cream text-ink hover:border-violet-cta hover:bg-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function SupplierTaxonomyRequestWizard() {
  const [eventBrief, setEventBrief] = useState<EventBrief>({
    eventType: "Matrimonio",
    address: "",
    province: "",
    guestCount: "",
    totalBudget: "",
    eventDate: ""
  });
  const [steps, setSteps] = useState<SupplierStep[]>([createStep(1, "location")]);
  const [liveSearches, setLiveSearches] = useState<Record<number, LiveSearchState>>({});

  const baseCategory = categoryBySlug(steps[0]?.categorySlug ?? "location");
  const eventOptions = optionList(baseCategory, "tipoEvento", []);

  const completedBriefFields = [eventBrief.eventType, eventBrief.address || eventBrief.province, eventBrief.guestCount, eventBrief.totalBudget].filter(Boolean).length;
  const completionPercent = Math.round((completedBriefFields / 4) * 100);

  const totalSupplierCards = steps.length * 3;
  const categoryLabels = steps.map((step) => categoryBySlug(step.categorySlug).label);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      const searches = steps.map(async (step) => {
        const category = categoryBySlug(step.categorySlug);
        const params = new URLSearchParams({
          locale: "it",
          category: step.categorySlug,
          subcategory: step.subcategory,
          eventType: eventBrief.eventType,
          province: eventBrief.province || eventBrief.address,
          query: [buildLiveSupplierQuery(step, category), eventBrief.guestCount ? `${eventBrief.guestCount} invitati` : "", eventBrief.totalBudget]
            .filter(Boolean)
            .join(" ")
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
              results: data.ok ? (data.results ?? []).slice(0, 6) : []
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
  }, [eventBrief.address, eventBrief.eventType, eventBrief.province, steps]);

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
      <div className="border-b border-line bg-petal/70 px-5 py-6 sm:px-7 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-cta">Booking fornitori</p>
        <div className="mt-4 grid gap-5 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <div>
            <h2 className="max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Prenota più fornitori senza riscrivere ogni volta gli stessi dati.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Scegli tu se partire da location, musica, planner, catering o un altro servizio. Tipo evento, zona,
              numero invitati e budget restano sempre attivi mentre aggiungi nuovi fornitori.
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
              {completedBriefFields >= 3 ? "La ricerca può già suggerire fornitori coerenti." : "Completa invitati, zona e budget per migliorare il match."}
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
            <span className="rounded-md bg-white px-3 py-2 text-xs font-bold text-muted">Si applica a tutti i fornitori</span>
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
              <span className="text-sm font-semibold text-ink">Provincia</span>
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
              <span className="text-sm font-semibold text-ink">Budget totale evento</span>
              <select
                value={eventBrief.totalBudget}
                onChange={(event) => updateBrief({ totalBudget: event.target.value })}
                className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
              >
                <option value="">Da definire</option>
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
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Partenza libera</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Da chi vuoi iniziare?</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                Non sei obbligato a partire dalla location: scegli il primo fornitore che ti serve e poi aggiungi gli altri.
              </p>
            </div>
            <span className="w-fit rounded-md bg-petal px-3 py-2 text-xs font-bold text-violet-cta">Il brief resta uguale</span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {starterCategorySlugs.map((slug) => {
              const item = categoryBySlug(slug);
              const isActive = steps[0]?.categorySlug === slug;
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
            const visibleGenres = step.showMoreGenres ? [...mainMusicGenres, ...moreMusicGenres] : mainMusicGenres;
            const detailsSummary = isMusic
              ? [...step.formations.map((item) => `Formazione: ${item}`), ...step.talents, ...step.genres]
              : step.services;
            const liveSearch = liveSearches[step.id];
            const liveSuppliers = (liveSearch?.results ?? [])
              .slice(0, 3)
              .map((supplier, supplierIndex) => liveSupplierToSeed(supplier, supplierIndex, category.slug === "location"));
            const fallbackSuppliers = supplierSeeds[category.slug] ?? supplierSeeds["event-planner"];
            const suppliers = liveSuppliers.length ? liveSuppliers : fallbackSuppliers;
            const hasLiveSuppliers = liveSuppliers.length > 0;
            const isSearching = liveSearch?.status === "loading";

            return (
              <article key={step.id} className="rounded-md border border-line bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">{index + 1}</span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Fornitore {index + 1}</p>
                      <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{category.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        Evento, zona, invitati e budget totale restano attivi. Qui cambi solo i dettagli di questa categoria.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-petal px-3 py-2 text-xs font-bold text-violet-cta">
                      {hasLiveSuppliers ? "AI + Vibes" : isMusic ? "Match AI" : category.slug === "location" ? "Match con km" : "Campi mantenuti"}
                    </span>
                    {steps.length > 1 ? (
                      <button type="button" onClick={() => removeSupplier(step.id)} className="rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-muted transition hover:bg-petal">
                        Rimuovi
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                    <span className="text-sm font-semibold text-ink">Sottocategoria</span>
                    <select
                      value={step.subcategory}
                      onChange={(event) => updateStep(step.id, { subcategory: event.target.value })}
                      className="mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                    >
                      {category.subcategories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-ink">Budget categoria</span>
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

                <div className="mt-5 grid gap-3 rounded-md border border-line bg-cream p-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Evento</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{eventBrief.eventType || "Da definire"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Zona</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{eventBrief.address || eventBrief.province || "Da completare"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Invitati</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{eventBrief.guestCount ? `${eventBrief.guestCount} persone` : "Da indicare"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Budget totale</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{eventBrief.totalBudget || "Da definire"}</p>
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
                          <p className="text-sm font-semibold text-ink">Servizi comuni</p>
                          <p className="mt-1 text-sm leading-6 text-muted">Massimo 6 opzioni comuni per non appesantire il percorso.</p>
                        </div>
                        <span className="rounded-md bg-petal px-3 py-1 text-xs font-semibold text-violet-cta">max 6</span>
                      </div>
                      <div className="mt-3">
                        <ChipGroup items={commonServices} selected={step.services} onToggle={(item) => updateStep(step.id, { services: toggleValue(item, step.services).slice(0, 6) })} />
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
                        {category.slug === "location" ? "Fornitori location suggeriti" : `${category.label}: fornitori suggeriti`}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {category.slug === "location"
                          ? "Per le location il voto considera anche distanza, capienza e servizi."
                          : "Per questa categoria il voto considera match, copertura servizio, stile e disponibilità."}
                      </p>
                    </div>
                    <span className="rounded-md bg-white px-3 py-2 text-xs font-bold text-violet-cta">
                      {isSearching ? "Ricerca AI in corso" : hasLiveSuppliers ? "Risultati Vibes reali" : "Ricerca in tempo reale"}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {suppliers.map((supplier, supplierIndex) => (
                      <SupplierCard key={supplier.name} supplier={supplier} recommended={supplierIndex === 0} isLocation={category.slug === "location"} />
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-line bg-petal p-4 text-sm leading-6 text-muted">
                  <span className="font-bold text-ink">Dettagli usati per il match:</span>{" "}
                  {summarize(detailsSummary, "categoria, zona, invitati e budget")}
                </div>
              </article>
            );
          })}

          <div className="rounded-md border border-line bg-petal p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h3 className="text-xl font-semibold text-ink">Vuoi completare l'evento?</h3>
              <p className="mt-1 text-sm leading-6 text-muted">Aggiungi catering, foto, intrattenimento, allestimenti o qualunque altro servizio. Il brief evento resta già compilato.</p>
            </div>
            <button type="button" onClick={addSupplier} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-violet-cta px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-violet-hover sm:mt-0 sm:w-auto">
              + Aggiungi fornitore
            </button>
          </div>
        </div>

        <aside className="border-t border-line bg-white p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-6">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Resoconto prenotazioni</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{steps.length} categorie in lavorazione</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Qui l'utente vede cosa sta prenotando, quanti fornitori sono stati suggeriti e quanto budget ha assegnato.
            </p>

            <div className="mt-5 space-y-3">
              {steps.map((step) => {
                const category = categoryBySlug(step.categorySlug);
                return (
                  <div key={step.id} className="rounded-md border border-line bg-cream p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{category.label}</p>
                    <p className="mt-1 text-sm font-bold text-ink">3 fornitori suggeriti</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{step.categoryBudget || "Budget da definire"}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-md border border-line bg-ink p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-100">Budget richieste</p>
              <p className="mt-2 text-2xl font-semibold">{eventBrief.totalBudget || "Da definire"}</p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {totalSupplierCards} fornitori suggeriti su {categoryLabels.join(", ") || "categorie selezionate"}.
              </p>
            </div>

            <a
              href={VIBES_PLANNER_CLIENT_REQUEST_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-violet-cta px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-violet-hover"
            >
              Procedi con le prenotazioni
            </a>
            <p className="mt-3 text-xs leading-5 text-muted">
              Obiettivo UX: portare l'utente a prenotare almeno un fornitore senza perdere il contesto dell'evento.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
