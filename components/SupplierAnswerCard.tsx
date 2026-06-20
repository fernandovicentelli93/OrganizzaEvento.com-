import Link from "next/link";

type SupplierAnswerCardProps = {
  businessName: string;
  category: string;
  services: string[];
  areas: string[];
  badgeLevel: string;
  usefulAnswersCount: number;
  body: string;
  profileHref?: string;
  vibesProfileLinked?: boolean;
};

export function SupplierAnswerCard({
  businessName,
  category,
  services,
  areas,
  badgeLevel,
  usefulAnswersCount,
  body,
  profileHref = "/fornitori",
  vibesProfileLinked = false
}: SupplierAnswerCardProps) {
  return (
    <article className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">{businessName}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{category}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {services.slice(0, 4).map((service) => (
              <span key={service} className="rounded-full bg-petal px-3 py-1 text-xs font-semibold text-violet-cta">
                {service}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-cream px-4 py-3 text-xs font-semibold leading-5 text-muted">
          <p>Badge {badgeLevel}</p>
          <p>{usefulAnswersCount} risposte utili</p>
          {vibesProfileLinked ? <p>Profilo Vibes Planner collegato</p> : null}
        </div>
      </div>
      {areas.length ? <p className="mt-4 text-sm leading-6 text-muted">Zone: {areas.join(", ")}</p> : null}
      <p className="mt-4 rounded-xl bg-cream p-4 text-sm leading-7 text-ink">{body}</p>
      <Link href={profileHref} className="focus-ring mt-4 inline-flex rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-petal">
        Vedi profilo
      </Link>
    </article>
  );
}
