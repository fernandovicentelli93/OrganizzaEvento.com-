import { NextResponse } from "next/server";
import { sendInternalNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const result = await sendInternalNotification({
    subject: "Test notifiche OrganizzaEvento.com",
    preview: "Questa è una mail di test dal backend protetto.",
    lines: [
      "Se ricevi questa mail, le notifiche automatiche sono attive.",
      "Il sito invia una notifica interna quando viene aperta una nuova discussione.",
      "Il sito invia una notifica interna quando viene pubblicata una nuova risposta.",
      `Destinatario: ${process.env.SUPPORT_EMAIL ?? "supportoforumevento@gmail.com"}`
    ]
  });

  return NextResponse.json({
    ok: result.ok,
    result,
    configured: {
      supportEmail: process.env.SUPPORT_EMAIL ?? "supportoforumevento@gmail.com",
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      webhookConfigured: Boolean(process.env.NOTIFICATION_WEBHOOK_URL),
      fromEmail: process.env.RESEND_FROM_EMAIL ?? "OrganizzaEvento <notifiche@organizzaevento.com>"
    }
  });
}
