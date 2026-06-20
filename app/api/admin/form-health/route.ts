import { NextResponse } from "next/server";
import { sendInternalNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    const extra = error as Error & { code?: string; meta?: unknown };
    return {
      name: error.name,
      message: error.message,
      code: extra.code ?? null,
      meta: extra.meta ?? null
    };
  }

  return { name: "UnknownError", message: String(error), code: null, meta: null };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const url = new URL(request.url);
  const insert = url.searchParams.get("insert");

  try {
    const notificationHealth = {
      supportEmail: process.env.SUPPORT_EMAIL ?? "supportoforumevento@gmail.com",
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      webhookConfigured: Boolean(process.env.NOTIFICATION_WEBHOOK_URL),
      fromEmail: process.env.RESEND_FROM_EMAIL ?? "OrganizzaEvento <notifiche@organizzaevento.com>",
      missingKeys: [
        !process.env.RESEND_API_KEY && !process.env.NOTIFICATION_WEBHOOK_URL ? "RESEND_API_KEY oppure NOTIFICATION_WEBHOOK_URL" : null
      ].filter(Boolean)
    };

    if (insert === "notification") {
      const result = await sendInternalNotification({
        subject: "Test notifiche OrganizzaEvento.com",
        preview: "Questa e una mail di test dal backend protetto.",
        lines: [
          "Se ricevi questa mail, le notifiche automatiche sono attive.",
          "Da ora ogni nuova discussione e ogni nuova risposta possono essere recapitate su SUPPORT_EMAIL.",
          `Destinatario configurato: ${notificationHealth.supportEmail}`
        ]
      });

      return NextResponse.json({ ok: result.ok, notificationHealth, notificationTest: result });
    }

    const [supportCount, supplierCount, reportCount, accountCount] = await Promise.all([
      prisma.supportRequest.count(),
      prisma.supplierRequest.count(),
      prisma.report.count(),
      url.searchParams.get("accounts") === "1" ? prisma.userAccount.count() : Promise.resolve(null)
    ]);

    return NextResponse.json({
      ok: true,
      supportCount,
      supplierCount,
      reportCount,
      accountCount,
      notificationHealth,
      insertDisabled: Boolean(insert),
      message: insert
        ? "Gli inserimenti diagnostici nel database sono disattivati per mantenere solo dati reali."
        : "Controllo completato senza creare dati di test."
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: serializeError(error) }, { status: 500 });
  }
}

