"use client";

import type { DragEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import {
  analyzeQuote,
  type QuoteAnalysisReport,
  type QuoteFinding,
  type QuoteEventType,
  type QuoteObjective,
  type QuoteServiceType
} from "@/lib/quote-analysis-engine";
import { analyzeQuoteQuality, type QuoteScoreResult } from "@/lib/quoteScoring";
import { localizedStaticPath } from "@/lib/i18n-basic";
import { redactQuoteText } from "@/lib/redaction-engine";
import {
  VIBES_SUPPLIER_CATEGORIES,
  supplierCategoryLabel,
  supplierSearchCopy,
  supplierSubcategoryLabel,
  type VibesSupplierCard
} from "@/lib/vibes-suppliers";

type QuoteAnalyzerLocale = "it" | "en" | "es" | "fr";

declare global {
  interface Window {
    Tesseract?: {
      recognize: (
        image: File | string,
        language?: string,
        options?: { logger?: (message: { status?: string; progress?: number }) => void }
      ) => Promise<{ data: { text: string } }>;
    };
  }
}

type UploadedQuoteFile = {
  id: string;
  label: string;
  privateName: string;
  type: "image" | "pdf" | "word" | "text" | "other";
  previewUrl?: string;
};

type AiQuoteAnalysisState = {
  model: string;
  detected_service?: QuoteServiceType | "altro";
  user_summary: string;
  public_anonymized_summary: string;
  included_items: string[];
  unclear_items: string[];
  possible_hidden_costs: string[];
  questions_to_ask: string[];
  supplier_message_draft: string;
  recommended_next_action: string;
  score_note: string;
};

type AnalyzerCopy = {
  inputLabel: string;
  placeholder?: string;
  imageTextLabel: string;
  imageTextPlaceholder: string;
  recognizedTextTitle: string;
  ocrReading: string;
  ocrReady: string;
  ocrFailed: string;
  uploadLabel: string;
  uploadHelp: string;
  dropTitle: string;
  dropHint: string;
  dropActive: string;
  fileButton: string;
  redactionTitle: string;
  redactionText: string;
  redactedPreview: string;
  attachmentsTitle: string;
  analysisLabel: string;
  emptyText: string;
  startLocked: string;
  startReady: string;
  startWaiting: string;
  loadingTitle: string;
  loadingText: string;
  loadingSteps: string[];
  errorTitle: string;
  errorText: string;
  retry: string;
  included: string;
  extras: string;
  unclear: string;
  questions: string;
  comparison: string;
  offerSummary: string;
  detailedReading: string;
  publicPost: string;
  scoreTitle: string;
  scoreHelp: string;
  sourceTitle: string;
  topicTitle: string;
  fileOnlyTitle: string;
  fileOnlyText: string;
  questionTitle: string;
  fallbackIncluded: string[];
  fallbackExtras: string[];
  fallbackUnclear: string[];
  defaultQuestions: string[];
  filePostIntro: string;
  publicPostIntro: string;
  moneyComparison: (count: number) => string;
  defaultComparison: string;
  redactedCount: (count: number) => string;
  fileTypeLabels: Record<UploadedQuoteFile["type"], string>;
  hiddenFileName: string;
  scoreLabels: {
    weak: string;
    check: string;
    fair: string;
    strong: string;
  };
};

type ToolFormCopy = {
  contextTitle: string;
  service: string;
  eventType: string;
  city: string;
  province: string;
  region: string;
  eventDate: string;
  guests: string;
  duration: string;
  total: string;
  objective: string;
  serviceDetails: string;
  privacyNote: string;
  metricTitle: string;
  clarity: string;
  completeness: string;
  extraRisk: string;
  priceCoherence: string;
  reliability: string;
  missingTitle: string;
  hiddenCostsTitle: string;
  messageDraftTitle: string;
  benchmarkTitle: string;
  noBenchmark: string;
  nextActionTitle: string;
  publishPrivate: string;
  compareSuppliers: string;
  protectedTitle: string;
  protectedItems: string[];
  serviceOptions: Record<QuoteServiceType, string>;
  eventOptions: Record<QuoteEventType, string>;
  objectiveOptions: Record<QuoteObjective, string>;
};

type TopicKey = "music" | "catering" | "location" | "photoVideo" | "flowers" | "openBar" | "corporate" | "general";

type TopicProfile = {
  key: TopicKey;
  categorySlug: string;
  label: Record<QuoteAnalyzerLocale, string>;
  title: Record<QuoteAnalyzerLocale, string>;
  keywords: string[];
  included: string[];
  extras: string[];
  unclear: string[];
  questions: Record<QuoteAnalyzerLocale, string[]>;
};

const copies: Record<QuoteAnalyzerLocale, AnalyzerCopy> = {
  it: {
    inputLabel: "Controlla o completa il testo letto",
    placeholder: "Incolla qui voci, prezzi, condizioni, caparra, orari, extra e note del fornitore...",
    imageTextLabel: "Testo letto automaticamente dalla foto",
    imageTextPlaceholder: "Il testo riconosciuto dalla foto comparirà qui automaticamente.",
    recognizedTextTitle: "Testo riconosciuto",
    ocrReading: "Sto leggendo automaticamente il testo dalla foto...",
    ocrReady: "Testo letto dalla foto e aggiunto all'analisi.",
    ocrFailed: "Non sono riuscito a leggere bene questa immagine. Prova con una foto più nitida o un file di testo.",
    uploadLabel: "Carica preventivo, foto o file",
    uploadHelp:
      "Carica prima il preventivo: proviamo a leggere foto, TXT e CSV e compiliamo il testo automaticamente. Il file non viene pubblicato. Per PDF e Word, se il testo non viene letto bene, incolla le voci principali.",
    dropTitle: "Trascina qui foto, screenshot o preventivo",
    dropHint: "Puoi trascinare immagini, PDF, Word, TXT o CSV direttamente in quest'area.",
    dropActive: "Rilascia qui il file: lo leggiamo senza pubblicarlo.",
    fileButton: "Scegli file",
    redactionTitle: "Dati oscurati automaticamente",
    redactionText:
      "Email, telefoni, indirizzi, link, codici fiscali, partita IVA e nomi azienda riconoscibili vengono sostituiti prima di creare la conversazione.",
    redactedPreview: "Anteprima testo pubblicabile",
    attachmentsTitle: "File caricati",
    analysisLabel: "Analisi intelligente",
    emptyText:
      "Carica un file oppure inserisci il testo del preventivo. Il pulsante resta visibile ma bloccato finché non c’è materiale da confrontare con la community.",
    startLocked: "Carica un preventivo per aprire la conversazione",
    startReady: "Inizia conversazione",
    startWaiting: "Stiamo preparando il confronto",
    loadingTitle: "Stiamo mettendo ordine nel preventivo",
    loadingText: "Un attimo: leggiamo le voci, togliamo i dati sensibili e prepariamo una domanda chiara da portare alla community.",
    loadingSteps: ["Ripuliamo i dati privati", "Mettiamo in fila inclusi ed extra", "Scriviamo una domanda utile e naturale"],
    errorTitle: "Analisi AI non completata",
    errorText: "In questo momento non riusciamo a completare l'analisi AI. Riprova tra qualche secondo.",
    retry: "Riprova analisi",
    included: "Cosa sembra incluso",
    extras: "Extra da tenere d'occhio",
    unclear: "Punti poco chiari",
    questions: "Domande intelligenti da fare",
    comparison: "Lettura del preventivo",
    offerSummary: "Riepilogo dell'offerta",
    detailedReading: "Lettura ragionata",
    publicPost: "Discussione già pronta",
    scoreTitle: "Voto preventivo",
    scoreHelp: "Il voto misura chiarezza, completezza, rischio di extra e quanto il preventivo è confrontabile con esperienze italiane. Non è una perizia definitiva sul prezzo.",
    sourceTitle: "Materiale usato per l'analisi",
    topicTitle: "Tema rilevato",
    fileOnlyTitle: "File caricato, ma testo non ancora sufficiente",
    fileOnlyText:
      "La conversazione può partire, ma per domande precise serve trascrivere almeno le voci principali che si leggono nel preventivo.",
    questionTitle: "Mi aiutate a capire questo preventivo?",
    fallbackIncluded: ["Voci principali del servizio", "Condizioni generali", "Eventuali importi indicati nel preventivo"],
    fallbackExtras: ["Ore extra", "IVA o tasse", "Trasporto", "Personale aggiuntivo", "Materiali non specificati"],
    fallbackUnclear: ["Caparra", "Saldo", "Annullamento", "Cambio data", "Numero minimo di ospiti"],
    defaultQuestions: [
      "Il prezzo include l'IVA o è IVA esclusa?",
      "Cosa succede se cambia il numero degli invitati?",
      "Quanto costano ore extra, servizi extra o personale aggiuntivo?",
      "La caparra è rimborsabile? Entro quando?",
      "Chi è il referente il giorno dell'evento?"
    ],
    filePostIntro: "Ho caricato o trascritto un preventivo e vorrei confrontarlo con clienti e fornitori italiani prima di confermare.",
    publicPostIntro: "Quello che ho capito dall'offerta è questo:",
    moneyComparison: (count) => `Nel testo compaiono ${count} importi: separa costo fisso, costo a persona ed extra.`,
    defaultComparison: "Per capire se il prezzo ha senso in Italia, servono città, numero persone, data indicativa e cosa è incluso.",
    redactedCount: (count) => `${count} elementi sensibili rilevati o sostituiti.`,
    fileTypeLabels: { image: "immagine", pdf: "PDF", word: "Word", text: "testo", other: "file" },
    hiddenFileName: "nome nascosto",
    scoreLabels: {
      weak: "Rischioso",
      check: "Da chiarire",
      fair: "Abbastanza chiaro",
      strong: "Molto solido"
    }
  },
  en: {
    inputLabel: "Check or complete the extracted text",
    placeholder: "Paste items, prices, deposit terms, timings, extras and supplier notes...",
    imageTextLabel: "Text read automatically from the photo",
    imageTextPlaceholder: "Recognized text from the photo will appear here automatically.",
    recognizedTextTitle: "Recognized text",
    ocrReading: "Reading text from the photo automatically...",
    ocrReady: "Text read from the photo and added to the analysis.",
    ocrFailed: "I could not read this image clearly. Try a sharper photo or a text file.",
    uploadLabel: "Upload quote, photo or file",
    uploadHelp: "Upload the quote first: we try to read photos, TXT and CSV files and fill the text automatically. The file is not published. For PDF and Word files, paste the main items if the text is not read clearly.",
    dropTitle: "Drop a photo, screenshot or quote here",
    dropHint: "You can drag images, PDF, Word, TXT or CSV files directly into this area.",
    dropActive: "Drop the file here: we read it without publishing it.",
    fileButton: "Choose file",
    redactionTitle: "Personal data removed automatically",
    redactionText: "Emails, phone numbers, addresses, links, tax codes, VAT numbers and recognizable company names are replaced before posting.",
    redactedPreview: "Safe public preview",
    attachmentsTitle: "Uploaded files",
    analysisLabel: "Smart analysis",
    emptyText: "Upload a file or paste the quote text. The conversation button stays visible but locked until there is material to compare with the Italian community.",
    startLocked: "Upload a quote to compare it with Italy",
    startReady: "Start conversation",
    startWaiting: "Preparing the comparison",
    loadingTitle: "We are making sense of your quote",
    loadingText: "One moment: we read the items, remove private details and prepare a clear community question.",
    loadingSteps: ["Cleaning private details", "Sorting included items and extras", "Writing a natural question"],
    errorTitle: "AI analysis not completed",
    errorText: "We cannot complete the AI analysis right now. Please try again in a few seconds.",
    retry: "Retry analysis",
    included: "What seems included",
    extras: "Extras to watch",
    unclear: "Unclear points",
    questions: "Smart questions for Italian suppliers",
    comparison: "Quote reading",
    offerSummary: "Offer summary",
    detailedReading: "Reasoned reading",
    publicPost: "Ready-to-post discussion",
    scoreTitle: "Quote score",
    scoreHelp: "The score measures clarity, completeness, risk of extras and how comparable the quote is with Italian event cases. It is not a final price appraisal.",
    sourceTitle: "Material used for the analysis",
    topicTitle: "Detected topic",
    fileOnlyTitle: "File uploaded, but not enough text yet",
    fileOnlyText: "The conversation can start, but precise questions need at least the main quote lines typed in, especially if you want to compare Italian prices.",
    questionTitle: "Can you help me understand this Italian event quote?",
    fallbackIncluded: ["Main service items", "General conditions", "Amounts visible in the quote"],
    fallbackExtras: ["Extra hours", "VAT or taxes", "Transport", "Additional staff", "Unspecified materials"],
    fallbackUnclear: ["Deposit", "Final payment", "Cancellation", "Date changes", "Minimum guest count"],
    defaultQuestions: [
      "Is VAT included or excluded?",
      "What happens if the guest count changes?",
      "How much do extra hours, extra services or additional staff cost?",
      "Is the deposit refundable? Until when?",
      "Who is the contact person on the event day?"
    ],
    filePostIntro: "I uploaded or pasted an event quote and want to compare it with Italian clients and suppliers before confirming.",
    publicPostIntro: "What I understand from the offer is this:",
    moneyComparison: (count) => `${count} amounts appear in the text: separate fixed fee, per-person cost and extras.`,
    defaultComparison: "To understand if the price makes sense in Italy, add city, guest count, approximate date and what is included.",
    redactedCount: (count) => `${count} sensitive items detected or replaced.`,
    fileTypeLabels: { image: "image", pdf: "PDF", word: "Word", text: "text", other: "file" },
    hiddenFileName: "file name hidden",
    scoreLabels: { weak: "Risky", check: "Needs checks", fair: "Fairly clear", strong: "Very solid" }
  },
  es: {
    inputLabel: "Revisa o completa el texto leído",
    placeholder: "Pegà partidas, precios, condiciones, depósito, horarios, extras y notas del proveedor...",
    imageTextLabel: "Texto leido automáticamente desde la foto",
    imageTextPlaceholder: "El texto reconocido desde la foto aparecerá aquí automáticamente.",
    recognizedTextTitle: "Texto reconocido",
    ocrReading: "Leyendo automáticamente el texto de la foto...",
    ocrReady: "Texto leído desde la foto y añadido al análisis.",
    ocrFailed: "No he podido leer bien esta imagen. Prueba con una foto más nítida o un archivo de texto.",
    uploadLabel: "Subir presupuesto, foto o archivo",
    uploadHelp: "Sube primero el presupuesto: intentamos leer fotos, TXT y CSV y completar el texto automáticamente. El archivo no se publica. Para PDF y Word, pega las partidas principales si el texto no se lee bien.",
    dropTitle: "Arrastra aquí foto, captura o presupuesto",
    dropHint: "Puedes arrastrar imágenes, PDF, Word, TXT o CSV directamente en esta zona.",
    dropActive: "Suelta aquí el archivo: lo leemos sin publicarlo.",
    fileButton: "Elegir archivo",
    redactionTitle: "Datos personales ocultados automáticamente",
    redactionText: "Emails, teléfonos, direcciones, enlaces, códigos fiscales, IVA y nombres de empresa reconocibles se sustituyen antes de publicar.",
    redactedPreview: "Vista previa publicable",
    attachmentsTitle: "Archivos cargados",
    analysisLabel: "Análisis inteligente",
    emptyText: "Sube un archivo o pega el texto del presupuesto. El botón queda visible pero bloqueado hasta tener material para comparar con la comunidad italiana.",
    startLocked: "Sube un presupuesto para compararlo con Italia",
    startReady: "Iniciar conversación",
    startWaiting: "Preparando la comparación",
    loadingTitle: "Estamos ordenando tu presupuesto",
    loadingText: "Un momento: leemos las partidas, quitamos datos privados y preparamos una pregunta clara para la comunidad.",
    loadingSteps: ["Limpiamos datos privados", "Ordenamos incluidos y extras", "Escribimos una pregunta natural"],
    errorTitle: "Análisis AI no completado",
    errorText: "Ahora no podemos completar el análisis AI. Inténtalo otra vez en unos segundos.",
    retry: "Reintentar análisis",
    included: "Lo que parece incluido",
    extras: "Extras a vigilar",
    unclear: "Puntos poco claros",
    questions: "Preguntas inteligentes para proveedores italianos",
    comparison: "Lectura del presupuesto",
    offerSummary: "Resumen de la oferta",
    detailedReading: "Lectura razonada",
    publicPost: "Conversación lista",
    scoreTitle: "Nota del presupuesto",
    scoreHelp: "La nota mide claridad, detalle, riesgo de extras y si el presupuesto se puede comparar con casos italianos. No es una tasación definitiva del precio.",
    sourceTitle: "Material usado para el análisis",
    topicTitle: "Tema detectado",
    fileOnlyTitle: "Archivo cargado, pero falta texto",
    fileOnlyText: "La conversación puede empezar, pero para preguntas precisas escribe al menos las partidas principales, sobre todo si quieres comparar precios italianos.",
    questionTitle: "¿Me ayudáis a entender este presupuesto para un evento en Italia?",
    fallbackIncluded: ["Partidas principales del servicio", "Condiciones generales", "Importes visibles en el presupuesto"],
    fallbackExtras: ["Horas extra", "IVA o impuestos", "Transporte", "Personal adicional", "Material no especificado"],
    fallbackUnclear: ["Depósito", "Pago final", "Cancelación", "Cambio de fecha", "Mínimo de invitados"],
    defaultQuestions: [
      "¿El IVA está incluido o excluido?",
      "¿Qué pasa si cambia el número de invitados?",
      "Cuánto cuestan horas extra, servicios extra o personal adicional?",
      "¿El depósito es reembolsable? ¿Hasta cuándo?",
      "¿Quién será la persona de referencia el día del evento?"
    ],
    filePostIntro: "He subido o pegado un presupuesto y quiero compararlo con clientes y proveedores italianos antes de confirmar.",
    publicPostIntro: "Lo que entiendo de la oferta es esto:",
    moneyComparison: (count) => `Aparecen ${count} importes: separa coste fijo, coste por persona y extras.`,
    defaultComparison: "Para entender si el precio tiene sentido en Italia, indica ciudad, invitados, fecha aproximada y qué incluye.",
    redactedCount: (count) => `${count} datos sensibles detectados o sustituidos.`,
    fileTypeLabels: { image: "imagen", pdf: "PDF", word: "Word", text: "texto", other: "archivo" },
    hiddenFileName: "nombre oculto",
    scoreLabels: { weak: "Riesgoso", check: "Por aclarar", fair: "Bastante claro", strong: "Muy sólido" }
  },
  fr: {
    inputLabel: "Vérifiez ou complétez le texte lu",
    placeholder: "Collez lignes, prix, acompte, horaires, extras et notes du prestataire...",
    imageTextLabel: "Texte lu automatiquement depuis la photo",
    imageTextPlaceholder: "Le texte reconnu depuis la photo apparaîtra ici automatiquement.",
    recognizedTextTitle: "Texte reconnu",
    ocrReading: "Lecture automatique du texte de la photo...",
    ocrReady: "Texte lu depuis la photo et ajouté à l'analyse.",
    ocrFailed: "Je n'ai pas pu lire clairement cette image. Essayez une photo plus nette ou un fichier texte.",
    uploadLabel: "Ajouter devis, photo ou fichier",
    uploadHelp: "Ajoutez d'abord le devis : nous essayons de lire photos, TXT et CSV et de remplir le texte automatiquement. Le fichier n'est pas publié. Pour PDF et Word, collez les lignes principales si le texte n'est pas bien lu.",
    dropTitle: "Glissez ici une photo, capture ou devis",
    dropHint: "Vous pouvez glisser images, PDF, Word, TXT ou CSV directement dans cette zone.",
    dropActive: "Déposez le fichier ici : nous le lisons sans le publier.",
    fileButton: "Choisir un fichier",
    redactionTitle: "Données personnelles masquées automatiquement",
    redactionText: "Emails, téléphones, adresses, liens, codes fiscaux, TVA et noms d'entreprise reconnaissables sont remplacés avant publication.",
    redactedPreview: "Aperçu publiable",
    attachmentsTitle: "Fichiers ajoutés",
    analysisLabel: "Analyse intelligente",
    emptyText: "Ajoutez un fichier ou collez le texte du devis. Le bouton reste visible mais bloqué tant qu'il n'y a rien à comparer avec la communauté italienne.",
    startLocked: "Ajoutez un devis pour le comparer en Italie",
    startReady: "Ouvrir la discussion",
    startWaiting: "Préparation de la comparaison",
    loadingTitle: "Nous remettons votre devis en ordre",
    loadingText: "Un instant : nous lisons les postes, retirons les données privées et préparons une question claire pour la communauté.",
    loadingSteps: ["Nettoyage des données privées", "Classement des inclus et extras", "Rédaction d'une question naturelle"],
    errorTitle: "Analyse AI non terminée",
    errorText: "Nous ne pouvons pas terminer l'analyse AI pour le moment. Réessayez dans quelques secondes.",
    retry: "Relancer l'analyse",
    included: "Ce qui semble inclus",
    extras: "Extras à surveiller",
    unclear: "Points flous",
    questions: "Questions intelligentes pour prestataires italiens",
    comparison: "Lecture du devis",
    offerSummary: "Résumé de l'offre",
    detailedReading: "Lecture raisonnée",
    publicPost: "Discussion prête",
    scoreTitle: "Note du devis",
    scoreHelp: "La note mesure la clarté, la complétude, le risque d'extras et la possibilité de comparer avec des cas italiens. Ce n'est pas une estimation définitive du prix.",
    sourceTitle: "Matériel utilisé pour l'analyse",
    topicTitle: "Sujet détecté",
    fileOnlyTitle: "Fichier ajouté, mais texte insuffisant",
    fileOnlyText: "La discussion peut commencer, mais pour des questions précises, tapez au moins les lignes principales, surtout pour comparer les prix italiens.",
    questionTitle: "Pouvez-vous m'aider à comprendre ce devis pour un événement en Italie ?",
    fallbackIncluded: ["Éléments principaux du service", "Conditions générales", "Montants visibles dans le devis"],
    fallbackExtras: ["Heures supplémentaires", "TVA ou taxes", "Transport", "Personnel additionnel", "Matériel non précisé"],
    fallbackUnclear: ["Acompte", "Solde", "Annulation", "Changement de date", "Nombre minimum d'invités"],
    defaultQuestions: [
      "La TVA est-elle incluse ou exclue?",
      "Que se passe-t-il si le nombre d'invités change?",
      "Combien coûtent les heures supplémentaires, services extra ou personnel additionnel ?",
      "L'acompte est-il remboursable ? Jusqu'à quand ?",
      "Qui sera le contact le jour de l'événement ?"
    ],
    filePostIntro: "J'ai ajouté ou collé un devis et je veux le comparer avec des clients et prestataires italiens avant de confirmer.",
    publicPostIntro: "Ce que je comprends de l'offre est ceci:",
    moneyComparison: (count) => `${count} montants apparaissent : séparez forfait, prix par personne et extras.`,
    defaultComparison: "Pour comprendre si le prix tient debout en Italie, indiquez ville, invités, date approximative et éléments inclus.",
    redactedCount: (count) => `${count} données sensibles détectées ou remplacées.`,
    fileTypeLabels: { image: "image", pdf: "PDF", word: "Word", text: "texte", other: "fichier" },
    hiddenFileName: "nom masqué",
    scoreLabels: { weak: "Risque", check: "À clarifier", fair: "Assez clair", strong: "Très solide" }
  }
};

const formCopies: Record<QuoteAnalyzerLocale, ToolFormCopy> = {
  it: {
    contextTitle: "Dati evento per leggere meglio il preventivo",
    service: "Tipo servizio",
    eventType: "Tipo evento",
    city: "Città evento",
    province: "Provincia",
    region: "Regione",
    eventDate: "Data evento",
    guests: "Numero ospiti",
    duration: "Durata stimata",
    total: "Importo indicato",
    objective: "Cosa vuoi capire",
    serviceDetails: "Dettagli già presenti nel preventivo",
    privacyNote: "Il file viene letto nel browser per preparare l'analisi: non viene pubblicato. Prima di aprire una conversazione oscuriamo recapiti, nomi fornitore e riferimenti riconoscibili.",
    metricTitle: "Lettura del report",
    clarity: "Chiarezza preventivo",
    completeness: "Completezza preventivo",
    extraRisk: "Rischio extra",
    priceCoherence: "Coerenza prezzo",
    reliability: "Affidabilità informazioni",
    missingTitle: "Voci mancanti o poco chiare",
    hiddenCostsTitle: "Possibili costi extra",
    messageDraftTitle: "Messaggio pronto da inviare",
    benchmarkTitle: "Confronto con esperienze simili",
    noBenchmark: "Mostriamo un confronto numerico solo quando ci sono dati abbastanza solidi. Se mancano, l'analisi si concentra su voci incluse, costi mancanti e domande da fare.",
    nextActionTitle: "Prossimo passo consigliato",
    publishPrivate: "Pubblica una domanda anonima",
    compareSuppliers: "Richiedi alternative su Vibes Planner",
    protectedTitle: "Come proteggiamo il tuo preventivo",
    protectedItems: [
      "Il file originale non viene pubblicato nella community.",
      "Recapiti, link, indirizzi e riferimenti del fornitore vengono oscurati.",
      "Puoi usare il report senza registrazione e décidere dopo se aprire una conversazione.",
      "I fornitori vedono solo un brief se scegli esplicitamente il confronto."
    ],
    serviceOptions: {
      dj: "DJ",
      band: "Band",
      fotografo: "Fotografo",
      catering: "Catering",
      location: "Location",
      team_building: "Team building",
      evento_aziendale: "Evento aziendale",
      fiori: "Fiori e allestimenti",
      open_bar: "Open bar",
      altro: "Altro"
    },
    eventOptions: {
      matrimonio: "Matrimonio",
      compleanno: "Compleanno",
      aziendale: "Evento aziendale",
      festa_privata: "Festa privata",
      diciottesimo: "Diciottesimo",
      cerimonia: "Cerimonia",
      altro: "Altro"
    },
    objectiveOptions: {
      capire_caro: "Capire se è caro",
      cosa_manca: "Capire cosa manca",
      confrontare: "Confrontarlo con alternative",
      domande_fornitore: "Preparare domande da fare",
      pubblicare_anonima: "Pubblicare una domanda anonima"
    }
  },
  en: {
    contextTitle: "Event details to read the Italian quote better",
    service: "Service type",
    eventType: "Event type",
    city: "Event city in Italy",
    province: "Province",
    region: "Region",
    eventDate: "Event date",
    guests: "Guests",
    duration: "Estimated duration",
    total: "Quoted amount",
    objective: "What you want to understand",
    serviceDetails: "Details already visible in the quote",
    privacyNote: "The file is read in the browser to prepare the analysis: it is not published. Before opening a public discussion, contacts, supplier names and recognizable references are removed.",
    metricTitle: "Report reading",
    clarity: "Quote clarity",
    completeness: "Quote completeness",
    extraRisk: "Extra-cost risk",
    priceCoherence: "Price readability",
    reliability: "Information reliability",
    missingTitle: "Missing or unclear items",
    hiddenCostsTitle: "Possible extra costs",
    messageDraftTitle: "Message ready to send",
    benchmarkTitle: "Comparison with similar Italian cases",
    noBenchmark: "We show numeric comparison only when the data is solid enough. Otherwise the analysis focuses on included items, missing costs and questions to ask.",
    nextActionTitle: "Recommended next step",
    publishPrivate: "Publish an anonymous question",
    compareSuppliers: "Request alternatives on Vibes Planner",
    protectedTitle: "How we protect your quote",
    protectedItems: [
      "The original file is not published in the community.",
      "Contacts, links, addresses and supplier references are removed.",
      "You can use the report without registration and decide later whether to open a discussion.",
      "Suppliers only see a brief if you explicitly request a comparison."
    ],
    serviceOptions: {
      dj: "DJ",
      band: "Band",
      fotografo: "Photographer",
      catering: "Catering",
      location: "Venue",
      team_building: "Team building",
      evento_aziendale: "Corporate event",
      fiori: "Flowers and styling",
      open_bar: "Open bar",
      altro: "Other"
    },
    eventOptions: {
      matrimonio: "Wedding",
      compleanno: "Birthday",
      aziendale: "Corporate event",
      festa_privata: "Private party",
      diciottesimo: "18th birthday",
      cerimonia: "Ceremony",
      altro: "Other"
    },
    objectiveOptions: {
      capire_caro: "Understand if it is expensive",
      cosa_manca: "Understand what is missing",
      confrontare: "Compare it with alternatives",
      domande_fornitore: "Prepare supplier questions",
      pubblicare_anonima: "Publish an anonymous question"
    }
  },
  es: {
    contextTitle: "Datos del evento para leer mejor el presupuesto italiano",
    service: "Tipo de servicio",
    eventType: "Tipo de evento",
    city: "Ciudad del evento en Italia",
    province: "Provincia",
    region: "Region",
    eventDate: "Fecha del evento",
    guests: "Invitados",
    duration: "Duracion estimada",
    total: "Importe indicado",
    objective: "Que quieres entender",
    serviceDetails: "Detalles visibles en el presupuesto",
    privacyNote: "El archivo se lee en el navegador para preparar el análisis: no se publica. Antes de abrir una conversación publica ocultamos contactos, nombres de proveedor y referencias reconocibles.",
    metricTitle: "Lectura del reporte",
    clarity: "Claridad del presupuesto",
    completeness: "Detalle del presupuesto",
    extraRisk: "Riesgo de extras",
    priceCoherence: "Lectura del precio",
    reliability: "Fiabilidad de la información",
    missingTitle: "Partidas ausentes o poco claras",
    hiddenCostsTitle: "Posibles costes extra",
    messageDraftTitle: "Mensaje listo para enviar",
    benchmarkTitle: "Comparacion con casos italianos similares",
    noBenchmark: "Mostramos comparación numerica solo cuando los datos son suficientemente solidos. Si no, el análisis se centra en partidas, costes qué faltan y preguntas.",
    nextActionTitle: "Siguiente paso recomendado",
    publishPrivate: "Publicar pregunta anonima",
    compareSuppliers: "Pedir alternativas en Vibes Planner",
    protectedTitle: "Como protegemos tu presupuesto",
    protectedItems: [
      "El archivo original no se publica en la comunidad.",
      "Contactos, enlaces, direcciones y referencias del proveedor se ocultan.",
      "Puedes usar el reporte sin registro y decidir después si abrir una conversación.",
      "Los proveedores solo ven un brief si pides expresamente una comparación."
    ],
    serviceOptions: {
      dj: "DJ",
      band: "Banda",
      fotografo: "Fotografo",
      catering: "Catering",
      location: "Lugar",
      team_building: "Team building",
      evento_aziendale: "Evento corporativo",
      fiori: "Flores y decoración",
      open_bar: "Open bar",
      altro: "Otro"
    },
    eventOptions: {
      matrimonio: "Boda",
      compleanno: "Cumpleaños",
      aziendale: "Evento corporativo",
      festa_privata: "Fiesta privada",
      diciottesimo: "18 cumpleaños",
      cerimonia: "Ceremonia",
      altro: "Otro"
    },
    objectiveOptions: {
      capire_caro: "Entender si es caro",
      cosa_manca: "Entender qué falta",
      confrontare: "Compararlo con alternativas",
      domande_fornitore: "Preparar preguntas",
      pubblicare_anonima: "Publicar pregunta anonima"
    }
  },
  fr: {
    contextTitle: "Details de l'événement pour mieux lire le devis italien",
    service: "Type de service",
    eventType: "Type d'événement",
    city: "Ville en Italie",
    province: "Province",
    region: "Région",
    eventDate: "Date de l'événement",
    guests: "Invités",
    duration: "Durée estimée",
    total: "Montant indiqué",
    objective: "Ce que vous voulez comprendre",
    serviceDetails: "Détails déjà visibles dans le devis",
    privacyNote: "Le fichier est lu dans le navigateur pour préparer l'analyse: il n'est pas publié. Avant une discussion publique, contacts, noms de prestataire et références reconnaissables sont masquées.",
    metricTitle: "Lecture du rapport",
    clarity: "Clarté du devis",
    completeness: "Complétude du devis",
    extraRisk: "Risque d'extras",
    priceCoherence: "Lecture du prix",
    reliability: "Fiabilité des informations",
    missingTitle: "Postes manquants ou flous",
    hiddenCostsTitle: "Coûts extra possibles",
    messageDraftTitle: "Message prêt à envoyer",
    benchmarkTitle: "Comparaison avec des cas italiens similaires",
    noBenchmark: "Nous affichons une comparaison numerique seulement si les données sont assez solides. Sinon l'analyse se concentre sur postes inclus, coûts manquants et questions.",
    nextActionTitle: "Prochaine étape conseillée",
    publishPrivate: "Publier une question anonyme",
    compareSuppliers: "Demander des alternatives sur Vibes Planner",
    protectedTitle: "Comment nous protegeons votre devis",
    protectedItems: [
      "Le fichier original n'est pas publié dans la communauté.",
      "Contacts, liens, adresses et références du prestataire sont masqués.",
      "Vous pouvez utiliser le rapport sans inscription puis décider d'ouvrir une discussion.",
      "Les prestataires voient seulement un brief si vous demandez explicitement une comparaison."
    ],
    serviceOptions: {
      dj: "DJ",
      band: "Groupe",
      fotografo: "Photographe",
      catering: "Traiteur",
      location: "Lieu",
      team_building: "Team building",
      evento_aziendale: "événement d'entreprise",
      fiori: "Fleurs et décoration",
      open_bar: "Open bar",
      altro: "Autre"
    },
    eventOptions: {
      matrimonio: "Mariage",
      compleanno: "Anniversaire",
      aziendale: "événement d'entreprise",
      festa_privata: "Fête privée",
      diciottesimo: "18 ans",
      cerimonia: "Ceremonie",
      altro: "Autre"
    },
    objectiveOptions: {
      capire_caro: "Comprendre si c'est cher",
      cosa_manca: "Comprendre ce qui manque",
      confrontare: "Comparer avec alternatives",
      domande_fornitore: "Preparer des questions",
      pubblicare_anonima: "Publier une question anonyme"
    }
  }
};

type ServiceDetailOption = {
  value: string;
  label: Record<QuoteAnalyzerLocale, string>;
};

function detailOption(value: string, en: string, es: string, fr: string): ServiceDetailOption {
  return { value, label: { it: value, en, es, fr } };
}

const serviceSpecificOptions: Record<QuoteServiceType, ServiceDetailOption[]> = {
  dj: [
    detailOption("ore di musica", "music hours", "horas de musica", "heures de musique"),
    detailOption("impianto incluso", "sound system included", "equipo de sonido incluido", "sonorisation incluse"),
    detailOption("luci incluse", "lights included", "luces incluidas", "lumières incluses"),
    detailOption("microfoni", "microphones", "micrófonos", "micros"),
    detailOption("setup cerimonia/aperitivo", "ceremony or aperitif setup", "montaje ceremonia o aperitivo", "installation cérémonie ou apéritif"),
    detailOption("ore extra", "extra hours", "horas extra", "heures supplémentaires"),
    detailOption("trasferta", "travel", "desplazamiento", "déplacement"),
    detailOption("SIAE o permessi", "music permits", "permisos musicales", "droits musicaux")
  ],
  band: [
    detailOption("numero musicisti", "number of musicians", "numero de musicos", "nombre de musiciens"),
    detailOption("durata live", "live duration", "duración del directo", "durée du live"),
    detailOption("numero set", "number of sets", "numero de sets", "nombre de sets"),
    detailOption("tecnico audio", "sound technician", "técnico de sonido", "technicien son"),
    detailOption("impianto incluso", "sound system included", "equipo de sonido incluido", "sonorisation incluse"),
    detailOption("DJ set incluso", "DJ set included", "DJ set incluido", "DJ set inclus"),
    detailOption("pasti staff", "staff meals", "comidas del staff", "repas equipe"),
    detailOption("pernottamento", "overnight stay", "alojamiento", "hebergement")
  ],
  fotografo: [
    detailOption("ore di copertura", "coverage hours", "horas de cobertura", "heures de couverture"),
    detailOption("numero fotografi", "number of photographers", "numero de fotografos", "nombre de photographes"),
    detailOption("secondo fotografo", "second shooter", "secondo fotografo", "second photographe"),
    detailOption("post-produzione", "editing", "postproduccion", "retouche"),
    detailOption("album", "album", "album", "album"),
    detailOption("video", "video", "video", "video"),
    detailOption("tempi di consegna", "delivery timing", "plazos de entrega", "délais de livraison"),
    detailOption("diritti di utilizzo", "usage rights", "derechos de uso", "droits d'utilisation")
  ],
  catering: [
    detailOption("prezzo a persona", "price per person", "precio por persona", "prix par personne"),
    detailOption("bevande", "drinks", "bebidas", "boissons"),
    detailOption("camerieri", "waiters", "camareros", "serveurs"),
    detailOption("torta", "cake", "tarta", "gâteau"),
    detailOption("open bar", "open bar", "open bar", "open bar"),
    detailOption("menù intolleranze", "allergy menus", "menus para intolerancias", "menus allergies"),
    detailOption("noleggio stoviglie", "tableware rental", "alquiler de vajilla", "location vaisselle"),
    detailOption("numero minimo", "minimum guest count", "numero minimo", "nombre minimum")
  ],
  location: [
    detailOption("esclusiva", "exclusive use", "uso exclusivo", "exclusivite"),
    detailOption("piano B pioggia", "rain plan B", "plan B lluvia", "plan B pluie"),
    detailOption("pulizie", "cleaning", "limpieza", "nettoyage"),
    detailOption("parcheggio", "parking", "parking", "parking"),
    detailOption("fornitori esterni", "external suppliers", "proveedores externos", "prestataires externes"),
    detailOption("orario limite", "end time", "horario limite", "horaire límite"),
    detailOption("climatizzazione", "heating or cooling", "climatizacion", "climatisation"),
    detailOption("sicurezza", "security", "seguridad", "sécurité")
  ],
  team_building: [
    detailOption("obiettivo del team", "team objective", "objetivo del equipo", "objectif de l'equipe"),
    detailOption("facilitatori", "facilitators", "facilitadores", "facilitateurs"),
    detailOption("lingua facilitatori", "facilitator language", "idioma facilitadores", "langue des facilitateurs"),
    detailOption("materiali inclusi", "materials included", "materiales incluidos", "matériel inclus"),
    detailOption("piano B indoor/outdoor", "indoor/outdoor plan B", "plan B interior/exterior", "plan B interieur/exterieur"),
    detailOption("assicurazione", "insurance", "seguro", "assurance"),
    detailOption("brief e debrief", "brief and debrief", "brief y debrief", "brief et debrief"),
    detailOption("variazione partecipanti", "attendee changes", "cambios de participantes", "variation participants")
  ],
  evento_aziendale: [
    detailOption("sala meeting", "meeting room", "sala de reunión", "salle de réunion"),
    detailOption("regia tecnica", "technical direction", "dirección técnica", "regie technique"),
    detailOption("prove audio/video", "audio/video rehearsals", "pruebas audio/video", "tests audio/video"),
    detailOption("accoglienza e badge", "welcome desk and badges", "recepción y badges", "accueil et badges"),
    detailOption("coffee break", "coffee break", "coffee break", "pause cafe"),
    detailOption("guardaroba", "cloakroom", "guardarropa", "vestiaire"),
    detailOption("streaming", "streaming", "streaming", "streaming"),
    detailOption("coordinamento evento", "event coordination", "coordinación del evento", "coordination événement")
  ],
  fiori: [
    detailOption("bouquet", "bouquet", "ramo", "bouquet"),
    detailOption("centrotavola", "centerpieces", "centros de mesa", "centres de table"),
    detailOption("arco", "arch", "arco", "arche"),
    detailOption("candele", "candles", "velas", "bougies"),
    detailOption("montaggio", "setup", "montaje", "montage"),
    detailOption("smontaggio", "teardown", "desmontaje", "démontage"),
    detailOption("noleggi", "rentals", "alquileres", "locations"),
    detailOption("fiori fuori stagione", "out-of-season flowers", "flores fuera de temporada", "fleurs hors saison")
  ],
  open_bar: [
    detailOption("numero drink", "number of drinks", "numero de bebidas", "nombre de boissons"),
    detailOption("durata servizio", "service duration", "duración del servicio", "durée du service"),
    detailOption("barman", "bartender", "barman", "barman"),
    detailOption("premium spirits", "premium spirits", "destilados premium", "alcools premium"),
    detailOption("ghiaccio", "ice", "hielo", "glace"),
    detailOption("bicchieri", "glasses", "vasos", "verres"),
    detailOption("banco bar", "bar counter", "barra", "comptoir bar"),
    detailOption("trasporto", "transport", "transporte", "transport")
  ],
  altro: [
    detailOption("durata", "duration", "duración", "durée"),
    detailOption("materiali", "materials", "materiales", "matériel"),
    detailOption("personale", "staff", "personal", "personnel"),
    detailOption("trasporto", "transport", "transporte", "transport"),
    detailOption("IVA", "VAT", "IVA", "TVA"),
    detailOption("caparra", "deposit", "deposito", "acompte"),
    detailOption("saldo", "final payment", "pago final", "solde"),
    detailOption("annullamento", "cancellation", "cancelación", "annulation")
  ]
};

const topicProfiles: TopicProfile[] = [
  {
    key: "music",
    categorySlug: "musica-dj",
    label: { it: "Musica, DJ e intrattenimento", en: "Music, DJ and entertainment", es: "Musica, DJ y animación", fr: "Musique, DJ et animation" },
    title: {
      it: "Preventivo musica o DJ",
      en: "Music or DJ quote",
      es: "Presupuesto musica o DJ",
      fr: "Devis musique ou DJ"
    },
    keywords: ["dj", "musica", "music", "band", "siae", "playlist", "audio", "luci", "lights", "casse", "micrófono", "microphone", "animazione", "intrattenimento", "sax", "karaoke"],
    included: ["Ore di servizio musicale", "Impianto audio/luci", "Montaggio e smontaggio", "Eventuale microfono per discorsi"],
    extras: ["SIAE", "Ore extra", "Trasferta", "Impianto luci aggiuntivo", "Secondo postazione audio"],
    unclear: ["Numero ore incluso", "Cosa succede se la festa si allunga", "Responsabilità SIAE", "Piano B se la musica e all'aperto"],
    questions: {
      it: [
        "Quante ore effettive di musica sono incluse e da che ora partono?",
        "La SIAE è inclusa, gestita dal DJ o resta completamente a carico mio",
        "Impianto audio, luci e microfono sono compresi o hanno un prezzo separato?",
        "Quanto costa ogni ora extra se la festa continua?",
        "Chi monta, smonta e gestisce eventuali problemi tecnici durante l'evento?"
      ],
      en: [
        "How many real music hours are included and when do they start?",
        "Are music rights handled by the DJ or paid separately?",
        "Are sound system, lights and microphone included?",
        "How much is each extra hour?",
        "Who handles setup, teardown and technical issues?"
      ],
      es: [
        "¿Cuántas horas reales de música están incluidas?",
        "¿La licencia musical está incluida o va aparte?",
        "¿Sonido, luces y micrófono están incluidos?",
        "Cuánto cuesta cada hora extra?",
        "¿Quién monta, desmonta y gestiona problemas técnicos?"
      ],
      fr: [
        "Combien d'heures réelles de musique sont incluses?",
        "Les droits musicaux sont-ils inclus ou à part?",
        "Sono, lumières et micro sont-ils inclus ?",
        "Combien coûte chaque heure supplémentaire?",
        "Qui gère montage, démontage et problèmes techniques?"
      ]
    }
  },
  {
    key: "catering",
    categorySlug: "catering-menu",
    label: { it: "Catering e menù", en: "Catering and menu", es: "Catering y menú", fr: "Traiteur et menu" },
    title: { it: "Preventivo catering", en: "Catering quote", es: "Presupuesto catering", fr: "Devis traiteur" },
    keywords: ["catering", "menu", "buffet", "pranzo", "antipasto", "primo", "secondo", "torta", "cake", "bevande", "camerieri", "mise en place", "intolleranze"],
    included: ["Menu o buffet", "Servizio camerieri", "Acqua e bevande indicate", "Torta o dessert se presente", "Allestimento tavoli"],
    extras: ["Open bar", "Torta", "Camerieri extra", "Noleggio stoviglie", "Trasporto", "Taglio torta", "Menu bimbi/intolleranze"],
    unclear: ["Prezzo a persona", "Numero minimo garantito", "Cosa succede se cambiano gli invitati", "Bevande incluse o a consumo"],
    questions: {
      it: [
        "Il prezzo ? a persona o a forfait Qual è il numero minimo garantito",
        "Bevande, caffè, torta e taglio torta sono inclusi o a parte?",
        "Quanti camerieri sono previsti per il numero di ospiti indicato?",
        "Fino a quando posso cambiare il numero definitivo degli invitati?",
        "Intolleranze, menu bimbi e richieste speciali hanno supplementi?"
      ],
      en: ["Is the price per person or fixed?", "Are drinks, coffee and cake included?", "How many waiters are planned?", "When can the final guest count change?", "Do allergies or kids menus cost extra?"],
      es: ["¿El precio es por persona o cerrado?", "¿Bebidas, café y tarta están incluidos?", "¿Cuántos camareros están previstos?", "¿Hasta cuándo puedo cambiar invitados?", "Intolerancias o menú infantil cuestan extra?"],
      fr: ["Le prix est-il par personne ou forfaitaire?", "Boissons, café et gâteau sont-ils inclus ?", "Combien de serveurs sont prévus?", "Jusqu'à quand changer le nombre d'invités?", "Allergies ou menus enfants sont-ils en supplément?"]
    }
  },
  {
    key: "location",
    categorySlug: "location",
    label: { it: "Location e spazio evento", en: "Venue and event space", es: "Lugar y espacio", fr: "Lieu et espace" },
    title: { it: "Preventivo location", en: "Venue quote", es: "Presupuesto lugar", fr: "Devis lieu" },
    keywords: ["location", "villa", "sala", "ristorante", "agriturismo", "hotel", "venue", "affitto", "noleggio sala", "esclusiva", "parcheggio", "piano b", "pulizie", "orario"],
    included: ["Affitto spazio", "Orari di utilizzo", "Pulizie se indicate", "Parcheggio o aree dedicate", "Piano B se presente"],
    extras: ["Ore extra", "Pulizie finali", "Esclusiva", "Guardíania", "Riscaldamento/climatizzazione", "Tecnica audio/luci"],
    unclear: ["Orario límite", "Vincoli su musica e rumore", "Piano B pioggia", "Caparra e penali", "Fornitori obbligatori"],
    questions: {
      it: [
        "Qual è l'orario massimo reale per musica, ospiti e smontaggio",
        "La location è in esclusiva o possono esserci altri eventi?",
        "Pulizie, parcheggio, climatizzazione e sicurezza sono inclusi?",
        "Esiste un piano B scritto in caso di pioggia o maltempo?",
        "Posso portare fornitori esterni o devo usare quelli imposti?"
      ],
      en: ["What is the real end time for music and teardown?", "Is the venue exclusive?", "Are cleaning, parking and security included?", "Is there a written rain plan?", "Can I bring external suppliers?"],
      es: ["Cuál es el horario limite real", "El lugar es en exclusiva", "Limpieza, parking y seguridad están incluidos", "Hay plan B por lluvia", "Puedo llevar proveedores externos"],
      fr: ["Quelle est l'heure limite réelle", "Le lieu est-il exclusif", "Nettoyage, parking et sécurité sont-ils inclus", "Y a-t-il un plan B pluie", "Puis-je choisir mes prestataires"]
    }
  },
  {
    key: "photoVideo",
    categorySlug: "idee-evento",
    label: { it: "Foto e video", en: "Photo and video", es: "Foto y video", fr: "Photo et video" },
    title: { it: "Preventivo foto/video", en: "Photo/video quote", es: "Presupuesto foto/video", fr: "Devis photo/video" },
    keywords: ["fotografo", "fotografía", "photo", "foto", "video", "videomaker", "drone", "album", "post produzione", "editing", "consegna", "scatti"],
    included: ["Ore di copertura", "Numero fotografi/operatori", "Post-produzione", "Consegna digitale", "Album o video se indicati"],
    extras: ["Ore extra", "Secondo fotografo", "Drone", "Album", "Stampe", "Consegna rapida", "Trasferta"],
    unclear: ["Tempi di consegna", "Numero immagini finali", "Diritti d'uso", "Backup dei file", "Cosa succede se l'evento dura di più"],
    questions: {
      it: [
        "Quante ore di presenza sono incluse e cosa succede se l'evento si allunga?",
        "Quante foto finali consegnano e in che formato?",
        "Album, vidéo, drone e secondo operatore sono inclusi o extra?",
        "Entro quando consegnano anteprima e lavoro completo?",
        "Posso usare le immagini liberamente o ci sono limiti di pubblicazione?"
      ],
      en: ["How many hours are included?", "How many final photos are delivered?", "Are album, vidéo, drone and second shooter included?", "When is delivery?", "Can I publish the images freely?"],
      es: ["¿Cuántas horas están incluidas?", "¿Cuántas fotos finales entregan?", "¿Álbum, video, dron y segundo operador están incluidos?", "¿Cuándo entregan?", "¿Puedo publicar las imágenes?"],
      fr: ["Combien d'heures sont incluses?", "Combien de photos finales sont livrées?", "Album, vidéo, drone et second opérateur sont-ils inclus ?", "Quand livrent-ils ?", "Puis-je publier les images?"]
    }
  },
  {
    key: "flowers",
    categorySlug: "idee-evento",
    label: { it: "Fiori e allestimenti", en: "Flowers and styling", es: "Flores y decoración", fr: "Fleurs et décoration" },
    title: { it: "Preventivo fiori/allestimenti", en: "Flower quote", es: "Presupuesto flores", fr: "Devis fleurs" },
    keywords: ["fiori", "floreale", "bouquet", "centrotavola", "allestimento", "décorazione", "décorazioni", "arco", "candele", "tableau", "mise en place"],
    included: ["Bouquet o composizioni indicate", "Centrotavola", "Trasporto", "Montaggio", "Ritiro materiali se previsto"],
    extras: ["Fiori fuori stagione", "Strutture", "Candele", "Noleggi", "Smontaggio notturno", "Trasferta"],
    unclear: ["Qualità e tipologia dei fiori", "Numero composizioni", "Tempi di montaggio", "Ritiro a fine evento", "Sostituzioni se i fiori non sono disponibili"],
    questions: {
      it: [
        "Quali fiori sono realmente previsti e quali alternative useranno se non disponibili?",
        "Montaggio, smontaggio e ritiro materiali sono inclusi?",
        "Quante composizioni precise sono comprese nel prezzo?",
        "Candele, strutture e noleggi sono inclusi o separati?",
        "Il preventivo cambia se il progetto floreale viene ridotto?"
      ],
      en: ["Which flowers are planned and what alternatives are allowed?", "Are setup and teardown included?", "How many arrangements are included?", "Are candles and rentals included?", "Can the quote change if the styling is reduced?"],
      es: ["¿Qué flores exactas están previstas?", "¿Montaje y desmontaje están incluidos?", "¿Cuántas composiciones incluye?", "¿Velas y alquileres están incluidos?", "¿Cambia el precio si se reduce el montaje?"],
      fr: ["Quelles fleurs exactes sont prévues ?", "Montage et démontage sont-ils inclus ?", "Combien de compositions sont incluses?", "Bougies et locations sont-elles incluses ?", "Le prix change-t-il si on réduit la déco ?"]
    }
  },
  {
    key: "openBar",
    categorySlug: "catering-menu",
    label: { it: "Open bar e beverage", en: "Open bar and drinks", es: "Open bar y bebidas", fr: "Open bar et boissons" },
    title: { it: "Preventivo open bar", en: "Open bar quote", es: "Presupuesto open bar", fr: "Devis open bar" },
    keywords: ["open bar", "cocktail", "barman", "barlady", "drink", "bevande", "alcol", "alcool", "spirits", "vino", "birra", "prosecco"],
    included: ["Numero drink o durata servizio", "Barman", "Ghiaccio e attrezzatura", "Lista cocktail", "Bicchieri se indicati"],
    extras: ["Drink extra", "Premium spirits", "Ore extra", "Ghiaccio", "Bicchieri", "Trasporto", "Licenze o permessi"],
    unclear: ["Consumo illimitato o a numero", "Durata effettiva del servizio", "Qualità alcolici", "Gestione minorenni", "Costo per ospite extra"],
    questions: {
      it: [
        "Open bar significa drink illimitati o numero massimo di consumazioni?",
        "Quante ore di servizio bar sono incluse?",
        "Quali alcolici sono compresi e quali sono premium a parte?",
        "Bicchieri, ghiaccio, banco bar e trasporto sono inclusi?",
        "Come gestiscono ospiti minorenni o persone che non bevono alcol?"
      ],
      en: ["Does open bar mean unlimited drinks or a fixed number?", "How many bar hours are included?", "Which spirits are included?", "Are glasses, ice and transport included?", "How are minors or non-drinkers handled?"],
      es: ["¿Open bar significa ilimitado o número fijo?", "¿Cuántas horas incluye?", "¿Qué alcoholes están incluidos?", "¿Vasos, hielo y transporte están incluidos?", "¿Cómo gestionan menores o no bebedores?"],
      fr: ["Open bar signifie illimité ou nombre fixe?", "Combien d'heures sont incluses?", "Quels alcools sont inclus?", "Verres, glace et transport sont-ils inclus ?", "Comment gèrent-ils mineurs ou non-buveurs?"]
    }
  },
  {
    key: "corporate",
    categorySlug: "eventi-aziendali",
    label: { it: "Team building ed eventi aziendali", en: "Team building and corporate events", es: "Team building y eventos corporativos", fr: "Team building et événements d'entreprise" },
    title: { it: "Preventivo team building o evento aziendale", en: "Team-building or corporate event quote", es: "Presupuesto team building o evento corporativo", fr: "Devis team building ou événement d'entreprise" },
    keywords: [
      "azienda",
      "aziendale",
      "corporate",
      "meeting",
      "convention",
      "team building",
      "teambuilding",
      "workshop",
      "incentive",
      "retreat",
      "kick off",
      "kickoff",
      "all hands",
      "conferenza",
      "seminario",
      "sala meeting",
      "badge",
      "hostess",
      "regia tecnica",
      "facilitatore",
      "facilitatori",
      "service audio",
      "coffee break",
      "evento clienti",
      "corporate event",
      "company event",
      "corporate retreat",
      "team activity",
      "evento de empresa",
      "evento corporativo",
      "actividad de equipo",
      "événement d'entreprise",
      "seminaire d'entreprise",
      "activité team building"
    ],
    included: ["Sala o spazio", "Coffee break o catering", "Tecnica audio/video", "Accoglienza", "Facilitatori o coordinamento"],
    extras: ["Regia tecnica", "Hostess", "Badge", "Guardaroba", "Streaming", "Traduzione", "Materiali o attività extra"],
    unclear: ["Orari tecnici", "Prove audio/video", "Responsabile evento", "Assicurazione", "Penali per cambi programma", "Piano B indoor/outdoor"],
    questions: {
      it: [
        "Sono incluse prove tecniche audio/video prima dell'evento?",
        "Coffee break, acqua e servizio in sala sono conteggiati per tutti i partecipanti?",
        "Hostess, badge, guardaroba e segnaletica sono inclusi o extra?",
        "Chi coordina fornitori e scaletta il giorno dell'evento?",
        "Cosa succede se cambia il numero dei partecipanti o il programma?"
      ],
      en: ["Are technical rehearsals included?", "Are coffee breaks and water included for all attendees?", "Are hostess, badges and signage extra?", "Who coordinates suppliers on the day?", "What if attendees or schedule change?"],
      es: ["¿Las pruebas técnicas están incluidas?", "¿Coffee break y agua cubren a todos?", "¿Hostess, badges y señalética son extra?", "¿Quién coordina proveedores?", "¿Qué pasa si cambia el programa?"],
      fr: ["Les tests techniques sont-ils inclus ?", "Coffee break et eau couvrent-ils tous les participants?", "Hôtesses, badges et signalétique sont-ils extra?", "Qui coordonne les prestataires?", "Que se passe-t-il si le programme change?"]
    }
  }
];

const generalTopic: TopicProfile = {
  key: "general",
  categorySlug: "quanto-costa",
  label: { it: "Preventivo evento", en: "Event quote", es: "Presupuesto evento", fr: "Devis événementiel" },
  title: { it: "Preventivo evento", en: "Event quote", es: "Presupuesto evento", fr: "Devis événementiel" },
  keywords: [],
  included: ["Servizio principale", "Importi indicati", "Condizioni presenti nel preventivo"],
  extras: ["Ore extra", "IVA", "Trasporto", "Materiali", "Personale aggiuntivo"],
  unclear: ["Caparra", "Saldo", "Annullamento", "Cambio data", "Numero minimo"],
  questions: {
    it: [
      "Quali voci sono davvero incluse e quali sono solo stimate?",
      "Quali costi possono aumentare dopo la conferma?",
      "Caparra, saldo e penali sono scritti in modo chiaro?",
      "Il prezzo cambia se cambiano data, orario o numero invitati?",
      "C'à un referente unico il giorno dell'evento"
    ],
    en: ["Which items are truly included?", "Which costs can increase later?", "Are deposit and cancellation clear?", "Can price change with date or guests?", "Is there one event-day contact?"],
    es: ["¿Qué partidas están realmente incluidas?", "¿Qué costes pueden subir después?", "¿Depósito y cancelación son claros?", "¿Cambia el precio con fecha o invitados?", "¿Hay un referente único?"],
    fr: ["Quels éléments sont vraiment inclus", "Quels coûts peuvent augmenter", "Acompte et annulation sont-ils clairs", "Le prix change-t-il avec date ou invités", "Y a-t-il un contact unique ?"]
  }
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

function hasAny(value: string, words: string[]) {
  const normalized = normalize(value);
  return words.some((word) => normalized.includes(normalize(word)));
}

function linesFromText(text: string) {
  return text
    .split(/\r?\n|;/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function euroValues(text: string) {
  return text.match(/(?:eur|euro|euros|usd|gbp|chf|\u20ac|\$|gbp)?\s*\d{2,7}(?:[.,]\d{1,2})?\s*(?:eur|euro|euros|usd|gbp|chf|\u20ac)?/gi) ?? [];
}

function hasIndicativePricing(text: string) {
  return hasAny(text, [
    "à partire da",
    "prezzo indicativo",
    "indicativo",
    "indicativa",
    "circa",
    "per persona",
    "a persona",
    "cad",
    "starting from",
    "from euro",
    "guide price",
    "per person",
    "approx",
    "desde",
    "à partir de",
    "precio orientativo",
    "por persona",
    "environ",
    "à partir de",
    "prix indicatif",
    "par personne"
  ]);
}

function hasReservedNegotiation(text: string) {
  return hasAny(text, [
    "trattativa riservata",
    "prezzo su richiesta",
    "su richiesta",
    "da concordare",
    "on request",
    "price on request",
    "reserved negotiation",
    "to be agreed",
    "bajo solicitud",
    "precio bajo solicitud",
    "negociación reservada",
    "a convenir",
    "sur demande",
    "prix sur demande",
    "negociation reservee",
    "a convenir"
  ]);
}

function classifyFile(file: File): UploadedQuoteFile["type"] {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("image/")) return "image";
  if (file.type.includes("pdf") || name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".doc") || name.endsWith(".docx") || name.endsWith(".rtf")) return "word";
  if (file.type.includes("text") || name.endsWith(".txt") || name.endsWith(".csv")) return "text";
  return "other";
}

function fileLabel(file: File, type: UploadedQuoteFile["type"], copy: AnalyzerCopy) {
  const typeLabel = copy.fileTypeLabels[type];
  const sizeKb = Math.max(1, Math.round(file.size / 1024));
  return `${typeLabel} - ${copy.hiddenFileName} - ${sizeKb} KB`;
}

let tesseractScriptPromise: Promise<void> | null = null;

function loadTesseract() {
  if (typeof window === "undefined") return Promise.reject(new Error("OCR unavailable"));
  if (window.Tesseract) return Promise.resolve();
  if (tesseractScriptPromise) return tesseractScriptPromise;

  tesseractScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-oe-tesseract]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("OCR script failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    script.async = true;
    script.defer = true;
    script.dataset.oeTesseract = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("OCR script failed"));
    document.head.appendChild(script);
  });

  return tesseractScriptPromise;
}

function ocrLanguage(locale: QuoteAnalyzerLocale) {
  if (locale === "es") return "spa+ita+eng";
  if (locale === "fr") return "fra+ita+eng";
  if (locale === "en") return "eng+ita";
  return "ita+eng";
}

async function readImageText(file: File, locale: QuoteAnalyzerLocale) {
  await loadTesseract();
  if (!window.Tesseract) throw new Error("OCR unavailable");
  const primaryLanguage = ocrLanguage(locale);
  const fallbackLanguages = new Set([primaryLanguage, "eng+ita", "eng", "ita"]);
  let bestText = "";
  for (const language of fallbackLanguages) {
    try {
      const result = await window.Tesseract.recognize(file, language);
      const current = (result.data.text ?? "").replace(/\n{3,}/g, "\n\n").trim();
      if (current.length > bestText.length) {
        bestText = current;
      }
      if (bestText.length > 450) break;
    } catch {
      continue;
    }
  }
  if (!bestText) throw new Error("OCR unavailable");
  return bestText;
}

const serviceTopicMap: Partial<Record<QuoteServiceType, TopicKey>> = {
  dj: "music",
  band: "music",
  fotografo: "photoVideo",
  catering: "catering",
  location: "location",
  team_building: "corporate",
  evento_aziendale: "corporate",
  fiori: "flowers",
  open_bar: "openBar"
};

const quoteSupplierCategoryMap: Partial<Record<QuoteServiceType, string>> = {
  dj: "musica",
  band: "musica",
  fotografo: "fotografi-e-videomaker",
  catering: "catering-e-gastronomia",
  location: "location",
  team_building: "event-planner",
  evento_aziendale: "event-planner",
  fiori: "fioristi-allestimenti-floreali-e-verde",
  open_bar: "catering-e-gastronomia"
};

const topicSupplierCategoryMap: Partial<Record<TopicKey, string>> = {
  music: "musica",
  catering: "catering-e-gastronomia",
  location: "location",
  photoVideo: "fotografi-e-videomaker",
  flowers: "fioristi-allestimenti-floreali-e-verde",
  openBar: "catering-e-gastronomia",
  corporate: "event-planner"
};

function serviceFromDetectedTopic(text: string, topicKey: TopicKey, fallback: QuoteServiceType): QuoteServiceType {
  if (topicKey === "music") {
    return hasAny(text, ["band", "live", "cantante", "musicisti", "set musicale"]) ? "band" : "dj";
  }
  if (topicKey === "catering") return "catering";
  if (topicKey === "location") return "location";
  if (topicKey === "photoVideo") return "fotografo";
  if (topicKey === "flowers") return "fiori";
  if (topicKey === "openBar") return "open_bar";
  if (topicKey === "corporate") {
    return hasAny(text, ["team building", "teambuilding", "facilitatore", "facilitatori", "workshop", "retreat", "attività di team"]) ? "team_building" : "evento_aziendale";
  }
  return fallback;
}

function detectServiceFromContent(text: string, fallback: QuoteServiceType) {
  const topic = detectTopic(text, fallback);
  return serviceFromDetectedTopic(text, topic.key, fallback);
}

function detectTopic(source: string, preferredService: QuoteServiceType) {
  const preferredKey = preferredService ? serviceTopicMap[preferredService] : undefined;
  const normalized = normalize(source);
  const scores = topicProfiles.map((topic) => {
    const keywordScore = topic.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalize(keyword);
      if (!normalizedKeyword || !normalized.includes(normalizedKeyword)) return total;
      const weight = normalizedKeyword.length >= 8 || normalizedKeyword.includes(" ") ? 2 : 1;
      return total + weight;
    }, 0);

    return {
      topic,
      score: keywordScore,
      weightedScore: keywordScore + (topic.key === preferredKey ? 1.5 : 0)
    };
  });
  scores.sort((a, b) => b.score - a.score);
  const contentWinner = scores[0];
  const preferredScore = scores.find((item) => item.topic.key === preferredKey)?.score ?? 0;

  if (contentWinner?.score >= 3 && contentWinner.topic.key !== preferredKey && contentWinner.score >= preferredScore + 2) {
    return contentWinner.topic;
  }

  scores.sort((a, b) => b.weightedScore - a.weightedScore);
  return scores[0]?.weightedScore ? scores[0].topic : generalTopic;
}

type QuoteSupplierStripProps = {
  active: boolean;
  locale: QuoteAnalyzerLocale;
  serviceType: QuoteServiceType;
  topicKey: TopicKey;
  topicLabel: string;
  serviceLabel: string;
  quoteText: string;
  city: string;
  province: string;
  region: string;
  eventLabel: string;
};

type QuoteSupplierSearchResponse = {
  ok: boolean;
  results?: VibesSupplierCard[];
};

function quoteSupplierStripCopy(locale: QuoteAnalyzerLocale) {
  if (locale === "en") {
    return {
      title: "Italian suppliers related to this quote",
      text: "Suggested from Vibes Planner by service, area and the quote context. Premium profiles appear first, then standard showcases.",
      count: "suppliers",
      source: "Vibes Planner showcases",
      nationwide: "Works across Italy",
      near: "km from you",
      fallbackArea: "Italy"
    };
  }
  if (locale === "es") {
    return {
      title: "Proveedores italianos relacionados con este presupuesto",
      text: "Sugeridos desde Vibes Planner por servicio, zona y contexto del presupuesto. Primero perfiles Premium, luego vitrinas base.",
      count: "proveedores",
      source: "Vitrinas Vibes Planner",
      nationwide: "Trabaja en toda Italia",
      near: "km de ti",
      fallbackArea: "Italia"
    };
  }
  if (locale === "fr") {
    return {
      title: "Prestataires italiens liés à ce devis",
      text: "Suggérés depuis Vibes Planner selon le service, la zone et le contexte du devis. Les profils Premium passent d'abord, puis les vitrines standard.",
      count: "prestataires",
      source: "Vitrines Vibes Planner",
      nationwide: "Travaille dans toute l'Italie",
      near: "km de vous",
      fallbackArea: "Italie"
    };
  }
  return {
    title: "Fornitori Vibes coerenti con questo preventivo",
    text: "Li selezioniamo in base a servizio, zona e contesto del preventivo. Prima i profili Premium, poi le vetrine base.",
    count: "fornitori",
    source: "Vetrine Vibes Planner",
    nationwide: "Lavora in tutta Italia",
    near: "km da te",
    fallbackArea: "Italia"
  };
}

function quoteSupplierCategory(serviceType: QuoteServiceType, topicKey: TopicKey) {
  return quoteSupplierCategoryMap[serviceType] ?? topicSupplierCategoryMap[topicKey] ?? "";
}

function quoteSupplierCategoryLabel(supplier: VibesSupplierCard, locale: QuoteAnalyzerLocale) {
  const category = VIBES_SUPPLIER_CATEGORIES.find((item) => item.slug === supplier.categorySlug);
  return category ? supplierCategoryLabel(category, locale) : supplier.category;
}

function quoteSupplierPreview(supplier: VibesSupplierCard, locale: QuoteAnalyzerLocale) {
  const category = quoteSupplierCategoryLabel(supplier, locale);
  const services = supplier.services
    .filter(Boolean)
    .slice(0, 2)
    .map((service) => supplierSubcategoryLabel(service, locale));
  const serviceText = services.length ? services.join(", ") : category;
  const place = supplier.location || (locale === "en" ? "Italy" : locale === "fr" ? "Italie" : "Italia");

  if (locale === "en") return `Vibes Planner profile in ${place}, useful for comparing ${serviceText}.`;
  if (locale === "es") return `Vitrina Vibes Planner en ${place}, útil para comparar ${serviceText}.`;
  if (locale === "fr") return `Vitrine Vibes Planner à ${place}, utile pour comparer ${serviceText}.`;
  return `Vetrina Vibes Planner a ${place}, utile per confrontare ${serviceText}.`;
}

function quoteSupplierDistanceLabel(supplier: VibesSupplierCard, locale: QuoteAnalyzerLocale) {
  const copy = quoteSupplierStripCopy(locale);
  if (typeof supplier.distanceKm === "number") {
    return `${Math.max(1, Math.round(supplier.distanceKm))} ${copy.near}`;
  }
  if (supplier.serviceArea === "italy") return copy.nationwide;
  return supplier.location || copy.fallbackArea;
}

function QuoteSupplierStrip({
  active,
  locale,
  serviceType,
  topicKey,
  topicLabel,
  serviceLabel,
  quoteText,
  city,
  province,
  region,
  eventLabel
}: QuoteSupplierStripProps) {
  const copy = quoteSupplierStripCopy(locale);
  const searchCopy = supplierSearchCopy(locale);
  const [suppliers, setSuppliers] = useState<VibesSupplierCard[]>([]);

  useEffect(() => {
    if (!active) {
      setSuppliers([]);
      return;
    }

    let cancelled = false;
    const category = quoteSupplierCategory(serviceType, topicKey);
    const area = province || city || region;
    const quoteKeywords = quoteText
      .replace(/\s+/g, " ")
      .split(" ")
      .filter((word) => word.length > 3)
      .slice(0, 26)
      .join(" ");
    const query = [serviceLabel, topicLabel, city, region, eventLabel, quoteKeywords].filter(Boolean).join(" ");

    async function load(coordinates?: { lat: number; lng: number }) {
      const params = new URLSearchParams();
      params.set("locale", locale);
      if (query) params.set("query", query);
      if (category) params.set("category", category);
      if (area) params.set("province", area);
      if (eventLabel) params.set("eventType", eventLabel);
      if (coordinates) {
        params.set("lat", coordinates.lat.toFixed(5));
        params.set("lng", coordinates.lng.toFixed(5));
      }

      try {
        const response = await fetch(`/api/vibes-suppliers/search?${params.toString()}`, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache"
          }
        });
        const data = (await response.json().catch(() => null)) as QuoteSupplierSearchResponse | null;
        if (!cancelled && response.ok && data?.ok === true) {
          setSuppliers((data.results ?? []).slice(0, 100));
        }
      } catch {
        if (!cancelled) setSuppliers([]);
      }
    }

    void load();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          void load({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => undefined,
        {
          enableHighAccuracy: false,
          maximumAge: 30 * 60 * 1000,
          timeout: 6000
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [active, city, eventLabel, locale, province, quoteText, region, serviceLabel, serviceType, topicKey, topicLabel]);

  if (!active || !suppliers.length) return null;

  return (
    <section className="rounded-md border border-violet-cta/20 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">{copy.source}</p>
          <h2 className="mt-1 text-base font-semibold text-ink">{copy.title}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">{copy.text}</p>
        </div>
        <p className="inline-flex w-fit rounded-md bg-cream px-2.5 py-1.5 text-xs font-semibold text-muted">
          {suppliers.length} {copy.count}
        </p>
      </div>
      <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
        {suppliers.map((supplier) => (
          <article key={supplier.id} className="flex w-[16.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-md border border-line bg-cream shadow-sm sm:w-[18rem]">
            <div className="relative h-32 bg-petal sm:h-36">
              {supplier.imageUrl ? (
                <img src={supplier.imageUrl} alt={supplier.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted">Vibes Planner</div>
              )}
              {supplier.premium ? (
                <span className="absolute left-2 top-2 rounded-md bg-[#c03aa0] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.06em] text-white">
                  Premium Vibes Club
                </span>
              ) : null}
            </div>
            <div className="flex flex-1 flex-col p-2.5">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{quoteSupplierCategoryLabel(supplier, locale)}</p>
              <h3 className="mt-1.5 line-clamp-2 min-h-[2.35rem] text-sm font-semibold leading-snug text-ink">{supplier.name}</h3>
              <p className="mt-1.5 line-clamp-2 min-h-[2.55rem] text-xs leading-5 text-muted">{quoteSupplierPreview(supplier, locale)}</p>
              <p className="mt-2 truncate rounded-md bg-white px-2.5 py-1.5 text-[11px] font-semibold text-muted">
                {quoteSupplierDistanceLabel(supplier, locale)}
              </p>
              <a
                href={supplier.vibesUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="focus-ring mt-2 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-cta"
              >
                <img src="/partners/vibes-planner/logo.jpg" alt="" className="h-5 w-5 rounded bg-white object-cover" />
                {searchCopy.external}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function pickUnique(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function scoreLabel(score: number, copy: AnalyzerCopy) {
  if (score < 4) return copy.scoreLabels.weak;
  if (score < 6.5) return copy.scoreLabels.check;
  if (score < 8.5) return copy.scoreLabels.fair;
  return copy.scoreLabels.strong;
}

function localizedIncludedIntro(locale: QuoteAnalyzerLocale, topicLabel: string) {
  if (locale === "en") return `The offer appears to concern ${topicLabel.toLowerCase()}.`;
  if (locale === "es") return `La oferta parece referirse a ${topicLabel.toLowerCase()}.`;
  if (locale === "fr") return `L'offre semble concerner ${topicLabel.toLowerCase()}.`;
  return `L'offerta sembra riguardare ${topicLabel.toLowerCase()}.`;
}

function localizedAmountsIntro(locale: QuoteAnalyzerLocale, amounts: string[], indicative: boolean, reserved: boolean) {
  if (reserved) {
    if (locale === "en") return "The supplier does not give a final public price yet: the quote uses a reserved or on-request negotiation.";
    if (locale === "es") return "El proveedor no da todavía un precio final público: el presupuesto usa una negociación reservada o bajo solicitud.";
    if (locale === "fr") return "Le prestataire ne donne pas encore de prix final public : le devis indique une negociation reservee ou un prix sur demande.";
    return "Il fornitore non indica ancora un prezzo finale pubblico: il preventivo usa una trattativa riservata o un prezzo su richiesta.";
  }

  if (!amounts.length) {
    if (locale === "en") return "I do not see a clear amount yet, so the first check is to ask for a comparable written price.";
    if (locale === "es") return "No veo todavía un importe claro, así que el primer control es pedir un precio escrito comparable.";
    if (locale === "fr") return "Je ne vois pas encore de montant clair, donc le premier contrôle est de demander un prix écrit comparable.";
    return "Non vedo ancora un importo chiaro, quindi il primo controllo è chiedere un prezzo scritto e confrontabile.";
  }

  const amountText = amounts.slice(0, 3).join(", ");
  if (indicative) {
    if (locale === "en") return `The visible amount looks indicative or per person (${amountText}), so it should not be judged as a final total yet.`;
    if (locale === "es") return `El importe visible parece orientativo o por persona (${amountText}), por eso no va juzgado como total final todavía.`;
    if (locale === "fr") return `Le montant visible semble indicatif ou par personne (${amountText}), donc il ne faut pas le juger comme total final pour l'instant.`;
    return `L'importo visibile sembra indicativo o a persona (${amountText}), quindi non va giudicato come totale finale definitivo.`;
  }

  if (locale === "en") return `The visible amount${amounts.length > 1 ? "s are" : " is"} ${amountText}.`;
  if (locale === "es") return `El importe visible${amounts.length > 1 ? " incluye" : " es"} ${amountText}.`;
  if (locale === "fr") return `Le montant visible${amounts.length > 1 ? " comprend" : " est"} ${amountText}.`;
  return `Gli importi visibili sono ${amountText}.`;
}

function localizedReading(locale: QuoteAnalyzerLocale, indicative: boolean, reserved: boolean, topicLabel: string) {
  if (reserved) {
    if (locale === "en") return "A reserved negotiation is not automatically negative, but it needs boundaries: what is included, what changes the price and when the supplier will confirm the final amount.";
    if (locale === "es") return "Una negociación reservada no es automáticamente negativa, pero necesita límites: qué incluye, qué cambia el precio y cuándo se confirma el importe final.";
    if (locale === "fr") return "Une négociation réservée n'est pas négative en soi, mais elle demande des límites : ce qui est inclus, ce qui change le prix et quand le montant final sera confirmé.";
    return "La trattativa riservata non è automáticamente negativa, ma va incorniciata: cosa include, cosa può cambiare il prezzo e quando arriva l'importo finale.";
  }

  if (indicative) {
    if (locale === "en") return "A starting price or per-person price can be normal for Italian events. The key is asking which conditions turn it into the real final price.";
    if (locale === "es") return "Un precio desde o por persona puede ser normal en eventos italianos. Lo importante es preguntar que condiciones lo convierten en precio final real.";
    if (locale === "fr") return "Un prix à partir de ou par personne peut être normal pour les événements en Italie. L'essentiel est de demander quelles conditions le transforment en prix final réel.";
    return "Un prezzo à partire da o a persona può essere normale negli eventi italiani. Il punto ? capire quali condizioni lo trasformano nel prezzo finale reale.";
  }

  if (locale === "en") return `For ${topicLabel.toLowerCase()}, the quote should be judged by comparing hours, exclusions, staff, setup and payment rules, not only the headline amount.`;
  if (locale === "es") return `Para ${topicLabel.toLowerCase()}, conviene juzgar el presupuesto comparando horas, exclusiones, personal, montaje y pagos, no solo la cifra principal.`;
  if (locale === "fr") return `Pour ${topicLabel.toLowerCase()}, il faut juger le devis en comparant heures, exclusions, personnel, installation et paiements, pas seulement le montant principal.`;
  return `Per ${topicLabel.toLowerCase()}, il preventivo va giudicato confrontando ore, esclusioni, personale, allestimento e pagamenti, non solo la cifra principale.`;
}

function buildOfferSummary(
  locale: QuoteAnalyzerLocale,
  topic: TopicProfile,
  amounts: string[],
  included: string[],
  extras: string[],
  indicative: boolean,
  reserved: boolean
) {
  const topicLabel = topic.label[locale];
  const includedText = included.slice(0, 3).join(", ");
  const extraText = extras.slice(0, 2).join(", ");
  const parts = [
    localizedIncludedIntro(locale, topicLabel),
    localizedAmountsIntro(locale, amounts, indicative, reserved)
  ];

  if (includedText) {
    if (locale === "en") parts.push(`The clearest included items seem to be: ${includedText}.`);
    else if (locale === "es") parts.push(`Las partidas más claras parecen ser: ${includedText}.`);
    else if (locale === "fr") parts.push(`Les elements les plus clairs semblent être : ${includedText}.`);
    else parts.push(`Le voci più chiare sembrano: ${includedText}.`);
  }

  if (extraText) {
    if (locale === "en") parts.push(`The first items to check as possible extras are: ${extraText}.`);
    else if (locale === "es") parts.push(`Los primeros puntos a revisar como posibles extras son: ${extraText}.`);
    else if (locale === "fr") parts.push(`Les premiers points à vérifier comme extras possibles sont : ${extraText}.`);
    else parts.push(`I primi punti da controllare come possibili extra sono: ${extraText}.`);
  }

  return parts.join(" ");
}

function postLabels(locale: QuoteAnalyzerLocale) {
  if (locale === "en") {
    return {
      included: "What seems included",
      unclear: "What I still need to understand",
      questions: "Questions I would ask before confirming"
    };
  }
  if (locale === "es") {
    return {
      included: "Lo que parece incluido",
      unclear: "Lo que todavía necesito entender",
      questions: "Preguntas que haria antes de confirmar"
    };
  }
  if (locale === "fr") {
    return {
      included: "Ce qui semble inclus",
      unclear: "Ce que je dois encore comprendre",
      questions: "Questions que je poserais avant de confirmer"
    };
  }
  return {
    included: "Cosa sembra incluso",
    unclear: "Cosa devo ancora capire",
    questions: "Domande che farei prima di confermare"
  };
}

function qualityScore(text: string, topic: TopicProfile, hasFiles: boolean) {
  const normalized = normalize(text);
  const lines = linesFromText(text);
  const amounts = euroValues(text);
  const indicativePricing = hasIndicativePricing(normalized);
  const reservedNegotiation = hasReservedNegotiation(normalized);

  if (!text.trim() && hasFiles) return 5;

  let score = 5.2;

  if (amounts.length >= 1) score += 0.8;
  if (amounts.length >= 3) score += 0.3;
  if (lines.length >= 4) score += 0.8;
  if (hasAny(normalized, ["iva", "vat", "tax", "imposte", "tasse"])) score += 0.7;
  if (hasAny(normalized, ["caparra", "accontó", "deposito", "deposit", "acompte"])) score += 0.4;
  if (hasAny(normalized, ["annullamento", "cancellazione", "cancellation", "cancelación", "annulation", "penale"])) score += 0.7;
  if (hasAny(normalized, ["ore", "orario", "hours", "hora", "heures", "dalle", "fino"])) score += 0.5;
  if (hasAny(normalized, ["persona", "ospiti", "invitati", "guest", "invitados", "invités"])) score += 0.5;
  if (topic.key !== "general") score += 0.4;
  if (hasFiles) score += 0.2;
  if (indicativePricing) score += 0.3;
  if (reservedNegotiation) score -= 0.25;

  if (hasAny(normalized, ["da definire", "eventuale", "variabile", "salvo"])) score -= indicativePricing || reservedNegotiation ? 0.25 : 0.55;
  if (text.trim().length < 80) score -= hasFiles ? 0.45 : 0.75;
  if (lines.length <= 2 && hasFiles) score -= 0.25;
  if (!amounts.length) score -= reservedNegotiation ? 0.15 : 0.45;

  return Math.max(1, Math.min(10, Math.round(score * 2) / 2));
}

function buildAnalysis(text: string, sourceForTopic: string, copy: AnalyzerCopy, locale: QuoteAnalyzerLocale, hasFiles: boolean, serviceType: QuoteServiceType) {
  const topic = detectTopic(sourceForTopic, serviceType);
  const lines = linesFromText(text);
  const amounts = euroValues(text);
  const indicativePricing = hasIndicativePricing(text);
  const reservedNegotiation = hasReservedNegotiation(text);
  const includedFromText = lines.filter((line) => hasAny(line, ["inclus", "compres", "included", "incluido", "menu", "servizio", "service", "sala", "impianto", "ore", "camerier", "bevande"]));
  const extrasFromText = lines.filter((line) => hasAny(line, ["extra", "esclus", "excluded", "supplement", "à parte", "optional", "facoltativo", "iva", "trasporto", "ore extra"]));
  const unclearFromText = lines.filter((line) => hasAny(line, ["da definire", "salvo", "circa", "eventuale", "variabile", "minimo", "penale", "caparra", "deposit", "accontó"]));

  const included = pickUnique([...includedFromText.slice(0, 4), ...topic.included, ...copy.fallbackIncluded]).slice(0, 6);
  const extras = pickUnique([...extrasFromText.slice(0, 4), ...topic.extras, ...copy.fallbackExtras]).slice(0, 6);
  const unclear = pickUnique([...unclearFromText.slice(0, 4), ...topic.unclear, ...copy.fallbackUnclear]).slice(0, 6);
  const questions = pickUnique([...topic.questions[locale], ...copy.defaultQuestions]).slice(0, 7);
  const score = qualityScore(text, topic, hasFiles);
  const summary = buildOfferSummary(locale, topic, amounts, included, extras, indicativePricing, reservedNegotiation);
  const reading = localizedReading(locale, indicativePricing, reservedNegotiation, topic.label[locale]);
  const comparison =
    amounts.length > 1
      ? copy.moneyComparison(amounts.length)
      : hasFiles
        ? copy.fileOnlyText
        : copy.defaultComparison;
  const labels = postLabels(locale);
  const postLines = [
    copy.filePostIntro,
    "",
    copy.publicPostIntro,
    summary,
    "",
    `${copy.topicTitle}: ${topic.label[locale]}`,
    `${copy.scoreTitle}: ${score}/10 - ${scoreLabel(score, copy)}`,
    "",
    `${copy.detailedReading}:`,
    reading,
    "",
    `${labels.included}:`,
    ...included.slice(0, 4).map((item) => `- ${item}`),
    "",
    `${labels.unclear}:`,
    ...unclear.slice(0, 4).map((item) => `- ${item}`),
    "",
    `${labels.questions}:`,
    ...questions.slice(0, 5).map((item) => `- ${item}`)
  ];

  return {
    topic,
    included,
    extras,
    unclear,
    questions,
    summary,
    reading,
    comparison,
    score,
    scoreLabel: scoreLabel(score, copy),
    publicPost: postLines.join("\n")
  };
}

function aiFinding(label: string, fallbackReason: string): QuoteFinding {
  return {
    label,
    priority: "Media",
    reason: fallbackReason
  };
}

function aiAnalysisToReport(report: QuoteAnalysisReport, aiAnalysis: AiQuoteAnalysisState | null, locale: QuoteAnalyzerLocale): QuoteAnalysisReport {
  if (!aiAnalysis) return report;

  const uncertainReason = aiAnalysis.score_note || (locale === "en" ? "Not fully clear yet" : locale === "es" ? "Aún poco claro" : locale === "fr" ? "Pas complètement clair" : "Ancora da verificare");
  const asFindings = (items: string[]): QuoteFinding[] =>
    pickUnique(items).length
      ? pickUnique(items).map((item) => aiFinding(item, uncertainReason))
      : [{ label: uncertainReason, priority: "Media", reason: uncertainReason }];

  return {
    ...report,
    detected_service: aiAnalysis.detected_service && aiAnalysis.detected_service !== "altro" ? aiAnalysis.detected_service : report.detected_service,
    user_summary: aiAnalysis.user_summary || report.user_summary,
    public_anonymized_summary: aiAnalysis.public_anonymized_summary || report.public_anonymized_summary,
    included_items: pickUnique(aiAnalysis.included_items).slice(0, 9),
    unclear_items: asFindings(aiAnalysis.unclear_items).slice(0, 8),
    possible_hidden_costs: pickUnique(aiAnalysis.possible_hidden_costs).slice(0, 8),
    questions_to_ask: pickUnique(aiAnalysis.questions_to_ask).slice(0, 8),
    supplier_message_draft: aiAnalysis.supplier_message_draft || report.supplier_message_draft,
    recommended_next_action: aiAnalysis.recommended_next_action || report.recommended_next_action
  };
}

function compactSentence(value: string, maxLength = 430) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).replace(/\s+\S*$/, "")}...`;
}

function joinHumanList(items: string[], fallback: string) {
  const cleanItems = pickUnique(items.map((item) => item.replace(/\s+/g, " ").trim()).filter(Boolean)).slice(0, 3);
  return cleanItems.length ? cleanItems.join(", ") : fallback;
}

function formatCommunityDiscussion(
  locale: QuoteAnalyzerLocale,
  report: QuoteAnalysisReport,
  result: ReturnType<typeof buildAnalysis>,
  serviceLabel: string,
  city: string
) {
  const place = city.trim();
  const summary = compactSentence(report.public_anonymized_summary || report.user_summary || result.summary);
  const included = joinHumanList(report.included_items, result.included[0] ?? result.topic.label[locale]);
  const unclear = joinHumanList(
    report.unclear_items.map((item) => item.label),
    report.possible_hidden_costs[0] ?? result.unclear[0] ?? ""
  );
  const firstQuestion = report.questions_to_ask[0] ?? result.questions[0] ?? "";

  if (locale === "en") {
    return [
      `Hi, I received this Italian ${serviceLabel.toLowerCase()} quote${place ? ` for an event in ${place}` : ""} and I would like to compare it before confirming.`,
      `From what I can read, the offer seems to include ${included}. ${summary}`,
      `I still have doubts about ${unclear || "a few conditions that are not written clearly"}.`,
      `Would you ask the supplier anything else before accepting it${firstQuestion ? ` For example: ${firstQuestion}` : ""}`
    ].join("\n\n");
  }

  if (locale === "es") {
    return [
      `Hola, he recibido este presupuesto italiano de ${serviceLabel.toLowerCase()}${place ? ` para un evento en ${place}` : ""} y me gustaría compararlo antes de confirmar.`,
      `Por lo que leo, la oferta parece incluir ${included}. ${summary}`,
      `Todavia tengo dudas sobre ${unclear || "algunas condiciones que no estan escritas con claridad"}.`,
      `Antes de aceptarlo, ¿qué preguntaríais al proveedor${firstQuestion ? `à Por ejemplo: ${firstQuestion}` : "?"}`
    ].join("\n\n");
  }

  if (locale === "fr") {
    return [
      `Bonjour, j'ai reçu ce devis italien de ${serviceLabel.toLowerCase()}${place ? ` pour un événement  a ${place}` : ""} et j'aimerais le comparer avant de confirmer.`,
      `D'après ce que je lis, l'offre semble inclure ${included}. ${summary}`,
      `J'ai encore des doutes sur ${unclear || "certaines conditions qui ne sont pas assez claires"}.`,
      `Avant de l'accepter, que demanderiez-vous au prestataire${firstQuestion ? ` Par exemple : ${firstQuestion}` : ""}`
    ].join("\n\n");
  }

  return [
    `Ciao, ho ricevuto questo preventivo per ${serviceLabel.toLowerCase()}${place ? `  a ${place}` : ""} e prima di confermare vorrei un parere da chi ci è già passato.`,
    `Da quello che leggo, l'offerta sembra includere ${included}. ${summary}`,
    `Mi restano però alcuni dubbi su ${unclear || "alcune condizioni non scritte in modo chiaro"}.`,
    `Secondo voi cosa dovrei farmi mettere per iscritto prima di dire sì${firstQuestion ? ` Ad esempio: ${firstQuestion}` : ""}`
  ].join("\n\n");
}

export function QuoteAnalyzer({ locale = "it", defaultService = "altro" }: { locale?: QuoteAnalyzerLocale; defaultService?: QuoteServiceType }) {
  const copy = copies[locale];
  const formCopy = formCopies[locale];
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [imageText, setImageText] = useState("");
  const [serviceType, setServiceType] = useState<QuoteServiceType>(defaultService);
  const [eventType, setEventType] = useState<QuoteEventType>("matrimonio");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [region, setRegion] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestsCount, setGuestsCount] = useState("");
  const [durationEstimate, setDurationEstimate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [objective, setObjective] = useState<QuoteObjective>("domande_fornitore");
  const [selectedSpecifics, setSelectedSpecifics] = useState<string[]>([]);
  const [files, setFiles] = useState<UploadedQuoteFile[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [, setOcrStatus] = useState<"idle" | "reading" | "ready" | "failed">("idle");
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "ready" | "unavailable" | "error">("idle");
  const [aiAnalysis, setAiAnalysis] = useState<AiQuoteAnalysisState | null>(null);
  const lastAiSignature = useRef("");
  const sourceText = [rawText, imageText].filter(Boolean).join("\n\n");
  const redaction = useMemo(() => redactQuoteText(sourceText), [sourceText]);
  const redactedText = redaction.redactedText;
  const sourceForTopic = useMemo(
    () => [redactedText, ...files.map((file) => file.privateName)].filter(Boolean).join(" "),
    [files, redactedText]
  );
  const hasText = redactedText.trim().length > 20;
  const hasMaterial = hasText || files.length > 0;
  const removedCount = redaction.totalRedactions;
  const report = useMemo(
    () =>
      analyzeQuote({
        locale,
        text: redactedText,
        serviceType,
        eventType,
        city,
        province,
        region,
        eventDate,
        guestsCount: guestsCount ? Number(guestsCount) : null,
        durationEstimate,
        totalAmount,
        objective,
        serviceSpecificFields: selectedSpecifics,
        fileNames: files.map((file) => file.privateName)
      }),
    [city, durationEstimate, eventDate, eventType, files, guestsCount, locale, objective, province, redactedText, region, selectedSpecifics, serviceType, totalAmount]
  );
  const displayReport = useMemo(() => aiAnalysisToReport(report, aiAnalysis, locale), [aiAnalysis, locale, report]);
  const analysisServiceType = displayReport.detected_service || serviceType;
  const quality = useMemo(
    () =>
      analyzeQuoteQuality({
        locale,
        rawText: sourceText,
        sanitizedText: redactedText,
        serviceType: analysisServiceType,
        eventType,
        city,
        province,
        region,
        eventDate,
        guests: guestsCount,
        estimatedDuration: durationEstimate,
        indicatedAmount: totalAmount,
        userGoal: objective,
        selectedDetails: selectedSpecifics
      }),
    [analysisServiceType, city, durationEstimate, eventDate, eventType, guestsCount, locale, objective, province, rawText, redactedText, region, selectedSpecifics, sourceText, totalAmount]
  );
  const result = useMemo(
    () => buildAnalysis(redactedText, sourceForTopic, copy, locale, files.length > 0, analysisServiceType),
    [analysisServiceType, copy, files.length, locale, redactedText, sourceForTopic]
  );
  const detectedServiceLabel = formCopy.serviceOptions[displayReport.detected_service] ?? result.topic.label[locale];
  const communityDiscussion = useMemo(
    () => formatCommunityDiscussion(locale, displayReport, result, detectedServiceLabel, city),
    [city, detectedServiceLabel, displayReport, locale, result]
  );
  const hasAiReport = aiStatus === "ready" && aiAnalysis !== null;
  const isWaitingForAi = hasText && !hasAiReport && aiStatus !== "error" && aiStatus !== "unavailable";
  const canOpenDiscussion = hasAiReport;
  const askPath = locale === "it" ? "/fai-domanda" : localizedStaticPath(locale, "ask");

  function toggleSpecific(value: string) {
    setSelectedSpecifics((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  }

  function handleServiceTypeChange(value: string) {
    const nextService = value as QuoteServiceType;
    setServiceType(nextService);
    setSelectedSpecifics((current) => current.filter((item) => serviceSpecificOptions[nextService].some((option) => option.value === item)));
  }

  function autoSelectDetailsFromText(text: string) {
    if (!text.trim()) return;
    const detectedService = detectServiceFromContent(text, serviceType);
    const optionService = detectedService === "altro" ? serviceType : detectedService;
    if (optionService !== serviceType) {
      setServiceType(optionService);
      setSelectedSpecifics((current) => current.filter((item) => serviceSpecificOptions[optionService].some((option) => option.value === item)));
    }
    const detected = serviceSpecificOptions[optionService]
      .filter((option) => hasAny(text, [option.value, ...Object.values(option.label)]))
      .map((option) => option.value);

    if (detected.length) {
      setSelectedSpecifics((current) => Array.from(new Set([...current, ...detected])));
    }
  }

  async function handleFiles(selectedFiles?: FileList | null) {
    if (!selectedFiles?.length) return;
    const nextFiles: UploadedQuoteFile[] = [];
    const textChunks: string[] = [];
    const ocrChunks: string[] = [];

    for (const file of Array.from(selectedFiles)) {
      const type = classifyFile(file);
      const id = `${type}-${file.size}-${file.lastModified}-${nextFiles.length}`;
      const safePrivateName = `${copy.fileTypeLabels[type]} - ${Math.max(1, Math.round(file.size / 1024))} KB`;
      nextFiles.push({
        id,
        privateName: safePrivateName,
        label: fileLabel(file, type, copy),
        type,
        previewUrl: type === "image" ? URL.createObjectURL(file) : undefined
      });

      if (type === "text") {
        const fileText = await file.text();
        textChunks.push(fileText);
      }

      if (type === "image") {
        setOcrStatus("reading");
        try {
          const recognizedText = await readImageText(file, locale);
          if (recognizedText) {
            ocrChunks.push(recognizedText);
            setOcrStatus("ready");
          } else {
            setOcrStatus("failed");
          }
        } catch {
          setOcrStatus("failed");
        }
      }
    }

    setFiles((current) => [...current, ...nextFiles]);
    if (textChunks.length) {
      setRawText((current) => [current, ...textChunks].filter(Boolean).join("\n\n"));
    }
    if (ocrChunks.length) {
      setImageText((current) => [current, ...ocrChunks].filter(Boolean).join("\n\n"));
    }
    autoSelectDetailsFromText([...textChunks, ...ocrChunks].join("\n\n"));
  }

  function handleDragEnter(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.types.includes("Files")) {
      setIsDraggingFile(true);
    }
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    if (event.dataTransfer.types.includes("Files")) {
      setIsDraggingFile(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDraggingFile(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFile(false);
    handleFiles(event.dataTransfer.files);
  }

  async function improveWithAI() {
    if (!hasText || aiStatus === "loading") return;
    setAiAnalysis(null);
    setAiStatus("loading");

    try {
      const response = await fetch("/api/ai/quote-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          text: redactedText,
          serviceType,
          eventType,
          city,
          province,
          region,
          eventDate,
          guestsCount: guestsCount ? Number(guestsCount) : null,
          durationEstimate,
          totalAmount,
          objective,
          selectedDetails: selectedSpecifics,
          fileCount: files.length
        })
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok: boolean;
        error: string;
        source: "openai" | "internal";
        model: string;
        analysis: AiQuoteAnalysisState;
      };

      if (!response.ok || data.ok !== true || !data.analysis || data.source !== "openai") {
        setAiStatus(data.error === "openai_not_configured" ? "unavailable" : "error");
        return;
      }

      setAiAnalysis(data.analysis);
      setAiStatus("ready");
    } catch {
      setAiStatus("error");
    }
  }

  useEffect(() => {
    if (!hasText || redactedText.length < 80) return;
    const signature = [
      locale,
      serviceType,
      eventType,
      city,
      province,
      region,
      eventDate,
      guestsCount,
      durationEstimate,
      totalAmount,
      objective,
      selectedSpecifics.join(","),
      redactedText.slice(0, 6000)
    ].join("|");

    if (lastAiSignature.current === signature) return;
    const timeout = window.setTimeout(() => {
      lastAiSignature.current = signature;
      improveWithAI();
    }, 1400);

    return () => window.clearTimeout(timeout);
  }, [
    city,
    durationEstimate,
    eventDate,
    eventType,
    guestsCount,
    hasText,
    locale,
    objective,
    province,
    redactedText,
    region,
    selectedSpecifics,
    serviceType,
    totalAmount
  ]);

  function openDiscussion() {
    if (!canOpenDiscussion) {
      if (hasText && aiStatus !== "loading") void improveWithAI();
      return;
    }
    const draftTitle = `Preventivo ${formCopy.serviceOptions[displayReport.detected_service]}${city ? ` a ${city}` : ""}: cosa devo controllare`;
    if (locale === "it") {
      window.localStorage.setItem(
        "oe_quote_draft",
        JSON.stringify({
          title: draftTitle,
          content: [
            communityDiscussion,
            "",
            formCopy.missingTitle,
            ...displayReport.missing_items.slice(0, 5).map((item) => `- ${item.label}`),
            "",
            copy.questions,
            ...displayReport.questions_to_ask.slice(0, 6).map((item) => `- ${item}`)
          ].join("\n"),
          categorySlug: result.topic.categorySlug,
          postType: "Preventivo",
          eventPhase: "scelta-fornitori"
        })
      );
    }
    const nextPath =
      locale === "it"
        ? `${askPath}?tipo=Preventivo&da=preventivo&titolo=${encodeURIComponent(draftTitle)}`
        : askPath;
    router.push(nextPath);
  }

  const uploadControl = (
    <label
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        "block h-full cursor-pointer rounded-md border border-dashed px-4 py-4 text-sm font-semibold text-ink transition",
        isDraggingFile ? "border-violet-cta bg-white shadow-soft ring-2 ring-violet-cta/20" : "border-violet-cta/45 bg-petal hover:border-violet-cta hover:bg-white"
      ].join(" ")}
    >
      <span className="block text-base font-semibold text-ink">{copy.uploadLabel}</span>
      <span className="mt-3 block rounded-md border border-line/70 bg-white/70 px-3 py-3">
        <span className="block text-sm font-semibold text-ink">{isDraggingFile ? copy.dropActive : copy.dropTitle}</span>
        <span className="mt-1 block text-xs font-normal leading-5 text-muted">{copy.dropHint}</span>
      </span>
      <span className="mt-3 block text-xs font-normal leading-5 text-muted">{copy.uploadHelp}</span>
      <span className="mt-2 block text-xs font-normal leading-5 text-muted">{formCopy.privacyNote}</span>
      <span className="mt-4 inline-flex rounded-md bg-white px-3 py-2 text-xs font-semibold text-ink shadow-sm">
        {copy.fileButton}
      </span>
      <input
        className="sr-only"
        type="file"
        multiple
        accept=".txt,.csv,.pdf,.doc,.docx,.rtf,image/*,text/plain"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </label>
  );

  return (
    <>
      {aiStatus === "loading" ? <AiAnalysisLoadingOverlay copy={copy} /> : null}
      <div className="grid gap-6">
      <section className="rounded-md border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] xl:items-stretch">
          {uploadControl}

          <label className="block">
            <span className="block text-sm font-semibold text-ink">{copy.inputLabel}</span>
            <textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              rows={8}
              placeholder={copy.placeholder}
              className="focus-ring mt-3 min-h-[18rem] w-full rounded-md border border-line bg-cream px-4 py-3 text-sm leading-7 text-ink xl:h-[calc(100%-2rem)]"
            />
          </label>
        </div>

        <div className="mt-4 rounded-lg border border-line bg-cream p-4">
          <p className="text-sm font-semibold text-ink">{formCopy.contextTitle}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SelectField label={formCopy.service} value={serviceType} onChange={handleServiceTypeChange}>
              {(Object.keys(formCopy.serviceOptions) as QuoteServiceType[]).map((key) => (
                <option key={key} value={key}>
                  {formCopy.serviceOptions[key]}
                </option>
              ))}
            </SelectField>
            <SelectField label={formCopy.eventType} value={eventType} onChange={(value) => setEventType(value as QuoteEventType)}>
              {(Object.keys(formCopy.eventOptions) as QuoteEventType[]).map((key) => (
                <option key={key} value={key}>
                  {formCopy.eventOptions[key]}
                </option>
              ))}
            </SelectField>
            <TextField label={formCopy.city} value={city} onChange={setCity} placeholder="Milano" />
            <TextField label={formCopy.province} value={province} onChange={setProvince} placeholder="MI" />
            <TextField label={formCopy.region} value={region} onChange={setRegion} placeholder="Lombardia" />
            <TextField label={formCopy.eventDate} value={eventDate} onChange={setEventDate} type="date" />
            <TextField label={formCopy.guests} value={guestsCount} onChange={setGuestsCount} type="number" placeholder="90" />
            <TextField label={formCopy.duration} value={durationEstimate} onChange={setDurationEstimate} placeholder="6 ore" />
            <TextField label={formCopy.total} value={totalAmount} onChange={setTotalAmount} placeholder="1.200 euro" />
            <SelectField label={formCopy.objective} value={objective} onChange={(value) => setObjective(value as QuoteObjective)}>
              {(Object.keys(formCopy.objectiveOptions) as QuoteObjective[]).map((key) => (
                <option key={key} value={key}>
                  {formCopy.objectiveOptions[key]}
                </option>
              ))}
            </SelectField>
          </div>
          <fieldset className="mt-4">
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{formCopy.serviceDetails}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {serviceSpecificOptions[serviceType].map((item) => (
                <label
                  key={item.value}
                  className={[
                    "cursor-pointer rounded-md border px-3 py-2 text-xs font-semibold transition",
                    selectedSpecifics.includes(item.value) ? "border-violet-cta bg-violet-cta text-white" : "border-line bg-white text-muted hover:border-violet-cta/60 hover:text-ink"
                  ].join(" ")}
                >
                  <input className="sr-only" type="checkbox" checked={selectedSpecifics.includes(item.value)} onChange={() => toggleSpecific(item.value)} />
                  {item.label[locale]}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-4 rounded-lg border border-line bg-cream p-4">
          <p className="text-sm font-semibold text-ink">{copy.redactionTitle}</p>
          <p className="mt-2 text-xs leading-5 text-muted">{copy.redactionText}</p>
          {removedCount ? <p className="mt-2 text-xs font-semibold text-violet-cta">{copy.redactedCount(removedCount)}</p> : null}
        </div>

        {files.length ? (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink">{copy.attachmentsTitle}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {files.map((file) => (
                <div key={file.id} className="overflow-hidden rounded-md border border-line bg-cream">
                  {file.previewUrl ? <img src={file.previewUrl} alt="" className="h-16 w-full object-cover sm:h-20" /> : null}
                  <p className="p-2 text-[11px] font-semibold leading-4 text-muted">{file.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

      </section>

      <section className="rounded-md border border-line bg-white p-4 shadow-soft sm:p-5">
        <div className="z-10 -mx-4 -mt-4 border-b border-line bg-white/95 p-4 backdrop-blur sm:-mx-5 sm:-mt-5 sm:p-5 xl:sticky xl:top-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{copy.analysisLabel}</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                {locale === "it"
                  ? "Analisi del preventivo"
                  : locale === "en"
                    ? "Quote analysis"
                    : locale === "es"
                      ? "Análisis del presupuesto"
                      : "Analyse du devis"}
              </h2>
            </div>
              <button
                type="button"
                disabled={!canOpenDiscussion}
                onClick={openDiscussion}
                className={
                  canOpenDiscussion
                    ? "focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-violet-cta px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-hover"
                    : "inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-md border border-line bg-cream px-4 py-3 text-sm font-semibold text-muted"
                }
              >
                {canOpenDiscussion ? copy.startReady : hasText ? copy.startWaiting : copy.startLocked}
              </button>
          </div>
        </div>

        {!hasMaterial ? (
          <p className="mt-5 text-sm leading-7 text-muted">{copy.emptyText}</p>
        ) : isWaitingForAi ? (
          <AiAnalysisLoadingCard copy={copy} />
        ) : aiStatus === "error" || aiStatus === "unavailable" ? (
          <AiAnalysisErrorCard copy={copy} onRetry={() => void improveWithAI()} />
        ) : hasAiReport ? (
          <div className="mt-5 space-y-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="rounded-md border border-violet-cta/20 bg-petal p-4 text-sm leading-7 text-ink">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-ink">
                    {locale === "it"
                      ? "Abbiamo letto il tuo preventivo"
                      : locale === "en"
                        ? "We read your Italian quote"
                        : locale === "es"
                          ? "Hemos leído tu presupuesto italiano"
                          : "Nous avons lu votre devis italien"}
                  </h2>
                  <p className="mt-2 text-muted">{displayReport.user_summary}</p>
                </div>
                <span className="inline-flex w-fit shrink-0 rounded-md bg-white px-3 py-2 text-xs font-semibold text-violet-cta shadow-sm">
                  {detectedServiceLabel}
                </span>
              </div>
            </div>
            <div className="rounded-md border border-violet-cta/25 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-ink">{formCopy.nextActionTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{displayReport.recommended_next_action}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  type="button"
                  onClick={openDiscussion}
                  className="focus-ring inline-flex min-h-12 w-full items-center justify-center rounded-md bg-violet-cta px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-hover"
                >
                  {formCopy.publishPrivate}
                </button>
                <VibesSupplierCta variant="light" className="min-h-12 w-full justify-center shadow-none">
                  {formCopy.compareSuppliers}
                </VibesSupplierCta>
              </div>
            </div>
            </div>
            <QuoteSupplierStrip
              active={hasAiReport}
              locale={locale}
              serviceType={displayReport.detected_service}
              topicKey={result.topic.key}
              topicLabel={result.topic.label[locale]}
              serviceLabel={detectedServiceLabel}
              quoteText={redactedText}
              city={city}
              province={province}
              region={region}
              eventLabel={formCopy.eventOptions[eventType]}
            />
            {!hasText && files.length ? <p className="rounded-md bg-petal p-4 text-sm leading-6 text-muted">{copy.fileOnlyText}</p> : null}
            <section className="rounded-md border border-line bg-white p-4 shadow-sm">
              <div className="border-b border-line pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">
                  {locale === "it"
                    ? "Analisi dettagliata"
                    : locale === "en"
                      ? "Detailed analysis"
                      : locale === "es"
                        ? "Análisis detallado"
                        : "Analyse détaillée"}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-ink">
                  {locale === "it"
                    ? "Cosa controllare prima di accettare"
                    : locale === "en"
                      ? "What to check before accepting"
                      : locale === "es"
                        ? "Qué revisar antes de aceptar"
                        : "Ce qu'il faut vérifier avant d'accepter"}
                </h2>
              </div>
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                  <div className="rounded-md border border-line bg-cream p-4 text-sm leading-7 text-ink">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">{copy.topicTitle}</p>
                    <h2 className="mt-2 text-lg font-semibold text-ink">{result.topic.title[locale]}</h2>
                    <p className="mt-2 text-muted">{result.reading}</p>
                  </div>
                  {hasText ? <QuoteQualityPanel result={quality} locale={locale} /> : null}
                </div>
                <MetricGrid report={displayReport} labels={formCopy} locale={locale} />
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                  <Block title={copy.included} items={displayReport.included_items} />
                  <FindingBlock title={formCopy.missingTitle} items={displayReport.missing_items} locale={locale} />
                  <FindingBlock title={copy.unclear} items={displayReport.unclear_items} locale={locale} />
                  <Block title={formCopy.hiddenCostsTitle} items={displayReport.possible_hidden_costs} />
                </div>
                <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                  <Block title={copy.questions} items={displayReport.questions_to_ask} accent />
                  <div className="rounded-md border border-line bg-white p-4">
                    <h2 className="text-base font-semibold text-ink">{copy.publicPost}</h2>
                    <div className="mt-3 max-h-72 overflow-auto whitespace-pre-line rounded-md border border-line bg-cream p-4 text-sm leading-7 text-ink">
                      {communityDiscussion}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <AiAnalysisLoadingCard copy={copy} />
        )}
      </section>
      </div>
    </>
  );
}

function AiAnalysisLoadingOverlay({ copy }: { copy: AnalyzerCopy }) {
  return (
    <div className="fixed inset-0 z-[21000] flex items-center justify-center bg-ink/55 px-4 py-6 backdrop-blur-sm" role="status" aria-live="polite">
      <AiAnalysisLoadingPanel copy={copy} elevated />
    </div>
  );
}

function AiAnalysisLoadingCard({ copy }: { copy: AnalyzerCopy }) {
  return (
    <div className="mt-5" role="status" aria-live="polite">
      <AiAnalysisLoadingPanel copy={copy} />
    </div>
  );
}

function AiAnalysisLoadingPanel({ copy, elevated = false }: { copy: AnalyzerCopy; elevated?: boolean }) {
  return (
    <div
      className={[
        "w-full rounded-lg border border-line bg-white p-5 shadow-soft",
        elevated ? "max-w-md" : "bg-white/95",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <LoadingMark />
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-snug text-ink">{copy.loadingTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">{copy.loadingText}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="grid gap-2 sm:grid-cols-3">
          {copy.loadingSteps.map((step, index) => (
            <div key={step} className="rounded-md border border-line bg-cream/70 px-3 py-3 text-left text-xs font-semibold leading-5 text-muted">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-violet-cta">
                {String(index + 1).padStart(2, "0")}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AiAnalysisErrorCard({ copy, onRetry }: { copy: AnalyzerCopy; onRetry: () => void }) {
  return (
    <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-5">
      <h2 className="text-xl font-semibold text-ink">{copy.errorTitle}</h2>
      <p className="mt-2 text-sm leading-7 text-muted">{copy.errorText}</p>
      <button
        type="button"
        onClick={onRetry}
        className="focus-ring mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-violet-cta px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover"
      >
        {copy.retry}
      </button>
    </div>
  );
}

function LoadingMark() {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-line bg-cream">
      <span className="relative flex h-5 w-5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-cta opacity-30" />
        <span className="relative inline-flex h-5 w-5 rounded-full bg-violet-cta" />
      </span>
    </div>
  );
}

const qualityPanelCopies: Record<
  QuoteAnalyzerLocale,
  {
    title: string;
    help: string;
    risk: string;
    action: string;
    criteria: string;
    points: string;
    strengths: string;
    missing: string;
    questions: string;
    caps: string;
    cta: string;
  }
> = {
  it: {
    title: "Qualità del preventivo",
    help: "Il voto misura chiarezza, completezza, rischio e confrontabilità. Non giudica solo se il prezzo è alto o basso.",
    risk: "Rischio principale",
    action: "Azione consigliata",
    criteria: "Criteri",
    points: "punti",
    strengths: "Punti forti",
    missing: "Punti mancanti",
    questions: "Domande da fare",
    caps: "Perché non sale di più",
    cta: "Confronta fornitori"
  },
  en: {
    title: "Quote quality",
    help: "The score measures clarity, completeness, risk and comparability. It does not simply judge whether the price is high or low.",
    risk: "Main risk",
    action: "Recommended action",
    criteria: "Criteria",
    points: "points",
    strengths: "Strengths",
    missing: "Missing points",
    questions: "Questions to ask",
    caps: "Why the score is capped",
    cta: "Compare suppliers"
  },
  es: {
    title: "Calidad del presupuesto",
    help: "La nota mide claridad, detalle, riesgo y comparabilidad. No juzga solo si el precio es alto o bajo.",
    risk: "Riesgo principal",
    action: "Accion recomendada",
    criteria: "Criterios",
    points: "puntos",
    strengths: "Puntos fuertes",
    missing: "Puntos pendientes",
    questions: "Preguntas que hacer",
    caps: "Por que no sube más",
    cta: "Comparar proveedores"
  },
  fr: {
    title: "Qualité du devis",
    help: "La note mesure clarté, complétude, risque et comparabilité. Elle ne juge pas seulement si le prix est élevé ou bas.",
    risk: "Risque principal",
    action: "Action conseillée",
    criteria: "Criteres",
    points: "points",
    strengths: "Points forts",
    missing: "Points manquants",
    questions: "Questions à poser",
    caps: "Pourquoi la note est limitée",
    cta: "Comparer les prestataires"
  }
};

function QuoteQualityPanel({ result, locale }: { result: QuoteScoreResult; locale: QuoteAnalyzerLocale }) {
  const copy = qualityPanelCopies[locale];
  const tone = qualityTone(result.score);
  const scoreText = result.score >= 10 ? "10" : result.score.toFixed(1).replace(".", locale === "en" ? "." : ",");
  const detailLabel =
    locale === "it"
      ? "Vedi altri dettagli sul preventivo"
      : locale === "en"
        ? "See more quote details"
        : locale === "es"
          ? "Ver más detalles del presupuesto"
          : "Voir plus de détails sur le devis";

  return (
    <div className={["rounded-md border p-4 shadow-sm", tone.shell].join(" ")}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(220px,0.28fr)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">{copy.title}</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <p className="text-5xl font-semibold leading-none text-ink">{scoreText}/10</p>
            <p className={["rounded-md px-3 py-2 text-sm font-semibold", tone.badge].join(" ")}>{result.label}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{copy.help}</p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/80">
            <div className={["h-full rounded-full", tone.bar].join(" ")} style={{ width: `${Math.min(100, Math.max(8, result.score * 10))}%` }} />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {result.criteria.slice(0, 8).map((criterion) => (
              <div key={criterion.id} className="rounded-md border border-line/70 bg-white/80 px-3 py-2">
                <p className="truncate text-[11px] font-semibold text-muted">{criterion.label}</p>
                <p className="mt-1 text-base font-semibold leading-none text-ink">{Math.round(criterion.points)}/100</p>
              </div>
            ))}
          </div>
          <VibesSupplierCta variant="light" className="mt-4 min-h-11 shadow-none">
            {copy.cta}
          </VibesSupplierCta>
        </div>
        <div className="grid gap-3">
          <div className="rounded-md bg-white/75 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{copy.risk}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink">{result.mainRisk}</p>
          </div>
          <div className="rounded-md bg-white/75 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{copy.action}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{result.recommendedAction}</p>
          </div>
        </div>
      </div>

      <details className="mt-4 rounded-md border border-line/70 bg-white/90 p-3">
        <summary className="cursor-pointer rounded-md bg-cream px-3 py-2 text-sm font-semibold text-ink transition hover:bg-petal">
          {detailLabel}
        </summary>
        <div className="mt-3 grid gap-2">
          {result.criteria.map((criterion) => (
            <div key={criterion.id} className="grid gap-2 rounded-md bg-cream px-3 py-3 text-sm sm:grid-cols-[minmax(150px,0.45fr)_minmax(80px,0.15fr)_minmax(180px,1fr)] sm:items-center">
              <p className="font-semibold text-ink">{criterion.label}</p>
              <p className="text-muted">
                {criterion.points}/{criterion.maxPoints}
              </p>
              <p className="text-xs leading-5 text-muted">
                {criterion.evidence[0] ?? criterion.missing[0] ?? "-"}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <MiniList title={copy.strengths} items={result.strengths} />
          <MiniList title={copy.missing} items={result.missingItems} />
          <MiniList title={copy.questions} items={result.questions} accent />
        </div>
        {result.appliedCaps.length ? (
          <div className="mt-4 rounded-md border border-line bg-white/75 p-3">
            <p className="text-sm font-semibold text-ink">{copy.caps}</p>
            <ul className="mt-2 grid gap-2">
              {result.appliedCaps.slice(0, 4).map((item) => (
                <li key={item} className="text-xs leading-5 text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </details>
    </div>
  );
}

function qualityTone(score: number) {
  if (score >= 9) {
    return {
      shell: "border-emerald-200 bg-emerald-50/60",
      badge: "bg-emerald-100 text-emerald-800",
      bar: "bg-emerald-600"
    };
  }
  if (score >= 7) {
    return {
      shell: "border-emerald-100 bg-[#F1F8F2]",
      badge: "bg-emerald-50 text-emerald-700",
      bar: "bg-emerald-400"
    };
  }
  if (score >= 5) {
    return {
      shell: "border-amber-200 bg-amber-50/60",
      badge: "bg-amber-100 text-amber-800",
      bar: "bg-amber-400"
    };
  }
  return {
    shell: "border-rose-200 bg-rose-50/60",
    badge: "bg-rose-100 text-rose-800",
    bar: "bg-rose-400"
  };
}

function MiniList({ title, items, accent = false }: { title: string; items: string[]; accent?: boolean }) {
  if (!items.length) return null;

  return (
    <div className="rounded-md border border-line bg-white p-3">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.slice(0, 5).map((item) => (
          <li key={item} className={accent ? "rounded-md bg-violet-cta/10 px-3 py-2 text-xs leading-5 text-ink" : "rounded-md bg-cream px-3 py-2 text-xs leading-5 text-muted"}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreDots({ score, label, copy }: { score: number; label: string; copy: AnalyzerCopy }) {
  const filled = Math.floor(score);
  const hasHalf = score % 1 !== 0;

  return (
    <div className="rounded-lg border border-violet-cta/25 bg-cream p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-cta">{copy.scoreTitle}</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {score.toString().replace(".", ",")}/10 <span className="text-base text-muted">{label}</span>
          </p>
        </div>
        <div className="flex gap-1" aria-label={`${copy.scoreTitle}: ${score}/10`}>
          {Array.from({ length: 10 }, (_, index) => {
            const active = index < filled;
            const half = index === filled && hasHalf;
            return (
              <span
                key={index}
                className={[
                  "h-3.5 w-3.5 rounded-full border border-violet-cta",
                  active ? "bg-violet-cta" : half ? "bg-[linear-gradient(90deg,#7C3AED_50%,transparent_50%)]" : "bg-white"
                ].join(" ")}
              />
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">{copy.scoreHelp}</p>
    </div>
  );
}

function MetricGrid({ report, labels, locale }: { report: ReturnType<typeof analyzeQuote>; labels: ToolFormCopy; locale: QuoteAnalyzerLocale }) {
  const metrics = [
    { label: labels.clarity, value: `${report.score_chiarezza}/100` },
    { label: labels.completeness, value: `${report.score_completezza}/100` },
    { label: labels.extraRisk, value: translateRisk(report.score_rischio_extra, locale) },
    { label: labels.priceCoherence, value: translateCoherence(report.score_coerenza_prezzo, locale) },
    { label: labels.reliability, value: `${report.score_affidabilita_informazioni}/100` }
  ];

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <h2 className="text-base font-semibold text-ink">{labels.metricTitle}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex min-h-28 flex-col items-center justify-center rounded-md bg-cream px-3 py-4 text-center">
            <p className="max-w-[9rem] text-xs font-semibold uppercase tracking-[0.12em] text-muted">{metric.label}</p>
            <p className="mt-2 text-xl font-semibold leading-none text-ink">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FindingBlock({ title, items, locale }: { title: string; items: ReturnType<typeof analyzeQuote>["missing_items"]; locale: QuoteAnalyzerLocale }) {
  if (!items.length) return null;

  return (
    <div className="h-full rounded-md border border-line bg-white p-4">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <ul className="mt-2 space-y-2">
        {items.slice(0, 7).map((item) => (
          <li key={`${item.label}-${item.priority}`} className="rounded-md bg-cream px-4 py-3 text-sm leading-6 text-muted">
            <span className="font-semibold text-ink">{item.label}</span>
            <span className="ml-2 rounded-md bg-petal px-2 py-1 text-[11px] font-semibold text-violet-cta">{translatePriority(item.priority, locale)}</span>
            <span className="mt-1 block">{item.reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function translatePriority(value: ReturnType<typeof analyzeQuote>["missing_items"][number]["priority"], locale: QuoteAnalyzerLocale) {
  if (locale === "en") return value === "Alta" ? "High" : value === "Media" ? "Medium" : "Low";
  if (locale === "es") return value === "Alta" ? "Alta" : value === "Media" ? "Media" : "Baja";
  if (locale === "fr") return value === "Alta" ? "Elevee" : value === "Media" ? "Moyenne" : "Faible";
  return value;
}

function Block({ title, items, accent = false }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <div className={accent ? "h-full rounded-md border border-violet-cta/25 bg-petal p-4" : "h-full rounded-md border border-line bg-white p-4"}>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <ul className="mt-2 space-y-2">
        {items.slice(0, 7).map((item) => (
          <li key={item} className={accent ? "rounded-md bg-violet-cta/10 px-4 py-3 text-sm leading-6 text-ink" : "rounded-md bg-cream px-4 py-3 text-sm leading-6 text-muted"}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date" | "number";
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      <input
        value={value}
        type={type}
        min={type === "number" ? 0 : undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink">
        {children}
      </select>
    </label>
  );
}

function translateRisk(value: ReturnType<typeof analyzeQuote>["score_rischio_extra"], locale: QuoteAnalyzerLocale) {
  if (locale === "en") return value === "basso" ? "low" : value === "medio" ? "medium" : "high";
  if (locale === "es") return value === "basso" ? "bajo" : value === "medio" ? "medio" : "alto";
  if (locale === "fr") return value === "basso" ? "faible" : value === "medio" ? "moyen" : "élevé";
  return value;
}

function translateCoherence(value: ReturnType<typeof analyzeQuote>["score_coerenza_prezzo"], locale: QuoteAnalyzerLocale) {
  if (locale === "en") {
    if (value === "non valutabile") return "not enough data";
    if (value === "stimata") return "indicative";
    if (value === "coerente") return "readable";
    return "needs comparison";
  }
  if (locale === "es") {
    if (value === "non valutabile") return "sin datos suficientes";
    if (value === "stimata") return "orientativo";
    if (value === "coerente") return "legible";
    return "por comparar";
  }
  if (locale === "fr") {
    if (value === "non valutabile") return "données insuffisantes";
    if (value === "stimata") return "indicatif";
    if (value === "coerente") return "lisible";
    return "à comparer";
  }
  return value;
}

function translateVerdict(value: ReturnType<typeof analyzeQuote>["verdict"], locale: QuoteAnalyzerLocale) {
  if (locale === "en") {
    const map: Record<ReturnType<typeof analyzeQuote>["verdict"], string> = {
      "Sembra completo": "Looks complete",
      "Prezzo da verificare": "Price to check",
      "Mancano voci importanti": "Important items missing",
      "Possibili extra nascosti": "Possible hidden extras",
      "Preventivo poco chiaro": "Not clear enough",
      "Serve confronto con alternative": "Compare alternatives"
    };
    return map[value];
  }
  if (locale === "es") {
    const map: Record<ReturnType<typeof analyzeQuote>["verdict"], string> = {
      "Sembra completo": "Parece completo",
      "Prezzo da verificare": "Precio por verificar",
      "Mancano voci importanti": "Faltan partidas importantes",
      "Possibili extra nascosti": "Posibles extras ocultos",
      "Preventivo poco chiaro": "Poco claro",
      "Serve confronto con alternative": "Comparar alternativas"
    };
    return map[value];
  }
  if (locale === "fr") {
    const map: Record<ReturnType<typeof analyzeQuote>["verdict"], string> = {
      "Sembra completo": "Semble complet",
      "Prezzo da verificare": "Prix à vérifier",
      "Mancano voci importanti": "Postes importants manquants",
      "Possibili extra nascosti": "Extras possibles",
      "Preventivo poco chiaro": "Pas assez clair",
      "Serve confronto con alternative": "Comparer alternatives"
    };
    return map[value];
  }
  return value;
}
