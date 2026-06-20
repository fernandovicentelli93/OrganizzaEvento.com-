"use client";

import type React from "react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VIBES_PLANNER_CLIENT_REQUEST_URL } from "@/lib/constants";
import type { Locale } from "@/lib/i18n-basic";
import {
  VIBES_EVENT_TYPES,
  VIBES_PROVINCES,
  VIBES_SUPPLIER_CATEGORIES,
  normalizeSearchText,
  supplierCategoryLabel,
  supplierEventTypeLabel,
  supplierSearchCopy,
  supplierSubcategoryLabel,
  type VibesSupplierCard
} from "@/lib/vibes-suppliers";

type VibesSupplierSearchProps = {
  locale?: Locale;
  variant?: "dark" | "pink" | "light";
  className?: string;
  children: React.ReactNode;
};

type SearchResponse = {
  ok: boolean;
  results: VibesSupplierCard[];
};

type GeoCoordinates = {
  lat: number;
  lng: number;
};

type ChoiceSelectId = "category" | "subcategory" | "province" | "eventType";

type ChoiceOption = {
  value: string;
  label: string;
};

const variantClassNames = {
  light: "border border-line bg-white text-ink hover:bg-petal",
  dark: "border border-white/70 bg-white/95 text-ink hover:bg-petal",
  pink: "bg-violet-cta text-white hover:bg-violet-hover"
};

function normalizeSearchParam(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 160);
}

function normalizeSearchField(value: string) {
  return normalizeSearchText(normalizeSearchParam(value));
}

function normalizeQueryPayload(input: {
  query: string;
  category: string;
  subcategory: string;
  province: string;
  eventType: string;
  locale: Locale;
}) {
  return {
    query: normalizeSearchField(input.query),
    category: normalizeSearchField(input.category),
    subcategory: normalizeSearchField(input.subcategory),
    province: normalizeSearchField(input.province),
    eventType: normalizeSearchField(input.eventType),
    locale: input.locale
  };
}

async function requestSearch(params: URLSearchParams) {
  const searchParams = new URLSearchParams(params);
  searchParams.set("_", String(Date.now()));
  const queryString = searchParams.toString();
  const endpoints = [`/api/vibes-suppliers/search?${queryString}`];

  let lastError: unknown = null;

  for (const endpoint of endpoints) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 26_000);

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache"
        },
        signal: controller.signal
      });

      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }

      const data = (await response.json()) as SearchResponse;
      if (data?.ok !== true) {
        lastError = new Error("Risposta non valida dal motore ricerca");
        continue;
      }

      return data;
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("Nessuna risposta disponibile dal motore ricerca");
}

function buildSearchParams(input: {
  query: string;
  category: string;
  subcategory: string;
  province: string;
  eventType: string;
  locale: Locale;
  coordinates?: GeoCoordinates | null;
}) {
  const params = new URLSearchParams();
  if (input.query) params.set("query", input.query);
  if (input.category) params.set("category", input.category);
  if (input.subcategory) params.set("subcategory", input.subcategory);
  if (input.province) params.set("province", input.province);
  if (input.eventType) params.set("eventType", input.eventType);
  if (input.coordinates) {
    params.set("lat", input.coordinates.lat.toFixed(5));
    params.set("lng", input.coordinates.lng.toFixed(5));
  }
  params.set("locale", input.locale);
  return params;
}

export function VibesSupplierSearch({ locale = "it", variant = "light", className = "", children }: VibesSupplierSearchProps) {
  const copy = supplierSearchCopy(locale);
  const closeShortLabel = locale === "it" ? "Chiudi" : locale === "es" ? "Cerrar" : locale === "fr" ? "Fermer" : "Close";
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [province, setProvince] = useState("");
  const [eventType, setEventType] = useState("");
  const [openSelect, setOpenSelect] = useState<ChoiceSelectId | null>(null);
  const [resultPage, setResultPage] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [results, setResults] = useState<VibesSupplierCard[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<GeoCoordinates | null>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<VibesSupplierCard[]>([]);
  const searchRunRef = useRef(0);

  const pageSize = 5;
  const selectedCategory = useMemo(
    () => VIBES_SUPPLIER_CATEGORIES.find((item) => item.slug === category),
    [category]
  );
  const categoryOptions = useMemo<ChoiceOption[]>(
    () => [
      { value: "", label: copy.all },
      ...VIBES_SUPPLIER_CATEGORIES.map((item) => ({
        value: item.slug,
        label: supplierCategoryLabel(item, locale)
      }))
    ],
    [copy.all, locale]
  );
  const subcategoryOptions = useMemo<ChoiceOption[]>(() => {
    const subcategories = selectedCategory?.subcategories ?? VIBES_SUPPLIER_CATEGORIES.flatMap((item) => item.subcategories).slice(0, 22);
    return [
      { value: "", label: copy.all },
      ...subcategories.map((item) => ({
        value: item,
        label: supplierSubcategoryLabel(item, locale)
      }))
    ];
  }, [copy.all, locale, selectedCategory]);
  const provinceOptions = useMemo<ChoiceOption[]>(
    () => [{ value: "", label: copy.all }, ...VIBES_PROVINCES.map((item) => ({ value: item, label: item }))],
    [copy.all]
  );
  const eventTypeOptions = useMemo<ChoiceOption[]>(
    () => [
      { value: "", label: copy.all },
      ...VIBES_EVENT_TYPES.map((item) => ({
        value: item,
        label: supplierEventTypeLabel(item, locale)
      }))
    ],
    [copy.all, locale]
  );
  const pageStart = resultPage * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, results.length);
  const visibleResults = results.slice(pageStart, pageEnd);
  const hasNextPage = pageEnd < results.length;
  const hasPreviousPage = resultPage > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openSelect) {
        setOpenSelect(null);
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, openSelect]);

  async function search(
    event?: FormEvent<HTMLFormElement>,
    options: {
      coordinates?: GeoCoordinates | null;
      revealResults?: boolean;
      applyIfStillEmpty?: boolean;
      keepExistingOnEmpty?: boolean;
      preserveExistingOnError?: boolean;
      silentIfResultsVisible?: boolean;
    } = {}
  ) {
    event?.preventDefault();
    const runId = searchRunRef.current + 1;
    searchRunRef.current = runId;
    setOpenSelect(null);
    const hadVisibleResults = resultsRef.current.length > 0;
    if (!(options.silentIfResultsVisible && hadVisibleResults)) {
      setStatus("loading");
    }
    setResultPage(0);
    const normalized = normalizeQueryPayload({
      query,
      category,
      subcategory,
      province,
      eventType,
      locale
    });
    try {
      const params = buildSearchParams({
        ...normalized,
        coordinates: options.coordinates ?? userCoordinates
      });
      const data = await requestSearch(params);
      const nextResults = data.results ?? [];
      const isStale = runId !== searchRunRef.current;
      if (isStale && !(options.applyIfStillEmpty && !resultsRef.current.length && nextResults.length)) return;
      if (!(options.keepExistingOnEmpty && !nextResults.length && resultsRef.current.length)) {
        setResults(nextResults);
      }
      setStatus("ready");
      if (options.revealResults !== false) jumpToResultsTop();
    } catch {
      if (runId !== searchRunRef.current) return;
      if (options.preserveExistingOnError && resultsRef.current.length) {
        setStatus("ready");
        return;
      }
      setResults([]);
      setStatus("error");
    }
  }

  function openModal() {
    setIsOpen(true);
    setOpenSelect(null);
    if ((status === "idle" || status === "error") && !results.length) {
      void loadInitialResults();
    }
  }

  function loadInitialResults() {
    void search(undefined, { revealResults: false, applyIfStillEmpty: true, keepExistingOnEmpty: true });

    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoordinates(coordinates);
        void search(undefined, {
          coordinates,
          revealResults: false,
          keepExistingOnEmpty: true,
          preserveExistingOnError: true,
          silentIfResultsVisible: true
        });
      },
      () => {
        // If the user denies geolocation, the generic Vibes discovery search remains visible.
      },
      {
        enableHighAccuracy: false,
        maximumAge: 30 * 60 * 1000,
        timeout: 6500
      }
    );
  }

  function jumpToResultsTop() {
    window.setTimeout(() => {
      const target = resultsTopRef.current;
      if (target) {
        target.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
      modalScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
  }

  function goToResultPage(nextPage: number) {
    setResultPage(nextPage);
    jumpToResultsTop();
  }

  function toggleSelect(selectId: ChoiceSelectId) {
    setOpenSelect((current) => (current === selectId ? null : selectId));
  }

  function visibleSupplierCategory(supplier: VibesSupplierCard) {
    const categoryConfig = VIBES_SUPPLIER_CATEGORIES.find((item) => item.slug === supplier.categorySlug);
    return categoryConfig ? supplierCategoryLabel(categoryConfig, locale) : supplier.category;
  }

  function supplierPreview(supplier: VibesSupplierCard) {
    const categoryLabel = visibleSupplierCategory(supplier);
    const serviceLabels = supplier.services
      .filter(Boolean)
      .slice(0, 2)
      .map((service) => supplierSubcategoryLabel(service, locale));
    const serviceText = serviceLabels.length ? serviceLabels.join(", ") : categoryLabel;
    const place = supplier.location || (locale === "it" ? "Italia" : locale === "es" ? "Italia" : locale === "fr" ? "Italie" : "Italy");

    if (locale === "en") {
      return `Public Vibes showcase for ${categoryLabel.toLowerCase()} in ${place}: useful for comparing ${serviceText}.`;
    }
    if (locale === "es") {
      return `Vitrina pública Vibes de ${categoryLabel.toLowerCase()} en ${place}: útil para comparar ${serviceText}.`;
    }
    if (locale === "fr") {
      return `Vitrine publique Vibes pour ${categoryLabel.toLowerCase()} à ${place} : utile pour comparer ${serviceText}.`;
    }
    return `Vetrina pubblica Vibes per ${categoryLabel.toLowerCase()} a ${place}: utile per confrontare ${serviceText}.`;
  }

  const modal = isOpen ? (
    <div className="fixed inset-0 z-[20000] flex items-start justify-center overflow-y-auto overscroll-contain bg-ink/75 px-2 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur-sm sm:px-5 sm:py-6 lg:items-center">
      <section className="relative w-full max-w-[96rem] overflow-hidden rounded-lg border border-line bg-cream shadow-soft">
        <div
          ref={modalScrollRef}
          className="grid max-h-[calc(100dvh-1.5rem)] overflow-y-auto sm:max-h-[calc(100dvh-3rem)] lg:grid-cols-[17.5rem_1fr] xl:grid-cols-[18.25rem_1fr]"
        >
          <aside className="relative border-b border-line bg-white p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Vibes Planner</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpenSelect(null);
                    setIsOpen(false);
                  }}
                  className="focus-ring inline-flex min-h-8 shrink-0 items-center justify-center gap-1 rounded-md border border-ink/10 bg-ink px-2 py-1 text-[11px] font-semibold leading-none text-white shadow-sm transition hover:bg-violet-cta sm:min-h-9 sm:px-2.5 sm:text-xs"
                  aria-label={copy.close}
                >
                  <span className="text-sm leading-none" aria-hidden="true">
                    X
                  </span>
                  <span>{closeShortLabel}</span>
                </button>
              </div>
              <h2 className="mt-4 text-[1.45rem] font-semibold leading-tight tracking-tight text-ink sm:text-2xl">{copy.title}</h2>
              <p className="mt-3 hidden text-sm leading-6 text-muted sm:block">{copy.intro}</p>
            </div>

            <form onSubmit={search} className="mt-5 space-y-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{copy.query}</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.queryPlaceholder}
                  className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-3 py-3 text-sm text-ink"
                />
              </label>

              <ChoiceSelect
                id="category"
                label={copy.category}
                value={category}
                options={categoryOptions}
                open={openSelect === "category"}
                onToggle={() => toggleSelect("category")}
                onClose={() => setOpenSelect(null)}
                onChange={(value) => {
                  setCategory(value);
                  setSubcategory("");
                }}
              />

              <details className="rounded-md border border-line bg-cream p-3">
                <summary className="cursor-pointer text-sm font-semibold text-ink">{copy.advancedFilters}</summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <ChoiceSelect
                    id="subcategory"
                    label={copy.subcategory}
                    value={subcategory}
                    options={subcategoryOptions}
                    open={openSelect === "subcategory"}
                    onToggle={() => toggleSelect("subcategory")}
                    onClose={() => setOpenSelect(null)}
                    onChange={setSubcategory}
                    surface="white"
                  />

                  <ChoiceSelect
                    id="province"
                    label={copy.province}
                    value={province}
                    options={provinceOptions}
                    open={openSelect === "province"}
                    onToggle={() => toggleSelect("province")}
                    onClose={() => setOpenSelect(null)}
                    onChange={setProvince}
                    surface="white"
                  />
                  <ChoiceSelect
                    id="eventType"
                    label={copy.eventType}
                    value={eventType}
                    options={eventTypeOptions}
                    open={openSelect === "eventType"}
                    onToggle={() => toggleSelect("eventType")}
                    onClose={() => setOpenSelect(null)}
                    onChange={setEventType}
                    surface="white"
                  />
                </div>
              </details>

              <button
                type="submit"
                disabled={status === "loading"}
                className="focus-ring min-h-12 w-full rounded-md bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover disabled:opacity-60"
              >
                {status === "loading" ? copy.loading : copy.search}
              </button>
              <a
                href={VIBES_PLANNER_CLIENT_REQUEST_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-petal"
                aria-label={copy.requestHint}
              >
                <img src="/partners/vibes-planner/logo.jpg" alt="" className="h-5 w-5 rounded bg-white object-cover" />
                {copy.request}
              </a>
            </form>
          </aside>

          <div className="bg-[#fbf8f5] p-4 sm:p-5">
            <div ref={resultsTopRef} className="flex scroll-mt-3 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">
                  {results.length} {copy.resultsLabel}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">{copy.source}</p>
              </div>
              {status === "ready" && results.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                    {copy.premiumFirst}
                  </span>
                  <a
                    href={VIBES_PLANNER_CLIENT_REQUEST_URL}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="focus-ring inline-flex min-h-8 items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-cta"
                    aria-label={copy.requestHint}
                  >
                    <img src="/partners/vibes-planner/logo.jpg" alt="" className="h-4 w-4 rounded bg-white object-cover" />
                    {copy.request}
                  </a>
                </div>
              ) : null}
            </div>

            <div className="relative mt-4 min-h-[22rem]">
              {status === "loading" ? <SupplierSearchLoadingOverlay copy={copy} /> : null}
              {status === "idle" ? (
                <div className="rounded-lg border border-line bg-white p-6 text-sm leading-6 text-muted">{copy.initial}</div>
              ) : null}
              {status === "ready" && !results.length ? (
                <div className="rounded-lg border border-line bg-white p-6 text-sm leading-6 text-muted">{copy.empty}</div>
              ) : null}
              {status === "error" ? (
                <div className="rounded-lg border border-line bg-white p-6 text-sm leading-6 text-muted">{copy.empty}</div>
              ) : null}
              {visibleResults.length ? (
                <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {visibleResults.map((supplier) => (
                    <article
                      key={supplier.id}
                      className="group flex h-[30rem] flex-col overflow-hidden rounded-md border border-line bg-white shadow-[0_14px_34px_rgba(31,41,55,0.10)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(31,41,55,0.14)] xl:h-[29.5rem]"
                    >
                      <div className="relative h-[12rem] shrink-0 overflow-hidden bg-petal xl:h-[11.5rem]">
                        {supplier.imageUrl ? (
                          <img
                            src={supplier.imageUrl}
                            alt={supplier.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center p-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                            Vibes Planner
                          </div>
                        )}
                        <button
                          type="button"
                          aria-label={`${copy.save} ${supplier.name}`}
                          className="focus-ring absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-md bg-white text-xl leading-none text-[#b8328f] shadow-md transition hover:bg-petal"
                        >
                          {"\u2661"}
                        </button>
                        {supplier.premium ? (
                          <span className="absolute bottom-2.5 left-2.5 max-w-[calc(100%-1.25rem)] rounded-md bg-[#c03aa0] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-white shadow-md">
                            {copy.premium}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col p-3.5">
                        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{visibleSupplierCategory(supplier)}</p>
                        <h3 className="mt-2 line-clamp-3 h-[4.35rem] text-base font-semibold leading-snug tracking-tight text-[#b8328f]">
                          {supplier.name}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 min-h-[2.55rem] text-xs leading-5 text-muted">
                          {supplierPreview(supplier)}
                        </p>
                        {supplier.address || supplier.location ? (
                          <p className="mt-2 flex h-[1.25rem] items-center gap-1.5 text-xs font-medium text-ink">
                            <span className="shrink-0 text-sm text-ink" aria-hidden="true">
                              {"\u2316"}
                            </span>
                            <span className="truncate">{supplier.address || supplier.location}</span>
                          </p>
                        ) : (
                          <p className="mt-2 h-[1.25rem] truncate text-xs font-medium text-muted">Vibes Planner</p>
                        )}
                        <p className="mt-2 h-[1.55rem] truncate rounded-md bg-cream px-2.5 py-1 text-[11px] font-semibold text-muted">
                          {supplier.serviceAreaLabel ?? copy.profileBadge}
                        </p>
                        <div className="mt-auto shrink-0 pt-3">
                          <a
                            href={supplier.vibesUrl}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1b1917] px-3 py-2.5 text-xs font-semibold tracking-[0.05em] text-white transition hover:bg-[#b8328f]"
                          >
                            <img src="/partners/vibes-planner/logo.jpg" alt="" className="h-5 w-5 rounded bg-white object-cover" />
                            {copy.external}
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>

            {results.length > pageSize ? (
              <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-md border border-line bg-white px-3 py-3 sm:flex-row">
                <p className="text-xs font-semibold text-muted">
                  {copy.pageLabel} {pageStart + 1}-{pageEnd} / {results.length}
                </p>
                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    disabled={!hasPreviousPage}
                    onClick={() => goToResultPage(Math.max(0, resultPage - 1))}
                    className="focus-ring min-h-11 flex-1 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-petal disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
                  >
                    {copy.previous}
                  </button>
                  <button
                    type="button"
                    disabled={!hasNextPage}
                    onClick={() => goToResultPage(hasNextPage ? resultPage + 1 : resultPage)}
                    className="focus-ring min-h-11 flex-1 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-cta disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
                  >
                    {copy.more}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition ${variantClassNames[variant]} ${className}`}
      >
        <img
          src="/partners/vibes-planner/logo.jpg"
          alt="Vibes Planner"
          loading="lazy"
          decoding="async"
          className="h-7 w-7 shrink-0 rounded-md object-cover"
        />
        <span>{children ?? copy.button}</span>
      </button>

      {mounted ? createPortal(modal, document.body) : null}
    </>
  );
}

function ChoiceSelect({
  id,
  label,
  value,
  options,
  open,
  onToggle,
  onClose,
  onChange,
  surface = "cream"
}: {
  id: ChoiceSelectId;
  label: string;
  value: string;
  options: ChoiceOption[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChange: (value: string) => void;
  surface?: "cream" | "white";
}) {
  const selectedOption = options.find((option) => option.value === value) ?? options[0];
  const listboxId = `vibes-supplier-${id}-listbox`;

  return (
    <div className="relative">
      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={onToggle}
        className={`focus-ring mt-2 flex min-h-12 w-full items-center justify-between gap-3 rounded-md border border-line px-3 py-3 text-left text-sm text-ink ${
          surface === "white" ? "bg-white" : "bg-cream"
        }`}
      >
        <span className="min-w-0 flex-1 truncate">{selectedOption?.label ?? ""}</span>
        <span className={`shrink-0 text-sm text-muted transition ${open ? "rotate-180" : ""}`} aria-hidden="true">
          v
        </span>
      </button>
      {open ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-[21000] max-h-[min(16rem,42dvh)] w-full overflow-y-auto overscroll-contain rounded-md border border-line bg-white p-1 shadow-[0_18px_40px_rgba(31,41,55,0.18)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={`${id}-${option.value || "all"}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  onClose();
                }}
                className={`focus-ring flex min-h-10 w-full items-center rounded px-3 py-2 text-left text-sm leading-5 transition ${
                  isSelected ? "bg-petal font-semibold text-ink" : "text-ink hover:bg-cream"
                }`}
              >
                <span className="line-clamp-2">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function SupplierSearchLoadingOverlay({ copy }: { copy: ReturnType<typeof supplierSearchCopy> }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/92 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-line bg-cream">
            <img src="/partners/vibes-planner/logo.jpg" alt="" className="h-8 w-8 rounded object-cover" />
          </div>
          <div>
            <h3 className="text-base font-semibold leading-snug text-ink">{copy.loadingTitle}</h3>
            <p className="mt-1 text-sm leading-6 text-muted">{copy.loadingText}</p>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-cream">
            <div className="supplier-search-bar h-full w-2/3 rounded-full bg-violet-cta" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="h-16 rounded-md border border-line bg-cream" />
            <span className="h-16 rounded-md border border-line bg-petal" />
            <span className="h-16 rounded-md border border-line bg-cream" />
          </div>
        </div>
      </div>
    </div>
  );
}


