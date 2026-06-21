import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { QuestionCard } from "@/components/QuestionCard";
import { SupplierFinderPromo } from "@/components/SupplierFinderPromo";
import { selfAlternates } from "@/lib/i18n-routing";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Quanto costa organizzare un evento",
  description:
    "Domande e risposte su quanto costa organizzare eventi, location, catering, musica, fotografi, open bar, matrimoni e feste private.",
  alternates: selfAlternates("it", { type: "static", key: "realPrices" })
};

export const dynamic = "force-dynamic";
const questionCardInclude = {
  category: true,
  account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } }
} as const;
type QuestionCardRecord = Prisma.QuestionGetPayload<{ include: typeof questionCardInclude }>;

export default async function CostPage() {
  let questions: QuestionCardRecord[] = [];

  try {
    questions = await prisma.question.findMany({
      where: {
        status: "published",
        OR: [{ postType: "Quanto costa" }, { category: { slug: "quanto-costa" } }]
      },
      orderBy: [{ usefulVotes: "desc" }, { createdAt: "desc" }],
      include: questionCardInclude
    });
  } catch {
    questions = [];
  }

  return (
    <div>
      <section className="border-y border-line bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Quanto costa</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Quanto costa</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
              Qui leggi domande e risposte sui costi di eventi, location, catering, musica, fotografi, open bar,
              matrimoni, compleanni, feste private ed eventi aziendali. Non è una pagina a pagamento: è il posto dove
              confrontare cifre, preventivi e dubbi prima di confermare.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={{ pathname: "/fai-domanda", query: { tipo: "Quanto costa", categoria: "quanto-costa" } }}
                className="focus-ring inline-flex justify-center rounded-full bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-hover"
              >
                Chiedi un prezzo alla community
              </Link>
              <Link
                href={{ pathname: "/fai-domanda", query: { tipo: "Preventivo", categoria: "quanto-costa" } }}
                className="focus-ring inline-flex justify-center rounded-full border border-line bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Confronta un preventivo
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[0.75fr_1fr]">
            <img
              src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=820&q=76"
              alt="Catering curato per evento"
              fetchPriority="high"
              decoding="async"
              className="h-72 w-full rounded-[1.6rem] object-cover shadow-soft sm:translate-y-8"
            />
            <div className="space-y-3">
              <img
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=760&q=76"
                alt="Tavola evento elegante"
                loading="lazy"
                decoding="async"
                className="h-40 w-full rounded-[1.35rem] object-cover shadow-sm"
              />
              <div className="rounded-[1.35rem] border border-line bg-cream p-5">
                <strong className="block text-3xl text-ink">{questions.length}</strong>
                <span className="text-sm font-medium text-muted">chat su prezzi e preventivi da leggere ora</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <SupplierFinderPromo placement="real_prices_before_threads" variant="wide" className="mb-7" />
        <div className="grid gap-5">
          <div className="space-y-4">
            {questions.length ? (
              questions.map((question) => <QuestionCard key={question.id} question={question} />)
            ) : (
              <EmptyState
                title="Ancora nessuna discussione sui costi"
                description="Pubblica una domanda con budget, città e numero persone per ricevere risposte più precise."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
