import { NextResponse } from "next/server";
import { createLeadOtpProof } from "@/lib/lead-otp-proof";
import { normalizePhoneForOtp, verifyOtpCode } from "@/lib/twilio-otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as { phone?: string; code?: string };
    const phone = normalizePhoneForOtp(input.phone);
    const code = typeof input.code === "string" ? input.code.trim() : "";

    if (!phone || !code) {
      return NextResponse.json({ ok: false, verified: false, error: "invalid_otp_request" }, { status: 400 });
    }

    const result = await verifyOtpCode(phone, code);
    if (!result.ok || !result.approved) {
      return NextResponse.json({ ok: false, verified: false, error: "otp_not_approved" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      verified: true,
      mode: result.mode,
      otpProof: createLeadOtpProof(phone)
    });
  } catch (error) {
    console.error("OTP verify route failed", error);
    return NextResponse.json({ ok: false, verified: false, error: "otp_verify_failed" }, { status: 500 });
  }
}
