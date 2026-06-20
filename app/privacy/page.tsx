import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/LegalDocumentPage";
import { selfAlternates } from "@/lib/i18n-routing";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy di OrganizzaEvento.com.",
  alternates: selfAlternates("it", { type: "static", key: "privacy" })
};

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      eyebrow="Privacy"
      title="Privacy Policy"
      description="Informativa sul trattamento dei dati personali degli utenti del sito, della community, dei form, degli account e degli strumenti di analisi preventivi."
      textFile="privacy-policy.txt"
      pdfHref="/legal/organizzaevento-privacy-policy.pdf"
    />
  );
}
