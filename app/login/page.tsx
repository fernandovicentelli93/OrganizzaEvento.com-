import type { Metadata } from "next";
import Link from "next/link";
import { GoogleIcon } from "@/components/GoogleIcon";
import { selfAlternates } from "@/lib/i18n-routing";

export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi alla tua dashboard cliente o fornitore su OrganizzaEvento.com.",
  alternates: selfAlternates("it", { type: "static", key: "login" })
};

type PageProps = {
  searchParams?: Promise<{ errore?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const startedAt = Date.now();
  const googleHref = "/api/auth/google/start?locale=it&returnTo=%2Flogin";
  const errorMessages: Record<string, string> = {
    "1": "Email o password non corretta.",
    google_config: "Accesso Google non ancora configurato sul server.",
    google_denied: "Accesso Google annullato.",
    google_state: "Sessione Google scaduta. Riprova.",
    google_email: "Google non ha confermato l'email dell'account.",
    google_account: "Questo account non può accedere al momento.",
    google: "Accesso Google non riuscito. Riprova tra poco."
  };
  const errorMessage = params.errore ? errorMessages[params.errore] : null;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <section className="w-full rounded-xl border border-line bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Area personale</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Accedi alla dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-muted">L'iscrizione non è obbligatoria, ma ti aiuta a gestire profilo e attività.</p>

        {errorMessage ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            {errorMessage}
          </p>
        ) : null}

        <Link
          href={googleHref}
          className="focus-ring mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink transition hover:bg-petal"
        >
          <GoogleIcon />
          Continua con Google
        </Link>

        <form action="/api/account/login" method="post" className="mt-5 grid gap-4">
          <input type="hidden" name="loginPath" value="/login" />
          <input type="hidden" name="formStartedAt" value={startedAt} />
          <label className="sr-only">
            Non compilare questo campo
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Email</span>
            <input name="email" type="email" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Password</span>
            <input
              name="password"
              type="password"
              required
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
            />
          </label>
          <button className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
            Entra
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Non hai un account?{" "}
          <Link href="/registrati" className="font-semibold text-violet-cta">
            Iscriviti
          </Link>
        </p>
      </section>
    </div>
  );
}
