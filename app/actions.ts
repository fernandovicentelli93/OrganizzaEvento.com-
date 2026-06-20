"use server";

import { createHash, randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type {
  AccountRole,
  DisplayMode,
  AccountStatus,
  Status,
  SupplierRequestStatus,
  SupportRequestStatus,
  TargetType,
  VoteType
} from "@prisma/client";
import { verifyCaptcha } from "@/lib/captcha";
import {
  clearAccountSession,
  currentAccount,
  dashboardPath,
  hashPassword,
  setAccountSession,
  verifyPassword
} from "@/lib/account";
import { publicIdentityConflict } from "@/lib/account-identity";
import { ensureAccountSchema } from "@/lib/account-schema";
import { cleanupDiagnosticTestData } from "@/lib/admin-cleanup";
import { EVENT_PHASES, POST_TYPES } from "@/lib/constants";
import { assertCleanText } from "@/lib/moderation";
import { sendInternalNotification } from "@/lib/notifications";
import {
  assertModerationAllows,
  createSupplierRequestReply,
  moderateCommunityContent,
  type CommunityModerationContext
} from "@/lib/openai-community";
import { prisma } from "@/lib/prisma";
import { recordCommunityActivity } from "@/lib/site-analytics";
import { slugify } from "@/lib/slug";
import { assertHoneypotEmpty, assertHumanPace, assertNotSpam } from "@/lib/spam";

const ADMIN_COOKIE = "oe_admin_session";
const ADMIN_HOME = "/gestione";
const SUPPLIER_REQUEST_STATUSES = ["new_request", "contacted", "closed", "archived"] as const;
const SUPPORT_REQUEST_STATUSES = ["new_request", "handled", "archived"] as const;
const ACCOUNT_STATUSES = ["active", "suspended", "deleted"] as const;

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value.length ? value : null;
}

function optionalNumber(formData: FormData, key: string) {
  const value = textValue(formData, key);
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function optionalDate(formData: FormData, key: string) {
  const value = textValue(formData, key);
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseDisplayMode(value: string): DisplayMode {
  if (value === "nickname" || value === "real_name") return value;
  return "anonymous";
}

function adminCookieValue() {
  const expected = process.env.ADMIN_SECRET;
  const email = process.env.ADMIN_EMAIL ?? "supportoforumevento@gmail.com";
  return expected ? createHash("sha256").update(`organizzaevento:${email}:${expected}`).digest("hex") : "";
}

export async function isAdminAuthenticated() {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return false;

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === adminCookieValue();
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Accesso admin non autorizzato.");
  }
}

export async function adminLoginAction(formData: FormData) {
  const email = textValue(formData, "email").toLowerCase();
  const password = textValue(formData, "password");
  const expected = process.env.ADMIN_SECRET;
  const expectedEmail = (process.env.ADMIN_EMAIL ?? "supportoforumevento@gmail.com").toLowerCase();

  if (!expected) {
    redirect(`${ADMIN_HOME}?errore=config`);
  }

  if (email !== expectedEmail || password !== expected) {
    redirect(`${ADMIN_HOME}?errore=1`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, adminCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/"
  });

  redirect(ADMIN_HOME);
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect(ADMIN_HOME);
}

export async function registerAccountAction(formData: FormData) {
  await ensureAccountSchema();
  assertHoneypotEmpty(formData);
  assertHumanPace(formData, 2);

  const role = textValue(formData, "role") as AccountRole;
  const email = textValue(formData, "email").toLowerCase();
  const password = textValue(formData, "password");
  const displayName = textValue(formData, "displayName");
  const privacyAccepted = formData.get("privacyAccepted") === "yes";

  if (!["client", "supplier"].includes(role) || !email.includes("@") || password.length < 8 || !displayName || !privacyAccepted) {
    redirect("/registrati?errore=1");
  }

  assertCleanText([displayName]);
  assertNotSpam([displayName], { maxLinks: 0 });

  const existing = await prisma.userAccount.findUnique({ where: { email }, select: { id: true } });
  if (existing) redirect("/registrati?errore=esiste");

  const account = await prisma.userAccount.create({
    data: {
      role,
      email,
      displayName,
      passwordHash: hashPassword(password),
      activityPoints: role === "supplier" ? 20 : 10,
      lastLoginAt: new Date(),
      lastSeenAt: new Date()
    }
  });

  await sendInternalNotification({
    subject: "Nuovo account creato",
    preview: "Una persona ha creato un account su OrganizzaEvento.com.",
    lines: [
      `Tipo account: ${role === "supplier" ? "Fornitore" : "Cliente"}`,
      `Nome visibile: ${displayName}`,
      `Email: ${email}`
    ]
  });

  await setAccountSession(account);
  redirect(dashboardPath(account.role));
}

export async function loginAccountAction(formData: FormData) {
  await ensureAccountSchema();
  assertHoneypotEmpty(formData);
  assertHumanPace(formData, 1);

  const email = textValue(formData, "email").toLowerCase();
  const password = textValue(formData, "password");

  const account = await prisma.userAccount.findUnique({ where: { email } });
  if (!account || account.status !== "active" || !verifyPassword(password, account.passwordHash)) {
    redirect("/login?errore=1");
  }

  await prisma.userAccount.update({
    where: { id: account.id },
    data: { lastLoginAt: new Date(), lastSeenAt: new Date() }
  });

  await setAccountSession(account);
  redirect(dashboardPath(account.role));
}

export async function logoutAccountAction() {
  await clearAccountSession();
  redirect("/");
}

export async function updateAccountProfileAction(formData: FormData) {
  await ensureAccountSchema();
  const account = await currentAccount();
  if (!account) redirect("/login");

  const displayName = textValue(formData, "displayName");
  const photoUrl = optionalText(formData, "photoUrl");
  const bio = optionalText(formData, "bio");
  const city = optionalText(formData, "city");
  const region = optionalText(formData, "region");

  if (!displayName) redirect(`${dashboardPath(account.role)}?profilo=errore`);

  assertCleanText([displayName, photoUrl, bio, city, region]);
  assertNotSpam([displayName, photoUrl, bio, city, region], { maxLinks: 1 });

  await prisma.userAccount.update({
    where: { id: account.id },
    data: { displayName, photoUrl, bio, city, region }
  });

  revalidatePath(dashboardPath(account.role));
  redirect(`${dashboardPath(account.role)}?profilo=ok`);
}

export async function deleteAccountAction(formData: FormData) {
  await ensureAccountSchema();
  const account = await currentAccount();
  if (!account) redirect("/login");

  const confirm = textValue(formData, "confirm");
  if (confirm.toUpperCase() !== "CANCELLA") redirect(`${dashboardPath(account.role)}?cancella=errore`);

  await prisma.userAccount.update({
    where: { id: account.id },
    data: {
      status: "deleted",
      email: `deleted-${account.id}@organizzaevento.local`,
      displayName: "Account eliminato",
      bio: null,
      photoUrl: null,
      city: null,
      region: null
    }
  });

  await clearAccountSession();
  redirect("/?account=eliminato");
}

async function generateQuestionSlug(title: string) {
  const base = slugify(title) || "domanda";
  let candidate = base;
  let suffix = 2;

  while (await prisma.question.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function getVoterHash() {
  const cookieStore = await cookies();
  let voterId = cookieStore.get("ite_voter_id")?.value;

  if (!voterId) {
    voterId = randomUUID();
    cookieStore.set("ite_voter_id", voterId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/"
    });
  }

  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") ?? "unknown";
  return createHash("sha256").update(`${voterId}:${userAgent}`).digest("hex");
}

function incrementVoteData(voteType: VoteType) {
  return voteType === "useful"
    ? { usefulVotes: { increment: 1 } }
    : { notUsefulVotes: { increment: 1 } };
}

function switchVoteData(previousVoteType: VoteType, nextVoteType: VoteType) {
  return previousVoteType === "useful" && nextVoteType === "not_useful"
    ? { usefulVotes: { decrement: 1 }, notUsefulVotes: { increment: 1 } }
    : { usefulVotes: { increment: 1 }, notUsefulVotes: { decrement: 1 } };
}

function isNextRedirectError(error: unknown): error is Error & { digest?: string } {
  return !!(
    error &&
    typeof error === "object" &&
    "digest" in (error as { digest?: string }) &&
    String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

function mapQuestionErrorCode(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("obbligatori") || lower.includes("accetta le regole")) return "campi";
  if (lower.includes("categoria") && lower.includes("non") && lower.includes("disponibile")) return "categoria";
  if (lower.includes("captcha") || lower.includes("anti-spam") || lower.includes("controllo")) return "captcha";
  if (lower.includes("attendi") || lower.includes("richiesta")) return "spazio";
  if (lower.includes("nome") && lower.includes("registrato")) return "nickname";
  return "server";
}

function redirectWithStatus(path: string, key: string, value: string) {
  const safePath = path.startsWith("/") ? path : "/";
  const [withoutHash, hash = ""] = safePath.split("#");
  const separator = withoutHash.includes("?") ? "&" : "?";
  return `${withoutHash}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}${hash ? `#${hash}` : ""}`;
}

async function assertSubmissionCooldown(scope: string, seconds: number) {
  const cookieStore = await cookies();
  const key = `oe_${scope}_last_submit`;
  const last = Number.parseInt(cookieStore.get(key)?.value ?? "", 10);
  const now = Date.now();

  if (Number.isFinite(last) && now - last < seconds * 1000) {
    throw new Error("Hai appena inviato un contenuto. Attendi qualche secondo prima di riprovare.");
  }

  cookieStore.set(key, String(now), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/"
  });
}

async function moderateOrReject(context: CommunityModerationContext, fields: Array<string | null | undefined>) {
  const result = await moderateCommunityContent({ context, fields });
  assertModerationAllows(result);
  return result;
}

export async function createQuestion(formData: FormData) {
  try {
    assertHoneypotEmpty(formData);
    assertHumanPace(formData);
    verifyCaptcha(formData);

    const title = textValue(formData, "title");
    const content = textValue(formData, "content");
    const categoryId = textValue(formData, "categoryId");
    const postType = textValue(formData, "postType");
    const displayMode = parseDisplayMode(textValue(formData, "displayMode"));
    const displayName = displayMode === "anonymous" ? null : optionalText(formData, "displayName");
    const rulesAccepted = formData.get("rulesAccepted") === "yes";

    if (!title || !content || !categoryId || !postType || !rulesAccepted) {
      throw new Error("Compila i campi obbligatori e accetta le regole della community.");
    }

    if (!POST_TYPES.includes(postType as (typeof POST_TYPES)[number])) {
      throw new Error("Tipo post non valido.");
    }

    const eventPhase = optionalText(formData, "eventPhase");
    if (eventPhase && !EVENT_PHASES.some((phase) => phase.value === eventPhase)) {
      throw new Error("Fase evento non valida.");
    }

    if (displayMode !== "anonymous" && !displayName) {
      throw new Error("Inserisci il nome da mostrare oppure scegli Anonimo.");
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true, slug: true }
    });
    if (!category) {
      throw new Error("Categoria non valida o non disponibile in questo momento.");
    }

    assertCleanText([
      title,
      content,
      displayName,
      eventPhase,
      optionalText(formData, "eventType"),
      optionalText(formData, "city"),
      optionalText(formData, "region"),
      optionalText(formData, "budgetRange"),
      optionalText(formData, "proposedImageUrl")
    ]);
    assertNotSpam([
      title,
      content,
      displayName,
      optionalText(formData, "city"),
      optionalText(formData, "region"),
      optionalText(formData, "budgetRange"),
      optionalText(formData, "proposedImageUrl")
    ]);
    const moderation = await moderateOrReject("public_question", [
      title,
      content,
      displayName,
      eventPhase,
      optionalText(formData, "eventType"),
      optionalText(formData, "city"),
      optionalText(formData, "region"),
      optionalText(formData, "budgetRange"),
      optionalText(formData, "proposedImageUrl")
    ]);
    await assertSubmissionCooldown("question", 45);

    const account = await currentAccount();
    if (displayName) {
      const conflict = await publicIdentityConflict([displayName], account?.id);
      if (conflict) throw new Error("Questo nome è già usato da un account registrato. Scegli un altro nickname.");
    }
    const slug = await generateQuestionSlug(title);
    const questionStatus: Status = moderation.decision === "review" ? "pending" : "published";

    const createdQuestion = await prisma.question.create({
      data: {
        title,
        slug,
        content,
        categoryId: category.id,
        postType,
        eventPhase,
        eventType: optionalText(formData, "eventType"),
        city: optionalText(formData, "city"),
        region: optionalText(formData, "region"),
        peopleCount: optionalNumber(formData, "peopleCount"),
        budgetRange: optionalText(formData, "budgetRange"),
        eventDate: optionalDate(formData, "eventDate"),
        displayMode,
        displayName,
        privateEmail: optionalText(formData, "privateEmail"),
        accountId: account?.id ?? null,
        proposedImageUrl: optionalText(formData, "proposedImageUrl"),
        proposedImageStatus: optionalText(formData, "proposedImageUrl") ? "pending" : null,
        status: questionStatus
      },
      include: {
        category: { select: { name: true, slug: true } }
      }
    });

    if (account) {
      await prisma.userAccount.update({
        where: { id: account.id },
        data: { activityPoints: { increment: 18 }, lastSeenAt: new Date() }
      });
    }

    await recordCommunityActivity({
      kind: "question",
      questionId: createdQuestion.id,
      accountId: account?.id ?? null,
      displayMode,
      displayName
    });

    await sendInternalNotification({
      subject: "Nuova domanda pubblicata",
      preview: "Una persona ha aperto una nuova conversazione su OrganizzaEvento.com.",
      lines: [
        `Titolo: ${createdQuestion.title}`,
        `Categoria: ${createdQuestion.category.name}`,
        `Tipo post: ${postType}`,
        `Evento: ${createdQuestion.eventType ?? "Non indicato"}`,
        `Città / regione: ${[createdQuestion.city, createdQuestion.region].filter(Boolean).join(", ") || "Non indicata"}`,
        `Budget: ${createdQuestion.budgetRange ?? "Non indicato"}`,
        `Autore: ${displayName ?? "Anonimo o non indicato"}`,
        `Email privata: ${createdQuestion.privateEmail ?? "Non indicata"}`,
        `Moderazione: ${questionStatus === "pending" ? "In revisione" : "Pubblicata"}${moderation.categories.length ? ` (${moderation.categories.join(", ")})` : ""}`,
        `Motivo controllo: ${moderation.reason}`,
        `Link: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com"}/domande/${createdQuestion.slug}`
      ]
    });

    revalidatePath("/");
    revalidatePath("/domande");
    revalidatePath("/backend");
    revalidatePath("/gestione");
    if (questionStatus === "pending") {
      redirect("/domande?moderazione=revisione");
    }
    redirect(`/domande/${slug}`);
  } catch (error) {
    if (isNextRedirectError(error)) throw error;

    const message = error instanceof Error ? error.message : "Errore inatteso durante il salvataggio.";
    const reasonCode = mapQuestionErrorCode(message);
    console.error("createQuestion error", error);
    redirect(`/fai-domanda?errore=${encodeURIComponent(reasonCode)}&detail=${encodeURIComponent(message)}`);
  }
}

export async function createSupplierRequest(formData: FormData) {
  assertHoneypotEmpty(formData);
  assertHumanPace(formData);
  verifyCaptcha(formData);

  const eventType = textValue(formData, "eventType");
  const message = textValue(formData, "message");
  const name = optionalText(formData, "name");
  const email = optionalText(formData, "email");
  const phone = optionalText(formData, "phone");
  const city = optionalText(formData, "city");
  const region = optionalText(formData, "region");
  const budgetRange = optionalText(formData, "budgetRange");
  const returnTo = optionalText(formData, "returnTo");
  const eventDate = optionalDate(formData, "eventDate");
  const peopleCount = optionalNumber(formData, "peopleCount");
  const supplierTypes = formData
    .getAll("supplierTypes")
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim());
  const privacyAccepted = formData.get("privacyAccepted") === "yes";

  if (!eventType || !message || supplierTypes.length === 0 || !privacyAccepted) {
    throw new Error("Compila i campi obbligatori e accetta la nota privacy.");
  }

  if (!email && !phone) {
    throw new Error("Inserisci almeno email o telefono per poterti ricontattare.");
  }

  assertCleanText([
    eventType,
    message,
    name,
    city,
    region,
    budgetRange,
    supplierTypes.join(" ")
  ]);
  assertNotSpam([eventType, message, name, city, region, budgetRange, supplierTypes.join(" ")]);
  const moderation = await moderateOrReject("supplier_request", [
    eventType,
    message,
    name,
    city,
    region,
    budgetRange,
    supplierTypes.join(" ")
  ]);
  await assertSubmissionCooldown("supplier", 60);

  const aiReply = await createSupplierRequestReply({
    eventType,
    city,
    region,
    eventDate,
    peopleCount,
    budgetRange,
    supplierTypes,
    message,
    name
  });

  await prisma.supplierRequest.create({
    data: {
      eventType,
      city,
      region,
      eventDate,
      peopleCount,
      budgetRange,
      supplierTypes: supplierTypes.join(", "),
      message,
      name,
      email,
      phone,
      aiReply,
      aiReplyCreatedAt: new Date()
    }
  });

  await sendInternalNotification({
    subject: "Nuova richiesta fornitori",
    preview: "Una persona ha chiesto aiuto per trovare fornitori su OrganizzaEvento.com.",
    lines: [
      `Evento: ${eventType}`,
      `Fornitori richiesti: ${supplierTypes.join(", ")}`,
      `Citt?/regione: ${[city, region].filter(Boolean).join(", ") || "Non indicata"}`,
      `Persone: ${peopleCount ?? "Non indicato"}`,
      `Budget: ${budgetRange ?? "Non indicato"}`,
      `Nome: ${name ?? "Non indicato"}`,
      `Email: ${email ?? "Non indicata"}`,
      `Telefono: ${phone ?? "Non indicato"}`,
      `Messaggio: ${message}`,
      `Controllo sicurezza: ${moderation.decision}${moderation.categories.length ? ` (${moderation.categories.join(", ")})` : ""}`,
      `Nota interna: ${moderation.reason}`
    ]
  });

  revalidatePath("/backend");
  revalidatePath("/gestione");

  if (returnTo?.startsWith("/")) {
    revalidatePath(returnTo);
    redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}fornitori=inviata`);
  }

  redirect("/trova-fornitori?inviata=1");
}

export async function createSupportRequest(formData: FormData) {
  const sourcePath = optionalText(formData, "sourcePath");
  const returnTo = sourcePath && sourcePath.startsWith("/") ? sourcePath : "/";
  let destination = redirectWithStatus(returnTo, "supporto", "inviato");

  try {
    assertHoneypotEmpty(formData);

    const name = optionalText(formData, "name");
    const email = textValue(formData, "email");
    const message = textValue(formData, "message");

    if (!email || !email.includes("@") || !message) {
      throw new Error("Inserisci email e messaggio per inviare una richiesta supporto.");
    }

    assertCleanText([name, message, sourcePath]);
    assertNotSpam([name, message], { maxLinks: 2 });
    const moderation = await moderateOrReject("private_support", [name, message, sourcePath]);
    await assertSubmissionCooldown("support", 25);

    await prisma.supportRequest.create({
      data: {
        name,
        email,
        message,
        sourcePath
      }
    });

    await sendInternalNotification({
      subject: "Nuova richiesta supporto",
      preview: "Una persona ha inviato una richiesta supporto dal widget di OrganizzaEvento.com.",
      lines: [
        `Nome: ${name ?? "Non indicato"}`,
        `Email: ${email}`,
        `Pagina: ${sourcePath ?? "Non indicata"}`,
        `Messaggio: ${message}`,
        `Controllo sicurezza: ${moderation.decision}${moderation.categories.length ? ` (${moderation.categories.join(", ")})` : ""}`,
        `Nota interna: ${moderation.reason}`
      ]
    });

    revalidatePath("/backend");
    revalidatePath("/gestione");
  } catch (error) {
    console.error("Richiesta supporto non salvata.", error);
    destination = redirectWithStatus(returnTo, "supporto", "errore");
  }

  redirect(destination);
}

export async function createAnswer(formData: FormData) {
  assertHoneypotEmpty(formData);
  assertHumanPace(formData);
  verifyCaptcha(formData);

  const questionSlug = textValue(formData, "questionSlug");
  const content = textValue(formData, "content");
  const displayMode = parseDisplayMode(textValue(formData, "displayMode"));
  const displayName = displayMode === "anonymous" ? null : optionalText(formData, "displayName");

  if (!questionSlug || !content) {
    throw new Error("Scrivi una risposta prima di pubblicare.");
  }

  if (displayMode !== "anonymous" && !displayName) {
    throw new Error("Inserisci il nome da mostrare oppure scegli Anonimo.");
  }

  assertCleanText([content, displayName]);
  assertNotSpam([content, displayName]);
  const moderation = await moderateOrReject("public_answer", [content, displayName]);
  await assertSubmissionCooldown("answer", 25);

  const account = await currentAccount();
  if (displayName) {
    const conflict = await publicIdentityConflict([displayName], account?.id);
    if (conflict) throw new Error("Questo nome è già usato da un account registrato. Scegli un altro nickname.");
  }
  const question = await prisma.question.findUnique({
    where: { slug: questionSlug },
    select: { id: true, title: true, category: { select: { slug: true } } }
  });

  if (!question) {
    throw new Error("Domanda non trovata.");
  }
  const answerStatus: Status = moderation.decision === "review" ? "pending" : "published";

  const createdAnswer = await prisma.$transaction(async (tx) => {
    const answer = await tx.answer.create({
      data: {
        questionId: question.id,
        content,
        displayMode,
        displayName,
        privateEmail: optionalText(formData, "privateEmail"),
        accountId: account?.id ?? null,
        status: answerStatus
      }
    });

    if (answerStatus === "published") {
      await tx.question.update({
        where: { id: question.id },
        data: { answersCount: { increment: 1 } }
      });
    }

    return answer;
  });

  if (account) {
    await prisma.userAccount.update({
      where: { id: account.id },
      data: { activityPoints: { increment: 12 }, lastSeenAt: new Date() }
    });
  }

  await recordCommunityActivity({
    kind: "answer",
    questionId: question.id,
    answerId: createdAnswer.id,
    accountId: account?.id ?? null,
    displayMode,
    displayName
  });

  const subscribers = answerStatus === "published" ? await prisma.conversationSubscription.findMany({
    where: { questionId: question.id },
    select: { email: true }
  }) : [];

  if (subscribers.length) {
    await Promise.all(
      subscribers.map((subscriber) =>
        sendInternalNotification({
          to: [subscriber.email],
          subject: "Nuova risposta su OrganizzaEvento.com",
          preview: "La conversazione che stai seguendo ha ricevuto una nuova risposta.",
          lines: [
            `Conversazione: ${questionSlug}`,
            `Nuova risposta: ${createdAnswer.content}`,
            `Apri la pagina: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com"}/domande/${questionSlug}`
          ]
        })
      )
    );
  }

  await sendInternalNotification({
    subject: "Nuova risposta pubblicata",
    preview: "Una conversazione ha ricevuto una nuova risposta su OrganizzaEvento.com.",
    lines: [
      `Domanda: ${question.title}`,
      `Autore risposta: ${displayName ?? "Anonimo o non indicato"}`,
      `Email privata: ${optionalText(formData, "privateEmail") ?? "Non indicata"}`,
      `Risposta: ${createdAnswer.content}`,
      `Moderazione: ${answerStatus === "pending" ? "In revisione" : "Pubblicata"}${moderation.categories.length ? ` (${moderation.categories.join(", ")})` : ""}`,
      `Motivo controllo: ${moderation.reason}`,
      `Link: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com"}/domande/${questionSlug}`
    ]
  });

  const questionCategorySlug = question.category?.slug ?? "domande";
  revalidatePath(`/domande/${questionSlug}`);
  revalidatePath(`/categorie/${questionCategorySlug}`);
  revalidatePath("/backend");
  revalidatePath("/gestione");
  if (answerStatus === "pending") {
    redirect(`/domande/${questionSlug}?risposta=revisione#risposte`);
  }
  redirect(`/domande/${questionSlug}#risposte`);
}

export async function subscribeToQuestionUpdates(formData: FormData) {
  const questionSlug = textValue(formData, "questionSlug");
  const email = textValue(formData, "email").toLowerCase();
  const returnTo = textValue(formData, "returnTo") || "/";
  let destination = redirectWithStatus(returnTo, "avviso", "ok");

  try {
    assertHoneypotEmpty(formData);
    assertHumanPace(formData, 2);

    if (!questionSlug || !email || !email.includes("@")) {
      throw new Error("Inserisci una email valida.");
    }

    assertNotSpam([email], { maxLinks: 0 });
    await assertSubmissionCooldown("subscription", 10);

    const question = await prisma.question.findUnique({
      where: { slug: questionSlug },
      select: { id: true, title: true }
    });

    if (!question) throw new Error("Domanda non trovata.");

    await prisma.conversationSubscription.upsert({
      where: {
        questionId_email: {
          questionId: question.id,
          email
        }
      },
      update: {},
      create: {
        questionId: question.id,
        email
      }
    });

    await sendInternalNotification({
      subject: "Nuova iscrizione risposte",
      preview: "Una persona vuole ricevere avvisi quando arrivano nuove risposte.",
      lines: [`Domanda: ${question.title}`, `Email: ${email}`]
    });

    revalidatePath(returnTo);
  } catch (error) {
    console.error("Iscrizione risposte non salvata.", error);
    destination = redirectWithStatus(returnTo, "avviso", "errore");
  }

  redirect(destination);
}

export async function voteAction(formData: FormData) {
  const targetType = textValue(formData, "targetType") as TargetType;
  const targetId = textValue(formData, "targetId");
  const voteType = textValue(formData, "voteType") as VoteType;
  const returnTo = textValue(formData, "returnTo") || "/";

  if (!["question", "answer"].includes(targetType) || !["useful", "not_useful"].includes(voteType)) {
    throw new Error("Voto non valido.");
  }

  const voterHash = await getVoterHash();
  const existing = await prisma.vote.findUnique({
    where: {
      targetType_targetId_voterHash: {
        targetType,
        targetId,
        voterHash
      }
    }
  });

  if (!existing) {
    await prisma.$transaction([
      prisma.vote.create({ data: { targetType, targetId, voteType, voterHash } }),
      targetType === "question"
        ? prisma.question.update({
            where: { id: targetId },
            data: incrementVoteData(voteType)
          })
        : prisma.answer.update({
            where: { id: targetId },
            data: incrementVoteData(voteType)
          })
    ]);
  } else if (existing.voteType !== voteType) {
    await prisma.$transaction([
      prisma.vote.update({
        where: { id: existing.id },
        data: { voteType }
      }),
      targetType === "question"
        ? prisma.question.update({
            where: { id: targetId },
            data: switchVoteData(existing.voteType, voteType)
          })
        : prisma.answer.update({
            where: { id: targetId },
            data: switchVoteData(existing.voteType, voteType)
          })
    ]);
  }

  revalidatePath(returnTo);
  redirect(returnTo);
}

export async function reportAction(formData: FormData) {
  const returnTo = textValue(formData, "returnTo") || "/";
  let destination = redirectWithStatus(returnTo, "segnalazione", "inviata");
  let failedStep = "inizio";

  try {
    failedStep = "honeypot";
    assertHoneypotEmpty(formData);
    failedStep = "ritmo";
    assertHumanPace(formData, 2);

    failedStep = "dati";
    const targetType = textValue(formData, "targetType") as TargetType;
    const targetId = textValue(formData, "targetId");
    const reason = textValue(formData, "reason");
    const details = optionalText(formData, "details");

    if (!["question", "answer"].includes(targetType) || !targetId || !reason) {
      throw new Error("Segnalazione non valida.");
    }

    failedStep = "moderazione";
    assertCleanText([reason, details]);
    failedStep = "spam";
    assertNotSpam([reason, details], { maxLinks: 0 });
    failedStep = "moderazione interna";
    const moderation = await moderateOrReject("public_report", [reason, details]);
    failedStep = "cooldown";
    await assertSubmissionCooldown("report", 15);

    failedStep = "salvataggio";
    await prisma.report.create({
      data: {
        targetType,
        targetId,
        reason,
        details
      }
    });

    failedStep = "notifica";
    await sendInternalNotification({
      subject: "Nuova segnalazione contenuto",
      preview: "Una persona ha segnalato un contenuto su OrganizzaEvento.com.",
      lines: [
        `Tipo contenuto: ${targetType}`,
        `ID contenuto: ${targetId}`,
        `Motivo: ${reason}`,
        `Dettagli: ${details ?? "Non indicati"}`,
        `Controllo sicurezza: ${moderation.decision}${moderation.categories.length ? ` (${moderation.categories.join(", ")})` : ""}`,
        `Nota interna: ${moderation.reason}`,
        `Pagina: ${returnTo}`
      ]
    });

    failedStep = "revalidate";
    revalidatePath(returnTo);
    revalidatePath("/backend");
    revalidatePath("/gestione");
  } catch (error) {
    console.error(`Segnalazione non salvata (${failedStep}).`, error);
    destination = redirectWithStatus(returnTo, "segnalazione", "errore");
  }

  redirect(destination);
}

export async function adminUpdateQuestionStatus(formData: FormData) {
  const questionId = textValue(formData, "questionId");
  const status = textValue(formData, "status") as Status;
  await requireAdmin();

  await prisma.question.update({
    where: { id: questionId },
    data: { status }
  });

  revalidatePath("/backend");
  revalidatePath("/gestione");
  redirect(ADMIN_HOME);
}

export async function adminUpdateAnswerStatus(formData: FormData) {
  const answerId = textValue(formData, "answerId");
  const status = textValue(formData, "status") as Status;
  await requireAdmin();

  const currentAnswer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: { question: true }
  });

  if (!currentAnswer) throw new Error("Risposta non trovata.");

  const answer = await prisma.answer.update({
    where: { id: answerId },
    data: { status },
    include: { question: true }
  });

  if (status === "hidden" && currentAnswer.status === "published") {
    await prisma.question.update({
      where: { id: answer.questionId },
      data: { answersCount: { decrement: 1 } }
    });
  } else if (status === "published" && currentAnswer.status !== "published") {
    await prisma.question.update({
      where: { id: answer.questionId },
      data: { answersCount: { increment: 1 } }
    });
  }

  revalidatePath(`/domande/${answer.question.slug}`);
  revalidatePath("/backend");
  revalidatePath("/gestione");
  redirect(ADMIN_HOME);
}

export async function adminSetBestAnswer(formData: FormData) {
  const answerId = textValue(formData, "answerId");
  await requireAdmin();

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    select: { questionId: true, question: { select: { slug: true } } }
  });

  if (!answer) throw new Error("Risposta non trovata.");

  await prisma.$transaction([
    prisma.answer.updateMany({
      where: { questionId: answer.questionId },
      data: { isBestAnswer: false }
    }),
    prisma.answer.update({
      where: { id: answerId },
      data: { isBestAnswer: true }
    })
  ]);

  revalidatePath(`/domande/${answer.question.slug}`);
  revalidatePath("/backend");
  revalidatePath("/gestione");
  redirect(ADMIN_HOME);
}

export async function adminUpdateReportStatus(formData: FormData) {
  const reportId = textValue(formData, "reportId");
  const status = textValue(formData, "status") as "open" | "reviewed" | "dismissed";
  await requireAdmin();

  await prisma.report.update({
    where: { id: reportId },
    data: { status }
  });

  revalidatePath("/backend");
  revalidatePath("/gestione");
  redirect(ADMIN_HOME);
}

export async function adminUpdateSupplierRequestStatus(formData: FormData) {
  const requestId = textValue(formData, "requestId");
  const status = textValue(formData, "status") as SupplierRequestStatus;
  await requireAdmin();

  if (!SUPPLIER_REQUEST_STATUSES.includes(status as (typeof SUPPLIER_REQUEST_STATUSES)[number])) {
    throw new Error("Stato richiesta non valido.");
  }

  await prisma.supplierRequest.update({
    where: { id: requestId },
    data: { status }
  });

  revalidatePath("/backend");
  revalidatePath("/gestione");
  redirect(ADMIN_HOME);
}

export async function adminUpdateSupportRequestStatus(formData: FormData) {
  const requestId = textValue(formData, "requestId");
  const status = textValue(formData, "status") as SupportRequestStatus;
  await requireAdmin();

  if (!SUPPORT_REQUEST_STATUSES.includes(status as (typeof SUPPORT_REQUEST_STATUSES)[number])) {
    throw new Error("Stato supporto non valido.");
  }

  await prisma.supportRequest.update({
    where: { id: requestId },
    data: { status }
  });

  revalidatePath("/backend");
  revalidatePath("/gestione");
  redirect(ADMIN_HOME);
}

export async function adminUpdateAccountStatus(formData: FormData) {
  await ensureAccountSchema();
  const accountId = textValue(formData, "accountId");
  const status = textValue(formData, "status") as AccountStatus;
  await requireAdmin();

  if (!ACCOUNT_STATUSES.includes(status)) throw new Error("Stato account non valido.");

  await prisma.userAccount.update({
    where: { id: accountId },
    data: { status }
  });

  revalidatePath("/backend");
  revalidatePath("/gestione");
  redirect(ADMIN_HOME);
}

export async function adminCleanupTestDataAction() {
  await requireAdmin();
  const result = await cleanupDiagnosticTestData();

  revalidatePath("/backend");
  revalidatePath("/gestione");
  redirect(`${ADMIN_HOME}?pulizia=${result.totalDeleted}`);
}
