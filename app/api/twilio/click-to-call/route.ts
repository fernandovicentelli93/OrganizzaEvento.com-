import { trackedCallPrisma } from "@/lib/tracked-call-prisma";
import {
  getSiteUrl,
  phoneHash,
  phoneLast4,
  normalizePhone,
  resolveSupplierPhone
} from "@/lib/twilio-call-tracking";

export const dynamic = "force-dynamic";

type ClickToCallBody = {
  customerPhone?: string;
  supplierId?: string;
  supplierName?: string;
  supplierProfileUrl?: string;
  supplierPhone?: string;
  sourcePath?: string;
};

async function readBody(request: Request): Promise<ClickToCallBody> {
  try {
    return (await request.json()) as ClickToCallBody;
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  if (process.env.TWILIO_CLICK_TO_CALL_ENABLED !== "true") {
    return Response.json({ ok: false, error: "Click-to-call non abilitato." }, { status: 403 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = normalizePhone(process.env.TWILIO_FROM_NUMBER);

  if (!accountSid || !authToken || !fromNumber) {
    return Response.json({ ok: false, error: "Configurazione Twilio incompleta." }, { status: 503 });
  }

  const body = await readBody(request);
  const customerPhone = normalizePhone(body.customerPhone);
  const supplierPhone = resolveSupplierPhone({
    supplierId: body.supplierId,
    supplierPhone: body.supplierPhone
  });

  if (!customerPhone || !supplierPhone) {
    return Response.json({ ok: false, error: "Telefono cliente o fornitore non valido." }, { status: 400 });
  }

  const call = await trackedCallPrisma.trackedCall.create({
    data: {
      direction: "click_to_call",
      supplierId: body.supplierId,
      supplierName: body.supplierName,
      supplierProfileUrl: body.supplierProfileUrl,
      sourcePath: body.sourcePath,
      supplierPhoneLast4: phoneLast4(supplierPhone),
      supplierPhoneHash: phoneHash(supplierPhone),
      customerPhoneLast4: phoneLast4(customerPhone),
      customerPhoneHash: phoneHash(customerPhone),
      status: "created",
      startedAt: new Date(),
      metadata: {
        initiatedBy: "organizzaevento",
        note: "Il numero completo non viene salvato nel database."
      }
    }
  });

  const siteUrl = getSiteUrl(request);
  const connectUrl = new URL(`${siteUrl}/api/twilio/connect`);
  connectUrl.searchParams.set("callId", call.id);
  if (body.supplierId) connectUrl.searchParams.set("supplierId", body.supplierId);
  connectUrl.searchParams.set("supplierPhone", supplierPhone);

  const statusUrl = new URL(`${siteUrl}/api/twilio/status`);
  statusUrl.searchParams.set("callId", call.id);

  const payload = new URLSearchParams();
  payload.set("To", customerPhone);
  payload.set("From", fromNumber);
  payload.set("Url", connectUrl.toString());
  payload.set("Method", "POST");
  payload.set("StatusCallback", statusUrl.toString());
  payload.set("StatusCallbackMethod", "POST");
  payload.append("StatusCallbackEvent", "initiated");
  payload.append("StatusCallbackEvent", "ringing");
  payload.append("StatusCallbackEvent", "answered");
  payload.append("StatusCallbackEvent", "completed");

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: payload
  });

  const result = (await response.json().catch(() => ({}))) as { sid?: string; status?: string; message?: string };

  if (!response.ok) {
    await trackedCallPrisma.trackedCall.update({
      where: { id: call.id },
      data: {
        status: "failed",
        metadata: {
          twilioError: result.message || "Errore Twilio",
          failedAt: new Date().toISOString()
        }
      }
    });
    return Response.json({ ok: false, error: result.message || "Errore Twilio." }, { status: 502 });
  }

  await trackedCallPrisma.trackedCall.update({
    where: { id: call.id },
    data: {
      twilioCallSid: result.sid,
      status: result.status || "queued"
    }
  });

  return Response.json({ ok: true, callId: call.id, status: result.status || "queued" });
}
