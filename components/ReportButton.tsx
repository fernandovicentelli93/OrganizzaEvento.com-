import { reportAction } from "@/app/actions";

type ReportButtonProps = {
  targetType: "question" | "answer";
  targetId: string;
  returnTo: string;
  status?: "sent" | "error";
};

export function ReportButton({ targetType, targetId, returnTo, status }: ReportButtonProps) {
  return (
    <details className="group rounded-2xl border border-line bg-white p-4 text-sm">
      <summary className="focus-ring cursor-pointer list-none rounded-md font-semibold text-muted transition hover:text-ink">
        Segnala contenuto
      </summary>
      {status === "sent" ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold leading-5 text-emerald-800">
          Segnalazione ricevuta. La controlliamo dal backend.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold leading-5 text-rose-800">
          Segnalazione non inviata. Riprova tra poco o scrivi al supporto.
        </p>
      ) : null}
      <form action={reportAction} className="mt-4 space-y-3">
        <input type="hidden" name="targetType" value={targetType} />
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <input type="hidden" name="formStartedAt" value={Date.now()} />
        <label className="sr-only">
          Non compilare questo campo
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Motivo</span>
          <select
            name="reason"
            required
            className="focus-ring mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2 text-ink"
          >
            <option value="">Scegli un motivo</option>
            <option value="Insulti o contenuto offensivo">Insulti o contenuto offensivo</option>
            <option value="Dati personali di terzi">Dati personali di terzi</option>
            <option value="Accuse non dimostrate">Accuse non dimostrate</option>
            <option value="Spam">Spam</option>
            <option value="Altro">Altro</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Dettagli opzionali</span>
          <textarea
            name="details"
            rows={3}
            className="focus-ring mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2 text-ink"
          />
        </label>
        <button className="focus-ring rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700">
          Invia segnalazione
        </button>
      </form>
    </details>
  );
}
