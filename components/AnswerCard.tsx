import type { AccountRole, DisplayMode } from "@prisma/client";
import { accountPublicTag } from "@/lib/account-public";
import { formatDate, publicName } from "@/lib/format";
import { ReportButton } from "@/components/ReportButton";
import { TagBadge } from "@/components/TagBadge";
import { VoteButtons } from "@/components/VoteButtons";

type AnswerCardProps = {
  answer: {
    id: string;
    content: string;
    displayMode: DisplayMode;
    displayName?: string | null;
    account?: {
      role?: AccountRole | null;
      profileTag?: string | null;
      supplierCategory?: string | null;
      businessName?: string | null;
    } | null;
    usefulVotes: number;
    notUsefulVotes: number;
    isBestAnswer: boolean;
    createdAt: Date;
  };
  returnTo: string;
};

export function AnswerCard({ answer, returnTo }: AnswerCardProps) {
  const publicTag = accountPublicTag(answer.account);
  return (
    <article
      id={`risposta-${answer.id}`}
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        answer.isBestAnswer ? "border-emerald-300 ring-2 ring-emerald-100" : "border-line"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="rounded-lg bg-petal px-2.5 py-1 text-xs font-semibold text-violet-cta">Risposta</span>
          <span className="font-semibold text-ink">{publicName(answer.displayMode, answer.displayName)}</span>
          {publicTag ? <TagBadge>{publicTag}</TagBadge> : null}
          <time dateTime={answer.createdAt.toISOString()}>{formatDate(answer.createdAt)}</time>
          {answer.isBestAnswer ? <TagBadge tone="green">Risposta più utile</TagBadge> : null}
        </div>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink">{answer.content}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <VoteButtons
          targetType="answer"
          targetId={answer.id}
          usefulVotes={answer.usefulVotes}
          notUsefulVotes={answer.notUsefulVotes}
          returnTo={returnTo}
          compact
        />
        <div className="sm:w-64">
          <ReportButton targetType="answer" targetId={answer.id} returnTo={returnTo} />
        </div>
      </div>
    </article>
  );
}
