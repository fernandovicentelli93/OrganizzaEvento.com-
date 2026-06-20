import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy di OrganizzaEvento.com."
};

export default function CookiePolicyPage() {
  return (
    <LegalDocumentPage
      eyebrow="Cookie"
      title="Cookie Policy"
      description="Informativa su cookie, tecnologie simili, consenso, preferenze, analytics e strumenti di terze parti."
      textFile="cookie-policy.txt"
      pdfHref="/legal/organizzaevento-cookie-policy.pdf"
    />
  );
}
