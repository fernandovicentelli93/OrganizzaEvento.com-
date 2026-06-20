import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import type { AccountRole } from "@prisma/client";
import { ACCOUNT_COOKIE, accountSessionValue, dashboardPath, hashPassword } from "@/lib/account";
import { publicIdentityConflict } from "@/lib/account-identity";
import { ensureAccountSchema } from "@/lib/account-schema";
import {
  GOOGLE_OAUTH_STATE_COOKIE,
  defaultGoogleProfileTag,
  googleOAuthConfig,
  localizedLoginErrorPath,
  readGoogleOAuthState
} from "@/lib/google-oauth";
import { sendInternalNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

type GoogleTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  id_token?: string;
  error?: string;
};

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

function cleanDisplayName(value: string | undefined, fallback: string) {
  return (value ?? fallback)
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

async function uniqueDisplayName(baseName: string) {
  const base = cleanDisplayName(baseName, "Utente Google") || "Utente Google";
  let candidate = base;

  for (let index = 0; index < 6; index += 1) {
    const conflict = await publicIdentityConflict([candidate]);
    if (!conflict) return candidate;
    candidate = `${base} ${randomBytes(2).toString("hex")}`;
  }

  return `${base} ${randomBytes(4).toString("hex")}`;
}

function mergeAuthProvider(current: string | null | undefined) {
  if (!current) return "google";
  return current.split("+").includes("google") ? current : `${current}+google`;
}

async function exchangeCodeForToken(input: { code: string; clientId: string; clientSecret: string; redirectUri: string }) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: input.code,
      client_id: input.clientId,
      client_secret: input.clientSecret,
      redirect_uri: input.redirectUri,
      grant_type: "authorization_code"
    })
  });

  const data = (await response.json()) as GoogleTokenResponse;
  if (!response.ok || !data.access_token) {
    throw new Error(data.error ?? `Google token exchange failed: ${response.status}`);
  }
  return data.access_token;
}

async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) throw new Error(`Google userinfo failed: ${response.status}`);
  return (await response.json()) as GoogleUserInfo;
}

async function createGoogleAccount(input: {
  role: AccountRole;
  locale: "it" | "en" | "es" | "fr";
  email: string;
  displayName: string;
  photoUrl: string | null;
}) {
  const displayName = await uniqueDisplayName(input.displayName);
  const account = await prisma.userAccount.create({
    data: {
      role: input.role,
      email: input.email,
      displayName,
      profileTag: defaultGoogleProfileTag(input.role, input.locale),
      photoUrl: input.photoUrl,
      passwordHash: hashPassword(randomBytes(24).toString("hex")),
      authProvider: "google",
      activityPoints: input.role === "supplier" ? 20 : 10,
      lastLoginAt: new Date(),
      lastSeenAt: new Date()
    }
  });

  await sendInternalNotification({
    subject: "Nuovo account Google creato",
    preview: "Una persona ha creato un account su OrganizzaEvento.com usando Google.",
    lines: [
      `Tipo account: ${input.role === "supplier" ? "Fornitore" : "Cliente"}`,
      `Nome visibile: ${displayName}`,
      `Email: ${input.email}`,
      `Lingua di ingresso: ${input.locale.toUpperCase()}`
    ]
  });

  return account;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fallbackLocale = "it";
  const config = googleOAuthConfig(request);
  if (!config) return redirectTo(request, localizedLoginErrorPath(fallbackLocale, "google_config"));

  const statePayload = readGoogleOAuthState(
    request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${GOOGLE_OAUTH_STATE_COOKIE}=`))
      ?.slice(GOOGLE_OAUTH_STATE_COOKIE.length + 1),
    url.searchParams.get("state")
  );

  const locale = statePayload?.locale ?? fallbackLocale;
  const responsePath = localizedLoginErrorPath(locale, "google_state");

  if (url.searchParams.get("error")) {
    return redirectTo(request, localizedLoginErrorPath(locale, "google_denied"));
  }
  if (!statePayload) return redirectTo(request, responsePath);

  const code = url.searchParams.get("code");
  if (!code) return redirectTo(request, localizedLoginErrorPath(locale, "google"));

  try {
    await ensureAccountSchema();
    const accessToken = await exchangeCodeForToken({
      code,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: statePayload.redirectUri
    });
    const userInfo = await getGoogleUserInfo(accessToken);
    const email = userInfo.email?.trim().toLowerCase();

    if (!email || userInfo.email_verified !== true) {
      return redirectTo(request, localizedLoginErrorPath(locale, "google_email"));
    }

    const existing = await prisma.userAccount.findUnique({ where: { email } });
    const account = existing
      ? await prisma.userAccount.update({
          where: { id: existing.id },
          data: {
            authProvider: mergeAuthProvider(existing.authProvider),
            photoUrl: existing.photoUrl ?? userInfo.picture ?? null,
            lastLoginAt: new Date(),
            lastSeenAt: new Date()
          }
        })
      : await createGoogleAccount({
          role: statePayload.role,
          locale,
          email,
          displayName: cleanDisplayName(userInfo.name, email.split("@")[0]),
          photoUrl: userInfo.picture ?? null
        });

    if (account.status !== "active") return redirectTo(request, localizedLoginErrorPath(locale, "google_account"));

    const response = redirectTo(request, dashboardPath(account.role));
    response.cookies.set(ACCOUNT_COOKIE, accountSessionValue(account), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });
    response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
    return response;
  } catch (error) {
    console.error("Accesso Google non riuscito.", error);
    return redirectTo(request, localizedLoginErrorPath(locale, "google"));
  }
}
