import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";
const privatePaths = ["/admin", "/backend", "/gestione", "/dashboard", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: privatePaths
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: privatePaths
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: privatePaths
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: privatePaths
      }
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/sitemap-it.xml`,
      `${siteUrl}/sitemap-en.xml`,
      `${siteUrl}/sitemap-es.xml`,
      `${siteUrl}/sitemap-fr.xml`,
      `${siteUrl}/sitemaps/analizza-preventivo/sitemap-index.xml`
    ],
    host: siteUrl
  };
}
