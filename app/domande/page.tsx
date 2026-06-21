import type { Metadata } from "next";
import { CommunityArtBand } from "@/components/CommunityArtBand";
import { ConversationEntryGrid } from "@/components/ConversationEntryGrid";
import { EmptyState } from "@/components/EmptyState";
import { QuestionCard } from "@/components/QuestionCard";
import { SearchBar } from "@/components/SearchBar";
import { SupplierFinderPromo } from "@/components/SupplierFinderPromo";
import { UsefulAnswersStrip } from "@/components/UsefulAnswersStrip";
import { selfAlternates } from "@/lib/i18n-routing";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Domande",
  description: "Domande vere su eventi, costi, location, catering, musica e fornitori.",
  alternates: selfAlternates("it", { type: "static", key: "questions" })
};

export const dynamic = "force-dynamic";
const questionCardInclude = {
  account: { select: { role: true, profileTag: true, supplierCategory: true, businessName: true } }
} as const;

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    postType?: string;
    eventPhase?: string;
  }>;
};

export default async function QuestionsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const q = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const postType = params.postType?.trim() ?? "";
  const eventPhase = params.eventPhase?.trim() ?? "";

  const [categories, usefulAnswers] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }).catch(() => []),
    prisma.answer.findMany({
      where: { status: "published" },
      orderBy: [{ usefulVotes: "desc" }, { createdAt: "desc" }],
      take: 3,
      include: { question: { select: { title: true, slug: true } } }
    }).catch(() => [])
  ]);
  const selectedCategory = category
    ? categories.find((item) => item.slug === category)
    : null;

  const questions = await prisma.question.findMany({
    where: {
      status: "published",
      ...(selectedCategory ? { categoryId: selectedCategory.id } : {}),
      ...(postType ? { postType } : {}),
      ...(eventPhase ? { eventPhase } : {}),
      ...(q
        ? {
            OR: [{ title: { contains: q } }, { content: { contains: q } }]
          }
        : {})
    },
    orderBy: { createdAt: "desc" },
    include: questionCardInclude
  }).catch(() => []);
  const questionsByCategory = new Map<string, { name: string; slug: string }>(
    categories.map((category) => [category.id, { name: category.name, slug: category.slug }])
  );
  const questionsWithCategory = questions.map((question) => ({
    ...question,
    category: questionsByCategory.get(question.categoryId) ?? null
  }));
  const questionsForArtBand = questionsWithCategory.map((question) => ({
    ...question,
    category: question.category ?? { name: "Conversazione", slug: "domande" }
  }));

  return (
    <div>
      <CommunityArtBand questions={questionsForArtBand} />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Domande aperte</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Cerca un caso simile prima di scrivere.</h2>
          <p className="mt-3 text-base leading-7 text-muted">
            Qui trovi preventivi da capire, fornitori da valutare, idee da sistemare e problemi dell'ultimo minuto.
            Se non trovi il tuo caso, apri una domanda nuova.
          </p>
        </div>
        <div className="mt-7">
          <ConversationEntryGrid compact />
        </div>
        <div className="mt-8">
          <SearchBar categories={categories} q={q} category={category} postType={postType} eventPhase={eventPhase} />
        </div>
        <div className="mt-6">
          <SupplierFinderPromo placement="questions_after_search" variant="wide" />
        </div>
        <div className="mt-7">
          <UsefulAnswersStrip answers={usefulAnswers} />
        </div>
        <div className="mt-7 grid gap-5">
          <div className="space-y-4">
            {questions.length ? (
              questionsWithCategory.map((question) => <QuestionCard key={question.id} question={question} />)
            ) : (
              <EmptyState
                title="Nessuna domanda trovata"
                description="Prova con meno parole o scrivi tu la domanda: magari serve anche ad altri."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
