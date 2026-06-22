import Link from "next/link";
import { QuoteAnalyzer } from "@/components/QuoteAnalyzer";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import {
  QuoteAnalysisPage,
  QuoteServiceSlug,
  getNearbyCapitalPages,
  getQuoteAnalysisHubPage,
  getQuoteAnalysisPagesForSitemap,
  getQuoteAnalysisRegionPage,
  getQuoteAnalysisServicePage,
  getServiceLabel,
  quoteRegions,
  quoteServices
} from "@/content/quote-analysis";
import { Locale } from "@/lib/i18n-basic";
import { faqMainEntity } from "@/lib/structured-data";

type Copy = {
  eyebrow: string;
  subtitle: (service: string, place?: string) => string;
  primaryCta: string;
  secondaryCta: string;
  noLogin: string;
  includedTitle: string;
  missingTitle: string;
  hiddenTitle: string;
  questionsTitle: string;
  benchmarkTitle: string;
  benchmarkFallback: string;
  benchmarkMeta: string;
  guideTitle: (service: string) => string;
  localTitle: string;
  internalLinksTitle: string;
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaText: string;
  findAlternatives: string;
  hubLabel: string;
  serviceLabel: string;
  regionLabel: string;
  cityLabel: string;
};

const copy: Record<Locale, Copy> = {
  it: {
    eyebrow: "Analizza preventivo",
    subtitle: (service, place) =>
      `Carica o incolla il preventivo ${service}${place ? ` per eventi a ${place}` : ""}: controlli voci incluse, extra, punti mancanti e domande da fare prima di confermare.`,
    primaryCta: "Analizza il preventivo",
    secondaryCta: "Confronta con fornitori simili",
    noLogin: "Puoi iniziare senza registrazione. I dati sensibili vengono oscurati prima di creare una conversazione pubblica.",
    includedTitle: "Cosa deve essere chiaro",
    missingTitle: "Voci che spesso mancano",
    hiddenTitle: "Extra da controllare",
    questionsTitle: "Domande da fare al fornitore",
    benchmarkTitle: "Prima di dire sì al preventivo",
    benchmarkFallback: "Controlla se il prezzo è scritto in modo leggibile: cosa è incluso, cosa resta fuori, quante ore copre il servizio e cosa succede se l'evento cambia numero di invitati, orario o location.",
    benchmarkMeta: "Suggerimento: cancella nomi, telefoni, email e riferimenti del fornitore prima di pubblicare. La community può aiutarti meglio se vede voci, condizioni e contesto dell'evento.",
    guideTitle: (service) => `Guida pratica al preventivo ${service}`,
    localTitle: "Come usare il confronto",
    internalLinksTitle: "Percorsi utili",
    faqTitle: "FAQ sul preventivo",
    finalCtaTitle: "Hai già un preventivo in mano",
    finalCtaText: "Caricalo, oscura i dati sensibili e trasformalo in una conversazione utile con la community.",
    findAlternatives: "Trova alternative su Vibes Planner",
    hubLabel: "Preventivi evento",
    serviceLabel: "Servizio da analizzare",
    regionLabel: "Zona evento",
    cityLabel: "Città evento"
  },
  en: {
    eyebrow: "Italian quote analysis",
    subtitle: (service, place) =>
      `Upload or paste an Italian ${service} quote${place ? ` for an event in ${place}` : ""}: check included items, extras, missing details and questions to ask before confirming.`,
    primaryCta: "Analyze the quote",
    secondaryCta: "Compare Italian suppliers",
    noLogin: "You can start without registration. Sensitive details are removed before creating a public discussion.",
    includedTitle: "What must be clear",
    missingTitle: "Items often missing",
    hiddenTitle: "Extras to check",
    questionsTitle: "Questions for the Italian supplier",
    benchmarkTitle: "Before accepting the quote",
    benchmarkFallback: "Check whether the price is readable: what is included, what is excluded, how many hours the service covers and what happens if guest count, timing or venue details change.",
    benchmarkMeta: "Tip: remove names, phone numbers, emails and supplier references before posting. The community can help better when it sees items, conditions and event context.",
    guideTitle: (service) => `Practical guide to Italian ${service} quotes`,
    localTitle: "How to use the comparison",
    internalLinksTitle: "Useful paths",
    faqTitle: "Quote FAQ",
    finalCtaTitle: "Do you already have an Italian quote?",
    finalCtaText: "Upload it, remove sensitive data and turn it into a useful conversation with clients and suppliers in Italy.",
    findAlternatives: "Find alternatives on Vibes Planner",
    hubLabel: "Event quotes",
    serviceLabel: "Service to check",
    regionLabel: "Event area",
    cityLabel: "Event city"
  },
  es: {
    eyebrow: "Análisis de presupuestos italianos",
    subtitle: (service, place) =>
      `Sube o pega un presupuesto italiano de ${service}${place ? ` para un evento en ${place}` : ""}: revisa partidas incluidas, extras, puntos que faltan y preguntas antes de confirmar.`,
    primaryCta: "Analizar presupuesto",
    secondaryCta: "Comparar proveedores italianos",
    noLogin: "Puedes empezar sin registro. Los datos sensibles se ocultan antes de crear una conversación pública.",
    includedTitle: "Lo que debe estar claro",
    missingTitle: "Partidas que suelen faltar",
    hiddenTitle: "Extras a controlar",
    questionsTitle: "Preguntas para el proveedor italiano",
    benchmarkTitle: "Antes de aceptar el presupuesto",
    benchmarkFallback: "Comprueba si el precio se entiende bien: qué incluye, qué queda fuera, cuántas horas cubre el servicio y qué pasa si cambian invitados, horarios o lugar del evento.",
    benchmarkMeta: "Consejo: elimina nombres, teléfonos, emails y referencias del proveedor antes de publicar. La comunidad ayuda mejor si ve partidas, condiciones y contexto del evento.",
    guideTitle: (service) => `Guía práctica para presupuestos italianos de ${service}`,
    localTitle: "Cómo usar la comparación",
    internalLinksTitle: "Rutas útiles",
    faqTitle: "FAQ sobre presupuestos",
    finalCtaTitle: "¿Ya tienes un presupuesto italiano?",
    finalCtaText: "Súbelo, elimina datos sensibles y conviértelo en una conversación útil con clientes y proveedores en Italia.",
    findAlternatives: "Encontrar alternativas en Vibes Planner",
    hubLabel: "Presupuestos de evento",
    serviceLabel: "Servicio a revisar",
    regionLabel: "Zona del evento",
    cityLabel: "Ciudad del evento"
  },
  fr: {
    eyebrow: "Analyse de devis italiens",
    subtitle: (service, place) =>
      `Ajoutez ou collez un devis italien ${service}${place ? ` pour un événement à ${place}` : ""}: vérifiez postes inclus, extras, détails manquants et questions avant de confirmer.`,
    primaryCta: "Analyser le devis",
    secondaryCta: "Comparer des prestataires italiens",
    noLogin: "Vous pouvez commencer sans inscription. Les données sensibles sont masquées avant de créer une discussion publique.",
    includedTitle: "Ce qui doit être clair",
    missingTitle: "Postes souvent absents",
    hiddenTitle: "Extras à vérifier",
    questionsTitle: "Questions au prestataire italien",
    benchmarkTitle: "Avant d'accepter le devis",
    benchmarkFallback: "Vérifiez si le prix se lit clairement: ce qui est inclus, ce qui reste hors devis, le nombre d'heures couvertes et ce qui change si les invités, les horaires ou le lieu évoluent.",
    benchmarkMeta: "Conseil: retirez noms, téléphones, emails et références du prestataire avant de publier. La communauté aide mieux quand elle voit les postes, conditions et contexte de l'événement.",
    guideTitle: (service) => `Guide pratique des devis italiens ${service}`,
    localTitle: "Comment utiliser la comparaison",
    internalLinksTitle: "Parcours utiles",
    faqTitle: "FAQ devis",
    finalCtaTitle: "Vous avez déjà un devis italien",
    finalCtaText: "Ajoutez-le, masquez les données sensibles et transformez-le en discussion utile avec clients et prestataires en Italie.",
    findAlternatives: "Trouver des alternatives sur Vibes Planner",
    hubLabel: "Devis événementiels",
    serviceLabel: "Service à vérifier",
    regionLabel: "Zone de l'événement",
    cityLabel: "Ville de l'événement"
  }
};

const serviceDetails: Record<Locale, Record<QuoteServiceSlug, { required: string[]; missing: string[]; hidden: string[]; questions: string[]; faq: Array<[string, string]> }>> = {
  it: {
    dj: {
      required: ["Ore di musica", "Impianto audio", "Luci", "Microfoni", "Extra orario"],
      missing: ["SIAE solo citata", "Setup cerimonia separato", "Orario montaggio non scritto"],
      hidden: ["Ore extra", "Trasferta", "Impianto non dimensionato", "Permessi musicali"],
      questions: ["L'impianto è adatto allo spazio?", "Quanto costa ogni ora extra?", "Luci e microfoni sono inclusi?"],
      faq: [["Come capisco se un preventivo DJ è alto?", "Confronta ore, impianto, luci, trasferta, SIAE e costo extra orario, non solo la cifra finale."], ["La SIAE deve essere inclusa?", "Spesso viene solo citata: chiedi chi la gestisce e se il costo è dentro o fuori preventivo."]]
    },
    band: {
      required: ["Numero musicisti", "Durata live", "Numero set", "Tecnico audio", "Impianto"],
      missing: ["Pasti staff", "Pernottamento", "DJ set dopo live", "Scaletta personalizzata"],
      hidden: ["Trasferta", "Tecnico audio extra", "Set aggiuntivi", "Richieste speciali"],
      questions: ["Quanti musicisti suonano davvero", "Il tecnico audio è incluso", "Il DJ set finale è compreso"],
      faq: [["Da cosa dipende il prezzo di una band", "Dipende da musicisti, durata, tecnico, impianto, trasferta e richieste di scaletta."], ["Il tecnico audio deve essere incluso", "Per eventi medi o grandi è un punto importante: se manca, può diventare un extra rilevante."]]
    },
    fotografo: {
      required: ["Ore di copertura", "Numero fotografi", "Post-produzione", "Foto consegnate", "Tempi consegna"],
      missing: ["Album", "Secondo fotografo", "Diritti utilizzo", "File raw"],
      hidden: ["Extra orario", "Trasferta", "Consegna rapida", "Video non incluso"],
      questions: ["Quante ore copre il servizio?", "Il secondo fotografo è compreso?", "Album e post-produzione sono inclusi?"],
      faq: [["Cosa deve includere un preventivo fotografo?", "Ore, numero fotografi, consegna, post-produzione, diritti e possibili extra."], ["Un preventivo senza album conviene?", "Solo se il risparmio è reale e sai già quanto costerebbe aggiungerlo dopo."]]
    }
  },
  en: {
    dj: {
      required: ["Music hours", "Sound system", "Lights", "Microphones", "Extra hourly rate"],
      missing: ["Music permits only mentioned", "Separate ceremony setup", "Setup time not written"],
      hidden: ["Extra hours", "Travel fee", "Undersized sound system", "Music permits"],
      questions: ["Is the sound system suitable for the venue?", "How much is each extra hour?", "Are lights and microphones included?"],
      faq: [["How do I know if an Italian DJ quote is high?", "Compare hours, sound system, lights, travel, music permits and extra hourly cost."], ["Are music permits included?", "Ask who manages them and whether the cost is included or outside the quote."]]
    },
    band: {
      required: ["Number of musicians", "Live duration", "Number of sets", "Sound technician", "Sound system"],
      missing: ["Staff meals", "Overnight stay", "DJ set after live", "Custom setlist"],
      hidden: ["Travel fee", "Extra sound technician", "Additional sets", "Special requests"],
      questions: ["How many musicians will actually play?", "Is the sound technician included?", "Is the final DJ set included?"],
      faq: [["What affects the price of a band in Italy?", "Musicians, live duration, technician, sound system, travel and setlist requests."], ["Should the sound technician be included?", "For medium or large events it matters: if missing, it may become a significant extra."]]
    },
    fotografo: {
      required: ["Coverage hours", "Number of photographers", "Editing", "Delivered photos", "Delivery time"],
      missing: ["Album", "Second shooter", "Usage rights", "Raw files"],
      hidden: ["Extra hour", "Travel fee", "Fast delivery", "Video not included"],
      questions: ["How many hours are covered?", "Is the second shooter included?", "Are album and editing included?"],
      faq: [["What should an Italian photographer quote include?", "Hours, number of photographers, delivery, editing, rights and possible extras."], ["Is a quote without an album cheaper?", "Only if the saving is real and you know the later album cost."]]
    }
  },
  es: {
    dj: {
      required: ["Horas de música", "Equipo de sonido", "Luces", "Micrófonos", "Extra por hora"],
      missing: ["Permisos musicales solo mencionados", "Setup ceremonia separado", "Montaje sin horario"],
      hidden: ["Horas extra", "Desplazamiento", "Equipo insuficiente", "Permisos musicales"],
      questions: ["¿El equipo sirve para el espacio?", "¿Cuánto cuesta cada hora extra?", "¿Luces y micrófonos están incluidos?"],
      faq: [["¿Cómo saber si un presupuesto DJ en Italia es alto?", "Compara horas, sonido, luces, traslado, permisos y extra por hora."], ["¿Los permisos musicales están incluidos?", "Pregunta quién los gestiona y si el coste está dentro o fuera."]]
    },
    band: {
      required: ["Número de músicos", "Duración del directo", "Número de sets", "Técnico de sonido", "Equipo"],
      missing: ["Comidas staff", "Alojamiento", "DJ set posterior", "Repertorio personalizado"],
      hidden: ["Desplazamiento", "Técnico extra", "Sets adicionales", "Peticiones especiales"],
      questions: ["¿Cuántos músicos tocarán realmente?", "¿El técnico está incluido?", "¿El DJ set final está incluido?"],
      faq: [["¿De qué depende el precio de una banda?", "Músicos, duración, técnico, equipo, traslado y repertorio."], ["¿Debe incluir técnico de sonido?", "En eventos medianos o grandes puede ser clave y convertirse en extra."]]
    },
    fotografo: {
      required: ["Horas de cobertura", "Número de fotografos", "Edición", "Fotos entregadas", "Plazo entrega"],
      missing: ["Album", "Segundo fotografo", "Derechos de uso", "Archivos raw"],
      hidden: ["Hora extra", "Desplazamiento", "Entrega rápida", "Video no incluido"],
      questions: ["¿Cuántas horas cubre?", "¿El secondo fotografo está incluido?", "¿Álbum y edición están incluidos?"],
      faq: [["¿Qué debe incluir un presupuesto fotografo?", "Horas, fotógrafos, entrega, edición, derechos y posibles extras."], ["¿Sin álbum es más conveniente?", "Solo si el ahorro es real y conoces el coste de añadirlo después."]]
    }
  },
  fr: {
    dj: {
      required: ["Heures de musique", "Système son", "Lumières", "Micros", "Heure supplémentaire"],
      missing: ["Droits musicaux seulement mentionnés", "Installation cérémonie séparée", "Horaire montage absent"],
      hidden: ["Heures extra", "Déplacement", "Sonorisation insuffisante", "Droits musicaux"],
      questions: ["Le système son convient-il au lieu ?", "Combien coûte chaque heure extra ?", "Lumières et micros sont-ils inclus ?"],
      faq: [["Comment savoir si un devis DJ italien est élevé ?", "Comparez heures, son, lumières, déplacement, droits musicaux et heure extra."], ["Les droits musicaux sont-ils inclus", "Demandez qui les gère et si le coût est inclus ou hors devis."]]
    },
    band: {
      required: ["Nombre de musiciens", "Durée live", "Nombre de sets", "Technicien son", "Système son"],
      missing: ["Repas équipe", "Hébergement", "DJ set après live", "Playlist personnalisée"],
      hidden: ["Déplacement", "Technicien extra", "Sets additionnels", "Demandes speciales"],
      questions: ["Combien de musiciens jouent vraiment ?", "Le technicien son est-il inclus?", "Le DJ set final est-il compris ?"],
      faq: [["De quoi dépend le prix d'un groupe ?", "Musiciens, durée, technicien, son, déplacement et demandes de répertoire."], ["Le technicien son doit-il être inclus", "Pour un événement moyen ou grand, son absence peut devenir un extra important."]]
    },
    fotografo: {
      required: ["Heures de couverture", "Nombre de photographes", "Retouche", "Photos livrées", "Délai de livraison"],
      missing: ["Album", "Second photographe", "Droits d'utilisation", "Fichiers raw"],
      hidden: ["Heure supplémentaire", "Déplacement", "Livraison rapide", "Video non incluse"],
      questions: ["Combien d'heures sont couvertes ?", "Le second photographe est-il inclus?", "Album et retouche sont-ils inclus ?"],
      faq: [["Que doit inclure un devis photographe ?", "Heures, nombre de photographes, livraison, retouche, droits et extras."], ["Un devis sans album est-il moins cher", "Seulement si l'économie est réelle et si le coût de l'album ulterieur est clair."]]
    }
  }
};

function pageTypeLabel(page: QuoteAnalysisPage, locale: Locale) {
  const c = copy[locale];
  if (page.pageType === "hub") return c.hubLabel;
  if (page.pageType === "service") return c.serviceLabel;
  if (page.pageType === "region") return c.regionLabel;
  return c.cityLabel;
}

function placeName(page: QuoteAnalysisPage) {
  return page.municipality?.comuneName ?? page.regionName;
}

function relativeHref(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return url;
  }
}

function localContextText(page: QuoteAnalysisPage, locale: Locale) {
  if (page.municipality) {
    const serviceName = page.service ? getServiceLabel(page.service, locale) : "";
    const values = {
      it: `Se il tuo evento è a ${page.municipality.comuneName} o dintorni, racconta anche zona, stagione, numero invitati e orari. Un preventivo ${serviceName} cambia molto se ci sono trasferte, vincoli della location o tempi di montaggio stretti.`,
      en: `If your event is in or around ${page.municipality.comuneName}, add area, season, guest count and timings. An Italian ${serviceName} quote can change a lot with travel, venue rules or tight setup times.`,
      es: `Si tu evento es en ${page.municipality.comuneName} o alrededores, añade zona, temporada, invitados y horarios. Un presupuesto italiano de ${serviceName} cambia mucho con desplazamientos, reglas del lugar o montaje ajustado.`,
      fr: `Si votre événement a lieu à ${page.municipality.comuneName} ou autour, ajoutez zone, saison, nombre d'invités et horaires. Un devis italien ${serviceName} peut beaucoup varier avec déplacement, contraintes du lieu ou montage serré.`
    };
    return values[locale];
  }

  if (page.regionName) {
    const values = {
      it: `In ${page.regionName}, confronta il preventivo con persone che stanno organizzando eventi simili: stesso tipo di servizio, periodo, numero invitati e distanza dalla location.`,
      en: `In ${page.regionName}, compare the quote with people planning similar events: same service, season, guest count and distance from the venue.`,
      es: `En ${page.regionName}, compara el presupuesto con personas que preparan eventos parecidos: mismo servicio, temporada, invitados y distancia al lugar.`,
      fr: `En ${page.regionName}, comparez le devis avec des personnes qui préparent des événements similaires: même service, saison, invités et distance du lieu.`
    };
    return values[locale];
  }

  const values = {
    it: "Parti dal preventivo che hai ricevuto: caricalo, elimina i dati privati e trasformalo in una domanda semplice. Chi ha già organizzato un evento può dirti cosa chiedere prima di firmare.",
    en: "Start from the quote you received: upload it, remove private details and turn it into a simple question. People who already organized an event in Italy can tell you what to ask before signing.",
    es: "Empieza por el presupuesto que has recibido: súbelo, elimina datos privados y conviértelo en una pregunta sencilla. Quien ya organizó un evento en Italia puede decirte qué preguntar antes de firmar.",
    fr: "Partez du devis reçu: ajoutez-le, retirez les données privées et transformez-le en question simple. Ceux qui ont déjà organisé un événement en Italie peuvent vous dire quoi demander avant de signer."
  };
  return values[locale];
}

function communityActionPoints(locale: Locale) {
  const values = {
    it: [
      "Scrivi sempre città, mese dell'evento, numero persone e durata del servizio.",
      "Chiedi se IVA, trasferta, montaggio, extra orario e personale sono inclusi.",
      "Confronta solo preventivi simili: stesso servizio, stessa durata e stesse condizioni."
    ],
    en: [
      "Always add city, event month, guest count and service duration.",
      "Ask whether VAT, travel, setup, overtime and staff are included.",
      "Compare only similar quotes: same service, same duration and same conditions."
    ],
    es: [
      "Añade siempre ciudad, mes del evento, invitados y duración del servicio.",
      "Pregunta si IVA, desplazamiento, montaje, horas extra y personal están incluidos.",
      "Compara solo presupuestos parecidos: mismo servicio, misma duración y mismas condiciones."
    ],
    fr: [
      "Ajoutez toujours ville, mois de l'événement, nombre d'invités et durée du service.",
      "Demandez si TVA, déplacement, montage, heures extra et personnel sont inclus.",
      "Comparez seulement des devis similaires: même service, meme durée et memes conditions."
    ]
  };
  return values[locale];
}

function quickSteps(locale: Locale) {
  const values = {
    it: [
      ["1. Carica o incolla", "Usa foto, PDF, Word o testo. Il file non viene pubblicato nella conversazione."],
      ["2. Leggi i punti critici", "La pagina separa voci incluse, extra, parti poco chiare e domande da fare."],
      ["3. Chiedi alla community", "Quando il testo è pronto, apri un confronto con clienti e fornitori italiani."]
    ],
    en: [
      ["1. Upload or paste", "Use a photo, PDF, Word file or text. The file is not published in the discussion."],
      ["2. Read the weak points", "The page separates included items, extras, unclear parts and questions to ask."],
      ["3. Ask the community", "When the text is ready, compare it with Italian clients and suppliers."]
    ],
    es: [
      ["1. Sube o pega", "Usa foto, PDF, Word o texto. El archivo no se publica en la conversación."],
      ["2. Lee los puntos críticos", "La página separa partidas incluidas, extras, dudas y preguntas que hacer."],
      ["3. Pregunta a la comunidad", "Cuando el texto está listo, compáralo con clientes y proveedores italianos."]
    ],
    fr: [
      ["1. Ajoutez ou collez", "Utilisez photo, PDF, Word ou texte. Le fichier n'est pas publié dans la discussion."],
      ["2. Lisez les points sensibles", "La page sépare postes inclus, extras, zones floues et questions à poser."],
      ["3. Demandez à la communauté", "Quand le texte est prêt, comparez-le avec clients et prestataires italiens."]
    ]
  };
  return values[locale];
}

function trustBlocks(locale: Locale) {
  const values = {
    it: {
      protectTitle: "Come proteggiamo il tuo preventivo",
      protect: [
        "Il file originale non viene pubblicato.",
        "I dati sensibili vengono oscurati prima di creare contenuti pubblici.",
        "Puoi decidere se mantenere l'analisi privata o pubblicare una domanda anonima.",
        "I fornitori vedono solo un brief se chiedi esplicitamente un confronto."
      ],
      limitsTitle: "Cosa non facciamo",
      limits: [
        "Non pubblichiamo il tuo preventivo originale.",
        "Non inventiamo prezzi medi locali se non abbiamo dati affidabili.",
        "Non sostituiamo consulenze legali, fiscali o professionali.",
        "Non permettiamo risposte pubbliche con recapiti, spam o vendita aggressiva."
      ],
      vibesTitle: "Perché c'è Vibes Planner",
      vibesText:
        "OrganizzaEvento.com resta una community indipendente. La collaborazione con Vibes Planner serve a collegare, con discrezione, le conversazioni pubbliche alle richieste più strutturate per clienti e fornitori."
    },
    en: {
      protectTitle: "How we protect your quote",
      protect: [
        "The original file is not published.",
        "Sensitive details are removed before creating public content.",
        "You choose whether to keep the analysis private or publish an anonymous question.",
        "Suppliers only see a brief if you explicitly request a comparison."
      ],
      limitsTitle: "What we do not do",
      limits: [
        "We do not publish your original quote.",
        "We do not invent local average prices when data is not reliable.",
        "We do not replace legal, tax or professional advice.",
        "We do not allow public replies with contacts, spam or aggressive selling."
      ],
      vibesTitle: "Why Vibes Planner is here",
      vibesText:
        "OrganizzaEvento.com remains an independent community. The collaboration with Vibes Planner helps connect public discussions to more structured requests for clients and suppliers in Italy."
    },
    es: {
      protectTitle: "Cómo protegemos tu presupuesto",
      protect: [
        "El archivo original no se publica.",
        "Los datos sensibles se ocultan antes de crear contenido público.",
        "Puedes decidir si mantener el análisis privado o publicar una pregunta anonima.",
        "Los proveedores solo ven un brief si pides expresamente una comparación."
      ],
      limitsTitle: "Lo que no hacemos",
      limits: [
        "No publicamos tu presupuesto original.",
        "No inventamos precios medios locales si los datos no son fiables.",
        "No sustituimos asesoramiento legal, fiscal o profesional.",
        "No permitimos respuestas públicas con contactos, spam o venta agresiva."
      ],
      vibesTitle: "Por que esta Vibes Planner",
      vibesText:
        "OrganizzaEvento.com sigue siendo una comunidad independiente. La colaboración con Vibes Planner conecta con discreción las conversaciones públicas con solicitudes más estructuradas para clientes y proveedores en Italia."
    },
    fr: {
      protectTitle: "Comment nous protégeons votre devis",
      protect: [
        "Le fichier original n'est pas publié.",
        "Les données sensibles sont masquées avant de créer un contenu public.",
        "Vous décidez de garder l'analyse privée ou de publier une question anonyme.",
        "Les prestataires voient seulement un brief si vous demandez explicitement une comparaison."
      ],
      limitsTitle: "Ce que nous ne faisons pas",
      limits: [
        "Nous ne publions pas votre devis original.",
        "Nous n'inventons pas de prix moyens locaux sans données fiables.",
        "Nous ne remplacons pas un conseil juridique, fiscal ou professionnel.",
        "Nous n'autorisons pas les réponses publiques avec contacts, spam ou vente agressive."
      ],
      vibesTitle: "Pourquoi Vibes Planner apparaît",
      vibesText:
        "OrganizzaEvento.com reste une communauté indépendante. La collaboration avec Vibes Planner relie discrètement les discussions publiques a des demandes plus structurées pour clients et prestataires en Italie."
    }
  };
  return values[locale];
}

function JsonLd({ page, locale }: { page: QuoteAnalysisPage; locale: Locale }) {
  const breadcrumb = [
    { name: copy[locale].hubLabel, item: getQuoteAnalysisHubPage(locale).url },
    ...(page.service ? [{ name: getServiceLabel(page.service, locale), item: getQuoteAnalysisServicePage(page.service.slug, locale)?.url ?? page.url }] : []),
    ...(page.regionSlug && page.service ? [{ name: page.regionName ?? page.regionSlug, item: getQuoteAnalysisRegionPage(page.service.slug, page.regionSlug, locale)?.url ?? page.url }] : []),
    ...(page.municipality ? [{ name: page.municipality.comuneName, item: page.url }] : [])
  ];
  const details = page.service ? serviceDetails[locale][page.service.id] : null;
  const json = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.h1,
      description: page.metaDescription,
      url: page.url,
      isPartOf: { "@type": "WebSite", name: "OrganizzaEvento.com", url: "https://organizzaevento.com" },
      dateModified: page.lastSignificantUpdate
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumb.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.item
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: page.h1,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: page.url,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }
    },
    ...(details
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${page.url}#faq`,
            mainEntity: faqMainEntity(
              details.faq.map(([question, answer]) => ({ question, answer })),
              page.url
            )
          }
        ]
      : [])
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function BulletPanel({ title, items, accent = false }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <section className={`rounded-md border ${accent ? "border-violet-cta/30 bg-petal" : "border-line bg-white"} p-5 shadow-sm`}>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <p key={item} className="rounded-md bg-cream px-4 py-3 text-sm font-semibold leading-6 text-ink">
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

export function QuoteAnalysisSeoPage({ page, locale = "it" }: { page: QuoteAnalysisPage; locale?: Locale }) {
  const c = copy[locale];
  const service = page.service;
  const serviceLabel = service ? getServiceLabel(service, locale) : locale === "it" ? "evento" : locale === "en" ? "event" : locale === "es" ? "evento" : "événementiel";
  const details = service ? serviceDetails[locale][service.id] : null;
  const place = placeName(page);
  const nearby = getNearbyCapitalPages(page, locale);
  const servicePages = quoteServices.map((item) => getQuoteAnalysisServicePage(item.slug, locale)).filter(Boolean) as QuoteAnalysisPage[];
  const p0Pages = service ? getQuoteAnalysisPagesForSitemap(locale, service.slug, "P0").filter((item) => item.pageType === "city").slice(0, 6) : [];
  const steps = quickSteps(locale);
  const links = [
    getQuoteAnalysisHubPage(locale),
    ...(service ? [getQuoteAnalysisServicePage(service.slug, locale)].filter(Boolean) as QuoteAnalysisPage[] : servicePages),
    ...(service && page.regionSlug ? [getQuoteAnalysisRegionPage(service.slug, page.regionSlug, locale)].filter(Boolean) as QuoteAnalysisPage[] : []),
    ...nearby,
    ...p0Pages
  ]
    .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index)
    .filter((item) => item.url !== page.url)
    .slice(0, 10);

  return (
    <main className="bg-cream">
      <JsonLd page={page} locale={locale} />
      <section className="relative isolate overflow-hidden border-b border-line">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=80"
          alt={page.h1}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.9),rgba(47,36,48,0.62),rgba(47,36,48,0.24))]" />
        <div className="relative mx-auto grid min-h-[34rem] max-w-[1250px] gap-8 px-4 py-12 text-white sm:min-h-[36rem] sm:py-16 lg:px-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(390px,0.72fr)] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">{c.eyebrow} - {pageTypeLabel(page, locale)}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl xl:text-6xl">{page.h1}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-rose-50 sm:text-lg">{c.subtitle(serviceLabel, place)}</p>
            <p className="mt-4 inline-flex max-w-2xl rounded-md border border-white/35 bg-white/15 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm backdrop-blur">{c.noLogin}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#analizzatore" className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md bg-violet-cta px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-violet-hover">
                {c.primaryCta}
              </a>
              <VibesSupplierCta variant="dark" className="min-h-12 rounded-md px-6 text-base shadow-none transition hover:-translate-y-0.5" logoClassName="h-7 w-7">
                {c.secondaryCta}
              </VibesSupplierCta>
            </div>
          </div>
          <aside className="w-full min-w-0 rounded-md border border-white/35 bg-white/95 p-5 text-ink shadow-soft backdrop-blur sm:p-6 xl:max-w-none">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">
              {locale === "it"
                ? "Come funziona"
                : locale === "en"
                  ? "How it works"
                  : locale === "es"
                    ? "Cómo funciona"
                    : "Comment ça marche"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink sm:text-[1.65rem]">
              {locale === "it"
                ? "Prima carichi il preventivo, poi apri il confronto."
                : locale === "en"
                  ? "Upload the Italian quote first, then open the comparison."
                  : locale === "es"
                    ? "Primero subes el presupuesto italiano, luego abres la comparación."
                    : "Ajoutez d'abord le devis italien, puis ouvrez la comparaison."}
            </h2>
            <div className="mt-5 grid gap-3">
              {steps.map(([title, text]) => (
                <div key={title} className="border-l-2 border-violet-cta bg-cream px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="analizzatore" className="border-b border-line bg-[#fff8f3] py-8 sm:py-10">
        <div className="mx-auto max-w-[1250px] px-4 lg:px-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">
                {locale === "it"
                  ? "Strumento preventivo"
                  : locale === "en"
                    ? "Quote tool"
                    : locale === "es"
                      ? "Herramienta de presupuesto"
                      : "Outil devis"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">
                {locale === "it"
                  ? "Carica il preventivo e controlla cosa non torna."
                  : locale === "en"
                    ? "Upload the Italian quote and see what needs checking."
                    : locale === "es"
                    ? "Sube el presupuesto italiano y revisa qué falta aclarar."
                      : "Ajoutez le devis italien et vérifiez ce qui doit être clarifié."}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">{c.finalCtaText}</p>
            </div>
            <VibesSupplierCta className="rounded-md shadow-none" logoClassName="h-7 w-7">
              {c.findAlternatives}
            </VibesSupplierCta>
          </div>
          <div className="min-w-0 overflow-hidden rounded-md border border-line bg-[#fffdfa] p-3 shadow-sm sm:p-4 lg:p-5">
            <QuoteAnalyzer locale={locale} defaultService={service?.slug ?? "altro"} />
          </div>
        </div>
      </section>

      <section className="bg-cream py-10">
        <div className="mx-auto grid max-w-[1250px] gap-5 px-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.55fr)] lg:px-6">
          <article className="rounded-md border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.guideTitle(serviceLabel)}</p>
            <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight text-ink">
              {c.benchmarkTitle}
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
              {page.municipality || page.regionName ? localContextText(page, locale) : c.benchmarkFallback}
            </p>
            {details ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <BulletPanel title={c.includedTitle} items={details.required.slice(0, 4)} />
                <BulletPanel title={c.missingTitle} items={details.missing.slice(0, 4)} />
                <BulletPanel title={c.hiddenTitle} items={details.hidden.slice(0, 4)} />
                <BulletPanel title={c.questionsTitle} items={details.questions.slice(0, 4)} accent />
              </div>
            ) : (
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {servicePages.slice(0, 6).map((item) => (
                  <Link key={item.url} href={relativeHref(item.url)} className="focus-ring rounded-md border border-line bg-cream p-4 transition hover:-translate-y-0.5 hover:bg-petal">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-cta">{c.serviceLabel}</p>
                    <h3 className="mt-2 text-base font-semibold leading-snug text-ink">{item.h1}</h3>
                  </Link>
                ))}
              </div>
            )}
          </article>

          <aside className="rounded-md border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.localTitle}</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">{c.finalCtaTitle}</h2>
            <div className="mt-4 grid gap-3">
              {communityActionPoints(locale).map((item) => (
                <p key={item} className="rounded-md bg-cream px-4 py-3 text-sm font-semibold leading-6 text-ink">
                  {item}
                </p>
              ))}
            </div>
            <a href="#analizzatore" className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-hover">
              {c.primaryCta}
            </a>
          </aside>
        </div>

        <div className="mx-auto mt-5 grid max-w-[1250px] gap-5 px-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:px-6">
          {details ? (
            <section className="rounded-md border border-line bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-semibold text-ink">{c.faqTitle}</h2>
              <div className="mt-4 grid gap-3">
                {details.faq.map(([question, answer]) => (
                  <article key={question} className="rounded-md bg-cream p-4">
                    <h3 className="text-base font-semibold text-ink">{question}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{answer}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <section className="rounded-md border border-line bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-semibold text-ink">{c.faqTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{c.benchmarkMeta}</p>
            </section>
          )}

          <section className="rounded-md border border-line bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.internalLinksTitle}</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{c.finalCtaText}</h2>
              </div>
              <VibesSupplierCta variant="light" className="min-h-11 rounded-md shadow-none" logoClassName="h-6 w-6">
                {c.findAlternatives}
              </VibesSupplierCta>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {links.slice(0, 8).map((item) => (
                <Link key={item.url} href={relativeHref(item.url)} className="focus-ring rounded-md border border-line bg-cream px-4 py-3 text-sm font-semibold leading-6 text-ink transition hover:bg-petal">
                  {item.h1}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
