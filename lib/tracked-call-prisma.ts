import { prisma } from "@/lib/prisma";

export type TrackedCallRecord = {
  id: string;
  provider: string;
  direction: string;
  supplierId: string | null;
  supplierName: string | null;
  supplierProfileUrl: string | null;
  supplierPhoneLast4: string | null;
  supplierPhoneHash: string | null;
  customerPhoneLast4: string | null;
  customerPhoneHash: string | null;
  twilioCallSid: string | null;
  twilioParentCallSid: string | null;
  twilioDialCallSid: string | null;
  status: string;
  dialStatus: string | null;
  durationSeconds: number | null;
  sourcePath: string | null;
  metadata: unknown;
  startedAt: Date | null;
  answeredAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type TrackedCallDelegate = {
  findMany(args?: unknown): Promise<TrackedCallRecord[]>;
  count(args?: unknown): Promise<number>;
  create(args: unknown): Promise<TrackedCallRecord>;
  update(args: unknown): Promise<TrackedCallRecord>;
  updateMany(args: unknown): Promise<{ count: number }>;
  upsert(args: unknown): Promise<TrackedCallRecord>;
};

export const trackedCallPrisma = prisma as typeof prisma & {
  trackedCall: TrackedCallDelegate;
};
