import Link from "next/link";
import { categoryPublicName } from "@/lib/constants";

type CategoryCardProps = {
  category: {
    name: string;
    slug: string;
    description: string;
    _count?: { questions: number };
  };
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categorie/${category.slug}`}
      className="focus-ring block rounded-xl border border-line bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{categoryPublicName(category)}</h3>
        {typeof category._count?.questions === "number" ? (
          <span className="rounded-lg bg-cream px-2.5 py-1 text-xs font-medium text-muted">
            {category._count.questions}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{category.description}</p>
    </Link>
  );
}
