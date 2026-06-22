import { createHmac, timingSafeEqual } from "crypto";
import { normalizePhone, phoneLast4 } from "@/lib/twilio-call-tracking";

const VERIFY_BASE_URL = "https://verify.twilio.com/v2";
const OTP_TOKEN_MAX_AGE_MS = 30 * 60 * 1000;

type VerifyChannel = "sms" | "whatsapp" | "call";

type TwilioVerifyResponse = {
  status?: string;
  sid?: string;
  to?: string;
  channel?: string;
  message?: string;
  code?: number;
};

function clean(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

function verifyServiceSid() {
  return clean(process.env.TWILIO_VERIFY_SERVICE_SID) || clean(process.env.VERIFY_SERVICE_SID);
}

function verifySecret() {
  return process.env.ACCOUNT_SESSION_SECRET || process.env.ADMIN_SECRET || process.env.TWILIO_AUTH_TOKEN || "organizzaevento-otp";
}

function twilioConfig() {
  const accountSid = clean(process.env.TWILIO_ACCOUNT_SID);
  const authToken = clean(process.env.TWILIO_AUTH_TOKEN);
  const serviceSid = verifyServiceSid();

  if (!accountSid || !authToken || !serviceSid) return null;
  return { accountSid, authToken, serviceSid };
}

function twilioAuthHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}

function normalizeChannel(value?: string | null): VerifyChannel {
  const channel = clean(value).toLowerCase();
  if (channel === "whatsapp") return "whatsapp";
  if (channel === "voice" || channel === "call") return "call";
  return "sms";
}

async function twilioVerifyPost(path: string, body: URLSearchParams) {
  const config = twilioConfig();
  if (!config) {
    return {
      ok: false,
      status: 503,
      data: { message: "Twilio Verify non configurato." } satisfies TwilioVerifyResponse
    };
  }

  const response = await fetch(`${VERIFY_BASE_URL}/Services/${encodeURIComponent(config.serviceSid)}/${path}`, {
    method: "POST",
    headers: {
      Authorization: twilioAuthHeader(config.accountSid, config.authToken),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = (await response.json().catch(() => ({}))) as TwilioVerifyResponse;
  return { ok: response.ok, status: response.status, data };
}

export async function sendOtpCode(options: { phone?: string | null; channel?: string | null }) {
  const phone = normalizePhone(options.phone);
  if (!phone) {
    return { ok: false, status: 400, error: "invalid_phone" as const };
  }

  const channel = normalizeChannel(options.channel);
  const body = new URLSearchParams();
  body.set("To", phone);
  body.set("Channel", channel);

  const result = await twilioVerifyPost("Verifications", body);
  if (!result.ok) {
    return {
      ok: false,
      status: result.status,
      error: "twilio_send_failed" as const,
      twilioStatus: result.data.status,
      twilioMessage: result.data.message
    };
  }

  return {
    ok: true,
    status: 200,
    phone,
    phoneLast4: phoneLast4(phone),
    channel,
    verificationStatus: result.data.status ?? "pending"
  };
}

export async function checkOtpCode(options: { phone?: string | null; code?: string | null }) {
  const phone = normalizePhone(options.phone);
  const code = clean(options.code).replace(/\s+/g, "");

  if (!phone || !/^\d{4,10}$/.test(code)) {
    return { ok: false, status: 400, error: "invalid_code" as const };
  }

  const body = new URLSearchParams();
  body.set("To", phone);
  body.set("Code", code);

  const result = await twilioVerifyPost("VerificationCheck", body);
  if (!result.ok) {
    return {
      ok: false,
      status: result.status,
      error: "twilio_check_failed" as const,
      twilioStatus: result.data.status,
      twilioMessage: result.data.message
    };
  }

  const approved = result.data.status === "approved";
  return {
    ok: approved,
    status: approved ? 200 : 400,
    phone,
    phoneLast4: phoneLast4(phone),
    verificationStatus: result.data.status ?? "pending",
    verificationToken: approved ? createOtpVerificationToken(phone) : null
  };
}

export function createOtpVerificationToken(phoneValue?: string | null) {
  const phone = normalizePhone(phoneValue);
  if (!phone) return null;

  const issuedAt = Date.now();
  const payload = `${phone}.${issuedAt}`;
  const signature = createHmac("sha256", verifySecret()).update(payload).digest("base64url");
  return `${issuedAt}.${signature}`;
}

export function verifyOtpVerificationToken(phoneValue?: string | null, token?: string | null) {
  const phone = normalizePhone(phoneValue);
  const value = clean(token);
  if (!phone || !value) return false;

  const [issuedAtRaw, signature] = value.split(".");
  const issuedAt = Number.parseInt(issuedAtRaw, 10);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > OTP_TOKEN_MAX_AGE_MS) return false;

  const payload = `${phone}.${issuedAt}`;
  const expected = createHmac("sha256", verifySecret()).update(payload).digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature ?? "");

  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}
