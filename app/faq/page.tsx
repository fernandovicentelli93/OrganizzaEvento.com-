import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import { SITE_FAQS } from "@/lib/faq";
import { selfAlternates } from "@/lib/i18n-routing";
import { faqMainEntity } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Domande frequenti su OrganizzaEvento.com: conversazioni, richieste fornitori, anonimato, magazine e regole community.",
  alternates: selfAlternates("it", { type: "static", key: "faq" })
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://organizzaevento.com/faq#faq",
    mainEntity: faqMainEntity(SITE_FAQS, "https://organizzaevento.com/faq")
  };

  return (
    <div className="bg-[#fffaf6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Aiuto rapido</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          FAQ OrganizzaEvento.com
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          Una pagina semplice per capire come usare community, magazine e richieste private senza confusione.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/fai-domanda"
            className="focus-ring inline-flex justify-center rounded-full bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white"
          >
            Fai una domanda
          </Link>
          <VibesSupplierCta className="rounded-full px-5 py-2.5 shadow-none" logoClassName="h-6 w-6">
            Richiedi fornitori
          </VibesSupplierCta>
        </div>
      </section>
      <FaqSection
        title="Risposte essenziali"
        description="Se hai un caso concreto, la cosa migliore resta aprire una conversazione con dettagli chiari."
      />
    </div>
  );
}
