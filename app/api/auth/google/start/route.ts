import { NextResponse } from "next/server";
import type { AccountRole } from "@prisma/client";
import {
  GOOGLE_OAUTH_STATE_COOKIE,
  createGoogleOAuthState,
  googleOAuthConfig,
  localizedLoginErrorPath,
  safeInternalPath
} from "@/lib/google-oauth";
import { isLocale, localizedStaticPath, type Locale } from "@/lib/i18n-basic";

function parseRole(value: string | null): AccountRole {
  return value === "supplier" ? "supplier" : "client";
}

function parseLocale(value: string | null): Locale {
  return isLocale(value ?? undefined) ? (value as Locale) : "it";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = parseLocale(url.searchParams.get("locale"));
  const role = parseRole(url.searchParams.get("role"));
  const config = googleOAuthConfig(request);

  if (!config) {
    return NextResponse.redirect(new URL(localizedLoginErrorPath(locale, "google_config"), request.url), 303);
  }

  const { state, cookieValue } = createGoogleOAuthState({
    role,
    locale,
    returnTo: safeInternalPath(url.searchParams.get("returnTo"), localizedStaticPath(locale, "login")),
    redirectUri: config.redirectUri
  });

  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleUrl.searchParams.set("client_id", config.clientId);
  googleUrl.searchParams.set("redirect_uri", config.redirectUri);
  googleUrl.searchParams.set("response_type", "code");
  googleUrl.searchParams.set("scope", "openid email profile");
  googleUrl.searchParams.set("state", state);
  googleUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(googleUrl, 303);
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/"
  });
  return response;
}
