import Image from "next/image";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import type { CaptchaChallenge } from "@/lib/captcha";
import { VIBES_PLANNER_CLIENT_REQUEST_URL } from "@/lib/constants";

type SupplierHelpNudgeProps = {
  questionSlug: string;
  questionTitle: string;
  eventType: string | null;
  city: string | null;
  region: string | null;
  peopleCount: number | null;
  budgetRange: string | null;
  captcha: CaptchaChallenge;
  startedAt: number;
  sent?: boolean;
};

export function SupplierHelpNudge({
  questionTitle,
  eventType,
  city,
  region,
  peopleCount,
  budgetRange,
  sent = false
}: SupplierHelpNudgeProps) {
  return (
    <aside className="mt-6 rounded-2xl border border-line bg-white/70 p-3 text-sm shadow-sm">
      {sent ? (
        <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          Richiesta fornitori inviata.
        </p>
      ) : null}
      <details className="group">
        <summary className="cursor-pointer list-none rounded-xl px-2 py-2 font-semibold text-ink transition hover:bg-cream">
          <span>Cerchi fornitori?</span>{" "}
          <span className="font-normal text-muted">
            Collaboriamo con Vibes Planner per aiutarti a trovare fornitori adatti al tuo evento.
          </span>
        </summary>
        <div className="mt-3 grid gap-4 border-t border-line pt-3 lg:grid-cols-[1fr_9.5rem]">
          <div className="rounded-xl bg-cream p-4">
            <p className="text-sm font-semibold leading-6 text-ink">{questionTitle}</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Apri una richiesta con tipo evento, zona, budget e numero persone: il percorso continua su Vibes Planner
              senza pubblicare i tuoi contatti nella community.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
              {eventType ? <span className="rounded-lg bg-white px-2.5 py-1">{eventType}</span> : null}
              {city ? <span className="rounded-lg bg-white px-2.5 py-1">{city}</span> : null}
              {region ? <span className="rounded-lg bg-white px-2.5 py-1">{region}</span> : null}
              {peopleCount ? <span className="rounded-lg bg-white px-2.5 py-1">{peopleCount} persone</span> : null}
              {budgetRange ? <span className="rounded-lg bg-white px-2.5 py-1">{budgetRange}</span> : null}
            </div>
            <VibesSupplierCta variant="pink" className="mt-4">
              Apri richiesta fornitori
            </VibesSupplierCta>
          </div>
          <a
            href={VIBES_PLANNER_CLIENT_REQUEST_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="focus-ring hidden self-start overflow-hidden rounded-lg border border-line bg-white p-1 shadow-sm transition hover:-translate-y-0.5 lg:block"
            aria-label="Apri richiesta fornitori su Vibes Planner"
          >
            <Image
              src="/partners/vibes-planner/banner-square.jpg"
              alt="Vibes Planner"
              width={395}
              height={395}
              className="aspect-square h-auto w-full rounded-md object-cover"
            />
          </a>
        </div>
      </details>
    </aside>
  );
}
