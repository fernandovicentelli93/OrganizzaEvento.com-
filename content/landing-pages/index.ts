export type LandingPageFaq = {
  question: string;
  answer: string;
};

export type LandingPage = {
  slug: string;
  status: "published" | "draft";
  guideType?: "city" | "regional";
  regionSlug?: string;
  coordinates?: { lat: number; lng: number };
  yearFocus?: string;
  searchTags?: string[];
  sourceSummary?: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  eventType: string;
  city: string;
  region: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  updatedAt: string;
  readingMinutes: number;
  quickFacts: Array<{ label: string; value: string }>;
  sections: Array<{ title: string; body: string; bullets?: string[] }>;
  checklist: string[];
  mistakes: string[];
  communityPrompts: string[];
  faqs: LandingPageFaq[];
  relatedLinks: Array<{ href: string; label: string; description: string }>;
};

import { regionalLandingPages } from "./regional-guides";

type City = {
  name: string;
  slug: string;
  region: string;
  note: string;
  season: string;
};

type EventKind = {
  name: string;
  slug: string;
  category: string;
  audience: string;
  firstStep: string;
  suppliers: string;
  budget: string;
  risk: string;
  timing: string;
  image: string;
  alt: string;
};

type Intent = {
  key: string;
  prefix: string;
  eyebrow: string;
  intent: string;
  topic: string;
  firstAction: string;
  eventKeys: string[];
};

const updatedAt = "2026-06-13";

const cities: City[] = [
  ["Roma", "roma", "Lazio", "tra traffico, ZTL, parcheggi e zone molto diverse tra loro", "primavera e settembre sono molto richiesti"],
  ["Milano", "milano", "Lombardia", "con costi spesso più alti e fornitori molto strutturati", "autunno e periodo natalizio si riempiono presto"],
  ["Napoli", "napoli", "Campania", "tra ville panoramiche, ristoranti e spostamenti da pianificare", "maggio, giugno e settembre sono mesi forti"],
  ["Torino", "torino", "Piemonte", "tra città, collina e provincia con tempi diversi", "primavera e autunno sono molto equilibrati"],
  ["Firenze", "firenze", "Toscana", "tra centro storico, ville e colline dove accessi e ospiti da fuori contano molto", "maggio e settembre sono molto competitivi"],
  ["Bologna", "bologna", "Emilia-Romagna", "tra centro, colli e agriturismi con formule molto diverse", "primavera e autunno funzionano bene"],
  ["Genova", "genova", "Liguria", "con salite, accessi stretti, vista mare e parcheggi da verificare", "estate e inizio autunno sono richiesti"],
  ["Palermo", "palermo", "Sicilia", "tra ville, bagli e sale sul mare dove distanze e rientro pesano", "la stagione lunga aiuta, ma i weekend belli si riempiono"],
  ["Catania", "catania", "Sicilia", "tra città, mare ed Etna con clima e trasporti da leggere bene", "estate e settembre richiedono attenzione al caldo"],
  ["Bari", "bari", "Puglia", "tra masserie, sale sul mare e città da collegare bene", "primavera e settembre sono molto richiesti"],
  ["Verona", "verona", "Veneto", "tra centro, colline e lago con budget molto diversi", "estate e periodo fiere possono cambiare disponibilità"],
  ["Venezia", "venezia", "Veneto", "dove trasporti, acqua e scarico materiali sono parte dell'evento", "alta stagione e weekend vanno prenotati presto"],
  ["Padova", "padova", "Veneto", "tra sale cittadine, ville e colli con logistiche diverse", "primavera e autunno sono periodi comodi"],
  ["Brescia", "brescia", "Lombardia", "tra città, Franciacorta e lago con rientri da organizzare", "i weekend tra maggio e settembre sono richiesti"],
  ["Monza", "monza", "Lombardia", "vicina a Milano ma con dinamiche proprie su costi e spazi", "primavera e autunno funzionano bene"],
  ["Bergamo", "bergamo", "Lombardia", "tra città alta, provincia e colline con accessi da controllare", "inizio autunno e primavera sono piacevoli"],
  ["Como", "como", "Lombardia", "dove vista lago, barche, strade strette e hotel cambiano il piano", "estate e settembre sono molto richiesti"],
  ["Parma", "parma", "Emilia-Romagna", "con forte attenzione a cibo, servizio e rientro ospiti", "primavera e autunno sono ottimi"],
  ["Modena", "modena", "Emilia-Romagna", "tra acetaie, agriturismi e sale dove gli extra vanno letti bene", "autunno e primavera funzionano bene"],
  ["Rimini", "rimini", "Emilia-Romagna", "con mare, hotel, stabilimenti e locali legati alla stagione", "l'estate è forte ma più complessa"],
  ["Pisa", "pisa", "Toscana", "tra aeroporto, centro, campagna e costa da collegare bene", "primavera e settembre sono equilibrati"],
  ["Lucca", "lucca", "Toscana", "tra mura, ville, Versilia e colline con accessi delicati", "estate e settembre sono forti"],
  ["Siena", "siena", "Toscana", "con borghi e tenute dove le distanze sembrano più corte di quanto siano", "maggio, giugno e settembre sono richiesti"],
  ["Perugia", "perugia", "Umbria", "tra casali, borghi e spazi panoramici dove meteo e accessi contano", "primavera e inizio autunno sono ideali"],
  ["Cagliari", "cagliari", "Sardegna", "con mare, vento, caldo e rientri da programmare", "estate e settembre sono molto richiesti"],
  ["Sassari", "sassari", "Sardegna", "tra costa e campagna con trasferte e tempi più larghi", "estate e settembre sono forti"],
  ["Lecce", "lecce", "Puglia", "tra masserie, centro storico e mare dove parcheggi e caldo contano", "estate e settembre sono molto richiesti"],
  ["Brindisi", "brindisi", "Puglia", "tra masserie, mare e aeroporto con distanze da chiarire", "primavera e fine estate sono comodi"],
  ["Salerno", "salerno", "Campania", "tra città, vista mare e costiera con traffico stagionale", "estate e settembre sono splendidi ma impegnativi"],
  ["Caserta", "caserta", "Campania", "con ville, ristoranti e sale ampie dove i pacchetti vanno letti bene", "primavera e autunno sono molto usati"],
  ["Pescara", "pescara", "Abruzzo", "tra mare, collina e città con rientro serale da considerare", "estate e settembre funzionano bene"],
  ["Ancona", "ancona", "Marche", "tra città e Riviera del Conero con accessi e parcheggi da valutare", "primavera e settembre sono piacevoli"],
  ["Pesaro", "pesaro", "Marche", "tra costa e colline con formule diverse per sale e ristoranti", "estate e fine primavera sono richieste"],
  ["Trento", "trento", "Trentino-Alto Adige", "tra città, cantine, valli e meteo da non sottovalutare", "estate e inverno hanno esigenze opposte"],
  ["Bolzano", "bolzano", "Trentino-Alto Adige", "con montagna, hotel e regole precise sugli orari", "inverno e fine estate vanno pianificati bene"],
  ["Trieste", "trieste", "Friuli-Venezia Giulia", "con mare, Carso e vento che incidono sul comfort", "primavera e inizio autunno funzionano bene"],
  ["Udine", "udine", "Friuli-Venezia Giulia", "tra ville, agriturismi e spazi conviviali", "autunno e primavera sono ottimi"],
  ["Aosta", "aosta", "Valle d'Aosta", "con montagna, strade, meteo e pernottamenti da progettare", "inverno ed estate hanno esigenze molto diverse"],
  ["Novara", "novara", "Piemonte", "tra Piemonte e Lombardia con fornitori da confrontare bene", "primavera e autunno sono equilibrati"],
  ["Alessandria", "alessandria", "Piemonte", "tra cascine, colline e sale dove trasporto e orari pesano", "primavera e vendemmia sono momenti belli"],
  ["Vicenza", "vicenza", "Veneto", "tra ville, centro storico e colli con vincoli da chiarire", "primavera e settembre sono adatti"],
  ["Treviso", "treviso", "Veneto", "tra ville venete, città e campagna con accessi diversi", "primavera e autunno sono molto richiesti"],
  ["Ferrara", "ferrara", "Emilia-Romagna", "tra centro storico, ville e parcheggi da controllare", "primavera e autunno sono comodi"],
  ["Ravenna", "ravenna", "Emilia-Romagna", "tra città, campagna e costa con esigenze diverse", "estate è forte per feste sul mare"],
  ["Matera", "matera", "Basilicata", "con scenari unici ma accessi e scalini da considerare", "primavera e settembre sono molto richiesti"],
  ["Potenza", "potenza", "Basilicata", "con distanze e strade da valutare più del previsto", "primavera e autunno sono più gestibili"],
  ["Reggio Calabria", "reggio-calabria", "Calabria", "tra mare, colline e rientri da organizzare", "estate e settembre sono molto richiesti"],
  ["Messina", "messina", "Sicilia", "con stretto, costa e colline dove transfer e tempi incidono", "estate e inizio autunno sono forti"],
  ["Siracusa", "siracusa", "Sicilia", "tra centro storico, mare e campagne con caldo e accessi da leggere", "primavera e settembre sono splendidi"],
  ["Trapani", "trapani", "Sicilia", "tra mare, saline, borghi e trasferte da chiarire", "estate e settembre sono forti"]
].map(([name, slug, region, note, season]) => ({ name, slug, region, note, season }));

const events: Record<string, EventKind> = Object.entries({
  matrimonio: ["matrimonio", "matrimonio", "matrimoni", "coppie che stanno scegliendo location e fornitori", "lista invitati, budget massimo e piano B", "location, catering, musica, foto e fiori", "prezzo a persona, affitto location, extra e caparre", "firmare una location bella ma poco chiara negli extra", "da 18 a 9 mesi prima", "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=78", "Tavola elegante preparata per un matrimonio"],
  compleanno: ["compleanno adulto", "compleanno-adulto", "compleanni-feste-private", "chi vuole una festa curata senza effetto improvvisato", "tono della serata, numero persone e fascia budget", "location, buffet, musica, torta e servizio", "sala, menu, bevande, DJ e orari extra", "fare una cena troppo lunga o una festa bella ma scómoda", "da 3 a 2 mesi prima", "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1600&q=78", "Festa privata con tavola colorata"],
  diciottesimo: ["diciottesimo", "diciottesimo", "compleanni-feste-private", "famiglie che stanno organizzando una festa di 18 anni", "regole su orari, musica, alcolici e adulti referenti", "sala, DJ, sicurezza, torta, open bar e foto", "sala, DJ, drink, torta e personale", "sottovalutare ingresso ospiti, responsabilità e bar", "da 4 a 2 mesi prima", "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=78", "Palloncini colorati per festa di compleanno"],
  laurea: ["festa di laurea", "festa-laurea", "compleanni-feste-private", "laureandi e famiglie che vogliono festeggiare senza spendere a caso", "numero invitati, orario proclamazione e budget massimo", "locale, aperitivo, torta, musica leggera e foto", "aperitivo, drink, torta e piccoli allestimenti", "organizzare tutto tardi e scegliere una formula scómoda", "da 6 a 3 settimane prima", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=78", "Persone che festeggiano una laurea"],
  festa: ["festa privata", "festa-privata", "compleanni-feste-private", "chi sta organizzando una festa con amici o famiglia", "spazio, orario, rumore, cibo e budget", "sala, buffet, musica, open bar e pulizie", "affitto spazio, cibo, bevande e personale", "dimenticare limiti di rumore, vicini e pulizie", "da 2 a 1 mese prima", "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=78", "Festa serale con luci e persone"],
  aziendale: ["evento aziendale", "evento-aziendale", "eventi-aziendali", "aziende che vogliono un evento utile e non solo formale", "obiettivo, numero partecipanti e risultato atteso", "location, catering, audio, accrediti, foto e materiali", "sala, tecnica, coffee break, cena e personale", "creare un evento corretto sulla carta ma noioso", "da 3 a 2 mesi prima", "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=78", "Sala preparata per evento aziendale"],
  cenaAziendale: ["cena aziendale", "cena-aziendale", "eventi-aziendali", "team e aziende che vogliono una cena piacevole e ordinata", "budget a persona, stile della serata e lista partecipanti", "ristorante, sala privata, menu, beverage e audio", "menù, vino, sala, servizio e piccoli extra", "trasformare la cena in un obbligo lungo", "da 8 a 4 settimane prima", "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=78", "Cena aziendale con tavola apparecchiata"],
  team: ["team building", "team-building", "eventi-aziendali", "aziende che vogliono far lavorare meglio il gruppo", "obiettivo del team e livello di confidenza tra colleghi", "facilitatore, location, attività, catering e tempi", "attività, sala, pranzo, materiali e trasporto", "scegliere giochi forzati che mettono a disagio", "da 2 a 1 mese prima", "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=78", "Team aziendale durante un workshop"],
  anniversario: ["anniversario", "anniversario", "compleanni-feste-private", "famiglie o coppie che vogliono celebrare un momento importante", "numero ospiti, tono della serata e valore simbolico", "ristorante, sala privata, menu, foto e allestimento", "menu, sala privata, torta, fiori e foto", "fare una festa troppo formale o poco personale", "da 2 a 1 mese prima", "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=78", "Brindisi visto dall'alto durante una festa privata"],
  cenaPrivata: ["cena privata", "cena-privata", "catering-menu", "chi vuole organizzare una cena curata a casa o in sala privata", "numero coperti, cucina disponibile e tipo servizio", "chef, catering, cameriere, menu, stoviglie e pulizie", "menu, personale, trasporto, stoviglie e bevande", "sottovalutare spazi, cucina e pulizie finali", "da 6 a 3 settimane prima", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=78", "Cena privata con piatti serviti a tavola"]
}).reduce<Record<string, EventKind>>((acc, [key, value]) => {
  const [name, slug, category, audience, firstStep, suppliers, budget, risk, timing, image, alt] = value as string[];
  acc[key] = { name, slug, category, audience, firstStep, suppliers, budget, risk, timing, image, alt };
  return acc;
}, {});

const intents: Intent[] = [
  { key: "organizzare", prefix: "organizzare", eyebrow: "Guida pratica", intent: "Capire da dove partire", topic: "organizzazione generale", firstAction: "mettere in fila priorità, budget e tempi", eventKeys: ["matrimonio", "compleanno", "aziendale", "festa", "anniversario"] },
  { key: "costi", prefix: "quanto-costa", eyebrow: "Quanto costa", intent: "Capire se una cifra è normale", topic: "budget e costi", firstAction: "dividere il preventivo in voci leggibili", eventKeys: ["matrimonio", "diciottesimo", "laurea", "cenaAziendale", "festa"] },
  { key: "location", prefix: "location", eyebrow: "Scelta location", intent: "Trovare uno spazio adatto", topic: "location e spazi", firstAction: "controllare capienza, orari, accessi e piano B", eventKeys: ["matrimonio", "compleanno", "aziendale", "diciottesimo", "anniversario"] },
  { key: "catering", prefix: "catering", eyebrow: "Catering e menù", intent: "Confrontare menù e servizio", topic: "cibo, bevande e personale", firstAction: "chiedere menù, durata servizio e cosa resta escluso", eventKeys: ["matrimonio", "cenaPrivata", "aziendale", "festa", "laurea"] },
  { key: "musica", prefix: "musica-dj", eyebrow: "Musica e DJ", intent: "Scegliere musica senza errori", topic: "DJ, band e audio", firstAction: "chiarire orari, impianto, SIAE e scaletta", eventKeys: ["matrimonio", "diciottesimo", "compleanno", "festa", "anniversario"] },
  { key: "foto", prefix: "fotografo", eyebrow: "Foto e video", intent: "Capire cosa chiedere al fotografo", topic: "fotografía e video", firstAction: "definire ore di copertura, consegne e utilizzi", eventKeys: ["matrimonio", "aziendale", "diciottesimo", "laurea", "anniversario"] },
  { key: "openbar", prefix: "open-bar", eyebrow: "Open bar", intent: "Evitare sorprese sulle bevande", topic: "bar, drink e consumi", firstAction: "scegliere formula, durata, lista drink e tetto massimo", eventKeys: ["matrimonio", "diciottesimo", "compleanno", "festa", "aziendale"] },
  { key: "preventivo", prefix: "preventivo", eyebrow: "Preventivi", intent: "Capire se un preventivo torna", topic: "preventivi e clausole", firstAction: "leggere inclusi, esclusi, caparra e penali", eventKeys: ["matrimonio", "aziendale", "festa", "diciottesimo", "cenaPrivata"] },
  { key: "problema", prefix: "problemi-fornitori", eyebrow: "Problemi pratici", intent: "Gestire dubbi o problemi con fornitori", topic: "caparre, ritardi e accordi", firstAction: "ricostruire accordi e scrivere in modo neutro", eventKeys: ["matrimonio", "festa", "aziendale", "diciottesimo", "cenaPrivata"] },
  { key: "idée", prefix: "idée", eyebrow: "Idee evento", intent: "Trovare un'idea realizzabile", topic: "idee e format", firstAction: "scegliere un format semplice da spiegare e da gestire", eventKeys: ["compleanno", "team", "aziendale", "anniversario", "festa"] }
];

function titleFor(intent: Intent, event: EventKind, city: City) {
  if (intent.key === "costi") return `Quanto costa un ${event.name} a ${city.name}: voci da controllare`;
  if (intent.key === "location") return `Location per ${event.name} a ${city.name}: come scegliere senza farsi guidare solo dalle foto`;
  if (intent.key === "catering") return `Catering per ${event.name} a ${city.name}: menù, servizio ed extra da chiarire`;
  if (intent.key === "musica") return `Musica e DJ per ${event.name} a ${city.name}: cosa chiedere prima di confermare`;
  if (intent.key === "foto") return `Fotografo per ${event.name} a ${city.name}: ore, consegne e preventivo`;
  if (intent.key === "openbar") return `Open bar per ${event.name} a ${city.name}: formule e limiti da mettere per iscritto`;
  if (intent.key === "preventivo") return `Preventivo per ${event.name} a ${city.name}: come capire se ? chiaro`;
  if (intent.key === "problema") return `Problemi con fornitori per ${event.name} a ${city.name}: cosa fare senza peggiorare la situazione`;
  if (intent.key === "idée") return `Idee per ${event.name} a ${city.name}: format belli ma realizzabili`;
  return `Organizzare un ${event.name} a ${city.name} senza perdere il controllo`;
}

function sectionTwo(intent: Intent, event: EventKind) {
  const titles: Record<string, string> = {
    organizzare: "La scaletta minima per non saltare da un fornitore all'altro",
    costi: `Le voci che fanno cambiare il prezzo di un ${event.name}`,
    location: "Cosa guardare durante una visita in location",
    catering: "Menu e servizio: il preventivo va letto insieme",
    musica: "DJ, band o playlist: la scelta dipende dal ritmo della giornata",
    foto: "Non contare solo le ore: conta cosa viene consegnato",
    openbar: "Formula a persona o a consumo: scegli prima il límite",
    preventivo: "Come leggere un preventivo senza farti confondere",
    problema: "Prima di accusare, ricostruisci accordi e scadenze",
    idée: "Un'idea funziona quando diventa una sequenza semplice"
  };
  return titles[intent.key] ?? titles.organizzare;
}

function pageFor(city: City, intent: Intent, cityIndex: number, intentIndex: number): LandingPage {
  const event = events[intent.eventKeys[(cityIndex + intentIndex) % intent.eventKeys.length]];
  const title = titleFor(intent, event, city);

  return {
    slug: `${intent.prefix}-${event.slug}-${city.slug}`,
    status: "published",
    title,
    metaTitle: title.length > 58 ? `${intent.eyebrow} ${event.name} ${city.name}` : title,
    metaDescription: `Guida pratica su ${intent.topic} per ${event.name} a ${city.name}: budget, fornitori, domande da fare, errori da evitare e quando chiedere alla community.`,
    eyebrow: intent.eyebrow,
    eventType: event.name.charAt(0).toUpperCase() + event.name.slice(1),
    city: city.name,
    region: city.region,
    heroImage: event.image,
    heroAlt: event.alt,
    intro: `${city.name} può offrire soluzioni molto diverse per un ${event.name}: ${city.note}. Questa guida aiuta a ragionare su ${intent.topic}, senza fermarsi alla prima proposta bella da vedere o alla cifra più bassa.`,
    updatedAt,
    readingMinutes: 7 + ((cityIndex + intentIndex) % 3),
    quickFacts: [
      { label: "Per chi", value: event.audience },
      { label: "Zona", value: `${city.name} e provincia` },
      { label: "Intento", value: intent.intent },
      { label: "Primo passo", value: intent.firstAction }
    ],
    sections: [
      {
        title: "Prima di decidere, metti a fuoco il caso",
        body: `Per un ${event.name} a ${city.name} conviene partire da ${event.firstStep}. Se inizi chiedendo solo prezzi, riceverai risposte difficili da confrontare; se invece racconti contesto, orario e priorità, i fornitori possono rispondere in modo più utile.`,
        bullets: ["Scrivi numero persone, data o periodo e zona preferita.", "Decidi cosa conta di più: comodità, atmosfera, budget o semplicità.", "Tieni una piccola lista di cose non negoziabili."]
      },
      {
        title: sectionTwo(intent, event),
        body: `${intent.firstAction} è il punto che evita più confusione. Nel caso di un ${event.name}, le voci delicate sono ${event.budget}. A ${city.name}, ${city.note}, quindi una scelta economica sulla carta può diventare più costosa se aggiungi trasporto, orari extra o servizi obbligatori.`,
        bullets: ["Chiedi cosa è incluso e cosa resta escluso.", "Fatti mandare una versione scritta, non solo messaggi sparsi.", "Confronta proposte simili: stesso numero persone, stessi orari, stessi servizi."]
      },
      {
        title: "Fornitori: pochi, ma confrontabili",
        body: `Per ${event.suppliers} non serve contattare venti persone. Ne bastano tre o quattro per categoria, purché ricevano la stessa richiesta. Il rischio più comune ? ${event.risk}.`,
        bullets: ["Salva scadenze, caparre e condizioni in un unico posto.", "Chiedi chi sarà presente il giorno dell'evento.", "Se una risposta è vaga, chiedi una precisazione prima di confermare."]
      },
      {
        title: "Logistica locale: il dettaglio che gli ospiti notano",
        body: `${city.season}. In una guida o in un messaggio agli invitati bastano poche informazioni: orario reale, indirizzo, parcheggio, rientro e cosa aspettarsi. La logistica non è décorazione, ? esperienza.`,
        bullets: ["Controlla parcheggio, taxi, navette e tempi di rientro.", "Se l'evento ? all'aperto, chiedi piano B, ombra, vento, caldo o freddo.", "Prepara un messaggio unico per gli ospiti."]
      },
      {
        title: "Cosa mettere per iscritto prima di dire sì",
        body: `Prima di confermare un ${event.name}, controlla caparra, saldo, penali, orari, extra e responsabilità. Non è sfiducia: è il modo più semplice per evitare discussioni quando mancano pochi giorni.`,
        bullets: ["Caparra: importo, natura, cambio data o annullamento.", "Extra: ore aggiuntive, personale, trasporto, pulizie, sicurezza e materiali.", "Numeri finali: entro quando comunicarli e quale tolleranza ? prevista."]
      },
      {
        title: "Quando chiedere alla community",
        body: `Se hai un dubbio concreto, pubblicalo senza nomi di fornitori e senza dati sensibili. Scrivi ${city.name}, tipo evento, numero persone, budget indicativo e il punto che non ti torna.`,
        bullets: ["Chiedi prima di versare una caparra importante.", "Confronta due opzioni, non venti alternative.", "Aggiorna la conversazione quando ricevi una risposta dal fornitore."]
      }
    ],
    checklist: [
      `Definisci ${event.firstStep} prima di chiedere preventivi.`,
      `Prepara una richiesta unica per fornitori a ${city.name} e provincia.`,
      "Chiedi inclusi, esclusi, orari, caparra e penali in forma scritta.",
      "Controlla accessi, parcheggio, rientro e piano B.",
      "Confronta almeno tre risposte simili, non tre brochure diverse.",
      `Tieni un margine per extra su ${event.budget}.`,
      "Apri una conversazione se una voce del preventivo non ti torna."
    ],
    mistakes: [
      "Scegliere solo in base alle foto.",
      "Chiedere un prezzo senza indicare numero persone, zona e servizi richiesti.",
      "Firmare quando non è chiaro cosa succede con cambio data, meteo o ritardi.",
      `Dare per scontato che a ${city.name} spostamenti e rientri siano semplici.`,
      "Confrontare prezzo finale senza leggere le voci che lo compongono."
    ],
    communityPrompts: [
      `Sto organizzando un ${event.name} a ${city.name}: da quale fornitore parto?`,
      `Questo preventivo per ${event.name} a ${city.name} vi sembra chiaro?`,
      "Meglio spendere di più per comodità ospiti o per allestimento",
      `Quali extra avete scoperto tardi organizzando un ${event.name}?`
    ],
    faqs: [
      { question: `Quanto prima conviene organizzare un ${event.name} a ${city.name}?`, answer: `Dipende dalla stagione, ma per un ${event.name} conviene muoversi ${event.timing}. Se la data cade in un weekend richiesto, meglio anticipare.` },
      { question: "Qual è il primo preventivo da chiedere", answer: "Parti dal fornitore che blocca davvero la data o condiziona tutto il resto. Spesso è la location, ma non sempre." },
      { question: "Come capisco se un prezzo è alto", answer: "Non guardare solo il totale. Confronta numero persone, ore incluse, personale, trasporto, IVA, materiali, montaggio ed extra." },
      { question: "Posso chiedere un parere senza fare nomi", answer: "Sì. Togli nomi dei fornitori e dati personali, poi condividi città, tipo evento, numero persone, budget e dubbio principale." }
    ],
    relatedLinks: [
      { href: `/fai-domandacategoria=${event.category}`, label: "Fai una domanda sul tuo caso", description: "Scrivi città, budget e dubbio principale." },
      { href: `/domandecategory=${event.category}`, label: "Leggi conversazioni simili", description: "Guarda dubbi e risposte già pubblicati." },
      { href: "/trova-fornitori", label: "Richiedi fornitori", description: "Invia una richiesta privata per ricevere supporto." }
    ]
  };
}

const cityLandingPages: LandingPage[] = cities.flatMap((city, cityIndex) =>
  intents.map((intent, intentIndex) => pageFor(city, intent, cityIndex, intentIndex))
);

export const landingPages: LandingPage[] = [...regionalLandingPages, ...cityLandingPages];

export function getPublishedLandingPages() {
  return landingPages.filter((page) => page.status === "published");
}

export function getLandingPage(slug: string) {
  return landingPages.find((page) => page.slug === slug && page.status === "published") ?? null;
}

export function getLandingPagesByRegion() {
  const grouped = new Map<string, LandingPage[]>();
  for (const page of getPublishedLandingPages()) {
    grouped.set(page.region, [...(grouped.get(page.region) ?? []), page]);
  }
  return Array.from(grouped.entries()).map(([region, pages]) => ({ region, pages }));
}
