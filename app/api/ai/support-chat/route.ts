import { NextResponse } from "next/server";
import { createCommunityChatReply, moderateCommunityContent } from "@/lib/openai-community";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const locales = new Set(["it", "en", "es", "fr"]);

function pickString(value: unknown, maxLength = 2000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const locale = locales.has(String(body.locale)) ? (body.locale as "it" | "en" | "es" | "fr") : "it";
    const message = pickString(body.message, 2500);
    const sourcePath = pickString(body.sourcePath, 300);

    if (message.length < 4) {
      return NextResponse.json({ ok: false, error: "message_required" }, { status: 400 });
    }

    const moderation = await moderateCommunityContent({
      context: "private_support",
      fields: [message, sourcePath]
    });

    if (moderation.decision === "block") {
      return NextResponse.json({ ok: false, error: "message_blocked" }, { status: 400 });
    }

    const reply = await createCommunityChatReply({ locale, message, sourcePath });
    return NextResponse.json({ ok: true, reply });
  } catch (error) {
    console.error("Support chat failed", error);
    return NextResponse.json({ ok: false, error: "support_chat_failed" }, { status: 503 });
  }
}
