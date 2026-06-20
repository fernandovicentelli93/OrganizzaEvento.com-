export type QuoteLocale = "it" | "en" | "es" | "fr";

export type QuoteService =
  | "dj"
  | "band"
  | "fotografo"
  | "catering"
  | "location"
  | "team_building"
  | "evento_aziendale"
  | "fiori"
  | "open_bar"
  | "openbar"
  | "altro";

type NormalizedQuoteService = Exclude<QuoteService, "openbar">;

export type QuotePriceMode = "complete" | "starting_from" | "reserved" | "missing" | "partial";

export type QuoteQualityInput = {
  locale: QuoteLocale;
  rawText: string;
  sanitizedText: string;
  serviceType: QuoteService;
  eventType: string;
  city: string;
  province: string;
  region: string;
  eventDate: string;
  guests: string | number;
  estimatedDuration: string;
  indicatedAmount: string;
  userGoal: string;
  selectedDetails: string[];
};

export type CriterionScore = {
  id: string;
  label: string;
  points: number;
  maxPoints: number;
  evidence: string[];
  missing: string[];
};

export type QuoteScoreResult = {
  totalPoints: number;
  score: number;
  label: string;
  priceMode: QuotePriceMode;
  criteria: CriterionScore[];
  strengths: string[];
  missingItems: string[];
  mainRisk: string;
  questions: string[];
  recommendedAction: string;
  appliedCaps: string[];
  vibesCta: string;
};

type SignalState = {
  locale: QuoteLocale;
  service: NormalizedQuoteService;
  text: string;
  normalized: string;
  textOnlyNormalized: string;
  selectedDetails: string[];
  priceMode: QuotePriceMode;
  moneyCount: number;
  hasService: boolean;
  hasEvent: boolean;
  hasLocation: boolean;
  hasDate: boolean;
  hasGuests: boolean;
  hasDuration: boolean;
  hasZone: boolean;
  hasVat: boolean;
  hasDeposit: boolean;
  hasBalance: boolean;
  hasPayment: boolean;
  hasValidity: boolean;
  hasIncluded: boolean;
  includedHits: string[];
  serviceHits: string[];
  extraHits: string[];
  timingHits: string[];
  conditionHits: string[];
  documentHits: string[];
  hasTraceability: boolean;
  hasPersonalization: boolean;
  hasGenericListSignals: boolean;
  hasVagueAllIncluded: boolean;
  tooShort: boolean;
};

const universalIncludedKeywords = [
  "incluso",
  "inclusa",
  "inclusi",
  "include",
  "included",
  "incluido",
  "comprende",
  "compreso",
  "compresa",
  "servizio",
  "service",
  "pacchetto",
  "package",
  "personal",
  "personale",
  "staff",
  "materiali",
  "materials",
  "attrezzatura",
  "equipment",
  "montaggio",
  "setup",
  "smontaggio",
  "teardown",
  "consegna",
  "delivery",
  "preparazione",
  "assistenza",
  "sopralluogo"
];

const serviceKeywords: Record<NormalizedQuoteService, string[]> = {
  dj: [
    "ore di musica",
    "music hours",
    "impianto audio",
    "sound system",
    "luci",
    "lights",
    "microfoni",
    "microphones",
    "setup cerimonia",
    "setup aperitivo",
    "console",
    "playlist",
    "siae",
    "permessi",
    "extra orario",
    "extra hour"
  ],
  band: [
    "numero musicisti",
    "musicians",
    "durata live",
    "live duration",
    "numero set",
    "set musicali",
    "técnico audio",
    "sound technician",
    "impianto",
    "dj set",
    "pasti staff",
    "staff meals",
    "pernottamento",
    "overnight",
    "scaletta",
    "richieste speciali"
  ],
  fotografo: [
    "ore di copertura",
    "coverage hours",
    "numero fotografi",
    "photographers",
    "secondo fotografo",
    "second shooter",
    "post produzione",
    "post-produzione",
    "editing",
    "album",
    "video",
    "tempi di consegna",
    "delivery time",
    "diritti di utilizzo",
    "usage rights",
    "foto consegnate",
    "delivered photos",
    "file raw",
    "raw files"
  ],
  catering: [
    "menu",
    "numero ospiti",
    "guest count",
    "portate",
    "courses",
    "bevande",
    "drinks",
    "mise en place",
    "camerieri",
    "waiters",
    "cucina",
    "torta",
    "cake",
    "intolleranze",
    "allergies",
    "bambini",
    "children",
    "open bar",
    "stoviglie",
    "tableware"
  ],
  location: [
    "capienza",
    "capacity",
    "spazi inclusi",
    "included spaces",
    "esclusiva",
    "exclusive",
    "orari",
    "hours",
    "sale",
    "rooms",
    "giardino",
    "garden",
    "parcheggio",
    "parking",
    "pulizie",
    "cleaning",
    "allestimento",
    "setup",
    "fornitori esterni",
    "external suppliers",
    "pernottamento",
    "cauzione"
  ],
  team_building: [
    "team building",
    "teambuilding",
    "attività di gruppo",
    "team activity",
    "actividad de equipo",
    "activité team building",
    "facilitatore",
    "facilitatori",
    "facilitator",
    "brief",
    "debrief",
    "materiali",
    "materials",
    "piano b",
    "plan b",
    "indoor",
    "outdoor",
    "assicurazione",
    "insurance",
    "numero partecipanti",
    "attendees"
  ],
  evento_aziendale: [
    "evento aziendale",
    "corporate event",
    "company event",
    "evento de empresa",
    "evento corporativo",
    "événement d'entreprise",
    "meeting",
    "convention",
    "seminario",
    "seminaire",
    "conference",
    "evento clienti",
    "client event",
    "sala meeting",
    "meeting room",
    "regia tecnica",
    "technical direction",
    "prove audio",
    "audio rehearsal",
    "badge",
    "hostess",
    "accoglienza",
    "welcome desk",
    "coffee break",
    "streaming",
    "guardaroba",
    "cloakroom"
  ],
  fiori: [
    "bouquet",
    "centrotavola",
    "centerpieces",
    "arco",
    "arch",
    "tableau",
    "bottoniere",
    "consegna",
    "montaggio",
    "smontaggio",
    "noleggio",
    "rentals",
    "fiori stagionali",
    "seasonal flowers",
    "sopralluogo"
  ],
  open_bar: [
    "numero drink",
    "number of drinks",
    "durata servizio",
    "service duration",
    "bartender",
    "barman",
    "ghiaccio",
    "ice",
    "bicchieri",
    "glasses",
    "alcolici",
    "spirits",
    "analcolici",
    "cocktail list",
    "banco bar",
    "bar counter",
    "attrezzatura",
    "trasporto"
  ],
  altro: []
};

const extraKeywords = [
  "extra",
  "escluso",
  "esclusa",
  "esclusi",
  "excluded",
  "non incluso",
  "not included",
  "à parte",
  "separato",
  "supplemento",
  "supplement",
  "trasferta",
  "travel",
  "extra orario",
  "ore extra",
  "siae",
  "pulizia",
  "cleaning",
  "personale extra",
  "additional staff",
  "variazione ospiti",
  "guest change",
  "noleggi",
  "rentals",
  "richieste speciali"
];

const timingKeywords = [
  "orario",
  "orari",
  "hours",
  "durata",
  "duration",
  "arrivo",
  "arrival",
  "montaggio",
  "setup",
  "smontaggio",
  "teardown",
  "deadline",
  "disponibilità",
  "availability",
  "tempi consegna",
  "delivery time",
  "cambio orario",
  "time change",
  "ritardi",
  "delays",
  "dalle",
  "fino alle"
];

const conditionKeywords = [
  "caparra",
  "accontó",
  "deposito",
  "deposit",
  "anticipo",
  "saldo",
  "balance",
  "pagamento finale",
  "rimborso",
  "refund",
  "annullamento",
  "cancellazione",
  "cancellation",
  "recesso",
  "cambio data",
  "date change",
  "penale",
  "penalty",
  "no show",
  "meteo",
  "weather",
  "responsabilità",
  "liability",
  "contratto",
  "contract"
];

const documentKeywords = [
  "ragione sociale",
  "partita iva",
  "p iva",
  "piva",
  "vat number",
  "codice fiscale",
  "tax code",
  "sede",
  "registered office",
  "email",
  "pec",
  "telefono",
  "phone",
  "numero preventivo",
  "quote number",
  "data preventivo",
  "firma",
  "signature",
  "intestazione",
  "riferimenti fiscali",
  "email oscurata",
  "telefono oscurato",
  "partita iva oscurata",
  "codice oscurato",
  "fornitore oscurato",
  "azienda oscurata",
  "link oscurato",
  "indirizzo oscurato"
];

const priceReservedKeywords = [
  "trattativa riservata",
  "prezzo su richiesta",
  "quotazione su richiesta",
  "da concordare",
  "prezzo da definire",
  "preventivo personalizzato",
  "richiesta quotazione",
  "contattaci per prezzo",
  "on request",
  "price on request",
  "to be agreed",
  "custom quote",
  "quote on request",
  "precio bajo solicitud",
  "bajo solicitud",
  "a convenir",
  "prix sur demande",
  "sur demande"
];

const priceStartingKeywords = [
  "à partire da",
  "da euro",
  "da eur",
  "da €",
  "prezzo da",
  "pacchetto base da",
  "base da",
  "starting from",
  "from euro",
  "from €",
  "base package from",
  "à partir de",
  "desde",
  "prix à partir de"
];

const priceVatKeywords = ["iva inclusa", "iva esclusa", "+ iva", "oltre iva", "vat included", "vat excluded", "tax included", "tax excluded", "iva", "vat"];
const pricePaymentKeywords = ["modalità pagamento", "payment terms", "bonifico", "bank transfer", "carta", "card", "contanti", "cash", "pagamento"];
const priceValidityKeywords = ["validità", "valido fino", "scadenza", "valid until", "expires", "valid for", "offerta valida"];
const priceRangeRegex = /\b\d{2,7}(?:[.,]\d{1,2})?\s*(?:-|\/|a|to)\s*\d{2,7}(?:[.,]\d{1,2})?\b/i;
const moneyRegex = /(?:eur|euro|euros|usd|gbp|chf|€|\$)?\s*\d{2,7}(?:[.,]\d{1,2})?\s*(?:eur|euro|euros|usd|gbp|chf|€)?/gi;

const copy = {
  it: {
    criteria: {
      context: "Contesto evento",
      price: "Prezzo e struttura economica",
      included: "Voci incluse",
      extras: "Extra ed esclusioni",
      timing: "Timing e operatività",
      conditions: "Condizioni, caparra e cancellazione",
      document: "Professionalità documentale",
      personalization: "Personalizzazione e coerenza"
    },
    labels: {
      excellent: "Preventivo eccellente",
      veryComplete: "Molto completo",
      solid: "Solido",
      good: "Buono ma da chiarire",
      negotiable: "Accettabile / trattabile",
      weak: "Debole ma recuperabile",
      risky: "Rischioso",
      incomplete: "Molto incompleto",
      almostNotValuable: "Quasi non valutabile",
      redo: "Da rifare"
    },
    action: {
      high: "Preventivo molto solido: prima di confermare conserva una copia scritta e verifica solo gli ultimi dettagli.",
      good: "Buon preventivo, ma chiarisci i punti mancanti prima di bloccare la data.",
      medium: "Preventivo trattabile: chiedi una versione più dettagliata e confrontalo con alternative simili.",
      low: "Preventivo troppo incompleto: non confermare prima di ricevere dettagli scritti su prezzo, inclusioni, extra e condizioni."
    },
    cta: {
      high: "Vuoi capire se è davvero competitivo? Confrontalo con fornitori simili su Vibes Planner.",
      medium: "Vuoi alternative più chiare o complete Su Vibes Planner puoi confrontare fornitori in línea con evento, zona e budget.",
      low: "Prima di confermare, valuta alternative più complete: Vibes Planner può aiutarti a trovare fornitori più adatti alla tua richiesta."
    },
    risk: {
      extras: "Potrebbero emergere costi aggiuntivi dopo la conferma.",
      price: "Il prezzo non è abbastanza confrontabile con altri fornitori.",
      conditions: "Le condizioni di annullamento non sono chiare.",
      operations: "Il servizio sembra interessante, ma mancano dettagli operativi fondamentali.",
      starting: "Il pacchetto parte da una cifra base, ma il totale reale potrebbe cambiare.",
      reserved: "La trattativa riservata va trasformata in una quotazione scritta prima di confermare.",
      ok: "Il preventivo è leggibile: resta da controllare solo qualche dettaglio operativo."
    },
    strengths: {
      duration: "Il preventivo indica la durata del servizio.",
      included: "Sono presenti alcune voci incluse.",
      cohérent: "Il servizio sembra coerente con il tipo di evento.",
      traceability: "Sono presenti riferimenti fiscali o aziendali.",
      starting: "Il pacchetto base è spiegato abbastanza bene.",
      reserved: "La trattativa riservata è accompagnata da dettagli utili.",
      conditions: "Sono presenti condizioni o regole di cancellazione.",
      vat: "L'IVA o il trattamento fiscale sono indicati."
    },
    missing: {
      vat: "Non è chiaro se l'IVA sia inclusa.",
      conditions: "Non sono indicate condizioni di cancellazione o cambio data.",
      extras: "Gli extra non sono spiegati.",
      duration: "La durata del servizio non è chiara.",
      extraHours: "Manca il costo delle ore extra.",
      reserved: "Il prezzo e indicato come trattativa riservata: serve una quotazione scritta prima di confermare.",
      starting: "Il prezzo parte da una cifra base: serve capire cosa fa salire il totale.",
      traceability: "Mancano dati aziendali o riferimenti tracciabili.",
      deposit: "Caparra, accontó o saldo non sono scritti chiaramente.",
      short: "Il testo è troppo breve per valutare bene il preventivo.",
      generic: "Il testo sembra un listino generico, non un preventivo costruito sul tuo evento."
    },
    questions: {
      vat: "L'IVA è inclusa nel prezzo indicato",
      extras: "Quali costi extra possono essere aggiunti",
      extraHours: "Quanto costa ogni ora extra",
      conditions: "Cosa succede in caso di cancellazione o cambio data",
      deposit: "La caparra ? rimborsabile",
      duration: "La durata del servizio e confermata",
      transport: "Trasferta, montaggio e smontaggio sono inclusi",
      starting: "Il prezzo indicato è finale o solo à partire da",
      base: "Cosa comprende esattamente il pacchetto base",
      written: "Potete inviare una versione scritta completa del preventivo"
    }
  },
  en: {
    criteria: {
      context: "Event context",
      price: "Price and payment structure",
      included: "Included items",
      extras: "Extras and exclusions",
      timing: "Timing and operations",
      conditions: "Deposit and cancellation terms",
      document: "Document reliability",
      personalization: "Personalization and fit"
    },
    labels: {
      excellent: "Excellent quote",
      veryComplete: "Very complete",
      solid: "Solid",
      good: "Good, but clarify",
      negotiable: "Acceptable / negotiable",
      weak: "Weak but recoverable",
      risky: "Risky",
      incomplete: "Very incomplete",
      almostNotValuable: "Almost not assessable",
      redo: "Needs rewriting"
    },
    action: {
      high: "Very solid quote: keep a written copy and check only the last details before confirming.",
      good: "Good quote, but clarify the missing points before holding the date.",
      medium: "Negotiable quote: ask for a more detailed version and compare it with similar Italian alternatives.",
      low: "Too incomplete: do not confirm before receiving written details on price, inclusions, extras and terms."
    },
    cta: {
      high: "Want to know if it is truly competitive in Italy Compare it with similar suppliers on Vibes Planner.",
      medium: "Want clearer or more complete alternatives Vibes Planner can help you compare Italian suppliers by event, area and budget.",
      low: "Before confirming, consider more complete alternatives: Vibes Planner can help you find Italian suppliers better aligned with your request."
    },
    risk: {
      extras: "Extra costs may appear after confirmation.",
      price: "The price is not comparable enough with other Italian suppliers.",
      conditions: "Cancellation or date-change terms are not clear.",
      operations: "The service looks interesting, but key operational details are missing.",
      starting: "The package starts from a base amount, but the real total may change.",
      reserved: "The reserved negotiation should become a written quote before you confirm.",
      ok: "The quote is readable: only a few operational details remain to check."
    },
    strengths: {
      duration: "The quote mentions the service duration.",
      included: "Some included items are visible.",
      cohérent: "The service seems cohérent with the event type.",
      traceability: "Business or fiscal references are present.",
      starting: "The base package is explained reasonably well.",
      reserved: "The reserved negotiation includes useful details.",
      conditions: "Cancellation or contract terms are present.",
      vat: "VAT or tax treatment is mentioned."
    },
    missing: {
      vat: "It is not clear whether VAT is included.",
      conditions: "Cancellation or date-change terms are missing.",
      extras: "Extras are not explained.",
      duration: "The service duration is not clear.",
      extraHours: "The cost of extra hours is missing.",
      reserved: "The price is on request: ask for a written quote before confirming.",
      starting: "The price starts from a base amount: clarify what increases the total.",
      traceability: "Business details or traceable references are missing.",
      deposit: "Deposit, advance payment or final balance are not written clearly.",
      short: "The text is too short to assess the quote properly.",
      generic: "The text looks like a generic price list, not a quote built around your event."
    },
    questions: {
      vat: "Is VAT included in the quoted price",
      extras: "Which extra costs can be added",
      extraHours: "How much is each extra hour",
      conditions: "What happens in case of cancellation or date change",
      deposit: "Is the deposit refundable",
      duration: "Is the service duration confirmed",
      transport: "Are travel, setup and teardown included",
      starting: "Is this final or only a starting price",
      base: "What exactly does the base package include",
      written: "Can you send a complete written quote"
    }
  },
  es: {
    criteria: {
      context: "Contexto del evento",
      price: "Precio y estructura economica",
      included: "Partidas incluidas",
      extras: "Extras y exclusiones",
      timing: "Horarios y operativa",
      conditions: "Deposito y cancelación",
      document: "Fiabilidad documental",
      personalization: "Personalizacion y coherencia"
    },
    labels: {
      excellent: "Presupuesto excelente",
      veryComplete: "Muy completo",
      solid: "Solido",
      good: "Bueno, pero por aclarar",
      negotiable: "Aceptable / negociable",
      weak: "Débil pero recuperable",
      risky: "Riesgoso",
      incomplete: "Muy incompleto",
      almostNotValuable: "Casi no evaluable",
      redo: "Hay que rehacerlo"
    },
    action: {
      high: "Presupuesto muy solido: guarda una copia escrita y verifica solo los ultimos detalles antes de confirmar.",
      good: "Buen presupuesto, pero aclara los puntos pendientes antes de bloquear la fecha.",
      medium: "Presupuesto negociable: pide una versión más detallada y compáralo con alternativas italianas similares.",
      low: "Demásiado incompleto: no confirmes antes de recibir detalles escritos sobre precio, inclusiones, extras y condiciones."
    },
    cta: {
      high: "Quieres saber si es realmente competitivo en Italia Comparalo con proveedores similares en Vibes Planner.",
      medium: "Quieres alternativas más claras o completas En Vibes Planner puedes comparar proveedores italianos por evento, zona y presupuesto.",
      low: "Antes de confirmar, valora alternativas más completas: Vibes Planner puede ayudarte a encontrar proveedores italianos más adecuados."
    },
    risk: {
      extras: "Podrian aparecer costes adicionales despues de confirmar.",
      price: "El precio no es suficientemente comparable con otros proveedores italianos.",
      conditions: "Las condiciones de cancelación o cambio de fecha no estan claras.",
      operations: "El servicio parece interesante, pero faltan detalles operativos importantes.",
      starting: "El paquete parte de un importe base, pero el total real puede cambiar.",
      reserved: "La negociacion reservada debe convertirse en una cotizacion escrita antes de confirmar.",
      ok: "El presupuesto es legible: quedan algunos detalles operativos por revisar."
    },
    strengths: {
      duration: "El presupuesto indica la duración del servicio.",
      included: "Hay algunas partidas incluidas visibles.",
      cohérent: "El servicio parece cohérente con el tipo de evento.",
      traceability: "Hay referencias fiscales o de empresa.",
      starting: "El paquete base esta explicado razonablemente bien.",
      reserved: "La negociacion reservada incluye detalles utiles.",
      conditions: "Hay condiciones o reglas de cancelación.",
      vat: "El IVA o tratamiento fiscal esta indicado."
    },
    missing: {
      vat: "No esta claro si el IVA esta incluido.",
      conditions: "No aparecen condiciones de cancelación o cambio de fecha.",
      extras: "Los extras no estan explicados.",
      duration: "La duración del servicio no esta clara.",
      extraHours: "Falta el coste de las horas extra.",
      reserved: "El precio esta bajo solicitud: pide una cotizacion escrita antes de confirmar.",
      starting: "El precio parte de una base: hace falta entender que sube el total.",
      traceability: "Faltan datos de empresa o referencias trazables.",
      deposit: "Deposito, anticipo o saldo no estan escritos con claridad.",
      short: "El texto es demasiado corto para evaluar bien el presupuesto.",
      generic: "El texto parece una lista generica, no un presupuesto hecho para tu evento."
    },
    questions: {
      vat: "El IVA esta incluido en el precio indicado",
      extras: "Que costes extra pueden anadirse",
      extraHours: "Cuánto cuesta cada hora extra",
      conditions: "Que ocurre en caso de cancelación o cambio de fecha",
      deposit: "El deposito es reembolsable",
      duration: "La duración del servicio esta confirmada",
      transport: "Traslado, montaje y desmontaje están incluidos",
      starting: "El precio es final o solo à partir de",
      base: "Que incluye exactamente el paquete base",
      written: "Podéis enviar una versión escrita completa del presupuesto"
    }
  },
  fr: {
    criteria: {
      context: "Contexte de l'événement",
      price: "Prix et structure economique",
      included: "Postes inclus",
      extras: "Extras et exclusions",
      timing: "Horaires et operationnel",
      conditions: "Acompte et annulation",
      document: "Fiabilità documentaire",
      personalization: "Personnalisation et coherence"
    },
    labels: {
      excellent: "Devis excellent",
      veryComplete: "Très complet",
      solid: "Solide",
      good: "Bon, mais a clarifier",
      negotiable: "Acceptable / negociable",
      weak: "Faible mais recuperable",
      risky: "Risque",
      incomplete: "Très incomplet",
      almostNotValuable: "Presque non evaluable",
      redo: "A refaire"
    },
    action: {
      high: "Devis très solide : gardez une copie écrite et vérifiez seulement les derniers détails avant de confirmer.",
      good: "Bon devis, mais clarifiez les points manquants avant de bloquer la date.",
      medium: "Devis negociable : demandez une version plus détaillée et comparez avec des alternatives italiennes similaires.",
      low: "Trop incomplet : ne confirmez pas avant d'avoir des details écrits sur prix, inclusions, extras et conditions."
    },
    cta: {
      high: "Vous voulez savoir s'il est vraiment competitif en Italie  Comparez-le avec des prestataires similaires sur Vibes Planner.",
      medium: "Vous voulez des alternatives plus claires ou completes  Vibes Planner peut comparer des prestataires italiens selon événement, zone et budget.",
      low: "Avant de confirmer, regardez des alternatives plus complètes : Vibes Planner peut vous aider à trouver des prestataires italiens mieux adaptés."
    },
    risk: {
      extras: "Des coûts supplémentaires peuvent apparaitre après confirmation.",
      price: "Le prix n'est pas assez comparable avec d'autres prestataires italiens.",
      conditions: "Les conditions d'annulation ou changement de date ne sont pas claires.",
      operations: "Le service semble interessant, mais des details operationnels importants manquent.",
      starting: "Le forfait part d'un montant de base, mais le total réel peut changer.",
      reserved: "La negociation reservee doit devenir un devis écrit avant confirmation.",
      ok: "Le devis est lisible : seuls quelques détails opérationnels restent à vérifier."
    },
    strengths: {
      duration: "Le devis indique la durée du service.",
      included: "Certains postes inclus sont visibles.",
      cohérent: "Le service semble cohérent avec le type d'événement.",
      traceability: "Des references fiscales ou d'entreprise sont presentes.",
      starting: "Le forfait de base est assez bien explique.",
      reserved: "La negociation reservee contient des details utiles.",
      conditions: "Des conditions ou regles d'annulation sont presentes.",
      vat: "La TVA ou le traitement fiscal est indique."
    },
    missing: {
      vat: "On ne comprend pas si la TVA est incluse.",
      conditions: "Les conditions d'annulation ou changement de date manquent.",
      extras: "Les extras ne sont pas expliques.",
      duration: "La durée du service n'est pas claire.",
      extraHours: "Le coût des heures supplémentaires manque.",
      reserved: "Le prix est sur demande : demandez un devis écrit avant de confirmer.",
      starting: "Le prix part d'un montant de base : il faut comprendre ce qui augmente le total.",
      traceability: "Les données d'entreprise ou references tracables manquent.",
      deposit: "Acompte, avance ou solde ne sont pas écrits clairement.",
      short: "Le texte est trop court pour bien evaluer le devis.",
      generic: "Le texte ressemble à une liste générique, pas à un devis construit pour votre événement."
    },
    questions: {
      vat: "La TVA est-elle incluse dans le prix indique ",
      extras: "Quels coûts extra peuvent être ajoutes ",
      extraHours: "Combien coûte chaque heure supplémentaire ",
      conditions: "Que se passe-t-il en cas d'annulation ou changement de date ",
      deposit: "L'acompte est-il remboursable ",
      duration: "La durée du service est-elle confirmee ",
      transport: "Deplacement, montage et démontage sont-ils inclus ",
      starting: "Le prix est-il final ou seulement à partir de ",
      base: "Que comprend exactement le forfait de base ",
      written: "Pouvez-vous envoyer une version écrite complète du devis "
    }
  }
} satisfies Record<QuoteLocale, Record<string, unknown>>;

const signalTranslations: Record<string, Partial<Record<QuoteLocale, string>>> = {
  "Tipo servizio indicato": { en: "Service type detected", es: "Tipo de servicio indicado", fr: "Type de service indique" },
  "Tipo servizio poco chiaro": { en: "Service type not clear", es: "Tipo de servicio poco claro", fr: "Type de service peu clair" },
  "Tipo evento indicato": { en: "Event type detected", es: "Tipo de evento indicado", fr: "Type d'événement indique" },
  "Tipo evento assente": { en: "Event type missing", es: "Tipo de evento ausente", fr: "Type d'événement absent" },
  "Città o area indicate": { en: "City or area detected", es: "Ciudad o zona indicada", fr: "Ville ou zone indiquee" },
  "Città o area assenti": { en: "City or area missing", es: "Ciudad o zona ausente", fr: "Ville ou zone absente" },
  "Data o periodo indicati": { en: "Date or period detected", es: "Fecha o periodo indicado", fr: "Date ou periode indiquee" },
  "Data evento assente": { en: "Event date missing", es: "Fecha del evento ausente", fr: "Date de l'événement absente" },
  "Numero ospiti rilevato": { en: "Guest count detected", es: "Número de invitados detectado", fr: "Nombre d'invités détecté" },
  "Numero ospiti assente": { en: "Guest count missing", es: "Numero de invitados ausente", fr: "Nombre d'invités absent" },
  "Durata rilevata": { en: "Duration detected", es: "Duracion detectada", fr: "Durée detectee" },
  "Zona del servizio rilevata": { en: "Service area detected", es: "Zona del servicio detectada", fr: "Zone du service detectee" },
  "Trattativa riservata rilevata": { en: "Reserved negotiation detected", es: "Negociacion reservada detectada", fr: "Negociation reservee detectee" },
  "Prezzo à partire da rilevato": { en: "Starting price detected", es: "Precio desde detectado", fr: "Prix à partir de détecté" },
  "Importo o range rilevato": { en: "Amount or range detected", es: "Importe o rango detectado", fr: "Montant ou fourchette détecté" },
  "Importo parziale rilevato": { en: "Partial amount detected", es: "Importe parcial detectado", fr: "Montant partiel détecté" },
  "Struttura economica incompleta": { en: "Incomplete price structure", es: "Estructura economica incompleta", fr: "Structure economique incomplete" },
  "Prezzo assente": { en: "Price missing", es: "Precio ausente", fr: "Prix absent" },
  "IVA rilevata": { en: "VAT detected", es: "IVA detectado", fr: "TVA detectee" },
  "Caparra o accontó rilevati": { en: "Deposit or advance payment detected", es: "Depósito o anticipo detectado", fr: "Acompte ou avance détecté" },
  "Saldo rilevato": { en: "Final balance detected", es: "Saldo detectado", fr: "Solde détecté" },
  "Modalità pagamento rilevate": { en: "Payment terms detected", es: "Modalidad de pago detectada", fr: "Modalites de paiement detectees" },
  "Validità offerta rilevata": { en: "Offer validity detected", es: "Validez de la oferta detectada", fr: "Validità de l'offre detectee" },
  "Struttura prezzo articolata": { en: "Structured pricing detected", es: "Precio estructurado detectado", fr: "Prix structuré détecté" },
  "Pagamenti rilevati": { en: "Payment details detected", es: "Pagos detectados", fr: "Paiements detectes" },
  "Voci incluse rilevate": { en: "Included items detected", es: "Partidas incluidas detectadas", fr: "Postes inclus detectes" },
  "Dettagli specifici servizio rilevati": { en: "Service-specific details detected", es: "Detalles especificos del servicio detectados", fr: "Details specifiques du service detectes" },
  "Checklist usata come segnale leggero": { en: "Checklist used as a light signal", es: "Checklist usada como senal ligera", fr: "Checklist utilisee comme signal leger" },
  "Le voci incluse sono poco dettagliate": { en: "Included items are not detailed enough", es: "Las partidas incluidas tienen poco detalle", fr: "Les postes inclus manquent de detail" },
  "Mancano dettagli tipici del servizio selezionato": { en: "Typical details for this service are missing", es: "Faltan detalles tipicos del servicio elegido", fr: "Des details typiques du service choisi manquent" },
  "Extra o esclusioni rilevati": { en: "Extras or exclusions detected", es: "Extras o exclusiones detectados", fr: "Extras ou exclusions detectes" },
  "Ore extra citate": { en: "Extra hours mentioned", es: "Horas extra mencionadas", fr: "Heures supplémentaires mentionnees" },
  "Dettagli operativi rilevati": { en: "Operational details detected", es: "Detalles operativos detectados", fr: "Details operationnels detectes" },
  "Orari, arrivo o smontaggio poco chiari": { en: "Hours, arrival or teardown are not clear", es: "Horarios, llegada o desmontaje poco claros", fr: "Horaires, arrivee ou démontage peu clairs" },
  "Caparra o deposito rilevati": { en: "Deposit detected", es: "Deposito detectado", fr: "Acompte détecté" },
  "Cancellazione o cambio data rilevati": { en: "Cancellation or date change detected", es: "Cancelación o cambio de fecha detectados", fr: "Annulation ou changement de date détecté" },
  "Tracciabilità o dati oscurati rilevati": { en: "Traceability or redacted business data detected", es: "Trazabilidad o datos ocultos detectados", fr: "Traçabilité ou données masquées détectées" },
  "Riferimenti documentali presenti": { en: "Document references present", es: "Referencias documentales presentes", fr: "References documentaires presentes" },
  "Preventivo coerente con il caso evento": { en: "Quote fits the event case", es: "El presupuesto encaja con el caso del evento", fr: "Le devis correspond au cas événementiel" },
  "Contesto evento poco personalizzato": { en: "Event context is not personalized enough", es: "Contexto del evento poco personalizado", fr: "Contexte de l'événement peu personnalise" },
  "Solo prezzo, descrizione del servizio insufficiente": { en: "Price only, not enough service description", es: "Solo precio, descripcion del servicio insuficiente", fr: "Prix seul, description du service insuffisante" },
  "Mancano prezzo e dettagli operativi": { en: "Price and operational details are missing", es: "Faltan precio y detalles operativos", fr: "Prix et details operationnels manquants" },
  "Formula generica tutto incluso senza dettaglio": { en: "Generic all-inclusive wording without detail", es: "Formula todo incluido generica sin detalle", fr: "Formule tout inclus generique sans detail" },
  "Solo preventivi davvero completi arrivano a 10": { en: "Only truly complete quotes can reach 10", es: "Solo presupuestos realmente completos llegan a 10", fr: "Seuls les devis vraiment complets peuvent atteindre 10" }
};

function t(locale: QuoteLocale) {
  return copy[locale] as (typeof copy)["it"];
}

function translateSignal(value: string, locale: QuoteLocale) {
  if (locale === "it") return value;
  return signalTranslations[value]?.[locale] ?? value;
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, " ")
    .replace(/[^a-z0-9?€$+\sì.[\]-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(normalizedText: string, words: string[]) {
  return words.some((word) => normalizedText.includes(normalizeText(word)));
}

function hitWords(normalizedText: string, words: string[]) {
  return Array.from(new Set(words.filter((word) => normalizedText.includes(normalizeText(word)))));
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeService(service: QuoteService): NormalizedQuoteService {
  if (!service) return "altro";
  if (service === "openbar") return "open_bar";
  return service;
}

function moneyMatches(value: string) {
  return value.match(moneyRegex) ?? [];
}

function selectedHas(selected: string[], words: string[]) {
  const selectedText = selected.join(" ");
  return hasAny(selectedText, words);
}

export function detectPriceMode(text: string, indicatedAmount = ""): QuotePriceMode {
  const normalized = normalizeText([text, indicatedAmount].join(" "));
  const textOnly = normalizeText(text);
  const hasReserved = hasAny(normalized, priceReservedKeywords);
  const hasStarting = hasAny(normalized, priceStartingKeywords) || /\bda\s*(?:\u20ac|eur|euro)\s*\d{2,7}/i.test(normalized);
  const hasMoney = moneyMatches(normalized).length > 0 || priceRangeRegex.test(normalized);
  const hasStructure = hasAny(normalized, [...priceVatKeywords, ...conditionKeywords, ...pricePaymentKeywords, ...priceValidityKeywords]);

  if (hasReserved) return "reserved";
  if (hasStarting) return "starting_from";
  if (hasMoney && (hasStructure || moneyMatches(textOnly).length > 1 || priceRangeRegex.test(textOnly))) return "complete";
  if (hasMoney) return "partial";
  return "missing";
}

function buildState(input: QuoteQualityInput): SignalState {
  const locale = input.locale ?? "it";
  const service = normalizeService(input.serviceType);
  const fieldText = [
    input.serviceType,
    input.eventType,
    input.city,
    input.province,
    input.region,
    input.eventDate,
    input.guests,
    input.estimatedDuration,
    input.indicatedAmount,
    input.userGoal
  ]
    .filter(Boolean)
    .join(" ");
  const text = [input.rawText, input.sanitizedText, fieldText].filter(Boolean).join("\n");
  const textOnly = [input.rawText, input.sanitizedText].filter(Boolean).join("\n");
  const normalized = normalizeText(text);
  const textOnlyNormalized = normalizeText(textOnly);
  const selectedDetails = (input.selectedDetails ?? []).map(normalizeText);
  const includedHits = unique([
    ...hitWords(normalized, universalIncludedKeywords),
    ...selectedDetails.filter((item) => hasAny(item, universalIncludedKeywords)).map((item) => item)
  ]);
  const serviceHits = unique([
    ...hitWords(normalized, serviceKeywords[service]),
    ...selectedDetails.filter((item) => hasAny(item, serviceKeywords[service])).map((item) => item)
  ]);
  const extraHits = unique([...hitWords(normalized, extraKeywords), ...selectedDetails.filter((item) => hasAny(item, extraKeywords))]);
  const timingHits = unique([...hitWords(normalized, timingKeywords), ...selectedDetails.filter((item) => hasAny(item, timingKeywords))]);
  const conditionHits = unique([...hitWords(normalized, conditionKeywords), ...selectedDetails.filter((item) => hasAny(item, conditionKeywords))]);
  const documentHits = unique(hitWords(normalized, documentKeywords));
  const priceMode = detectPriceMode(textOnly, input.indicatedAmount);

  return {
    locale,
    service,
    text,
    normalized,
    textOnlyNormalized,
    selectedDetails,
    priceMode,
    moneyCount: moneyMatches([textOnly, input.indicatedAmount].join(" ")).length,
    hasService: service !== "altro" || serviceHits.length > 0,
    hasEvent: Boolean(input.eventType && input.eventType !== "altro") || hasAny(normalized, ["matrimonio", "wedding", "boda", "mariage", "compleanno", "birthday", "aziendale", "corporate", "festa privata"]),
    hasLocation: Boolean(input.city || input.province || input.region) || hasAny(normalized, ["città", "city", "zona", "area", "location", "venue", "villa", "sala"]),
    hasDate: Boolean(input.eventDate) || hasAny(normalized, ["data", "date", "giorno", "periodo", "stagione", "2026", "2027"]),
    hasGuests: Boolean(input.guests) || hasAny(normalized, ["ospiti", "invitati", "guest", "guests", "persone", "people", "partecipanti"]),
    hasDuration: Boolean(input.estimatedDuration) || timingHits.length > 0,
    hasZone: Boolean(input.city || input.region) || hasAny(normalized, ["zona", "area", "quartiere", "lake", "como", "toscana", "roma", "milano", "italia"]),
    hasVat: hasAny(normalized, priceVatKeywords) || selectedHas(selectedDetails, ["iva", "vat"]),
    hasDeposit: hasAny(normalized, ["caparra", "accontó", "deposito", "deposit", "anticipo", "acompte"]) || selectedHas(selectedDetails, ["caparra", "deposit", "accontó"]),
    hasBalance: hasAny(normalized, ["saldo", "balance", "pagamento finale", "final payment"]) || selectedHas(selectedDetails, ["saldo", "balance"]),
    hasPayment: hasAny(normalized, pricePaymentKeywords),
    hasValidity: hasAny(normalized, priceValidityKeywords),
    hasIncluded: includedHits.length > 0 || serviceHits.length > 0,
    includedHits,
    serviceHits,
    extraHits,
    timingHits,
    conditionHits,
    documentHits,
    hasTraceability: documentHits.length >= 2 || hasAny(normalized, ["partita iva oscurata", "fornitore oscurato", "email oscurata", "telefono oscurato"]),
    hasPersonalization: false,
    hasGenericListSignals: hasAny(normalized, ["listino", "price list", "catalogo", "tariffario", "pacchetti standard", "standard package"]),
    hasVagueAllIncluded: hasAny(normalized, ["tutto incluso", "all inclusive", "todo incluido", "tout inclus"]) && serviceHits.length < 2 && includedHits.length < 4,
    tooShort: textOnlyNormalized.length > 0 && textOnlyNormalized.length < 70
  };
}

function addCriterion(id: string, label: string, points: number, maxPoints: number, evidence: string[], missing: string[]): CriterionScore {
  return {
    id,
    label,
    points: round(clamp(points, 0, maxPoints)),
    maxPoints,
    evidence: unique(evidence).slice(0, 5),
    missing: unique(missing).slice(0, 5)
  };
}

function scoreContext(state: SignalState, input: QuoteQualityInput) {
  const c = t(state.locale);
  let points = 0;
  const evidence: string[] = [];
  const missing: string[] = [];

  if (state.hasService) {
    points += 1.4;
    evidence.push("Tipo servizio indicato");
  } else missing.push("Tipo servizio poco chiaro");
  if (state.hasEvent) {
    points += 1.4;
    evidence.push("Tipo evento indicato");
  } else missing.push("Tipo evento assente");
  if (state.hasLocation) {
    points += 1.8;
    evidence.push("Città o area indicate");
  } else missing.push("Città o area assenti");
  if (state.hasDate) {
    points += 1.2;
    evidence.push("Data o periodo indicati");
  } else missing.push("Data evento assente");
  if (state.hasGuests) {
    points += 1.3;
    evidence.push("Numero ospiti rilevato");
  } else missing.push("Numero ospiti assente");
  if (state.hasDuration) {
    points += 1.6;
    evidence.push("Durata rilevata");
  } else missing.push(c.missing.duration);
  if (state.hasZone || input.region) {
    points += 1.3;
    evidence.push("Zona del servizio rilevata");
  }

  return addCriterion("context", c.criteria.context, points, 10, evidence, missing);
}

function scorePrice(state: SignalState) {
  const c = t(state.locale);
  const evidence: string[] = [];
  const missing: string[] = [];
  let points = 0;
  const detailDepth =
    state.includedHits.length + state.serviceHits.length + state.extraHits.length + state.timingHits.length + state.conditionHits.length + (state.hasTraceability ? 2 : 0);

  if (state.priceMode === "reserved") {
    evidence.push("Trattativa riservata rilevata");
    if (detailDepth >= 10) points = 11;
    else if (detailDepth >= 6) points = 8.5;
    else points = 5.2;
    missing.push(c.missing.reserved);
  } else if (state.priceMode === "starting_from") {
    evidence.push("Prezzo à partire da rilevato");
    if (state.serviceHits.length >= 4 && state.includedHits.length >= 4) points = 13;
    else if (state.serviceHits.length >= 2 || state.includedHits.length >= 3) points = 9;
    else points = 6;
    missing.push(c.missing.starting);
  } else if (state.priceMode === "complete") {
    points += 5;
    evidence.push("Importo o range rilevato");
  } else if (state.priceMode === "partial") {
    points += 4;
    evidence.push("Importo parziale rilevato");
    missing.push("Struttura economica incompleta");
  } else {
    points += 1;
    missing.push("Prezzo assente");
  }

  if (state.priceMode !== "reserved" && state.priceMode !== "starting_from") {
    if (state.hasVat) {
      points += 3;
      evidence.push("IVA rilevata");
    } else missing.push(c.missing.vat);
    if (state.hasDeposit) {
      points += 2.7;
      evidence.push("Caparra o accontó rilevati");
    } else missing.push(c.missing.deposit);
    if (state.hasBalance) {
      points += 2.2;
      evidence.push("Saldo rilevato");
    }
    if (state.hasPayment) {
      points += 2.1;
      evidence.push("Modalità pagamento rilevate");
    }
    if (state.hasValidity) {
      points += 2;
      evidence.push("Validità offerta rilevata");
    }
    if (priceRangeRegex.test(state.normalized) || state.moneyCount > 1) {
      points += 1;
      evidence.push("Struttura prezzo articolata");
    }
  } else {
    if (state.hasVat) evidence.push("IVA rilevata");
    if (state.hasDeposit || state.hasBalance) evidence.push("Pagamenti rilevati");
  }

  return addCriterion("price", c.criteria.price, points, 18, evidence, missing);
}

function scoreIncluded(state: SignalState) {
  const c = t(state.locale);
  const evidence: string[] = [];
  const missing: string[] = [];
  const universalPoints = Math.min(6, state.includedHits.length * 1.35);
  const servicePoints = Math.min(10, state.serviceHits.length * 2);
  const checkboxPoints = Math.min(2, state.selectedDetails.length * 0.4);
  const points = universalPoints + servicePoints + checkboxPoints;

  if (state.includedHits.length) evidence.push("Voci incluse rilevate");
  if (state.serviceHits.length) evidence.push("Dettagli specifici servizio rilevati");
  if (state.selectedDetails.length) evidence.push("Checklist usata come segnale leggero");
  if (points < 8) missing.push("Le voci incluse sono poco dettagliate");
  if (state.service !== "altro" && state.serviceHits.length < 3) missing.push("Mancano dettagli tipici del servizio selezionato");

  return addCriterion("included", c.criteria.included, points, 18, evidence, missing);
}

function scoreExtras(state: SignalState) {
  const c = t(state.locale);
  const evidence: string[] = [];
  const missing: string[] = [];
  let points = Math.min(14, state.extraHits.length * 2.3);
  if (state.extraHits.length) evidence.push("Extra o esclusioni rilevati");
  if (hasAny(state.normalized, ["ore extra", "extra hour", "extra orario"])) {
    points += 1.5;
    evidence.push("Ore extra citate");
  } else if (state.service === "dj" || state.service === "band") {
    missing.push(c.missing.extraHours);
  }
  if (!state.extraHits.length) missing.push(c.missing.extras);
  return addCriterion("extras", c.criteria.extras, points, 14, evidence, missing);
}

function scoreTiming(state: SignalState) {
  const c = t(state.locale);
  const evidence: string[] = [];
  const missing: string[] = [];
  const points = Math.min(10, state.timingHits.length * 2 + (state.hasDuration ? 2.5 : 0));
  if (state.hasDuration) evidence.push("Durata rilevata");
  if (state.timingHits.length > 1) evidence.push("Dettagli operativi rilevati");
  if (!state.hasDuration) missing.push(c.missing.duration);
  if (state.timingHits.length < 2) missing.push("Orari, arrivo o smontaggio poco chiari");
  return addCriterion("timing", c.criteria.timing, points, 10, evidence, missing);
}

function scoreConditions(state: SignalState) {
  const c = t(state.locale);
  const evidence: string[] = [];
  const missing: string[] = [];
  let points = Math.min(12, state.conditionHits.length * 1.7);
  if (state.hasDeposit) {
    points += 1.2;
    evidence.push("Caparra o deposito rilevati");
  } else missing.push(c.missing.deposit);
  if (hasAny(state.normalized, ["annullamento", "cancellazione", "cancellation", "cancelación", "annulation", "cambio data", "date change", "penale"])) {
    points += 2.3;
    evidence.push("Cancellazione o cambio data rilevati");
  } else missing.push(c.missing.conditions);
  return addCriterion("conditions", c.criteria.conditions, points, 12, evidence, missing);
}

function scoreDocument(state: SignalState) {
  const c = t(state.locale);
  const evidence: string[] = [];
  const missing: string[] = [];
  const points = Math.min(10, state.documentHits.length * 1.8 + (state.hasTraceability ? 2.2 : 0));
  if (state.hasTraceability) evidence.push("Tracciabilità o dati oscurati rilevati");
  if (state.documentHits.length >= 3) evidence.push("Riferimenti documentali presenti");
  if (!state.hasTraceability) missing.push(c.missing.traceability);
  return addCriterion("document", c.criteria.document, points, 10, evidence, missing);
}

function scorePersonalization(state: SignalState) {
  const c = t(state.locale);
  const evidence: string[] = [];
  const missing: string[] = [];
  const signals = [state.hasEvent, state.hasLocation, state.hasGuests, state.hasDate, state.hasDuration, state.hasService].filter(Boolean).length;
  let points = Math.min(8, signals * 1.15 + (state.serviceHits.length ? 1 : 0));
  if (signals >= 4) evidence.push("Preventivo coerente con il caso evento");
  if (state.hasGenericListSignals) {
    points -= 2;
    missing.push(c.missing.generic);
  }
  if (signals < 3) missing.push("Contesto evento poco personalizzato");
  return addCriterion("personalization", c.criteria.personalization, points, 8, evidence, missing);
}

function scoreLabel(score: number, locale: QuoteLocale) {
  const labels = t(locale).labels;
  if (score >= 9.5) return labels.excellent;
  if (score >= 8.8) return labels.veryComplete;
  if (score >= 7.8) return labels.solid;
  if (score >= 6.8) return labels.good;
  if (score >= 5.8) return labels.negotiable;
  if (score >= 4.8) return labels.weak;
  if (score >= 3.8) return labels.risky;
  if (score >= 2.8) return labels.incomplete;
  if (score >= 1.8) return labels.almostNotValuable;
  return labels.redo;
}

function scoreFromPoints(points: number) {
  if (points >= 95) return 10;
  if (points >= 88) return round(9 + ((points - 88) / 7) * 0.8);
  if (points >= 78) return round(8 + ((points - 78) / 10) * 0.9);
  if (points >= 68) return round(7 + ((points - 68) / 10) * 0.9);
  if (points >= 58) return round(6 + ((points - 58) / 10) * 0.9);
  if (points >= 48) return round(5 + ((points - 48) / 10) * 0.9);
  if (points >= 38) return round(4 + ((points - 38) / 10) * 0.9);
  if (points >= 28) return round(3 + ((points - 28) / 10) * 0.9);
  if (points >= 18) return round(2 + ((points - 18) / 10) * 0.9);
  return round(1 + (clamp(points, 0, 17) / 18) * 0.8);
}

function detailLevel(state: SignalState) {
  return state.includedHits.length + state.serviceHits.length + state.extraHits.length + state.timingHits.length + state.conditionHits.length + (state.hasTraceability ? 2 : 0);
}

function hasAllExcellentRequirements(state: SignalState) {
  return (
    (state.priceMode === "complete" || state.priceMode === "partial") &&
    state.hasVat &&
    state.hasDeposit &&
    state.hasBalance &&
    state.hasDuration &&
    state.hasIncluded &&
    state.extraHits.length > 0 &&
    hasAny(state.normalized, ["annullamento", "cancellazione", "cancellation", "cambio data", "penale"]) &&
    state.hasTraceability &&
    state.hasPersonalization
  );
}

function applyScoreCaps(score: number, state: SignalState, rawPoints: number) {
  const c = t(state.locale);
  let nextScore = score;
  const caps: string[] = [];
  const cap = (max: number, reason: string) => {
    if (nextScore > max) {
      nextScore = max;
      caps.push(reason);
    }
  };

  const level = detailLevel(state);
  if (state.priceMode === "reserved") {
    cap(level >= 10 ? 7.2 : level >= 6 ? 6.2 : 5.2, c.missing.reserved);
  }
  if (state.priceMode === "starting_from") {
    cap(state.serviceHits.length >= 4 && state.includedHits.length >= 4 ? 8 : state.serviceHits.length >= 2 || state.includedHits.length >= 3 ? 7 : 6, c.missing.starting);
  }
  if (!state.hasDuration) cap(7, c.missing.duration);
  if (!state.hasVat) cap(8, c.missing.vat);
  if (!state.hasDeposit && !state.hasBalance) cap(8, c.missing.deposit);
  if (!hasAny(state.normalized, ["annullamento", "cancellazione", "cancellation", "cancelación", "annulation", "cambio data", "date change", "penale"])) {
    cap(8, c.missing.conditions);
  }
  if (!state.extraHits.length) cap(7.5, c.missing.extras);
  if (state.priceMode !== "missing" && state.serviceHits.length < 2 && state.includedHits.length < 2) cap(5, "Solo prezzo, descrizione del servizio insufficiente");
  if (state.priceMode === "missing" && state.timingHits.length < 2 && state.serviceHits.length < 2) cap(4, "Mancano prezzo e dettagli operativi");
  if (!state.hasTraceability) cap(6.5, c.missing.traceability);
  if (state.hasVagueAllIncluded) cap(6, "Formula generica tutto incluso senza dettaglio");
  if (state.tooShort) cap(4.5, c.missing.short);
  if (state.hasGenericListSignals && !state.hasPersonalization) cap(6.5, c.missing.generic);
  if (!hasAllExcellentRequirements(state) && rawPoints >= 95) cap(9.4, "Solo preventivi davvero completi arrivano a 10");

  return { score: round(nextScore), appliedCaps: unique(caps) };
}

function buildStrengths(state: SignalState) {
  const s = t(state.locale).strengths;
  return unique([
    state.hasDuration ? s.duration : "",
    state.hasIncluded ? s.included : "",
    state.hasPersonalization ? s.cohérent : "",
    state.hasTraceability ? s.traceability : "",
    state.priceMode === "starting_from" && state.includedHits.length >= 3 ? s.starting : "",
    state.priceMode === "reserved" && detailLevel(state) >= 6 ? s.reserved : "",
    state.conditionHits.length >= 3 ? s.conditions : "",
    state.hasVat ? s.vat : ""
  ]).slice(0, 6);
}

function buildMissing(state: SignalState) {
  const m = t(state.locale).missing;
  return unique([
    !state.hasVat ? m.vat : "",
    !hasAny(state.normalized, ["annullamento", "cancellazione", "cancellation", "cancelación", "annulation", "cambio data", "date change", "penale"]) ? m.conditions : "",
    !state.extraHits.length ? m.extras : "",
    !state.hasDuration ? m.duration : "",
    (state.service === "dj" || state.service === "band") && !hasAny(state.normalized, ["ore extra", "extra hour", "extra orario"]) ? m.extraHours : "",
    state.priceMode === "reserved" ? m.reserved : "",
    state.priceMode === "starting_from" ? m.starting : "",
    !state.hasTraceability ? m.traceability : "",
    !state.hasDeposit && !state.hasBalance ? m.deposit : "",
    state.tooShort ? m.short : "",
    state.hasGenericListSignals ? m.generic : ""
  ]).slice(0, 8);
}

function buildQuestions(state: SignalState) {
  const q = t(state.locale).questions;
  return unique([
    !state.hasVat ? q.vat : "",
    !state.extraHits.length ? q.extras : "",
    (state.service === "dj" || state.service === "band") && !hasAny(state.normalized, ["ore extra", "extra hour", "extra orario"]) ? q.extraHours : "",
    !hasAny(state.normalized, ["annullamento", "cancellazione", "cancellation", "cancelación", "annulation", "cambio data", "date change", "penale"]) ? q.conditions : "",
    !state.hasDeposit ? q.deposit : "",
    !state.hasDuration ? q.duration : "",
    !hasAny(state.normalized, ["trasferta", "travel", "montaggio", "setup", "smontaggio", "teardown"]) ? q.transport : "",
    state.priceMode === "starting_from" ? q.starting : "",
    state.priceMode === "starting_from" ? q.base : "",
    q.written
  ]).slice(0, 8);
}

function buildRisk(state: SignalState) {
  const r = t(state.locale).risk;
  if (state.priceMode === "reserved") return r.reserved;
  if (state.priceMode === "starting_from") return r.starting;
  if (!state.extraHits.length) return r.extras;
  if (state.priceMode === "missing" || state.priceMode === "partial") return r.price;
  if (!hasAny(state.normalized, ["annullamento", "cancellazione", "cancellation", "cancelación", "annulation", "cambio data", "date change", "penale"])) return r.conditions;
  if (!state.hasDuration || state.timingHits.length < 2) return r.operations;
  return r.ok;
}

function buildAction(score: number, locale: QuoteLocale) {
  const a = t(locale).action;
  if (score >= 9) return a.high;
  if (score >= 7) return a.good;
  if (score >= 5) return a.medium;
  return a.low;
}

function buildCta(score: number, locale: QuoteLocale) {
  const cta = t(locale).cta;
  if (score >= 8) return cta.high;
  if (score >= 5) return cta.medium;
  return cta.low;
}

export function analyzeQuoteQuality(input: QuoteQualityInput): QuoteScoreResult {
  const state = buildState(input);
  state.hasPersonalization = [state.hasEvent, state.hasLocation, state.hasGuests, state.hasDate, state.hasDuration, state.hasService].filter(Boolean).length >= 4;

  const criteria = [
    scoreContext(state, input),
    scorePrice(state),
    scoreIncluded(state),
    scoreExtras(state),
    scoreTiming(state),
    scoreConditions(state),
    scoreDocument(state),
    scorePersonalization(state)
  ];
  const rawPoints = round(criteria.reduce((total, criterion) => total + criterion.points, 0));
  const rawScore = scoreFromPoints(rawPoints);
  const capped = applyScoreCaps(rawScore, state, rawPoints);
  const finalScore = capped.score;
  const localizedCriteria = criteria.map((criterion) => ({
    ...criterion,
    evidence: criterion.evidence.map((item) => translateSignal(item, state.locale)),
    missing: criterion.missing.map((item) => translateSignal(item, state.locale))
  }));

  return {
    totalPoints: round(finalScore * 10),
    score: finalScore,
    label: scoreLabel(finalScore, state.locale),
    priceMode: state.priceMode,
    criteria: localizedCriteria,
    strengths: buildStrengths(state),
    missingItems: buildMissing(state),
    mainRisk: buildRisk(state),
    questions: buildQuestions(state),
    recommendedAction: buildAction(finalScore, state.locale),
    appliedCaps: capped.appliedCaps.map((item) => translateSignal(item, state.locale)),
    vibesCta: buildCta(finalScore, state.locale)
  };
}
