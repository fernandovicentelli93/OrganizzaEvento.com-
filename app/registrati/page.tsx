import type { Metadata } from "next";
import Link from "next/link";
import { GoogleIcon } from "@/components/GoogleIcon";
import { selfAlternates } from "@/lib/i18n-routing";
import { clientProfileTags, supplierProfileTags } from "@/lib/account-public";
import { supplierCategories, supplierEventTypes, supplierPriceRanges, supplierTravelRanges } from "@/lib/supplier-profile";

export const metadata: Metadata = {
  title: "Iscriviti",
  description: "Crea un account cliente o fornitore su OrganizzaEvento.com. L'iscrizione non è obbligatoria per usare il forum.",
  alternates: selfAlternates("it", { type: "static", key: "signup" })
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ tipo?: string; errore?: string }>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const selectedRole = params.tipo === "fornitore" ? "supplier" : "client";
  const startedAt = Date.now();
  const googleSignupReturnTo = selectedRole === "supplier" ? "/registrati?tipo=fornitore" : "/registrati?tipo=cliente";
  const googleSignupHref = `/api/auth/google/start?mode=signup&role=${selectedRole}&locale=it&returnTo=${encodeURIComponent(googleSignupReturnTo)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Account facoltativo</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Iscriviti solo se vuoi tenere tutto in ordine.</h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Puoi continuare a usare la community senza registrarti. L'account serve per salvare profilo, dashboard,
            badge e attività.
          </p>

          <div className="mt-6 grid gap-3">
            <Link
              href="/registrati?tipo=cliente"
              className={`focus-ring rounded-xl border p-4 transition ${
                selectedRole === "client" ? "border-violet-cta bg-petal" : "border-line bg-white hover:bg-cream"
              }`}
            >
              <span className="inline-flex rounded-lg bg-white px-3 py-1 text-xs font-semibold text-violet-cta">Badge cliente</span>
              <h2 className="mt-3 text-xl font-semibold text-ink">Cliente</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Per seguire conversazioni, fare domande e salvare il tuo profilo.</p>
            </Link>
            <Link
              href="/registrati?tipo=fornitore"
              className={`focus-ring rounded-xl border p-4 transition ${
                selectedRole === "supplier" ? "border-violet-cta bg-petal" : "border-line bg-white hover:bg-cream"
              }`}
            >
              <span className="inline-flex rounded-lg bg-white px-3 py-1 text-xs font-semibold text-violet-cta">Badge fornitore</span>
              <h2 className="mt-3 text-xl font-semibold text-ink">Fornitore</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Per rispondere con autorevolezza e costruire reputazione nella community.</p>
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-white p-5 shadow-soft sm:p-7">
          {params.errore ? (
            <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
              {params.errore === "esiste"
                ? "Questa email è già registrata."
                : params.errore === "nome"
                  ? "Questo nome pubblico o nome attività è già usato da un profilo registrato."
                  : "Controlla i campi e riprova."}
            </p>
          ) : null}
          <Link
            href={googleSignupHref}
            className="focus-ring flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink transition hover:bg-petal"
          >
            <GoogleIcon />
            Continua con Google come {selectedRole === "supplier" ? "fornitore" : "cliente"}
          </Link>
          <p className="mt-2 text-center text-xs leading-5 text-muted">
            Se l'account non esiste, lo creiamo con il ruolo selezionato.
          </p>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            <span className="h-px flex-1 bg-line" />
            oppure email
            <span className="h-px flex-1 bg-line" />
          </div>

          <form action="/api/account/register" method="post" className="grid gap-4">
            <input type="hidden" name="role" value={selectedRole} />
            <input type="hidden" name="signupPath" value="/registrati" />
            <input type="hidden" name="formStartedAt" value={startedAt} />
            <label className="sr-only">
              Non compilare questo campo
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <label>
              <span className="text-sm font-semibold text-ink">Nome pubblico</span>
              <input name="displayName" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
              <span className="mt-1 block text-xs leading-5 text-muted">Non può essere uguale a un cliente o fornitore già iscritto.</span>
            </label>
            <label>
              <span className="text-sm font-semibold text-ink">Cosa fai nella community</span>
              <select name="profileTag" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink">
                <option value="">Scegli una qualifica</option>
                {(selectedRole === "supplier" ? supplierProfileTags : clientProfileTags).map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs leading-5 text-muted">Comparirà accanto al tuo nome quando scrivi.</span>
            </label>
            <label>
              <span className="text-sm font-semibold text-ink">Email privata</span>
              <input name="email" type="email" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
            </label>
            <label>
              <span className="text-sm font-semibold text-ink">Password</span>
              <input
                name="password"
                type="password"
                minLength={8}
                required
                className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
              />
            </label>
            {selectedRole === "supplier" ? (
              <section className="rounded-xl border border-[#E8C7D2] bg-petal/60 p-4">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">Mappatura fornitore</p>
                  <h2 className="mt-2 text-xl font-semibold text-ink">Dicci cosa fai e dove lavori.</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Questi dati ci aiutano a capire quali richieste possono essere adatte a te. Non inserire telefoni,
                    email o contatti diretti nel profilo pubblico.
                  </p>
                </div>

                <div className="grid gap-4">
                  <label>
                    <span className="text-sm font-semibold text-ink">Nome attività o studio</span>
                    <input
                      name="businessName"
                      required
                      placeholder="Es. Studio Rossi Eventi"
                      className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-ink">Categoria principale</span>
                      <select name="supplierCategory" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink">
                        <option value="">Scegli categoria</option>
                        {supplierCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-ink">Fascia indicativa</span>
                      <select name="priceRange" className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink">
                        <option value="">Non indicata</option>
                        {supplierPriceRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label>
                    <span className="text-sm font-semibold text-ink">Servizi offerti</span>
                    <textarea
                      name="supplierServices"
                      required
                      rows={4}
                      placeholder="Es. menù matrimonio, buffet, open bar, torta, personale di sala..."
                      className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                    />
                  </label>

                  <fieldset>
                    <legend className="text-sm font-semibold text-ink">Tipi di evento seguiti</legend>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {supplierEventTypes.map((eventType) => (
                        <label key={eventType} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm text-muted">
                          <input name="eventTypesServed" type="checkbox" value={eventType} className="h-4 w-4 accent-[#C9567B]" />
                          <span>{eventType}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">Seleziona almeno un tipo di evento.</p>
                  </fieldset>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-ink">Città base</span>
                      <input name="city" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink" />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-ink">Regione</span>
                      <input name="region" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink" />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-ink">Zone coperte</span>
                      <input
                        name="serviceAreas"
                        required
                        placeholder="Es. Roma, Castelli Romani, Lazio"
                        className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                      />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-ink">Raggio di lavoro</span>
                      <select name="travelRange" className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink">
                        <option value="">Non indicato</option>
                        {supplierTravelRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-ink">Budget minimo indicativo</span>
                      <input
                        name="minimumBudget"
                        placeholder="Es. da 1.500 euro"
                        className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                      />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-ink">Anni di esperienza</span>
                      <input
                        name="experienceYears"
                        type="number"
                        min="0"
                        max="60"
                        className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-ink">Portfolio o sito</span>
                      <input
                        name="portfolioUrl"
                        type="url"
                        placeholder="https://..."
                        className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                      />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-ink">Instagram professionale</span>
                      <input
                        name="instagramUrl"
                        type="url"
                        placeholder="https://..."
                        className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                      />
                    </label>
                  </div>

                  <label>
                    <span className="text-sm font-semibold text-ink">Note utili per le richieste</span>
                    <textarea
                      name="availabilityNotes"
                      rows={3}
                      placeholder="Es. lavoro soprattutto nei weekend, accetto richieste con almeno 30 giorni di anticipo..."
                      className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                    />
                  </label>
                </div>
              </section>
            ) : null}
            <label className="flex gap-3 rounded-xl border border-line bg-petal px-4 py-3 text-sm leading-6 text-muted">
              <input name="privacyAccepted" type="checkbox" value="yes" required className="mt-1 h-4 w-4 shrink-0 accent-[#C9567B]" />
              <span>
                Accetto privacy e regole. Il profilo pubblico non deve contenere recapiti, telefoni, email o link di contatto.
              </span>
            </label>
            <button className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
              Crea account {selectedRole === "supplier" ? "fornitore" : "cliente"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            Hai già un account{" "}
            <Link href="/login" className="font-semibold text-violet-cta">
              Entra
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
