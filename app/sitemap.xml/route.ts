import { sitemapIndexXml, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

export function GET() {
  return xmlResponse(sitemapIndexXml(["sitemap-it.xml", "sitemap-en.xml", "sitemap-es.xml", "sitemap-fr.xml"]));
}
