import { SUPPORT_EMAIL } from "@/lib/constants";

type NotificationPayload = {
  subject: string;
  preview: string;
  lines: string[];
  to?: string[];
};

export type NotificationResult = {
  ok: boolean;
  channel: "webhook" | "resend" | "none";
  reason?: string;
};

function htmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function notificationToText(payload: NotificationPayload) {
  return [payload.preview, "", ...payload.lines].join("\n");
}

function notificationToHtml(payload: NotificationPayload) {
  const lines = payload.lines
    .map((line) => `<p style="margin:0 0 10px;color:#2f2430;line-height:1.5">${htmlEscape(line)}</p>`)
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;padding:24px;background:#fff8f3">
      <h1 style="margin:0 0 12px;color:#2f2430;font-size:22px">${htmlEscape(payload.subject)}</h1>
      <p style="margin:0 0 18px;color:#7a6471;line-height:1.5">${htmlEscape(payload.preview)}</p>
      ${lines}
    </div>
  `;
}

function recipients(payload: NotificationPayload) {
  const fallback = process.env.SUPPORT_EMAIL ?? SUPPORT_EMAIL;
  return payload.to?.length ? payload.to : [fallback];
}

async function sendWithWebhook(payload: NotificationPayload) {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return false;

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      to: recipients(payload),
      subject: payload.subject,
      text: notificationToText(payload),
      html: notificationToHtml(payload)
    })
  });

  return true;
}

async function sendWithResend(payload: NotificationPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? "OrganizzaEvento <notifiche@organizzaevento.com>",
      to: recipients(payload),
      subject: payload.subject,
      text: notificationToText(payload),
      html: notificationToHtml(payload)
    })
  });

  if (!response.ok) {
    throw new Error(`Invio email non riuscito: ${response.status}`);
  }

  return true;
}

export async function sendInternalNotification(payload: NotificationPayload) {
  try {
    const sentWithWebhook = await sendWithWebhook(payload);
    if (sentWithWebhook) return { ok: true, channel: "webhook" } satisfies NotificationResult;

    const sentWithResend = await sendWithResend(payload);
    if (sentWithResend) return { ok: true, channel: "resend" } satisfies NotificationResult;

    const reason = "Manca NOTIFICATION_WEBHOOK_URL o RESEND_API_KEY.";
    console.info(`Notifica email saltata: ${reason}`);
    return { ok: false, channel: "none", reason } satisfies NotificationResult;
  } catch (error) {
    console.error("Notifica email non inviata.", error);
    return {
      ok: false,
      channel: process.env.RESEND_API_KEY ? "resend" : process.env.NOTIFICATION_WEBHOOK_URL ? "webhook" : "none",
      reason: error instanceof Error ? error.message : String(error)
    } satisfies NotificationResult;
  }
}
