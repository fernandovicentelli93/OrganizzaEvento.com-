import { NextResponse } from "next/server";
import { recordMarketingEvent } from "@/lib/site-analytics";

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

function safeEventName(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[^a-z0-9_:-]/gi, "").slice(0, 80);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      eventName?: unknown;
      path?: unknown;
      referrer?: unknown;
      placement?: unknown;
      target?: unknown;
      metadata?: unknown;
    };
    const eventName = safeEventName(body.eventName);
    const path = typeof body.path === "string" && body.path.startsWith("/") ? body.path : "/";

    if (!eventName) {
      return NextResponse.json({ ok: true, skipped: "empty_event" });
    }
    if (shouldSkipPath(path)) {
      return NextResponse.json({ ok: true, skipped: "private_path" });
    }

    const result = await recordMarketingEvent({
      eventName,
      path,
      locale: localeFromPath(path),
      referrer: typeof body.referrer === "string" ? body.referrer : null,
      placement: typeof body.placement === "string" ? body.placement : null,
      target: typeof body.target === "string" ? body.target : null,
      metadata:
        body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
          ? (body.metadata as Record<string, unknown>)
          : null
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Marketing event tracking failed", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
