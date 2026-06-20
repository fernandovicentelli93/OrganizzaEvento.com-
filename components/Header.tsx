"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SITE_NAME } from "@/lib/constants";
import {
  LOCALES,
  Locale,
  headerCopy,
  languageHomePath,
  localeFromPathname,
  localeLabels,
  localeShortLabels,
  localizedStaticPath,
  staticRouteSegments
} from "@/lib/i18n-basic";

function localizedHref(locale: Locale, href?: string, key?: keyof typeof staticRouteSegments.it) {
  if (key) return localizedStaticPath(locale, key);
  if (!href) return localizedStaticPath(locale, "home");
  if (locale === "it") return href;

  const [rawPath, query] = href.split("?");
  const segment = rawPath.split("/").filter(Boolean)[0];
  const routeKey = Object.entries(staticRouteSegments.it).find(([, value]) => value === segment)?.[0] as keyof typeof staticRouteSegments.it | undefined;
  const localized = routeKey ? localizedStaticPath(locale, routeKey) : languageHomePath(locale);
  return query ? `${localized}?${query}` : localized;
}

function rememberLocale(locale: Locale) {
  document.cookie = `oe_locale=${encodeURIComponent(locale)}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function localeSwitchPath(href: string, locale: Locale) {
  if (locale === "it") return href;

  const [pathAndQuery, hash] = href.split("#");
  const separator = pathAndQuery.includes("?") ? "&" : "?";
  return `${pathAndQuery}${separator}oe_switch_locale=${encodeURIComponent(locale)}${hash ? `#${hash}` : ""}`;
}

function localizedCurrentPath(pathname: string | null, targetLocale: Locale) {
  const sourceLocale = localeFromPathname(pathname);
  const parts = pathname?.split("/").filter(Boolean) ?? [];
  const sourceSegment = sourceLocale === "it" ? parts[0] ?? "" : parts[1] ?? "";
  const routeKey = Object.entries(staticRouteSegments[sourceLocale]).find(([, value]) => value === sourceSegment)?.[0] as keyof typeof staticRouteSegments.it | undefined;
  return routeKey ? localizedStaticPath(targetLocale, routeKey) : languageHomePath(targetLocale);
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = localeFromPathname(pathname);
  const copy = headerCopy[locale];
  const languageTargets = useMemo(
    () =>
      LOCALES.map((item) => {
        const href = localizedCurrentPath(pathname, item);
        return { locale: item, href, switchHref: localeSwitchPath(href, item) };
      }),
    [pathname]
  );
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sections = useMemo(() => copy.sections, [copy.sections]);
  const isTalkOpen = openMenu === "Parliamo di";
  const isLanguageOpen = openMenu === "language";
  const mobileLinks = [
    { key: "signup" as const, label: copy.signup, description: locale === "it" ? "Cliente o fornitore, facoltativo" : copy.supplierDescription },
    { key: "suppliers" as const, label: copy.supplierLink, description: copy.supplierDescription },
    { key: "login" as const, label: copy.login, description: locale === "it" ? "Apri la tua dashboard" : "Dashboard" },
    { key: "analyzeQuote" as const, label: copy.analyzeQuote, description: locale === "it" ? "Controlla voci, extra e dubbi" : copy.sections[0].items[2]?.description ?? "" },
    { key: "questions" as const, label: copy.readDiscussions, description: locale === "it" ? "Guarda cosa chiedono gli altri" : copy.sections[1].items[1]?.description ?? "" },
    { key: "realPrices" as const, label: copy.sections[0].label, description: copy.sections[0].intro },
    { key: "topics" as const, label: copy.sections[1].label, description: copy.sections[1].intro },
    { key: "localSuppliers" as const, label: copy.sections[1].items[0]?.label ?? copy.supplierLink, description: copy.sections[1].items[0]?.description ?? "" },
    { key: "magazine" as const, label: copy.sections[2].label, description: copy.sections[2].intro },
    { key: "eventGuides" as const, label: copy.sections[2].items[1]?.label ?? "Guide", description: copy.sections[2].items[1]?.description ?? "" }
  ];

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const updateMode = () => {
      setIsDesktop(mediaQuery.matches);
      setOpenMenu(null);
      if (mediaQuery.matches) setMobileOpen(false);
    };

    updateMode();
    mediaQuery.addEventListener("change", updateMode);
    return () => mediaQuery.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    const closeOnScroll = () => {
      setOpenMenu(null);
      setMobileOpen(false);
    };
    window.addEventListener("scroll", closeOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, []);

  useEffect(() => {
    languageTargets.forEach((target) => router.prefetch(target.href));
  }, [languageTargets, router]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  function openTalkForDesktop() {
    if (isDesktop) {
      clearCloseTimer();
      setOpenMenu("Parliamo di");
    }
  }

  function closeForDesktop() {
    if (isDesktop) {
      clearCloseTimer();
      closeTimer.current = setTimeout(() => setOpenMenu(null), 220);
    }
  }

  function closeAll() {
    setOpenMenu(null);
    setMobileOpen(false);
  }

  function switchLocale(event: React.MouseEvent<HTMLAnchorElement>, targetLocale: Locale, href: string) {
    event.preventDefault();
    rememberLocale(targetLocale);
    closeAll();
    if (targetLocale === locale) return;
    window.location.assign(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream shadow-[0_8px_28px_rgba(47,36,48,0.08)]">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href={localizedStaticPath(locale, "home")} className="focus-ring inline-flex rounded-lg" aria-label={`${SITE_NAME} home`} onClick={closeAll}>
            <Image
              src="/brand/logo.png"
              alt={SITE_NAME}
              width={2400}
              height={720}
              priority
              className="h-auto w-40 max-w-[55vw] object-contain sm:w-56 md:w-52 lg:w-72"
            />
          </Link>

          <nav aria-label="Navigazione principale" className="hidden items-center gap-1 text-sm font-medium text-ink xl:flex">
            <Link
              href={localizedStaticPath(locale, "home")}
              className="focus-ring whitespace-nowrap rounded-xl px-4 py-3 transition hover:bg-white hover:text-violet-cta"
              onClick={closeAll}
            >
              {copy.home}
            </Link>
            <Link
              href={localizedStaticPath(locale, "analyzeQuote")}
              className="focus-ring whitespace-nowrap rounded-xl bg-petal px-4 py-3 font-semibold text-violet-cta transition hover:bg-white"
              onClick={closeAll}
            >
              {copy.analyzeQuote}
            </Link>

            <div className="relative shrink-0" onMouseEnter={openTalkForDesktop} onMouseLeave={closeForDesktop}>
              <Link
                href={localizedStaticPath(locale, "questions")}
                className={`focus-ring flex items-center gap-1 whitespace-nowrap rounded-xl px-4 py-3 transition hover:bg-white hover:text-violet-cta ${
                  isTalkOpen ? "bg-white text-violet-cta" : ""
                }`}
                aria-expanded={isTalkOpen}
                aria-haspopup="menu"
              >
                <span>{copy.talkAbout}</span>
                <span
                  aria-hidden="true"
                  className={`mt-[-2px] h-1.5 w-1.5 rotate-45 border-b border-r border-current transition ${
                    isTalkOpen ? "rotate-[225deg]" : ""
                  }`}
                />
              </Link>

              {isTalkOpen ? (
                <>
                  <div className="fixed inset-x-0 top-[5.05rem] h-5" aria-hidden="true" />
                  <div
                    className="fixed left-1/2 top-[5.6rem] z-50 max-h-[calc(100vh-6.4rem)] w-[min(64rem,calc(100vw-2rem))] -translate-x-1/2 overflow-y-auto rounded-2xl border border-line bg-white p-3 text-left shadow-soft"
                    role="menu"
                    onMouseEnter={openTalkForDesktop}
                    onMouseLeave={closeForDesktop}
                  >
                    <div className="mb-2 grid gap-2 border-b border-line pb-3 sm:grid-cols-[1.1fr_0.9fr]">
                      <Link
                        href={localizedStaticPath(locale, "questions")}
                        className="focus-ring rounded-xl bg-petal px-4 py-3 transition hover:bg-cream"
                        onClick={() => setOpenMenu(null)}
                      >
                        <span className="block text-sm font-semibold text-ink">{copy.readDiscussions}</span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          {locale === "it" ? "Parti dai casi reali già pubblicati dalla community." : copy.sections[1].items[1].description}
                        </span>
                      </Link>
                      <Link
                        href={localizedStaticPath(locale, "ask")}
                        className="focus-ring rounded-xl bg-violet-cta px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover"
                        onClick={() => setOpenMenu(null)}
                      >
                        {copy.openConversation}
                      </Link>
                    </div>
                    <Link
                      href={localizedStaticPath(locale, "suppliers")}
                      className="focus-ring mb-3 block rounded-xl border border-line bg-white px-4 py-3 transition hover:bg-petal"
                      onClick={() => setOpenMenu(null)}
                    >
                      <span className="block text-sm font-semibold text-ink">{copy.supplierLink}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted">
                        {copy.supplierDescription}
                      </span>
                    </Link>

                    <div className="grid gap-3 lg:grid-cols-3">
                      {sections.map((section) => (
                        <div key={section.key} className="rounded-xl border border-line bg-cream/70 p-2">
                          <Link
                            href={localizedStaticPath(locale, section.key)}
                            className="focus-ring block rounded-lg px-3 py-3 transition hover:bg-white"
                            onClick={() => setOpenMenu(null)}
                          >
                            <span className="block text-base font-semibold text-ink">{section.label}</span>
                            <span className="mt-1 block text-xs leading-5 text-muted">{section.intro}</span>
                          </Link>
                          <div className="mt-1 grid gap-1">
                            {section.items.map((item) => (
                              <Link
                                key={`${section.key}-${item.key ?? item.href}-${item.label}`}
                                href={localizedHref(locale, item.href, item.key)}
                                className="focus-ring rounded-lg px-3 py-2 transition hover:bg-white"
                                onClick={() => setOpenMenu(null)}
                              >
                                <span className="block text-sm font-semibold text-ink">{item.label}</span>
                                <span className="mt-0.5 block text-xs leading-5 text-muted">{item.description}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <Link
              href={localizedStaticPath(locale, "signup")}
              className="focus-ring whitespace-nowrap rounded-xl border border-line bg-white px-3 py-3 font-semibold text-ink transition hover:bg-petal hover:text-violet-cta"
              onClick={closeAll}
            >
              {copy.signup}
            </Link>
            <Link
              href={localizedStaticPath(locale, "login")}
              className="focus-ring whitespace-nowrap rounded-xl px-3 py-3 font-semibold text-ink transition hover:bg-white hover:text-violet-cta"
              onClick={closeAll}
            >
              {copy.login}
            </Link>
            <div className="relative">
              <button
                type="button"
                className={`focus-ring flex items-center gap-2 whitespace-nowrap rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold transition hover:bg-petal ${
                  isLanguageOpen ? "text-violet-cta" : "text-ink"
                }`}
                aria-haspopup="menu"
                aria-expanded={isLanguageOpen}
                onClick={() => {
                  clearCloseTimer();
                  setOpenMenu(isLanguageOpen ? null : "language");
                }}
              >
                <span className="text-xs uppercase tracking-[0.12em] text-muted">{copy.language}</span>
                <span>{localeLabels[locale]}</span>
                <span
                  aria-hidden="true"
                  className={`mt-[-2px] h-1.5 w-1.5 rotate-45 border-b border-r border-current transition ${
                    isLanguageOpen ? "rotate-[225deg]" : ""
                  }`}
                />
              </button>
              {isLanguageOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-xl border border-line bg-white p-2 text-sm shadow-soft">
                  {languageTargets.map((item) => (
                    <Link
                      key={item.locale}
                      href={item.switchHref}
                      hrefLang={item.locale}
                      prefetch={false}
                      className={`focus-ring flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-petal ${
                        item.locale === locale ? "bg-petal text-violet-cta" : "text-ink"
                      }`}
                      aria-label={localeLabels[item.locale]}
                      onClick={(event) => switchLocale(event, item.locale, item.switchHref)}
                    >
                      <span>{localeLabels[item.locale]}</span>
                      <span className="text-xs font-semibold text-muted">{localeShortLabels[item.locale]}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Link
              href={localizedStaticPath(locale, "ask")}
              className="focus-ring oe-pulse whitespace-nowrap rounded-xl bg-violet-cta px-5 py-3 font-semibold text-white shadow-soft transition hover:bg-violet-hover"
              onClick={closeAll}
            >
              {copy.ask}
            </Link>
          </nav>

          <div className="flex items-center gap-2 xl:hidden">
            <Link
              href={localizedStaticPath(locale, "ask")}
              className="focus-ring oe-pulse rounded-xl bg-violet-cta px-3 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-hover"
              onClick={closeAll}
            >
              {copy.mobileAsk}
            </Link>
            <button
              type="button"
              className="focus-ring rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-ink shadow-sm"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? copy.close : copy.menu}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Navigazione mobile"
          className="fixed inset-x-3 top-[5.25rem] z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-line bg-white p-2 text-sm shadow-soft xl:hidden"
        >
          <div className="px-4 pb-2 pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{copy.talkAbout}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 px-2 pb-3">
            {languageTargets.map((item) => (
              <Link
                key={item.locale}
                href={item.switchHref}
                hrefLang={item.locale}
                prefetch={false}
                className={`focus-ring rounded-xl border border-line px-3 py-3 text-center text-xs font-semibold ${
                  item.locale === locale ? "bg-petal text-violet-cta" : "bg-white text-muted"
                }`}
                onClick={(event) => switchLocale(event, item.locale, item.switchHref)}
              >
                {localeLabels[item.locale]}
              </Link>
            ))}
          </div>
          <div className="grid gap-1">
            {mobileLinks.map((item) => (
              <Link
                key={item.key}
                href={localizedStaticPath(locale, item.key)}
                className="focus-ring rounded-xl px-4 py-3 transition hover:bg-cream"
                onClick={closeAll}
              >
                <span className="block text-base font-semibold text-ink">{item.label}</span>
                <span className="mt-0.5 block text-xs leading-5 text-muted">{item.description}</span>
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
