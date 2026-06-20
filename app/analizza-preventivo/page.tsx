import type { Metadata } from "next";
import { QuoteAnalysisSeoPage } from "@/components/QuoteAnalysisSeoPage";
import { getQuoteAnalysisHubPage, quoteAnalysisAlternates } from "@/content/quote-analysis";

const page = getQuoteAnalysisHubPage("it");

export const metadata: Metadata = {
  title: page.title,
  description: page.metaDescription,
  alternates: quoteAnalysisAlternates(page, "it"),
  robots: {
    index: page.indexable,
    follow: true
  },
  openGraph: {
    title: page.title,
    description: page.metaDescription,
    url: page.url,
    siteName: "OrganizzaEvento.com",
    type: "website",
    locale: "it_IT"
  }
};

export default function AnalyzeQuotePage() {
  return <QuoteAnalysisSeoPage page={page} locale="it" />;
}
