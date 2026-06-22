import {
  adminCleanupTestDataAction,
  adminLoginAction,
  adminLogoutAction,
  adminSetBestAnswer,
  adminUpdateAccountStatus,
  adminUpdateAnswerStatus,
  adminUpdateQuestionStatus,
  adminUpdateReportStatus,
  adminUpdateLeadRequestStatus,
  adminUpdateSupportRequestStatus,
  adminUpdateSupplierRequestStatus,
  isAdminAuthenticated
} from "@/app/actions";
import { TagBadge } from "@/components/TagBadge";
import { getAllQuoteAnalysisPages, quoteAnalysisStats } from "@/content/quote-analysis";
import { ensureAccountSchema } from "@/lib/account-schema";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { ensureAnalyticsSchema } from "@/lib/site-analytics";
import { splitStoredList } from "@/lib/supplier-profile";
import { trackedCallPrisma } from "@/lib/tracked-call-prisma";
import type { Prisma } from "@prisma/client";

export const metadata = {
  title: "Backend | OrganizzaEvento.com",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    sezione?: string;
    errore?: string;
    pulizia?: string;
    giorno?: string;
    ruolo?: string;
    stato?: string;
    categoria?: string;
    cerca?: string;
    leadStato?: string;
    leadRegione?: string;
    leadProvincia?: string;
    leadCategoria?: string;
    leadFonte?: string;
    leadCerca?: string;
  }>;
};

const supplierStatusLabels = {
  new_request: "Nuova",
  contacted: "Contattata",
  closed: "Chiusa",
  archived: "Archiviata"
};

const supportStatusLabels = {
  new_request: "Nuova",
  handled: "Gestita",
  archived: "Archiviata"
};

const accountStatusLabels = {
  active: "Attivo",
  suspended: "Sospeso",
  deleted: "Eliminato"
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

type LeadRequestStatusKey = keyof typeof leadStatusLabels;
type LeadOtpStatusKey = keyof typeof leadOtpLabels;
type LeadRequestRow = {
  id: string;
  requestCode: string;
  parent: { requestCode: string } | null;
  _count: { children: number };
  status: LeadRequestStatusKey;
  otpStatus: LeadOtpStatusKey;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string;
  notes: string | null;
  requestType: string;
  source: string;
  utmSource: string | null;
  region: string;
  province: string;
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
};
type LeadRequestDelegate = {
  findMany: (args: unknown) => Promise<LeadRequestRow[]>;
  count: (args?: unknown) => Promise<number>;
};
type LeadDashboardData = {
  leadRequests: LeadRequestRow[];
  filteredLeadCount: number;
  newLeadCount: number;
  otpVerifiedLeadCount: number;
  todayLeadCount: number;
  confirmedLeadCount: number;
  leadUnavailable: boolean;
};

function leadRequestDelegate(client: unknown) {
  return (client as { leadRequest?: LeadRequestDelegate }).leadRequest;
}

function emptyLeadDashboardData(leadUnavailable = false): LeadDashboardData {
  return {
    leadRequests: [],
    filteredLeadCount: 0,
    newLeadCount: 0,
    otpVerifiedLeadCount: 0,
    todayLeadCount: 0,
    confirmedLeadCount: 0,
    leadUnavailable
  };
}

async function loadLeadDashboardData(leadWhere: Record<string, unknown>, startOfToday: Date): Promise<LeadDashboardData> {
  const leadRequest = leadRequestDelegate(prisma);
  if (!leadRequest?.findMany || !leadRequest.count) {
    console.error("Lead dashboard unavailable: Prisma leadRequest delegate is missing.");
    return emptyLeadDashboardData(true);
  }

  try {
    const [leadRequests, filteredLeadCount, newLeadCount, otpVerifiedLeadCount, todayLeadCount, confirmedLeadCount] =
      await Promise.all([
        leadRequest.findMany({
          where: leadWhere,
          orderBy: { createdAt: "desc" },
          take: 120,
          include: {
            parent: { select: { requestCode: true } },
            _count: { select: { children: true } }
          }
        }),
        leadRequest.count({ where: leadWhere }),
        leadRequest.count({ where: { status: "new_lead" } }),
        leadRequest.count({ where: { otpStatus: "verified" } }),
        leadRequest.count({ where: { createdAt: { gte: startOfToday } } }),
        leadRequest.count({ where: { status: "confirmed" } })
      ]);

    return {
      leadRequests,
      filteredLeadCount,
      newLeadCount,
      otpVerifiedLeadCount,
      todayLeadCount,
      confirmedLeadCount,
      leadUnavailable: false
    };
  } catch (error) {
    console.error("Lead dashboard query failed", error);
    return emptyLeadDashboardData(true);
  }
}

function callStatusTone(status?: string | null) {
  if (status && ["answered", "in-progress", "completed"].includes(status)) return "green" as const;
  if (status && ["busy", "failed", "no-answer", "canceled"].includes(status)) return "amber" as const;
  return "gray" as const;
}

function leadStatusTone(status?: string | null) {
  if (status && ["otp_verified", "assigned", "confirmed"].includes(status)) return "green" as const;
  if (status && ["new_lead", "otp_pending", "contacted"].includes(status)) return "amber" as const;
  return "gray" as const;
}

function leadRowClass(status?: string | null) {
  if (status && ["otp_verified", "assigned", "confirmed"].includes(status)) return "bg-[#B7F16A]/60";
  if (status && ["contacted", "closed"].includes(status)) return "bg-[#F4DF72]/60";
  if (status && ["archived", "spam"].includes(status)) return "bg-slate-100";
  return "bg-white";
}

const backendSections = [
  { id: "fornitori", label: "Fornitori in piattaforma", helper: "Vista principale" },
  { id: "lead", label: "Lead ricevuti", helper: "Contatti interni" },
  { id: "chiamate", label: "Chiamate Twilio", helper: "Telefonate fornitori" },
  { id: "iscritti", label: "Iscritti e connessioni", helper: "Account e traffico reale" },
  { id: "account", label: "Schede account", helper: "Profili completi" },
  { id: "richieste", label: "Richieste", helper: "Fornitori e supporto" },
  { id: "moderazione", label: "Moderazione", helper: "Domande e risposte" },
  { id: "segnalazioni", label: "Segnalazioni", helper: "Contenuti da verificare" },
  { id: "statistiche", label: "Statistiche", helper: "Numeri piattaforma" },
  { id: "seo", label: "SEO", helper: "Pagine e sitemap" },
  { id: "notifiche", label: "Notifiche", helper: "Email operative" }
] as const;

type BackendSection = (typeof backendSections)[number]["id"];

function backendSectionHref(id: BackendSection) {
  return id === "fornitori" ? "/gestione" : `/gestione?sezione=${id}`;
}

function dateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayRange(value?: string) {
  const date = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date();
  date.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  return { start: date, end, value: dateInputValue(date) };
}

function accountCategory(account: {
  role: string;
  profileTag: string | null;
  supplierCategory: string | null;
  businessName: string | null;
}) {
  if (account.role === "supplier") return account.supplierCategory || account.profileTag || "Fornitore";
  return account.profileTag || "Cliente";
}

function compactDateTime(value: Date | null | undefined) {
  return value ? formatDate(value) : "Mai registrata";
}

function tableDate(value: Date | null | undefined) {
  return value ? formatDate(value) : "-";
}

function normalized(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function supplierProfileCompletion(account: {
  businessName: string | null;
  supplierCategory: string | null;
  supplierServices: string | null;
  serviceAreas: string | null;
  eventTypesServed: string | null;
  city: string | null;
  region: string | null;
  bio: string | null;
  photoUrl: string | null;
}) {
  const checks = [
    account.businessName,
    account.supplierCategory,
    account.supplierServices,
    account.serviceAreas,
    splitStoredList(account.eventTypesServed).length ? "eventi" : "",
    account.city,
    account.region,
    account.bio,
    account.photoUrl
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function matchedLeadCount(
  account: { supplierCategory: string | null; supplierServices: string | null },
  requests: Array<{ supplierTypes: string }>
) {
  const category = normalized(account.supplierCategory);
  const services = normalized(account.supplierServices);
  if (!category && !services) return 0;

  return requests.filter((request) => {
    const requestText = normalized(request.supplierTypes);
    return (category && requestText.includes(category)) || (services && services.split(/[|,]/).some((item) => item && requestText.includes(item.trim())));
  }).length;
}

function AdminGate({ error }: { error?: string }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-16">
      <div className="w-full rounded-[1.6rem] border border-line bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Area riservata</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Backend OrganizzaEvento.com</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Questa pagina non è nel menù pubblico. Entra con la password amministratore per vedere dati,
          richieste e moderazione.
        </p>
        {error === "1" ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Password non corretta.
          </p>
        ) : null}
        {error === "config" ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Manca la password amministratore nel file di configurazione.
          </p>
        ) : null}
        <form action={adminLoginAction} className="mt-6 space-y-4">
          <input type="hidden" name="email" value={SUPPORT_EMAIL} />
          <label className="block">
            <span className="text-sm font-semibold text-ink">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="focus-ring mt-2 w-full rounded-2xl border border-line bg-cream px-4 py-3 text-ink"
              required
            />
          </label>
          <button className="focus-ring w-full rounded-full bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
            Entra nel backend
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function BackendPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return <AdminGate error={params.errore} />;
  }

  await ensureAccountSchema();
  await ensureAnalyticsSchema();

  const activeSection = backendSections.some((section) => section.id === params.sezione)
    ? (params.sezione as BackendSection)
    : "fornitori";
  const activeSectionLabel = backendSections.find((section) => section.id === activeSection)?.label ?? "Fornitori in piattaforma";
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const selectedDay = dayRange(params.giorno);
  const roleFilter = params.ruolo === "client" || params.ruolo === "supplier" ? params.ruolo : "";
  const statusFilter = params.stato === "active" || params.stato === "suspended" || params.stato === "deleted" ? params.stato : "";
  const categoryFilter = (params.categoria ?? "").trim();
  const searchFilter = (params.cerca ?? "").trim();
  const leadStatusFilter = Object.keys(leadStatusLabels).includes(params.leadStato ?? "") ? params.leadStato ?? "" : "";
  const leadRegionFilter = (params.leadRegione ?? "").trim();
  const leadProvinceFilter = (params.leadProvincia ?? "").trim();
  const leadCategoryFilter = (params.leadCategoria ?? "").trim();
  const leadSourceFilter = (params.leadFonte ?? "").trim();
  const leadSearchFilter = (params.leadCerca ?? "").trim();
  const accountWhere: Prisma.UserAccountWhereInput = {
    ...(roleFilter ? { role: roleFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(categoryFilter
      ? {
          OR: [
            { supplierCategory: { contains: categoryFilter, mode: "insensitive" } },
            { profileTag: { contains: categoryFilter, mode: "insensitive" } },
            { businessName: { contains: categoryFilter, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(searchFilter
      ? {
          AND: [
            {
              OR: [
                { displayName: { contains: searchFilter, mode: "insensitive" } },
                { email: { contains: searchFilter, mode: "insensitive" } },
                { businessName: { contains: searchFilter, mode: "insensitive" } },
                { supplierCategory: { contains: searchFilter, mode: "insensitive" } },
                { profileTag: { contains: searchFilter, mode: "insensitive" } }
              ]
            }
          ]
        }
      : {})
  };
  const leadWhere: Record<string, unknown> = {
    ...(leadStatusFilter ? { status: leadStatusFilter as LeadRequestStatusKey } : {}),
    ...(leadRegionFilter ? { region: { contains: leadRegionFilter, mode: "insensitive" } } : {}),
    ...(leadProvinceFilter ? { province: { contains: leadProvinceFilter, mode: "insensitive" } } : {}),
    ...(leadCategoryFilter
      ? {
          OR: [
            { macroCategory: { contains: leadCategoryFilter, mode: "insensitive" } },
            { category: { contains: leadCategoryFilter, mode: "insensitive" } },
            { supplierProfile: { contains: leadCategoryFilter, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(leadSourceFilter
      ? {
          OR: [
            { source: { contains: leadSourceFilter, mode: "insensitive" } },
            { utmSource: { contains: leadSourceFilter, mode: "insensitive" } },
            { utmCampaign: { contains: leadSourceFilter, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(leadSearchFilter
      ? {
          AND: [
            {
              OR: [
                { requestCode: { contains: leadSearchFilter, mode: "insensitive" } },
                { firstName: { contains: leadSearchFilter, mode: "insensitive" } },
                { lastName: { contains: leadSearchFilter, mode: "insensitive" } },
                { email: { contains: leadSearchFilter, mode: "insensitive" } },
                { phone: { contains: leadSearchFilter, mode: "insensitive" } },
                { notes: { contains: leadSearchFilter, mode: "insensitive" } }
              ]
            }
          ]
        }
      : {})
  };
  const selectedDayVisitWhere = {
    isBot: false,
    createdAt: { gte: selectedDay.start, lt: selectedDay.end }
  };
  const selectedDayActivityWhere = {
    source: "public_form",
    createdAt: { gte: selectedDay.start, lt: selectedDay.end }
  };

  const { leadRequests, filteredLeadCount, newLeadCount, otpVerifiedLeadCount, todayLeadCount, confirmedLeadCount, leadUnavailable } =
    await loadLeadDashboardData(leadWhere, startOfToday);

  const [
    supplierRequests,
    supportRequests,
    trackedCalls,
    todayTrackedCallCount,
    answeredTrackedCallCount,
    missedTrackedCallCount,
    reports,
    questions,
    answers,
    publishedQuestionCount,
    todayQuestionCount,
    publishedAnswerCount,
    usefulVoteCount,
    openReportCount,
    newSupplierRequestCount,
    newSupportRequestCount,
    hiddenQuestionCount,
    hiddenAnswerCount,
    clientAccountCount,
    supplierAccountCount,
    accounts,
    filteredAccountCount,
    selectedDayVisitCount,
    selectedDayUniqueVisitors,
    selectedDayUniqueSessions,
    selectedDayRegisteredVisitors,
    totalVisitCount,
    totalUniqueVisitors,
    selectedDayTrackedPosts,
    selectedDayTrackedQuestions,
    selectedDayTrackedAnswers,
    selectedDayDatabaseQuestions,
    selectedDayDatabaseAnswers,
    registeredConnectedSelectedDay
  ] = await Promise.all([
    prisma.supplierRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 40
    }),
    prisma.supportRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 40
    }),
    trackedCallPrisma.trackedCall.findMany({
      orderBy: { createdAt: "desc" },
      take: 80
    }),
    trackedCallPrisma.trackedCall.count({ where: { createdAt: { gte: startOfToday } } }),
    trackedCallPrisma.trackedCall.count({ where: { status: { in: ["answered", "in-progress", "completed"] } } }),
    trackedCallPrisma.trackedCall.count({ where: { status: { in: ["busy", "failed", "no-answer", "canceled"] } } }),
    prisma.report.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      take: 24,
      include: { category: true }
    }),
    prisma.answer.findMany({
      orderBy: { createdAt: "desc" },
      take: 24,
      include: { question: { select: { title: true, slug: true } } }
    }),
    prisma.question.count({ where: { status: "published" } }),
    prisma.question.count({ where: { status: "published", createdAt: { gte: startOfToday } } }),
    prisma.answer.count({ where: { status: "published" } }),
    prisma.vote.count({ where: { voteType: "useful" } }),
    prisma.report.count({ where: { status: "open" } }),
    prisma.supplierRequest.count({ where: { status: "new_request" } }),
    prisma.supportRequest.count({ where: { status: "new_request" } }),
    prisma.question.count({ where: { status: "hidden" } }),
    prisma.answer.count({ where: { status: "hidden" } }),
    prisma.userAccount.count({ where: { role: "client", status: "active" } }),
    prisma.userAccount.count({ where: { role: "supplier", status: "active" } }),
    prisma.userAccount.findMany({
      where: accountWhere,
      orderBy: [{ lastSeenAt: "desc" }, { createdAt: "desc" }],
      take: 120
    }),
    prisma.userAccount.count({ where: accountWhere }),
    prisma.siteVisit.count({ where: selectedDayVisitWhere }),
    prisma.siteVisit.groupBy({ by: ["visitorHash"], where: selectedDayVisitWhere }),
    prisma.siteVisit.groupBy({ by: ["sessionHash"], where: selectedDayVisitWhere }),
    prisma.siteVisit.groupBy({ by: ["accountId"], where: { ...selectedDayVisitWhere, accountId: { not: null } } }),
    prisma.siteVisit.count({ where: { isBot: false } }),
    prisma.siteVisit.groupBy({ by: ["visitorHash"], where: { isBot: false } }),
    prisma.communityActivity.count({ where: selectedDayActivityWhere }),
    prisma.communityActivity.count({ where: { ...selectedDayActivityWhere, kind: "question" } }),
    prisma.communityActivity.count({ where: { ...selectedDayActivityWhere, kind: "answer" } }),
    prisma.question.count({ where: { createdAt: { gte: selectedDay.start, lt: selectedDay.end } } }),
    prisma.answer.count({ where: { createdAt: { gte: selectedDay.start, lt: selectedDay.end } } }),
    prisma.userAccount.count({
      where: { status: "active", lastSeenAt: { gte: selectedDay.start, lt: selectedDay.end } }
    })
  ]);

  const reportedQuestionIds = reports.filter((report) => report.targetType === "question").map((report) => report.targetId);
  const reportedAnswerIds = reports.filter((report) => report.targetType === "answer").map((report) => report.targetId);
  const [reportedQuestions, reportedAnswers] = await Promise.all([
    prisma.question.findMany({
      where: { id: { in: reportedQuestionIds } },
      select: { id: true, title: true, slug: true, content: true, status: true }
    }),
    prisma.answer.findMany({
      where: { id: { in: reportedAnswerIds } },
      select: { id: true, content: true, status: true, question: { select: { title: true, slug: true } } }
    })
  ]);

  const questionMap = new Map(reportedQuestions.map((question) => [question.id, question]));
  const answerMap = new Map(reportedAnswers.map((answer) => [answer.id, answer]));
  const notificationReady = Boolean(process.env.RESEND_API_KEY || process.env.NOTIFICATION_WEBHOOK_URL);
  const notificationFrom = process.env.RESEND_FROM_EMAIL ?? "OrganizzaEvento <notifiche@organizzaevento.com>";
  const quoteSeoStats = quoteAnalysisStats();
  const quoteSeoExamples = getAllQuoteAnalysisPages("it")
    .filter((page) => page.indexable && page.priorityTier === "P0")
    .slice(0, 8);
  const suppliersInPlatform = accounts.filter((account) => account.role === "supplier");
  const supplierAccountIds = suppliersInPlatform.map((account) => account.id);
  const [supplierQuestions, supplierAnswers] = supplierAccountIds.length
    ? await Promise.all([
        prisma.question.findMany({
          where: { accountId: { in: supplierAccountIds } },
          orderBy: { createdAt: "desc" },
          take: 400,
          select: {
            id: true,
            accountId: true,
            title: true,
            slug: true,
            status: true,
            createdAt: true,
            category: { select: { name: true } }
          }
        }),
        prisma.answer.findMany({
          where: { accountId: { in: supplierAccountIds } },
          orderBy: { createdAt: "desc" },
          take: 400,
          select: {
            id: true,
            accountId: true,
            content: true,
            status: true,
            createdAt: true,
            question: { select: { title: true, slug: true } }
          }
        })
      ])
    : [[], []];
  const supplierActivityMap = new Map(
    suppliersInPlatform.map((account) => [
      account.id,
      { questions: [] as typeof supplierQuestions, answers: [] as typeof supplierAnswers }
    ])
  );

  supplierQuestions.forEach((question) => {
    if (question.accountId) supplierActivityMap.get(question.accountId)?.questions.push(question);
  });
  supplierAnswers.forEach((answer) => {
    if (answer.accountId) supplierActivityMap.get(answer.accountId)?.answers.push(answer);
  });
  const uniqueVisitorsSelectedDay = selectedDayUniqueVisitors.length;
  const uniqueSessionsSelectedDay = selectedDayUniqueSessions.length;
  const registeredVisitorsSelectedDay = selectedDayRegisteredVisitors.filter((item) => item.accountId).length;
  const anonymousVisitorsSelectedDay = Math.max(0, uniqueVisitorsSelectedDay - registeredVisitorsSelectedDay);
  const cmsStatCards = [
    {
      label: "Visitatori unici",
      value: uniqueVisitorsSelectedDay,
      helper: `Nel giorno ${selectedDay.value}`
    },
    {
      label: "Sessioni reali",
      value: uniqueSessionsSelectedDay,
      helper: `${selectedDayVisitCount} pagine viste tracciate`
    },
    {
      label: "Anonimi o nickname",
      value: anonymousVisitorsSelectedDay,
      helper: "Visitatori senza account collegato"
    },
    {
      label: "Iscritti connessi",
      value: registeredConnectedSelectedDay,
      helper: "Account con ultima connessione nel giorno"
    },
    {
      label: "Post reali",
      value: selectedDayTrackedPosts,
      helper: `${selectedDayTrackedQuestions} domande e ${selectedDayTrackedAnswers} risposte da form`
    },
    {
      label: "Contenuti DB del giorno",
      value: selectedDayDatabaseQuestions + selectedDayDatabaseAnswers,
      helper: "Include anche import o operazioni interne"
    },
    {
      label: "Visitatori totali",
      value: totalUniqueVisitors.length,
      helper: `${totalVisitCount} pagine viste reali`
    },
    {
      label: "Iscritti filtrati",
      value: filteredAccountCount,
      helper: `${accounts.length} mostrati in tabella`
    }
  ];
  const statCards = [
    { label: "Domande pubbliche", value: publishedQuestionCount, helper: `${todayQuestionCount} nuove oggi` },
    { label: "Risposte pubbliche", value: publishedAnswerCount, helper: "Contenuti visibili nel forum" },
    { label: "Voti utili", value: usefulVoteCount, helper: "Segnali della community" },
    { label: "Segnalazioni aperte", value: openReportCount, helper: "Da controllare" },
    { label: "Lead interni nuovi", value: newLeadCount, helper: `${otpVerifiedLeadCount} telefoni verificati` },
    { label: "Richieste fornitori nuove", value: newSupplierRequestCount, helper: "Contatti da gestire" },
    { label: "Supporto nuovo", value: newSupportRequestCount, helper: "Messaggi dal widget" },
    { label: "Clienti registrati", value: clientAccountCount, helper: "Account attivi" },
    { label: "Fornitori registrati", value: supplierAccountCount, helper: "Account attivi" },
    { label: "Chiamate tracciate oggi", value: todayTrackedCallCount, helper: `${answeredTrackedCallCount} risposte totali` },
    { label: "Chiamate non riuscite", value: missedTrackedCallCount, helper: "Busy, failed, no-answer o cancellate" },
    { label: "Domande nascoste", value: hiddenQuestionCount, helper: "Moderazione" },
    { label: "Risposte nascoste", value: hiddenAnswerCount, helper: "Moderazione" }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Area riservata</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Backend</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Dati principali, richieste fornitori, segnalazioni e moderazione base. La password resta lato server e non
            compare nell'indirizzo.
          </p>
        </div>
        <form action={adminLogoutAction}>
          <button className="focus-ring rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-petal">
            Esci
          </button>
        </form>
      </div>

      <div className="mb-6 rounded-[1.2rem] border border-line bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <details className="group relative w-full lg:w-auto">
            <summary className="focus-ring flex min-h-12 cursor-pointer list-none items-center justify-between rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white lg:min-w-[260px]">
              <span>Menu backend</span>
              <span className="text-xs opacity-80 group-open:rotate-180">▼</span>
            </summary>
            <div className="z-30 mt-3 grid gap-2 rounded-md border border-line bg-white p-3 shadow-soft lg:absolute lg:left-0 lg:top-full lg:w-[360px]">
              {backendSections.map((section) => (
                <a
                  key={section.id}
                  href={backendSectionHref(section.id)}
                  className={`focus-ring rounded-md border px-4 py-3 transition ${
                    activeSection === section.id
                      ? "border-violet-cta bg-[#FFF3F7] text-ink"
                      : "border-line bg-white text-ink hover:bg-cream"
                  }`}
                >
                  <span className="block text-sm font-semibold">{section.label}</span>
                  <span className="mt-1 block text-xs text-muted">{section.helper}</span>
                </a>
              ))}
            </div>
          </details>
          <div className="rounded-md border border-line bg-cream px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Sezione aperta</p>
            <p className="mt-1 text-sm font-semibold text-ink">{activeSectionLabel}</p>
          </div>
        </div>
      </div>

      {params.pulizia ? (
        <div className="mb-8 rounded-[1.1rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
          Pulizia completata: {params.pulizia} record diagnostici/test rimossi.
        </div>
      ) : null}

      <section className={`mb-8 rounded-[1.6rem] border border-line bg-white p-5 shadow-soft ${activeSection === "lead" ? "" : "hidden"}`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">CRM lead</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Gestione lead ricevuti</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Qui arrivano i contatti dal modulo interno: richiesta principale, eventuali richieste figlie per categoria,
              verifica OTP, provenienza, budget, evento e stato operativo.
            </p>
          </div>
          <TagBadge tone="violet">{filteredLeadCount} lead filtrati</TagBadge>
        </div>

        {leadUnavailable ? (
          <div className="mt-5 rounded-[1.1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            La sezione lead non ha risposto correttamente. Il resto del backend resta utilizzabile: appena il database e Prisma
            risultano allineati, i lead torneranno visibili qui.
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Nuovi</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{newLeadCount}</p>
            <p className="mt-1 text-xs leading-5 text-muted">Lead non ancora lavorati.</p>
          </article>
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">OTP verificati</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{otpVerifiedLeadCount}</p>
            <p className="mt-1 text-xs leading-5 text-muted">Contatti con telefono confermato.</p>
          </article>
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Arrivati oggi</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{todayLeadCount}</p>
            <p className="mt-1 text-xs leading-5 text-muted">Nuove richieste dalla mezzanotte.</p>
          </article>
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Confermati</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{confirmedLeadCount}</p>
            <p className="mt-1 text-xs leading-5 text-muted">Lead validati per lavorazione commerciale.</p>
          </article>
        </div>

        <form className="mt-5 grid gap-3 rounded-[1.1rem] border border-line bg-cream p-4 md:grid-cols-2 xl:grid-cols-6">
          <input type="hidden" name="sezione" value="lead" />
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Stato</span>
            <select
              name="leadStato"
              defaultValue={leadStatusFilter}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
            >
              <option value="">Tutti</option>
              {Object.entries(leadStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Regione</span>
            <input
              name="leadRegione"
              defaultValue={leadRegionFilter}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
              placeholder="Es. Lombardia"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Provincia</span>
            <input
              name="leadProvincia"
              defaultValue={leadProvinceFilter}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
              placeholder="Es. Como"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Categoria</span>
            <input
              name="leadCategoria"
              defaultValue={leadCategoryFilter}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
              placeholder="Location, musica..."
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Provenienza</span>
            <input
              name="leadFonte"
              defaultValue={leadSourceFilter}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
              placeholder="ads, organico..."
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Cerca</span>
            <input
              name="leadCerca"
              defaultValue={leadSearchFilter}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
              placeholder="Codice, nome, email..."
            />
          </label>
          <div className="flex items-end gap-2 xl:col-span-6">
            <button className="focus-ring rounded-full bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-hover">
              Filtra lead
            </button>
            <a
              href="/gestione?sezione=lead"
              className="focus-ring rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-petal"
            >
              Reset
            </a>
          </div>
        </form>

        <div className="mt-5 overflow-hidden rounded-[1.1rem] border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[2300px] divide-y divide-line text-left text-xs">
              <thead className="bg-cream uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-3 py-3 font-semibold">#</th>
                  <th className="px-3 py-3 font-semibold">Identificativo richiesta</th>
                  <th className="px-3 py-3 font-semibold">Lead padre</th>
                  <th className="px-3 py-3 font-semibold">Leads figli</th>
                  <th className="px-3 py-3 font-semibold">Nome</th>
                  <th className="px-3 py-3 font-semibold">Cognome</th>
                  <th className="px-3 py-3 font-semibold">E-mail</th>
                  <th className="px-3 py-3 font-semibold">Cellulare</th>
                  <th className="px-3 py-3 font-semibold">Note</th>
                  <th className="px-3 py-3 font-semibold">Tipo</th>
                  <th className="px-3 py-3 font-semibold">Provenienza</th>
                  <th className="px-3 py-3 font-semibold">Regione</th>
                  <th className="px-3 py-3 font-semibold">Provincia</th>
                  <th className="px-3 py-3 font-semibold">Macro categoria</th>
                  <th className="px-3 py-3 font-semibold">Categoria</th>
                  <th className="px-3 py-3 font-semibold">Vetrina</th>
                  <th className="px-3 py-3 font-semibold">Budget</th>
                  <th className="px-3 py-3 font-semibold">Numero invitati</th>
                  <th className="px-3 py-3 font-semibold">Evento</th>
                  <th className="px-3 py-3 font-semibold">Data evento</th>
                  <th className="px-3 py-3 font-semibold">Scadenza</th>
                  <th className="px-3 py-3 font-semibold">Data conferma</th>
                  <th className="px-3 py-3 font-semibold">Data creazione</th>
                  <th className="px-3 py-3 font-semibold">Stato</th>
                  <th className="px-3 py-3 font-semibold">OTP</th>
                  <th className="px-3 py-3 font-semibold">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leadRequests.length ? (
                  leadRequests.map((lead, index) => (
                    <tr key={lead.id} className={`${leadRowClass(lead.status)} align-top`}>
                      <td className="px-3 py-3 font-semibold text-muted">{index + 1}</td>
                      <td className="px-3 py-3 font-semibold text-ink">{lead.requestCode}</td>
                      <td className="px-3 py-3 text-muted">{lead.parent?.requestCode ?? "-"}</td>
                      <td className="px-3 py-3 text-ink">{lead._count.children}</td>
                      <td className="px-3 py-3 text-ink">{lead.firstName}</td>
                      <td className="px-3 py-3 text-muted">{lead.lastName ?? "-"}</td>
                      <td className="px-3 py-3">
                        {lead.email ? (
                          <span className="rounded-full bg-emerald-700 px-2 py-1 font-semibold text-white">{lead.email}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-emerald-700 px-2 py-1 font-semibold text-white">{lead.phone}</span>
                      </td>
                      <td className="max-w-[360px] px-3 py-3 leading-5 text-muted">{lead.notes ?? "-"}</td>
                      <td className="px-3 py-3 text-muted">{lead.requestType}</td>
                      <td className="px-3 py-3 text-muted">{lead.utmSource || lead.source}</td>
                      <td className="px-3 py-3 text-muted">{lead.region}</td>
                      <td className="px-3 py-3 text-muted">{lead.province}</td>
                      <td className="px-3 py-3 font-semibold text-ink">{lead.macroCategory}</td>
                      <td className="px-3 py-3 text-muted">{lead.category}</td>
                      <td className="px-3 py-3">
                        {lead.supplierUrl ? (
                          <a
                            href={lead.supplierUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="focus-ring rounded-full border border-line bg-white px-3 py-1.5 font-semibold text-ink transition hover:bg-petal"
                          >
                            Apri
                          </a>
                        ) : (
                          <span className="text-muted">{lead.supplierProfile ?? "-"}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-muted">{lead.budgetRange ?? "-"}</td>
                      <td className="px-3 py-3 text-muted">{lead.guestsCount ?? "-"}</td>
                      <td className="px-3 py-3 text-muted">{lead.eventType}</td>
                      <td className="px-3 py-3 text-muted">{tableDate(lead.eventDate)}</td>
                      <td className="px-3 py-3 text-muted">{tableDate(lead.expiresAt)}</td>
                      <td className="px-3 py-3 text-muted">{tableDate(lead.confirmedAt)}</td>
                      <td className="px-3 py-3 text-muted">{tableDate(lead.createdAt)}</td>
                      <td className="px-3 py-3">
                        <TagBadge tone={leadStatusTone(lead.status)}>{leadStatusLabels[lead.status]}</TagBadge>
                      </td>
                      <td className="px-3 py-3">
                        <TagBadge tone={lead.otpStatus === "verified" ? "green" : lead.otpStatus === "pending" ? "amber" : "gray"}>
                          {leadOtpLabels[lead.otpStatus]}
                        </TagBadge>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {(["contacted", "confirmed", "closed", "archived", "spam"] as const).map((status) => (
                            <form key={`${lead.id}-${status}`} action={adminUpdateLeadRequestStatus}>
                              <input type="hidden" name="leadId" value={lead.id} />
                              <input type="hidden" name="status" value={status} />
                              <button className="focus-ring rounded-full border border-line bg-white px-3 py-1.5 font-semibold text-ink transition hover:bg-petal">
                                {leadStatusLabels[status]}
                              </button>
                            </form>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={26} className="px-4 py-6 text-center text-sm text-muted">
                      Nessun lead trovato con i filtri selezionati.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={`mb-8 rounded-[1.6rem] border border-line bg-white p-5 shadow-soft ${activeSection === "chiamate" ? "" : "hidden"}`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Tracciamento telefonico</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Chiamate verso fornitori Vibes</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Log operativo delle chiamate gestite da Twilio. I numeri completi non vengono salvati: vedi solo ultime
              cifre, stato, durata e fornitore collegato.
            </p>
          </div>
          <TagBadge tone="violet">{trackedCalls.length} ultime chiamate</TagBadge>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Oggi</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{todayTrackedCallCount}</p>
            <p className="mt-1 text-xs leading-5 text-muted">Chiamate create nelle ultime 24 ore operative.</p>
          </article>
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Risposte</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{answeredTrackedCallCount}</p>
            <p className="mt-1 text-xs leading-5 text-muted">Chiamate con stato answered, in-progress o completed.</p>
          </article>
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Non riuscite</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{missedTrackedCallCount}</p>
            <p className="mt-1 text-xs leading-5 text-muted">Busy, failed, no-answer o chiamate cancellate.</p>
          </article>
        </div>

        <div className="mt-5 space-y-4">
          {trackedCalls.length ? (
            trackedCalls.map((call) => (
              <article key={call.id} className="rounded-[1.25rem] border border-line bg-cream p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TagBadge tone={callStatusTone(call.status)}>{call.status}</TagBadge>
                  {call.dialStatus ? <TagBadge tone={callStatusTone(call.dialStatus)}>{call.dialStatus}</TagBadge> : null}
                  <TagBadge>{call.direction === "click_to_call" ? "Click-to-call" : "Inoltro chiamata"}</TagBadge>
                  <span className="text-xs text-muted">{formatDate(call.createdAt)}</span>
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <h3 className="text-base font-semibold text-ink">{call.supplierName || "Fornitore non indicato"}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Durata: {call.durationSeconds ? `${call.durationSeconds} secondi` : "non ancora disponibile"}.
                      {call.sourcePath ? ` Origine: ${call.sourcePath}.` : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                      {call.customerPhoneLast4 ? <span>Cliente: ****{call.customerPhoneLast4}</span> : null}
                      {call.supplierPhoneLast4 ? <span>Fornitore: ****{call.supplierPhoneLast4}</span> : null}
                      {call.twilioCallSid ? <span>SID: {call.twilioCallSid.slice(0, 10)}...</span> : null}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-muted">
                    <p className="font-semibold text-ink">Dettagli</p>
                    <p>Avvio: {compactDateTime(call.startedAt)}</p>
                    <p>Fine: {compactDateTime(call.endedAt)}</p>
                    {call.supplierProfileUrl ? (
                      <a
                        href={call.supplierProfileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring mt-3 inline-flex rounded-full border border-line bg-cream px-4 py-2 text-xs font-semibold text-ink transition hover:bg-petal"
                      >
                        Apri vetrina
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-line bg-cream p-4 text-sm text-muted">
              Nessuna chiamata tracciata. Configura il numero Twilio con webhook voce
              <code className="mx-1 rounded bg-white px-1 py-0.5">/api/twilio/voice</code>
              e status callback
              <code className="mx-1 rounded bg-white px-1 py-0.5">/api/twilio/status</code>.
            </p>
          )}
        </div>
      </section>

      <section
        className={`mb-8 rounded-[1.6rem] border border-line bg-white p-5 shadow-soft ${
          activeSection === "fornitori" || activeSection === "iscritti" ? "" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">
              {activeSection === "fornitori" ? "CRM fornitori" : "CMS operativo"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {activeSection === "fornitori" ? "Fornitori in piattaforma" : "Iscritti, connessioni e post reali"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              {activeSection === "fornitori"
                ? "Vista centrale per vedere fornitori registrati, domande aperte, risposte pubblicate e ultima attività reale."
                : "Qui vedi utenti registrati, ultima connessione, categoria scelta, visitatori anonimi/nickname e post creati realmente dai form pubblici. I contenuti importati o generati internamente non entrano nel conteggio \"Post reali\"."}
            </p>
          </div>
          <TagBadge tone="violet">{activeSection === "fornitori" ? `${suppliersInPlatform.length} fornitori` : `Filtro giorno: ${selectedDay.value}`}</TagBadge>
        </div>

        <form
          className={`mt-5 grid gap-3 rounded-[1.1rem] border border-line bg-cream p-4 md:grid-cols-2 xl:grid-cols-6 ${
            activeSection === "iscritti" ? "" : "hidden"
          }`}
        >
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Giorno</span>
            <input
              type="date"
              name="giorno"
              defaultValue={selectedDay.value}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Ruolo</span>
            <select
              name="ruolo"
              defaultValue={roleFilter}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
            >
              <option value="">Tutti</option>
              <option value="client">Clienti</option>
              <option value="supplier">Fornitori</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Stato</span>
            <select
              name="stato"
              defaultValue={statusFilter}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
            >
              <option value="">Tutti</option>
              <option value="active">Attivi</option>
              <option value="suspended">Sospesi</option>
              <option value="deleted">Eliminati</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Categoria</span>
            <input
              name="categoria"
              defaultValue={categoryFilter}
              placeholder="Es. catering, location..."
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Cerca</span>
            <input
              name="cerca"
              defaultValue={searchFilter}
              placeholder="Nome, email, attività..."
              className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
            />
          </label>
          <div className="flex items-end gap-2">
            <button className="focus-ring min-h-11 flex-1 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-cta">
              Filtra
            </button>
            <a
              href="/gestione"
              className="focus-ring inline-flex min-h-11 items-center rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-petal"
            >
              Reset
            </a>
          </div>
        </form>

        <div className={`mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 ${activeSection === "iscritti" ? "" : "hidden"}`}>
          {cmsStatCards.map((card) => (
            <article key={card.label} className="rounded-[1.1rem] border border-line bg-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{card.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{card.helper}</p>
            </article>
          ))}
        </div>

        <section className={`mt-6 overflow-hidden rounded-[1.1rem] border border-line bg-white ${activeSection === "fornitori" ? "" : "hidden"}`}>
          <div className="flex flex-col gap-2 border-b border-line bg-[#FFF8FB] px-4 py-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">Fornitori in piattaforma</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Vista CRM fornitori</h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
                Schede fornitore registrate, domande aperte, risposte pubblicate e segnali utili per capire chi è realmente
                attivo sulla piattaforma.
              </p>
            </div>
            <TagBadge tone="violet">{suppliersInPlatform.length} fornitori filtrati</TagBadge>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1280px] divide-y divide-line text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-3 py-3 font-semibold">#</th>
                  <th className="px-3 py-3 font-semibold">E-mail</th>
                  <th className="px-3 py-3 font-semibold">Lead</th>
                  <th className="px-3 py-3 font-semibold">Ragione sociale / Nome</th>
                  <th className="px-3 py-3 font-semibold">Telefono</th>
                  <th className="px-3 py-3 font-semibold">Regione</th>
                  <th className="px-3 py-3 font-semibold">Provincia / zone</th>
                  <th className="px-3 py-3 font-semibold">Domande aperte</th>
                  <th className="px-3 py-3 font-semibold">Risposte</th>
                  <th className="px-3 py-3 font-semibold">Ultimo login</th>
                  <th className="px-3 py-3 font-semibold">Data creazione</th>
                  <th className="px-3 py-3 font-semibold">Stato</th>
                  <th className="px-3 py-3 font-semibold">Attività e azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {suppliersInPlatform.length ? (
                  suppliersInPlatform.map((account, index) => {
                    const completion = supplierProfileCompletion(account);
                    const leads = matchedLeadCount(account, supplierRequests);
                    const profileReady = completion >= 70;
                    const activity = supplierActivityMap.get(account.id) ?? { questions: [], answers: [] };
                    const latestQuestion = activity.questions[0];
                    const latestAnswer = activity.answers[0];

                    return (
                      <tr key={`supplier-crm-${account.id}`} className="align-top">
                        <td className="px-3 py-3 font-medium text-muted">{index + 1}</td>
                        <td className="px-3 py-3 text-ink">{account.email}</td>
                        <td className="px-3 py-3">
                          <TagBadge tone={leads > 0 ? "green" : "gray"}>{leads}</TagBadge>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-semibold text-ink">{account.businessName || account.displayName}</p>
                          <p className="mt-1 text-xs text-muted">{account.displayName}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {account.supplierCategory ? <TagBadge tone="violet">{account.supplierCategory}</TagBadge> : null}
                            {account.profileTag ? <TagBadge>{account.profileTag}</TagBadge> : null}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-muted">Non raccolto</td>
                        <td className="px-3 py-3 text-muted">{account.region || "-"}</td>
                        <td className="px-3 py-3 text-muted">{account.serviceAreas || account.city || "-"}</td>
                        <td className="px-3 py-3 min-w-[180px]">
                          <TagBadge tone={activity.questions.length ? "green" : "gray"}>{activity.questions.length}</TagBadge>
                          {latestQuestion ? (
                            <a href={`/domande/${latestQuestion.slug}`} className="mt-2 block text-xs font-semibold leading-5 text-ink hover:text-violet-cta">
                              {latestQuestion.title}
                            </a>
                          ) : (
                            <p className="mt-2 text-xs leading-5 text-muted">Nessuna domanda aperta.</p>
                          )}
                        </td>
                        <td className="px-3 py-3 min-w-[180px]">
                          <TagBadge tone={activity.answers.length ? "green" : "gray"}>{activity.answers.length}</TagBadge>
                          {latestAnswer ? (
                            <a href={`/domande/${latestAnswer.question.slug}`} className="mt-2 block text-xs font-semibold leading-5 text-ink hover:text-violet-cta">
                              {latestAnswer.question.title}
                            </a>
                          ) : (
                            <p className="mt-2 text-xs leading-5 text-muted">Nessuna risposta pubblicata.</p>
                          )}
                        </td>
                        <td className="px-3 py-3 text-muted">{compactDateTime(account.lastLoginAt ?? account.lastSeenAt)}</td>
                        <td className="px-3 py-3 text-muted">{compactDateTime(account.createdAt)}</td>
                        <td className="px-3 py-3">
                          <TagBadge tone={account.status === "active" ? "green" : account.status === "suspended" ? "amber" : "gray"}>
                            {accountStatusLabels[account.status]}
                          </TagBadge>
                        </td>
                        <td className="px-3 py-3 min-w-[280px]">
                          <details className="rounded-md border border-line bg-cream p-3">
                            <summary className="cursor-pointer text-xs font-semibold text-ink">Vedi cosa ha scritto</summary>
                            <div className="mt-3 space-y-3">
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Domande</p>
                                {activity.questions.length ? (
                                  <div className="mt-2 space-y-2">
                                    {activity.questions.slice(0, 5).map((question) => (
                                      <a key={question.id} href={`/domande/${question.slug}`} className="block rounded-md bg-white p-2 text-xs leading-5 text-ink hover:bg-petal">
                                        <span className="font-semibold">{question.title}</span>
                                        <span className="mt-1 block text-muted">
                                          {question.category.name} - {formatDate(question.createdAt)} - {question.status}
                                        </span>
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="mt-2 text-xs text-muted">Nessuna domanda collegata all'account.</p>
                                )}
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Risposte</p>
                                {activity.answers.length ? (
                                  <div className="mt-2 space-y-2">
                                    {activity.answers.slice(0, 5).map((answer) => (
                                      <a key={answer.id} href={`/domande/${answer.question.slug}`} className="block rounded-md bg-white p-2 text-xs leading-5 text-ink hover:bg-petal">
                                        <span className="font-semibold">{answer.question.title}</span>
                                        <span className="mt-1 block text-muted">{answer.content.slice(0, 110)}</span>
                                        <span className="mt-1 block text-muted">
                                          {formatDate(answer.createdAt)} - {answer.status}
                                        </span>
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="mt-2 text-xs text-muted">Nessuna risposta collegata all'account.</p>
                                )}
                              </div>
                              <div className="rounded-md bg-white p-2 text-xs leading-5 text-muted">
                                Profilo: {profileReady ? "completo" : `da completare ${completion}%`}
                              </div>
                            </div>
                          </details>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(["active", "suspended"] as const).map((status) => (
                              <form key={status} action={adminUpdateAccountStatus}>
                                <input type="hidden" name="accountId" value={account.id} />
                                <input type="hidden" name="status" value={status} />
                                <button className="focus-ring rounded-md border border-line bg-cream px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-petal">
                                  {accountStatusLabels[status]}
                                </button>
                              </form>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={13} className="px-4 py-8 text-center text-sm text-muted">
                      Nessun fornitore trovato con questi filtri.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className={`mt-5 rounded-[1.1rem] border border-amber-200 bg-amber-50 p-4 ${activeSection === "iscritti" ? "" : "hidden"}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">Pulizia dati di test</p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Rimuove solo account diagnostici, report TEST e richieste supporto create dagli endpoint di controllo.
                Non cancella utenti, conversazioni o richieste reali.
              </p>
            </div>
            <form action={adminCleanupTestDataAction}>
              <button className="focus-ring rounded-md bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800">
                Cancella test diagnostici
              </button>
            </form>
          </div>
        </div>

        <div className={`mt-6 overflow-hidden rounded-[1.1rem] border border-line ${activeSection === "iscritti" ? "" : "hidden"}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line bg-white text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">Ruolo</th>
                  <th className="px-4 py-3 font-semibold">Categoria scelta</th>
                  <th className="px-4 py-3 font-semibold">Iscrizione</th>
                  <th className="px-4 py-3 font-semibold">Ultima connessione</th>
                  <th className="px-4 py-3 font-semibold">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {accounts.length ? (
                  accounts.map((account) => (
                    <tr key={`cms-${account.id}`} className="align-top">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-ink">{account.displayName}</p>
                        <p className="mt-1 text-xs text-muted">{account.email}</p>
                        {account.businessName ? <p className="mt-1 text-xs text-muted">{account.businessName}</p> : null}
                      </td>
                      <td className="px-4 py-3">
                        <TagBadge tone={account.role === "supplier" ? "violet" : "green"}>
                          {account.role === "supplier" ? "Fornitore" : "Cliente"}
                        </TagBadge>
                      </td>
                      <td className="px-4 py-3 text-muted">{accountCategory(account)}</td>
                      <td className="px-4 py-3 text-muted">{compactDateTime(account.createdAt)}</td>
                      <td className="px-4 py-3 text-muted">{compactDateTime(account.lastSeenAt ?? account.lastLoginAt)}</td>
                      <td className="px-4 py-3">
                        <TagBadge tone={account.status === "active" ? "green" : account.status === "suspended" ? "amber" : "gray"}>
                          {accountStatusLabels[account.status]}
                        </TagBadge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                      Nessun iscritto trovato con questi filtri.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={`mb-8 rounded-[1.6rem] border border-line bg-white p-5 shadow-soft ${activeSection === "statistiche" ? "" : "hidden"}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Statistiche</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Panoramica della piattaforma</h2>
          </div>
          <TagBadge tone="violet">Accesso riservato</TagBadge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <article key={card.label} className="rounded-[1.1rem] border border-line bg-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{card.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{card.helper}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`mb-8 rounded-[1.6rem] border border-line bg-white p-5 shadow-soft ${activeSection === "seo" ? "" : "hidden"}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Preventivo Lab SEO</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Pagine generate e controllo qualità</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Le pagine indicizzabili finiscono in sitemap. Quelle con dati troppo deboli restano raggiungibili ma noindex
              finché non avremo campioni, benchmark e segnali Search Console migliori.
            </p>
          </div>
          <TagBadge tone="green">{quoteSeoStats.totalAllLanguageUrls} URL multilingua</TagBadge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "URL italiani", value: quoteSeoStats.totalItalianUrls, helper: "Hub, servizi, regioni e capoluoghi" },
            { label: "Indicizzabili", value: quoteSeoStats.indexable, helper: "Inclusi nelle sitemap lingua/settore" },
            { label: "Noindex", value: quoteSeoStats.noindex, helper: "Tenuti fuori da Google per ora" },
            { label: "Capoluoghi ISTAT", value: quoteSeoStats.capitalMunicipalities, helper: "Niente comuni piccoli duplicati" },
            { label: "P0", value: quoteSeoStats.p0, helper: "Priorità alta iniziale" },
            { label: "P1", value: quoteSeoStats.p1, helper: "Buone pagine da monitorare" },
            { label: "Quality medio", value: quoteSeoStats.averageQualityScore, helper: "Soglia minima: 80+" },
            { label: "Priority medio", value: quoteSeoStats.averagePriorityScore, helper: "Da affinare con dati reali" }
          ].map((card) => (
            <article key={card.label} className="rounded-[1.1rem] border border-line bg-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{card.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{card.helper}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {quoteSeoExamples.map((page) => (
            <a key={page.url} href={page.url.replace("https://organizzaevento.com", "")} className="rounded-[1.1rem] border border-line bg-cream p-4 text-sm font-semibold leading-6 text-ink transition hover:bg-petal">
              {page.h1}
            </a>
          ))}
        </div>
      </section>

      <section className={`mb-8 rounded-[1.6rem] border border-line bg-white p-5 shadow-soft ${activeSection === "notifiche" ? "" : "hidden"}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Notifiche email</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {notificationReady ? "Notifiche automatiche attive" : "Manca la chiave Resend"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              Il sito invia una mail a {SUPPORT_EMAIL} quando viene aperta una nuova discussione o pubblicata una
              nuova risposta. Per attivare l'invio reale serve la variabile ambiente RESEND_API_KEY su Netlify.
            </p>
          </div>
          <TagBadge tone={notificationReady ? "green" : "amber"}>{notificationReady ? "Attivo" : "Da configurare"}</TagBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Destinatario</p>
            <p className="mt-2 text-sm font-semibold text-ink">{SUPPORT_EMAIL}</p>
          </article>
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Mittente</p>
            <p className="mt-2 text-sm font-semibold text-ink">{notificationFrom}</p>
          </article>
          <article className="rounded-[1.1rem] border border-line bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Eventi notificati</p>
            <p className="mt-2 text-sm font-semibold text-ink">Discussioni, risposte, supporto e fornitori</p>
          </article>
        </div>
      </section>

      <section className={`mt-8 rounded-[1.6rem] border border-line bg-white p-5 shadow-soft ${activeSection === "account" ? "" : "hidden"}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Account registrati</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Profili clienti e fornitori, badge, punti e stato moderazione.
            </p>
          </div>
          <TagBadge tone="violet">{accounts.length} ultimi account</TagBadge>
        </div>

        <div className="mt-5 space-y-4">
          {accounts.length ? (
            accounts.map((account) => {
              const accountEventTypes = splitStoredList(account.eventTypesServed);

              return (
                <article key={account.id} className="rounded-[1.25rem] border border-line bg-cream p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <TagBadge tone={account.role === "supplier" ? "violet" : "green"}>
                      {account.role === "supplier" ? "Fornitore" : "Cliente"}
                    </TagBadge>
                    <TagBadge tone={account.status === "active" ? "green" : account.status === "suspended" ? "amber" : "gray"}>
                      {accountStatusLabels[account.status]}
                    </TagBadge>
                    <span className="text-xs text-muted">{formatDate(account.createdAt)}</span>
                  </div>
                  <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <h3 className="text-base font-semibold text-ink">{account.displayName}</h3>
                      <p className="mt-1 text-sm text-muted">{account.email}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {account.bio ?? "Nessuna biografia"} - {account.activityPoints} punti
                      </p>
                      {account.role === "supplier" ? (
                        <div className="mt-3 rounded-2xl bg-white p-3 text-sm leading-6 text-muted">
                          <p className="font-semibold text-ink">{account.businessName || "Attività non indicata"}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {account.supplierCategory ? <TagBadge tone="violet">{account.supplierCategory}</TagBadge> : null}
                            {account.priceRange ? <TagBadge>{account.priceRange}</TagBadge> : null}
                            {account.travelRange ? <TagBadge>{account.travelRange}</TagBadge> : null}
                          </div>
                          <p className="mt-2">
                            Zone: {account.serviceAreas || [account.city, account.region].filter(Boolean).join(", ") || "non indicate"}
                          </p>
                          {account.minimumBudget ? <p>Budget minimo: {account.minimumBudget}</p> : null}
                          {account.experienceYears !== null ? <p>Esperienza: {account.experienceYears} anni</p> : null}
                          {account.supplierServices ? <p className="mt-2">{account.supplierServices}</p> : null}
                          {accountEventTypes.length ? (
                            <p className="mt-2 text-xs">Eventi: {accountEventTypes.join(", ")}</p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {account.portfolioUrl ? <span>Portfolio: {account.portfolioUrl}</span> : null}
                            {account.websiteUrl ? <span>Sito: {account.websiteUrl}</span> : null}
                            {account.instagramUrl ? <span>Instagram: {account.instagramUrl}</span> : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["active", "suspended"] as const).map((status) => (
                        <form key={status} action={adminUpdateAccountStatus}>
                          <input type="hidden" name="accountId" value={account.id} />
                          <input type="hidden" name="status" value={status} />
                          <button className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:bg-petal">
                            {accountStatusLabels[status]}
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="rounded-2xl border border-line bg-cream p-4 text-sm text-muted">Nessun account registrato.</p>
          )}
        </div>
      </section>

      <section className={`rounded-[1.6rem] border border-line bg-white p-5 shadow-soft ${activeSection === "richieste" ? "" : "hidden"}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Richieste fornitori</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Qui arrivano i contatti dal modulo pubblico per trovare fornitori per eventi.
            </p>
          </div>
          <TagBadge tone="violet">{supplierRequests.length} richieste</TagBadge>
        </div>

        <div className="mt-5 space-y-4">
          {supplierRequests.length ? (
            supplierRequests.map((request) => (
              <article key={request.id} className="rounded-[1.25rem] border border-line bg-cream p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TagBadge tone={request.status === "new_request" ? "amber" : request.status === "closed" ? "green" : "gray"}>
                    {supplierStatusLabels[request.status]}
                  </TagBadge>
                  <TagBadge>{request.eventType}</TagBadge>
                  <span className="text-xs text-muted">{formatDate(request.createdAt)}</span>
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <h3 className="text-base font-semibold text-ink">{request.supplierTypes}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{request.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                      {request.city || request.region ? <span>{[request.city, request.region].filter(Boolean).join(", ")}</span> : null}
                      {request.peopleCount ? <span>{request.peopleCount} persone</span> : null}
                      {request.budgetRange ? <span>Budget: {request.budgetRange}</span> : null}
                      {request.eventDate ? <span>Data: {formatDate(request.eventDate)}</span> : null}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-muted">
                    <p className="font-semibold text-ink">{request.name ?? "Nome non indicato"}</p>
                    {request.email ? <p>Email: {request.email}</p> : null}
                    {request.phone ? <p>Telefono: {request.phone}</p> : null}
                  </div>
                </div>
                {request.aiReply ? (
                  <div className="mt-4 rounded-[1.2rem] border border-[#E8C7D2] bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <TagBadge tone="violet">Bozza interna</TagBadge>
                      {request.aiReplyCreatedAt ? (
                        <span className="text-xs text-muted">Preparata il {formatDate(request.aiReplyCreatedAt)}</span>
                      ) : null}
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted">{request.aiReply}</p>
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["contacted", "closed", "archived"] as const).map((status) => (
                    <form key={status} action={adminUpdateSupplierRequestStatus}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <input type="hidden" name="status" value={status} />
                      <button className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:bg-petal">
                        {supplierStatusLabels[status]}
                      </button>
                    </form>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-line bg-cream p-4 text-sm text-muted">
              Nessuna richiesta fornitori ricevuta per ora.
            </p>
          )}
        </div>
      </section>

      <section className={`mt-8 rounded-[1.6rem] border border-line bg-white p-5 shadow-soft ${activeSection === "richieste" ? "" : "hidden"}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Richieste supporto</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Qui arrivano i messaggi inviati dal widget supporto con il logo.
            </p>
          </div>
          <TagBadge tone="violet">{supportRequests.length} richieste</TagBadge>
        </div>

        <div className="mt-5 space-y-4">
          {supportRequests.length ? (
            supportRequests.map((request) => (
              <article key={request.id} className="rounded-[1.25rem] border border-line bg-cream p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TagBadge tone={request.status === "new_request" ? "amber" : request.status === "handled" ? "green" : "gray"}>
                    {supportStatusLabels[request.status]}
                  </TagBadge>
                  <span className="text-xs text-muted">{formatDate(request.createdAt)}</span>
                  {request.sourcePath ? <TagBadge>{request.sourcePath}</TagBadge> : null}
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                  <p className="text-sm leading-6 text-muted">{request.message}</p>
                  <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-muted">
                    <p className="font-semibold text-ink">{request.name ?? "Nome non indicato"}</p>
                    <p>Email: {request.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["handled", "archived"] as const).map((status) => (
                    <form key={status} action={adminUpdateSupportRequestStatus}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <input type="hidden" name="status" value={status} />
                      <button className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:bg-petal">
                        {supportStatusLabels[status]}
                      </button>
                    </form>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-line bg-cream p-4 text-sm text-muted">
              Nessuna richiesta supporto ricevuta per ora.
            </p>
          )}
        </div>
      </section>

      <section className={`mt-8 rounded-[1.6rem] border border-line bg-white p-5 shadow-sm ${activeSection === "segnalazioni" ? "" : "hidden"}`}>
        <h2 className="text-2xl font-semibold text-ink">Segnalazioni</h2>
        <div className="mt-4 space-y-4">
          {reports.length ? (
            reports.map((report) => {
              const question = report.targetType === "question" ? questionMap.get(report.targetId) : null;
              const answer = report.targetType === "answer" ? answerMap.get(report.targetId) : null;

              return (
                <article key={report.id} className="rounded-[1.25rem] border border-line bg-cream p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <TagBadge tone={report.status === "open" ? "amber" : "gray"}>{report.status}</TagBadge>
                    <TagBadge>{report.targetType === "question" ? "Domanda" : "Risposta"}</TagBadge>
                    <span className="text-xs text-muted">{formatDate(report.createdAt)}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-ink">{report.reason}</h3>
                  {report.details ? <p className="mt-2 text-sm leading-6 text-muted">{report.details}</p> : null}
                  {question ? (
                    <p className="mt-3 text-sm leading-6 text-ink">
                      <strong>{question.title}</strong> ? {question.content.slice(0, 180)}
                    </p>
                  ) : null}
                  {answer ? (
                    <p className="mt-3 text-sm leading-6 text-ink">
                      <strong>{answer.question.title}</strong> ? {answer.content.slice(0, 180)}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={adminUpdateReportStatus}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="status" value="reviewed" />
                      <button className="focus-ring rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
                        Segna revisionato
                      </button>
                    </form>
                    <form action={adminUpdateReportStatus}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="status" value="dismissed" />
                      <button className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink">
                        Archivia
                      </button>
                    </form>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="rounded-2xl border border-line bg-cream p-4 text-sm text-muted">Nessuna segnalazione presente.</p>
          )}
        </div>
      </section>

      <section className={`mt-8 grid gap-6 lg:grid-cols-2 ${activeSection === "moderazione" ? "" : "hidden"}`}>
        <div className="rounded-[1.6rem] border border-line bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-ink">Domande</h2>
          <div className="mt-4 space-y-4">
            {questions.map((question) => (
              <article key={question.id} className="rounded-[1.25rem] border border-line bg-cream p-4">
                <div className="flex flex-wrap gap-2">
                  <TagBadge tone={question.status === "published" ? "green" : "amber"}>{question.status}</TagBadge>
                  <TagBadge>{question.category.name}</TagBadge>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-ink">{question.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{question.content.slice(0, 180)}</p>
                <form action={adminUpdateQuestionStatus} className="mt-3">
                  <input type="hidden" name="questionId" value={question.id} />
                  <input type="hidden" name="status" value={question.status === "published" ? "hidden" : "published"} />
                  <button className="focus-ring rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
                    {question.status === "published" ? "Nascondi domanda" : "Ripubblica domanda"}
                  </button>
                </form>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-line bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-ink">Risposte</h2>
          <div className="mt-4 space-y-4">
            {answers.map((answer) => (
              <article key={answer.id} className="rounded-[1.25rem] border border-line bg-cream p-4">
                <div className="flex flex-wrap gap-2">
                  <TagBadge tone={answer.status === "published" ? "green" : "amber"}>{answer.status}</TagBadge>
                  {answer.isBestAnswer ? <TagBadge tone="green">Risposta più utile</TagBadge> : null}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-ink">{answer.question.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{answer.content.slice(0, 180)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={adminUpdateAnswerStatus}>
                    <input type="hidden" name="answerId" value={answer.id} />
                    <input type="hidden" name="status" value={answer.status === "published" ? "hidden" : "published"} />
                    <button className="focus-ring rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
                      {answer.status === "published" ? "Nascondi risposta" : "Ripubblica risposta"}
                    </button>
                  </form>
                  <form action={adminSetBestAnswer}>
                    <input type="hidden" name="answerId" value={answer.id} />
                    <button className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink">
                      Segna migliore
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
