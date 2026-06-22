import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { sendInternalNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadCategoryInput = {
  macroCategory?: string;
  category?: string;
  supplierProfile?: string;
  supplierUrl?: string;
  budgetRange?: string;
  notes?: string;
  duration?: string;
  subcategories?: string[];
  services?: string[];
  musicFormation?: string[];
  musicGenres?: string[];
};

type LeadRequestInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  contactPreference?: string;
  notes?: string;
  eventType?: string;
  region?: string;
  province?: string;
  cityOrArea?: string;
  guestsCount?: number | string;
  eventDate?: string;
  eventPeriod?: string;
  budgetRange?: string;
  totalBudgetRange?: string;
  requestType?: string;
  source?: string;
  sourcePath?: string;
  utmSource?: string;
  utmCampaign?: string;
  otpVerified?: boolean;
  privacyAccepted?: boolean;
  categories?: LeadCategoryInput[];
};

type LeadRecord = {
  id: string;
  requestCode: string;
  status: string;
  otpStatus: string;
};

type LeadRequestDelegate = {
  count: () => Promise<number>;
  findUnique: (args: { where: { requestCode: string }; select: { id: true } }) => Promise<{ id: string } | null>;
  create: (args: { data: Record<string, unknown> }) => Promise<LeadRecord>;
};

function leadRequestDelegate(client: unknown) {
  return (client as { leadRequest: LeadRequestDelegate }).leadRequest;
}

function clean(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.replace(/\s+/g, " ").trim().slice(0, 1200);
}

function optionalClean(value: unknown) {
  const cleaned = clean(value);
  return cleaned.length ? cleaned : null;
}

function cleanList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => clean(item)).filter(Boolean).slice(0, 24);
}

function cleanEmail(value: unknown) {
  const email = clean(value).toLowerCase();
  return email && email.includes("@") ? email.slice(0, 180) : null;
}

function parseGuests(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.round(value);
  const parsed = Number.parseInt(clean(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseDate(value: unknown) {
  const cleaned = clean(value);
  if (!cleaned || cleaned.toLowerCase().includes("definire")) return null;
  const date = new Date(`${cleaned}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function hashValue(value: string | null) {
  if (!value) return null;
  const salt = process.env.ACCOUNT_SESSION_SECRET || process.env.ADMIN_SECRET || "organizzaevento-lead";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

function composeCategoryNotes(input: LeadRequestInput, category: LeadCategoryInput) {
  const subcategories = cleanList(category.subcategories);
  const services = cleanList(category.services);
  const formation = cleanList(category.musicFormation);
  const genres = cleanList(category.musicGenres);
  const categoryNotes = optionalClean(category.notes);
  const lines = [
    categoryNotes ? `Note cliente: ${categoryNotes}` : "",
    subcategories.length ? `Sottocategorie: ${subcategories.join(", ")}` : "",
    services.length ? `Servizi richiesti: ${services.join(", ")}` : "",
    formation.length ? `Formazione musica: ${formation.join(", ")}` : "",
    genres.length ? `Generi musicali: ${genres.join(", ")}` : "",
    optionalClean(category.duration) ? `Durata: ${clean(category.duration)}` : "",
    optionalClean(input.eventPeriod) ? `Data o periodo: ${clean(input.eventPeriod)}` : "",
    optionalClean(input.totalBudgetRange) ? `Budget massimo complessivo: ${clean(input.totalBudgetRange)}` : "",
    optionalClean(input.contactPreference) ? `Preferenza contatto: ${clean(input.contactPreference)}` : "",
    optionalClean(input.cityOrArea) ? `Zona evento: ${clean(input.cityOrArea)}` : ""
  ].filter(Boolean);

  return optionalClean(lines.join(" | ")) ?? optionalClean(input.notes);
}

function composeSupplierProfile(category: LeadCategoryInput) {
  return (
    optionalClean(category.supplierProfile) ??
    optionalClean(cleanList(category.subcategories).join(", ")) ??
    optionalClean(cleanList(category.services).join(", "))
  );
}

function leadCodeSuffix(value: string) {
  return clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 22);
}

async function nextRequestCode(region: string, eventType: string) {
  const leadRequest = leadRequestDelegate(prisma);
  const count = await leadRequest.count();
  const suffix = [leadCodeSuffix(region), leadCodeSuffix(eventType)].filter(Boolean).join("-");

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const number = String(count + attempt + 1).padStart(6, "0");
    const candidate = `OE-${number}${suffix ? `-${suffix}` : ""}`;
    const existing = await leadRequest.findUnique({ where: { requestCode: candidate }, select: { id: true } });
    if (!existing) return candidate;
  }

  return `OE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function baseLeadData(input: LeadRequestInput, category: LeadCategoryInput, request: Request) {
  const phone = clean(input.phone);
  const eventDate = parseDate(input.eventDate) ?? parseDate(input.eventPeriod);
  const privacyAcceptedAt = input.privacyAccepted ? new Date() : null;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return {
    status: input.otpVerified ? "otp_verified" : "otp_pending",
    otpStatus: input.otpVerified ? "verified" : "pending",
    firstName: clean(input.firstName),
    lastName: optionalClean(input.lastName),
    email: cleanEmail(input.email),
    phone,
    notes: composeCategoryNotes(input, category),
    requestType: clean(input.requestType, "onboard") || "onboard",
    source: clean(input.source, "organizzaevento") || "organizzaevento",
    sourcePath: optionalClean(input.sourcePath),
    utmSource: optionalClean(input.utmSource),
    utmCampaign: optionalClean(input.utmCampaign),
    region: clean(input.region),
    province: clean(input.province),
    cityOrArea: optionalClean(input.cityOrArea),
    macroCategory: clean(category.macroCategory, clean(category.category, "Evento")) || "Evento",
    category: clean(category.category, clean(category.macroCategory, "Generale")) || "Generale",
    supplierProfile: composeSupplierProfile(category),
    supplierUrl: optionalClean(category.supplierUrl),
    budgetRange: optionalClean(category.budgetRange) ?? optionalClean(input.budgetRange) ?? optionalClean(input.totalBudgetRange),
    guestsCount: parseGuests(input.guestsCount),
    eventType: clean(input.eventType),
    eventDate,
    expiresAt,
    otpVerifiedAt: input.otpVerified ? new Date() : null,
    privacyAcceptedAt,
    internalNotes: optionalClean(
      [
        optionalClean(input.contactPreference) ? `Preferenza contatto: ${clean(input.contactPreference)}` : "",
        optionalClean(input.totalBudgetRange) ? `Budget complessivo evento: ${clean(input.totalBudgetRange)}` : "",
        optionalClean(input.eventPeriod) ? `Periodo evento: ${clean(input.eventPeriod)}` : ""
      ]
        .filter(Boolean)
        .join(" | ")
    ),
    ipHash: hashValue(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null),
    userAgentHash: hashValue(request.headers.get("user-agent"))
  } as const;
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as LeadRequestInput;
    const categories = (Array.isArray(input.categories) && input.categories.length ? input.categories : [{ category: "Generale" }]).slice(0, 12);
    const required = [input.firstName, input.phone, input.email, input.eventType, input.region, input.province];

    if (required.some((value) => !clean(value)) || !cleanEmail(input.email) || !input.privacyAccepted) {
      return NextResponse.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
    }

    if (categories.some((category) => clean(category.notes).length < 30)) {
      return NextResponse.json({ ok: false, error: "supplier_notes_too_short" }, { status: 400 });
    }

    const parentCategory = categories[0];
    const requestCode = await nextRequestCode(clean(input.region), clean(input.eventType));
    const parentData = baseLeadData(input, parentCategory, request);

    const created = await prisma.$transaction(async (tx) => {
      const leadRequest = leadRequestDelegate(tx);
      const parent = await leadRequest.create({
        data: {
          ...parentData,
          requestCode,
          childIndex: null
        }
      });

      const children = [];
      for (const [index, category] of categories.slice(1).entries()) {
        children.push(
          await leadRequest.create({
            data: {
              ...baseLeadData(input, category, request),
              requestCode: `${requestCode}-${index + 2}`,
              parentId: parent.id,
              childIndex: index + 2
            }
          })
        );
      }

      return { parent, children };
    });

    await sendInternalNotification({
      subject: "Nuovo lead fornitori interno",
      preview: "Una persona ha inviato una richiesta strutturata dal modulo OrganizzaEvento.com.",
      lines: [
        `Codice richiesta: ${created.parent.requestCode}`,
        `Nome: ${clean(input.firstName)} ${clean(input.lastName)}`.trim(),
        `Email: ${cleanEmail(input.email) ?? "Non indicata"}`,
        `Telefono: ${clean(input.phone)}`,
        `Preferenza contatto: ${clean(input.contactPreference, "Non indicata") || "Non indicata"}`,
        `Evento: ${clean(input.eventType)}`,
        `Zona: ${[clean(input.province), clean(input.region), clean(input.cityOrArea)].filter(Boolean).join(", ")}`,
        `Invitati: ${parseGuests(input.guestsCount) ?? "Non indicati"}`,
        `Budget complessivo: ${clean(input.totalBudgetRange, "Non indicato") || "Non indicato"}`,
        `Fornitori richiesti: ${categories.map((category) => clean(category.macroCategory, clean(category.category, "Generale"))).join(", ")}`,
        `Apri gestione: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com"}/gestione/contatti`
      ]
    });

    return NextResponse.json({
      ok: true,
      requestCode: created.parent.requestCode,
      childLeads: created.children.length,
      status: created.parent.status,
      otpStatus: created.parent.otpStatus
    });
  } catch (error) {
    console.error("Lead request creation failed", error);
    return NextResponse.json({ ok: false, error: "lead_creation_failed" }, { status: 500 });
  }
}
