import { createHash, randomUUID } from "crypto";
import { cookies, headers } from "next/headers";
import { ACCOUNT_COOKIE, accountSessionValue } from "@/lib/account";
import { ensureAccountSchema } from "@/lib/account-schema";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE = "oe_visitor_id";
const SESSION_COOKIE = "oe_visit_session";
const ADMIN_COOKIE = "oe_admin_session";

let analyticsSchemaPromise: Promise<void> | null = null;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeString(value: string | null | undefined, max = 500) {
  const cleaned = String(value ?? "").trim();
  return cleaned.length > max ? cleaned.slice(0, max) : cleaned;
}

function isLikelyBot(userAgent: string) {
  return /bot|crawler|spider|googlebot|bingbot|duckduckbot|slurp|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|oai-searchbot|chatgpt-user|gptbot|perplexitybot|claudebot|bytespider|semrush|ahrefs/i.test(
    userAgent
  );
}

async function ensureAnalyticsSchemaOnce() {
  await ensureAccountSchema();

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SiteVisit" (
      "id" TEXT NOT NULL,
      "visitorHash" TEXT NOT NULL,
      "sessionHash" TEXT NOT NULL,
      "accountId" TEXT,
      "path" TEXT NOT NULL,
      "locale" TEXT,
      "referrer" TEXT,
      "userAgentHash" TEXT,
      "ipHash" TEXT,
      "isBot" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "SiteVisit_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "SiteVisit_visitorHash_idx" ON "SiteVisit"("visitorHash");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "SiteVisit_sessionHash_idx" ON "SiteVisit"("sessionHash");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "SiteVisit_accountId_idx" ON "SiteVisit"("accountId");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "SiteVisit_path_idx" ON "SiteVisit"("path");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "SiteVisit_createdAt_idx" ON "SiteVisit"("createdAt");`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CommunityActivity" (
      "id" TEXT NOT NULL,
      "kind" TEXT NOT NULL,
      "questionId" TEXT,
      "answerId" TEXT,
      "accountId" TEXT,
      "visitorHash" TEXT,
      "displayMode" TEXT,
      "displayName" TEXT,
      "source" TEXT NOT NULL DEFAULT 'public_form',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "CommunityActivity_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "CommunityActivity_kind_idx" ON "CommunityActivity"("kind");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "CommunityActivity_source_idx" ON "CommunityActivity"("source");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "CommunityActivity_accountId_idx" ON "CommunityActivity"("accountId");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "CommunityActivity_visitorHash_idx" ON "CommunityActivity"("visitorHash");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "CommunityActivity_createdAt_idx" ON "CommunityActivity"("createdAt");`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "MarketingEvent" (
      "id" TEXT NOT NULL,
      "eventName" TEXT NOT NULL,
      "path" TEXT,
      "locale" TEXT,
      "placement" TEXT,
      "target" TEXT,
      "metadata" JSONB,
      "visitorHash" TEXT,
      "sessionHash" TEXT,
      "accountId" TEXT,
      "userAgentHash" TEXT,
      "ipHash" TEXT,
      "isBot" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "MarketingEvent_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MarketingEvent_eventName_idx" ON "MarketingEvent"("eventName");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MarketingEvent_path_idx" ON "MarketingEvent"("path");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MarketingEvent_placement_idx" ON "MarketingEvent"("placement");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MarketingEvent_accountId_idx" ON "MarketingEvent"("accountId");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MarketingEvent_createdAt_idx" ON "MarketingEvent"("createdAt");`);
}

export async function ensureAnalyticsSchema() {
  analyticsSchemaPromise ??= ensureAnalyticsSchemaOnce();
  return analyticsSchemaPromise;
}

async function currentAccountIdFromCookie() {
  const cookieStore = await cookies();
  const value = cookieStore.get(ACCOUNT_COOKIE)?.value;
  const [id] = value?.split(".") ?? [];
  if (!id) return null;

  const account = await prisma.userAccount.findUnique({
    where: { id },
    select: { id: true, email: true, passwordHash: true, status: true }
  });

  if (!account || account.status !== "active") return null;
  return value === accountSessionValue(account) ? account.id : null;
}

export async function getOrCreateVisitorIdentity() {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!visitorId) {
    visitorId = randomUUID();
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/"
    });
  }

  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 30,
      path: "/"
    });
  }

  return {
    visitorHash: sha256(visitorId),
    sessionHash: sha256(sessionId)
  };
}

export async function recordSiteVisit(input: { path: string; locale?: string | null; referrer?: string | null }) {
  await ensureAnalyticsSchema();

  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE)?.value) return { ok: true, skipped: "admin" };

  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") ?? "";
  const isBot = isLikelyBot(userAgent);
  if (isBot) return { ok: true, skipped: "bot" };

  const { visitorHash, sessionHash } = await getOrCreateVisitorIdentity();
  const accountId = await currentAccountIdFromCookie();
  const forwardedFor = headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip") ?? "";
  const path = safeString(input.path, 600) || "/";

  await prisma.siteVisit.create({
    data: {
      visitorHash,
      sessionHash,
      accountId,
      path,
      locale: safeString(input.locale, 8) || null,
      referrer: safeString(input.referrer, 600) || null,
      userAgentHash: userAgent ? sha256(userAgent) : null,
      ipHash: forwardedFor ? sha256(forwardedFor.split(",")[0]?.trim() ?? forwardedFor) : null,
      isBot: false
    }
  });

  if (accountId) {
    await prisma.userAccount.update({
      where: { id: accountId },
      data: { lastSeenAt: new Date() }
    });
  }

  return { ok: true, skipped: null };
}

export async function recordCommunityActivity(input: {
  kind: "question" | "answer";
  questionId?: string | null;
  answerId?: string | null;
  accountId?: string | null;
  displayMode?: string | null;
  displayName?: string | null;
}) {
  try {
    await ensureAnalyticsSchema();
    const { visitorHash } = await getOrCreateVisitorIdentity();

    await prisma.communityActivity.create({
      data: {
        kind: input.kind,
        questionId: input.questionId ?? null,
        answerId: input.answerId ?? null,
        accountId: input.accountId ?? null,
        visitorHash,
        displayMode: input.displayMode ?? null,
        displayName: input.displayName ?? null,
        source: "public_form"
      }
    });
  } catch (error) {
    console.error("Community activity tracking failed", error);
  }
}

export async function recordMarketingEvent(input: {
  eventName: string;
  path?: string | null;
  locale?: string | null;
  referrer?: string | null;
  placement?: string | null;
  target?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  await ensureAnalyticsSchema();

  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE)?.value) return { ok: true, skipped: "admin" };

  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") ?? "";
  const isBot = isLikelyBot(userAgent);
  if (isBot) return { ok: true, skipped: "bot" };

  const { visitorHash, sessionHash } = await getOrCreateVisitorIdentity();
  const accountId = await currentAccountIdFromCookie();
  const forwardedFor = headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip") ?? "";
  const metadata = {
    ...(input.metadata ?? {}),
    ...(input.referrer ? { referrer: safeString(input.referrer, 600) } : {})
  };

  await prisma.$executeRaw`
    INSERT INTO "MarketingEvent" (
      "id",
      "eventName",
      "path",
      "locale",
      "placement",
      "target",
      "metadata",
      "visitorHash",
      "sessionHash",
      "accountId",
      "userAgentHash",
      "ipHash",
      "isBot"
    )
    VALUES (
      ${randomUUID()},
      ${safeString(input.eventName, 80)},
      ${safeString(input.path, 600) || null},
      ${safeString(input.locale, 8) || null},
      ${safeString(input.placement, 120) || null},
      ${safeString(input.target, 220) || null},
      ${JSON.stringify(metadata)}::jsonb,
      ${visitorHash},
      ${sessionHash},
      ${accountId},
      ${userAgent ? sha256(userAgent) : null},
      ${forwardedFor ? sha256(forwardedFor.split(",")[0]?.trim() ?? forwardedFor) : null},
      false
    );
  `;

  return { ok: true, skipped: null };
}
