import { prisma } from "@/lib/prisma";
import { ensureAnalyticsSchema } from "@/lib/site-analytics";

const TEST_TEXT_PATTERNS = [
  "TEST FORM",
  "TEST REPORT",
  "Test diagnostico",
  "Test dÃ­agnostico",
  "Test díagnostico",
  "diagnostica backend protetta",
  "dÃ­agnostica backend protetta",
  "díagnostica backend protetta"
];

export async function cleanupDiagnosticTestData() {
  await ensureAnalyticsSchema();

  const supportDeleted = await prisma.supportRequest.deleteMany({
    where: {
      OR: [
        ...TEST_TEXT_PATTERNS.map((pattern) => ({ message: { contains: pattern, mode: "insensitive" as const } })),
        ...TEST_TEXT_PATTERNS.map((pattern) => ({ name: { contains: pattern, mode: "insensitive" as const } }))
      ]
    }
  });

  const reportsDeleted = await prisma.report.deleteMany({
    where: {
      OR: [
        { targetId: { contains: "diagnostic", mode: "insensitive" } },
        { targetId: { contains: "dÃ­agnostic", mode: "insensitive" } },
        { targetId: { contains: "díagnostic", mode: "insensitive" } },
        ...TEST_TEXT_PATTERNS.map((pattern) => ({ reason: { contains: pattern, mode: "insensitive" as const } })),
        ...TEST_TEXT_PATTERNS.map((pattern) => ({ details: { contains: pattern, mode: "insensitive" as const } }))
      ]
    }
  });

  const testAccounts = await prisma.userAccount.findMany({
    where: {
      OR: [
        { email: { endsWith: "@example.com", mode: "insensitive" } },
        { email: { contains: "diagnostica-", mode: "insensitive" } },
        { email: { contains: "dÃ­agnostica-", mode: "insensitive" } },
        { email: { contains: "díagnostica-", mode: "insensitive" } },
        { displayName: { equals: "Diagnostica", mode: "insensitive" } }
      ]
    },
    select: { id: true }
  });
  const testAccountIds = testAccounts.map((account) => account.id);

  const activitiesDeleted = testAccountIds.length
    ? await prisma.communityActivity.deleteMany({ where: { accountId: { in: testAccountIds } } })
    : { count: 0 };
  const visitsDeleted = testAccountIds.length
    ? await prisma.siteVisit.deleteMany({ where: { accountId: { in: testAccountIds } } })
    : { count: 0 };
  const accountsDeleted = testAccountIds.length
    ? await prisma.userAccount.deleteMany({ where: { id: { in: testAccountIds } } })
    : { count: 0 };

  return {
    supportRequestsDeleted: supportDeleted.count,
    reportsDeleted: reportsDeleted.count,
    testAccountsDeleted: accountsDeleted.count,
    linkedActivitiesDeleted: activitiesDeleted.count,
    linkedVisitsDeleted: visitsDeleted.count,
    totalDeleted:
      supportDeleted.count + reportsDeleted.count + accountsDeleted.count + activitiesDeleted.count + visitsDeleted.count
  };
}

