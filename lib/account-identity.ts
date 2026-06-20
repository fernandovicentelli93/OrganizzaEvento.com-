import { normalizePublicIdentity } from "@/lib/account-public";
import { prisma } from "@/lib/prisma";

export async function publicIdentityConflict(values: Array<string | null | undefined>, excludeAccountId?: string) {
  const candidates = values.map(normalizePublicIdentity).filter((value) => value.length >= 3);
  if (!candidates.length) return null;

  const accounts = await prisma.userAccount.findMany({
    where: {
      status: { not: "deleted" },
      ...(excludeAccountId ? { id: { not: excludeAccountId } } : {})
    },
    select: {
      displayName: true,
      businessName: true
    }
  });

  return accounts.find((account) => {
    const existingNames = [account.displayName, account.businessName].map(normalizePublicIdentity).filter(Boolean);
    return existingNames.some((name) => candidates.includes(name));
  }) ?? null;
}
