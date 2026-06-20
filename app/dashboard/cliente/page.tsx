import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountDashboard } from "@/components/AccountDashboard";
import { currentAccount, dashboardPath } from "@/lib/account";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard cliente",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ profilo?: string; cancella?: string }>;
};

export default async function ClientDashboardPage({ searchParams }: PageProps) {
  const account = await currentAccount();
  if (!account) redirect("/login");
  if (account.role !== "client") redirect(dashboardPath(account.role));

  const params = (await searchParams) ?? {};
  const [questions, answers] = await Promise.all([
    prisma.question.findMany({
      where: { accountId: account.id, status: "published" },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.answer.findMany({
      where: { accountId: account.id, status: "published" },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { question: { select: { title: true, slug: true } } }
    })
  ]);

  return (
    <AccountDashboard
      account={account}
      role="client"
      questions={questions}
      answers={answers}
      profileStatus={params.profilo}
      deleteStatus={params.cancella}
    />
  );
}
