import { subscribeToQuestionUpdates } from "@/app/actions";

type QuestionNotifyFormProps = {
  questionSlug: string;
  returnTo: string;
  status?: "ok" | "error";
};

export function QuestionNotifyForm({ questionSlug, returnTo, status }: QuestionNotifyFormProps) {
  const startedAt = Date.now();

  return (
    <details className="rounded-2xl border border-line bg-white p-4 text-sm shadow-sm">
      <summary className="focus-ring cursor-pointer list-none rounded-md font-semibold text-ink">
        Avvisami quando arrivano nuove risposte
      </summary>
      <p className="mt-2 text-sm leading-6 text-muted">
        Lascia la tua email: ti avvisiamo quando la conversazione riceve nuove risposte. Non serve registrarsi.
      </p>
      {status === "ok" ? (
        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          Fatto, ti avviseremo alle prossime risposte.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">
          Non sono riuscito a salvare l'avviso. Controlla la mail e riprova.
        </p>
      ) : null}
      <form action={subscribeToQuestionUpdates} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input type="hidden" name="questionSlug" value={questionSlug} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <input type="hidden" name="formStartedAt" value={startedAt} />
        <label className="sr-only">
          Non compilare questo campo
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label>
          <span className="sr-only">Email per avvisi risposte</span>
          <input
            name="email"
            type="email"
            required
            placeholder="La tua email"
            className="focus-ring min-h-11 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink"
          />
        </label>
        <button className="focus-ring rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-cta">
          Avvisami
        </button>
      </form>
    </details>
  );
}
