import { NextResponse } from "next/server";
import { ACCOUNT_COOKIE, accountSessionValue, dashboardPath, verifyPassword } from "@/lib/account";
import { ensureAccountSchema } from "@/lib/account-schema";
import { prisma } from "@/lib/prisma";
import { assertHoneypotEmpty, assertHumanPace } from "@/lib/spam";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

function safeInternalPath(path: string, fallback = "/login") {
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const loginPath = safeInternalPath(value(formData, "loginPath") || "/login");

  try {
    await ensureAccountSchema();
    assertHoneypotEmpty(formData);
    assertHumanPace(formData, 1);

    const email = value(formData, "email").toLowerCase();
    const password = value(formData, "password");
    const account = await prisma.userAccount.findUnique({ where: { email } });

    if (!account || account.status !== "active" || !verifyPassword(password, account.passwordHash)) {
      return redirectTo(request, `${loginPath}?errore=1`);
    }

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
    console.error("Login account non riuscito.", error);
    return redirectTo(request, `${loginPath}?errore=1`);
  }
}
