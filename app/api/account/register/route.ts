import { NextResponse } from "next/server";
import type { AccountRole } from "@prisma/client";
import { ACCOUNT_COOKIE, accountSessionValue, dashboardPath, hashPassword } from "@/lib/account";
import { publicIdentityConflict } from "@/lib/account-identity";
import { ensureAccountSchema } from "@/lib/account-schema";
import { assertCleanText } from "@/lib/moderation";
import { sendInternalNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { assertHoneypotEmpty, assertHumanPace, assertNotSpam } from "@/lib/spam";
import { joinStoredList } from "@/lib/supplier-profile";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function optionalValue(formData: FormData, key: string) {
  const text = value(formData, key);
  return text.length ? text : null;
}

function values(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalNumber(formData: FormData, key: string) {
  const raw = value(formData, key);
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

function safeInternalPath(path: string, fallback = "/registrati") {
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    await ensureAccountSchema();
    assertHoneypotEmpty(formData);
    assertHumanPace(formData, 2);

    const role = value(formData, "role") as AccountRole;
    const email = value(formData, "email").toLowerCase();
    const password = value(formData, "password");
    const displayName = value(formData, "displayName");
    const profileTag = value(formData, "profileTag");
    const signupPath = safeInternalPath(value(formData, "signupPath") || "/registrati");
    const supplierSignupPath = signupPath.includes("?") ? signupPath : `${signupPath}?tipo=fornitore`;
    const privacyAccepted = formData.get("privacyAccepted") === "yes";
    const businessName = optionalValue(formData, "businessName");
    const supplierCategory = optionalValue(formData, "supplierCategory");
    const supplierServices = optionalValue(formData, "supplierServices");
    const eventTypesServed = values(formData, "eventTypesServed");
    const city = optionalValue(formData, "city");
    const region = optionalValue(formData, "region");
    const serviceAreas = optionalValue(formData, "serviceAreas");
    const priceRange = optionalValue(formData, "priceRange");
    const minimumBudget = optionalValue(formData, "minimumBudget");
    const travelRange = optionalValue(formData, "travelRange");
    const portfolioUrl = optionalValue(formData, "portfolioUrl");
    const instagramUrl = optionalValue(formData, "instagramUrl");
    const availabilityNotes = optionalValue(formData, "availabilityNotes");
    const experienceYears = optionalNumber(formData, "experienceYears");

    if (!["client", "supplier"].includes(role) || !email.includes("@") || password.length < 8 || !displayName || !profileTag || !privacyAccepted) {
      return redirectTo(request, `${signupPath}?errore=1`);
    }

    if (
      role === "supplier" &&
      (!businessName || !supplierCategory || !supplierServices || !city || !region || !serviceAreas || eventTypesServed.length === 0)
    ) {
      return redirectTo(request, `${supplierSignupPath}&errore=1`);
    }

    assertCleanText([
      displayName,
      profileTag,
      businessName,
      supplierCategory,
      supplierServices,
      ...eventTypesServed,
      city,
      region,
      serviceAreas,
      priceRange,
      minimumBudget,
      travelRange,
      portfolioUrl,
      instagramUrl,
      availabilityNotes
    ]);
    assertNotSpam(
      [
        displayName,
        profileTag,
        businessName,
        supplierCategory,
        supplierServices,
        ...eventTypesServed,
        city,
        region,
        serviceAreas,
        priceRange,
        minimumBudget,
        travelRange,
        portfolioUrl,
        instagramUrl,
        availabilityNotes
      ],
      { maxLinks: role === "supplier" ? 3 : 0 }
    );

    const existing = await prisma.userAccount.findUnique({ where: { email }, select: { id: true } });
    if (existing) return redirectTo(request, `${signupPath}?errore=esiste`);

    const conflict = await publicIdentityConflict([displayName, businessName]);
    if (conflict) return redirectTo(request, `${signupPath}?errore=nome`);

    const account = await prisma.userAccount.create({
      data: {
        role,
        email,
        displayName,
        profileTag,
        city: role === "supplier" ? city : null,
        region: role === "supplier" ? region : null,
        businessName: role === "supplier" ? businessName : null,
        supplierCategory: role === "supplier" ? supplierCategory : null,
        supplierServices: role === "supplier" ? supplierServices : null,
        eventTypesServed: role === "supplier" ? joinStoredList(eventTypesServed) : null,
        serviceAreas: role === "supplier" ? serviceAreas : null,
        priceRange: role === "supplier" ? priceRange : null,
        minimumBudget: role === "supplier" ? minimumBudget : null,
        travelRange: role === "supplier" ? travelRange : null,
        portfolioUrl: role === "supplier" ? portfolioUrl : null,
        instagramUrl: role === "supplier" ? instagramUrl : null,
        availabilityNotes: role === "supplier" ? availabilityNotes : null,
        experienceYears: role === "supplier" ? experienceYears : null,
        profileCompletedAt: role === "supplier" ? new Date() : null,
        passwordHash: hashPassword(password),
        activityPoints: role === "supplier" ? 20 : 10
      }
    });

    await sendInternalNotification({
      subject: "Nuovo account creato",
      preview: "Una persona ha creato un account su OrganizzaEvento.com.",
      lines: [
        `Tipo account: ${role === "supplier" ? "Fornitore" : "Cliente"}`,
        `Nome visibile: ${displayName}`,
        `Qualifica pubblica: ${profileTag}`,
        `Email: ${email}`,
        `Azienda: ${businessName ?? "Non indicata"}`,
        `Categoria fornitore: ${supplierCategory ?? "Non indicata"}`,
        `Città/regione: ${[city, region].filter(Boolean).join(", ") || "Non indicata"}`
      ]
    });

    const response = redirectTo(request, dashboardPath(account.role));
    response.cookies.set(ACCOUNT_COOKIE, accountSessionValue(account), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });
    return response;
  } catch (error) {
    console.error("Registrazione account non riuscita.", error);
    return redirectTo(request, "/registrati?errore=1");
  }
}
