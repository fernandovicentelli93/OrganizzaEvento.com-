import { createHmac, timingSafeEqual } from "crypto";
import { normalizePhoneForOtp } from "@/lib/twilio-otp";

const OTP_PROOF_TTL_MS = 30 * 60 * 1000;

type OtpProofPayload = {
  phoneHash: string;
  expiresAt: number;
};

function otpProofSecret() {
  return process.env.ACCOUNT_SESSION_SECRET || process.env.ADMIN_SECRET || process.env.TWILIO_AUTH_TOKEN || "organizzaevento-local-otp-proof";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", otpProofSecret()).update(value).digest("base64url");
}

function phoneHash(phone: string) {
  return createHmac("sha256", otpProofSecret()).update(phone).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createLeadOtpProof(phone: string) {
  const normalizedPhone = normalizePhoneForOtp(phone);
  if (!normalizedPhone) return "";

  const payload: OtpProofPayload = {
    phoneHash: phoneHash(normalizedPhone),
    expiresAt: Date.now() + OTP_PROOF_TTL_MS
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyLeadOtpProof(phone: string, proof: unknown) {
  const normalizedPhone = normalizePhoneForOtp(phone);
  if (!normalizedPhone || typeof proof !== "string") return false;

  const [encodedPayload, signature] = proof.split(".");
  if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload))) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as Partial<OtpProofPayload>;
    return payload.expiresAt === Number(payload.expiresAt) && payload.expiresAt > Date.now() && payload.phoneHash === phoneHash(normalizedPhone);
  } catch {
    return false;
  }
}
