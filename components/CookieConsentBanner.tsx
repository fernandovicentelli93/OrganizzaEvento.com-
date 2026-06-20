"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { localeFromPathname } from "@/lib/i18n-basic";

type CookieConsentBannerProps = {
  measurementId: string;
};

type ConsentValue = {
  version: 1;
  statistics: boolean;
  savedAt: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __oeGaLoaded?: boolean;
    __oeAnalyticsBlocked?: boolean;
  }
}

const STORAGE_KEY = "organizzaevento_cookie_consent_v1";

const copy = {
  it: {
    eyebrow: "Cookie",
    title: "Usiamo cookie essenziali e statistiche.",
    text:
      "Ci aiutano a capire se OrganizzaEvento viene trovato e usato bene. Puoi modificare la scelta quando vuoi.",
    read: "Leggi la",
    and: "e la",
    statistics: "Statistiche",
    statisticsText:
      "Aiutano a capire quali pagine vengono lette, da quali Paesi arrivano le visite e come migliorare il sito. Se le disattivi, blocchiamo Analytics da quel momento e rimuoviamo i cookie GA.",
    accept: "Accetta tutti",
    reject: "Rifiuta",
    customize: "Personalizza",
    save: "Salva preferenze",
    toggle: "Attiva o disattiva cookie statistiche"
  },
  en: {
    eyebrow: "Cookies",
    title: "We use essential and analytics cookies.",
    text:
      "They help us understand whether OrganizzaEvento is being found and used properly. You can change your choice anytime.",
    read: "Read the",
    and: "and the",
    statistics: "Statistics",
    statisticsText:
      "They help us understand which pages are read, which countries visits come from and how to improve the website. If disabled, we block Analytics from that moment and remove GA cookies.",
    accept: "Accept all",
    reject: "Reject",
    customize: "Customize",
    save: "Save preferences",
    toggle: "Enable or disable statistics cookies"
  },
  es: {
    eyebrow: "Cookies",
    title: "Usamos cookies esenciales y estadísticas.",
    text:
      "Nos ayudan a entender si OrganizzaEvento se encuentra y se utiliza correctamente. Puedes cambiar tu elección cuando quieras.",
    read: "Lee la",
    and: "y la",
    statistics: "Estadísticas",
    statisticsText:
      "Ayudan a entender qué páginas se leen, desde qué países llegan las visitas y cómo mejorar el sitio. Si las desactivas, bloqueamos Analytics desde ese momento y eliminamos las cookies GA.",
    accept: "Aceptar todo",
    reject: "Rechazar",
    customize: "Personalizar",
    save: "Guardar preferencias",
    toggle: "Activar o desactivar cookies de estadísticas"
  },
  fr: {
    eyebrow: "Cookies",
    title: "Nous utilisons des cookies essentiels et statistiques.",
    text:
      "Ils nous aident à comprendre si OrganizzaEvento est trouvé et utilisé correctement. Vous pouvez modifier votre choix à tout moment.",
    read: "Lire la",
    and: "et la",
    statistics: "Statistiques",
    statisticsText:
      "Elles nous aident à comprendre quelles pages sont lues, de quels pays viennent les visites et comment améliorer le site. Si vous les désactivez, nous bloquons Analytics à partir de ce moment et supprimons les cookies GA.",
    accept: "Tout accepter",
    reject: "Refuser",
    customize: "Personnaliser",
    save: "Enregistrer",
    toggle: "Activer ou désactiver les cookies de statistiques"
  }
} as const;

function ensureGtag() {
  const dataLayer = window.dataLayer ?? [];
  window.dataLayer = dataLayer;
  const gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      dataLayer.push(args);
    };
  window.gtag = gtag;
  return gtag;
}

function updateGoogleConsent(statistics: boolean) {
  const gtag = ensureGtag();
  window.__oeAnalyticsBlocked = !statistics;
  gtag("consent", "update", {
    analytics_storage: statistics ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
}

function deleteAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => name.startsWith("_ga"));
  const host = window.location.hostname;
  const parts = host.split(".");
  const rootDomain = parts.length > 1 ? `.${parts.slice(-2).join(".")}` : host;
  const domains = Array.from(new Set(["", host, `.${host}`, rootDomain]));

  for (const name of names) {
    for (const domain of domains) {
      const domainPart = domain ? `; Domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; Path=/${domainPart}; SameSite=Lax`;
    }
  }
}

function loadGoogleAnalytics(measurementId: string) {
  if (!measurementId || window.__oeGaLoaded) return;
  const gtag = ensureGtag();
  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: true
  });

  if (!document.getElementById("google-analytics-consented")) {
    const script = document.createElement("script");
    script.id = "google-analytics-consented";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  window.__oeGaLoaded = true;
}

function readSavedConsent() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentValue;
    if (parsed.version !== 1 || typeof parsed.statistics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(statistics: boolean) {
  const value: ConsentValue = {
    version: 1,
    statistics,
    savedAt: new Date().toISOString()
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  return value;
}

export function CookieConsentBanner({ measurementId }: CookieConsentBannerProps) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const c = copy[locale];
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [statistics, setStatistics] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = readSavedConsent();

    if (!saved) {
      updateGoogleConsent(false);
      setStatistics(false);
      deleteAnalyticsCookies();
      setVisible(true);
      return;
    }

    setStatistics(saved.statistics);
    updateGoogleConsent(saved.statistics);
    if (saved.statistics) {
      loadGoogleAnalytics(measurementId);
    } else {
      deleteAnalyticsCookies();
    }
  }, [measurementId]);

  useEffect(() => {
    function openPreferences() {
      const saved = readSavedConsent();
      setStatistics(Boolean(saved?.statistics));
      setCustomizing(true);
      setVisible(true);
    }

    window.addEventListener("organizzaevento:open-cookie-preferences", openPreferences);
    return () => window.removeEventListener("organizzaevento:open-cookie-preferences", openPreferences);
  }, []);

  function commit(nextStatistics: boolean) {
    saveConsent(nextStatistics);
    setStatistics(nextStatistics);
    updateGoogleConsent(nextStatistics);
    if (nextStatistics) {
      loadGoogleAnalytics(measurementId);
    } else {
      deleteAnalyticsCookies();
    }
    setVisible(false);
    setCustomizing(false);
  }

  if (!mounted || !visible) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-end bg-ink/28 px-3 pb-[calc(env(safe-area-inset-bottom)+0.85rem)] pt-6 backdrop-blur-[2px] sm:px-5 sm:pb-5">
      <section
        aria-labelledby="cookie-consent-title"
        role="dialog"
        className="mx-auto w-full max-w-5xl rounded-xl border border-[#D8C8EF] bg-white p-4 shadow-[0_24px_80px_rgba(31,41,55,0.28)] ring-1 ring-violet-cta/12 sm:p-5"
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <p className="inline-flex rounded-full bg-[#F1E8FF] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-cta">
              {c.eyebrow}
            </p>
            <h2 id="cookie-consent-title" className="mt-1 text-base font-semibold tracking-tight text-ink sm:text-lg">
              {c.title}
            </h2>
            <p className="mt-2 text-xs leading-5 text-ink/78 sm:text-sm">{c.text}</p>
            <p className="mt-1.5 text-[11px] leading-5 text-muted">
              {c.read}{" "}
              <Link className="font-semibold text-violet-cta hover:text-violet-hover" href="/cookie-policy/">
                Cookie Policy
              </Link>{" "}
              {c.and}{" "}
              <Link className="font-semibold text-violet-cta hover:text-violet-hover" href="/privacy-policy/">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[28rem]">
            <button
              type="button"
              onClick={() => commit(true)}
              className="focus-ring min-h-11 rounded-lg bg-violet-cta px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(124,58,237,0.24)] transition hover:bg-violet-hover sm:text-sm"
            >
              {c.accept}
            </button>
            <button
              type="button"
              onClick={() => commit(false)}
              className="focus-ring min-h-11 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:border-violet-cta/35 hover:bg-[#FFF9F3] sm:text-sm"
            >
              {c.reject}
            </button>
            {customizing ? (
              <button
                type="button"
                onClick={() => commit(statistics)}
                className="focus-ring min-h-11 rounded-lg border border-line bg-cream px-3 py-2 text-xs font-semibold text-ink transition hover:border-violet-cta/35 hover:bg-[#FFF9F3] sm:text-sm"
              >
                {c.save}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCustomizing(true)}
                className="focus-ring min-h-11 rounded-lg border border-line bg-cream px-3 py-2 text-xs font-semibold text-ink transition hover:border-violet-cta/35 hover:bg-[#FFF9F3] sm:text-sm"
              >
                {c.customize}
              </button>
            )}
          </div>
        </div>

        {customizing ? (
          <div className="mt-3 rounded-lg border border-[#E5D7F6] bg-[#FFF9F3] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{c.statistics}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{c.statisticsText}</p>
              </div>
              <button
                type="button"
                aria-pressed={statistics}
                onClick={() => setStatistics((value) => !value)}
                className={`focus-ring h-7 w-12 shrink-0 rounded-full p-1 transition ${
                  statistics ? "bg-violet-cta" : "bg-line"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white shadow transition ${
                    statistics ? "translate-x-5" : "translate-x-0"
                  }`}
                />
                <span className="sr-only">{c.toggle}</span>
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
