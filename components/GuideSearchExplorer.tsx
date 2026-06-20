"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type GuideSearchItem = {
  slug: string;
  title: string;
  intro: string;
  metaDescription: string;
  heroImage: string;
  heroAlt: string;
  eyebrow: string;
  eventType: string;
  city: string;
  region: string;
  guideType?: "city" | "regional";
  regionSlug?: string;
  coordinates?: { lat: number; lng: number };
  yearFocus?: string;
  searchTags?: string[];
  readingMinutes: number;
};

function distanceKm(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  const earthRadius = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function GuideSearchExplorer({ pages }: { pages: GuideSearchItem[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Tutte");
  const [eventType, setEventType] = useState("Tutti");
  const [kind, setKind] = useState("Tutte");
  const [geoStatus, setGeoStatus] = useState("");

  const regions = useMemo(() => ["Tutte", ...Array.from(new Set(pages.map((page) => page.region))).sort()], [pages]);
  const eventTypes = useMemo(() => ["Tutti", ...Array.from(new Set(pages.map((page) => page.eventType))).sort()], [pages]);

  const filteredPages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return pages.filter((page) => {
      const haystack = [
        page.title,
        page.intro,
        page.metaDescription,
        page.eyebrow,
        page.eventType,
        page.city,
        page.region,
        page.yearFocus,
        ...(page.searchTags ?? [])
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || haystack.includes(normalizedQuery)) &&
        (region === "Tutte" || page.region === region) &&
        (eventType === "Tutti" || page.eventType === eventType) &&
        (kind === "Tutte" || (kind === "Regionali" ? page.guideType === "regional" : page.guideType !== "regional"))
      );
    });
  }, [eventType, kind, pages, query, region]);

  function useMyPosition() {
    if (!navigator.geolocation) {
      setGeoStatus("La geolocalizzazione non ? disponibile su questo dispositivo.");
      return;
    }

    setGeoStatus("Cerco la regione più vicina...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const regionalPages = pages.filter((page) => page.guideType === "regional" && page.coordinates);
        const nearest = regionalPages
          .map((page) => ({ page, distance: distanceKm(current, page.coordinates!) }))
          .sort((a, b) => a.distance - b.distance)[0];

        if (!nearest) {
          setGeoStatus("Non ho trovato una regione collegata alla posizione.");
          return;
        }

        setRegion(nearest.page.region);
        setKind("Regionali");
        setGeoStatus(`Ti mostro prima le guide per ${nearest.page.region}.`);
      },
      () => setGeoStatus("Non riesco a leggere la posizione. Puoi scegliere la regione dal filtro.")
    );
  }

  const visiblePages = filteredPages.slice(0, 80);

  return (
    <section className="mt-12 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Ricerca guide</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Trova subito la guida più vicina al tuo caso.</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Cerca per regione, tipo evento, preventivo, budget, fornitori o anno. Le guide regionali includono segnali 2026/2027 e coordinate per filtrare in base alla posizione.
          </p>
        </div>
        <button
          type="button"
          className="focus-ring rounded-xl border border-line bg-petal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-cream"
          onClick={useMyPosition}
        >
          Usa la mia posizione
        </button>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Cerca</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="es. matrimonio Toscana, preventivo, eventi aziendali..."
            className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Regione</span>
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink"
          >
            {regions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Tipo evento</span>
          <select
            value={eventType}
            onChange={(event) => setEventType(event.target.value)}
            className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink"
          >
            {eventTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Tipo guida</span>
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink"
          >
            <option>Tutte</option>
            <option>Regionali</option>
            <option>Locali</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
        <span>
          {filteredPages.length} guide trovate
          {filteredPages.length > visiblePages.length ? `, prime ${visiblePages.length} visibili` : ""}
        </span>
        {geoStatus ? <span className="rounded-full bg-petal px-3 py-1 text-xs font-semibold text-violet-cta">{geoStatus}</span> : null}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {visiblePages.map((page) => (
          <Link
            key={page.slug}
            href={`/guide-eventi/${page.slug}`}
            className="focus-ring grid overflow-hidden rounded-xl border border-line bg-cream transition hover:border-violet-cta hover:bg-petal sm:grid-cols-[8.5rem_1fr]"
          >
            <div className="relative min-h-40 bg-petal sm:min-h-full">
              <img
                src={page.heroImage}
                alt={page.heroAlt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.02),rgba(47,36,48,0.35))]" />
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-violet-cta">{page.eyebrow}</span>
                <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-muted">{page.region}</span>
                <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-muted">{page.readingMinutes} min</span>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-snug text-ink">{page.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{page.intro}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
