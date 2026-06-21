import { trackedCallPrisma } from "@/lib/tracked-call-prisma";
import {
  buildForwardTwiml,
  getSiteUrl,
  readTwilioPayload,
  resolveSupplierPhone,
  twilioXml,
  unavailableTwiml,
  validateTwilioSignature
} from "@/lib/twilio-call-tracking";

export const dynamic = "force-dynamic";

async function handleConnect(request: Request) {
  const payload = await readTwilioPayload(request);
  const params = payload.params;
  const url = new URL(request.url);

  if (!validateTwilioSignature(request, params)) {
    return twilioXml(unavailableTwiml("Richiesta non autorizzata."), { status: 403 });
  }

  const callId = url.searchParams.get("callId") || params.get("callId");
  const supplierId = url.searchParams.get("supplierId") || params.get("supplierId");
  const supplierPhone = resolveSupplierPhone({
    supplierId,
    supplierPhone: url.searchParams.get("supplierPhone") || params.get("supplierPhone")
  });

  if (!callId || !supplierPhone) {
    return twilioXml(unavailableTwiml("Non troviamo il fornitore da collegare."));
  }

  await trackedCallPrisma.trackedCall.update({
    where: { id: callId },
    data: {
      status: params.get("CallStatus") || "in-progress",
      twilioParentCallSid: params.get("CallSid") || undefined,
      startedAt: new Date()
    }
  }).catch(() => null);

  return twilioXml(
    buildForwardTwiml({
      callId,
      supplierPhone,
      siteUrl: getSiteUrl(request),
      message: "Ti colleghiamo al fornitore. La chiamata non viene registrata."
    })
  );
}

export async function POST(request: Request) {
  return handleConnect(request);
}

export async function GET(request: Request) {
  return handleConnect(request);
}
