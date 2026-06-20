export type SupplierFilterGroup =
  | "tipoFornitore"
  | "tipoEvento"
  | "stile"
  | "serviziInclusi"
  | "durata"
  | "budget"
  | "logistica"
  | "lingue"
  | "extraTecnici"
  | "capienza"
  | "spazi"
  | "cucina"
  | "accessibilita"
  | "sostenibilita"
  | "modalitaLavoro"
  | "target";

export type SupplierRankingSignal =
  | "premium_vibes_club"
  | "base_showcase"
  | "distance_from_requested_address"
  | "works_all_italy"
  | "category_match"
  | "subcategory_match"
  | "service_match"
  | "event_type_match"
  | "budget_match"
  | "availability_hint";

export type VibesTaxonomyCategory = {
  slug: string;
  label: string;
  sourceUrl: string;
  aliases: string[];
  searchIntent: string[];
  subcategories: string[];
  filters: Partial<Record<SupplierFilterGroup, string[]>>;
  aiExamples: string[];
  rankingSignals: SupplierRankingSignal[];
};

export const COMMON_SUPPLIER_RANKING: SupplierRankingSignal[] = [
  "premium_vibes_club",
  "category_match",
  "subcategory_match",
  "service_match",
  "event_type_match",
  "distance_from_requested_address",
  "works_all_italy",
  "budget_match",
  "base_showcase"
];

export const COMMON_EVENT_TYPES = [
  "Matrimonio",
  "Compleanno",
  "Diciottesimo",
  "Laurea",
  "Cena privata",
  "Festa privata",
  "Anniversario",
  "Evento aziendale",
  "Team building",
  "Convention",
  "Lancio prodotto",
  "Inaugurazione",
  "Destination wedding",
  "Altro"
];

export const COMMON_LANGUAGES = ["Italiano", "Inglese", "Francese", "Spagnolo", "Tedesco", "Multilingua"];

export const VIBES_TAXONOMY: VibesTaxonomyCategory[] = [
  {
    slug: "musica",
    label: "Musica",
    sourceUrl: "https://www.vibesplanner.com/fornitori/musica/",
    aliases: ["musica", "dj", "band", "cantante", "musicista", "orchestra", "sax", "pianista", "live music", "siae"],
    searchIntent: [
      "dj per matrimonio",
      "band per festa privata",
      "musicista per cerimonia",
      "musica per evento aziendale",
      "sax per aperitivo",
      "cantante per compleanno"
    ],
    subcategories: ["DJ", "Band musicali", "Cantanti", "Musicisti", "Orchestre", "Cantanti lirici", "DJ + vocalist", "DJ + musicisti live"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      stile: [
        "Commerciale",
        "Dance",
        "House",
        "Anni 70",
        "Anni 80",
        "Anni 90",
        "Reggaeton",
        "Latina",
        "Jazz",
        "Swing",
        "Bossa nova",
        "Pop italiano",
        "Pop internazionale",
        "Rock",
        "Soul",
        "Funk",
        "R&B",
        "Blues",
        "Classica",
        "Acustica",
        "Colonne sonore",
        "World & ethnic",
        "Flamenco",
        "Tango"
      ],
      serviziInclusi: [
        "Solo DJ set",
        "Playlist personalizzata",
        "Musica per cerimonia",
        "Aperitivo",
        "Cena",
        "Party finale",
        "Animazione microfono",
        "DJ + vocalist",
        "DJ + musicisti live",
        "Brani su richiesta",
        "Mood musicale per fasce orarie"
      ],
      durata: ["1 ora", "2 ore", "3 ore", "Mezza giornata", "Serata completa", "Extra time dopo mezzanotte"],
      budget: ["Fino a 500 euro", "500 - 1.000 euro", "1.000 - 2.000 euro", "2.000 - 4.000 euro", "Oltre 4.000 euro", "Trattativa riservata"],
      extraTecnici: ["Impianto audio incluso", "Microfono", "Console DJ", "Mixer", "Luci base", "Palco necessario", "Soundcheck necessario", "SIAE da gestire"],
      logistica: ["Trasferta", "Sopralluogo tecnico", "Carico e scarico vicino", "Parcheggio vicino", "Copertura esterna", "Alloggio o pasti richiesti"],
      lingue: COMMON_LANGUAGES
    },
    aiExamples: [
      "Cerco un DJ per matrimonio in Toscana con commerciale e anni 90",
      "Mi serve una band jazz per aperitivo aziendale a Milano",
      "Vorrei sax al taglio torta e poi DJ set per festa privata"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "location",
    label: "Location",
    sourceUrl: "https://www.vibesplanner.com/fornitori/location/",
    aliases: ["location", "venue", "villa", "ristorante", "sala", "hotel", "rooftop", "agriturismo", "castello", "spiaggia", "piscina"],
    searchIntent: [
      "location matrimonio con piscina",
      "villa per compleanno",
      "spazio aziendale per evento",
      "ristorante per cena privata",
      "location con camere",
      "location con piano pioggia"
    ],
    subcategories: [
      "Agriturismi",
      "Aziende agricole",
      "Case comunali",
      "Centri congressi",
      "Cinema e teatri",
      "Fattorie",
      "Hotel e resort",
      "Parchi e giardini",
      "Pub",
      "Ristoranti",
      "Rooftop",
      "Sale conferenze",
      "Spazi industriali",
      "Stabilimenti balneari e spiagge",
      "Ville e dimore storiche",
      "Castelli e residenze nobiliari",
      "B&B",
      "Disco club",
      "Spazi per eventi",
      "Bistrot",
      "Lounge bar",
      "Location per eventi aziendali"
    ],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      capienza: ["Fino a 30 persone", "30 - 60 persone", "60 - 100 persone", "100 - 200 persone", "Oltre 200 persone"],
      spazi: ["Interno", "Esterno", "Giardino", "Piscina", "Terrazza", "Vista panoramica", "Sala banchetti", "Sala conferenze", "Spazio ballo", "Piano pioggia", "Camere disponibili"],
      serviziInclusi: ["Catering interno", "Cucina interna", "Open bar", "Impianto audio", "Luci", "Parcheggio", "Navetta", "Hostess", "Allestimenti", "Casa comunale"],
      budget: ["Fino a 1.500 euro", "1.500 - 3.000 euro", "3.000 - 5.000 euro", "5.000 - 10.000 euro", "Oltre 10.000 euro", "Trattativa riservata"],
      logistica: ["Accesso disabili", "Musica fino a tardi", "Carico e scarico", "Parcheggio interno", "Navetta consigliata", "Pernottamento", "Esclusiva location"],
      accessibilita: ["Ingresso senza barriere", "Ascensore", "Bagni accessibili", "Parcheggio disabili"]
    },
    aiExamples: [
      "Cerco una location con piscina nelle Marche per compleanno di 40 anni",
      "Vorrei una villa in Toscana con camere per ospiti stranieri",
      "Mi serve uno spazio industriale per evento aziendale con audio e proiettore"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "catering-e-gastronomia",
    label: "Catering e Gastronomia",
    sourceUrl: "https://www.vibesplanner.com/fornitori/catering-e-gastronomia/",
    aliases: ["catering", "banqueting", "chef", "open bar", "bartender", "sommelier", "food truck", "torta", "buffet", "menu"],
    searchIntent: [
      "catering matrimonio prezzo a persona",
      "open bar per festa privata",
      "chef a domicilio per cena",
      "food truck per evento",
      "catering vegano",
      "pasticceria per torta evento"
    ],
    subcategories: [
      "Aziende vinicole",
      "Bartender",
      "Chef a domicilio",
      "Food truck",
      "Prodotti tipici regionali",
      "Gelaterie artigianali",
      "Panifici e forni artigianali",
      "Pasticcerie artigianali",
      "Produzione di confetteria",
      "Servizi di catering",
      "Sommelier",
      "Chef",
      "Bartender di catering",
      "Flair bartender",
      "Sommelier di catering",
      "Catering di frutta",
      "Personal chef"
    ],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Buffet", "Cena servita", "Finger food", "Aperitivo", "Apericena", "Open bar", "Cocktail", "Torta", "Show cooking", "Camerieri", "Mise en place", "Stoviglie e cristalleria"],
      cucina: ["Tradizionale italiana", "Regionale", "Gourmet", "Fusion", "Internazionale", "Etnica", "Vegetariana", "Vegana", "Gluten free", "Senza lattosio", "Menù bambini"],
      sostenibilita: ["Ingredienti locali", "Ingredienti biologici", "Menù stagionale", "Low waste", "Packaging compostabile", "Cibo antispreco"],
      budget: ["Fino a 35 euro/persona", "35 - 60 euro/persona", "60 - 100 euro/persona", "Oltre 100 euro/persona", "Trattativa riservata"],
      logistica: ["Cucina in loco", "Catering in location esterna", "Allestimento buffet", "Servizio sala", "Trasferta", "Sopralluogo", "Materiale incluso"]
    },
    aiExamples: [
      "Cerco catering vegano per 80 persone a Roma",
      "Mi serve open bar per diciottesimo con budget medio",
      "Vorrei chef a domicilio per cena privata in villa"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "event-planner",
    label: "Event Planner",
    sourceUrl: "https://www.vibesplanner.com/fornitori/event-planner/",
    aliases: ["event planner", "wedding planner", "party planner", "venue finder", "organizzatore", "coordinamento", "destination wedding"],
    searchIntent: ["wedding planner in Italia", "event planner aziendale", "coordinamento matrimonio", "venue finder", "organizzare evento da zero"],
    subcategories: ["Event planner", "Wedding planner", "Party planner", "Venue finder", "Destination wedding planner", "Coordinatore giorno evento"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Ricerca fornitori", "Ricerca location", "Budget planning", "Timeline evento", "Coordinamento giorno evento", "RSVP", "Regia fornitori", "Design evento"],
      stile: ["Classico", "Luxury", "Minimal", "Boho", "Editoriale", "Corporate", "Internazionale", "Multiculturale"],
      modalitaLavoro: ["Consulenza singola", "Organizzazione completa", "Solo coordinamento", "Da remoto", "In presenza", "Per clienti esteri"],
      budget: ["Consulenza base", "Pacchetto parziale", "Organizzazione completa", "Luxury planning", "Trattativa riservata"],
      lingue: COMMON_LANGUAGES
    },
    aiExamples: [
      "Sono negli Stati Uniti e cerco una wedding planner per matrimonio in Puglia",
      "Mi serve un event planner per convention aziendale a Milano",
      "Vorrei solo coordinamento il giorno dell'evento"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "intrattenimento",
    label: "Intrattenimento",
    sourceUrl: "https://www.vibesplanner.com/fornitori/intrattenimento/",
    aliases: ["intrattenimento", "animazione", "magia", "performer", "spettacolo", "team building", "show", "animatori"],
    searchIntent: ["animazione per bambini", "mago per evento", "spettacolo aziendale", "performer per matrimonio", "team building esperienziale"],
    subcategories: [
      "Agenzie di intrattenimento",
      "Animatori per eventi",
      "Artisti circensi",
      "Attori",
      "Caricaturisti",
      "Clown e artisti per bambini",
      "Comici e cabarettisti",
      "Maghi e illusionisti",
      "Performer e artisti di strada",
      "Show con droni",
      "Speaker",
      "Spettacoli di danza",
      "Spettacoli pirotecnici",
      "Truccabimbi",
      "Body painting",
      "Sand artist",
      "Live writer",
      "Cartoon singer"
    ],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      target: ["Bambini", "Adulti", "Famiglie", "Ospiti internazionali", "Aziende", "Luxury"],
      stile: ["Elegante", "Comico", "Teatrale", "Itinerante", "Close-up", "Interattivo", "Scenografico", "Family friendly"],
      durata: ["15 minuti", "30 minuti", "60 minuti", "Più interventi", "Mezza giornata", "Serata completa"],
      serviziInclusi: ["Spettacolo completo", "Animazione itinerante", "Laboratorio", "Performance personalizzata", "Intrattenimento bambini", "Presentazione palco"],
      budget: ["Fino a 300 euro", "300 - 700 euro", "700 - 1.500 euro", "1.500 - 3.000 euro", "Oltre 3.000 euro"]
    },
    aiExamples: [
      "Cerco un mago elegante per cena aziendale",
      "Mi serve animazione bambini durante matrimonio",
      "Vorrei uno spettacolo pirotecnico o light show per una festa privata"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "esperienze",
    label: "Esperienze",
    sourceUrl: "https://www.vibesplanner.com/fornitori/esperienze/",
    aliases: ["esperienze", "experience", "tour", "degustazione", "outdoor", "wellness", "coaching", "cooking class", "team building"],
    searchIntent: ["esperienza team building", "degustazione per evento", "cooking class aziendale", "tour privato", "esperienza outdoor"],
    subcategories: [
      "Centri di karting",
      "Centri diving",
      "Centri olistici",
      "Centri outdoor",
      "Centri rafting",
      "Charter nautici",
      "Guide",
      "Guide storiche e archeologiche",
      "Istruttori sport estremi",
      "Maneggi",
      "Parchi avventura",
      "Personal trainer",
      "Scuole di meditazione",
      "Scuole di sci e snowboard",
      "Scuole di volo",
      "Scuole di yoga",
      "Workshop culturali",
      "Cooking class",
      "Esperienze motivazionali e coaching"
    ],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      stile: ["Outdoor", "Wellness", "Enogastronomico", "Culturale", "Adrenalinico", "Motivazionale", "Luxury", "Family friendly"],
      durata: ["1-2 ore", "Mezza giornata", "Giornata intera", "Weekend", "Più giorni"],
      serviziInclusi: ["Guida", "Attrezzatura", "Degustazione", "Transfer", "Pranzo incluso", "Briefing sicurezza", "Personalizzazione aziendale"],
      budget: ["Fino a 50 euro/persona", "50 - 100 euro/persona", "100 - 250 euro/persona", "Oltre 250 euro/persona", "Trattativa riservata"],
      lingue: COMMON_LANGUAGES
    },
    aiExamples: [
      "Cerco team building outdoor per 25 persone in Lombardia",
      "Vorrei una cooking class per clienti stranieri a Firenze",
      "Mi serve una degustazione privata in cantina nelle Marche"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "fotografi-e-videomaker",
    label: "Fotografi e Videomaker",
    sourceUrl: "https://www.vibesplanner.com/fornitori/fotografi-e-videomaker/",
    aliases: ["fotografo", "videomaker", "drone", "photo booth", "live streaming", "reportage", "video evento", "shooting"],
    searchIntent: ["fotografo matrimonio", "videomaker evento aziendale", "drone matrimonio", "photo booth festa", "live streaming evento"],
    subcategories: ["Fotografi", "Studio fotografico", "Videomaker", "Video presentazioni", "Casa di produzione video", "Drone operator", "Tecnico live streaming", "Post produzione foto", "Post produzione video", "Operatore photo booth"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      stile: ["Reportage", "Spontaneo", "Romantico", "Editoriale", "Corporate", "Artistico", "Classico", "Social content", "Cinematic"],
      serviziInclusi: ["Foto evento", "Video evento", "Foto + video", "Drone", "Album", "Trailer", "Teaser", "Interviste ospiti", "Backstage", "Stampa immediata", "Photo booth"],
      extraTecnici: ["Full HD", "4K", "Drone 4K", "Gimbal", "Microfoni professionali", "Luci LED", "Live streaming", "Consegna express"],
      budget: ["Fino a 500 euro", "500 - 1.000 euro", "1.000 - 2.000 euro", "2.000 - 4.000 euro", "Oltre 4.000 euro"],
      lingue: COMMON_LANGUAGES
    },
    aiExamples: [
      "Cerco fotografo reportage per matrimonio civile a Roma",
      "Mi serve video social per lancio prodotto aziendale",
      "Vorrei drone e trailer breve per festa privata"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "tecnici-e-allestitori",
    label: "Tecnici e Allestitori",
    sourceUrl: "https://www.vibesplanner.com/fornitori/tecnici-e-allestitori/",
    aliases: ["tecnici", "allestitori", "audio", "luci", "led wall", "palco", "arredi", "strutture", "generatore", "ballon art"],
    searchIntent: ["service audio luci", "palco per evento", "led wall evento aziendale", "allestimento scenografico", "noleggio arredi evento"],
    subcategories: [
      "Allestitori scenografici",
      "Ballon art",
      "Decoratori di eventi",
      "Arredi per eventi",
      "Generatori di energia",
      "Illuminazione decorativa",
      "Pannelli divisori",
      "Sedie tavoli e tovagliati",
      "Impianti elettrici temporanei",
      "Pavimentazioni temporanee",
      "Palchi",
      "Maxischermi e LED wall",
      "Strutture per eventi",
      "Staff logistica e montaggio",
      "Tecnici audio",
      "Tecnici luci",
      "Tecnici proiezione",
      "Effetti speciali",
      "Tecnici video"
    ],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Audio", "Luci", "Palco", "LED wall", "Proiezione", "Arredi", "Sedie e tavoli", "Tovagliati", "Balloon art", "Montaggio", "Smontaggio", "Staff tecnico"],
      extraTecnici: ["Potenza elettrica", "Generatore", "Mixer", "Microfoni", "Regia video", "Effetti speciali", "Strutture certificate", "Progetto tecnico"],
      durata: ["Solo consegna", "Mezza giornata", "Giornata intera", "Più giorni", "Montaggio giorno prima"],
      budget: ["Fino a 500 euro", "500 - 1.500 euro", "1.500 - 3.000 euro", "3.000 - 8.000 euro", "Oltre 8.000 euro"],
      logistica: ["Sopralluogo", "Carico e scarico", "Ascensore/montacarichi", "Accesso mezzi", "Allestimento outdoor", "Permessi da verificare"]
    },
    aiExamples: [
      "Mi serve un service audio luci per convention a Bologna",
      "Cerco LED wall e regia video per evento aziendale",
      "Vorrei allestimento con tavoli, sedie e luci per festa privata"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "servizi-creativi-e-digitali",
    label: "Servizi Creativi e Digitali",
    sourceUrl: "https://www.vibesplanner.com/fornitori/servizi-creativi-e-digitali/",
    aliases: ["grafica", "inviti", "partecipazioni", "social media", "content creator", "sito evento", "stampa", "copywriter", "streaming"],
    searchIntent: ["inviti digitali matrimonio", "grafica evento aziendale", "social media evento", "sito evento", "materiale stampa evento"],
    subcategories: ["Animatori digitali", "Siti web per eventi", "Content creator", "Album fotografici personalizzati", "Grafici inviti e partecipazioni", "Stampa materiale evento", "Social media manager per eventi", "Video presentazioni", "Copywriter"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Inviti digitali", "Inviti stampati", "Save the date", "Menù", "Segnaposto", "Tableau", "QR code RSVP", "Sito evento", "Gestione social", "Content creation", "Materiale brandizzato"],
      stile: ["Classico elegante", "Minimal", "Rustico", "Botanical", "Luxury", "Illustrato", "Romantico acquerello", "Editoriale", "Corporate"],
      modalitaLavoro: ["Online", "In presenza", "Consegna in location", "Spedizione", "Urgenza last minute", "Briefing con planner"],
      budget: ["Fino a 150 euro", "150 - 400 euro", "400 - 900 euro", "900 - 2.000 euro", "Oltre 2.000 euro"],
      lingue: COMMON_LANGUAGES
    },
    aiExamples: [
      "Cerco inviti digitali con RSVP per matrimonio internazionale",
      "Mi serve grafica coordinata per convention aziendale",
      "Vorrei contenuti social durante una festa privata"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "fioristi-allestimenti-floreali-e-verde",
    label: "Fioristi, Allestimenti floreali e verde",
    sourceUrl: "https://www.vibesplanner.com/fornitori/fioristi-allestimenti-floreali-e-verde/",
    aliases: ["fiori", "fiorista", "flower design", "allestimento floreale", "bouquet", "centrotavola", "verde", "piante"],
    searchIntent: ["fiorista matrimonio", "allestimento floreale evento", "bouquet sposa", "centrotavola floreali", "flower design aziendale"],
    subcategories: ["Fioristi", "Flower designer", "Allestimenti floreali", "Bouquet", "Centrotavola", "Piante e verde", "Noleggio piante", "Archi floreali", "Decorazioni cerimonia"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      stile: ["Romantico", "Boho", "Minimal", "Luxury", "Botanical", "Colorato", "Country", "Mediterraneo", "Tropicale", "Classico"],
      serviziInclusi: ["Bouquet", "Boutonniere", "Centrotavola", "Arco cerimonia", "Navata", "Tableau", "Confettata", "Allestimento ingresso", "Noleggio vasi", "Smontaggio"],
      budget: ["Fino a 300 euro", "300 - 800 euro", "800 - 1.500 euro", "1.500 - 3.000 euro", "Oltre 3.000 euro"],
      logistica: ["Sopralluogo", "Consegna in location", "Montaggio", "Smontaggio", "Fiori stagionali", "Outdoor", "Piano caldo/freddo"]
    },
    aiExamples: [
      "Cerco fiorista per matrimonio boho in giardino",
      "Vorrei centrotavola eleganti ma non troppo costosi",
      "Mi serve allestimento verde per evento aziendale"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "salute-e-bellezza",
    label: "Salute e Bellezza",
    sourceUrl: "https://www.vibesplanner.com/fornitori/salute-e-bellezza/",
    aliases: ["make up", "trucco", "parrucchiere", "beauty", "spa", "benessere", "massaggi", "nail art", "truccatore"],
    searchIntent: ["make up artist matrimonio", "parrucchiere sposa", "spa addio nubilato", "trucco evento", "beauty team matrimonio"],
    subcategories: ["Centri benessere", "Centri estetici", "Centri massaggi", "Make-up artist", "Parrucchieri", "SPA", "Nail art", "Truccatori creativi per eventi"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Trucco", "Acconciatura", "Prova trucco", "Prova acconciatura", "Nail art", "Massaggi", "Spa", "Beauty team ospiti", "Ritocco durante evento"],
      stile: ["Naturale", "Glam", "Editoriale", "Cerimonia", "Sposa", "Creativo", "Luxury", "Fotografico"],
      durata: ["Servizio singolo", "Mezza giornata", "Giornata intera", "Preparazione + ritocco"],
      budget: ["Fino a 150 euro", "150 - 300 euro", "300 - 600 euro", "600 - 1.200 euro", "Oltre 1.200 euro"],
      logistica: ["A domicilio", "In location", "In salone", "Trasferta", "Più persone", "Orario mattina presto"]
    },
    aiExamples: [
      "Cerco make up artist per matrimonio civile a Roma",
      "Vorrei trucco e capelli per sposa e due testimoni",
      "Mi serve un centro benessere per addio al nubilato"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "hostess-promoter-e-ragazze-immagine",
    label: "Hostess, Promoter e Ragazze immagine",
    sourceUrl: "https://www.vibesplanner.com/fornitori/hostess-promoter-e-ragazze-immagine/",
    aliases: ["hostess", "steward", "promoter", "accoglienza", "ragazza immagine", "modelli", "modelle", "staff evento"],
    searchIntent: ["hostess evento aziendale", "steward congresso", "promoter fiera", "accoglienza multilingue", "modelle per evento"],
    subcategories: ["Hostess e steward", "Promoter", "Ragazza o ragazzo immagine", "Cubista", "Modelle e modelli per eventi"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Accoglienza", "Registrazione ospiti", "Guardaroba", "Distribuzione materiali", "Supporto sala", "Promozione prodotto", "Immagine brand", "Gestione file"],
      lingue: COMMON_LANGUAGES,
      durata: ["Mezza giornata", "Giornata intera", "Serata", "Più giorni", "Fiera completa"],
      budget: ["Tariffa oraria", "Mezza giornata", "Giornata intera", "Evento completo", "Trattativa riservata"],
      logistica: ["Briefing richiesto", "Dress code", "Trasferta", "Più risorse", "Coordinatore team"]
    },
    aiExamples: [
      "Mi servono due hostess inglese italiano per evento clienti a Milano",
      "Cerco promoter per inaugurazione negozio",
      "Vorrei steward per gestione accessi a convention"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "supporto-eventi",
    label: "Supporto Eventi",
    sourceUrl: "https://www.vibesplanner.com/fornitori/supporto-eventi/",
    aliases: ["supporto eventi", "celebrante", "interprete", "traduttore", "accoglienza", "assistenza evento", "coordinamento operativo"],
    searchIntent: ["celebrante matrimonio simbolico", "interprete evento", "traduttore matrimonio", "supporto operativo evento"],
    subcategories: ["Celebranti", "Interpreti", "Traduttori", "Supporto operativo", "Assistenza ospiti", "Coordinamento accessi"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Celebrazione rito", "Traduzione consecutiva", "Interpretariato", "Assistenza ospiti", "Supporto backstage", "Gestione programma", "Coordinamento fornitori"],
      lingue: COMMON_LANGUAGES,
      durata: ["1 ora", "Mezza giornata", "Giornata intera", "Più giorni"],
      budget: ["Fino a 200 euro", "200 - 500 euro", "500 - 1.000 euro", "Oltre 1.000 euro"],
      logistica: ["In presenza", "Da remoto", "Trasferta", "Materiali del rito", "Briefing preliminare"]
    },
    aiExamples: [
      "Cerco celebrante per rito simbolico bilingue",
      "Mi serve interprete inglese italiano per ospiti stranieri",
      "Vorrei supporto operativo durante una giornata evento"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "trasporti",
    label: "Trasporti",
    sourceUrl: "https://www.vibesplanner.com/fornitori/trasporti/",
    aliases: ["trasporti", "ncc", "navetta", "bus", "pullman", "limousine", "barca", "yacht", "transfer", "auto sposi"],
    searchIntent: ["navetta ospiti matrimonio", "ncc evento", "pullman evento aziendale", "barca festa privata", "auto sposi"],
    subcategories: ["Auto d'epoca", "Auto di lusso", "Auto sportive", "Barche", "Caravan e camper", "Elicotteri", "Aerei privati", "Mini-bus", "NCC", "Pullman Gran Turismo", "Limousine", "Logistica materiali", "Trasporto ospiti", "Taxi eventi", "Yacht"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Transfer ospiti", "Navetta continuativa", "Auto sposi", "NCC", "Pullman", "Taxi boat", "Yacht", "Trasporto materiali", "Driver privato", "Servizio VIP"],
      durata: ["Singola tratta", "Andata e ritorno", "Mezza giornata", "Giornata intera", "Più giorni"],
      budget: ["Fino a 300 euro", "300 - 800 euro", "800 - 1.500 euro", "1.500 - 3.000 euro", "Oltre 3.000 euro"],
      logistica: ["Percorso multiplo", "Più hotel", "Orari scaglionati", "Attesa inclusa", "Bagagli", "Accesso ZTL", "Transfer aeroporto"],
      lingue: COMMON_LANGUAGES
    },
    aiExamples: [
      "Mi serve navetta dagli hotel alla location per 80 invitati",
      "Cerco NCC per ospiti stranieri a Roma",
      "Vorrei una barca per aperitivo privato al tramonto"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "sicurezza-privata",
    label: "Sicurezza Privata",
    sourceUrl: "https://www.vibesplanner.com/fornitori/sicurezza-privata/",
    aliases: ["sicurezza", "security", "bodyguard", "controllo accessi", "steward sicurezza", "vigilanza"],
    searchIntent: ["sicurezza evento privato", "controllo accessi evento", "security evento aziendale", "bodyguard evento VIP"],
    subcategories: ["Security eventi", "Controllo accessi", "Vigilanza", "Bodyguard", "Steward sicurezza", "Sicurezza VIP"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Controllo ingressi", "Gestione lista ospiti", "Vigilanza area", "Presidio parcheggio", "Bodyguard", "Servizio antincendio da verificare", "Piano sicurezza"],
      durata: ["Mezza giornata", "Serata", "Giornata intera", "Più giorni"],
      budget: ["Tariffa oraria", "Mezza giornata", "Giornata intera", "Evento completo", "Trattativa riservata"],
      logistica: ["Briefing sicurezza", "Più operatori", "Coordinatore", "Radiocomunicazioni", "Accessi multipli", "Evento pubblico"],
      lingue: COMMON_LANGUAGES
    },
    aiExamples: [
      "Cerco sicurezza per festa privata con 150 persone",
      "Mi serve controllo accessi per evento aziendale",
      "Vorrei security discreta per ospiti VIP"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "articoli-da-regalo",
    label: "Articoli da Regalo",
    sourceUrl: "https://www.vibesplanner.com/fornitori/articoli-da-regalo/",
    aliases: ["regali", "bomboniere", "gadget", "gift box", "cadeau", "omaggi", "personalizzati"],
    searchIntent: ["bomboniere matrimonio", "gadget evento aziendale", "gift box ospiti", "regali personalizzati evento"],
    subcategories: ["Bomboniere", "Gadget personalizzati", "Gift box", "Regali ospiti", "Omaggi aziendali", "Artigianato", "Packaging personalizzato"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Personalizzazione", "Packaging", "Biglietto dedicato", "Consegna in location", "Spedizione", "Kit ospiti", "Logo aziendale"],
      stile: ["Elegante", "Artigianale", "Gourmet", "Eco", "Luxury", "Minimal", "Colorato", "Territoriale"],
      budget: ["Fino a 5 euro/pezzo", "5 - 15 euro/pezzo", "15 - 30 euro/pezzo", "Oltre 30 euro/pezzo", "Trattativa riservata"],
      sostenibilita: ["Materiali riciclati", "Prodotti locali", "Packaging compostabile", "Artigianale", "Low waste"],
      logistica: ["Quantità minima", "Consegna urgente", "Spedizione nazionale", "Confezionamento incluso"]
    },
    aiExamples: [
      "Cerco bomboniere eleganti ma non troppo costose",
      "Mi servono gadget aziendali per 200 ospiti",
      "Vorrei gift box con prodotti locali per matrimonio in Puglia"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "gioiellerie",
    label: "Gioiellerie",
    sourceUrl: "https://www.vibesplanner.com/fornitori/gioiellerie/",
    aliases: ["gioielli", "gioielleria", "fedi", "anelli", "oreficeria", "accessori preziosi"],
    searchIntent: ["fedi matrimonio", "gioielli sposa", "anelli personalizzati", "regalo prezioso evento"],
    subcategories: ["Gioiellerie e oreficerie", "Fedi", "Anelli", "Gioielli sposa", "Accessori cerimonia", "Regali preziosi", "Gioielli personalizzati"],
    filters: {
      tipoEvento: ["Matrimonio", "Anniversario", "Proposta di matrimonio", "Compleanno", "Evento luxury", "Regalo aziendale"],
      serviziInclusi: ["Consulenza", "Personalizzazione", "Incisione", "Creazione su misura", "Consegna", "Packaging", "Certificato"],
      stile: ["Classico", "Moderno", "Luxury", "Artigianale", "Minimal", "Vintage", "Personalizzato"],
      budget: ["Fino a 500 euro", "500 - 1.500 euro", "1.500 - 3.000 euro", "3.000 - 8.000 euro", "Oltre 8.000 euro"],
      modalitaLavoro: ["In boutique", "Appuntamento privato", "Da remoto", "Su misura"]
    },
    aiExamples: [
      "Cerco fedi personalizzate per matrimonio",
      "Vorrei un regalo prezioso per anniversario",
      "Mi serve una gioielleria per accessori sposa"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  },
  {
    slug: "vestiti-per-eventi-e-cerimonie",
    label: "Vestiti per Eventi e Cerimonie",
    sourceUrl: "https://www.vibesplanner.com/fornitori/vestiti-per-eventi-e-cerimonie/",
    aliases: ["vestiti", "abiti", "atelier", "sposa", "sposo", "cerimonia", "noleggio abiti", "stylist"],
    searchIntent: ["abito sposa", "abito cerimonia", "atelier sposo", "noleggio abiti lusso", "personal stylist evento"],
    subcategories: ["Abiti bambini e cerimonie", "Atelier sposa", "Atelier sposo", "Boutique abiti cerimonia", "Atelier multi-brand", "Noleggio abiti di lusso", "Personal stylist", "Sartorie artigianali", "Stilisti indipendenti", "Abiti cerimoniali culturali"],
    filters: {
      tipoEvento: COMMON_EVENT_TYPES,
      serviziInclusi: ["Prova abito", "Sartoria", "Modifiche", "Accessori", "Noleggio", "Personal styling", "Consegna", "Abiti su misura"],
      stile: ["Classico", "Moderno", "Luxury", "Boho", "Minimal", "Tradizionale", "Culturale", "Elegante", "Fashion"],
      budget: ["Fino a 300 euro", "300 - 800 euro", "800 - 1.500 euro", "1.500 - 3.000 euro", "Oltre 3.000 euro"],
      modalitaLavoro: ["In atelier", "Su appuntamento", "Prove multiple", "Urgenza", "Noleggio", "Su misura"]
    },
    aiExamples: [
      "Cerco abito da cerimonia elegante per matrimonio a Roma",
      "Vorrei noleggiare un abito di lusso per gala aziendale",
      "Mi serve atelier sposo con modifiche rapide"
    ],
    rankingSignals: COMMON_SUPPLIER_RANKING
  }
];

export const VIBES_TAXONOMY_BY_SLUG = Object.fromEntries(VIBES_TAXONOMY.map((category) => [category.slug, category])) as Record<
  string,
  VibesTaxonomyCategory
>;

export function getVibesTaxonomyCategory(slug: string) {
  return VIBES_TAXONOMY_BY_SLUG[slug] ?? null;
}

export function findVibesTaxonomyMatches(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return VIBES_TAXONOMY.map((category) => {
    const haystack = [
      category.label,
      category.slug,
      ...category.aliases,
      ...category.searchIntent,
      ...category.subcategories,
      ...Object.values(category.filters).flat()
    ]
      .join(" ")
      .toLowerCase();

    const score = normalizedQuery
      .split(/\s+/)
      .filter((token) => token.length > 2)
      .reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);

    return { category, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}
