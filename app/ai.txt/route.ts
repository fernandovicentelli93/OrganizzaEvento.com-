const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";

function link(label: string, href: string) {
  return `[${label}](${href})`;
}

export function GET() {
  return new Response(
    [
      "# OrganizzaEvento.com per agenti AI",
      "",
      "OrganizzaEvento.com e una community italiana per organizzare eventi senza registrazione obbligatoria.",
      "Temi principali: matrimoni, compleanni, feste private, eventi aziendali, location, catering, musica, fornitori, preventivi, quanto costa e problemi pratici.",
      "Pagine locali: guide per trovare e valutare fornitori eventi per servizio e zona. Le pagine locali includono casi tipici, checklist, FAQ, link interni e CTA tracciate.",
      "Crawler AI: i contenuti pubblici sono leggibili, le aree private e API sono escluse da robots.txt.",
      "",
      "## Link utili",
      `- ${link("Indice AI completo", `${siteUrl}/llms.txt`)}`,
      `- ${link("Sitemap index", `${siteUrl}/sitemap.xml`)}`,
      `- ${link("Hub fornitori locali", `${siteUrl}/fornitori-eventi`)}`,
      `- ${link("Area fornitori", `${siteUrl}/fornitori`)}`
    ].join("\n") + "\n",
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600"
      }
    }
  );
}
