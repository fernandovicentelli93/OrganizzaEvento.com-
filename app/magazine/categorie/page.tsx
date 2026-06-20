import type { Metadata } from "next";
import Link from "next/link";
import { EDITORIAL_CATEGORIES } from "@/lib/editorial";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Catégorie Magazine",
  description:
    "Sottocategorie editoriali del magazine OrganizzaEvento.com: matrimoni, costi, feste private, eventi aziendali, catering e idee evento.",
  alternates: {
    canonical: "/magazine/categorie"
  }
};

export const dynamic = "force-dynamic";

export default async function MagazineCategoriesPage() {
  const counts = await Promise.all(
    EDITORIAL_CATEGORIES.map(async (category) => {
      const count = await prisma.editorialArticle.count({
        where: {
          status: "published",
          publishedAt: { lte: new Date() },
          category: { in: category.articleCategories }
        }
      });
      return [category.slug, count] as const;
    })
  );
  const countsBySlug = new Map(counts);

  return (
    <div className="bg-[#fffaf6]">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Magazine</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Sottocategorie editoriali.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          Ogni area raccoglie articoli da leggere prima di scegliere fornitori, budget o stile dell'evento.
        </p>

        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EDITORIAL_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/magazine/categorie/${category.slug}`}
              className="focus-ring group overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="relative h-52">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.02),rgba(47,36,48,0.68))]" />
                <div className="absolute bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{category.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{category.name}</h2>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-muted">{category.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">
                  {countsBySlug.get(category.slug) ?? 0} articoli
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
