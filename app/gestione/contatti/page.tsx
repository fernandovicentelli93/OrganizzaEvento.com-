import type { Metadata } from "next";
import { adminLoginAction, adminUpdateLeadRequestStatus, isAdminAuthenticated } from "@/app/actions";
import { TagBadge } from "@/components/TagBadge";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contatti lead | OrganizzaEvento.com",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    stato?: string;
    regione?: string;
    cerca?: string;
    giorno?: string;
    errore?: string;
  }>;
};

const leadStatusLabels = {
  new_lead: "Nuovo",
  otp_pending: "OTP in attesa",
  otp_verified: "OTP verificato",
  assigned: "Assegnato",
  contacted: "Contattato",
  confirmed: "Confermato",
  closed: "Chiuso",
  archived: "Archiviato",
  spam: "Spam"
};

const leadOtpLabels = {
  not_requested: "Non richiesto",
  pending: "In attesa",
  verified: "Verificato",
  failed: "Fallito"
};

type LeadStatus = keyof typeof leadStatusLabels;
type LeadOtpStatus = keyof typeof leadOtpLabels;

type LeadContactRow = {
  id: string;
  requestCode: string;
  childIndex: number | null;
  status: LeadStatus;
  otpStatus: LeadOtpStatus;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string;
  notes: string | null;
  internalNotes: string | null;
  requestType: string;
  source: string;
  sourcePath: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  region: string;
  province: string;
  cityOrArea: string | null;
  macroCategory: string;
  category: string;
  supplierProfile: string | null;
  supplierUrl: string | null;
  budgetRange: string | null;
  guestsCount: number | null;
  eventType: string;
  eventDate: Date | null;
  expiresAt: Date | null;
  confirmedAt: Date | null;
  createdAt: Date;
  children: LeadContactRow[];
};

type LeadRequestDelegate = {
  findMany: (args: unknown) => Promise<LeadContactRow[]>;
  count: (args?: unknown) => Promise<number>;
};

function leadRequestDelegate(client: unknown) {
  return (client as { leadRequest: LeadRequestDelegate }).leadRequest;
}

function toneForStatus(status: string) {
  if (["otp_verified", "assigned", "confirmed"].includes(status)) return "green" as const;
  if (["new_lead", "otp_pending", "contacted"].includes(status)) return "amber" as const;
  return "gray" as const;
}

function toneForOtp(status: string) {
  if (status === "verified") return "green" as const;
  if (status === "pending") return "amber" as const;
  return "gray" as const;
}

function displayDate(value: Date | null | undefined) {
  return value ? formatDate(value) : "-";
}

function leadName(lead: LeadContactRow) {
  return [lead.firstName, lead.lastName].filter(Boolean).join(" ");
}

function supplierRows(lead: LeadContactRow) {
  return [lead, ...lead.children].sort((a, b) => (a.childIndex ?? 1) - (b.childIndex ?? 1));
}

function statusActionButton(lead: LeadContactRow, status: LeadStatus) {
  return (
    <form key={`${lead.id}-${status}`} action={adminUpdateLeadRequestStatus}>
      <input type="hidden" name="leadId" value={lead.id} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="returnTo" value="/gestione/contatti" />
      <button className="focus-ring rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:bg-petal">
        {leadStatusLabels[status]}
      </button>
    </form>
  );
}

function LoginPanel({ error }: { error?: string }) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "supportoforumevento@gmail.com";

  return (
    <main className="min-h-screen bg-cream px-4 py-10">
      <section className="mx-auto max-w-md rounded-md border border-line bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Area riservata</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Contatti ricevuti</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Inserisci la password amministratore. L'email resta nascosta perché questa sezione è solo interna.
        </p>
        {error ? (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            Password non corretta o configurazione mancante.
          </div>
        ) : null}
        <form action={adminLoginAction} className="mt-5 space-y-4">
          <input type="hidden" name="email" value={adminEmail} />
          <input type="hidden" name="returnTo" value="/gestione/contatti" />
          <label className="block">
            <span className="text-sm font-semibold text-ink">Password backend</span>
            <input
              type="password"
              name="password"
              className="focus-ring mt-2 w-full rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="focus-ring min-h-11 w-full rounded-md bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
            Entra
          </button>
        </form>
      </section>
    </main>
  );
}

export default async function LeadContactsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return <LoginPanel error={params.errore ? "1" : undefined} />;

  const statusFilter = Object.keys(leadStatusLabels).includes(params.stato ?? "") ? params.stato ?? "" : "";
  const regionFilter = (params.regione ?? "").trim();
  const searchFilter = (params.cerca ?? "").trim();
  const dayFilter = (params.giorno ?? "").trim();
  const leadRequest = leadRequestDelegate(prisma);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const dayStart = dayFilter ? new Date(`${dayFilter}T00:00:00`) : null;
  const dayEnd = dayStart ? new Date(dayStart) : null;
  if (dayEnd) dayEnd.setDate(dayEnd.getDate() + 1);

  const where: Record<string, unknown> = {
    parentId: null,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(regionFilter ? { region: { contains: regionFilter, mode: "insensitive" } } : {}),
    ...(dayStart && !Number.isNaN(dayStart.getTime()) && dayEnd
      ? { createdAt: { gte: dayStart, lt: dayEnd } }
      : {}),
    ...(searchFilter
      ? {
          OR: [
            { requestCode: { contains: searchFilter, mode: "insensitive" } },
            { firstName: { contains: searchFilter, mode: "insensitive" } },
            { lastName: { contains: searchFilter, mode: "insensitive" } },
            { email: { contains: searchFilter, mode: "insensitive" } },
            { phone: { contains: searchFilter, mode: "insensitive" } },
            { notes: { contains: searchFilter, mode: "insensitive" } },
            { macroCategory: { contains: searchFilter, mode: "insensitive" } },
            { category: { contains: searchFilter, mode: "insensitive" } },
            { children: { some: { notes: { contains: searchFilter, mode: "insensitive" } } } },
            { children: { some: { category: { contains: searchFilter, mode: "insensitive" } } } }
          ]
        }
      : {})
  };

  const [leads, totalCount, todayCount, verifiedCount, openCount] = await Promise.all([
    leadRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 120,
      include: {
        children: {
          orderBy: { childIndex: "asc" }
        }
      }
    }),
    leadRequest.count({ where: { parentId: null } }),
    leadRequest.count({ where: { parentId: null, createdAt: { gte: startOfToday } } }),
    leadRequest.count({ where: { parentId: null, otpStatus: "verified" } }),
    leadRequest.count({ where: { parentId: null, status: { in: ["new_lead", "otp_pending", "otp_verified"] } } })
  ]);

  return (
    <main className="min-h-screen bg-cream px-3 py-6 sm:px-5 lg:px-8">
      <section className="mx-auto max-w-[1700px]">
        <div className="rounded-md border border-line bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">CRM contatti</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Lead ricevuti dai moduli</h1>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">
                Vista a schermo intero per leggere ogni richiesta: dati cliente, evento, categorie richieste, budget,
                note e stato operativo.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="/gestione?sezione=lead" className="focus-ring rounded-md border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink transition hover:bg-petal">
                Torna al backend
              </a>
              <TagBadge tone="violet">{leads.length} in vista</TagBadge>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Totali", totalCount, "Richieste principali salvate"],
              ["Oggi", todayCount, "Arrivate dalla mezzanotte"],
              ["OTP verificati", verifiedCount, "Contatti confermati"],
              ["Da lavorare", openCount, "Nuovi o in verifica"]
            ].map(([label, value, helper]) => (
              <article key={label} className="rounded-md border border-line bg-cream p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{helper}</p>
              </article>
            ))}
          </div>

          <form className="mt-5 grid gap-3 rounded-md border border-line bg-petal p-4 md:grid-cols-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Stato</span>
              <select name="stato" defaultValue={statusFilter} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink">
                <option value="">Tutti</option>
                {Object.entries(leadStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Giorno</span>
              <input type="date" name="giorno" defaultValue={dayFilter} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Regione</span>
              <input name="regione" defaultValue={regionFilter} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink" placeholder="Es. Lombardia" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Cerca</span>
              <input name="cerca" defaultValue={searchFilter} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink" placeholder="Nome, email, categoria..." />
            </label>
            <div className="flex flex-wrap items-end gap-2 md:col-span-4">
              <button className="focus-ring rounded-md bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-hover">
                Filtra contatti
              </button>
              <a href="/gestione/contatti" className="focus-ring rounded-md border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-petal">
                Reset
              </a>
            </div>
          </form>
        </div>

        <div className="mt-5 grid gap-4">
          {leads.length ? (
            leads.map((lead) => {
              const rows = supplierRows(lead);
              return (
                <article key={lead.id} className="overflow-hidden rounded-md border border-line bg-white shadow-soft">
                  <div className="grid gap-4 border-b border-line bg-petal p-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <TagBadge tone={toneForStatus(lead.status)}>{leadStatusLabels[lead.status]}</TagBadge>
                        <TagBadge tone={toneForOtp(lead.otpStatus)}>{leadOtpLabels[lead.otpStatus]}</TagBadge>
                        <TagBadge>{lead.requestCode}</TagBadge>
                        <span className="text-xs text-muted">{displayDate(lead.createdAt)}</span>
                      </div>
                      <h2 className="mt-3 text-2xl font-semibold text-ink">{leadName(lead)}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {lead.eventType} - {lead.guestsCount ?? "ospiti non indicati"} invitati - {lead.province}, {lead.region}
                        {lead.cityOrArea ? ` - ${lead.cityOrArea}` : ""}
                      </p>
                      {lead.internalNotes ? <p className="mt-2 text-sm leading-6 text-muted">{lead.internalNotes}</p> : null}
                    </div>
                    <div className="rounded-md border border-line bg-white p-4 text-sm leading-6 text-muted">
                      <p className="font-semibold text-ink">Contatto</p>
                      <p>Email: {lead.email ?? "-"}</p>
                      <p>Telefono: {lead.phone}</p>
                      <p>Fonte: {lead.utmSource || lead.source}{lead.utmCampaign ? ` / ${lead.utmCampaign}` : ""}</p>
                      <p>Pagina: {lead.sourcePath ?? "-"}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="grid gap-3 lg:grid-cols-2">
                      {rows.map((row) => (
                        <div key={row.id} className="rounded-md border border-line bg-cream p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-cta">{row.macroCategory}</p>
                              <h3 className="mt-1 text-lg font-semibold text-ink">{row.category}</h3>
                            </div>
                            <TagBadge tone={toneForStatus(row.status)}>{leadStatusLabels[row.status]}</TagBadge>
                          </div>
                          <dl className="mt-3 grid gap-2 text-sm leading-6 text-muted sm:grid-cols-2">
                            <div>
                              <dt className="font-semibold text-ink">Budget</dt>
                              <dd>{row.budgetRange ?? "-"}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-ink">Evento</dt>
                              <dd>{row.eventType}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-ink">Sottocategorie</dt>
                              <dd>{row.supplierProfile ?? "-"}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-ink">Data evento</dt>
                              <dd>{displayDate(row.eventDate)}</dd>
                            </div>
                          </dl>
                          <div className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-ink">
                            {row.notes ?? "Nessuna nota salvata."}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(["contacted", "confirmed", "closed", "archived", "spam"] as LeadStatus[]).map((status) =>
                              statusActionButton(row, status)
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <aside className="rounded-md border border-line bg-[#2D202D] p-5 text-white xl:sticky xl:top-20 xl:self-start">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Riepilogo richiesta</p>
                      <p className="mt-3 text-3xl font-semibold">{rows.length}</p>
                      <p className="mt-1 text-sm leading-6 text-white/70">fornitori richiesti</p>
                      <div className="mt-5 space-y-3">
                        {rows.map((row) => (
                          <div key={`${row.id}-summary`} className="rounded-md bg-white/10 p-3 text-sm leading-6">
                            <p className="font-semibold">{row.macroCategory}</p>
                            <p className="text-white/70">{row.budgetRange ?? "Budget da definire"}</p>
                          </div>
                        ))}
                      </div>
                    </aside>
                  </div>
                </article>
              );
            })
          ) : (
            <section className="rounded-md border border-line bg-white p-8 text-center shadow-soft">
              <h2 className="text-2xl font-semibold text-ink">Nessun contatto trovato</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Modifica i filtri oppure torna alla vista completa.</p>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
