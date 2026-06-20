type SearchBarProps = {
  categories: { id: string; name: string; slug: string }[];
  q?: string;
  category?: string;
  postType?: string;
  eventPhase?: string;
};

export function SearchBar({ q = "" }: SearchBarProps) {
  return (
    <form action="/domande" className="max-w-3xl rounded-2xl border border-line bg-white p-3 text-ink shadow-sm">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">
        Cerca tra le domande già aperte
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Cerca conversazioni</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Es. caparra alta, DJ, open bar, location cara..."
            className="focus-ring min-h-12 w-full rounded-xl border border-line bg-cream px-5 py-3 text-sm text-ink placeholder:text-muted"
          />
        </label>
        <button className="focus-ring min-h-12 rounded-xl bg-violet-cta px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
          Cerca
        </button>
      </div>
    </form>
  );
}
