import { getMainSitemapEntries, urlSetXml, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

export function GET() {
  return xmlResponse(urlSetXml(getMainSitemapEntries()));
}
