import { trackedCallPrisma } from "@/lib/tracked-call-prisma";
import {
  isEndedStatus,
  parseDuration,
  readTwilioPayload,
  twilioEmpty,
  validateTwilioSignature
} from "@/lib/twilio-call-tracking";

export const dynamic = "force-dynamic";

async function handleStatus(request: Request) {
  const payload = await readTwilioPayload(request);
  const params = payload.params;

  if (!validateTwilioSignature(request, params)) {
    return new Response("Forbidden", { status: 403 });
  }

  const callId = new URL(request.url).searchParams.get("callId") || params.get("callId");
  const callStatus = params.get("CallStatus");
  const dialStatus = params.get("DialCallStatus") || params.get("DialStatus");
  const effectiveStatus = dialStatus || callStatus || undefined;
  const duration =
    parseDuration(params.get("DialCallDuration")) ??
    parseDuration(params.get("CallDuration")) ??
    parseDuration(params.get("Duration"));

  if (callId) {
    await trackedCallPrisma.trackedCall.update({
      where: { id: callId },
      data: {
        status: effectiveStatus,
        dialStatus,
        twilioParentCallSid: params.get("ParentCallSid") || undefined,
        twilioDialCallSid: params.get("DialCallSid") || undefined,
        durationSeconds: duration ?? undefined,
        answeredAt: effectiveStatus === "in-progress" || effectiveStatus === "answered" ? new Date() : undefined,
        endedAt: isEndedStatus(effectiveStatus) ? new Date() : undefined,
        metadata: {
          lastCallback: {
            callSid: params.get("CallSid"),
            accountSid: params.get("AccountSid"),
            callStatus,
            dialStatus,
            timestamp: new Date().toISOString()
          }
        }
      }
    }).catch(async () => {
      const callSid = params.get("CallSid");
      if (!callSid) return;
      await trackedCallPrisma.trackedCall.updateMany({
        where: { twilioCallSid: callSid },
        data: {
          status: effectiveStatus,
          dialStatus,
          durationSeconds: duration ?? undefined,
          endedAt: isEndedStatus(effectiveStatus) ? new Date() : undefined
        }
      });
    });
  }

  return twilioEmpty();
}

export async function POST(request: Request) {
  return handleStatus(request);
}

export async function GET(request: Request) {
  return handleStatus(request);
}
