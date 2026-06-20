import { redirect } from "next/navigation";
import { currentAccount, dashboardPath } from "@/lib/account";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const account = await currentAccount();
  if (!account) redirect("/login");
  redirect(dashboardPath(account.role));
}
