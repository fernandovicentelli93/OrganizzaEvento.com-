import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/LegalDocumentPage";
import { selfAlternates } from "@/lib/i18n-routing";

export const metadata: Metadata = {
  title: "Regole della community",
  description: "Regole della community OrganizzaEvento.com.",
  alternates: selfAlternates("it", { type: "static", key: "rules" })
};

export default function RulesPage() {
  return (
    <LegalDocumentPage
      eyebrow="Community"
      title="Regole della community"
      description="Regole pratiche per domande, risposte, preventivi, fornitori, moderazione e segnalazioni."
      textFile="community-rules.txt"
      pdfHref="/legal/organizzaevento-regole-community.pdf"
    />
  );
}
