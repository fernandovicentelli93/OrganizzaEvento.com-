import { createHash, createHmac, timingSafeEqual } from "crypto";

type TwilioParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

export type TwilioRequestPayload = {
  params: URLSearchParams;
  rawBody: string;
};

export function normalizePhone(value?: string | null) {
  if (!value) return null;
  const compact = value.trim().replace(/[^\d+]/g, "");
  if (!compact) return null;
  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("00")) return `+${compact.slice(2)}`;
  if (/^3\d{8,10}$/.test(compact)) return `+39${compact}`;
  return `+${compact.replace(/^\+/, "")}`;
}

export function phoneLast4(value?: string | null) {
  const normalized = normalizePhone(value);
  return normalized ? normalized.slice(-4) : null;
}

export function phoneHash(value?: string | null) {
  const normalized = normalizePhone(value);
  if (!normalized) return null;
  const salt = process.env.ACCOUNT_SESSION_SECRET || process.env.ADMIN_SECRET || "organizzaevento-phone-hash";
  return createHash("sha256").update(`${salt}:${normalized}`).digest("hex");
}

export function getSiteUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const url = new URL(request.url);
  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  return `${proto}://${host}`.replace(/\/$/, "");
}

export function getPublicRequestUrl(request: Request) {
  const url = new URL(request.url);
  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  return `${proto}://${host}${url.pathname}${url.search}`;
}

export function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function twilioXml(twiml: string, init?: ResponseInit) {
  return new Response(twiml, {
    ...init,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      ...(init?.headers ?? {})
    }
  });
}

export function twilioEmpty(status = 204) {
  return new Response(null, { status });
}

export async function readTwilioPayload(request: Request): Promise<TwilioRequestPayload> {
  const method = request.method.toUpperCase();
  if (method === "GET") {
    return { params: new URL(request.url).searchParams, rawBody: "" };
  }

  const rawBody = await request.text();
  return { params: new URLSearchParams(rawBody), rawBody };
}

function paramEntries(source: TwilioParamSource) {
  if (source instanceof URLSearchParams) {
    return Array.from(source.entries());
  }

  return Object.entries(source).flatMap(([key, value]) => {
    if (Array.isArray(value)) return value.map((item) => [key, item] as [string, string]);
    return value === undefined ? [] : ([[key, value] as [string, string]]);
  });
}

export function validateTwilioSignature(request: Request, params: TwilioParamSource) {
  if (process.env.TWILIO_VALIDATE_SIGNATURES !== "true") return true;

  const token = process.env.TWILIO_AUTH_TOKEN;
  const signature = request.headers.get("x-twilio-signature");
  if (!token || !signature) return false;

  const url = getPublicRequestUrl(request);
  const base = paramEntries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((value, [key, paramValue]) => `${value}${key}${paramValue}`, url);
  const digest = createHmac("sha1", token).update(base).digest("base64");
  const expected = Buffer.from(digest);
  const received = Buffer.from(signature);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function resolveSupplierPhone(options: { supplierId?: string | null; supplierPhone?: string | null }) {
  const supplierId = options.supplierId?.trim();
  const mapRaw = process.env.TWILIO_SUPPLIER_PHONE_MAP;
  let mappedPhone: string | null = null;

  if (supplierId && mapRaw) {
    try {
      const parsed = JSON.parse(mapRaw) as Record<string, string | undefined>;
      mappedPhone = parsed[supplierId] ?? null;
    } catch {
      mappedPhone = null;
    }
  }

  return normalizePhone(mappedPhone || options.supplierPhone);
}

export function buildForwardTwiml(options: {
  callId: string;
  supplierPhone: string;
  siteUrl: string;
  callerId?: string | null;
  message?: string;
}) {
  const callerId = normalizePhone(options.callerId ?? process.env.TWILIO_FROM_NUMBER);
  const actionUrl = `${options.siteUrl}/api/twilio/status?callId=${encodeURIComponent(options.callId)}`;
  const attributes = [
    `timeout="25"`,
    `method="POST"`,
    `action="${xmlEscape(actionUrl)}"`,
    `record="do-not-record"`,
    callerId ? `callerId="${xmlEscape(callerId)}"` : ""
  ]
    .filter(Boolean)
    .join(" ");
  const intro = options.message
    ? `<Say language="it-IT" voice="alice">${xmlEscape(options.message)}</Say>`
    : "";

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    "<Response>",
    intro,
    `<Dial ${attributes}>`,
    `<Number statusCallback="${xmlEscape(actionUrl)}" statusCallbackMethod="POST" statusCallbackEvent="initiated ringing answered completed">${xmlEscape(options.supplierPhone)}</Number>`,
    "</Dial>",
    '<Say language="it-IT" voice="alice">Non siamo riusciti a collegare il fornitore in questo momento. Riprova tra poco.</Say>',
    "</Response>"
  ].join("");
}

export function unavailableTwiml(message = "Non riusciamo a collegare il fornitore in questo momento. Riprova più tardi.") {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    "<Response>",
    `<Say language="it-IT" voice="alice">${xmlEscape(message)}</Say>`,
    "</Response>"
  ].join("");
}

export function parseDuration(value?: string | null) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isEndedStatus(value?: string | null) {
  return Boolean(value && ["completed", "busy", "failed", "no-answer", "canceled"].includes(value));
}
