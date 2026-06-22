type TwilioVerifyResponse = {
  status?: string;
  sid?: string;
  code?: number;
  message?: string;
};

type OtpResult = {
  ok: boolean;
  mode: "twilio" | "demo";
  status?: string;
  error?: string;
};

function verifyServiceSid() {
  return process.env.TWILIO_VERIFY_SERVICE_SID || process.env.VERIFY_SERVICE_SID || "";
}

function twilioConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && verifyServiceSid());
}

function canUseDemoOtp() {
  return process.env.NODE_ENV !== "production" && !twilioConfigured();
}

function twilioAuthHeader() {
  const raw = `${process.env.TWILIO_ACCOUNT_SID ?? ""}:${process.env.TWILIO_AUTH_TOKEN ?? ""}`;
  return `Basic ${Buffer.from(raw).toString("base64")}`;
}

async function postVerify(path: string, params: URLSearchParams) {
  const serviceSid = verifyServiceSid();
  const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/${path}`, {
    method: "POST",
    headers: {
      Authorization: twilioAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });
  const data = (await response.json().catch(() => ({}))) as TwilioVerifyResponse;

  if (!response.ok) {
    return {
      ok: false,
      status: data.status,
      error: data.message || `twilio_${response.status}`
    };
  }

  return {
    ok: true,
    status: data.status
  };
}

export function normalizePhoneForOtp(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits || digits.length < 8 || digits.length > 15) return null;

  if (trimmed.startsWith("00")) return `+${digits.slice(2)}`;
  if (hasPlus) return `+${digits}`;
  if (digits.startsWith("39") && digits.length >= 11) return `+${digits}`;
  if (digits.startsWith("3") && digits.length >= 9 && digits.length <= 10) return `+39${digits}`;

  return `+${digits}`;
}

export function maskPhoneForUi(value: string) {
  const normalized = normalizePhoneForOtp(value);
  if (!normalized) return "";
  return `${normalized.slice(0, 4)} ${"*".repeat(Math.max(3, normalized.length - 7))}${normalized.slice(-3)}`;
}

export async function sendOtpToPhone(phone: string): Promise<OtpResult> {
  const to = normalizePhoneForOtp(phone);
  if (!to) return { ok: false, mode: "twilio", error: "invalid_phone" };

  if (canUseDemoOtp()) {
    return { ok: true, mode: "demo", status: "pending" };
  }

  if (!twilioConfigured()) {
    return { ok: false, mode: "twilio", error: "twilio_not_configured" };
  }

  const result = await postVerify("Verifications", new URLSearchParams({ To: to, Channel: "sms" }));
  return { ...result, mode: "twilio" };
}

export async function verifyOtpCode(phone: string, code: string): Promise<OtpResult & { approved: boolean }> {
  const to = normalizePhoneForOtp(phone);
  const cleanedCode = code.replace(/\s+/g, "");
  if (!to || cleanedCode.length < 4) return { ok: false, approved: false, mode: "twilio", error: "invalid_code" };

  if (canUseDemoOtp()) {
    return { ok: cleanedCode === "123456", approved: cleanedCode === "123456", mode: "demo", status: cleanedCode === "123456" ? "approved" : "pending" };
  }

  if (!twilioConfigured()) {
    return { ok: false, approved: false, mode: "twilio", error: "twilio_not_configured" };
  }

  const result = await postVerify("VerificationCheck", new URLSearchParams({ To: to, Code: cleanedCode }));
  return { ...result, approved: result.status === "approved", mode: "twilio" };
}
