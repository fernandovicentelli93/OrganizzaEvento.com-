import { NextResponse } from "next/server";
import { recordSiteVisit } from "@/lib/site-analytics";

export const dynamic = "force-dynamic";

function localeFromPath(path: string) {
  if (path === "/en" || path.startsWith("/en/")) return "en";
  if (path === "/es" || path.startsWith("/es/")) return "es";
  if (path === "/fr" || path.startsWith("/fr/")) return "fr";
  return "it";
}

function shouldSkipPath(path: string) {
  return (
    path.startsWith("/api") ||
    path.startsWith("/backend") ||
    path.startsWith("/gestione") ||
    path.startsWith("/admin") ||
    path.startsWith("/dashboard")
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { path?: string; referrer?: string };
    const path = typeof body.path === "string" && body.path.startsWith("/") ? body.path : "/";

    if (shouldSkipPath(path)) {
      return NextResponse.json({ ok: true, skipped: "private_path" });
    }

    const result = await recordSiteVisit({
      path,
      locale: localeFromPath(path),
      referrer: typeof body.referrer === "string" ? body.referrer : null
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Site visit tracking failed", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

