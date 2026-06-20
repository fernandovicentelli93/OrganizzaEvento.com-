import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import type { AccountRole } from "@prisma/client";
import { isLocale, localizedStaticPath, type Locale } from "@/lib/i18n-basic";

export const GOOGLE_OAUTH_STATE_COOKIE = "oe_google_oauth_state";

type GoogleOAuthStatePayload = {
  state: string;
  role: AccountRole;
  locale: Locale;
  returnTo: string;
  redirectUri: string;
  createdAt: number;
};

export type VerifiedGoogleOAuthState = GoogleOAuthStatePayload;

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function oauthStateSecret() {
  return (
    process.env.GOOGLE_OAUTH_STATE_SECRET ??
    process.env.ACCOUNT_SESSION_SECRET ??
    process.env.ADMIN_SECRET ??
    "organizzaevento-dev-google-oauth"
  );
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", oauthStateSecret()).update(encodedPayload).digest("base64url");
}

function safeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function safeInternalPath(path: string | null | undefined, fallback = "/") {
  const cleanPath = path?.trim();
  if (!cleanPath || !cleanPath.startsWith("/") || cleanPath.startsWith("//")) return fallback;
  return cleanPath;
}

export function googleOAuthConfig(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  return {
    clientId,
    clientSecret,
    redirectUri: process.env.GOOGLE_REDIRECT_URI?.trim() || new URL("/api/auth/google/callback", request.url).toString()
  };
}

export function createGoogleOAuthState(input: {
  role: AccountRole;
  locale: Locale;
  returnTo?: string | null;
  redirectUri: string;
}) {
  const state = randomBytes(24).toString("base64url");
  const payload: GoogleOAuthStatePayload = {
    state,
    role: input.role,
    locale: input.locale,
    returnTo: safeInternalPath(input.returnTo, localizedStaticPath(input.locale, "login")),
    redirectUri: input.redirectUri,
    createdAt: Date.now()
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return {
    state,
    cookieValue: `${encodedPayload}.${signPayload(encodedPayload)}`
  };
}

export function readGoogleOAuthState(cookieValue: string | undefined, state: string | null) {
  if (!cookieValue || !state) return null;

  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature || !safeEquals(signPayload(encodedPayload), signature)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as Partial<GoogleOAuthStatePayload>;
    const isFresh = typeof payload.createdAt === "number" && Date.now() - payload.createdAt < 10 * 60 * 1000;
    const validRole = payload.role === "client" || payload.role === "supplier";
    const validLocale = isLocale(payload.locale);
    if (!isFresh || !validRole || !validLocale || payload.state !== state || !payload.redirectUri) return null;

    return {
      state: payload.state as string,
      role: payload.role as AccountRole,
      locale: payload.locale as Locale,
      returnTo: safeInternalPath(payload.returnTo, localizedStaticPath(payload.locale as Locale, "login")),
      redirectUri: payload.redirectUri as string,
      createdAt: payload.createdAt as number
    } satisfies VerifiedGoogleOAuthState;
  } catch {
    return null;
  }
}

export function localizedLoginErrorPath(locale: Locale, reason: string) {
  return `${localizedStaticPath(locale, "login")}?errore=${encodeURIComponent(reason)}`;
}

export function defaultGoogleProfileTag(role: AccountRole, locale: Locale) {
  if (role === "supplier") {
    if (locale === "en") return "Supplier";
    if (locale === "es") return "Proveedor";
    if (locale === "fr") return "Prestataire";
    return "Fornitore";
  }

  if (locale === "en") return "Client";
  if (locale === "fr") return "Client";
  return "Cliente";
}
