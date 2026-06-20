import type { Metadata } from "next";
import { AskQuestionForm } from "@/components/AskQuestionForm";
import { createCaptchaChallenge } from "@/lib/captcha";
import { CATEGORIES } from "@/lib/constants";
import { isLocale, type Locale } from "@/lib/i18n-basic";
import { selfAlternates } from "@/lib/i18n-routing";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Fai una domanda alla community",
  description: "Pubblica una domanda su eventi, location, catering, musica, fornitori e costi senza mostrare il tuo nome.",
  alternates: selfAlternates("it", { type: "static", key: "ask" })
};

export const dynamic = "force-dynamic";

const fallbackCategories = CATEGORIES.map((category, index) => ({
  id: `fallback-${index + 1}`,
  name: category.name,
  slug: category.slug
}));

type PageProps = {
  searchParams?: Promise<{
    categoria?: string;
    tipo?: string;
    titolo?: string;
    da?: string;
    locale?: string;
    errore?: string;
    detail?: string;
    check?: string;
  }>;
};

const askPageCopy: Record<
  Locale,
  {
    kicker: string;
    title: string;
    quoteTitle: string;
    intro: string;
    quoteIntro: string;
  }
> = {
  it: {
    kicker: "Una cosa alla volta",
    title: "Fai una domanda alla community",
    quoteTitle: "Completa la conversazione sul tuo preventivo",
    intro: "Scrivi il dubbio principale. Se serve, aggiungi città, budget e numero persone: il resto lo sistemiamo noi.",
    quoteIntro:
      "Abbiamo già preparato titolo, categoria e testo di partenza. Controlla i dettagli, accetta le regole e pubblica: subito dopo ti portiamo nella pagina della tua conversazione."
  },
  en: {
    kicker: "One thing at a time",
    title: "Ask the community",
    quoteTitle: "Complete the conversation about your quote",
    intro: "Write the main doubt. Add city, budget and guest count if useful: we help structure the rest.",
    quoteIntro:
      "The title, category and draft text are already prepared. Check the details, accept the rules and publish: after that we take you to your conversation."
  },
  es: {
    kicker: "Una cosa a la vez",
    title: "Pregunta a la comunidad",
    quoteTitle: "Completa la conversación sobre tu presupuesto",
    intro: "Escribe la duda principal. Si sirve, añade ciudad, presupuesto e invitados: te ayudamos a ordenar el resto.",
    quoteIntro:
      "Ya hemos preparado título, categoría y texto inicial. Revisa los detalles, acepta las reglas y publica: después te llevamos a tu conversación."
  },
  fr: {
    kicker: "Une chose a la fois",
    title: "Posez une question ? la communauté",
    quoteTitle: "Completez la discussion sur votre devis",
    intro: "Écrivez le doute principal. Ajoutez ville, budget et nombre d'invités si utile : nous aidons à structurer le reste.",
    quoteIntro:
      "Le titre, la categorie et le texte de départ sont déjà prepares. Vérifiez les détails, acceptez les règles et publiéz : ensuite vous arrivez sur votre discussion."
  }
};

export default async function AskQuestionPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const locale = isLocale(params.locale) ? params.locale : "it";
  const copy = askPageCopy[locale];
  const errorCode = params.errore || "";
  const rawDetail = params.detail ?? "";
  const detail = (() => {
    if (!rawDetail) return "";
    try {
      return decodeURIComponent(rawDetail);
    } catch {
      return rawDetail;
    }
  })();
  const captcha = createCaptchaChallenge();
  const startedAt = Date.now();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } }).catch(() => fallbackCategories);
  const errorMessages: Record<string, string> = {
    campi: "Compila i campi obbligatori e accetta le regole della community.",
    categoria: "Abbiamo un problema con la categoria selezionata. Riprova tra qualche minuto.",
    captcha: "Il controllo anti-spam non e' andato a buon fine. Aggiorna la pagina e riprova.",
    spazio: "Sei intervenuto troppo presto dopo l'ultimo invio. Aspetta qualche secondo.",
    nickname: "Questo nome e' riservato. Usa un nickname differente.",
    server: "C'e stato un problema temporaneo. Riprova tra qualche istante."
  };
  const feedback = errorCode ? errorMessages[errorCode] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-7 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{copy.kicker}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">
          {params.da === "preventivo" ? copy.quoteTitle : copy.title}
        </h1>
        <p className="mt-3 text-base leading-7 text-muted">
          {params.da === "preventivo" ? copy.quoteIntro : copy.intro}
        </p>
      </div>
      {feedback ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
          <p className="font-semibold">La domanda non e' stata pubblicata.</p>
          <p className="mt-1">{feedback}</p>
          {detail ? <p className="mt-2 text-xs text-red-700">{detail}</p> : null}
        </div>
      ) : null}
      <AskQuestionForm
        categories={categories}
        defaultCategorySlug={params.categoria}
        defaultPostType={params.tipo}
        defaultTitle={params.titolo}
        locale={locale}
        captcha={captcha}
        startedAt={startedAt}
      />
    </div>
  );
}
