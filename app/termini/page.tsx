import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/LegalDocumentPage";
import { selfAlternates } from "@/lib/i18n-routing";

export const metadata: Metadata = {
  title: "Condizioni generali d'uso",
  description: "Condizioni generali d'uso di OrganizzaEvento.com.",
  alternates: selfAlternates("it", { type: "static", key: "terms" })
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      eyebrow="Termini"
      title="Condizioni generali d'uso"
      description="Regole contrattuali per community, account, analisi preventivi, richieste fornitori e contenuti utente."
      textFile="terms.txt"
      pdfHref="/legal/organizzaevento-condizioni-generali-uso.pdf"
    />
  );
}
