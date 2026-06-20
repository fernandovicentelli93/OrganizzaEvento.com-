"use client";

import { useMemo, useState } from "react";
import { VIBES_TAXONOMY, type VibesTaxonomyCategory } from "@/lib/vibes-taxonomy";

const budgetFallback = ["Da concordare", "Fino a 1.500 euro", "1.500 - 3.000 euro", "3.000 - 5.000 euro", "Oltre 5.000 euro"];
const durationFallback = ["Da definire", "1-2 ore", "Mezza giornata", "Giornata intera", "Serata completa", "Più giorni"];

function optionList(category: VibesTaxonomyCategory, key: keyof VibesTaxonomyCategory["filters"], fallback: string[]) {
  return category.filters[key] && category.filters[key]!.length > 0 ? category.filters[key]! : fallback;
}

function joinOrPlaceholder(values: string[], placeholder: string) {
  return values.length > 0 ? values.slice(0, 5).join(", ") : placeholder;
}

export function SupplierTaxonomyRequestWizard() {
  const [categorySlug, setCategorySlug] = useState("location");
  const [subcategory, setSubcategory] = useState("");
  const [eventType, setEventType] = useState("");
  const [province, setProvince] = useState("");
  const [address, setAddress] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const category = useMemo(
    () => VIBES_TAXONOMY.find((item) => item.slug === categorySlug) ?? VIBES_TAXONOMY[0],
    [categorySlug]
  );

  const eventOptions = optionList(category, "tipoEvento", []);
  const serviceOptions = optionList(category, "serviziInclusi", []);
  const styleOptions = optionList(category, "stile", []);
  const budgetOptions = optionList(category, "budget", budgetFallback);
  const durationOptions = optionList(category, "durata", durationFallback);
  const logisticsOptions = optionList(category, "logistica", []);

  const summaryRows = [
    ["Categoria", category.label],
    ["Fornitore", subcategory || "Da scegliere"],
    ["Evento", eventType || "Da definire"],
    ["Zona", address || province || "Da completare"],
    ["Budget", budget || "Da capire"],
    ["Durata", duration || "Da definire"],
    ["Servizi", joinOrPlaceholder(selectedServices, "Nessun servizio selezionato")],
    ["Stile", joinOrPlaceholder(selectedStyle, "Nessuno stile selezionato")]
  ];

  function changeCategory(slug: string) {
    setCategorySlug(slug);
    setSubcategory("");
    setEventType("");
    setBudget("");
    setDuration("");
    setSelectedServices([]);
    setSelectedStyle([]);
    setNotes("");
  }

  function toggleValue(value: string, current: string[], setter: (next: string[]) => void) {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <section className="overflow-hidden rounded-[18px] border border-line bg-white shadow-soft">
      <div className="border-b border-line bg-petal/70 px-5 py-5 sm:px-7 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-cta">Ricerca fornitori</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h2 className="font-editorial text-3xl leading-[1.05] text-ink sm:text-4xl">
              Trova fornitori italiani partendo da una richiesta chiara.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Scegli categoria, zona e dettagli reali dell'evento. Il modulo prepara una ricerca ordinata: prima i
              fornitori più coerenti e vicini, poi le alternative utili da valutare.
            </p>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-[14px] border border-line bg-white text-center text-xs font-semibold text-ink">
            <div className="border-r border-line px-3 py-3">
              <span className="block text-violet-cta">01</span>
              Categoria
            </div>
            <div className="border-r border-line px-3 py-3">
              <span className="block text-violet-cta">02</span>
              Dettagli
            </div>
            <div className="px-3 py-3">
              <span className="block text-violet-cta">03</span>
              Risultati
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[330px_1fr]">
        <aside className="border-b border-line bg-cream p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="rounded-[14px] border border-line bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Da cosa partiamo?</p>
            <h3 className="mt-2 font-editorial text-2xl leading-tight text-ink">Scegli il tipo di fornitore.</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Ogni categoria apre domande diverse: musica, location, catering e servizi tecnici non vanno cercati nello
              stesso modo.
            </p>
          </div>

          <div className="mt-4 grid max-h-[560px] gap-2 overflow-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
            {VIBES_TAXONOMY.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => changeCategory(item.slug)}
                className={`w-full rounded-[12px] border px-4 py-3 text-left text-sm font-semibold transition ${
                  category.slug === item.slug
                    ? "border-violet-cta bg-white text-violet-cta shadow-[0_12px_28px_rgba(201,86,123,0.13)]"
                    : "border-line bg-white/70 text-ink hover:border-violet-cta hover:bg-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="rounded-[16px] border border-line bg-petal/45 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Categoria selezionata</p>
              <h3 className="mt-2 font-editorial text-3xl leading-tight text-ink">{category.label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Imposta i dettagli essenziali: il sistema userà questi segnali per ordinare Premium Vibes Club, fornitori
                vicini, professionisti attivi in tutta Italia e vetrine base coerenti.
              </p>
            </div>

            <div className="rounded-[16px] border border-line bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Priorità ricerca</p>
              <div className="mt-3 space-y-2 text-sm font-semibold text-ink">
                <p>1. Coerenza con categoria</p>
                <p>2. Distanza dalla via indicata</p>
                <p>3. Qualità scheda e badge</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Sottocategoria</span>
              <select
                value={subcategory}
                onChange={(event) => setSubcategory(event.target.value)}
                className="mt-2 w-full rounded-[12px] border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
              >
                <option value="">Scegli il tipo di fornitore</option>
                {category.subcategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Tipo evento</span>
              <select
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
                className="mt-2 w-full rounded-[12px] border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
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
              <span className="text-sm font-semibold text-ink">Via o zona precisa</span>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="mt-2 w-full rounded-[12px] border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                placeholder="Es. Via Roma 10, Ancona"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Provincia</span>
              <input
                value={province}
                onChange={(event) => setProvince(event.target.value)}
                className="mt-2 w-full rounded-[12px] border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
                placeholder="Es. Ancona"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Budget</span>
              <select
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="mt-2 w-full rounded-[12px] border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
              >
                <option value="">Da capire</option>
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
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="mt-2 w-full rounded-[12px] border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
              >
                <option value="">Da definire</option>
                {durationOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {serviceOptions.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-ink">Servizi inclusi o desiderati</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {serviceOptions.slice(0, 18).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleValue(item, selectedServices, setSelectedServices)}
                    className={`rounded-[10px] border px-3 py-2 text-xs font-semibold transition ${
                      selectedServices.includes(item)
                        ? "border-violet-cta bg-violet-cta text-white"
                        : "border-line bg-cream text-ink hover:border-violet-cta hover:bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {styleOptions.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-ink">Stile o mood</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {styleOptions.slice(0, 18).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleValue(item, selectedStyle, setSelectedStyle)}
                    className={`rounded-[10px] border px-3 py-2 text-xs font-semibold transition ${
                      selectedStyle.includes(item)
                        ? "border-violet-cta bg-violet-cta text-white"
                        : "border-line bg-cream text-ink hover:border-violet-cta hover:bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="mt-6 block">
            <span className="text-sm font-semibold text-ink">Scrivi liberamente cosa ti serve</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-[12px] border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-violet-cta focus:ring-4 focus:ring-blush"
              placeholder={`Es. ${category.aiExamples[0] ?? "Cerco fornitori per il mio evento..."}`}
            />
          </label>

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            {logisticsOptions.length > 0 && (
              <div className="rounded-[16px] border border-line bg-cream p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Da controllare</p>
                <p className="mt-3 text-sm leading-7 text-ink">{logisticsOptions.slice(0, 8).join(" · ")}</p>
              </div>
            )}

            <div className="rounded-[16px] border border-line bg-ink p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">Riepilogo ricerca</p>
              <div className="mt-3 grid gap-2 text-sm">
                {summaryRows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[96px_1fr] gap-3 border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
                    <span className="text-white/55">{label}</span>
                    <span className="font-semibold text-white/90">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-muted">
              I risultati potranno includere Premium Vibes Club e vetrine base, sempre in ordine di pertinenza.
            </p>
            <button
              type="button"
              className="rounded-[12px] bg-violet-cta px-5 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(201,86,123,0.22)] transition hover:bg-violet-hover"
            >
              Cerca fornitori
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
