import { sendOtpCode } from "@/lib/twilio-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StartOtpBody = {
  phone?: string;
  channel?: string;
};

async function readBody(request: Request): Promise<StartOtpBody> {
  try {
    return (await request.json()) as StartOtpBody;
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const body = await readBody(request);
  const result = await sendOtpCode({ phone: body.phone, channel: body.channel });

  if (!result.ok) {
    const message =
      result.error === "invalid_phone"
        ? "Inserisci un numero di telefono valido."
        : "Non siamo riusciti a inviare il codice. Riprova tra poco.";

    return Response.json(
      {
        ok: false,
        error: result.error,
        message
      },
      { status: result.status }
    );
  }

  return Response.json({
    ok: true,
    status: result.verificationStatus,
    channel: result.channel,
    phoneLast4: result.phoneLast4,
    message: "Codice inviato."
  });
}
