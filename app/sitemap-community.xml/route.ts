import { getCommunitySitemapEntries, urlSetXml, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

export async function GET() {
  return xmlResponse(urlSetXml(await getCommunitySitemapEntries()));
}
