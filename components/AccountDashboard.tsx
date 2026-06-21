import Link from "next/link";
import type { AccountRole, UserAccount } from "@prisma/client";
import { levelFromPoints, roleLabel } from "@/lib/account";
import { accountPublicTag, clientProfileTags, supplierProfileTags } from "@/lib/account-public";
import { formatDate } from "@/lib/format";
import { matchSuppliers } from "@/lib/supplier-matching-engine";
import { splitStoredList, supplierCategories, supplierEventTypes, supplierPriceRanges, supplierTravelRanges } from "@/lib/supplier-profile";

type DashboardQuestion = {
  id: string;
  title: string;
  slug: string;
  answersCount: number;
  usefulVotes: number;
  createdAt: Date;
};

type DashboardAnswer = {
  id: string;
  content: string;
  usefulVotes: number;
  createdAt: Date;
  question: {
    title: string;
    slug: string;
  };
};

type AccountDashboardProps = {
  account: UserAccount;
  role: AccountRole;
  questions: DashboardQuestion[];
  answers: DashboardAnswer[];
  profileStatus?: string;
  deleteStatus?: string;
};

export function AccountDashboard({ account, role, questions, answers, profileStatus, deleteStatus }: AccountDashboardProps) {
  const level = levelFromPoints(account.activityPoints);
  const publicTag = accountPublicTag(account);
  const nextGoal = account.activityPoints >= 600 ? 600 : account.activityPoints >= 300 ? 600 : account.activityPoints >= 160 ? 300 : account.activityPoints >= 60 ? 160 : 60;
  const progress = Math.min(100, Math.round((account.activityPoints / nextGoal) * 100));
  const isSupplier = role === "supplier";
  const eventTypesServed = splitStoredList(account.eventTypesServed);
  const supplierServices = splitStoredList(account.supplierServices);
  const supplierAreas = splitStoredList(account.serviceAreas);
  const numericMinimumBudget = Number.parseInt((account.minimumBudget ?? "").replace(/[^0-9]/g, ""), 10) || null;
  const supplierMatches = isSupplier
    ? matchSuppliers(
        {
          serviceType: account.supplierCategory ?? supplierServices[0] ?? "eventi",
          province: supplierAreas[0],
          region: account.region ?? undefined,
          budget: numericMinimumBudget ? numericMinimumBudget + 600 : 1200,
          urgency: "media",
          userConsentToShare: false
        },
        [
          {
            id: account.id,
            categoryMain: account.supplierCategory ?? "",
            servicesOffered: supplierServices.length ? supplierServices : [account.supplierCategory ?? ""],
            coveredProvinces: supplierAreas,
            coveredRegions: account.region ? [account.region] : [],
            minimumBudget: numericMinimumBudget,
            reputationScore: Math.min(100, 42 + account.activityPoints / 8),
            responseQualityScore: Math.min(100, 62 + answers.length * 5),
            availabilityScore: 72
          }
        ]
      )
    : [];
  const quoteOpportunities = isSupplier
    ? [
        {
          title: `Preventivo ${account.supplierCategory || "evento"} da leggere`,
          place: [supplierAreas[0] || account.city, account.region].filter(Boolean).join(", ") || "Zona da completare",
          event: eventTypesServed[0] || "Evento privato",
          budget: numericMinimumBudget ? `da ${numericMinimumBudget + 500} euro` : "budget indicativo non dichiarato",
          doubts: ["voci incluse", "extra", "condizioni di conferma"],
          compatibility: supplierMatches[0]?.compatibilityScore ?? Math.min(92, 58 + account.activityPoints / 12)
        },
        {
          title: "Domanda community compatibile",
          place: account.region || "Italia",
          event: eventTypesServed[1] || "Matrimonio",
          budget: "da confrontare",
          doubts: ["domande da fare al fornitore", "tempi", "cosa mettere per iscritto"],
          compatibility: Math.min(88, 52 + answers.length * 6)
        }
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Dashboard {roleLabel(role).toLowerCase()}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Ciao, {account.displayName}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Il profilo pubblico non mostra recapiti. Usa foto, bio e risposte utili per costruire fiducia nella community.
          </p>
        </div>
        <form action="/api/account/logout" method="post">
          <button className="focus-ring rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-petal">
            Esci
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="space-y-5">
          <section className="rounded-xl border border-line bg-white p-5 shadow-soft">
            <div className="flex items-center gap-4">
              {account.photoUrl ? (
                <img src={account.photoUrl} alt="" loading="lazy" decoding="async" className="h-20 w-20 rounded-xl object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-petal text-2xl font-semibold text-violet-cta">
                  {account.displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <span className="inline-flex rounded-lg bg-petal px-3 py-1 text-xs font-semibold text-violet-cta">
                  Badge {roleLabel(role)}
                </span>
                {publicTag ? (
                  <span className="ml-2 inline-flex rounded-lg border border-line bg-cream px-3 py-1 text-xs font-semibold text-muted">
                    {publicTag}
                  </span>
                ) : null}
                <h2 className="mt-2 text-xl font-semibold text-ink">{account.displayName}</h2>
                <p className="text-sm text-muted">{account.city || account.region ? [account.city, account.region].filter(Boolean).join(", ") : "Zona non indicata"}</p>
              </div>
            </div>
            {account.bio ? <p className="mt-4 text-sm leading-6 text-muted">{account.bio}</p> : null}
            {isSupplier ? (
              <div className="mt-4 rounded-xl border border-line bg-cream p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-cta">Scheda fornitore</p>
                <dl className="mt-3 grid gap-3 text-sm">
                  <div>
                    <dt className="font-semibold text-ink">Attività</dt>
                    <dd className="mt-1 text-muted">{account.businessName || "Da completare"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">Categoria</dt>
                    <dd className="mt-1 text-muted">{account.supplierCategory || "Da completare"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">Zone coperte</dt>
                    <dd className="mt-1 text-muted">{account.serviceAreas || "Da completare"}</dd>
                  </div>
                  {eventTypesServed.length ? (
                    <div>
                      <dt className="font-semibold text-ink">Eventi</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {eventTypesServed.map((eventType) => (
                          <span key={eventType} className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-muted">
                            {eventType}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ) : null}
          </section>

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-cta">Reputazione</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{level.name}</h2>
              </div>
              <span className={`rounded-lg border px-3 py-1 text-xs font-semibold ${level.className}`}>{account.activityPoints} punti</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream">
              <div className="h-full rounded-full bg-violet-cta" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              Rispondere bene, aprire discussioni chiare e ricevere cuori utili fa crescere il badge.
            </p>
          </section>

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">Modifica profilo</h2>
            {profileStatus === "ok" ? (
              <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                Profilo aggiornato.
              </p>
            ) : null}
            {profileStatus === "nome" ? (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                Nome pubblico o attività già usati da un altro account.
              </p>
            ) : null}
            <form action="/api/account/profile" method="post" className="mt-4 grid gap-3">
              <label>
                <span className="text-sm font-semibold text-ink">Nome pubblico</span>
                <input name="displayName" defaultValue={account.displayName} required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
              </label>
              <label>
                <span className="text-sm font-semibold text-ink">Cosa fai nella community</span>
                <select
                  name="profileTag"
                  defaultValue={account.profileTag ?? ""}
                  required
                  className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
                >
                  <option value="">Scegli una qualifica</option>
                  {(isSupplier ? supplierProfileTags : clientProfileTags).map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-ink">Foto profilo URL</span>
                <input name="photoUrl" defaultValue={account.photoUrl ?? ""} placeholder="https://..." className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
              </label>
              <label>
                <span className="text-sm font-semibold text-ink">Biografia breve</span>
                <textarea name="bio" defaultValue={account.bio ?? ""} rows={4} className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-semibold text-ink">Città</span>
                  <input name="city" defaultValue={account.city ?? ""} className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
                </label>
                <label>
                  <span className="text-sm font-semibold text-ink">Regione</span>
                  <input name="region" defaultValue={account.region ?? ""} className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
                </label>
              </div>
              {isSupplier ? (
                <section className="rounded-xl border border-[#E8C7D2] bg-petal/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">Mappatura fornitore</p>
                  <div className="mt-4 grid gap-4">
                    <label>
                      <span className="text-sm font-semibold text-ink">Nome attività o studio</span>
                      <input
                        name="businessName"
                        defaultValue={account.businessName ?? ""}
                        required
                        className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label>
                        <span className="text-sm font-semibold text-ink">Categoria principale</span>
                        <select
                          name="supplierCategory"
                          defaultValue={account.supplierCategory ?? ""}
                          required
                          className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                        >
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
                        <select
                          name="priceRange"
                          defaultValue={account.priceRange ?? ""}
                          className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                        >
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
                        defaultValue={account.supplierServices ?? ""}
                        required
                        rows={4}
                        className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                      />
                    </label>
                    <fieldset>
                      <legend className="text-sm font-semibold text-ink">Tipi di evento seguiti</legend>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {supplierEventTypes.map((eventType) => (
                          <label key={eventType} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm text-muted">
                            <input
                              name="eventTypesServed"
                              type="checkbox"
                              value={eventType}
                              defaultChecked={eventTypesServed.includes(eventType)}
                              className="h-4 w-4 accent-[#C9567B]"
                            />
                            <span>{eventType}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label>
                        <span className="text-sm font-semibold text-ink">Zone coperte</span>
                        <input
                          name="serviceAreas"
                          defaultValue={account.serviceAreas ?? ""}
                          required
                          className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                        />
                      </label>
                      <label>
                        <span className="text-sm font-semibold text-ink">Raggio di lavoro</span>
                        <select
                          name="travelRange"
                          defaultValue={account.travelRange ?? ""}
                          className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                        >
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
                          defaultValue={account.minimumBudget ?? ""}
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
                          defaultValue={account.experienceYears ?? ""}
                          className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                        />
                      </label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label>
                        <span className="text-sm font-semibold text-ink">Portfolio</span>
                        <input
                          name="portfolioUrl"
                          defaultValue={account.portfolioUrl ?? ""}
                          placeholder="https://..."
                          className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                        />
                      </label>
                      <label>
                        <span className="text-sm font-semibold text-ink">Sito web</span>
                        <input
                          name="websiteUrl"
                          defaultValue={account.websiteUrl ?? ""}
                          placeholder="https://..."
                          className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                        />
                      </label>
                    </div>
                    <label>
                      <span className="text-sm font-semibold text-ink">Instagram professionale</span>
                      <input
                        name="instagramUrl"
                        defaultValue={account.instagramUrl ?? ""}
                        placeholder="https://..."
                        className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                      />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-ink">Note utili per le richieste</span>
                      <textarea
                        name="availabilityNotes"
                        defaultValue={account.availabilityNotes ?? ""}
                        rows={3}
                        className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
                      />
                    </label>
                  </div>
                </section>
              ) : null}
              <button className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white">Salva profilo</button>
            </form>
          </section>
        </aside>

        <main className="space-y-5">
          <section className="grid gap-3 sm:grid-cols-3">
            <Metric label="Domande" value={questions.length} />
            <Metric label="Risposte" value={answers.length} />
            <Metric label="Cuori ricevuti" value={questions.reduce((sum, item) => sum + item.usefulVotes, 0) + answers.reduce((sum, item) => sum + item.usefulVotes, 0)} />
          </section>

          {isSupplier ? (
            <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-cta">Rispondi dove puoi aiutare davvero</p>
                  <h2 className="mt-2 text-xl font-semibold text-ink">Preventivi da leggere</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Qui arriveranno richieste anonimizzate dal tool preventivo. Niente file originali, niente recapiti: solo dubbi chiari a cui rispondere con competenza.
                  </p>
                </div>
                <span className="rounded-xl bg-petal px-3 py-2 text-xs font-semibold text-violet-cta">Brief protetti</span>
              </div>
              <div className="mt-5 grid gap-3">
                {quoteOpportunities.map((opportunity) => (
                  <article key={opportunity.title} className="rounded-xl border border-line bg-cream p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-ink">{opportunity.title}</h3>
                        <p className="mt-1 text-sm text-muted">
                          {opportunity.event} - {opportunity.place} - {opportunity.budget}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">
                        Compatibilita {Math.round(opportunity.compatibility)}%
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {opportunity.doubts.map((doubt) => (
                        <span key={doubt} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted">
                          {doubt}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-line bg-white p-3 text-sm leading-6 text-muted">
                      Rispondi spiegando cosa controllare, quali domande fare e quali extra mettere per iscritto. Evita recapiti, link e vendita diretta: la piattaforma protegge il confronto.
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-ink">Le tue conversazioni</h2>
              <Link href="/fai-domanda" className="focus-ring rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white">
                Nuova domanda
              </Link>
            </div>
            <div className="mt-4 grid gap-3">
              {questions.length ? (
                questions.map((question) => (
                  <Link key={question.id} href={`/domande/${question.slug}`} className="focus-ring rounded-xl bg-cream p-4 transition hover:bg-petal">
                    <span className="block text-sm font-semibold text-ink">{question.title}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {question.answersCount} risposte - {question.usefulVotes} cuori - {formatDate(question.createdAt)}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="rounded-xl bg-cream p-4 text-sm text-muted">Non hai ancora aperto conversazioni con questo account.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">Le tue risposte</h2>
            <div className="mt-4 grid gap-3">
              {answers.length ? (
                answers.map((answer) => (
                  <Link key={answer.id} href={`/domande/${answer.question.slug}#risposte`} className="focus-ring rounded-xl bg-cream p-4 transition hover:bg-petal">
                    <span className="block text-sm font-semibold text-ink">{answer.question.title}</span>
                    <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted">{answer.content}</span>
                  </Link>
                ))
              ) : (
                <p className="rounded-xl bg-cream p-4 text-sm text-muted">Quando rispondi a una conversazione, la trovi qui.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-rose-100 bg-rose-50 p-5">
            <h2 className="text-xl font-semibold text-ink">Cancella account</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              L'account viene disattivato e il profilo rimosso. Le conversazioni già pubblicate possono restare visibili senza dati personali.
            </p>
            {deleteStatus === "errore" ? <p className="mt-3 text-sm font-semibold text-rose-800">Scrivi CANCELLA per confermare.</p> : null}
            <form action="/api/account/delete" method="post" className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input name="confirm" placeholder="Scrivi CANCELLA" className="focus-ring min-h-11 flex-1 rounded-xl border border-line bg-white px-4 py-2 text-ink" />
              <button className="focus-ring rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">Cancella</button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
    </article>
  );
}
