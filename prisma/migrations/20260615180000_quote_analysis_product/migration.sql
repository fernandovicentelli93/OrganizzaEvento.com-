CREATE TYPE "QuoteAnalysisStatus" AS ENUM ('draft', 'analyzed', 'published', 'supplier_requested', 'deleted');
CREATE TYPE "QuoteOpportunityType" AS ENUM ('public_advice', 'private_comparison');
CREATE TYPE "QuoteOpportunityStatus" AS ENUM ('new_opportunity', 'visible', 'answered', 'closed', 'archived');
CREATE TYPE "SupplierAnswerType" AS ENUM ('public_advice', 'private_reply');
CREATE TYPE "SupplierModerationStatus" AS ENUM ('pending', 'approved', 'blocked', 'hidden');
CREATE TYPE "SupplierVerificationStatus" AS ENUM ('unverified', 'pending', 'verified');
CREATE TYPE "SupplierBadgeLevel" AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');

CREATE TABLE "quote_analysis_requests" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "sessionId" TEXT NOT NULL,
  "serviceType" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "city" TEXT,
  "province" TEXT,
  "region" TEXT,
  "eventDate" TIMESTAMP(3),
  "guestsCount" INTEGER,
  "totalAmount" INTEGER,
  "rawTextPrivate" TEXT NOT NULL,
  "redactedText" TEXT NOT NULL,
  "uploadedFileId" TEXT,
  "privacyConsentAt" TIMESTAMP(3) NOT NULL,
  "publishConsentAt" TIMESTAMP(3),
  "supplierShareConsentAt" TIMESTAMP(3),
  "status" "QuoteAnalysisStatus" NOT NULL DEFAULT 'analyzed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "quote_analysis_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quote_analysis_reports" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "detectedService" TEXT NOT NULL,
  "extractedTotalPrice" INTEGER,
  "extractedLineItems" JSONB NOT NULL,
  "includedItems" JSONB NOT NULL,
  "missingItems" JSONB NOT NULL,
  "unclearItems" JSONB NOT NULL,
  "possibleHiddenCosts" JSONB NOT NULL,
  "questionsToAsk" JSONB NOT NULL,
  "supplierMessageDraft" TEXT NOT NULL,
  "userSummary" TEXT NOT NULL,
  "publicAnonymizedSummary" TEXT NOT NULL,
  "scoreChiarezza" INTEGER NOT NULL,
  "scoreCompletezza" INTEGER NOT NULL,
  "scoreRischioExtra" TEXT NOT NULL,
  "scoreCoerenzaPrezzo" TEXT NOT NULL,
  "verdict" TEXT NOT NULL,
  "benchmarkUsed" JSONB,
  "benchmarkConfidence" TEXT,
  "recommendedNextAction" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quote_analysis_reports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quote_public_discussions" (
  "id" TEXT NOT NULL,
  "quoteAnalysisId" TEXT NOT NULL,
  "discussionId" TEXT NOT NULL,
  "anonymizedTitle" TEXT NOT NULL,
  "anonymizedBody" TEXT NOT NULL,
  "status" "Status" NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quote_public_discussions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quote_supplier_opportunities" (
  "id" TEXT NOT NULL,
  "quoteAnalysisId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "compatibilityScore" INTEGER NOT NULL,
  "opportunityType" "QuoteOpportunityType" NOT NULL,
  "status" "QuoteOpportunityStatus" NOT NULL DEFAULT 'new_opportunity',
  "visibleToSupplier" BOOLEAN NOT NULL DEFAULT false,
  "userContactShared" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "quote_supplier_opportunities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "supplier_profiles" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "businessName" TEXT NOT NULL,
  "categoryMain" TEXT NOT NULL,
  "servicesOffered" JSONB NOT NULL,
  "eventTypes" JSONB NOT NULL,
  "baseCity" TEXT,
  "baseRegion" TEXT,
  "coveredProvinces" JSONB NOT NULL,
  "coveredRegions" JSONB NOT NULL,
  "priceRange" TEXT,
  "minimumBudget" INTEGER,
  "portfolioUrl" TEXT,
  "vibesPlannerProfileUrl" TEXT,
  "verificationStatus" "SupplierVerificationStatus" NOT NULL DEFAULT 'unverified',
  "badgeLevel" "SupplierBadgeLevel" NOT NULL DEFAULT 'bronze',
  "reputationPoints" INTEGER NOT NULL DEFAULT 0,
  "usefulAnswersCount" INTEGER NOT NULL DEFAULT 0,
  "moderationWarningsCount" INTEGER NOT NULL DEFAULT 0,
  "profileCompletionScore" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "supplier_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "supplier_answers" (
  "id" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "discussionId" TEXT,
  "quoteAnalysisId" TEXT,
  "answerBody" TEXT NOT NULL,
  "answerType" "SupplierAnswerType" NOT NULL,
  "moderationStatus" "SupplierModerationStatus" NOT NULL DEFAULT 'pending',
  "helpfulCount" INTEGER NOT NULL DEFAULT 0,
  "flaggedCount" INTEGER NOT NULL DEFAULT 0,
  "containsContactBlocked" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "supplier_answers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "supplier_dashboard_events" (
  "id" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "supplier_dashboard_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "quote_analysis_requests_serviceType_idx" ON "quote_analysis_requests"("serviceType");
CREATE INDEX "quote_analysis_requests_eventType_idx" ON "quote_analysis_requests"("eventType");
CREATE INDEX "quote_analysis_requests_city_province_idx" ON "quote_analysis_requests"("city", "province");
CREATE INDEX "quote_analysis_requests_status_idx" ON "quote_analysis_requests"("status");
CREATE INDEX "quote_analysis_requests_createdAt_idx" ON "quote_analysis_requests"("createdAt");
CREATE INDEX "quote_analysis_reports_requestId_idx" ON "quote_analysis_reports"("requestId");
CREATE INDEX "quote_analysis_reports_createdAt_idx" ON "quote_analysis_reports"("createdAt");
CREATE INDEX "quote_public_discussions_quoteAnalysisId_idx" ON "quote_public_discussions"("quoteAnalysisId");
CREATE INDEX "quote_public_discussions_discussionId_idx" ON "quote_public_discussions"("discussionId");
CREATE INDEX "quote_public_discussions_status_idx" ON "quote_public_discussions"("status");
CREATE INDEX "quote_supplier_opportunities_quoteAnalysisId_idx" ON "quote_supplier_opportunities"("quoteAnalysisId");
CREATE INDEX "quote_supplier_opportunities_supplierId_idx" ON "quote_supplier_opportunities"("supplierId");
CREATE INDEX "quote_supplier_opportunities_status_idx" ON "quote_supplier_opportunities"("status");
CREATE INDEX "quote_supplier_opportunities_compatibilityScore_idx" ON "quote_supplier_opportunities"("compatibilityScore");
CREATE UNIQUE INDEX "supplier_profiles_userId_key" ON "supplier_profiles"("userId");
CREATE INDEX "supplier_profiles_categoryMain_idx" ON "supplier_profiles"("categoryMain");
CREATE INDEX "supplier_profiles_baseRegion_idx" ON "supplier_profiles"("baseRegion");
CREATE INDEX "supplier_profiles_badgeLevel_idx" ON "supplier_profiles"("badgeLevel");
CREATE INDEX "supplier_answers_supplierId_idx" ON "supplier_answers"("supplierId");
CREATE INDEX "supplier_answers_discussionId_idx" ON "supplier_answers"("discussionId");
CREATE INDEX "supplier_answers_quoteAnalysisId_idx" ON "supplier_answers"("quoteAnalysisId");
CREATE INDEX "supplier_answers_moderationStatus_idx" ON "supplier_answers"("moderationStatus");
CREATE INDEX "supplier_dashboard_events_supplierId_idx" ON "supplier_dashboard_events"("supplierId");
CREATE INDEX "supplier_dashboard_events_eventType_idx" ON "supplier_dashboard_events"("eventType");
CREATE INDEX "supplier_dashboard_events_createdAt_idx" ON "supplier_dashboard_events"("createdAt");

ALTER TABLE "quote_analysis_reports"
  ADD CONSTRAINT "quote_analysis_reports_requestId_fkey"
  FOREIGN KEY ("requestId") REFERENCES "quote_analysis_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "quote_public_discussions"
  ADD CONSTRAINT "quote_public_discussions_quoteAnalysisId_fkey"
  FOREIGN KEY ("quoteAnalysisId") REFERENCES "quote_analysis_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "quote_supplier_opportunities"
  ADD CONSTRAINT "quote_supplier_opportunities_quoteAnalysisId_fkey"
  FOREIGN KEY ("quoteAnalysisId") REFERENCES "quote_analysis_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
