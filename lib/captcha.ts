import { createHmac, randomInt, randomUUID, timingSafeEqual } from "crypto";

export type CaptchaChallenge = {
  question: string;
  token: string;
  signature: string;
};

const CAPTCHA_TTL_MS = 30 * 60 * 1000;

function secret() {
  return process.env.CAPTCHA_SECRET ?? process.env.ADMIN_SECRET ?? "organizzaevento-dev-captcha";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function encodePayload(payload: { answer: number; expiresAt: number; nonce: string }) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(token: string) {
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as {
      answer?: unknown;
      expiresAt?: unknown;
      nonce?: unknown;
    };
  } catch {
    return null;
  }
}

export function createCaptchaChallenge(): CaptchaChallenge {
  const left = randomInt(2, 10);
  const right = randomInt(2, 10);
  const answer = left + right;
  const token = encodePayload({
    answer,
    expiresAt: Date.now() + CAPTCHA_TTL_MS,
    nonce: randomUUID()
  });

  return {
    question: `${left} + ${right}`,
    token,
    signature: sign(token)
  };
}

export function verifyCaptcha(formData: FormData) {
  const answer = String(formData.get("captchaAnswer") ?? "").trim();
  const token = String(formData.get("captchaToken") ?? "");
  const signature = String(formData.get("captchaSignature") ?? "");

  if (!answer || !token || !signature || !safeEqual(sign(token), signature)) {
    throw new Error("Controllo anti-spam non valido. Ricarica la pagina e riprova.");
  }

  const payload = decodePayload(token);
  if (
    !payload ||
    typeof payload.answer !== "number" ||
    typeof payload.expiresAt !== "number" ||
    typeof payload.nonce !== "string" ||
    payload.expiresAt < Date.now()
  ) {
    throw new Error("Controllo anti-spam scaduto. Ricarica la pagina e riprova.");
  }

  if (Number.parseInt(answer, 10) !== payload.answer) {
    throw new Error("Risposta al controllo anti-spam non corretta.");
  }
}
