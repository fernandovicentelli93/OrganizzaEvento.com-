import { getLocalSeoSitemapEntries, urlSetXml, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

export function GET() {
  return xmlResponse(urlSetXml(getLocalSeoSitemapEntries("sitemap-service-audio-luci.xml")));
}
