import { cleanupDiagnosticTestData } from "@/lib/admin-cleanup";
import { prisma } from "@/lib/prisma";

cleanupDiagnosticTestData()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

