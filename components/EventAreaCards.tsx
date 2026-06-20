import Link from "next/link";
import { MAGAZINE_AREAS } from "@/lib/magazine";

export function EventAreaCards() {
  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Il tuo evento</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Entra nella conversazione giusta.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Ogni area raccoglie dubbi, prezzi, preventivi e problemi reali: scegli da dove partire e leggi casi simili al tuo.
          </p>
        </div>
        <Link href="/categorie" className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-violet-cta">
          Vedi tutte
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {MAGAZINE_AREAS.map((area) => (
          <Link
            key={area.slug}
            href={`/categorie/${area.slug}`}
            className="focus-ring group overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className="relative h-72 sm:h-80 lg:h-[22rem]">
              <img
                src={area.image}
                alt={area.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.08),rgba(47,36,48,0.30)_42%,rgba(47,36,48,0.88))]" />
              <div className="absolute bottom-0 p-6 text-white sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{area.eyebrow}</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">Parliamo di {area.name.toLowerCase()}</h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-rose-50">{area.description}</p>
                <span className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition group-hover:bg-petal">
                  Leggi le discussioni
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
