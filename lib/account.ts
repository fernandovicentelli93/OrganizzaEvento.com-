import { createHash, randomBytes, timingSafeEqual, pbkdf2Sync } from "crypto";
import { cookies } from "next/headers";
import type { AccountRole, UserAccount } from "@prisma/client";
import { ensureAccountSchema } from "@/lib/account-schema";
import { prisma } from "@/lib/prisma";

export const ACCOUNT_COOKIE = "oe_account_session";

const ITERATIONS = 120000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `pbkdf2:${ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [method, iterations, salt, hash] = storedHash.split(":");
  if (method !== "pbkdf2" || !iterations || !salt || !hash) return false;

  const expected = Buffer.from(hash, "hex");
  const actual = pbkdf2Sync(password, salt, Number(iterations), expected.length, DIGEST);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function accountSessionValue(account: Pick<UserAccount, "id" | "email" | "passwordHash">) {
  const secret = process.env.ACCOUNT_SESSION_SECRET ?? process.env.ADMIN_SECRET ?? "organizzaevento-dev-session";
  return `${account.id}.${createHash("sha256").update(`${account.id}:${account.email}:${account.passwordHash}:${secret}`).digest("hex")}`;
}

export async function setAccountSession(account: Pick<UserAccount, "id" | "email" | "passwordHash">) {
  const cookieStore = await cookies();
  cookieStore.set(ACCOUNT_COOKIE, accountSessionValue(account), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });
}

export async function clearAccountSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCOUNT_COOKIE);
}

export async function currentAccount() {
  await ensureAccountSchema();

  const cookieStore = await cookies();
  const value = cookieStore.get(ACCOUNT_COOKIE)?.value;
  const [id] = value?.split(".") ?? [];
  if (!id) return null;

  const account = await prisma.userAccount.findUnique({ where: { id } });
  if (!account || account.status !== "active") return null;
  return value === accountSessionValue(account) ? account : null;
}

export function roleLabel(role: AccountRole) {
  return role === "supplier" ? "Fornitore" : "Cliente";
}

export function levelFromPoints(points: number) {
  if (points >= 600) return { name: "Diamante", className: "bg-cyan-50 text-cyan-800 border-cyan-200" };
  if (points >= 300) return { name: "Platino", className: "bg-slate-50 text-slate-800 border-slate-200" };
  if (points >= 160) return { name: "Oro", className: "bg-amber-50 text-amber-800 border-amber-200" };
  if (points >= 60) return { name: "Argento", className: "bg-zinc-50 text-zinc-800 border-zinc-200" };
  return { name: "Bronzo", className: "bg-orange-50 text-orange-800 border-orange-200" };
}

export function dashboardPath(role: AccountRole) {
  return role === "supplier" ? "/dashboard/fornitore" : "/dashboard/cliente";
}
