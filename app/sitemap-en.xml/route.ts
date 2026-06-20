import { getLanguageSitemapEntries } from "@/lib/i18n-sitemap";
import { urlSetXml, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

export async function GET() {
  return xmlResponse(urlSetXml(await getLanguageSitemapEntries("en")));
}
