import { prisma } from "@/lib/prisma";

let schemaReadyPromise: Promise<void> | null = null;

async function createEnumIfMissing(name: string, values: string[]) {
  const quotedValues = values.map((value) => `'${value}'`).join(", ");
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      CREATE TYPE "${name}" AS ENUM (${quotedValues});
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;
  `);
}

async function ensureAccountSchemaOnce() {
  if (process.env.NETLIFY === "true") {
    return;
  }

  await createEnumIfMissing("AccountRole", ["client", "supplier"]);
  await createEnumIfMissing("AccountStatus", ["active", "suspended", "deleted"]);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "UserAccount" (
      "id" TEXT NOT NULL,
      "role" "AccountRole" NOT NULL,
      "status" "AccountStatus" NOT NULL DEFAULT 'active',
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "authProvider" TEXT NOT NULL DEFAULT 'email',
      "displayName" TEXT NOT NULL,
      "photoUrl" TEXT,
      "bio" TEXT,
      "city" TEXT,
      "region" TEXT,
      "activityPoints" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "UserAccount_email_key" ON "UserAccount"("email");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "UserAccount_role_idx" ON "UserAccount"("role");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "UserAccount_status_idx" ON "UserAccount"("status");`);
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "UserAccount_activityPoints_idx" ON "UserAccount"("activityPoints");`
  );
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "authProvider" TEXT NOT NULL DEFAULT 'email';`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "businessName" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "profileTag" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "supplierCategory" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "supplierServices" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "eventTypesServed" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "serviceAreas" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "priceRange" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "minimumBudget" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "travelRange" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "portfolioUrl" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "availabilityNotes" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "experienceYears" INTEGER;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "profileCompletedAt" TIMESTAMP(3);`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "lastSeenAt" TIMESTAMP(3);`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "UserAccount_lastSeenAt_idx" ON "UserAccount"("lastSeenAt");`);

  await prisma.$executeRawUnsafe(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "accountId" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "proposedImageUrl" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "proposedImageStatus" "Status";`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Question_accountId_idx" ON "Question"("accountId");`);

  await prisma.$executeRawUnsafe(`ALTER TABLE "Answer" ADD COLUMN IF NOT EXISTS "accountId" TEXT;`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Answer_accountId_idx" ON "Answer"("accountId");`);
}

export async function ensureAccountSchema() {
  schemaReadyPromise ??= ensureAccountSchemaOnce();
  return schemaReadyPromise;
}
