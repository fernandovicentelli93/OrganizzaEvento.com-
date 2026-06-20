import { voteAction } from "@/app/actions";

type VoteButtonsProps = {
  targetType: "question" | "answer";
  targetId: string;
  usefulVotes: number;
  notUsefulVotes: number;
  returnTo: string;
  compact?: boolean;
};

export function VoteButtons({ targetType, targetId, usefulVotes, notUsefulVotes, returnTo, compact }: VoteButtonsProps) {
  const baseButton =
    "focus-ring min-h-11 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-cta";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? "text-sm" : ""}`} aria-label="Voti contenuto">
      <form action={voteAction}>
        <input type="hidden" name="targetType" value={targetType} />
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="voteType" value="useful" />
        <input type="hidden" name="returnTo" value={returnTo} />
        <button className={baseButton} type="submit" aria-label="Metti cuore utile">
          ♥ {usefulVotes}
        </button>
      </form>
      <form action={voteAction}>
        <input type="hidden" name="targetType" value={targetType} />
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="voteType" value="not_useful" />
        <input type="hidden" name="returnTo" value={returnTo} />
        <button className={baseButton} type="submit" aria-label="Segna non utile">
          Non utile {notUsefulVotes}
        </button>
      </form>
    </div>
  );
}
