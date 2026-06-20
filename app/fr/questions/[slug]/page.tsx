import type { Metadata } from "next";
import LocalizedCatchAllPage, { generateMetadata as generateLocalizedMetadata } from "@/lib/localized-page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateLocalizedMetadata({ params: Promise.resolve({ locale: "fr", path: ["questions", safeDecode(slug)] }) });
}

export default async function FrenchLocalizedConversationPage({ params }: PageProps) {
  const { slug = "" } = await params;
  const path = ["questions", safeDecode(slug)];
  return LocalizedCatchAllPage({ params: Promise.resolve({ locale: "fr", path }) });
}
