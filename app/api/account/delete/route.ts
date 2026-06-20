import { NextResponse } from "next/server";
import { ACCOUNT_COOKIE, currentAccount, dashboardPath } from "@/lib/account";
import { ensureAccountSchema } from "@/lib/account-schema";
import { prisma } from "@/lib/prisma";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

export async function POST(request: Request) {
  const account = await currentAccount();
  await ensureAccountSchema();
  if (!account) return redirectTo(request, "/login");

  const formData = await request.formData();
  const confirm = value(formData, "confirm");
  if (confirm.toUpperCase() !== "CANCELLA") {
    return redirectTo(request, `${dashboardPath(account.role)}?cancella=errore`);
  }

  await prisma.userAccount.update({
    where: { id: account.id },
    data: {
      status: "deleted",
      email: `deleted-${account.id}@organizzaevento.local`,
      displayName: "Account eliminato",
      bio: null,
      photoUrl: null,
      city: null,
      region: null,
      businessName: null,
      supplierCategory: null,
      supplierServices: null,
      eventTypesServed: null,
      serviceAreas: null,
      priceRange: null,
      minimumBudget: null,
      travelRange: null,
      portfolioUrl: null,
      websiteUrl: null,
      instagramUrl: null,
      availabilityNotes: null,
      experienceYears: null,
      profileCompletedAt: null
    }
  });

  const response = redirectTo(request, "/?account=eliminato");
  response.cookies.delete(ACCOUNT_COOKIE);
  return response;
}
