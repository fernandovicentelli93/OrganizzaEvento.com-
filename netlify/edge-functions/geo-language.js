const supportedLocales = new Set(["it", "en", "es", "fr"]);
const localeSwitchParam = "oe_switch_locale";
const italianCountries = new Set(["IT", "SM", "VA"]);
const frenchCountries = new Set(["FR", "MC", "BE", "LU"]);
const spanishCountries = new Set([
  "ES",
  "MX",
  "AR",
  "CO",
  "CL",
  "PE",
  "VE",
  "UY",
  "PY",
  "BO",
  "EC",
  "GT",
  "CU",
  "DO",
  "HN",
  "SV",
  "NI",
  "CR",
  "PA",
  "PR"
]);

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function isCrawler(userAgent) {
  return /bot|crawler|spider|googlebot|bingbot|duckduckbot|slurp|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot/i.test(
    userAgent ?? ""
  );
}

function localeFromCountry(countryCode, subdivisionCode) {
  const country = (countryCode ?? "").toUpperCase();
  const subdivision = (subdivisionCode ?? "").toUpperCase();

  if (!country) return null;
  if (italianCountries.has(country)) return "it";
  if (spanishCountries.has(country)) return "es";
  if (frenchCountries.has(country)) return "fr";
  if (country === "CH") return "fr";
  if (country === "CA" && subdivision === "QC") return "fr";

  return "en";
}

function localeFromPathname(pathname) {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return supportedLocales.has(firstSegment) ? firstSegment : null;
}

async function nextWithHtmlLanguage(context, locale) {
  const response = await context.next();
  if (!locale) return response;

  const contentType = response.headers.get("content-type") ?? "";
  const headers = new Headers(response.headers);
  headers.set("content-language", locale);

  if (!contentType.includes("text/html")) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  if (typeof HTMLRewriter === "undefined") {
    const html = await response.text();
    const rewrittenHtml = html.replace(/<html\b[^>]*>/i, (match) => {
      if (/\blang=/i.test(match)) return match.replace(/\blang=(["']).*?\1/i, `lang="${locale}"`);
      return match.replace("<html", `<html lang="${locale}"`);
    });

    return new Response(rewrittenHtml, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  return new HTMLRewriter()
    .on("html", {
      element(element) {
        element.setAttribute("lang", locale);
      }
    })
    .transform(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      })
    );
}

function redirectToLocale(req, locale, pathname = "/") {
  if (locale === "it") return null;

  const target = new URL(req.url);
  target.pathname = pathname === "/" ? `/${locale}/` : pathname;
  return new Response(null, {
    status: 302,
    headers: {
      location: target.toString(),
      "cache-control": "no-store",
      vary: "cookie, x-nf-geo"
    }
  });
}

function redirectAfterLocaleSwitch(req, locale) {
  const target = new URL(req.url);
  target.searchParams.delete(localeSwitchParam);

  if (locale === "it") {
    target.pathname = "/";
  } else if (target.pathname === "/") {
    target.pathname = `/${locale}/`;
  }

  return new Response(null, {
    status: 302,
    headers: {
      location: target.toString(),
      "set-cookie": `oe_locale=${encodeURIComponent(locale)}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`,
      "cache-control": "no-store",
      vary: "cookie, x-nf-geo"
    }
  });
}

export default async (req, context) => {
  const url = new URL(req.url);
  const explicitLocale = localeFromPathname(url.pathname);

  if (req.method !== "GET" && req.method !== "HEAD") return context.next();
  if (isCrawler(req.headers.get("user-agent"))) return nextWithHtmlLanguage(context, explicitLocale);

  const switchedLocale = url.searchParams.get(localeSwitchParam);
  if (supportedLocales.has(switchedLocale)) {
    return redirectAfterLocaleSwitch(req, switchedLocale);
  }

  const preferredLocale = readCookie(req.headers.get("cookie"), "oe_locale");
  if (supportedLocales.has(preferredLocale)) {
    if (url.pathname === "/") return redirectToLocale(req, preferredLocale) ?? context.next();
    return nextWithHtmlLanguage(context, explicitLocale);
  }

  const geoLocale = localeFromCountry(context.geo?.country?.code, context.geo?.subdivision?.code);
  if (!geoLocale) return nextWithHtmlLanguage(context, explicitLocale);

  if (url.pathname !== "/") return nextWithHtmlLanguage(context, explicitLocale);
  return redirectToLocale(req, geoLocale) ?? context.next();
};
