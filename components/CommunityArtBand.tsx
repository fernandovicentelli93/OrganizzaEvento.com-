import Link from "next/link";
import type { DisplayMode } from "@prisma/client";
import { dailyConversationViews } from "@/lib/engagement";
import { formatDate, publicName } from "@/lib/format";

type CommunityQuestion = {
  title: string;
  slug: string;
  postType: string;
  eventType?: string | null;
  usefulVotes: number;
  answersCount: number;
  createdAt: Date;
  displayMode: DisplayMode;
  displayName?: string | null;
  category: {
    name: string;
    slug: string;
  };
};

type CommunityArtBandProps = {
  questions: CommunityQuestion[];
};

export function CommunityArtBand({ questions }: CommunityArtBandProps) {
  const featured = questions.slice(0, 5);

  return (
    <section className="border-y border-line bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">Domande dalla community</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Qui si parla di problemi veri, con numeri e dettagli.
          </h1>
          <p className="mt-5 text-base leading-8 text-muted">
            Una caparra che sembra alta, un DJ che costa troppo, una location bellissima ma scómoda. Parti da un caso
            simile e poi, se serve, racconta il tuo.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/fai-domanda"
              className="focus-ring inline-flex justify-center rounded-xl bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-hover"
            >
              Fai una domanda
            </Link>
            <Link
              href="/quanto-costa"
              className="focus-ring inline-flex justify-center rounded-xl border border-line bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
            >
              Quanto costa
            </Link>
          </div>
        </div>

        <div className="art-canvas relative min-h-[26rem] overflow-hidden rounded-2xl border border-line bg-cream p-5 shadow-soft">
          <div className="art-brush" aria-hidden="true" />
          <div className="art-frame" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex min-h-[17rem] max-w-md flex-col items-center justify-center px-6 py-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-cta">Prima di decidere</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink">Leggi due casi simili.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              A volte basta vedere come si è mosso qualcun altro per capire cosa chiedere a un fornitore.
            </p>
          </div>

          <div className="relative z-10 grid gap-3 sm:grid-cols-2">
            {featured.map((question, index) => (
              <Link
                key={question.slug}
                href={`/domande/${question.slug}`}
                className={`focus-ring art-thread block rounded-xl border border-line bg-white/95 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft ${
                  index === 1 || index === 3 ? "sm:translate-y-4" : ""
                }`}
              >
                <p className="line-clamp-2 text-sm font-semibold leading-5 text-ink">{question.title}</p>
                <p className="mt-1 text-xs font-medium text-muted">
                  {publicName(question.displayMode, question.displayName)} - {formatDate(question.createdAt)}
                </p>
                <p className="mt-2 text-xs font-semibold text-violet-cta">
                  {question.answersCount} risposte - {dailyConversationViews(question.slug, question.createdAt)} viste oggi
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
