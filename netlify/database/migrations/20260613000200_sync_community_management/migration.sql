DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SupplierRequestStatus') THEN
    CREATE TYPE "SupplierRequestStatus" AS ENUM ('new_request', 'contacted', 'closed', 'archived');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SupportRequestStatus') THEN
    CREATE TYPE "SupportRequestStatus" AS ENUM ('new_request', 'handled', 'archived');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ArticleStatus') THEN
    CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'scheduled', 'published');
  END IF;
END
$$;

ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "eventPhase" TEXT;

CREATE TABLE IF NOT EXISTS "SupplierRequest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "eventType" TEXT NOT NULL,
  "city" TEXT,
  "region" TEXT,
  "eventDate" TIMESTAMP(3),
  "peopleCount" INTEGER,
  "budgetRange" TEXT,
  "supplierTypes" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "status" "SupplierRequestStatus" NOT NULL DEFAULT 'new_request',
  "internalNotes" TEXT,
  "aiReply" TEXT,
  "aiReplyCreatedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SupportRequest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "sourcePath" TEXT,
  "status" "SupportRequestStatus" NOT NULL DEFAULT 'new_request',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "EditorialArticle" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "kicker" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "tags" TEXT NOT NULL,
  "heroImage" TEXT NOT NULL,
  "heroAlt" TEXT NOT NULL,
  "authorName" TEXT NOT NULL,
  "readingMinutes" INTEGER NOT NULL,
  "metaTitle" TEXT NOT NULL,
  "metaDescription" TEXT NOT NULL,
  "aiSummary" TEXT NOT NULL,
  "keyTakeaways" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "faqJson" TEXT NOT NULL,
  "status" "ArticleStatus" NOT NULL DEFAULT 'published',
  "publishedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "EditorialArticle_slug_key" ON "EditorialArticle"("slug");
CREATE INDEX IF NOT EXISTS "SupplierRequest_status_idx" ON "SupplierRequest"("status");
CREATE INDEX IF NOT EXISTS "SupplierRequest_createdAt_idx" ON "SupplierRequest"("createdAt");
CREATE INDEX IF NOT EXISTS "SupportRequest_status_idx" ON "SupportRequest"("status");
CREATE INDEX IF NOT EXISTS "SupportRequest_createdAt_idx" ON "SupportRequest"("createdAt");
CREATE INDEX IF NOT EXISTS "EditorialArticle_status_publishedAt_idx" ON "EditorialArticle"("status", "publishedAt");
CREATE INDEX IF NOT EXISTS "EditorialArticle_category_idx" ON "EditorialArticle"("category");
