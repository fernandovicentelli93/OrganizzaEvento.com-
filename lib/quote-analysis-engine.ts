import { redactQuoteText } from "./redaction-engine";

export type QuoteAnalysisLocale = "it" | "en" | "es" | "fr";
export type QuoteServiceType =
  | "dj"
  | "band"
  | "fotografo"
  | "catering"
  | "location"
  | "team_building"
  | "evento_aziendale"
  | "fiori"
  | "open_bar"
  | "altro";
export type QuoteEventType =
  | "matrimonio"
  | "compleanno"
  | "aziendale"
  | "festa_privata"
  | "diciottesimo"
  | "cerimonia"
  | "altro";
export type QuoteObjective = "capire_caro" | "cosa_manca" | "confrontare" | "domande_fornitore" | "pubblicare_anonima";

export type QuoteFindingPriority = "Alta" | "Media" | "Bassa";

export type QuoteFinding = {
  label: string;
  priority: QuoteFindingPriority;
  reason: string;
};

export type QuoteLineItem = {
  label: string;
  amount: string | null;
};

export type QuoteAnalysisInput = {
  locale?: QuoteAnalysisLocale;
  text: string;
  serviceType?: QuoteServiceType;
  eventType?: QuoteEventType;
  city?: string;
  province?: string;
  region?: string;
  eventDate?: string;
  guestsCount?: number | null;
  durationEstimate?: string;
  totalAmount?: string;
  objective?: QuoteObjective;
  serviceSpecificFields?: string[];
  fileNames?: string[];
};

export type QuoteAnalysisReport = {
  quote_analysis_id: string;
  detected_service: QuoteServiceType;
  detected_event_type: QuoteEventType;
  extracted_total_price: string | null;
  extracted_line_items: QuoteLineItem[];
  included_items: string[];
  missing_items: QuoteFinding[];
  unclear_items: QuoteFinding[];
  possible_hidden_costs: string[];
  questions_to_ask: string[];
  negotiation_points: string[];
  supplier_message_draft: string;
  user_summary: string;
  public_anonymized_summary: string;
  score_chiarezza: number;
  score_completezza: number;
  score_rischio_extra: "basso" | "medio" | "alto";
  score_coerenza_prezzo: "non valutabile" | "stimata" | "coerente" | "da confrontare";
  score_affidabilita_informazioni: number;
  verdict:
    | "Sembra completo"
    | "Prezzo da verificare"
    | "Mancano voci importanti"
    | "Possibili extra nascosti"
    | "Preventivo poco chiaro"
    | "Serve confronto con alternative";
  benchmark_used: { area: string; note: string; lastUpdated: string } | null;
  benchmark_confidence: "bassa" | "media" | "alta" | null;
  recommended_next_action: string;
  redacted_text: string;
  redactions_count: number;
};

type ServiceProfile = {
  keywords: string[];
  included: string[];
  required: string[];
  hidden: string[];
  questions: Record<QuoteAnalysisLocale, string[]>;
};

const quoteItemTranslations: Record<string, Partial<Record<QuoteAnalysisLocale, string>>> = {
  "affitto spazio": { en: "venue rental", es: "alquiler del espacio", fr: "location du lieu" },
  album: { en: "album", es: "album", fr: "album" },
  "album o video se indicati": { en: "album or video if listed", es: "album o video si aparecen", fr: "album ou video si indique" },
  "alcolici inclusi": { en: "included spirits", es: "alcoholes incluidos", fr: "alcools inclus" },
  attrezzatura: { en: "equipment", es: "equipamiento", fr: "equipement" },
  "attività team building": { en: "team-building activity", es: "actividad de team building", fr: "activité de team building" },
  "assicurazione attività": { en: "activity insurance", es: "seguro de la actividad", fr: "assurance de l'activité" },
  "brief obiettivi": { en: "objectives brief", es: "brief de objetivos", fr: "brief d'objectifs" },
  badge: { en: "badges", es: "badges", fr: "badges" },
  "bevande indicate": { en: "listed drinks", es: "bebidas indicadas", fr: "boissons indiquees" },
  "bicchieri se indicati": { en: "glasses if listed", es: "vasos si aparecen", fr: "verres si indiques" },
  barman: { en: "bartender", es: "barman", fr: "barman" },
  bouquet: { en: "bouquet", es: "ramo", fr: "bouquet" },
  "cambio data": { en: "date change", es: "cambio de fecha", fr: "changement de date" },
  "camerieri extra": { en: "extra waiters", es: "camareros extra", fr: "serveurs supplémentaires" },
  "climatizzazione": { en: "heating or cooling", es: "climatizacion", fr: "climatisation" },
  "condizioni presenti": { en: "listed conditions", es: "condiciones indicadas", fr: "conditions indiquees" },
  "condizioni che trasformano il prezzo indicativo in prezzo finale": {
    en: "conditions that turn the indicative price into the final amount",
    es: "condiciones que convierten el precio orientativo en precio final",
    fr: "conditions qui transforment le prix indicatif en montant final"
  },
  "console": { en: "DJ console", es: "consola", fr: "console" },
  "costo ore extra": { en: "extra-hour cost", es: "coste de horas extra", fr: "coût des heures supplémentaires" },
  "cosa include": { en: "what is included", es: "que incluye", fr: "ce qui est inclus" },
  "cosa resta fuori": { en: "what remains excluded", es: "que queda fuera", fr: "ce qui reste exclu" },
  "consegna digitale": { en: "digital delivery", es: "entrega digital", fr: "livraison numerique" },
  "durata": { en: "duration", es: "duración", fr: "durée" },
  "durata effettiva": { en: "actual duration", es: "duración real", fr: "durée réelle" },
  "durata live": { en: "live duration", es: "duración del directo", fr: "durée du live" },
  "durata servizio bar": { en: "bar service duration", es: "duración del servicio de bar", fr: "durée du service bar" },
  "durata set": { en: "set duration", es: "duración del set", fr: "durée du set" },
  "debrief finale": { en: "final debrief", es: "debrief final", fr: "debrief final" },
  "esclusiva": { en: "exclusive use", es: "uso exclusivo", fr: "exclusivite" },
  "eventuali note operative": { en: "operational notes", es: "notas operativas", fr: "notes operationnelles" },
  extra: { en: "extras", es: "extras", fr: "extras" },
  "file raw": { en: "raw files", es: "archivos raw", fr: "fichiers raw" },
  facilitatore: { en: "facilitator", es: "facilitador", fr: "facilitateur" },
  "fiori fuori stagione": { en: "out-of-season flowers", es: "flores fuera de temporada", fr: "fleurs hors saison" },
  "ghiaccio": { en: "ice", es: "hielo", fr: "glace" },
  "guardiania": { en: "security guard", es: "vigilancia", fr: "gardiennage" },
  guardaroba: { en: "cloakroom", es: "guardarropa", fr: "vestiaire" },
  hostess: { en: "hostesses", es: "azafatas", fr: "hotesses" },
  "impianto": { en: "sound system", es: "equipo de sonido", fr: "sonorisation" },
  "impianto audio": { en: "sound system", es: "equipo de sonido", fr: "sonorisation" },
  "impianto adeguato alla location": { en: "sound system suitable for the venue", es: "equipo adecuado al lugar", fr: "sonorisation adaptee au lieu" },
  "IVA": { en: "VAT", es: "IVA", fr: "TVA" },
  "luci": { en: "lights", es: "luces", fr: "lumières" },
  "luci aggiuntive": { en: "additional lights", es: "luces adicionales", fr: "lumières supplémentaires" },
  "materiali": { en: "materials", es: "materiales", fr: "matériel" },
  "materiali extra": { en: "extra materials", es: "materiales extra", fr: "matériel supplémentaire" },
  "materiali per attività": { en: "activity materials", es: "materiales de actividad", fr: "matériel d'activité" },
  "lingua facilitatori": { en: "facilitator language", es: "idioma de los facilitadores", fr: "langue des facilitateurs" },
  "menù o buffet": { en: "menu or buffet", es: "menú o buffet", fr: "menu ou buffet" },
  "menù speciali": { en: "special menus", es: "menús especiales", fr: "menus spéciaux" },
  "microfoni": { en: "microphones", es: "micrófonos", fr: "micros" },
  "montaggio": { en: "setup", es: "montaje", fr: "montage" },
  "montaggio e smontaggio": { en: "setup and teardown", es: "montaje y desmontaje", fr: "montage et démontage" },
  "montaggio notturno": { en: "night teardown", es: "desmontaje nocturno", fr: "démontage de nuit" },
  "noleggio stoviglie": { en: "tableware rental", es: "alquiler de vajilla", fr: "location vaisselle" },
  "numero drink": { en: "number of drinks", es: "numero de bebidas", fr: "nombre de boissons" },
  "numero foto consegnate": { en: "number of delivered photos", es: "numero de fotos entregadas", fr: "nombre de photos livrees" },
  "numero minimo": { en: "minimum number", es: "numero minimo", fr: "nombre minimum" },
  "numero partecipanti": { en: "number of attendees", es: "numero de participantes", fr: "nombre de participants" },
  "numero musicisti": { en: "number of musicians", es: "numero de musicos", fr: "nombre de musiciens" },
  "ore di copertura": { en: "coverage hours", es: "horas de cobertura", fr: "heures de couverture" },
  "ore di musica": { en: "music hours", es: "horas de musica", fr: "heures de musique" },
  "ore extra": { en: "extra hours", es: "horas extra", fr: "heures supplémentaires" },
  "orari di utilizzo": { en: "usage hours", es: "horarios de uso", fr: "horaires d'utilisation" },
  "orario limite": { en: "end time", es: "horario limite", fr: "horaire límite" },
  "pagamenti": { en: "payments", es: "pagos", fr: "paiements" },
  "parcheggio": { en: "parking", es: "parking", fr: "parking" },
  "pasti staff": { en: "staff meals", es: "comidas del staff", fr: "repas equipe" },
  "penali cambio programma": { en: "program-change penalties", es: "penalizaciones por cambio de programa", fr: "penalites de changement de programme" },
  "permessi musicali": { en: "music permits", es: "permisos musicales", fr: "droits musicaux" },
  "personale aggiuntivo": { en: "additional staff", es: "personal adicional", fr: "personnel supplémentaire" },
  "piano b": { en: "plan B", es: "plan B", fr: "plan B" },
  "piano B se presente": { en: "plan B if listed", es: "plan B si aparece", fr: "plan B si indique" },
  "piano b indoor/outdoor": { en: "indoor/outdoor plan B", es: "plan B interior/exterior", fr: "plan B interieur/exterieur" },
  "post-produzione": { en: "editing", es: "postproduccion", fr: "retouche" },
  "foto/video": { en: "photo/video", es: "foto/video", fr: "photo/video" },
  "programma attività": { en: "activity program", es: "programa de actividades", fr: "programme d'activité" },
  "prove tecniche": { en: "technical rehearsals", es: "pruebas técnicas", fr: "tests techniques" },
  "prezzo a persona": { en: "price per person", es: "precio por persona", fr: "prix par personne" },
  "pulizie": { en: "cleaning", es: "limpieza", fr: "nettoyage" },
  "pulizie finali": { en: "final cleaning", es: "limpieza final", fr: "nettoyage final" },
  "regia tecnica": { en: "technical direction", es: "dirección técnica", fr: "regie technique" },
  "responsabile evento": { en: "event manager", es: "responsable del evento", fr: "responsable événement" },
  "servizio": { en: "service", es: "servicio", fr: "service" },
  "servizio camerieri": { en: "waiter service", es: "servicio de camareros", fr: "service serveurs" },
  "servizio principale": { en: "main service", es: "servicio principal", fr: "service principal" },
  "segnaletica": { en: "signage", es: "señalética", fr: "signalétique" },
  "sicurezzà partecipanti": { en: "participant safety", es: "seguridad de participantes", fr: "sécurité des participants" },
  "set musicali": { en: "music sets", es: "sets musicales", fr: "sets musicaux" },
  "spazi meeting": { en: "meeting rooms", es: "salas de reunion", fr: "salles de reunion" },
  streaming: { en: "streaming", es: "streaming", fr: "streaming" },
  "seconda postazione audio": { en: "second audio setup", es: "segunda postacion de audio", fr: "second point audio" },
  "secondo fotografo": { en: "second shooter", es: "secondo fotografo", fr: "second photographe" },
  "smontaggio": { en: "teardown", es: "desmontaje", fr: "démontage" },
  "strutture": { en: "structures", es: "estructuras", fr: "structures" },
  "taglio torta": { en: "cake cutting", es: "corte de tarta", fr: "découpe du gâteau" },
  "tecnica audio": { en: "audio equipment", es: "técnica de audio", fr: "technique audio" },
  "técnico audio": { en: "sound technician", es: "técnico de sonido", fr: "technicien son" },
  "tempi di consegna": { en: "delivery times", es: "plazos de entrega", fr: "délais de livraison" },
  "tipologia fiori": { en: "flower type", es: "tipo de flores", fr: "type de fleurs" },
  "torta se presente": { en: "cake if listed", es: "tarta si aparece", fr: "gâteau si indiqué" },
  "trasferta": { en: "travel", es: "desplazamiento", fr: "déplacement" },
  "trasporto": { en: "transport", es: "transporte", fr: "transport" },
  traduzione: { en: "translation", es: "traduccion", fr: "traduction" },
  "saldo": { en: "final payment", es: "pago final", fr: "solde" },
  accoglienza: { en: "welcome desk", es: "recepción", fr: "accueil" },
  "allestimenti brandizzati": { en: "branded setups", es: "montajes de marca", fr: "installations brandee" },
  "coffee break": { en: "coffee break", es: "coffee break", fr: "pause cafe" },
  "variazione invitati": { en: "guest-count changes", es: "cambio de invitados", fr: "variation du nombre d'invités" }
};

export function translateQuoteAnalysisItem(value: string, locale: QuoteAnalysisLocale) {
  if (locale === "it") return value;
  const normalized = normalize(value);
  for (const [key, labels] of Object.entries(quoteItemTranslations)) {
    if (normalize(key) === normalized) return labels[locale] ?? value;
  }
  return value;
}

const serviceProfiles: Record<QuoteServiceType, ServiceProfile> = {
  dj: {
    keywords: ["dj", "playlist", "siae", "console", "micrófono", "audio", "luci", "dancefloor"],
    included: ["ore di musica", "impianto audio", "console", "luci", "microfoni", "montaggio e smontaggio"],
    required: ["durata effettiva", "impianto adeguato alla location", "costo ore extra", "trasferta", "permessi musicali"],
    hidden: ["ore extra", "seconda postazione audio", "luci aggiuntive", "trasferta", "permessi musicali", "montaggio notturno"],
    questions: {
      it: [
        "Quante ore effettive di musica sono incluse e da che ora partono?",
        "Il costo include impianto audio adeguato alla location e al numero di ospiti?",
        "Luci, microfoni e una eventuale seconda postazione sono compresi?",
        "Quanto costa ogni ora extra se la festa continua?",
        "Trasferta, montaggio, smontaggio e permessi musicali sono inclusi o separati?"
      ],
      en: [
        "How many real music hours are included and when do they start?",
        "Does the price include a sound system suitable for the venue and guest count?",
        "Are lights, microphones and any second audio setup included?",
        "How much is each extra hour if the party runs longer?",
        "Are travel, setup, teardown and music permits included or separate?"
      ],
      es: [
        "Cuántas horas reales de musica están incluidas y desde que momento?",
        "El precio incluye sonido adecuado al lugar y al número de invitados?",
        "Luces, micrófonos y una segunda postacion están incluidos?",
        "Cuánto cuesta cada hora extra si la fiesta continua?",
        "Desplazamiento, montaje, desmontaje y permisos musicales van incluidos o aparte?"
      ],
      fr: [
        "Combien d'heures réelles de musique sont incluses et à partir de quand?",
        "Le prix inclut-il une sonorisation adaptee au lieu et au nombre d'invités?",
        "Lumieres, micros et second point audio sont-ils inclus ?",
        "Combien coûte chaque heure supplémentaire si la fête continue?",
        "Deplacement, montage, démontage et droits musicaux sont-ils inclus ou sépares?"
      ]
    }
  },
  band: {
    keywords: ["band", "musicisti", "live", "cantante", "set", "tecnico audio", "scaletta"],
    included: ["numero musicisti", "durata live", "set musicali", "impianto", "tecnico audio"],
    required: ["numero musicisti", "durata set", "tecnico audio", "pasti staff", "trasferta"],
    hidden: ["set aggiuntivi", "tecnico extra", "pasti staff", "pernottamento", "scaletta personalizzata"],
    questions: {
      it: [
        "Quanti musicisti saranno presenti e per quanti set?",
        "Il tecnico audio e l'impianto sono inclusi nel prezzo?",
        "Il DJ set dopo il live è compreso o va aggiunto?",
        "Pasti, trasferta e pernottamento dello staff sono già conteggiati",
        "La scaletta è personalizzabile senza costi extra?"
      ],
      en: [
        "How many musicians will be present and for how many sets?",
        "Are the sound technician and system included?",
        "Is the DJ set after the live performance included?",
        "Are staff meals, travel and overnight stay already included?",
        "Can the setlist be customized without extra cost?"
      ],
      es: [
        "Cuantos musicos estarán presentes y cuantos sets harán?",
        "Tecnico de sonido y equipo están incluidos?",
        "El DJ set posterior al directo esta incluido?",
        "Comidas, traslado y alojamiento del staff ya estan calculados?",
        "La lista de canciónes se puede personalizar sin extra?"
      ],
      fr: [
        "Combien de musiciens seront presents et pour combien de sets?",
        "Le technicien son et le systeme sont-ils inclus ?",
        "Le DJ set après le live est-il compris ?",
        "Repas, déplacement et hebergement de l'equipe sont-ils inclus ?",
        "La playlist peut-elle être personnalisee sans supplement"
      ]
    }
  },
  fotografo: {
    keywords: ["fotografo", "foto", "album", "shooting", "post-produzione", "video", "drone"],
    included: ["ore di copertura", "numero fotografi", "post-produzione", "consegna digitale", "album o video se indicati"],
    required: ["ore di copertura", "numero foto consegnate", "post-produzione", "diritti di utilizzo", "tempi di consegna"],
    hidden: ["secondo fotografo", "album", "extra orario", "trasferta", "consegna rapida", "file raw"],
    questions: {
      it: [
        "Quante ore di copertura sono incluse?",
        "Il secondo fotografo è compreso o è un extra?",
        "Quante foto finali vengono consegnate e con quale post-produzione?",
        "Album, vidéo, drone e file raw sono inclusi o esclusi?",
        "Quali sono i tempi di consegna e i diritti di utilizzo?"
      ],
      en: [
        "How many coverage hours are included?",
        "Is the second shooter included or extra?",
        "How many final photos are delivered and with what editing?",
        "Are album, vidéo, drone and raw files included or excluded?",
        "What are the delivery times and usage rights?"
      ],
      es: [
        "¿Cuántas horas de cobertura están incluidas?",
        "El secondo fotografo esta incluido o es extra?",
        "Cuántas fotos finales entregan y con que edición?",
        "Album, video, dron y archivos raw están incluidos o excluidos?",
        "Cuales son los plazos de entrega y derechos de uso?"
      ],
      fr: [
        "Combien d'heures de couverture sont incluses?",
        "Le second photographe est-il inclus ou en supplément?",
        "Combien de photos finales sont livrées et avec quelle retouche?",
        "Album, vidéo, drone et fichiers raw sont-ils inclus ou exclus?",
        "Quels sont les délais de livraison et droits d'utilisation?"
      ]
    }
  },
  catering: {
    keywords: ["catering", "menu", "buffet", "camerieri", "bevande", "torta", "mise en place"],
    included: ["menù o buffet", "servizio", "bevande indicate", "torta se presente", "mise en place"],
    required: ["prezzo a persona", "numero minimo", "bevande", "servizio camerieri", "variazione invitati"],
    hidden: ["camerieri extra", "open bar", "taglio torta", "noleggio stoviglie", "trasporto", "menù speciali"],
    questions: {
      it: [
        "Il prezzo è a persona o a forfait?",
        "Qual è il numero minimo garantito",
        "Bevande, caffè, torta e taglio torta sono inclusi?",
        "Quanti camerieri sono previsti per il numero di ospiti?",
        "Fino a quando posso modificare il numero definitivo degli invitati?"
      ],
      en: [
        "Is the price per person or fixed?",
        "What is the guaranteed minimum guest count?",
        "Are drinks, coffee, cake and cake cutting included?",
        "How many waiters are planned for the guest count?",
        "Until when can the final guest count be changed?"
      ],
      es: [
        "¿El precio es por persona o cerrado?",
        "Cuál es el numero minimo garantizado",
        "Bebidas, cafe, tarta y corte están incluidos?",
        "¿Cuántos camareros están previstos?",
        "Hasta cuando se puede modificar el numero final?"
      ],
      fr: [
        "Le prix est-il par personne ou forfaitaire?",
        "Quel est le minimum garanti?",
        "Boissons, café, gâteau et découpe sont-ils inclus ?",
        "Combien de serveurs sont prévus?",
        "Jusqu'à quand peut-on modifier le nombre final?"
      ]
    }
  },
  location: {
    keywords: ["location", "villa", "sala", "venue", "ristorante", "agriturismo", "affitto", "esclusiva"],
    included: ["affitto spazio", "orari di utilizzo", "pulizie se indicate", "parcheggio", "piano B se presente"],
    required: ["orario limite", "esclusiva", "piano B", "pulizie", "fornitori esterni"],
    hidden: ["ore extra", "pulizie finali", "esclusiva", "guardiania", "climatizzazione", "tecnica audio"],
    questions: {
      it: [
        "Qual è l'orario massimo reale per musica, ospiti e smontaggio",
        "La location è in esclusiva o ci sono altri eventi?",
        "Pulizie, parcheggio, climatizzazione e sicurezza sono inclusi?",
        "Esiste un piano B scritto in caso di pioggia?",
        "Posso portare fornitori esterni o devo usare quelli imposti?"
      ],
      en: [
        "What is the real end time for music, guests and teardown?",
        "Is the venue exclusive or are other events present?",
        "Are cleaning, parking, climate control and security included?",
        "Is there a written rain plan?",
        "Can external suppliers be used?"
      ],
      es: [
        "Cuál es el horario limite real para musica, invitados y desmontaje",
        "El lugar es exclusivo o hay otros eventos?",
        "Limpieza, parking, climatizacion y seguridad están incluidos?",
        "Hay un plan B escrito por lluvia?",
        "Puedo llevar proveedores externos?"
      ],
      fr: [
        "Quelle est l'heure limite réelle pour musique, invités et démontage?",
        "Le lieu est-il exclusif ou partage?",
        "Nettoyage, parking, climatisation et sécurité sont-ils inclus",
        "Y a-t-il un plan B pluie écrit?",
        "Puis-je choisir des prestataires externes?"
      ]
    }
  },
  fiori: {
    keywords: ["fiori", "floreale", "bouquet", "centrotavola", "allestimento", "candele", "arco"],
    included: ["bouquet", "composizioni", "centrotavola", "trasporto", "montaggio"],
    required: ["numero composizioni", "tipologia fiori", "montaggio", "smontaggio", "sostituzioni"],
    hidden: ["fiori fuori stagione", "strutture", "noleggi", "smontaggio notturno", "trasferta"],
    questions: {
      it: [
        "Quali fiori sono previsti e quali alternative useranno se non disponibili?",
        "Quante composizioni precise sono comprese?",
        "Montaggio, smontaggio e ritiro materiali sono inclusi?",
        "Candele, strutture e noleggi sono inclusi o separati?",
        "Il prezzo cambia se il progetto floreale viene ridotto?"
      ],
      en: [
        "Which flowers are planned and what alternatives are allowed?",
        "How many exact arrangements are included?",
        "Are setup, teardown and material pickup included?",
        "Are candles, structures and rentals included or separate?",
        "Can the price change if the floral project is reduced?"
      ],
      es: [
        "Que flores estan previstas y que alternativas se usaran?",
        "Cuántas composiciones exactas incluye?",
        "Montaje, desmontaje y recogida están incluidos?",
        "Velas, estructuras y alquileres van aparte?",
        "Cambia el precio si se reduce el proyecto floral?"
      ],
      fr: [
        "Quelles fleurs sont prevues et quelles alternatives seront utilisees?",
        "Combien de compositions exactes sont incluses?",
        "Montage, démontage et retrait du matériel sont-ils inclus",
        "Bougies, structures et locations sont-elles séparees?",
        "Le prix change-t-il si le projet floral est reduit?"
      ]
    }
  },
  open_bar: {
    keywords: ["open bar", "cocktail", "barman", "drink", "bevande", "vino", "birra", "spirits"],
    included: ["durata servizio bar", "barman", "lista cocktail", "attrezzatura", "bicchieri se indicati"],
    required: ["numero drink", "durata", "alcolici inclusi", "ghiaccio", "trasporto"],
    hidden: ["drink extra", "premium spirits", "ore extra", "ghiaccio", "bicchieri", "permessi"],
    questions: {
      it: [
        "Open bar significa drink illimitati o numero massimo di consumazioni?",
        "Quante ore di servizio bar sono incluse?",
        "Quali alcolici sono compresi e quali sono premium?",
        "Bicchieri, ghiaccio, banco bar e trasporto sono inclusi?",
        "Come vengono gestiti minorenni o ospiti che non bevono alcol?"
      ],
      en: [
        "Does open bar mean unlimited drinks or a fixed number?",
        "How many bar service hours are included?",
        "Which spirits are included and which are premium?",
        "Are glasses, ice, bar counter and transport included?",
        "How are minors or non-drinking guests handled?"
      ],
      es: [
        "Open bar significa ilimitado o numero maximo?",
        "¿Cuántas horas de servicio están incluidas?",
        "Que alcoholes están incluidos y cuales son premium?",
        "Vasos, hielo, barra y transporte están incluidos?",
        "Como gestionan menores o invitados que no beben?"
      ],
      fr: [
        "Open bar signifie illimité ou nombre fixe?",
        "Combien d'heures de bar sont incluses?",
        "Quels alcools sont inclus et lesquels sont premium?",
        "Verres, glace, bar et transport sont-ils inclus ?",
        "Comment gèrent-ils mineurs ou invités qui ne boivent pas?"
      ]
    }
  },
  team_building: {
    keywords: [
      "team building",
      "teambuilding",
      "attività aziendale",
      "attività di gruppo",
      "outdoor training",
      "facilitatore",
      "facilitatori",
      "workshop esperienziale",
      "escape room",
      "caccia al tesoro",
      "orienteering",
      "corporate retreat",
      "team activity",
      "team event",
      "actividad de equipo",
      "actividad team building",
      "activité team building",
      "cohesion equipe"
    ],
    included: ["attività team building", "facilitatore", "materiali per attività", "brief obiettivi", "debrief finale"],
    required: ["numero partecipanti", "durata", "lingua facilitatori", "piano b indoor/outdoor", "sicurezzà partecipanti"],
    hidden: ["trasferta", "materiali extra", "assicurazione attività", "spazi meeting", "foto/video", "penali cambio programma"],
    questions: {
      it: [
        "L'attività e pensata per il nostro obiettivo o è un format standard",
        "Quanti facilitatori sono inclusi e in che lingua gestiranno il gruppo",
        "Materiali, assicurazione, spazi indoor/outdoor e piano B sono compresi",
        "La durata indicata include briefing, attività, debrief e pause",
        "Cosa cambia nel prezzo se aumentano o diminuiscono i partecipanti"
      ],
      en: [
        "Is the activity designed around our team objective or is it a standard format",
        "How many facilitators are included and in which language will they run the group",
        "Are materials, insurance, indoor/outdoor spaces and plan B included",
        "Does the duration include briefing, activity, debrief and breaks",
        "What changes in the price if attendee numbers increase or decrease"
      ],
      es: [
        "La actividad esta pensada para nuestro objetivo o es un formato estandar",
        "Cuantos facilitadores están incluidos y en que idioma gestionaran el grupo",
        "Materiales, seguro, espacios interior/exterior y plan B están incluidos",
        "La duración incluye briefing, actividad, debrief y pausas",
        "Que cambia en el precio si suben o bajan los participantes"
      ],
      fr: [
        "L'activité est-elle adaptee a notre objectif ou s'agit-il d'un format standard",
        "Combien de facilitateurs sont inclus et dans quelle langue animeront-ils le groupe",
        "Matériel, assurance, espaces interieur/exterieur et plan B sont-ils inclus",
        "La durée inclut-elle briefing, activit?, debrief et pauses",
        "Qu'est-ce qui change dans le prix si le nombre de participants varie"
      ]
    }
  },
  evento_aziendale: {
    keywords: [
      "evento aziendale",
      "eventi aziendali",
      "cena aziendale",
      "meeting",
      "convention",
      "evento clienti",
      "evento corporate",
      "kick off",
      "kickoff",
      "all hands",
      "incentive",
      "seminario",
      "conferenza",
      "azienda",
      "corporate event",
      "company event",
      "client event",
      "corporate dinner",
      "evento de empresa",
      "evento corporativo",
      "événement d'entreprise",
      "seminaire d'entreprise"
    ],
    included: ["spazi meeting", "regia tecnica", "accoglienza", "badge", "segnaletica", "coffee break"],
    required: ["numero partecipanti", "prove tecniche", "responsabile evento", "orari di utilizzo", "pagamenti"],
    hidden: ["regia tecnica", "hostess", "badge", "guardaroba", "streaming", "traduzione", "allestimenti brandizzati"],
    questions: {
      it: [
        "Sono incluse prove tecniche audio/video prima dell'arrivo degli ospiti",
        "Accoglienza, badge, segnaletica, guardaroba e regia sono compresi o separati",
        "Coffee break, acqua e servizio in sala coprono tutti i partecipanti previsti",
        "Chi coordina scaletta, fornitori e cambi programma durante l'evento",
        "Quali costi cambiano se variano orari, partecipanti o richieste tecniche"
      ],
      en: [
        "Are audio/video rehearsals included before guests arrive",
        "Are welcome desk, badges, signage, cloakroom and technical direction included or separate",
        "Do coffee breaks, water and room service cover all expected attendees",
        "Who coordinates the schedule, suppliers and last-minute program changes",
        "Which costs change if timing, attendees or technical requests change"
      ],
      es: [
        "Las pruebas de audio/video antes de la llegada de invitados están incluidas",
        "¿Recepción, badges, señalética, guardarropa y dirección técnica van incluidos o aparte?",
        "Coffee break, agua y servicio en sala cubren a todos los participantes previstos",
        "Quien coordina agenda, proveedores y cambios de programa durante el evento",
        "¿Qué costes cambian si varían horarios, participantes o necesidades técnicas?"
      ],
      fr: [
        "Les tests audio/video avant l'arrivee des invités sont-ils inclus",
        "Accueil, badges, signalétique, vestiaire et regie sont-ils inclus ou sépares",
        "Coffee break, eau et service en salle couvrent-ils tous les participants prevus",
        "Qui coordonne le programme, les prestataires et les changements le jour J",
        "Quels coûts changent si les horaires, participants ou besoins techniques changent"
      ]
    }
  },
  altro: {
    keywords: [],
    included: ["servizio principale", "importi indicati", "condizioni presenti", "eventuali note operative"],
    required: ["durata", "cosa include", "cosa resta fuori", "pagamenti", "extra"],
    hidden: ["ore extra", "IVA", "trasporto", "materiali", "personale aggiuntivo", "cambio data"],
    questions: {
      it: [
        "Quali voci sono davvero incluse e quali sono solo stimate?",
        "Quali costi possono aumentare dopo la conferma?",
        "Caparra, saldo e penali sono scritti in modo chiaro?",
        "Il prezzo cambia se cambiano data, orario o numero invitati?",
        "C'è un referente unico il giorno dell'evento?"
      ],
      en: [
        "Which items are truly included and which are only estimated?",
        "Which costs could increase after confirmation?",
        "Are deposit, balance and penalties clear?",
        "Can the price change if date, timing or guest count changes?",
        "Is there one event-day contact?"
      ],
      es: [
        "¿Qué partidas están realmente incluidas y cuáles son estimadas?",
        "Que costes pueden subir después de confirmar?",
        "Deposito, saldo y penalizaciones son claros?",
        "Cambia el precio si cambian fecha, horario o invitados?",
        "Hay un referente unico el día del evento?"
      ],
      fr: [
        "Quels postes sont vraiment inclus et lesquels sont estimes?",
        "Quels coûts peuvent augmenter après confirmation",
        "Acompte, solde et penalites sont-ils clairs?",
        "Le prix change-t-il si date, horaires ou invités changent?",
        "Y a-t-il un contact unique le jour de l'événement"
      ]
    }
  }
};

const eventKeywords: Record<QuoteEventType, string[]> = {
  matrimonio: ["matrimonio", "wedding", "boda", "mariage", "sposi"],
  compleanno: ["compleanno", "birthday", "cumpleaños", "anniversaire"],
  aziendale: [
    "aziendale",
    "azienda",
    "corporate",
    "empresa",
    "entreprise",
    "meeting",
    "team building",
    "teambuilding",
    "workshop",
    "convention",
    "evento clienti",
    "corporate retreat",
    "company event",
    "evento de empresa",
    "evento corporativo",
    "événement d'entreprise",
    "seminaire"
  ],
  festa_privata: ["festa privata", "private party", "fiesta privada", "fête privee"],
  diciottesimo: ["diciottesimo", "18", "eighteenth", "dieciocho"],
  cerimonia: ["cerimonia", "ceremony", "ceremonia", "cérémonie"],
  altro: []
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

function unique<T>(items: T[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function linesFromText(text: string) {
  return text
    .split(/\r?\n|;/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function moneyValues(text: string) {
  return text.match(/(?:eur|euro|euros|usd|gbp|chf|\u20ac|\$)?\s*\d{2,7}(?:[.,]\d{1,2})?\s*(?:eur|euro|euros|usd|gbp|chf|\u20ac)?/gi) ?? [];
}

function detectService(text: string, requested?: QuoteServiceType): QuoteServiceType {
  const normalized = normalize(text);
  const scored = Object.entries(serviceProfiles).map(([service, profile]) => {
    const serviceKey = service as QuoteServiceType;
    const score = profile.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalize(keyword);
      if (!normalizedKeyword || !normalized.includes(normalizedKeyword)) return total;
      return total + (normalizedKeyword.includes(" ") || normalizedKeyword.length >= 9 ? 2 : 1);
    }, 0);

    return {
      service: serviceKey,
      score,
      weightedScore: score + (requested === serviceKey && requested !== "altro" ? 1.5 : 0)
    };
  });
  scored.sort((a, b) => b.score - a.score);
  const contentWinner = scored[0];
  const requestedScore = scored.find((item) => item.service === requested)?.score ?? 0;

  if (contentWinner?.score >= 3 && contentWinner.service !== requested && contentWinner.score >= requestedScore + 2) {
    return contentWinner.service;
  }

  scored.sort((a, b) => b.weightedScore - a.weightedScore);
  if (scored[0]?.weightedScore > 0) return scored[0].service;
  return requested ?? "altro";
}

function detectEvent(text: string, requested?: QuoteEventType): QuoteEventType {
  if (requested && requested !== "altro") return requested;
  const normalized = normalize(text);
  const scored = Object.entries(eventKeywords).map(([eventType, keywords]) => ({
    eventType: eventType as QuoteEventType,
    score: keywords.reduce((total, keyword) => total + (normalized.includes(normalize(keyword)) ? 1 : 0), 0)
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score ? scored[0].eventType : requested ?? "altro";
}

function lineItems(text: string): QuoteLineItem[] {
  return linesFromText(text)
    .filter((line) => line.length > 6)
    .slice(0, 12)
    .map((line) => ({
      label: line.replace(/\s+/g, " ").slice(0, 160),
      amount: moneyValues(line)[0] ?? null
    }));
}

const quoteStructureKeywords = [
  "preventivo",
  "offerta",
  "servizio",
  "pacchetto",
  "descrizione",
  "prezzo",
  "importo",
  "totale",
  "iva",
  "vat",
  "caparra",
  "acconto",
  "deposito",
  "saldo",
  "pagamento",
  "durata",
  "ore",
  "orario",
  "data",
  "ospiti",
  "invitati",
  "partecipanti",
  "incluso",
  "inclusi",
  "compreso",
  "escluso",
  "extra",
  "trasferta",
  "montaggio",
  "smontaggio",
  "cancellazione",
  "annullamento",
  "penale",
  "validita",
  "condizioni",
  "location",
  "menu",
  "allestimento",
  "attrezzatura",
  "personale"
];

function quoteStructureClarityScore({
  text,
  lineItemList,
  amounts,
  hasTiming,
  hasPaymentTerms,
  indicative,
  unclearCount
}: {
  text: string;
  lineItemList: QuoteLineItem[];
  amounts: string[];
  hasTiming: boolean;
  hasPaymentTerms: boolean;
  indicative: boolean;
  unclearCount: number;
}) {
  const lines = linesFromText(text);
  const meaningfulLines = lines.filter((line) => normalize(line).length >= 8 && /[a-z]/i.test(normalize(line)));
  const normalized = normalize(text);
  const tokens = normalized.split(" ").filter(Boolean);
  const longWordCount = tokens.filter((token) => /[a-z]/i.test(token) && token.length >= 3).length;
  const shortTokenCount = tokens.filter((token) => token.length <= 2).length;
  const wordRatio = tokens.length ? longWordCount / tokens.length : 0;
  const shortTokenRatio = tokens.length ? shortTokenCount / tokens.length : 1;
  const compactText = text.replace(/\s/g, "");
  const readableChars = (compactText.match(/[a-zA-Z0-9À-ÿ€$.,:;/%()\-+]/g) ?? []).length;
  const unreadableRatio = compactText.length ? (compactText.length - readableChars) / compactText.length : 1;
  const structureHits = quoteStructureKeywords.filter((keyword) => normalized.includes(normalize(keyword))).length;
  const structuredLines = meaningfulLines.filter((line) => {
    const normalizedLine = normalize(line);
    return (
      moneyValues(line).length > 0 ||
      /[:\-–—]/.test(line) ||
      /^\s*(?:[-*•]|\d+[.)])/.test(line) ||
      quoteStructureKeywords.some((keyword) => normalizedLine.includes(normalize(keyword)))
    );
  });
  const structuredRatio = meaningfulLines.length ? structuredLines.length / meaningfulLines.length : 0;

  let score = 16;
  if (normalized.length >= 80) score += 10;
  if (normalized.length >= 180) score += 8;
  if (normalized.length >= 320) score += 6;
  if (meaningfulLines.length >= 3) score += 10;
  if (meaningfulLines.length >= 6) score += 8;
  if (meaningfulLines.length >= 10) score += 5;
  score += Math.min(20, Math.round(structuredRatio * 20));
  score += Math.min(18, structureHits * 3);
  if (amounts.length) score += 10;
  if (amounts.length >= 2) score += 4;
  if (lineItemList.length >= 3) score += 8;
  if (lineItemList.length >= 6) score += 4;
  if (hasTiming) score += 7;
  if (hasPaymentTerms) score += 6;
  if (indicative) score += 2;
  score -= unclearCount * 6;

  if (wordRatio < 0.35) score -= 30;
  else if (wordRatio < 0.5) score -= 15;
  if (shortTokenRatio > 0.55) score -= 14;
  if (unreadableRatio > 0.18) score -= 24;
  else if (unreadableRatio > 0.1) score -= 10;

  let nextScore = clamp(score);
  if (normalized.length < 70) nextScore = Math.min(nextScore, 38);
  if (meaningfulLines.length < 2 && normalized.length < 220) nextScore = Math.min(nextScore, 52);
  if (structuredRatio < 0.2 && structureHits < 3) nextScore = Math.min(nextScore, 55);
  if (!amounts.length && !indicative) nextScore = Math.min(nextScore, 72);
  if (wordRatio < 0.45 || unreadableRatio > 0.15) nextScore = Math.min(nextScore, 45);
  if (lineItemList.length >= 5 && structuredRatio >= 0.45 && structureHits >= 5 && amounts.length && wordRatio >= 0.55) {
    nextScore = Math.max(nextScore, 78);
  }
  if (lineItemList.length >= 8 && structuredRatio >= 0.6 && structureHits >= 7 && amounts.length >= 2 && wordRatio >= 0.58) {
    nextScore = Math.max(nextScore, 88);
  }

  return nextScore;
}

function hasIndicativePrice(text: string) {
  return hasAny(text, [
    "à partire da",
    "prezzo indicativo",
    "indicativo",
    "circa",
    "a persona",
    "per persona",
    "starting from",
    "from",
    "guide price",
    "per person",
    "on request",
    "price on request",
    "trattativa riservata",
    "prezzo su richiesta",
    "su richiesta",
    "desde",
    "à partir de",
    "precio orientativo",
    "por persona",
    "sur demande",
    "prix indicatif",
    "par personne"
  ]);
}

function findingReason(locale: QuoteAnalysisLocale, high: boolean) {
  if (locale === "en") return high ? "It can change the final cost or event management." : "Clarify it before confirming so you can compare similar offers.";
  if (locale === "es") return high ? "Puede cambiar el coste final o la gestion del evento." : "Conviene aclararlo antes de confirmar para comparar ofertas similares.";
  if (locale === "fr") return high ? "Cela peut changer le coût final ou la gestion de l'événement." : "à clarifier avant de confirmer pour comparer des offres similaires.";
  return high ? "Può cambiare il prezzo finale o la gestione dell'evento." : "Va chiarito prima della conferma per confrontare offerte simili.";
}

function unclearReason(locale: QuoteAnalysisLocale) {
  if (locale === "en") return "This sentence leaves room for interpretation: ask for a clearer written version.";
  if (locale === "es") return "La frase deja margen a interpretaciones: pide una versión escrita más clara.";
  if (locale === "fr") return "Cette phrase laisse place à l'interprétation : demandez une version écrite plus précise.";
  return "La frase lascia margine a interpretazioni: chiedi una versione più precisa.";
}

function missingFindings(profile: ServiceProfile, text: string, locale: QuoteAnalysisLocale): QuoteFinding[] {
  return profile.required
    .filter((item) => !hasAny(text, [item]))
    .slice(0, 6)
    .map((label, index) => ({
      label,
      priority: index < 2 ? "Alta" : index < 4 ? "Media" : "Bassa",
      reason: findingReason(locale, index < 2)
    }));
}

function unclearFindings(text: string, locale: QuoteAnalysisLocale): QuoteFinding[] {
  const lines = linesFromText(text).filter((line) =>
    hasAny(line, ["eventuale", "salvo", "da definire", "circa", "variabile", "minimo", "penale", "deposit", "caparra", "accontó", "on request", "su richiesta"])
  );

  return lines.slice(0, 5).map((line, index) => ({
    label: line.slice(0, 120),
    priority: index === 0 ? "Alta" : "Media",
    reason: unclearReason(locale)
  }));
}

function includedItems(profile: ServiceProfile, text: string, selected: string[]) {
  const lines = linesFromText(text).filter((line) => hasAny(line, ["inclus", "compres", "included", "incluido", "service", "servizio", "ore", "menu", "impianto", "foto", "sala"]));
  return unique([...selected, ...lines.slice(0, 4), ...profile.included]).slice(0, 8);
}

function localizedPublicLabels(locale: QuoteAnalysisLocale) {
  if (locale === "en") {
    return {
      readable: "Readable items",
      unclear: "Points to clarify",
      mainQuestion: "Main question",
      fallbackQuestion: "What should I check before confirming?"
    };
  }
  if (locale === "es") {
    return {
      readable: "Partidas legibles",
      unclear: "Puntos por aclarar",
      mainQuestion: "Pregunta principal",
      fallbackQuestion: "Que deberia revisar antes de confirmar?"
    };
  }
  if (locale === "fr") {
    return {
      readable: "Elements lisibles",
      unclear: "Points a clarifier",
      mainQuestion: "Question principale",
      fallbackQuestion: "Que dois-je verifier avant de confirmer?"
    };
  }
  return {
    readable: "Voci leggibili",
    unclear: "Punti da chiarire",
    mainQuestion: "Domanda principale",
    fallbackQuestion: "Cosa dovrei controllare prima di confermare?"
  };
}

function summaryFor(input: QuoteAnalysisInput, service: QuoteServiceType, total: string | null, missing: QuoteFinding[], indicative: boolean, locale: QuoteAnalysisLocale) {
  const place = [input.city, input.province].filter(Boolean).join(", ");
  const serviceLabels: Record<QuoteServiceType, Record<QuoteAnalysisLocale, string>> = {
    dj: { it: "DJ", en: "DJ", es: "DJ", fr: "DJ" },
    band: { it: "band", en: "band", es: "banda", fr: "groupe" },
    fotografo: { it: "foto/video", en: "photo/video", es: "foto/video", fr: "photo/video" },
    catering: { it: "catering", en: "catering", es: "catering", fr: "traiteur" },
    location: { it: "location", en: "venue", es: "lugar", fr: "lieu" },
    team_building: { it: "team building", en: "team-building", es: "team building", fr: "team building" },
    evento_aziendale: { it: "evento aziendale", en: "corporate event", es: "evento corporativo", fr: "événement d'entreprise" },
    fiori: { it: "fiori/allestimenti", en: "flowers/styling", es: "flores/decoración", fr: "fleurs/décoration" },
    open_bar: { it: "open bar", en: "open bar", es: "open bar", fr: "open bar" },
    altro: { it: "evento", en: "event", es: "evento", fr: "événement" }
  };
  const serviceLabel = serviceLabels[service][locale];
  if (locale === "en") {
    return `We read this ${serviceLabel} quote${place ? ` for ${place}` : ""}. ${total ? `The visible amount is ${total}. ` : ""}${indicative ? "The price looks indicative or on request, so it should be checked through included items and final conditions. " : ""}${missing.length ? "The main point is to clarify the items that may change the final cost." : "The structure looks fairly readable, but it is still worth checking extras and conditions."}`;
  }
  if (locale === "es") {
    return `Hemos leído este presupuesto de ${serviceLabel}${place ? ` para ${place}` : ""}. ${total ? `El importe visible es ${total}. ` : ""}${indicative ? "El precio parece orientativo o bajo solicitud, por eso conviene leerlo por partidas y condiciones finales. " : ""}${missing.length ? "El punto principal es aclarar las partidas que pueden cambiar el coste final." : "La estructura parece bastante clara, pero conviene revisar extras y condiciones."}`;
  }
  if (locale === "fr") {
    return `Nous avons lu ce devis ${serviceLabel}${place ? ` pour ${place}` : ""}. ${total ? `Le montant visible est ${total}. ` : ""}${indicative ? "Le prix semble indicatif ou sur demande, donc il faut le lire à travers les postes inclus et les conditions finales. " : ""}${missing.length ? "Le point principal est de clarifier les postes qui peuvent changer le coût final." : "La structure semble assez lisible, mais les extras et conditions restent à vérifier."}`;
  }
  return `Abbiamo letto questo preventivo ${serviceLabel}${place ? ` per ${place}` : ""}. ${total ? `L'importo visibile è ${total}. ` : ""}${indicative ? "Il prezzo sembra indicativo o su richiesta, quindi va valutato leggendo voci incluse e condizioni finali. " : ""}${missing.length ? "Il punto principale è chiarire le voci che possono cambiare il costo finale." : "La struttura sembra abbastanza leggibile, ma conviene comunque controllare extra e condizioni."}`;
}

function messageDraft(locale: QuoteAnalysisLocale, questions: string[]) {
  const joined = questions.slice(0, 4).join(" ");
  if (locale === "en") return `Hello, thank you for the quote. Before confirming, I would like to clarify a few points: ${joined} Could you send an updated version with these items written clearly?`;
  if (locale === "es") return `Hola, gracias por el presupuesto. Antes de confirmar, me gustaría aclarar algunos puntos: ${joined} ¿Podéis enviarme una versión actualizada con estas partidas escritas claramente?`;
  if (locale === "fr") return `Bonjour, merci pour le devis. Avant de confirmer, j'aimerais clarifier quelques points : ${joined} Pouvez-vous envoyer une version mise à jour avec ces éléments écrits clairement?`;
  return `Ciao, grazie per il preventivo. Prima di confermare vorrei chiarire alcuni punti: ${joined} Potete mandarmi una versione aggiornata con queste voci scritte in modo chiaro?`;
}

function nextAction(locale: QuoteAnalysisLocale, missingCount: number, indicative: boolean) {
  if (locale === "en") return missingCount || indicative ? "Ask the supplier for a clearer written version, then compare it with similar Italian suppliers." : "Keep the report and compare at least one similar Italian alternative before confirming.";
  if (locale === "es") return missingCount || indicative ? "Pide al proveedor una versión escrita más clara y compárala con proveedores italianos similares." : "Guarda el reporte y compara al menos una alternativa italiana similar antes de confirmar.";
  if (locale === "fr") return missingCount || indicative ? "Demandez au prestataire une version écrite plus claire, puis comparez avec des prestataires italiens similaires." : "Gardez le rapport et comparez au moins une alternative italienne similaire avant de confirmer.";
  return missingCount || indicative ? "Chiedi al fornitore una versione scritta più chiara, poi confrontala con fornitori italiani simili." : "Salva il report e confronta almeno una alternativa italiana simile prima di confermare.";
}

function clarifyQuestion(locale: QuoteAnalysisLocale, label: string) {
  if (locale === "en") return `Can you clarify this item: ${label}?`;
  if (locale === "es") return `Podéis aclarar està partida: ${label}?`;
  if (locale === "fr") return `Pouvez-vous clarifier ce poste : ${label}`;
  return `Potete chiarire questa voce: ${label}?`;
}

function verdict(clarity: number, completeness: number, risk: QuoteAnalysisReport["score_rischio_extra"], indicative: boolean): QuoteAnalysisReport["verdict"] {
  if (clarity < 42) return "Preventivo poco chiaro";
  if (risk === "alto") return "Possibili extra nascosti";
  if (completeness < 55) return "Mancano voci importanti";
  if (indicative) return "Prezzo da verificare";
  if (clarity > 76 && completeness > 72) return "Sembra completo";
  return "Serve confronto con alternative";
}

export function analyzeQuote(input: QuoteAnalysisInput): QuoteAnalysisReport {
  const locale = input.locale ?? "it";
  const redaction = redactQuoteText(input.text);
  const text = redaction.redactedText;
  const normalized = normalize(text);
  const service = detectService(text, input.serviceType);
  const eventType = detectEvent(text, input.eventType);
  const profile = serviceProfiles[service];
  const amounts = moneyValues(text);
  const extractedTotal = input.totalAmount?.trim() || amounts[amounts.length - 1] || null;
  const indicative = hasIndicativePrice(text) || hasIndicativePrice(input.totalAmount ?? "");
  const selectedFields = input.serviceSpecificFields ?? [];
  const lineItemList = lineItems(text);
  const rawMissing = missingFindings(profile, text, locale);
  const unclear = unclearFindings(text, locale);
  const included = includedItems(profile, text, selectedFields).map((item) => translateQuoteAnalysisItem(item, locale));
  const missing = rawMissing.map((item) => ({ ...item, label: translateQuoteAnalysisItem(item.label, locale) }));
  const questions = unique([...profile.questions[locale], ...missing.map((item) => clarifyQuestion(locale, item.label))]).slice(0, 8);
  const hiddenCosts = unique([...profile.hidden, ...(indicative ? ["condizioni che trasformano il prezzo indicativo in prezzo finale"] : [])])
    .slice(0, 8)
    .map((item) => translateQuoteAnalysisItem(item, locale));
  const hasPaymentTerms = hasAny(normalized, ["caparra", "accontó", "saldo", "deposit", "payment", "pago", "acompte"]);
  const hasTiming = hasAny(normalized, ["ore", "orario", "hours", "hora", "heures", "durata"]);
  const clarity = quoteStructureClarityScore({
    text,
    lineItemList,
    amounts,
    hasTiming,
    hasPaymentTerms,
    indicative,
    unclearCount: unclear.length
  });
  const completeness = clamp(34 + included.length * 6 - missing.length * 7 + selectedFields.length * 3 + (input.guestsCount ? 5 : 0) + (input.city ? 4 : 0));
  const risk: QuoteAnalysisReport["score_rischio_extra"] = missing.length >= 4 || unclear.length >= 3 ? "alto" : missing.length >= 2 || unclear.length >= 1 ? "medio" : "basso";
  const coherence: QuoteAnalysisReport["score_coerenza_prezzo"] = !extractedTotal ? "non valutabile" : indicative ? "stimata" : amounts.length > 1 ? "da confrontare" : "coerente";
  const reliability = clamp((clarity + completeness) / 2 + (input.city ? 4 : 0) + (input.guestsCount ? 4 : 0) + (input.durationEstimate ? 3 : 0) - redaction.totalRedactions * 1.5);
  const userSummary = summaryFor(input, service, extractedTotal, missing, indicative, locale);
  const publicLabels = localizedPublicLabels(locale);
  const publicSummaryLines = [
    userSummary,
    included.length ? `${publicLabels.readable}: ${included.slice(0, 4).join(", ")}.` : "",
    missing.length ? `${publicLabels.unclear}: ${missing.slice(0, 4).map((item) => item.label).join(", ")}.` : "",
    `${publicLabels.mainQuestion}: ${questions[0] ?? publicLabels.fallbackQuestion}`
  ].filter(Boolean);

  return {
    quote_analysis_id: `qa_${Math.abs(hashCode([text, input.city, service, eventType].join("|"))).toString(36)}`,
    detected_service: service,
    detected_event_type: eventType,
    extracted_total_price: extractedTotal,
    extracted_line_items: lineItemList,
    included_items: included,
    missing_items: missing,
    unclear_items: unclear,
    possible_hidden_costs: hiddenCosts,
    questions_to_ask: questions,
    negotiation_points: missing.slice(0, 4).map((item) => item.label),
    supplier_message_draft: messageDraft(locale, questions),
    user_summary: userSummary,
    public_anonymized_summary: publicSummaryLines.join("\n"),
    score_chiarezza: clarity,
    score_completezza: completeness,
    score_rischio_extra: risk,
    score_coerenza_prezzo: coherence,
    score_affidabilita_informazioni: reliability,
    verdict: verdict(clarity, completeness, risk, indicative),
    benchmark_used: extractedTotal && input.region ? { area: input.region, note: "Confronto orientativo basato su casi aggregati e informazioni dichiarate.", lastUpdated: "06/2026" } : null,
    benchmark_confidence: extractedTotal && input.region ? (indicative ? "bassa" : "media") : null,
    recommended_next_action: nextAction(locale, missing.length, indicative),
    redacted_text: text,
    redactions_count: redaction.totalRedactions
  };
}

function hashCode(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}
