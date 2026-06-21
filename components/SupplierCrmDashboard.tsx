import Link from "next/link";
import type { ReactNode } from "react";
import type { UserAccount } from "@prisma/client";
import { GoogleIcon } from "@/components/GoogleIcon";
import { TagBadge } from "@/components/TagBadge";
import { levelFromPoints } from "@/lib/account";
import { accountPublicTag, supplierProfileTags } from "@/lib/account-public";
import { formatDate } from "@/lib/format";
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

type SupplierCrmDashboardProps = {
  account: UserAccount;
  questions: DashboardQuestion[];
  answers: DashboardAnswer[];
  section?: string;
  profileStatus?: string;
  deleteStatus?: string;
};

const navItems = [
  { id: "piattaforma", label: "Fornitori in piattaforma", helper: "Vista centrale" },
  { id: "vetrina", label: "La mia vetrina", helper: "Profilo pubblico" },
  { id: "preferiti", label: "Preferiti", helper: "Conversazioni salvate" },
  { id: "contatti", label: "Contatti", helper: "Richieste e risposte" },
  { id: "statistiche", label: "Statistiche", helper: "Punti e crescita" },
  { id: "profilo", label: "Gestione profilo", helper: "Account e privacy" }
];

function activeSection(value?: string) {
  return navItems.some((item) => item.id === value) ? value! : "piattaforma";
}

function completionScore(account: UserAccount) {
  const eventTypes = splitStoredList(account.eventTypesServed);
  const checks = [
    account.displayName,
    account.profileTag,
    account.businessName,
    account.supplierCategory,
    account.supplierServices,
    account.serviceAreas,
    eventTypes.length ? "eventi" : "",
    account.city,
    account.region,
    account.bio,
    account.photoUrl,
    account.priceRange || account.minimumBudget,
    account.travelRange,
    account.portfolioUrl || account.websiteUrl || account.instagramUrl
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("");
}

function textPreview(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 145);
}

function LegacyCrmShell({
  account,
  section,
  children
}: {
  account: UserAccount;
  section: string;
  children: ReactNode;
}) {
  const googleConnected = account.authProvider.split("+").includes("google");
  const publicTag = accountPublicTag(account);

  return (
    <div className="mx-auto max-w-[1480px] px-3 py-6 sm:px-4 lg:px-6">
      <div className="overflow-hidden rounded-[1.15rem] border border-line bg-white shadow-soft">
        <div className="grid min-h-[calc(100vh-150px)] lg:grid-cols-[290px_1fr]">
          <aside className="border-b border-line bg-[#FFF8FB] lg:border-b-0 lg:border-r">
            <div className="p-5">
              <Link href="/" className="text-sm font-semibold text-violet-cta">
                OrganizzaEvento.com
              </Link>
              <div className="mt-5 flex items-center gap-3 rounded-[0.9rem] border border-line bg-white p-3">
                {account.photoUrl ? (
                  <img src={account.photoUrl} alt="" className="h-12 w-12 rounded-[0.7rem] object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-[0.7rem] bg-petal text-sm font-bold text-violet-cta">
                    {initials(account.displayName)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{account.businessName || account.displayName}</p>
                  <p className="truncate text-xs text-muted">{publicTag || "Fornitore"}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1 px-3 pb-5">
              {navItems.map((item) => {
                const selected = item.id === section;
                return (
                  <Link
                    key={item.id}
                    href={`/dashboard/fornitore?sezione=${item.id}`}
                    className={`focus-ring block rounded-[0.9rem] border px-4 py-3 transition ${
                      selected ? "border-[#E7B8C8] bg-white text-violet-cta shadow-sm" : "border-transparent text-ink hover:border-line hover:bg-white"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="mt-1 block text-xs text-muted">{item.helper}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-line p-4">
              <div className="rounded-[0.9rem] border border-line bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Accesso</p>
                <p className="mt-2 text-sm font-semibold text-ink">{googleConnected ? "Google collegato" : "Google non collegato"}</p>
                {googleConnected ? (
                  <p className="mt-2 text-xs leading-5 text-muted">Puoi entrare più velocemente con il tuo account Google.</p>
                ) : (
                  <Link
                    href="/api/auth/google/start?role=supplier&locale=it&returnTo=%2Fdashboard%2Ffornitore"
                    className="focus-ring mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[0.7rem] border border-line bg-cream px-3 py-2 text-xs font-semibold text-ink"
                  >
                    <GoogleIcon />
                    Usa Google
                  </Link>
                )}
              </div>
              <form action="/api/account/logout" method="post" className="mt-3">
                <button className="focus-ring w-full rounded-[0.8rem] border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-petal">
                  Esci
                </button>
              </form>
            </div>
          </aside>

          <main className="bg-[#FFFDF8] p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function CrmShell({
  account,
  section,
  children
}: {
  account: UserAccount;
  section: string;
  children: ReactNode;
}) {
  const googleConnected = account.authProvider.split("+").includes("google");
  const publicTag = accountPublicTag(account);

  return (
    <div className="mx-auto max-w-[1480px] px-3 py-6 sm:px-4 lg:px-6">
      <div className="overflow-hidden rounded-[1.15rem] border border-line bg-white shadow-soft">
        <div className="border-b border-line bg-[#FFF8FB] p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <details className="group relative">
                <summary className="focus-ring flex min-h-12 cursor-pointer list-none items-center justify-between rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white sm:min-w-[240px]">
                  <span>Menu dashboard</span>
                  <span className="text-xs opacity-80 group-open:rotate-180">▼</span>
                </summary>
                <nav className="z-30 mt-3 grid gap-2 rounded-md border border-line bg-white p-3 shadow-soft sm:absolute sm:left-0 sm:top-full sm:w-[330px]">
                  {navItems.map((item) => {
                    const selected = item.id === section;
                    return (
                      <Link
                        key={item.id}
                        href={`/dashboard/fornitore?sezione=${item.id}`}
                        className={`focus-ring rounded-md border px-4 py-3 transition ${
                          selected ? "border-[#E7B8C8] bg-[#FFF3F7] text-violet-cta" : "border-line bg-white text-ink hover:bg-cream"
                        }`}
                      >
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className="mt-1 block text-xs text-muted">{item.helper}</span>
                      </Link>
                    );
                  })}
                </nav>
              </details>

              <div className="flex items-center gap-3 rounded-[0.9rem] border border-line bg-white p-3">
                {account.photoUrl ? (
                  <img src={account.photoUrl} alt="" className="h-12 w-12 rounded-[0.7rem] object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-[0.7rem] bg-petal text-sm font-bold text-violet-cta">
                    {initials(account.displayName)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{account.businessName || account.displayName}</p>
                  <p className="truncate text-xs text-muted">{publicTag || "Fornitore"}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-[0.9rem] border border-line bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Accesso</p>
                <p className="mt-1 text-sm font-semibold text-ink">{googleConnected ? "Google collegato" : "Google non collegato"}</p>
              </div>
              {googleConnected ? null : (
                <Link
                  href="/api/auth/google/start?role=supplier&locale=it&returnTo=%2Fdashboard%2Ffornitore"
                  className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-cream"
                >
                  <GoogleIcon />
                  Usa Google
                </Link>
              )}
              <form action="/api/account/logout" method="post">
                <button className="focus-ring min-h-11 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-petal">
                  Esci
                </button>
              </form>
            </div>
          </div>
        </div>

        <main className="min-h-[calc(100vh-240px)] bg-[#FFFDF8] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function PlatformOverview({ account, questions, answers }: Pick<SupplierCrmDashboardProps, "account" | "questions" | "answers">) {
  const score = completionScore(account);
  const level = levelFromPoints(account.activityPoints);
  const eventTypes = splitStoredList(account.eventTypesServed);
  const services = splitStoredList(account.supplierServices);
  const areas = splitStoredList(account.serviceAreas);
  const profileReady = score >= 70;
  const stats = [
    { label: "Risposte", value: answers.length, helper: "Conversazioni community" },
    { label: "Domande aperte", value: questions.length, helper: "Contenuti pubblicati" },
    { label: "Profilo", value: profileReady ? "Completo" : "Da completare", helper: `${score}% compilato` },
    { label: "Badge", value: level.name, helper: `${account.activityPoints} punti` }
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Dashboard fornitore</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Fornitori in piattaforma</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Una vista unica per capire come appare la tua presenza su OrganizzaEvento, cosa manca alla vetrina e dove puoi
            intervenire senza perdere tempo.
          </p>
        </div>
        <Link href="/dashboard/fornitore?sezione=vetrina" className="focus-ring rounded-[0.85rem] bg-violet-cta px-5 py-3 text-sm font-semibold text-white">
          Modifica vetrina
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-[1rem] border border-line bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">{item.value}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{item.helper}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[1rem] border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Mini vetrina</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">{account.businessName || account.displayName}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{account.bio || "Aggiungi una bio breve: cosa fai, per quali eventi sei più forte e come lavori."}</p>
            </div>
            <TagBadge tone={profileReady ? "green" : "amber"}>{profileReady ? "Visibile bene" : "Da completare"}</TagBadge>
          </div>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-[0.85rem] bg-cream p-4">
              <p className="font-semibold text-ink">Categoria</p>
              <p className="mt-1 text-muted">{account.supplierCategory || "Non indicata"}</p>
            </div>
            <div className="rounded-[0.85rem] bg-cream p-4">
              <p className="font-semibold text-ink">Zone</p>
              <p className="mt-1 text-muted">{areas.join(", ") || [account.city, account.region].filter(Boolean).join(", ") || "Non indicate"}</p>
            </div>
            <div className="rounded-[0.85rem] bg-cream p-4">
              <p className="font-semibold text-ink">Servizi</p>
              <p className="mt-1 text-muted">{services.slice(0, 4).join(", ") || account.supplierServices || "Da inserire"}</p>
            </div>
            <div className="rounded-[0.85rem] bg-cream p-4">
              <p className="font-semibold text-ink">Eventi</p>
              <p className="mt-1 text-muted">{eventTypes.join(", ") || "Da selezionare"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1rem] border border-line bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Azioni consigliate</p>
          <div className="mt-4 space-y-3">
            {[
              score < 70 ? "Completa foto, zone coperte e servizi principali." : "Mantieni aggiornata la vetrina con esempi concreti.",
              answers.length < 3 ? "Rispondi a 3 conversazioni coerenti con la tua categoria." : "Continua a rispondere dove puoi essere davvero utile.",
              !account.portfolioUrl && !account.instagramUrl ? "Aggiungi un portfolio o Instagram senza inserire recapiti diretti." : "Controlla che i link siano aggiornati."
            ].map((item) => (
              <div key={item} className="rounded-[0.85rem] border border-line bg-cream px-4 py-3 text-sm font-semibold leading-6 text-ink">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ShowcaseForm({ account, profileStatus }: { account: UserAccount; profileStatus?: string }) {
  const eventTypes = splitStoredList(account.eventTypesServed);

  return (
    <section className="rounded-[1rem] border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">La mia vetrina</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">Informazioni pubbliche e mappatura</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
        Questi dati servono per mostrarti meglio nella community e per capire se una richiesta cliente è coerente con il tuo lavoro.
        Non inserire telefono, email o recapiti diretti.
      </p>

      {profileStatus === "ok" ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">Vetrina aggiornata.</p> : null}
      {profileStatus === "nome" ? <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">Nome pubblico o attività già usati.</p> : null}

      <form action="/api/account/profile" method="post" className="mt-6 grid gap-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <label>
            <span className="text-sm font-semibold text-ink">Nome pubblico</span>
            <input name="displayName" defaultValue={account.displayName} required className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Qualifica</span>
            <select name="profileTag" defaultValue={account.profileTag ?? ""} required className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink">
              <option value="">Scegli una qualifica</option>
              {supplierProfileTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Nome attività o studio</span>
            <input name="businessName" defaultValue={account.businessName ?? ""} required className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Categoria principale</span>
            <select name="supplierCategory" defaultValue={account.supplierCategory ?? ""} required className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink">
              <option value="">Scegli categoria</option>
              {supplierCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          <span className="text-sm font-semibold text-ink">Servizi offerti</span>
          <textarea name="supplierServices" defaultValue={account.supplierServices ?? ""} required rows={4} className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
        </label>

        <fieldset>
          <legend className="text-sm font-semibold text-ink">Tipi di evento seguiti</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {supplierEventTypes.map((eventType) => (
              <label key={eventType} className="flex items-center gap-2 rounded-[0.8rem] border border-line bg-cream px-3 py-2 text-sm text-muted">
                <input name="eventTypesServed" type="checkbox" value={eventType} defaultChecked={eventTypes.includes(eventType)} className="h-4 w-4 accent-[#C9567B]" />
                <span>{eventType}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 lg:grid-cols-2">
          <label>
            <span className="text-sm font-semibold text-ink">Foto profilo URL</span>
            <input name="photoUrl" defaultValue={account.photoUrl ?? ""} placeholder="https://..." className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Portfolio o sito</span>
            <input name="portfolioUrl" type="url" defaultValue={account.portfolioUrl ?? account.websiteUrl ?? ""} placeholder="https://..." className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Città base</span>
            <input name="city" defaultValue={account.city ?? ""} required className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Regione</span>
            <input name="region" defaultValue={account.region ?? ""} required className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Zone coperte</span>
            <input name="serviceAreas" defaultValue={account.serviceAreas ?? ""} required className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Raggio di lavoro</span>
            <select name="travelRange" defaultValue={account.travelRange ?? ""} className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink">
              <option value="">Non indicato</option>
              {supplierTravelRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Fascia indicativa</span>
            <select name="priceRange" defaultValue={account.priceRange ?? ""} className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink">
              <option value="">Non indicata</option>
              {supplierPriceRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Budget minimo indicativo</span>
            <input name="minimumBudget" defaultValue={account.minimumBudget ?? ""} placeholder="Es. da 1.500 euro" className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Instagram</span>
            <input name="instagramUrl" type="url" defaultValue={account.instagramUrl ?? ""} placeholder="https://..." className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
          <label>
            <span className="text-sm font-semibold text-ink">Anni di esperienza</span>
            <input name="experienceYears" type="number" min="0" max="60" defaultValue={account.experienceYears ?? ""} className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
          </label>
        </div>

        <label>
          <span className="text-sm font-semibold text-ink">Biografia breve</span>
          <textarea name="bio" defaultValue={account.bio ?? ""} rows={4} className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
        </label>

        <label>
          <span className="text-sm font-semibold text-ink">Note disponibilità</span>
          <textarea name="availabilityNotes" defaultValue={account.availabilityNotes ?? ""} rows={3} className="focus-ring mt-2 w-full rounded-[0.8rem] border border-line bg-cream px-4 py-3 text-ink" />
        </label>

        <button className="focus-ring w-full rounded-[0.9rem] bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover sm:w-auto">
          Salva vetrina
        </button>
      </form>
    </section>
  );
}

function FavoritesSection({ questions, answers }: Pick<SupplierCrmDashboardProps, "questions" | "answers">) {
  const conversations = [
    ...answers.map((answer) => ({
      title: answer.question.title,
      href: `/domande/${answer.question.slug}`,
      meta: `${answer.usefulVotes} cuori utili sulla tua risposta`,
      preview: textPreview(answer.content)
    })),
    ...questions.map((question) => ({
      title: question.title,
      href: `/domande/${question.slug}`,
      meta: `${question.answersCount} risposte - ${question.usefulVotes} cuori`,
      preview: `Conversazione aperta il ${formatDate(question.createdAt)}`
    }))
  ].slice(0, 10);

  return (
    <section className="rounded-[1rem] border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Preferiti</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">Conversazioni da seguire</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
        Qui raccogliamo le conversazioni collegate alla tua attività. Il salvataggio con cuore dedicato sarà il passo successivo.
      </p>
      <div className="mt-6 grid gap-3">
        {conversations.length ? (
          conversations.map((item) => (
            <Link key={`${item.href}-${item.title}`} href={item.href} className="rounded-[0.95rem] border border-line bg-cream p-4 transition hover:border-[#E7B8C8] hover:bg-white">
              <p className="text-base font-semibold text-ink">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.preview}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-violet-cta">{item.meta}</p>
            </Link>
          ))
        ) : (
          <p className="rounded-[0.95rem] border border-line bg-cream p-4 text-sm text-muted">
            Non ci sono ancora conversazioni collegate al tuo profilo. Quando risponderai o salverai discussioni, le vedrai qui.
          </p>
        )}
      </div>
    </section>
  );
}

function StatsSection({ account, questions, answers }: Pick<SupplierCrmDashboardProps, "account" | "questions" | "answers">) {
  const level = levelFromPoints(account.activityPoints);
  const nextGoal = account.activityPoints >= 600 ? 600 : account.activityPoints >= 300 ? 600 : account.activityPoints >= 160 ? 300 : account.activityPoints >= 60 ? 160 : 60;
  const progress = Math.min(100, Math.round((account.activityPoints / nextGoal) * 100));

  return (
    <section className="rounded-[1rem] border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Statistiche</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">Reputazione e attività</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <article className="rounded-[1rem] border border-line bg-cream p-5">
          <p className="text-sm font-semibold text-muted">Badge attuale</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{level.name}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-violet-cta" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted">{account.activityPoints} punti su {nextGoal}</p>
        </article>
        <article className="rounded-[1rem] border border-line bg-cream p-5">
          <p className="text-sm font-semibold text-muted">Risposte pubblicate</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{answers.length}</p>
          <p className="mt-3 text-xs leading-5 text-muted">Più risposte utili significano più autorevolezza nella community.</p>
        </article>
        <article className="rounded-[1rem] border border-line bg-cream p-5">
          <p className="text-sm font-semibold text-muted">Domande aperte</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{questions.length}</p>
          <p className="mt-3 text-xs leading-5 text-muted">Le domande chiare aiutano clienti e altri fornitori a capirti meglio.</p>
        </article>
      </div>
    </section>
  );
}

function SimpleSection({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <section className="rounded-[1rem] border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">{title}</h1>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function SupplierCrmDashboard({ account, questions, answers, section, profileStatus, deleteStatus }: SupplierCrmDashboardProps) {
  const current = activeSection(section);

  return (
    <CrmShell account={account} section={current}>
      {current === "piattaforma" ? <PlatformOverview account={account} questions={questions} answers={answers} /> : null}
      {current === "vetrina" ? <ShowcaseForm account={account} profileStatus={profileStatus} /> : null}
      {current === "preferiti" ? <FavoritesSection questions={questions} answers={answers} /> : null}
      {current === "statistiche" ? <StatsSection account={account} questions={questions} answers={answers} /> : null}
      {current === "contatti" ? (
        <SimpleSection eyebrow="Contatti" title="Richieste e conversazioni">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-[0.95rem] border border-line bg-cream p-4">
              <p className="font-semibold text-ink">Richieste clienti</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Le richieste dirette verranno mostrate qui quando saranno collegate ai fornitori della piattaforma.
              </p>
            </div>
            <div className="rounded-[0.95rem] border border-line bg-cream p-4">
              <p className="font-semibold text-ink">Regole contatto</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Nelle conversazioni pubbliche non inserire recapiti, link aggressivi o messaggi commerciali. Prima aiuta, poi fatti trovare.
              </p>
            </div>
          </div>
        </SimpleSection>
      ) : null}
      {current === "profilo" ? (
        <SimpleSection eyebrow="Gestione profilo" title="Account e privacy">
          {deleteStatus === "errore" ? <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">Non siamo riusciti a cancellare l'account.</p> : null}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[0.95rem] border border-line bg-cream p-4">
              <p className="font-semibold text-ink">Email privata</p>
              <p className="mt-2 text-sm text-muted">{account.email}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Non viene mostrata pubblicamente.</p>
            </div>
            <div className="rounded-[0.95rem] border border-line bg-cream p-4">
              <p className="font-semibold text-ink">Account creato</p>
              <p className="mt-2 text-sm text-muted">{formatDate(account.createdAt)}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Ultimo accesso: {account.lastLoginAt ? formatDate(account.lastLoginAt) : "non registrato"}</p>
            </div>
          </div>
          <form action="/api/account/delete" method="post" className="mt-5 rounded-[0.95rem] border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-900">Cancellazione account</p>
            <p className="mt-2 text-sm leading-6 text-rose-800">Disattiva il profilo e rimuove i dati pubblici collegati all'account.</p>
            <button className="focus-ring mt-3 rounded-[0.8rem] bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white">
              Cancella account
            </button>
          </form>
        </SimpleSection>
      ) : null}
    </CrmShell>
  );
}
