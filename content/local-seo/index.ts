import { VIBES_PLANNER_CLIENT_REQUEST_URL } from "@/lib/constants";

export type LocalSeoKind = "region" | "province" | "city";

export type LocalSeoConversation = {
  title: string;
  question: string;
  answer: string;
  tip: string;
};

export type LocalSeoPage = {
  slug: string;
  status: "published" | "draft";
  kind: LocalSeoKind;
  region: string;
  province: string;
  city: string;
  locationType: string;
  score: number;
  scoreLabel: string;
  priority: "P1" | "P2";
  categoryKey: string;
  categoryName: string;
  categoryGroup: "A" | "B" | "C";
  primaryKeyword: string;
  secondaryKeywords: string[];
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  url: string;
  canonical: string;
  robots: "index, follow" | "noindex, follow";
  sitemap: string;
  lastmod: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  localSection: string;
  whenUseful: string[];
  evaluationChecklist: string[];
  conversations: LocalSeoConversation[];
  faqs: Array<{ question: string; answer: string }>;
  serviceLinks: Array<{ slug: string; label: string }>;
  nearbyLinks: Array<{ slug: string; label: string }>;
  vibesCtaTitle: string;
  vibesCtaText: string;
  vibesCtaUrl: string;
  antiDoorway: {
    realUtility: string;
    uniqueLocalElements: string;
    uniqueConversations: string;
    duplicationRisk: number;
    doorwayRisk: number;
    decision: "pubblicare" | "migliorare" | "noindex" | "non creare";
  };
};

type LocationSeed = {
  city: string;
  slug: string;
  province: string;
  region: string;
  type: string;
  score: number;
  localNote: string;
  logistics: string;
  season: string;
  nearby: string[];
};

type CategorySeed = {
  key: string;
  name: string;
  group: "A" | "B" | "C";
  sitemap: string;
  slugPrefix: string;
  primary: string;
  secondary: string[];
  minScore: number;
  heroImage: string;
  heroAlt: string;
  serviceAngle: string;
  mustCheck: string[];
  usefulFor: string[];
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";
const lastmod = "2026-06-14";

export const localSeoRegions = [
  "Valle d'Aosta",
  "Piemonte",
  "Liguria",
  "Lombardia",
  "Trentino-Alto Adige",
  "Veneto",
  "Friuli-Venezia Giulia",
  "Emilia-Romagna",
  "Marche",
  "Lazio",
  "Campania"
];

export const localSeoLocations: LocationSeed[] = [
  {
    city: "Aosta",
    slug: "aosta",
    province: "Aosta",
    region: "Valle d'Aosta",
    type: "capoluogo montano",
    score: 76,
    localNote: "tra centro storico, hotel di montagna e spostamenti che dipendono molto da stagione e meteo",
    logistics: "parcheggi, strade di valle, rientro ospiti e pernottamenti vanno chiariti prima del preventivo",
    season: "inverno ed estate hanno richieste molto diverse",
    nearby: ["torino", "cuneo", "como", "milano"]
  },
  {
    city: "Torino",
    slug: "torino",
    province: "Torino",
    region: "Piemonte",
    type: "capoluogo business e wedding",
    score: 88,
    localNote: "tra centro, collina, residenze storiche e provincia con budget molto diversi",
    logistics: "ZTL, accessi in collina, parcheggio e rientro ospiti possono incidere parecchio",
    season: "primavera e autunno sono periodi forti per eventi eleganti e aziendali",
    nearby: ["novara", "cuneo", "aosta", "milano"]
  },
  {
    city: "Novara",
    slug: "novara",
    province: "Novara",
    region: "Piemonte",
    type: "città ponte tra Piemonte e Lombardia",
    score: 74,
    localNote: "cómoda tra Torino e Milano, con cascine, sale e ristoranti da confrontare bene",
    logistics: "tempi di arrivo, parcheggi e fornitori da province diverse vanno messi a confronto",
    season: "primavera e settembre sono equilibrati",
    nearby: ["milano", "torino", "como", "monza"]
  },
  {
    city: "Cuneo",
    slug: "cuneo",
    province: "Cuneo",
    region: "Piemonte",
    type: "città di provincia con forte potenziale wedding",
    score: 72,
    localNote: "tra Langhe, vallate, cascine e ristoranti dove distanze e rientri contano",
    logistics: "transfer, pernottamenti e orari di fine evento non vanno lasciati all'ultimo",
    season: "vendemmia e primavera sono molto attrattive",
    nearby: ["torino", "alessandria", "genova", "aosta"]
  },
  {
    city: "Genova",
    slug: "genova",
    province: "Genova",
    region: "Liguria",
    type: "città marittima e business",
    score: 86,
    localNote: "con salite, vista mare, centro storico e accessi non sempre semplici",
    logistics: "carico materiali, parcheggi, strade strette e tempi di spostamento vanno verificati",
    season: "estate e inizio autunno portano richieste alte",
    nearby: ["savona", "la-spezia", "sanremo", "milano"]
  },
  {
    city: "Sanremo",
    slug: "sanremo",
    province: "Imperia",
    region: "Liguria",
    type: "località turistica premium",
    score: 82,
    localNote: "tra hotel, mare, ville e stagione turistica con disponibilità molto variabile",
    logistics: "traffico stagionale, orari, rientri e sistemazioni ospiti sono parte del progetto",
    season: "primavera, estate e periodi evento possono cambiare costi e disponibilità",
    nearby: ["genova", "savona", "cuneo", "torino"]
  },
  {
    city: "La Spezia",
    slug: "la-spezia",
    province: "La Spezia",
    region: "Liguria",
    type: "città costiera e turistica",
    score: 75,
    localNote: "vicina a costa, borghi e spazi panoramici dove gli spostamenti vanno pianificati",
    logistics: "parcheggi, transfer e accessi a location vista mare sono dettagli decisivi",
    season: "estate e settembre richiedono anticipo",
    nearby: ["genova", "parma", "pisa", "rimini"]
  },
  {
    city: "Milano",
    slug: "milano",
    province: "Milano",
    region: "Lombardia",
    type: "metropoli business, moda e wedding",
    score: 96,
    localNote: "con fornitori strutturati, costi spesso alti e tempi stretti tra centro, hinterland e location premium",
    logistics: "ZTL, parcheggi, montaggi, orari di sala e transfer possono pesare quanto il servizio",
    season: "settembre, dicembre e settimane fieristiche si riempiono presto",
    nearby: ["monza", "como", "bergamo", "brescia", "pavia", "varese"]
  },
  {
    city: "Monza",
    slug: "monza",
    province: "Monza e Brianza",
    region: "Lombardia",
    type: "area residenziale ad alta spesa",
    score: 83,
    localNote: "vicina a Milano ma con ville, ristoranti e sale che hanno dinamiche proprie",
    logistics: "parcheggio, accesso da Milano e rientro serale sono da chiarire",
    season: "primavera e autunno funzionano molto bene",
    nearby: ["milano", "como", "bergamo", "varese"]
  },
  {
    city: "Como",
    slug: "como",
    province: "Como",
    region: "Lombardia",
    type: "località lago premium",
    score: 92,
    localNote: "dove vista lago, hotel, ville e barche cambiano budget e logistica",
    logistics: "strade strette, transfer, parcheggi e meteo sul lago vanno messi nel piano",
    season: "estate e settembre sono richiesti, ma anche più complessi",
    nearby: ["milano", "monza", "varese", "lecco"]
  },
  {
    city: "Bergamo",
    slug: "bergamo",
    province: "Bergamo",
    region: "Lombardia",
    type: "città storica e area business",
    score: 82,
    localNote: "tra città alta, provincia, colline e sale aziendali con accessi diversi",
    logistics: "dislivelli, parcheggi e tempi tra bassa ? alta città vanno considerati",
    season: "primavera e inizio autunno sono molto adatti",
    nearby: ["milano", "brescia", "monza", "como"]
  },
  {
    city: "Brescia",
    slug: "brescia",
    province: "Brescia",
    region: "Lombardia",
    type: "area industriale, lago e Franciacorta",
    score: 84,
    localNote: "tra città, Franciacorta, lago e aziende con bisogni molto diversi",
    logistics: "distanze, transfer e disponibilità nei weekend vanno letti bene",
    season: "maggio, giugno e settembre sono periodi forti",
    nearby: ["bergamo", "milano", "verona", "mantova"]
  },
  {
    city: "Varese",
    slug: "varese",
    province: "Varese",
    region: "Lombardia",
    type: "area lago e residenziale",
    score: 78,
    localNote: "tra laghi, ville, giardini e collegamenti verso Milano e Svizzera",
    logistics: "rientri, parcheggi, meteo e trasporto ospiti possono incidere molto",
    season: "primavera ed estate sono molto scenografiche",
    nearby: ["como", "milano", "monza", "novara"]
  },
  {
    city: "Trento",
    slug: "trento",
    province: "Trento",
    region: "Trentino-Alto Adige",
    type: "capoluogo alpino e universitario",
    score: 78,
    localNote: "tra centro, cantine, valli e location dove meteo e distanze pesano",
    logistics: "transfer, parcheggi e alternative in caso di maltempo sono fondamentali",
    season: "estate e inverno hanno esigenze opposte",
    nearby: ["bolzano", "riva-del-garda", "verona", "brescia"]
  },
  {
    city: "Bolzano",
    slug: "bolzano",
    province: "Bolzano",
    region: "Trentino-Alto Adige",
    type: "città alpina premium",
    score: 80,
    localNote: "con hotel, cantine, montagna e standard organizzativi precisi",
    logistics: "orari, lingua, ospiti da fuori e pernottamenti vanno chiariti subito",
    season: "inverno e fine estate richiedono pianificazione molto diversa",
    nearby: ["trento", "riva-del-garda", "verona", "cortina-d-ampezzo"]
  },
  {
    city: "Riva del Garda",
    slug: "riva-del-garda",
    province: "Trento",
    region: "Trentino-Alto Adige",
    type: "località lago premium",
    score: 83,
    localNote: "tra lago, turismo, hotel e meteo variabile da leggere bene",
    logistics: "strade, parcheggi, vento e transfer ospiti sono decisivi",
    season: "estate e settembre sono molto richiesti",
    nearby: ["trento", "verona", "brescia", "bolzano"]
  },
  {
    city: "Venezia",
    slug: "venezia",
    province: "Venezia",
    region: "Veneto",
    type: "città d'arte internazionale",
    score: 95,
    localNote: "dove trasporti, acqua, scarico materiali e tempi cambiano completamente il preventivo",
    logistics: "barche, pontili, accessi, orari e pernottamenti vanno chiariti prima di scegliere",
    season: "alta stagione, weekend e grandi eventi richiedono anticipo",
    nearby: ["padova", "treviso", "vicenza", "verona"]
  },
  {
    city: "Verona",
    slug: "verona",
    province: "Verona",
    region: "Veneto",
    type: "città d'arte, fiere e lago",
    score: 89,
    localNote: "tra centro, fiere, colline e lago con budget e logistiche diverse",
    logistics: "periodi fieristici, ZTL, transfer e disponibilità hotel vanno controllati",
    season: "estate e settembre sono forti, ma anche più competitivi",
    nearby: ["venezia", "padova", "brescia", "trento", "riva-del-garda"]
  },
  {
    city: "Padova",
    slug: "padova",
    province: "Padova",
    region: "Veneto",
    type: "città universitaria e business",
    score: 82,
    localNote: "tra centro, ville venete, colli e sale aziendali molto diverse",
    logistics: "parcheggio, collegamenti con Venezia e orari di rientro contano molto",
    season: "primavera e autunno sono periodi molto equilibrati",
    nearby: ["venezia", "vicenza", "treviso", "verona"]
  },
  {
    city: "Treviso",
    slug: "treviso",
    province: "Treviso",
    region: "Veneto",
    type: "ville venete e area business",
    score: 78,
    localNote: "tra città, campagna, prosecco e ville con carattere molto diverso",
    logistics: "distanze tra location e hotel, parcheggi e orari vanno verificati",
    season: "primavera e autunno sono richiesti",
    nearby: ["venezia", "padova", "vicenza", "cortina-d-ampezzo"]
  },
  {
    city: "Cortina d'Ampezzo",
    slug: "cortina-d-ampezzo",
    province: "Belluno",
    region: "Veneto",
    type: "località montana premium",
    score: 90,
    localNote: "con hotel, montagna, stagionalità e costi premium da governare bene",
    logistics: "pernottamenti, transfer, meteo e disponibilità fornitori vanno bloccati presto",
    season: "inverno ed estate richiedono prenotazioni anticipate",
    nearby: ["bolzano", "trento", "treviso", "venezia"]
  },
  {
    city: "Trieste",
    slug: "trieste",
    province: "Trieste",
    region: "Friuli-Venezia Giulia",
    type: "città marittima e business",
    score: 82,
    localNote: "tra mare, Carso, centro e vento che può cambiare il comfort degli ospiti",
    logistics: "vento, parcheggi, accessi e rientri vanno considerati prima della scelta",
    season: "primavera e inizio autunno sono molto piacevoli",
    nearby: ["udine", "grado", "venezia", "pordenone"]
  },
  {
    city: "Udine",
    slug: "udine",
    province: "Udine",
    region: "Friuli-Venezia Giulia",
    type: "città conviviale e territoriale",
    score: 74,
    localNote: "tra ville, agriturismi e sale dove cucina e servizio contano molto",
    logistics: "distanze in provincia, rientri e orari extra sono da mettere per iscritto",
    season: "primavera e autunno funzionano bene",
    nearby: ["trieste", "pordenone", "grado", "venezia"]
  },
  {
    city: "Pordenone",
    slug: "pordenone",
    province: "Pordenone",
    region: "Friuli-Venezia Giulia",
    type: "area business e fiere",
    score: 72,
    localNote: "con aziende, fiere, sale e ristoranti da coordinare in modo pragmatico",
    logistics: "orari, parcheggio, audio e rientro dei partecipanti sono elementi da chiarire",
    season: "periodi fieristici e autunno possono essere più richiesti",
    nearby: ["udine", "treviso", "venezia", "trieste"]
  },
  {
    city: "Bologna",
    slug: "bologna",
    province: "Bologna",
    region: "Emilia-Romagna",
    type: "città universitaria, fiere e business",
    score: 91,
    localNote: "tra centro, colli, fiere e aziende con forte richiesta di eventi",
    logistics: "ZTL, parcheggi, orari di sala e periodo fieristico cambiano il budget",
    season: "primavera, autunno e periodi business si riempiono presto",
    nearby: ["modena", "parma", "ravenna", "rimini", "ferrara"]
  },
  {
    city: "Modena",
    slug: "modena",
    province: "Modena",
    region: "Emilia-Romagna",
    type: "città food e business",
    score: 80,
    localNote: "tra acetaie, ristoranti, sale e aziende dove il menù spesso e centrale",
    logistics: "trasporti, orari extra e fornitori food vanno confrontati con attenzione",
    season: "primavera e autunno sono molto adatti",
    nearby: ["bologna", "parma", "reggio-emilia", "ferrara"]
  },
  {
    city: "Parma",
    slug: "parma",
    province: "Parma",
    region: "Emilia-Romagna",
    type: "città food e wedding",
    score: 78,
    localNote: "con forte attenzione a menù, servizio, ospitalità e rientro ospiti",
    logistics: "collegamenti, parcheggi e pernottamenti possono fare la differenza",
    season: "primavera e autunno sono periodi ideali",
    nearby: ["modena", "bologna", "piacenza", "la-spezia"]
  },
  {
    city: "Rimini",
    slug: "rimini",
    province: "Rimini",
    region: "Emilia-Romagna",
    type: "città mare, turismo e fiere",
    score: 87,
    localNote: "con hotel, spiaggia, locali e fiere che cambiano disponibilità e costi",
    logistics: "stagione, traffico, rientri e pernottamenti sono fondamentali",
    season: "estate e periodi fieristici richiedono molta attenzione",
    nearby: ["riccione", "ravenna", "bologna", "pesaro"]
  },
  {
    city: "Ravenna",
    slug: "ravenna",
    province: "Ravenna",
    region: "Emilia-Romagna",
    type: "città d'arte e costa",
    score: 74,
    localNote: "tra centro, campagna, lidi e sale dove cambia completamente la logistica",
    logistics: "distanze verso la costa, parcheggi e rientri vanno stimati bene",
    season: "estate e settembre sono interessanti per eventi vicino al mare",
    nearby: ["rimini", "bologna", "ferrara", "forli-cesena"]
  },
  {
    city: "Ancona",
    slug: "ancona",
    province: "Ancona",
    region: "Marche",
    type: "capoluogo marittimo e Conero",
    score: 80,
    localNote: "tra città, Riviera del Conero, mare e colline con accessi diversi",
    logistics: "parcheggi, transfer, vento e stagionalità sul mare vanno messi nel piano",
    season: "primavera e settembre sono molto piacevoli",
    nearby: ["numana", "pesaro", "macerata", "san-benedetto-del-tronto"]
  },
  {
    city: "Pesaro",
    slug: "pesaro",
    province: "Pesaro e Urbino",
    region: "Marche",
    type: "città costiera e culturale",
    score: 76,
    localNote: "tra mare, colline e strutture ricettive con formule molto diverse",
    logistics: "stabilimenti, rientri, parcheggi e ospiti da fuori vanno coordinati",
    season: "estate e fine primavera sono più richieste",
    nearby: ["rimini", "urbino", "ancona", "numana"]
  },
  {
    city: "Urbino",
    slug: "urbino",
    province: "Pesaro e Urbino",
    region: "Marche",
    type: "città d'arte e universitaria",
    score: 72,
    localNote: "con centro storico, colline e accessi da organizzare con cura",
    logistics: "parcheggi, salite, transfer e orari ospiti vanno chiariti in anticipo",
    season: "primavera e inizio autunno sono molto adatti",
    nearby: ["pesaro", "rimini", "ancona", "macerata"]
  },
  {
    city: "Numana",
    slug: "numana",
    province: "Ancona",
    region: "Marche",
    type: "località mare premium",
    score: 84,
    localNote: "sul Conero, tra mare, turismo e spazi panoramici con disponibilità stagionale",
    logistics: "parcheggi, accessi al mare, meteo e rientro ospiti sono centrali",
    season: "estate e settembre vanno pianificati con anticipo",
    nearby: ["ancona", "pesaro", "san-benedetto-del-tronto", "macerata"]
  },
  {
    city: "San Benedetto del Tronto",
    slug: "san-benedetto-del-tronto",
    province: "Ascoli Piceno",
    region: "Marche",
    type: "città balneare e turistica",
    score: 76,
    localNote: "tra mare, hotel, stabilimenti e ristoranti con forte stagionalità",
    logistics: "traffico, parcheggio, rientro e disponibilità in alta stagione sono decisivi",
    season: "estate e settembre sono molto richiesti",
    nearby: ["ancona", "fermo", "ascoli-piceno", "pesaro"]
  },
  {
    city: "Roma",
    slug: "roma",
    province: "Roma",
    region: "Lazio",
    type: "capitale con forte domanda eventi",
    score: 96,
    localNote: "tra centro storico, ville, hotel, castelli e zone con vincoli molto diversi",
    logistics: "ZTL, parcheggi, taxi, navette, orari di carico e distanze tra centro e location vanno chiariti subito",
    season: "primavera, settembre e dicembre sono periodi molto richiesti",
    nearby: ["napoli", "firenze", "ancona", "bologna"]
  },
  {
    city: "Napoli",
    slug: "napoli",
    province: "Napoli",
    region: "Campania",
    type: "città ad alta intensità wedding e feste",
    score: 94,
    localNote: "tra centro, mare, ville panoramiche, ristoranti e spostamenti da pianificare con attenzione",
    logistics: "traffico, parcheggi, Costiera, rientri serali e transfer ospiti possono cambiare molto il preventivo",
    season: "maggio, giugno e settembre sono mesi forti per matrimoni, feste e richieste fornitori",
    nearby: ["roma", "salerno", "caserta", "bari"]
  }
];

export const localSeoCategories: CategorySeed[] = [
  {
    key: "location-eventi",
    name: "Location",
    group: "A",
    sitemap: "sitemap-location-eventi.xml",
    slugPrefix: "location-eventi",
    primary: "location eventi",
    secondary: ["location matrimonio", "sale eventi", "ville per eventi", "ristoranti per eventi"],
    minScore: 70,
    heroImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Sala allestita per evento elegante",
    serviceAngle: "capienza, orari, piano B, parcheggio e servizi inclusi",
    mustCheck: ["capienza reale", "orari inclusi", "piano B meteo", "parcheggio e accessi", "extra obbligatori"],
    usefulFor: ["matrimonio", "compleanno", "evento aziendale", "festa privata", "anniversario"]
  },
  {
    key: "catering-eventi",
    name: "Catering e Gastronomia",
    group: "A",
    sitemap: "sitemap-catering-eventi.xml",
    slugPrefix: "catering-eventi",
    primary: "catering eventi",
    secondary: ["catering matrimonio", "catering aziendale", "buffet eventi", "menù eventi"],
    minScore: 70,
    heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Catering con piatti preparati per evento",
    serviceAngle: "menù, servizio, personale, bevande, intolleranze e tempi di sala",
    mustCheck: ["menù dettagliato", "personale incluso", "durata servizio", "bevande e torta", "intolleranze"],
    usefulFor: ["matrimonio", "cena privata", "evento aziendale", "festa privata", "laurea"]
  },
  {
    key: "musica-eventi",
    name: "Musica",
    group: "A",
    sitemap: "sitemap-musica-eventi.xml",
    slugPrefix: "musica-eventi",
    primary: "musica eventi",
    secondary: ["dj eventi", "dj matrimonio", "band matrimonio", "musica live eventi"],
    minScore: 70,
    heroImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "DJ e luci per festa privata",
    serviceAngle: "DJ, band, impianto audio, orari, scaletta e SIAE",
    mustCheck: ["impianto incluso", "orari di musica", "SIAE", "playlist e momenti chiave", "microfoni"],
    usefulFor: ["matrimonio", "diciottesimo", "compleanno", "festa privata", "evento aziendale"]
  },
  {
    key: "intrattenimento-eventi",
    name: "Intrattenimento",
    group: "A",
    sitemap: "sitemap-intrattenimento-eventi.xml",
    slugPrefix: "intrattenimento-eventi",
    primary: "intrattenimento eventi",
    secondary: ["animazione eventi", "animazione bambini", "artisti per eventi", "spettacoli eventi"],
    minScore: 70,
    heroImage: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Intrattenimento e luci durante un evento",
    serviceAngle: "animazione, artisti, tempi, pubblico, spazi e materiali necessari",
    mustCheck: ["fascia età ospiti", "durata intervento", "spazio necessario", "materiali inclusi", "momenti morti"],
    usefulFor: ["compleanno", "evento aziendale", "team building", "diciottesimo", "festa privata"]
  },
  {
    key: "fotografi-videomaker-eventi",
    name: "Fotografi e Videomaker",
    group: "A",
    sitemap: "sitemap-fotografi-videomaker-eventi.xml",
    slugPrefix: "fotografi-videomaker-eventi",
    primary: "fotografi eventi",
    secondary: ["fotografo matrimonio", "videomaker eventi", "video matrimonio", "foto evento aziendale"],
    minScore: 70,
    heroImage: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Fotografo durante un evento",
    serviceAngle: "ore di copertura, stile, consegne, video, privacy e utilizzo immagini",
    mustCheck: ["ore incluse", "numero foto consegnate", "tempi di consegna", "video e réel", "diritti uso immagini"],
    usefulFor: ["matrimonio", "evento aziendale", "laurea", "diciottesimo", "anniversario"]
  },
  {
    key: "event-planner",
    name: "Event Planner",
    group: "A",
    sitemap: "sitemap-event-planner.xml",
    slugPrefix: "event-planner",
    primary: "event planner",
    secondary: ["organizzatore eventi", "wedding planner", "coordinamento evento", "planner eventi"],
    minScore: 70,
    heroImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Planner che coordina un evento con agenda",
    serviceAngle: "coordinamento, fornitori, budget, timeline e gestione del giorno evento",
    mustCheck: ["ruolo esatto", "fornitori inclusi", "fee planner", "presenza il giorno evento", "gestione imprevisti"],
    usefulFor: ["matrimonio", "evento aziendale", "festa privata", "team building", "anniversario"]
  },
  {
    key: "fioristi-allestimenti",
    name: "Fioristi e Allestimenti",
    group: "A",
    sitemap: "sitemap-fioristi-allestimenti.xml",
    slugPrefix: "fioristi-matrimonio-eventi",
    primary: "fioristi matrimonio",
    secondary: ["allestimenti floreali eventi", "fiori matrimonio", "décorazioni floreali eventi"],
    minScore: 70,
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Bouquet e allestimento floreale matrimonio",
    serviceAngle: "fiori, allestimento, montaggio, smontaggio, stagionalità e resa fotografica",
    mustCheck: ["fiori stagionali", "montaggio e smontaggio", "trasporto", "riuso composizioni", "prove colore"],
    usefulFor: ["matrimonio", "anniversario", "evento aziendale", "battesimo", "comunione"]
  },
  {
    key: "service-audio-luci",
    name: "Tecnici e Allestitori",
    group: "A",
    sitemap: "sitemap-service-audio-luci.xml",
    slugPrefix: "service-audio-luci-eventi",
    primary: "service audio luci eventi",
    secondary: ["allestimenti eventi", "tecnico audio eventi", "noleggio impianto audio eventi"],
    minScore: 70,
    heroImage: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Luci e impianto tecnico per evento",
    serviceAngle: "audio, luci, montaggio, corrente, prove tecniche e presidio in sala",
    mustCheck: ["potenza audio", "luci incluse", "corrente", "montaggio", "tecnico presente"],
    usefulFor: ["evento aziendale", "matrimonio", "festa privata", "team building", "evento promozionale"]
  },
  {
    key: "trasporti-eventi",
    name: "Trasporti",
    group: "A",
    sitemap: "sitemap-trasporti-eventi.xml",
    slugPrefix: "trasporti-eventi",
    primary: "trasporti eventi",
    secondary: ["ncc eventi", "transfer eventi", "auto matrimonio", "minibus eventi"],
    minScore: 70,
    heroImage: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Auto elegante per trasporto evento",
    serviceAngle: "NCC, navette, minibus, orari, rientri e coordinamento ospiti",
    mustCheck: ["numero corse", "orari rientro", "punti raccolta", "tempo attesa", "piano pioggia"],
    usefulFor: ["matrimonio", "evento aziendale", "cena privata", "team building", "festa privata"]
  },
  {
    key: "hostess-promoter",
    name: "Hostess e Promoter",
    group: "B",
    sitemap: "sitemap-hostess-promoter.xml",
    slugPrefix: "hostess-promoter-eventi",
    primary: "hostess eventi",
    secondary: ["promoter eventi", "ragazze immagine eventi", "hostess fiere"],
    minScore: 86,
    heroImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Accoglienza ospiti durante evento aziendale",
    serviceAngle: "accredito, accoglienza, immagine, briefing, turni e lingua",
    mustCheck: ["briefing", "orari turno", "divisa", "lingue", "numero persone"],
    usefulFor: ["fiera", "evento aziendale", "evento promozionale", "convention", "lancio prodotto"]
  },
  {
    key: "supporto-eventi",
    name: "Supporto Eventi",
    group: "B",
    sitemap: "sitemap-supporto-eventi.xml",
    slugPrefix: "supporto-eventi",
    primary: "personale eventi",
    secondary: ["supporto eventi", "camerieri eventi", "staff eventi"],
    minScore: 84,
    heroImage: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Staff di supporto durante servizio evento",
    serviceAngle: "staff operativo, camerieri, montaggio, accoglienza e gestione flussi",
    mustCheck: ["mansioni", "orari", "referente", "numero operatori", "costi extra"],
    usefulFor: ["evento aziendale", "matrimonio", "cena privata", "festa privata", "evento promozionale"]
  },
  {
    key: "servizi-creativi-digitali",
    name: "Servizi Creativi e Digitali",
    group: "B",
    sitemap: "sitemap-servizi-creativi-digitali.xml",
    slugPrefix: "servizi-creativi-digitali-eventi",
    primary: "servizi digitali eventi",
    secondary: ["grafica inviti eventi", "social media eventi", "comunicazione eventi"],
    minScore: 86,
    heroImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Team creativo che prepara materiali evento",
    serviceAngle: "inviti, grafiche, social, landing, materiali e contenuti post evento",
    mustCheck: ["brief creativo", "formati", "tempi consegna", "revisioni", "uso immagini"],
    usefulFor: ["evento aziendale", "lancio prodotto", "matrimonio", "fiera", "convention"]
  },
  {
    key: "trucco-parrucco-eventi",
    name: "Salute e Bellezza",
    group: "B",
    sitemap: "sitemap-trucco-parrucco-eventi.xml",
    slugPrefix: "trucco-parrucco-eventi",
    primary: "trucco parrucco matrimonio",
    secondary: ["make-up matrimonio", "parrucchiere sposa", "beauty eventi"],
    minScore: 84,
    heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Make-up professionale per evento",
    serviceAngle: "prova, tempi, spostamento, durata e look per foto",
    mustCheck: ["prova inclusa", "orario inizio", "spostamento", "ritocco", "prodotti usati"],
    usefulFor: ["matrimonio", "cerimonia", "anniversario", "evento serale", "servizio foto"]
  },
  {
    key: "sicurezza-privata-eventi",
    name: "Sicurezza Privata",
    group: "B",
    sitemap: "sitemap-sicurezza-privata-eventi.xml",
    slugPrefix: "sicurezza-privata-eventi",
    primary: "sicurezza privata eventi",
    secondary: ["steward eventi", "controllo accessi eventi", "sicurezza eventi"],
    minScore: 86,
    heroImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Controllo accessi durante evento aziendale",
    serviceAngle: "accessi, flussi, capienza, presidi e coordinamento con organizzazione",
    mustCheck: ["numero addetti", "orari", "accessi", "briefing", "responsabilità"],
    usefulFor: ["evento aziendale", "fiera", "evento promozionale", "festa privata grande", "concerto"]
  },
  {
    key: "abiti-cerimonia",
    name: "Vestiti per Eventi e Cerimonie",
    group: "B",
    sitemap: "sitemap-abiti-cerimonia.xml",
    slugPrefix: "abiti-cerimonia",
    primary: "abiti cerimonia",
    secondary: ["vestiti matrimonio", "abiti invitata matrimonio", "abiti da sposo"],
    minScore: 88,
    heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Abito elegante per cerimonia",
    serviceAngle: "prove, modifiche, tempi, dress code e consegna",
    mustCheck: ["tempi sartoria", "prova", "modifiche", "accessori", "ritiro"],
    usefulFor: ["matrimonio", "cerimonia", "gala aziendale", "anniversario", "evento formale"]
  },
  {
    key: "bomboniere-regali-eventi",
    name: "Articoli da Regalo",
    group: "C",
    sitemap: "sitemap-bomboniere-regali-eventi.xml",
    slugPrefix: "bomboniere-regali-eventi",
    primary: "bomboniere matrimonio",
    secondary: ["regali testimoni matrimonio", "gadget eventi", "regali evento aziendale"],
    minScore: 90,
    heroImage: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Piccoli regali e dettagli per evento",
    serviceAngle: "quantita, personalizzazione, consegna, confezione e budget unitario",
    mustCheck: ["quantita", "personalizzazione", "tempi consegna", "confezione", "prezzo unitario"],
    usefulFor: ["matrimonio", "evento aziendale", "battesimo", "comunione", "anniversario"]
  },
  {
    key: "fedi-gioielli-matrimonio",
    name: "Gioiellerie",
    group: "C",
    sitemap: "sitemap-fedi-gioielli-matrimonio.xml",
    slugPrefix: "fedi-gioielli-matrimonio",
    primary: "fedi matrimonio",
    secondary: ["gioielli matrimonio", "gioiellerie per fedi", "anelli matrimonio"],
    minScore: 90,
    heroImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=78",
    heroAlt: "Fedi e gioielli per matrimonio",
    serviceAngle: "prove, incisione, tempi consegna, misura e garanzia",
    mustCheck: ["misura", "incisione", "tempi", "materiale", "garanzia"],
    usefulFor: ["matrimonio", "anniversario", "proposta", "cerimonia", "regalo importante"]
  }
];

export const localSeoSitemapFiles = [
  "sitemap-main.xml",
  "sitemap-community.xml",
  "sitemap-magazine.xml",
  "sitemap-guide-eventi.xml",
  "sitemap-regioni.xml",
  "sitemap-province.xml",
  ...localSeoCategories.map((category) => category.sitemap)
];

function scoreLabel(score: number) {
  if (score >= 85) return "Altissimo";
  if (score >= 70) return "Alto";
  if (score >= 55) return "Medio-Alto";
  if (score >= 40) return "Medio";
  return "Non prioritario";
}

function readableArea(page: Pick<LocalSeoPage, "kind" | "city" | "province" | "region">) {
  if (page.kind === "region") return page.region;
  if (page.kind === "province") return `provincia di ${page.province}`;
  return page.city;
}

function vibesLink(categoryKey: string, citySlug: string) {
  return VIBES_PLANNER_CLIENT_REQUEST_URL;
}

function campaignSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueBy<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function categoryTitle(category: CategorySeed, location: LocationSeed, kind: LocalSeoKind) {
  const area = kind === "region" ? location.region : kind === "province" ? `provincia di ${location.province}` : location.city;
  if (category.key === "fotografi-videomaker-eventi" && location.score >= 85) return `Fotografi e videomaker eventi a ${area}`;
  if (category.key === "event-planner" && location.score >= 85) return `Event planner e organizzatori eventi a ${area}`;
  return `${category.primary} a ${area}`;
}

function makeSlug(category: CategorySeed, location: LocationSeed, kind: LocalSeoKind) {
  if (kind === "region") return `${category.slugPrefix}-${campaignSlug(location.region)}`;
  if (kind === "province") return `${category.slugPrefix}-provincia-${campaignSlug(location.province)}`;
  return `${category.slugPrefix}-${location.slug}`;
}

function makeConversations(category: CategorySeed, location: LocationSeed, kind: LocalSeoKind): LocalSeoConversation[] {
  const area = kind === "city" ? location.city : kind === "province" ? `provincia di ${location.province}` : location.region;
  const logistica = kind === "city" ? location.logistics : `le differenze tra capoluogo, provincia e località vicine rendono utile confrontare più opzioni`;
  return [
    {
      title: `Budget per ${category.primary} a ${area}`,
      question: `Caso tipico: "Per un evento a ${area}, che cosa devo chiedere per capire se il prezzo di ${category.primary} è completo"`,
      answer: `Chiedi una proposta con le stesse condizioni: numero ospiti, orari, servizi inclusi, extra e tempi. Per ${category.name.toLowerCase()}, le voci da leggere sono ${category.mustCheck.slice(0, 3).join(", ")}.`,
      tip: "Non confrontare solo il totale: confronta inclusi, esclusi e condizioni di cambio data."
    },
    {
      title: `Logistica e zona a ${area}`,
      question: `Caso tipico: "Il servizio sembra adatto, ma ho dubbi su accessi, orari e spostamenti a ${area}. Cosa controllo?"`,
      answer: `${logistica}. Chiedi sempre chi gestisce arrivo, montaggio, rientro, parcheggio e referente operativo il giorno dell'evento.`,
      tip: "Se ci sono ospiti da fuori, aggiungi nel preventivo tempi di arrivo, transfer e punti di raccolta."
    },
    {
      title: `Scelta urgente di ${category.primary}`,
      question: `Caso tipico: "Ho poco tempo per scegliere ${category.primary} a ${area}. Meglio bloccare subito o aspettare altri preventivi?"`,
      answer: `Blocca solo se hai chiari data, servizi, penali, caparra e disponibilità reale. Se manca una di queste voci, chiedi una revisione sintetica prima di confermare.`,
      tip: "Una risposta rapida non basta: serve una risposta scritta e confrontabile."
    }
  ];
}

function makeFaqs(category: CategorySeed, location: LocationSeed, kind: LocalSeoKind) {
  const area = kind === "city" ? location.city : kind === "province" ? `provincia di ${location.province}` : location.region;
  return [
    {
      question: `Come scelgo ${category.primary} a ${area}?`,
      answer: `Parti dal tipo di evento, dal numero di ospiti e dal budget. Poi confronta solo proposte con servizi simili e condizioni scritte.`
    },
    {
      question: `Quanto prima conviene muoversi a ${area}?`,
      answer: `${location.season}. Per date molto richieste conviene chiedere disponibilità con più anticipo e non aspettare l'ultimo preventivo.`
    },
    {
      question: "Cosa devo scrivere nella richiesta?",
      answer: `Indica zona, data o periodo, numero persone, budget, orari e cosa ti serve davvero. Per ${category.name.toLowerCase()} aggiungi anche ${category.mustCheck.slice(0, 3).join(", ")}.`
    },
    {
      question: "Posso chiedere un confronto alla community?",
      answer: "Si, ma rimuovi nomi dei fornitori, recapiti e dettagli personali. Pubblica solo il dubbio concreto, la zona e le voci del preventivo."
    },
    {
      question: "Quando ha senso usare Vibes Planner?",
      answer: "Quando vuoi inviare una richiesta chiara e ricevere contatti coerenti con zona, budget, categoria e tipo evento, senza scrivere da zero a fornitori casuali."
    }
  ];
}

function makeLocalPage(category: CategorySeed, location: LocationSeed, kind: LocalSeoKind): LocalSeoPage {
  const area = kind === "city" ? location.city : kind === "province" ? `provincia di ${location.province}` : location.region;
  const slug = makeSlug(category, location, kind);
  const title = categoryTitle(category, location, kind);
  const h1 = `${title}: come scegliere senza perdere tempo`;
  const isHub = kind !== "city";
  const score = kind === "region" ? Math.max(70, location.score - 3) : kind === "province" ? Math.max(70, location.score - 2) : location.score;
  const priority: "P1" | "P2" = score >= 70 ? "P1" : "P2";
  const areaSlug = kind === "city" ? location.slug : kind === "province" ? campaignSlug(location.province) : campaignSlug(location.region);
  const otherCategories = localSeoCategories
    .filter((item) => item.key !== category.key && item.group === "A")
    .slice(0, 6)
    .map((item) => ({ slug: makeSlug(item, location, kind), label: `${item.primary} a ${area}` }));
  const nearbyLinks = uniqueBy(
    location.nearby
      .map((nearbySlug) => localSeoLocations.find((item) => item.slug === nearbySlug))
      .filter((item): item is LocationSeed => Boolean(item))
      .map((item) => ({ slug: makeSlug(category, item, "city"), label: `${category.primary} a ${item.city}` })),
    (item) => item.slug
  ).slice(0, 8);

  return {
    slug,
    status: "published",
    kind,
    region: location.region,
    province: location.province,
    city: area,
    locationType: kind === "city" ? location.type : kind === "province" ? "hub provinciale" : "hub regionale",
    score,
    scoreLabel: scoreLabel(score),
    priority,
    categoryKey: category.key,
    categoryName: category.name,
    categoryGroup: category.group,
    primaryKeyword: `${category.primary} ${area}`.toLowerCase(),
    secondaryKeywords: category.secondary.map((keyword) => `${keyword} ${area}`.toLowerCase()),
    title,
    metaTitle: title.length > 58 ? `${category.primary} ${area}` : title,
    metaDescription: `${category.primary} a ${area}: consigli pratici, casi tipici, cosa controllare nel preventivo e richiesta fornitori con OrganizzaEvento e Vibes Planner.`,
    h1,
    url: `${siteUrl}/${slug}`,
    canonical: `${siteUrl}/${slug}`,
    robots: "index, follow",
    sitemap: isHub ? (kind === "region" ? "sitemap-regioni.xml" : "sitemap-province.xml") : category.sitemap,
    lastmod,
    heroImage: category.heroImage,
    heroAlt: category.heroAlt,
    intro: `${area} richiede una scelta ragionata quando cerchi ${category.primary}. ${location.localNote}. Questa pagina raccoglie criteri pratici, casi tipici e domande da fare prima di confermare un fornitore, senza fermarsi alla prima proposta bella da vedere.`,
    localSection: `${kind === "city" ? location.city : area} non va letto solo come nome sulla mappa: ${location.logistics}. Per ${category.name.toLowerCase()} conviene chiedere subito ${category.serviceAngle}, per evitare preventivi apparentemente simili ma difficili da confrontare.`,
    whenUseful: category.usefulFor,
    evaluationChecklist: category.mustCheck,
    conversations: makeConversations(category, location, kind),
    faqs: makeFaqs(category, location, kind),
    serviceLinks: otherCategories,
    nearbyLinks,
    vibesCtaTitle: "Cerchi fornitori per il tuo evento?",
    vibesCtaText:
      "OrganizzaEvento collabora con Vibes Planner per aiutarti a inviare una richiesta chiara e trovare fornitori coerenti con zona, budget e tipo di evento.",
    vibesCtaUrl: vibesLink(category.key, areaSlug),
    antiDoorway: {
      realUtility: `Aiuta a confrontare ${category.name.toLowerCase()} in base a budget, logistica e casi tipici locali.`,
      uniqueLocalElements: `${location.localNote}; ${location.logistics}; stagione: ${location.season}.`,
      uniqueConversations: `Tre casi tipici su budget, logistica e urgenza per ${category.primary} a ${area}.`,
      duplicationRisk: isHub ? 4 : category.group === "A" ? 3 : 4,
      doorwayRisk: isHub ? 4 : score >= 85 ? 2 : 3,
      decision: "pubblicare"
    }
  };
}

const cityPages = localSeoLocations.flatMap((location) =>
  localSeoCategories
    .filter((category) => location.score >= category.minScore)
    .map((category) => makeLocalPage(category, location, "city"))
);

const regionBaseLocations = localSeoRegions
  .map((region) => localSeoLocations.filter((location) => location.region === region).sort((a, b) => b.score - a.score)[0])
  .filter((location): location is LocationSeed => Boolean(location));

const regionPages = regionBaseLocations.flatMap((location) =>
  localSeoCategories.filter((category) => category.group === "A").map((category) => makeLocalPage(category, location, "region"))
);

const provinceBaseLocations = uniqueBy(
  localSeoLocations.filter((location) => location.score >= 78),
  (location) => `${location.region}-${location.province}`
);

const provincePages = provinceBaseLocations.flatMap((location) =>
  localSeoCategories.filter((category) => category.group === "A").map((category) => makeLocalPage(category, location, "province"))
);

export const localSeoPages = uniqueBy([...regionPages, ...provincePages, ...cityPages], (page) => page.slug);

export function getPublishedLocalSeoPages() {
  return localSeoPages.filter((page) => page.status === "published" && page.robots === "index, follow");
}

export function getLocalSeoPage(slug: string) {
  return getPublishedLocalSeoPages().find((page) => page.slug === slug) ?? null;
}

export function getLocalSeoPagesBySitemap(sitemap: string) {
  return getPublishedLocalSeoPages().filter((page) => page.sitemap === sitemap);
}

export function getLocalSeoPagesByRegion() {
  return localSeoRegions.map((region) => ({
    region,
    pages: getPublishedLocalSeoPages().filter((page) => page.region === region && page.kind === "city")
  }));
}

export function getFeaturedLocalSeoPages() {
  return getPublishedLocalSeoPages()
    .filter((page) => page.kind === "city" && page.priority === "P1")
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}
