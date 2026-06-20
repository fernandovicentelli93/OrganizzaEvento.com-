"use client";

import { useEffect, useMemo, useState } from "react";
import { createQuestion } from "@/app/actions";
import { CaptchaFields } from "@/components/CaptchaFields";
import type { CaptchaChallenge } from "@/lib/captcha";
import { DISPLAY_MODES, EVENT_PHASES, EVENT_TYPES, POST_TYPES, categoryPublicName, postTypePublicLabel } from "@/lib/constants";
import type { Locale } from "@/lib/i18n-basic";

type CategoryOption = { id: string; name: string; slug: string };

type AskQuestionFormProps = {
  categories: CategoryOption[];
  defaultCategorySlug?: string;
  defaultPostType?: string;
  defaultTitle?: string;
  locale: Locale;
  captcha: CaptchaChallenge;
  startedAt: number;
};

type QuestionFormatKey = "proposal" | "choice" | "problem" | "start";

type GuidedQuestionFields = {
  event: string;
  proposal: string;
  doubt: string;
  ask: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectRecommendation(text: string) {
  const value = normalize(text);

  if (/(caparra|fornitor|ritard|non rispond|sparit|disdett|saldo)/.test(value)) {
    return {
      categorySlug: "problemi-fornitori",
      postType: "Problema",
      eventPhase: "problema-urgente",
      reason: "Da quello che hai scritto sembra un problema con un fornitore o con un accordo."
    };
  }

  if (/(budget|preventiv|quanto costa|prezz|costo|troppo alto|spendere)/.test(value)) {
    return {
      categorySlug: "quanto-costa",
      postType: value.includes("preventiv") ? "Preventivo" : "Quanto costa",
      eventPhase: "scelta-fornitori",
      reason: "Sembra una domanda su prezzo, preventivo o budget."
    };
  }

  if (/(location|villa|ristorante|sala|agriturismo|hotel|spazio)/.test(value)) {
    return {
      categorySlug: "location",
      postType: "Domanda",
      eventPhase: "scelta-fornitori",
      reason: "Sembra una scelta legata alla location."
    };
  }

  if (/(dj|musica|band|siae|playlist|intrattenimento)/.test(value)) {
    return {
      categorySlug: "musica-dj",
      postType: "Domanda",
      eventPhase: "scelta-fornitori",
      reason: "Sembra una domanda su musica, DJ o intrattenimento."
    };
  }

  if (/(inizio|partire|zero|prima volta|organizzare)/.test(value)) {
    return {
      categorySlug: "da-dove-inizio",
      postType: "Domanda",
      eventPhase: "sto-iniziando",
      reason: "Sembra una domanda da fase iniziale."
    };
  }

  return {
    categorySlug: "idee-evento",
    postType: "Idea",
    eventPhase: "sto-iniziando",
    reason: "Sembra un'idea da mettere a fuoco."
  };
}

const formCopy: Record<
  Locale,
  {
    introTitle: string;
    introText: string;
    titleLabel: string;
    titlePlaceholder: string;
    formatTitle: string;
    formatText: string;
    formatPreview: string;
    insertFormat: string;
    eventLabel: string;
    eventPlaceholder: string;
    proposalLabel: string;
    proposalPlaceholder: string;
    doubtLabel: string;
    doubtPlaceholder: string;
    askLabel: string;
    askPlaceholder: string;
    contentLabel: string;
    contentPlaceholder: string;
    formats: Record<
      QuestionFormatKey,
      {
        label: string;
        helper: string;
        build: (fields: GuidedQuestionFields) => string;
      }
    >;
  }
> = {
  it: {
    introTitle: "Scrivi una domanda vera, non un testo perfetto.",
    introText:
      "Racconta cosa stai organizzando, cosa hai ricevuto o cosa ti blocca, poi chiudi con una domanda chiara alla community.",
    titleLabel: "Titolo domanda *",
    titlePlaceholder: "Es. Preventivo DJ per 80 persone: secondo voi manca qualcosa",
    formatTitle: "Format guidato",
    formatText: "Compila queste righe se vuoi creare una domanda più umana e ordinata. Dopo puoi modificare tutto.",
    formatPreview: "Anteprima domanda",
    insertFormat: "Usa questo testo",
    eventLabel: "Cosa stai organizzando",
    eventPlaceholder: "Es. un diciottesimo a Milano per circa 80 persone",
    proposalLabel: "Cosa hai ricevuto o cosa stai valutando",
    proposalPlaceholder: "Es. una proposta con DJ, impianto audio e luci per 1.200 euro",
    doubtLabel: "Cosa non ti torna",
    doubtPlaceholder: "Es. non capisco se trasporto, SIAE e ore extra sono inclusi",
    askLabel: "Che risposta vuoi dalla community",
    askPlaceholder: "Es. secondo voi è normale o devo chiedere altri dettagli",
    contentLabel: "Contenuto *",
    contentPlaceholder:
      "Esempio: Ciao, sto organizzando un compleanno a Milano per 60 persone. Ho ricevuto una proposta e non capisco se gli extra sono normali. Secondo voi cosa dovrei chiedere prima di confermare",
    formats: {
      proposal: {
        label: "Ho ricevuto una proposta",
        helper: "Preventivo, pacchetto, menù, location, DJ o servizio da capire.",
        build: (fields) =>
          `Ciao, sto organizzando ${fields.event || "un evento e sto ancora mettendo insieme i dettagli principali"}.\n\nHo ricevuto questa proposta: ${fields.proposal || "non ho ancora chiaro se tutto quello che mi hanno indicato sia davvero incluso"}.\n\nIl punto che non mi torna è questo: ${fields.doubt || "vorrei capire se ci sono extra o condizioni che rischio di sottovalutare"}.\n\nSecondo voi ${fields.ask || "cosa dovrei chiedere prima di confermare"}`
      },
      choice: {
        label: "Sto scegliendo tra opzioni",
        helper: "Due location, due menù, due fornitori o due strade possibili.",
        build: (fields) =>
          `Ciao, sto organizzando ${fields.event || "un evento e sto confrontando alcune opzioni"}.\n\nAl momento sto valutando: ${fields.proposal || "due soluzioni che sulla carta sembrano simili, ma non riesco a capire quale sia più adatta"}.\n\nIl dubbio è questo: ${fields.doubt || "temo di scegliere guardando solo il prezzo e non quello che succede davvero il giorno dell'evento"}.\n\nSecondo voi ${fields.ask || "quali dettagli dovrei confrontare prima di decidere"}`
      },
      problem: {
        label: "Ho un problema pratico",
        helper: "Caparra, risposta lenta, extra improvvisi, tempi o organizzazione.",
        build: (fields) =>
          `Ciao, sto organizzando ${fields.event || "un evento e mi sono bloccato su un problema pratico"}.\n\nLa situazione è questa: ${fields.proposal || "ho ricevuto una comunicazione o una richiesta che non so bene come gestire"}.\n\nQuello che mi preoccupa è: ${fields.doubt || "non vorrei muovermi male o accettare qualcosa senza aver capito bene le conseguenze"}.\n\nSecondo voi ${fields.ask || "come mi conviene rispondere e quali punti devo chiarire subito"}`
      },
      start: {
        label: "Non so da dove partire",
        helper: "Quando l'evento è ancora confuso e serve un primo ordine.",
        build: (fields) =>
          `Ciao, vorrei organizzare ${fields.event || "un evento, ma sono ancora nella fase iniziale"}.\n\nPer ora so questo: ${fields.proposal || "ho qualche idea, ma non so bene quali decisioni prendere per prime"}.\n\nIl mio dubbio principale è: ${fields.doubt || "non vorrei partire dai fornitori sbagliati o dimenticare costi importanti"}.\n\nSecondo voi ${fields.ask || "qual è il primo passo concreto da fare"}`
      }
    }
  },
  en: {
    introTitle: "Write a real question, not a perfect text.",
    introText:
      "Explain what you are planning in Italy, what you received or what is blocking you, then end with one clear question for the community.",
    titleLabel: "Question title *",
    titlePlaceholder: "E.g. DJ quote for 80 guests in Italy: does anything seem missing",
    formatTitle: "Guided question format",
    formatText: "Fill these short lines to create a more human, structured question. You can edit everything after.",
    formatPreview: "Question preview",
    insertFormat: "Use this text",
    eventLabel: "What are you planning",
    eventPlaceholder: "E.g. a birthday dinner in Milan for about 80 guests",
    proposalLabel: "What did you receive or what are you comparing",
    proposalPlaceholder: "E.g. a DJ, sound and lights proposal around 1,200 euro",
    doubtLabel: "What feels unclear",
    doubtPlaceholder: "E.g. I do not know if travel, permits and extra hours are included",
    askLabel: "What do you want the community to answer",
    askPlaceholder: "E.g. does this sound normal or should I ask for more details",
    contentLabel: "Question text *",
    contentPlaceholder:
      "Example: Hi, I am planning a private event in Italy for about 60 guests. I received a proposal and I am not sure if the extras are normal. What should I ask before confirming",
    formats: {
      proposal: {
        label: "I received a proposal",
        helper: "Quote, package, venue, menu, DJ or service you need to understand.",
        build: (fields) =>
          `Hi, I am planning ${fields.event || "an event in Italy and I am still putting the main details together"}.\n\nI received this proposal: ${fields.proposal || "I am not sure whether everything listed is actually included"}.\n\nThe part I do not understand is: ${fields.doubt || "I want to know if there are extras or conditions I might be missing"}.\n\nIn your opinion, ${fields.ask || "what should I ask before confirming"}`
      },
      choice: {
        label: "I am choosing between options",
        helper: "Two venues, menus, suppliers or practical directions.",
        build: (fields) =>
          `Hi, I am planning ${fields.event || "an event in Italy and I am comparing a few options"}.\n\nRight now I am considering: ${fields.proposal || "two solutions that look similar on paper, but I cannot tell which one is safer"}.\n\nMy doubt is: ${fields.doubt || "I am afraid of choosing only by price and missing what matters on the event day"}.\n\nIn your opinion, ${fields.ask || "what details should I compare before deciding"}`
      },
      problem: {
        label: "I have a practical issue",
        helper: "Deposit, late replies, unexpected extras, timing or organization.",
        build: (fields) =>
          `Hi, I am planning ${fields.event || "an event in Italy and I am stuck on a practical issue"}.\n\nThis is the situation: ${fields.proposal || "I received a request or message that I do not know how to handle"}.\n\nWhat worries me is: ${fields.doubt || "I do not want to accept something before understanding the consequences"}.\n\nIn your opinion, ${fields.ask || "how should I reply and what should I clarify first"}`
      },
      start: {
        label: "I do not know where to start",
        helper: "When the event is still unclear and you need first steps.",
        build: (fields) =>
          `Hi, I would like to organize ${fields.event || "an event in Italy, but I am still at the beginning"}.\n\nSo far I know this: ${fields.proposal || "I have a few ideas, but I do not know which decisions should come first"}.\n\nMy main doubt is: ${fields.doubt || "I do not want to start with the wrong suppliers or forget important costs"}.\n\nIn your opinion, ${fields.ask || "what is the first practical step I should take"}`
      }
    }
  },
  es: {
    introTitle: "Escribe una pregunta real, no un texto perfecto.",
    introText:
      "Cuenta qué estás organizando en Italia, qué propuesta recibiste o qué te bloquea, y termina con una pregunta clara para la comunidad.",
    titleLabel: "Título de la pregunta *",
    titlePlaceholder: "Ej. Presupuesto de DJ para 80 invitados: falta algo",
    formatTitle: "Formato guiado",
    formatText: "Completa estas líneas para crear una pregunta más humana y ordenada. Después puedes editar todo.",
    formatPreview: "Vista previa",
    insertFormat: "Usar este texto",
    eventLabel: "Qué estás organizando",
    eventPlaceholder: "Ej. una cena de cumpleaños en Milan para unas 80 personas",
    proposalLabel: "Qué recibiste o qué estás valorando",
    proposalPlaceholder: "Ej. una propuesta con DJ, sonido y luces por 1.200 euro",
    doubtLabel: "Qué no te queda claro",
    doubtPlaceholder: "Ej. no sé si transporte, permisos y horas extra están incluidos",
    askLabel: "Qué quieres preguntar a la comunidad",
    askPlaceholder: "Ej. les parece normal o debería pedir más detalles",
    contentLabel: "Texto de la pregunta *",
    contentPlaceholder:
      "Ejemplo: Hola, estoy organizando un evento en Italia para unas 60 personas. Recibí una propuesta y no sé si los extras son normales. Qué debería preguntar antes de confirmar",
    formats: {
      proposal: {
        label: "Recibí una propuesta",
        helper: "Presupuesto, paquete, lugar, menú, DJ o servicio que quieres entender.",
        build: (fields) =>
          `Hola, estoy organizando ${fields.event || "un evento en Italia y todavía estoy ordenando los detalles principales"}.\n\nRecibí esta propuesta: ${fields.proposal || "no tengo claro si todo lo indicado está realmente incluido"}.\n\nLo que no me queda claro es: ${fields.doubt || "quiero entender si hay extras o condiciones que puedo estar pasando por alto"}.\n\nSegún vuestra experiencia, ${fields.ask || "qué debería preguntar antes de confirmar"}`
      },
      choice: {
        label: "Estoy eligiendo entre opciones",
        helper: "Dos lugares, menús, proveedores o caminos posibles.",
        build: (fields) =>
          `Hola, estoy organizando ${fields.event || "un evento en Italia y estoy comparando algunas opciones"}.\n\nAhora estoy valorando: ${fields.proposal || "dos soluciones que parecen parecidas, pero no sé cuál es más conveniente"}.\n\nMi duda es: ${fields.doubt || "me preocupa elegir solo por precio y olvidar detalles importantes del día del evento"}.\n\nSegún vuestra experiencia, ${fields.ask || "qué detalles debería comparar antes de decidir"}`
      },
      problem: {
        label: "Tengo un problema práctico",
        helper: "Reserva, respuestas lentas, extras inesperados, tiempos u organización.",
        build: (fields) =>
          `Hola, estoy organizando ${fields.event || "un evento en Italia y me he bloqueado con un problema práctico"}.\n\nLa situación es esta: ${fields.proposal || "recibí una solicitud o mensaje que no sé cómo gestionar"}.\n\nLo que me preocupa es: ${fields.doubt || "no quiero aceptar algo sin entender bien las consecuencias"}.\n\nSegún vuestra experiencia, ${fields.ask || "cómo debería responder y qué puntos debo aclarar primero"}`
      },
      start: {
        label: "No sé por dónde empezar",
        helper: "Cuando el evento todavía está confuso y necesitas primeros pasos.",
        build: (fields) =>
          `Hola, quiero organizar ${fields.event || "un evento en Italia, pero estoy todavía al principio"}.\n\nPor ahora sé esto: ${fields.proposal || "tengo algunas ideas, pero no sé qué decisiones tomar primero"}.\n\nMi duda principal es: ${fields.doubt || "no quiero empezar por proveedores equivocados ni olvidar costes importantes"}.\n\nSegún vuestra experiencia, ${fields.ask || "cuál es el primer paso concreto que debería dar"}`
      }
    }
  },
  fr: {
    introTitle: "Écrivez une vraie question, pas un texte parfait.",
    introText:
      "Expliquez ce que vous organisez en Italie, ce que vous avez reçu ou ce qui bloque, puis terminez par une question claire.",
    titleLabel: "Titre de la question *",
    titlePlaceholder: "Ex. Devis DJ pour 80 invités : est-ce qu'il manque quelque chose ?",
    formatTitle: "Format guidé",
    formatText: "Remplissez ces lignes pour créer une question plus humaine et structurée. Vous pourrez tout modifier ensuite.",
    formatPreview: "Aperçu de la question",
    insertFormat: "Utiliser ce texte",
    eventLabel: "Qu'organisez-vous ?",
    eventPlaceholder: "Ex. un anniversaire à Milan pour environ 80 personnes",
    proposalLabel: "Qu'avez-vous reçu ou que comparez-vous ?",
    proposalPlaceholder: "Ex. une proposition DJ, son et lumières autour de 1 200 euro",
    doubtLabel: "Qu'est-ce qui n'est pas clair ?",
    doubtPlaceholder: "Ex. je ne sais pas si transport, autorisations et heures extra sont inclus",
    askLabel: "Quelle réponse attendez-vous de la communauté ?",
    askPlaceholder: "Ex. est-ce normal ou dois-je demander plus de détails ?",
    contentLabel: "Texte de la question *",
    contentPlaceholder:
      "Exemple : Bonjour, j'organise un événement en Italie pour environ 60 personnes. J'ai reçu une proposition et je ne sais pas si les extras sont normaux. Que dois-je demander avant de confirmer ?",
    formats: {
      proposal: {
        label: "J'ai reçu une proposition",
        helper: "Devis, forfait, lieu, menu, DJ ou service à comprendre.",
        build: (fields) =>
          `Bonjour, j'organise ${fields.event || "un événement en Italie et je rassemble encore les détails principaux"}.\n\nJ'ai reçu cette proposition : ${fields.proposal || "je ne suis pas sûr que tout ce qui est indiqué soit vraiment inclus"}.\n\nCe qui n'est pas clair pour moi : ${fields.doubt || "je voudrais comprendre s'il y a des extras ou conditions que je risque de sous-estimer"}.\n\nSelon vous, ${fields.ask || "que dois-je demander avant de confirmer ?"}`
      },
      choice: {
        label: "Je compare plusieurs options",
        helper: "Deux lieux, menus, prestataires ou directions possibles.",
        build: (fields) =>
          `Bonjour, j'organise ${fields.event || "un événement en Italie et je compare plusieurs options"}.\n\nPour l'instant je regarde : ${fields.proposal || "deux solutions qui semblent proches, mais je n'arrive pas à savoir laquelle est la plus adaptée"}.\n\nMon doute est : ${fields.doubt || "j'ai peur de choisir seulement par prix et de manquer des détails importants le jour J"}.\n\nSelon vous, ${fields.ask || "quels détails dois-je comparer avant de décider ?"}`
      },
      problem: {
        label: "J'ai un problème pratique",
        helper: "Acompte, réponses lentes, extras imprévus, timing ou organisation.",
        build: (fields) =>
          `Bonjour, j'organise ${fields.event || "un événement en Italie et je suis bloqué par un problème pratique"}.\n\nLa situation est la suivante : ${fields.proposal || "j'ai reçu une demande ou un message que je ne sais pas comment gérer"}.\n\nCe qui m'inquiète : ${fields.doubt || "je ne veux pas accepter quelque chose sans comprendre les conséquences"}.\n\nSelon vous, ${fields.ask || "comment dois-je répondre et quels points dois-je clarifier en premier ?"}`
      },
      start: {
        label: "Je ne sais pas par où commencer",
        helper: "Quand l'événement est encore flou et qu'il faut un premier ordre.",
        build: (fields) =>
          `Bonjour, je voudrais organiser ${fields.event || "un événement en Italie, mais je suis encore au tout début"}.\n\nPour l'instant je sais ceci : ${fields.proposal || "j'ai quelques idées, mais je ne sais pas quelles décisions prendre en premier"}.\n\nMon doute principal est : ${fields.doubt || "je ne veux pas commencer par les mauvais prestataires ni oublier des coûts importants"}.\n\nSelon vous, ${fields.ask || "quelle est la première étape concrète à suivre ?"}`
      }
    }
  }
};

export function AskQuestionForm({
  categories,
  defaultCategorySlug,
  defaultPostType,
  defaultTitle,
  locale = "it",
  captcha,
  startedAt
}: AskQuestionFormProps) {
  const defaultCategoryId = useMemo(() => {
    const fallback = categories.find((category) => category.slug === "da-dove-inizio") ?? categories[0];
    if (!defaultCategorySlug) return fallback?.id ?? "";
    return categories.find((category) => category.slug === defaultCategorySlug)?.id ?? fallback?.id ?? "";
  }, [categories, defaultCategorySlug]);

  const safeDefaultPostType =
    defaultPostType && POST_TYPES.includes(defaultPostType as (typeof POST_TYPES)[number]) ? defaultPostType : "";

  const [title, setTitle] = useState(defaultTitle ?? "");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [postType, setPostType] = useState(safeDefaultPostType || "Domanda");
  const [eventPhase, setEventPhase] = useState("sto-iniziando");
  const [displayMode, setDisplayMode] = useState("anonymous");
  const [questionFormat, setQuestionFormat] = useState<QuestionFormatKey>("proposal");
  const [formatFields, setFormatFields] = useState<GuidedQuestionFields>({
    event: "",
    proposal: "",
    doubt: "",
    ask: ""
  });

  const copy = formCopy[locale];
  const categoryBySlug = useMemo(() => new Map(categories.map((category) => [category.slug, category])), [categories]);
  const recommendation = useMemo(() => detectRecommendation(`${title} ${content}`), [title, content]);
  const recommendedCategory = categoryBySlug.get(recommendation.categorySlug);
  const guidedQuestionText = useMemo(
    () => copy.formats[questionFormat].build(formatFields),
    [copy.formats, formatFields, questionFormat]
  );

  function updateFormatField(field: keyof GuidedQuestionFields, value: string) {
    setFormatFields((current) => ({ ...current, [field]: value }));
  }

  function applyGuidedQuestionText() {
    setContent(guidedQuestionText);
    if (questionFormat === "proposal") {
      setPostType("Preventivo");
      setEventPhase("scelta-fornitori");
    }
    if (questionFormat === "choice") {
      setPostType("Domanda");
      setEventPhase("scelta-fornitori");
    }
    if (questionFormat === "problem") {
      setPostType("Problema");
      setEventPhase("problema-urgente");
    }
    if (questionFormat === "start") {
      setPostType("Domanda");
      setEventPhase("sto-iniziando");
    }
  }

  useEffect(() => {
    const hasEnoughContext = `${title} ${content}`.trim().length >= 8;
    if (!hasEnoughContext) return;
    if (!categoryId && recommendedCategory) setCategoryId(recommendedCategory.id);
    if (!postType) setPostType(recommendation.postType);
    if (!eventPhase) setEventPhase(recommendation.eventPhase);
  }, [categoryId, content, eventPhase, postType, recommendation.eventPhase, recommendation.postType, recommendedCategory, title]);

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem("oe_quote_draft");
      if (!rawDraft) return;
      const draft = JSON.parse(rawDraft) as {
        title?: string;
        content?: string;
        categorySlug?: string;
        postType?: string;
        eventPhase?: string;
      };

      if (draft.title) setTitle(draft.title);
      if (draft.content) setContent(draft.content);
      if (draft.categorySlug) {
        const draftCategory = categoryBySlug.get(draft.categorySlug);
        if (draftCategory) setCategoryId(draftCategory.id);
      }
      if (draft.postType && POST_TYPES.includes(draft.postType as (typeof POST_TYPES)[number])) setPostType(draft.postType);
      if (draft.eventPhase) setEventPhase(draft.eventPhase);
      window.localStorage.removeItem("oe_quote_draft");
    } catch {
      window.localStorage.removeItem("oe_quote_draft");
    }
  }, [categoryBySlug]);

  return (
    <form
      action={createQuestion}
      className="min-w-0 space-y-5 overflow-hidden rounded-lg border border-line bg-white p-5 shadow-sm [&_input]:max-w-full [&_input]:min-w-0 [&_label]:min-w-0 [&_select]:max-w-full [&_select]:min-w-0 [&_textarea]:max-w-full [&_textarea]:min-w-0 sm:p-7"
    >
      <div className="rounded-lg border border-violet-cta/25 bg-petal p-4 text-sm leading-6 text-muted">
        <p className="font-semibold text-ink">{copy.introTitle}</p>
        <p className="mt-1">{copy.introText}</p>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-ink">{copy.titleLabel}</span>
        <input
          name="title"
          required
          minLength={8}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={copy.titlePlaceholder}
          className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
        />
      </label>

      {title.trim().length >= 6 ? (
        <section className="rounded-lg border border-line bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">Ti aiutiamo a inserirla nel posto giusto</p>
          <p className="mt-2 text-sm leading-6 text-muted">{recommendation.reason}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-petal px-3 py-2 text-xs font-semibold text-ink">
              {recommendedCategory ? categoryPublicName(recommendedCategory) : "Categoria pratica"}
            </span>
            <span className="rounded-lg bg-petal px-3 py-2 text-xs font-semibold text-ink">
              {postTypePublicLabel(recommendation.postType)}
            </span>
            <span className="rounded-lg bg-petal px-3 py-2 text-xs font-semibold text-ink">
              {EVENT_PHASES.find((phase) => phase.value === recommendation.eventPhase)?.label}
            </span>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-line bg-cream p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">{copy.formatTitle}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{copy.formatText}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-4">
          {(Object.keys(copy.formats) as QuestionFormatKey[]).map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => setQuestionFormat(format)}
              className={[
                "focus-ring rounded-lg border px-3 py-3 text-left text-sm transition",
                questionFormat === format
                  ? "border-violet-cta bg-white text-ink shadow-sm"
                  : "border-line bg-white/70 text-muted hover:bg-white"
              ].join(" ")}
            >
              <span className="block font-semibold">{copy.formats[format].label}</span>
              <span className="mt-1 block text-xs leading-5">{copy.formats[format].helper}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{copy.eventLabel}</span>
            <input
              value={formatFields.event}
              onChange={(event) => updateFormatField("event", event.target.value)}
              placeholder={copy.eventPlaceholder}
              className="focus-ring mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{copy.proposalLabel}</span>
            <input
              value={formatFields.proposal}
              onChange={(event) => updateFormatField("proposal", event.target.value)}
              placeholder={copy.proposalPlaceholder}
              className="focus-ring mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{copy.doubtLabel}</span>
            <input
              value={formatFields.doubt}
              onChange={(event) => updateFormatField("doubt", event.target.value)}
              placeholder={copy.doubtPlaceholder}
              className="focus-ring mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{copy.askLabel}</span>
            <input
              value={formatFields.ask}
              onChange={(event) => updateFormatField("ask", event.target.value)}
              placeholder={copy.askPlaceholder}
              className="focus-ring mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink"
            />
          </label>
        </div>

        <div className="mt-4 rounded-lg border border-line bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-cta">{copy.formatPreview}</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">{guidedQuestionText}</p>
            </div>
            <button
              type="button"
              onClick={applyGuidedQuestionText}
              className="focus-ring shrink-0 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-cta"
            >
              {copy.insertFormat}
            </button>
          </div>
        </div>
      </section>

      <label className="block">
        <span className="text-sm font-semibold text-ink">{copy.contentLabel}</span>
        <textarea
          name="content"
          required
          minLength={20}
          rows={7}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={copy.contentPlaceholder}
          className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
        />
      </label>

      <section className="rounded-lg border border-line bg-cream p-4">
        <div>
          <p className="text-sm font-semibold text-ink">Dettagli che aiutano chi risponde</p>
          <p className="mt-1 text-xs leading-5 text-muted">Non devi compilarli tutti. Metti solo quello che sai già.</p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
          <span className="text-sm font-semibold text-ink">Tipo evento</span>
          <select name="eventType" className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink">
            <option value="">Non specificato</option>
            {EVENT_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Numero persone</span>
            <input
              name="peopleCount"
              type="number"
              min="1"
              placeholder="Es. 80"
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Budget indicativo</span>
            <input
              name="budgetRange"
              placeholder="Es. 1.500-2.000 euro"
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Città</span>
            <input name="city" className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink" />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Regione</span>
            <input name="region" className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink" />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-ink">Data evento</span>
            <input
              name="eventDate"
              type="date"
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
            />
          </label>
        </div>
      </section>

      <details className="rounded-lg border border-line bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Modifica categoria e tipo di domanda</summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Categoria *</span>
            <select
              name="categoryId"
              required
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {categoryPublicName(category)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Tipo richiesta *</span>
            <select
              name="postType"
              required
              value={postType}
              onChange={(event) => setPostType(event.target.value)}
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
            >
              {POST_TYPES.map((item) => (
                <option key={item} value={item}>
                  {postTypePublicLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-ink">Fase evento</span>
            <select
              name="eventPhase"
              value={eventPhase}
              onChange={(event) => setEventPhase(event.target.value)}
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
            >
              {EVENT_PHASES.map((phase) => (
                <option key={phase.value} value={phase.value}>
                  {phase.label}
                </option>
              ))}
            </select>
            {eventPhase ? (
              <span className="mt-1 block text-xs leading-5 text-muted">
                {EVENT_PHASES.find((phase) => phase.value === eventPhase)?.helper}
              </span>
            ) : null}
          </label>
        </div>
      </details>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">Come vuoi comparire *</legend>
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          {DISPLAY_MODES.map((mode) => (
            <label key={mode.value} className="cursor-pointer rounded-2xl border border-line bg-cream p-4">
              <input
                type="radio"
                name="displayMode"
                value={mode.value}
                checked={displayMode === mode.value}
                onChange={() => setDisplayMode(mode.value)}
                className="mr-2"
              />
              <span className="font-semibold text-ink">{mode.label}</span>
              <span className="mt-1 block text-xs leading-5 text-muted">{mode.helper}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {displayMode !== "anonymous" ? (
        <label className="block">
          <span className="text-sm font-semibold text-ink">
            {displayMode === "nickname" ? "Nickname da mostrare *" : "Nome reale da mostrare *"}
          </span>
          <input
            name="displayName"
            required
            className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
          />
        </label>
      ) : null}

      <details className="rounded-lg border border-line bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Opzioni facoltative: email e foto</summary>
        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Email privata opzionale</span>
            <input
              name="privateEmail"
              type="email"
              placeholder="Non viene mostrata sul sito"
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
            />
          </label>

          <label className="block rounded-lg border border-line bg-petal p-4">
            <span className="text-sm font-semibold text-ink">Foto della conversazione opzionale</span>
            <input
              name="proposedImageUrl"
              type="url"
              placeholder="Incolla un link immagine, senza dati personali"
              className="focus-ring mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink"
            />
            <span className="mt-2 block text-xs leading-5 text-muted">
              Le immagini proposte sono sottoposte a revisione e possono richiedere fino a 24 ore prima di essere pubblicate.
              Non inserire volti, targhe, documenti o dati personali.
            </span>
          </label>
        </div>
      </details>

      <label className="flex gap-3 rounded-2xl border border-line bg-cream p-4 text-sm leading-6 text-muted">
        <input name="rulesAccepted" value="yes" type="checkbox" required className="mt-1" />
        <span>Accetto le regole e confermo di non pubblicare dati personali di altre persone.</span>
      </label>

      <CaptchaFields challenge={captcha} startedAt={startedAt} />

      <button className="focus-ring w-full rounded-xl bg-violet-cta px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-violet-hover sm:w-auto">
        Pubblica domanda
      </button>

      <p className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Non inserire nomi, telefoni, indirizzi o accuse contro fornitori. Se serve raccontare un problema, descrivi i
        fatti senza dati riconoscibili.
      </p>
    </form>
  );
}
