import { randomUUID } from "crypto";
import { trackedCallPrisma } from "@/lib/tracked-call-prisma";
import {
  buildForwardTwiml,
  getSiteUrl,
  phoneHash,
  phoneLast4,
  readTwilioPayload,
  resolveSupplierPhone,
  twilioXml,
  unavailableTwiml,
  validateTwilioSignature
} from "@/lib/twilio-call-tracking";

export const dynamic = "force-dynamic";

async function handleVoice(request: Request) {
  const payload = await readTwilioPayload(request);
  const params = payload.params;

  if (!validateTwilioSignature(request, params)) {
    return twilioXml(unavailableTwiml("Richiesta non autorizzata."), { status: 403 });
  }

  const supplierId = params.get("supplierId");
  const supplierName = params.get("supplierName");
  const supplierProfileUrl = params.get("supplierProfileUrl");
  const sourcePath = params.get("sourcePath");
  const supplierPhone = resolveSupplierPhone({
    supplierId,
    supplierPhone: params.get("supplierPhone")
  });
  const twilioCallSid = params.get("CallSid");
  const customerPhone = params.get("From");

  if (!supplierPhone) {
    return twilioXml(unavailableTwiml("Non troviamo il numero del fornitore da collegare. Riprova più tardi."));
  }

  const call = await trackedCallPrisma.trackedCall.upsert({
    where: { twilioCallSid: twilioCallSid || `missing-${randomUUID()}` },
    update: {
      status: params.get("CallStatus") || "ringing",
      supplierId,
      supplierName,
      supplierProfileUrl,
      sourcePath,
      supplierPhoneLast4: phoneLast4(supplierPhone),
      supplierPhoneHash: phoneHash(supplierPhone),
      customerPhoneLast4: phoneLast4(customerPhone),
      customerPhoneHash: phoneHash(customerPhone),
      startedAt: new Date()
    },
    create: {
      direction: "inbound_forward",
      supplierId,
      supplierName,
      supplierProfileUrl,
      sourcePath,
      supplierPhoneLast4: phoneLast4(supplierPhone),
      supplierPhoneHash: phoneHash(supplierPhone),
      customerPhoneLast4: phoneLast4(customerPhone),
      customerPhoneHash: phoneHash(customerPhone),
      twilioCallSid,
      status: params.get("CallStatus") || "ringing",
      startedAt: new Date(),
      metadata: {
        twilioTo: params.get("To"),
        direction: params.get("Direction")
      }
    }
  });

  return twilioXml(
    buildForwardTwiml({
      callId: call.id,
      supplierPhone,
      siteUrl: getSiteUrl(request),
      message: "Ti colleghiamo al fornitore. La chiamata non viene registrata."
    })
  );
}

export async function POST(request: Request) {
  return handleVoice(request);
}

export async function GET(request: Request) {
  return handleVoice(request);
}
