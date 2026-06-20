import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteAnalysisSeoPage } from "@/components/QuoteAnalysisSeoPage";
import { getAllQuoteAnalysisPages, quoteAnalysisAlternates, resolveQuoteAnalysisRoute } from "@/content/quote-analysis";

type PageProps = {
  params: Promise<{ segments: string[] }>;
};

export function generateStaticParams() {
  return getAllQuoteAnalysisPages("it")
    .filter((page) => page.pageType !== "hub")
    .map((page) => ({
      segments: page.url
        .replace("https://organizzaevento.com/analizza-preventivo/", "")
        .split("/")
        .filter(Boolean)
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segments } = await params;
  const page = resolveQuoteAnalysisRoute("it", segments);
  if (!page) return {};

  return {
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
}

export default async function ItalianQuoteAnalysisPage({ params }: PageProps) {
  const { segments } = await params;
  const page = resolveQuoteAnalysisRoute("it", segments);
  if (!page) notFound();
  return <QuoteAnalysisSeoPage page={page} locale="it" />;
}
