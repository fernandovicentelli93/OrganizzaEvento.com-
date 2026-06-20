import type { CaptchaChallenge } from "@/lib/captcha";

type CaptchaFieldsProps = {
  challenge: CaptchaChallenge;
  startedAt: number;
  compact?: boolean;
};

export function CaptchaFields({ challenge, startedAt, compact = false }: CaptchaFieldsProps) {
  return (
    <div className={compact ? "rounded-xl border border-line bg-cream p-3" : "rounded-2xl border border-line bg-cream p-4"}>
      <input type="hidden" name="captchaToken" value={challenge.token} />
      <input type="hidden" name="captchaSignature" value={challenge.signature} />
      <input type="hidden" name="formStartedAt" value={startedAt} />
      <label className="block">
        <span className="text-sm font-semibold text-ink">Controllo anti-spam *</span>
        <span className="mt-1 block text-xs leading-5 text-muted">
          Quanto fa {challenge.question}à Serve per bloccare invii automatici. Non serve registrazione.
        </span>
        <input
          name="captchaAnswer"
          inputMode="numeric"
          pattern="[0-9]*"
          required
          className="focus-ring mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink"
          placeholder="Risposta"
        />
      </label>
      <label className="sr-only">
        Non compilare questo campo
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
