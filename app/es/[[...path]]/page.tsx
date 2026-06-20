import type { Metadata } from "next";
import LocalizedCatchAllPage, { generateMetadata as generateLocalizedMetadata } from "@/lib/localized-page";

type PageProps = {
  params: Promise<{ path?: string[] }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { path = [] } = await params;
  return generateLocalizedMetadata({ params: Promise.resolve({ locale: "es", path }) });
}

export default async function SpanishCatchAllPage({ params }: PageProps) {
  const { path = [] } = await params;
  return LocalizedCatchAllPage({ params: Promise.resolve({ locale: "es", path }) });
}
