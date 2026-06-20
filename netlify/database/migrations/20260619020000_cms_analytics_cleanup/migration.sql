DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccountRole') THEN
    CREATE TYPE "AccountRole" AS ENUM ('client', 'supplier');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccountStatus') THEN
    CREATE TYPE "AccountStatus" AS ENUM ('active', 'suspended', 'deleted');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "UserAccount" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "role" "AccountRole" NOT NULL,
  "status" "AccountStatus" NOT NULL DEFAULT 'active',
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "authProvider" TEXT NOT NULL DEFAULT 'email',
  "displayName" TEXT NOT NULL,
  "profileTag" TEXT,
  "photoUrl" TEXT,
  "bio" TEXT,
  "city" TEXT,
  "region" TEXT,
  "businessName" TEXT,
  "supplierCategory" TEXT,
  "supplierServices" TEXT,
  "eventTypesServed" TEXT,
  "serviceAreas" TEXT,
  "priceRange" TEXT,
  "minimumBudget" TEXT,
  "travelRange" TEXT,
  "portfolioUrl" TEXT,
  "websiteUrl" TEXT,
  "instagramUrl" TEXT,
  "availabilityNotes" TEXT,
  "experienceYears" INTEGER,
  "profileCompletedAt" TIMESTAMP(3),
  "activityPoints" INTEGER NOT NULL DEFAULT 0,
  "lastLoginAt" TIMESTAMP(3),
  "lastSeenAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "authProvider" TEXT NOT NULL DEFAULT 'email';
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "businessName" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "profileTag" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "supplierCategory" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "supplierServices" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "eventTypesServed" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "serviceAreas" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "priceRange" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "minimumBudget" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "travelRange" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "portfolioUrl" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "availabilityNotes" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "experienceYears" INTEGER;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "profileCompletedAt" TIMESTAMP(3);
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "lastSeenAt" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "UserAccount_email_key" ON "UserAccount"("email");
CREATE INDEX IF NOT EXISTS "UserAccount_role_idx" ON "UserAccount"("role");
CREATE INDEX IF NOT EXISTS "UserAccount_status_idx" ON "UserAccount"("status");
CREATE INDEX IF NOT EXISTS "UserAccount_activityPoints_idx" ON "UserAccount"("activityPoints");
CREATE INDEX IF NOT EXISTS "UserAccount_lastSeenAt_idx" ON "UserAccount"("lastSeenAt");

ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "accountId" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "proposedImageUrl" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "proposedImageStatus" "Status";
CREATE INDEX IF NOT EXISTS "Question_accountId_idx" ON "Question"("accountId");

ALTER TABLE "Answer" ADD COLUMN IF NOT EXISTS "accountId" TEXT;
CREATE INDEX IF NOT EXISTS "Answer_accountId_idx" ON "Answer"("accountId");

CREATE TABLE IF NOT EXISTS "SiteVisit" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "visitorHash" TEXT NOT NULL,
  "sessionHash" TEXT NOT NULL,
  "accountId" TEXT,
  "path" TEXT NOT NULL,
  "locale" TEXT,
  "referrer" TEXT,
  "userAgentHash" TEXT,
  "ipHash" TEXT,
  "isBot" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "SiteVisit_visitorHash_idx" ON "SiteVisit"("visitorHash");
CREATE INDEX IF NOT EXISTS "SiteVisit_sessionHash_idx" ON "SiteVisit"("sessionHash");
CREATE INDEX IF NOT EXISTS "SiteVisit_accountId_idx" ON "SiteVisit"("accountId");
CREATE INDEX IF NOT EXISTS "SiteVisit_path_idx" ON "SiteVisit"("path");
CREATE INDEX IF NOT EXISTS "SiteVisit_createdAt_idx" ON "SiteVisit"("createdAt");

CREATE TABLE IF NOT EXISTS "CommunityActivity" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "kind" TEXT NOT NULL,
  "questionId" TEXT,
  "answerId" TEXT,
  "accountId" TEXT,
  "visitorHash" TEXT,
  "displayMode" TEXT,
  "displayName" TEXT,
  "source" TEXT NOT NULL DEFAULT 'public_form',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "CommunityActivity_kind_idx" ON "CommunityActivity"("kind");
CREATE INDEX IF NOT EXISTS "CommunityActivity_source_idx" ON "CommunityActivity"("source");
CREATE INDEX IF NOT EXISTS "CommunityActivity_accountId_idx" ON "CommunityActivity"("accountId");
CREATE INDEX IF NOT EXISTS "CommunityActivity_visitorHash_idx" ON "CommunityActivity"("visitorHash");
CREATE INDEX IF NOT EXISTS "CommunityActivity_createdAt_idx" ON "CommunityActivity"("createdAt");
