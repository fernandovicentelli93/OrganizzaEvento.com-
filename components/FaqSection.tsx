import type { FaqItem } from "@/lib/faq";
import { SITE_FAQS } from "@/lib/faq";

type FaqSectionProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
  items?: FaqItem[];
};

export function FaqSection({
  title = "FAQ rapide",
  eyebrow = "Domande frequenti",
  description = "Le risposte essenziali per capire come usare forum, magazine e richieste private.",
  items = SITE_FAQS
}: FaqSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-4 text-base leading-8 text-muted">{description}</p>
        </div>
        <div className="grid gap-3">
          {items.map((item) => (
            <details key={item.question} className="group rounded-xl border border-line bg-white p-4 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-ink">
                <span>{item.question}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-petal text-violet-cta transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
