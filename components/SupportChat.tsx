"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import { SUPPORT_EMAIL, SUPPORT_EMAIL_LINK } from "@/lib/constants";
import { localeFromPathname, type Locale } from "@/lib/i18n-basic";

type SupportCopy = {
  title: string;
  intro: string;
  close: string;
  sent: string;
  failed: string;
  messagePlaceholder: string;
  assistantButton: string;
  assistantLoading: string;
  assistantTitle: string;
  assistantError: string;
  emailAlternative: string;
  compactTitle: string;
  compactText: string;
  supplierCtaTitle: string;
  supplierCtaText: string;
  supplierCtaButton: string;
  quickActions: string[];
};

const supportCopy: Record<Locale, SupportCopy> = {
  it: {
    title: "Ti serve una mano?",
    intro: "Dimmi cosa stai organizzando o cosa non trovi: ti guido nel punto giusto della piattaforma.",
    close: "Chiudi supporto",
    sent: `Richiesta ricevuta. Per urgenze puoi scrivere a ${SUPPORT_EMAIL}.`,
    failed: `Il messaggio è stato bloccato dai filtri. Riprova senza link o scrivi a ${SUPPORT_EMAIL}.`,
    messagePlaceholder: "Scrivi qui...",
    assistantButton: "Invia",
    assistantLoading: "Sto scrivendo...",
    assistantTitle: "OrganizzaEvento",
    assistantError: `Non riesco a rispondere adesso. Scrivi a ${SUPPORT_EMAIL}.`,
    emailAlternative: `Assistenza: ${SUPPORT_EMAIL}`,
    compactTitle: "Ti serve una mano?",
    compactText: "Chatta qui",
    supplierCtaTitle: "Cerchi fornitori",
    supplierCtaText: "Per location, catering, musica, foto o altri servizi puoi aprire il modulo dedicato con Vibes Planner.",
    supplierCtaButton: "Trova fornitori italiani",
    quickActions: ["Cerco fornitori", "Ho un preventivo", "Voglio fare una domanda"]
  },
  en: {
    title: "Need help?",
    intro: "Tell me what you are planning or what you cannot find: I will point you to the right place.",
    close: "Close support",
    sent: `Request received. For urgent needs email ${SUPPORT_EMAIL}.`,
    failed: `The filters blocked this message. Try again without links or email ${SUPPORT_EMAIL}.`,
    messagePlaceholder: "Write here...",
    assistantButton: "Send",
    assistantLoading: "Writing...",
    assistantTitle: "OrganizzaEvento",
    assistantError: `I cannot answer right now. Email ${SUPPORT_EMAIL}.`,
    emailAlternative: `Support: ${SUPPORT_EMAIL}`,
    compactTitle: "Need help?",
    compactText: "Chat here",
    supplierCtaTitle: "Looking for Italian suppliers",
    supplierCtaText: "For venues, catering, music, photo or other services, open the dedicated Vibes Planner request form.",
    supplierCtaButton: "Find Italian suppliers",
    quickActions: ["Find suppliers", "Check a quote", "Ask the community"]
  },
  es: {
    title: "¿Necesitas ayuda?",
    intro: "Dime qué estás organizando o qué no encuentras: te llevo al punto correcto.",
    close: "Cerrar soporte",
    sent: `Solicitud recibida. Si es urgente escribe a ${SUPPORT_EMAIL}.`,
    failed: `Los filtros bloquearon el mensaje. Prueba sin enlaces o escribe a ${SUPPORT_EMAIL}.`,
    messagePlaceholder: "Escribe aqui...",
    assistantButton: "Enviar",
    assistantLoading: "Escribiendo...",
    assistantTitle: "OrganizzaEvento",
    assistantError: `No puedo responder ahora. Escribe a ${SUPPORT_EMAIL}.`,
    emailAlternative: `Soporte: ${SUPPORT_EMAIL}`,
    compactTitle: "¿Necesitas ayuda?",
    compactText: "Chat aqui",
    supplierCtaTitle: "Buscas proveedores italianos",
    supplierCtaText: "Para lugares, catering, música, foto u otros servicios, abre el formulario dedicado de Vibes Planner.",
    supplierCtaButton: "Encontrar proveedores italianos",
    quickActions: ["Buscar proveedores", "Revisar presupuesto", "Preguntar a la comunidad"]
  },
  fr: {
    title: "Besoin d'aide ?",
    intro: "Dites-moi ce que vous organisez ou ce que vous ne trouvez pas : je vous guide au bon endroit.",
    close: "Fermer le support",
    sent: `Demande recue. En cas d'urgence, ecrivez a ${SUPPORT_EMAIL}.`,
    failed: `Les filtres ont bloque ce message. Reessayez sans liens ou ecrivez a ${SUPPORT_EMAIL}.`,
    messagePlaceholder: "Écrivez ici...",
    assistantButton: "Envoyer",
    assistantLoading: "J'ecris...",
    assistantTitle: "OrganizzaEvento",
    assistantError: `Je ne peux pas répondre maintenant. Écrivez ? ${SUPPORT_EMAIL}.`,
    emailAlternative: `Support : ${SUPPORT_EMAIL}`,
    compactTitle: "Besoin d'aide ?",
    compactText: "Chat ici",
    supplierCtaTitle: "Vous cherchez des prestataires italiens ",
    supplierCtaText: "Pour lieux, traiteur, musique, photo ou autres services, ouvrez le formulaire dédié Vibes Planner.",
    supplierCtaButton: "Trouver des prestataires italiens",
    quickActions: ["Trouver des prestataires", "Verifier un devis", "Poser une question"]
  }
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  supplierHint?: boolean;
};

function hasSupplierIntent(value: string) {
  const normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return [
    "fornitor",
    "supplier",
    "prestataire",
    "proveedor",
    "location",
    "venue",
    "catering",
    "dj",
    "music",
    "musica",
    "fotograf",
    "photo",
    "fiori",
    "flowers",
    "devis",
    "quote",
    "preventivo",
    "presupuesto"
  ].some((word) => normalized.includes(word));
}

export function SupportChat() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = localeFromPathname(pathname);
  const copy = supportCopy[locale];
  const sent = searchParams.get("supporto") === "inviato";
  const failed = searchParams.get("supporto") === "errore";
  const [isOpen, setIsOpen] = useState(sent || failed);
  const [message, setMessage] = useState("");
  const [assistantStatus, setAssistantStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      text: supportCopy[locale].intro
    }
  ]);

  const sourcePath = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("supporto");
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const showSupplierCta = messages.some((item) => item.supplierHint || hasSupplierIntent(item.text));

  async function requestQuickHelp(event: FormEvent<HTMLFormElement> | undefined, presetMessage: string) {
    event?.preventDefault();
    const userMessage = (presetMessage || message).trim();
    if (userMessage.length < 4 || assistantStatus === "loading") return;

    setAssistantStatus("loading");
    setMessage("");
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", text: userMessage, supplierHint: hasSupplierIntent(userMessage) }
    ]);

    try {
      const response = await fetch("/api/ai/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, message: userMessage, sourcePath })
      });
      const data = (await response.json().catch(() => ({}))) as { ok: boolean; reply: string };

      if (!response.ok || data.ok !== true || !data.reply) {
        setAssistantStatus("error");
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: data.reply ?? "",
          supplierHint: hasSupplierIntent(data.reply ?? "")
        }
      ]);
      setAssistantStatus("ready");
    } catch {
      setAssistantStatus("error");
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3">
      {isOpen ? (
        <section className="w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-white shadow-soft">
          <div className="flex items-center gap-3 border-b border-line bg-cream px-4 py-3">
            <Image src="/brand/icon.png" alt="" width={42} height={42} priority className="h-10 w-10 rounded-xl" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-ink">{copy.title}</h2>
              <p className="truncate text-xs text-muted">{copy.compactText}</p>
            </div>
            <button
              type="button"
              className="focus-ring rounded-lg px-2 py-1 text-sm font-semibold text-muted transition hover:bg-white hover:text-ink"
              onClick={() => setIsOpen(false)}
              aria-label={copy.close}
            >
              x
            </button>
          </div>

          <div className="px-4 pt-4">
            {sent ? (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                {copy.sent}
              </p>
            ) : null}
            {failed ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800">
                {copy.failed}
              </p>
            ) : null}
          </div>

          <div className="mx-4 mt-4 max-h-[22rem] space-y-3 overflow-y-auto rounded-lg bg-cream p-3">
            {messages.map((item) => (
              <div
                key={item.id}
                className={[
                  "max-w-[90%] rounded-lg px-3.5 py-2.5 text-sm leading-6",
                  item.role === "assistant"
                    ? "mr-auto border border-line bg-white text-ink"
                    : "ml-auto bg-violet-cta text-white"
                ].join(" ")}
              >
                {item.role === "assistant" ? (
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-cta">
                    {copy.assistantTitle}
                  </p>
                ) : null}
                <p className="whitespace-pre-line">{item.text}</p>
              </div>
            ))}
            {assistantStatus === "loading" ? (
              <div className="mr-auto max-w-[88%] rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm leading-6 text-muted">
                {copy.assistantLoading}
              </div>
            ) : null}
          </div>

          <div className="mx-4 mt-3 flex flex-wrap gap-2">
            {copy.quickActions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => requestQuickHelp(undefined, item)}
                disabled={assistantStatus === "loading"}
                className="focus-ring rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-petal disabled:opacity-50"
              >
                {item}
              </button>
            ))}
          </div>

          {showSupplierCta ? (
            <div className="mx-4 mt-3 rounded-lg border border-violet-100 bg-petal p-3">
              <p className="text-sm font-semibold text-ink">{copy.supplierCtaTitle}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{copy.supplierCtaText}</p>
              <VibesSupplierCta
                variant="pink"
                className="mt-3 min-h-10 w-full rounded-lg px-3 py-2 shadow-none"
                logoClassName="h-6 w-6"
              >
                {copy.supplierCtaButton}
              </VibesSupplierCta>
            </div>
          ) : null}

          {assistantStatus === "error" ? (
            <p className="mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
              {copy.assistantError}
            </p>
          ) : null}

          <form onSubmit={(event) => requestQuickHelp(event, "")} className="mx-4 mt-3 flex gap-2 pb-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="focus-ring min-h-11 min-w-0 flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink"
              placeholder={copy.messagePlaceholder}
            />
            <button
              type="submit"
              disabled={message.trim().length < 4 || assistantStatus === "loading"}
              className="focus-ring min-h-11 rounded-lg bg-violet-cta px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-hover disabled:cursor-not-allowed disabled:opacity-55"
            >
              {copy.assistantButton}
            </button>
          </form>

          <a className="block border-t border-line px-4 py-2 text-center text-xs font-semibold text-muted hover:text-ink" href={SUPPORT_EMAIL_LINK}>
            {copy.emailAlternative}
          </a>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="focus-ring flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-white p-2 text-left shadow-soft transition hover:-translate-y-0.5 hover:bg-petal sm:h-auto sm:w-auto sm:justify-start sm:gap-3 sm:px-3 sm:py-2 sm:pr-4"
          aria-label={copy.title}
        >
          <Image src="/brand/icon.png" alt="" width={40} height={40} priority className="h-10 w-10 rounded-xl" />
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-ink">{copy.compactTitle}</span>
            <span className="block text-xs text-muted">{copy.compactText}</span>
          </span>
        </button>
      )}
    </div>
  );
}
