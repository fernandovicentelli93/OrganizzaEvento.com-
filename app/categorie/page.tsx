import type { Metadata } from "next";
import Link from "next/link";
import { selfAlternates } from "@/lib/i18n-routing";
import { MAGAZINE_AREAS } from "@/lib/magazine";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Eventi",
  description:
    "Scegli tra Matrimonio, Compleanni e feste private, Eventi aziendali e Idee evento. Ogni area contiene domande pronte e conversazioni.",
  alternates: selfAlternates("it", { type: "static", key: "topics" })
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const areaCounts = await Promise.all(
    MAGAZINE_AREAS.map(async (area) => {
      const count = await prisma.question.count({
        where: {
            status: "published",
            OR: [
              { eventType: { in: area.eventTypes } },
              ...(area.slug === "idee-evento" ? [{ postType: "Idea" }, { category: { slug: "idee-evento" } }] : [])
            ]
          }
        });
      return [area.slug, count] as const;
    })
  );
  const countsByArea = new Map(areaCounts);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Scegli evento</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Che evento devi organizzare?</h1>
        </div>
        <p className="max-w-2xl text-base leading-8 text-muted">
          Scegli una delle quattro aree. Dentro trovi domande già pronte, conversazioni aperte e consigli pratici.
        </p>
      </div>

      <div className="mt-9 grid gap-6 md:grid-cols-2">
        {MAGAZINE_AREAS.map((area) => (
          <Link
            key={area.slug}
            href={`/categorie/${area.slug}`}
            className="focus-ring group overflow-hidden rounded-xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="relative h-72">
              <img
                src={area.image}
                alt={area.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.02),rgba(47,36,48,0.72))]" />
              <div className="absolute bottom-0 p-5 text-white sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{area.eyebrow}</p>
                <h2 className="mt-2 text-3xl font-semibold">Parliamo di {area.name.toLowerCase()}</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-rose-50">{area.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-line text-sm">
              <div className="p-5">
                <strong className="block text-2xl text-ink">{area.steps.length}</strong>
                <span className="text-muted">domande pronte</span>
              </div>
              <div className="p-5">
                <strong className="block text-2xl text-ink">{countsByArea.get(area.slug) ?? 0}</strong>
                <span className="text-muted">conversazioni</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
