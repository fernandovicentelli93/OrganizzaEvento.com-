import { checkOtpCode } from "@/lib/twilio-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckOtpBody = {
  phone?: string;
  code?: string;
};

async function readBody(request: Request): Promise<CheckOtpBody> {
  try {
    return (await request.json()) as CheckOtpBody;
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const body = await readBody(request);
  const result = await checkOtpCode({ phone: body.phone, code: body.code });

  if (!result.ok) {
    const message =
      result.error === "invalid_code"
        ? "Codice non valido. Controlla il numero e riprova."
        : "Non siamo riusciti a verificare il codice. Riprova tra poco.";

    return Response.json(
      {
        ok: false,
        error: result.error,
        status: "pending",
        message
      },
      { status: result.status }
    );
  }

  return Response.json({
    ok: true,
    otpVerified: true,
    status: result.verificationStatus,
    phoneLast4: result.phoneLast4,
    verificationToken: result.verificationToken,
    message: "Numero verificato."
  });
}
