import { NextResponse } from "next/server";
import { currentAccount, dashboardPath } from "@/lib/account";
import { publicIdentityConflict } from "@/lib/account-identity";
import { ensureAccountSchema } from "@/lib/account-schema";
import { assertCleanText } from "@/lib/moderation";
import { prisma } from "@/lib/prisma";
import { assertNotSpam } from "@/lib/spam";
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

export async function POST(request: Request) {
  const account = await currentAccount();
  await ensureAccountSchema();
  if (!account) return redirectTo(request, "/login");

  const formData = await request.formData();
  const displayName = value(formData, "displayName");
  const profileTag = value(formData, "profileTag");
  const photoUrl = optionalValue(formData, "photoUrl");
  const bio = optionalValue(formData, "bio");
  const city = optionalValue(formData, "city");
  const region = optionalValue(formData, "region");
  const businessName = optionalValue(formData, "businessName");
  const supplierCategory = optionalValue(formData, "supplierCategory");
  const supplierServices = optionalValue(formData, "supplierServices");
  const eventTypesServed = values(formData, "eventTypesServed");
  const serviceAreas = optionalValue(formData, "serviceAreas");
  const priceRange = optionalValue(formData, "priceRange");
  const minimumBudget = optionalValue(formData, "minimumBudget");
  const travelRange = optionalValue(formData, "travelRange");
  const portfolioUrl = optionalValue(formData, "portfolioUrl");
  const websiteUrl = optionalValue(formData, "websiteUrl");
  const instagramUrl = optionalValue(formData, "instagramUrl");
  const availabilityNotes = optionalValue(formData, "availabilityNotes");
  const experienceYears = optionalNumber(formData, "experienceYears");

  try {
    if (!displayName || !profileTag) return redirectTo(request, `${dashboardPath(account.role)}?profilo=errore`);
    if (
      account.role === "supplier" &&
      (!businessName || !supplierCategory || !supplierServices || !serviceAreas || eventTypesServed.length === 0)
    ) {
      return redirectTo(request, `${dashboardPath(account.role)}?profilo=errore`);
    }

    assertCleanText([
      displayName,
      profileTag,
      photoUrl,
      bio,
      city,
      region,
      businessName,
      supplierCategory,
      supplierServices,
      ...eventTypesServed,
      serviceAreas,
      priceRange,
      minimumBudget,
      travelRange,
      portfolioUrl,
      websiteUrl,
      instagramUrl,
      availabilityNotes
    ]);
    assertNotSpam(
      [
        displayName,
        profileTag,
        photoUrl,
        bio,
        city,
        region,
        businessName,
        supplierCategory,
        supplierServices,
        ...eventTypesServed,
        serviceAreas,
        priceRange,
        minimumBudget,
        travelRange,
        portfolioUrl,
        websiteUrl,
        instagramUrl,
        availabilityNotes
      ],
      { maxLinks: account.role === "supplier" ? 4 : 1 }
    );

    const conflict = await publicIdentityConflict([displayName, businessName], account.id);
    if (conflict) return redirectTo(request, `${dashboardPath(account.role)}?profilo=nome`);

    await prisma.userAccount.update({
      where: { id: account.id },
      data: {
        displayName,
        profileTag,
        photoUrl,
        bio,
        city,
        region,
        ...(account.role === "supplier"
          ? {
              businessName,
              supplierCategory,
              supplierServices,
              eventTypesServed: joinStoredList(eventTypesServed),
              serviceAreas,
              priceRange,
              minimumBudget,
              travelRange,
              portfolioUrl,
              websiteUrl,
              instagramUrl,
              availabilityNotes,
              experienceYears,
              profileCompletedAt: new Date()
            }
          : {})
      }
    });

    return redirectTo(request, `${dashboardPath(account.role)}?profilo=ok`);
  } catch (error) {
    console.error("Profilo account non aggiornato.", error);
    return redirectTo(request, `${dashboardPath(account.role)}?profilo=errore`);
  }
}
