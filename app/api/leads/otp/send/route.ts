import { NextResponse } from "next/server";
import { maskPhoneForUi, normalizePhoneForOtp, sendOtpToPhone } from "@/lib/twilio-otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as { phone?: string };
    const phone = normalizePhoneForOtp(input.phone);

    if (!phone) {
      return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
    }

    const result = await sendOtpToPhone(phone);
    if (!result.ok) {
      console.error("Twilio OTP send failed", result.error);
      return NextResponse.json({ ok: false, error: result.error ?? "otp_send_failed" }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      mode: result.mode,
      status: result.status,
      phoneMasked: maskPhoneForUi(phone),
      message: result.mode === "demo" ? "Codice demo inviato. In locale usa 123456." : "Codice inviato via SMS."
    });
  } catch (error) {
    console.error("OTP send route failed", error);
    return NextResponse.json({ ok: false, error: "otp_send_failed" }, { status: 500 });
  }
}
