import { CATEGORIES, SITE_CLAIM, SITE_NAME } from "@/lib/constants";
import { getFeaturedLocalSeoPages, localSeoCategories, localSeoSitemapFiles } from "@/content/local-seo";
import { EDITORIAL_CATEGORIES } from "@/lib/editorial";
import { MAGAZINE_AREAS } from "@/lib/magazine";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";

export const dynamic = "force-dynamic";

function link(label: string, href: string) {
  return `[${label}](${href})`;
}

export function GET() {
  const featuredLocalPages = getFeaturedLocalSeoPages().slice(0, 10);
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_CLAIM}`,
    "",
    "OrganizzaEvento.com è una community italiana dedicata all'organizzazione di eventi. Le persone possono leggere conversazioni, fare domande senza registrazione obbligatoria, capire quanto costa un evento, chiedere aiuto su preventivi e trovare spunti pratici per matrimoni, feste private, compleanni, lauree, cene aziendali, team building e fornitori.",
    "",
    "## Pagine principali",
    `- ${link("Home", `${siteUrl}/`)}: panoramica community, ricerca, conversazioni e percorsi principali.`,
    `- ${link("Domande della community", `${siteUrl}/domande`)}: conversazioni pubbliche su eventi, fornitori, preventivi e problemi pratici.`,
    `- ${link("Fai una domanda", `${siteUrl}/fai-domanda`)}: form pubblico per aprire una nuova conversazione senza registrazione obbligatoria.`,
    `- ${link("Quanto costa", `${siteUrl}/quanto-costa`)}: discussioni orientate a budget, prezzi reali e voci da controllare.`,
    `- ${link("Analizza il mio preventivo", `${siteUrl}/analizza-preventivo`)}: strumento per leggere e anonimizzare preventivi evento.`,
    `- ${link("Trova fornitori", `${siteUrl}/trova-fornitori`)}: ricerca e richiesta di fornitori per eventi in Italia.`,
    `- ${link("Fornitori locali per eventi", `${siteUrl}/fornitori-eventi`)}: hub SEO per categorie di fornitori e territori.`,
    `- ${link("Area fornitori", `${siteUrl}/fornitori`)}: pagina dedicata ai professionisti del settore eventi.`,
    `- ${link("Magazine editoriale", `${siteUrl}/magazine`)}: articoli e approfondimenti editoriali.`,
    `- ${link("Guide eventi", `${siteUrl}/guide-eventi`)}: guide regionali e locali per organizzare eventi.`,
    `- ${link("FAQ", `${siteUrl}/faq`)}: risposte alle domande frequenti sulla piattaforma.`,
    `- ${link("Regole community", `${siteUrl}/regole`)}: regole pubbliche di moderazione e comportamento.`,
    "",
    "## Aree evento",
    ...MAGAZINE_AREAS.map((area) => `- ${link(area.name, `${siteUrl}/categorie/${area.slug}`)}: ${area.description}`),
    "",
    "## Categorie conversazioni",
    ...CATEGORIES.map((category) => `- ${link(category.name, `${siteUrl}/categorie/${category.slug}`)}: ${category.description}`),
    "",
    "## Magazine",
    ...EDITORIAL_CATEGORIES.map((category) => `- ${link(category.name, `${siteUrl}/magazine/categorie/${category.slug}`)}: ${category.description}`),
    "",
    "## Fornitori locali e guide territoriali",
    "Le pagine locali non sono schede fornitore e non contengono recensioni inventate. Sono guide pratiche per capire cosa chiedere a location, catering, musica, fotografi, event planner, allestitori e altri servizi in base alla zona.",
    `- ${link("Area fornitori", `${siteUrl}/fornitori`)}: pagina per professionisti del settore eventi con badge, scheda profilo, regole di risposta e collaborazione delicata con Vibes Planner.`,
    ...localSeoCategories.map((category) => `- ${link(category.name, `${siteUrl}/${category.sitemap}`)}: sitemap verticale della categoria.`),
    "",
    "## Esempi di pagine locali prioritarie",
    ...featuredLocalPages.map((page) => `- ${link(page.title, `${siteUrl}/${page.slug}`)}: ${page.metaDescription}`),
    "",
    "## Policy editoriali",
    "- Contenuti in italiano sulla root e versioni dedicate in inglese, spagnolo e francese.",
    "- Nessuna registrazione obbligatoria per leggere o fare domande.",
    "- Email private non pubblicate.",
    "- Moderazione restrittiva su spam, insulti, bestemmie, dati personali di terzi, accuse non dimostrate e politica.",
    "- Le risposte devono essere pratiche: costi, voci da controllare, domande da fare, esperienze reali.",
    "",
    "## Sitemap",
    `- ${link("Sitemap principale", `${siteUrl}/sitemap.xml`)}`,
    `- ${link("Sitemap italiana", `${siteUrl}/sitemap-it.xml`)}`,
    `- ${link("Sitemap inglese", `${siteUrl}/sitemap-en.xml`)}`,
    `- ${link("Sitemap spagnola", `${siteUrl}/sitemap-es.xml`)}`,
    `- ${link("Sitemap francese", `${siteUrl}/sitemap-fr.xml`)}`,
    `- ${link("Sitemap analisi preventivo", `${siteUrl}/sitemaps/analizza-preventivo/sitemap-index.xml`)}`,
    ...localSeoSitemapFiles.map((file) => `- ${link(file, `${siteUrl}/${file}`)}`)
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  });
}
