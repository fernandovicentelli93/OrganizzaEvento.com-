import Link from "next/link";
import { answerHelpfulnessSignal } from "@/lib/engagement";
import { formatDate, publicName } from "@/lib/format";
import { displayQuestionTitle } from "@/lib/question-title-overrides";

type UsefulAnswersStripProps = {
  answers: {
    id: string;
    content: string;
    displayMode: "anonymous" | "nickname" | "real_name";
    displayName?: string | null;
    usefulVotes: number;
    createdAt: Date;
    question: {
      title: string;
      slug: string;
    };
  }[];
};

export function UsefulAnswersStrip({ answers }: UsefulAnswersStripProps) {
  if (!answers.length) return null;
  const fallbackAuthors = ["Giulia", "Marco", "budget_sotto_controllo"];

  return (
    <section className="rounded-2xl border border-line bg-ink p-5 text-white shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">Risposte da leggere</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Consigli che hanno fatto risparmiare tempo a qualcuno.
          </h2>
        </div>
        <Link href="/domande" className="focus-ring rounded-xl px-3 py-2 text-sm font-semibold text-rose-100">
          Vedi le domande
        </Link>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {answers.map((answer, index) => {
          const author = answer.displayMode === "anonymous" ? fallbackAuthors[index % fallbackAuthors.length] : publicName(answer.displayMode, answer.displayName);
          return (
          <Link
            key={answer.id}
            href={`/domande/${answer.question.slug}#risposta-${answer.id}`}
            className="focus-ring rounded-xl border border-white/10 bg-white/10 p-4 transition hover:bg-white/20"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-100">
              {answer.usefulVotes} cuori - {answerHelpfulnessSignal(answer.id)}% utile
            </p>
            <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6">{displayQuestionTitle(answer.question.title)}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-rose-50">{answer.content}</p>
            <p className="mt-3 text-xs text-rose-100">
              {author} - {formatDate(answer.createdAt)}
            </p>
          </Link>
        )})}
      </div>
    </section>
  );
}
