import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">{description}</p>
      <Link
        href="/fai-domanda"
        className="focus-ring mt-5 inline-flex rounded-full bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-hover"
      >
        Fai una domanda
      </Link>
    </div>
  );
}
