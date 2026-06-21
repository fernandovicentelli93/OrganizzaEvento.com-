import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { HtmlLanguageSync } from "@/components/HtmlLanguageSync";
import { LogoSparkle } from "@/components/LogoSparkle";
import { Header } from "@/components/Header";
import { SiteVisitTracker } from "@/components/SiteVisitTracker";
import { SupportChat } from "@/components/SupportChat";
import { SITE_CLAIM, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-M2BH2WMNV6";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} - ${SITE_CLAIM}`,
    template: `%s | ${SITE_NAME}`
  },
  description:
    "Forum italiano semplice e indipendente per fare domande su location, catering, musica, fornitori, matrimoni, compleanni ed eventi aziendali.",
  applicationName: SITE_NAME,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: `${SITE_NAME} - ${SITE_CLAIM}`,
    description:
      "Fai domande in anonimo, capisci quanto costa un evento e ricevi consigli pratici sull'organizzazione di eventi.",
    siteName: SITE_NAME,
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/brand/social-badge.png",
        width: 900,
        height: 900,
        alt: `${SITE_NAME} logo`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - ${SITE_CLAIM}`,
    description:
      "Community italiana per domande, costi e consigli pratici sull'organizzazione di eventi.",
    images: ["/brand/social-badge.png"]
  },
  verification: {
    google: "GOpBF8EfrtPZfuAjYaxZfzVZ_Gt0-plOZqzj1h96"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <LogoSparkle />
        <Suspense fallback={null}>
          <SupportChat />
        </Suspense>
        <HtmlLanguageSync />
        <Suspense fallback={null}>
          <SiteVisitTracker />
        </Suspense>
        {gaMeasurementId ? (
          <Script id="google-consent-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}
              window.__oeAnalyticsBlocked = true;
              window.gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
            `}
          </Script>
        ) : null}
        {gaMeasurementId ? (
          <>
            <CookieConsentBanner measurementId={gaMeasurementId} />
            <Suspense fallback={null}>
              <GoogleAnalytics measurementId={gaMeasurementId} />
            </Suspense>
          </>
        ) : null}
      </body>
    </html>
  );
}
