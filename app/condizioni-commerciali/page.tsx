import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Condizioni commerciali e assenza di vendita online",
  description: "Condizioni commerciali di OrganizzaEvento.com e chiarimento sull'assenza di vendita online diretta."
};

export default function CommercialConditionsPage() {
  return (
    <LegalDocumentPage
      eyebrow="Condizioni commerciali"
      title="Condizioni commerciali e assenza di vendita online"
      description="Disciplina attuale di richieste fornitori, preventivi e rapporti esterni in assenza di acquisti o pagamenti tramite il sito."
      textFile="commercial-conditions.txt"
      pdfHref="/legal/organizzaevento-condizioni-commerciali-assenza-vendita.pdf"
    />
  );
}
