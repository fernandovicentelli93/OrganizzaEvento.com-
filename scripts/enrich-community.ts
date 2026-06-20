import { PrismaClient, type DisplayMode } from "@prisma/client";
import { CATEGORIES } from "../lib/constants";
import { slugify } from "../lib/slug";

const prisma = new PrismaClient();

const voices: Array<{ displayMode: DisplayMode; displayName: string | null }> = [
  { displayMode: "real_name", displayName: "Giulia" },
  { displayMode: "real_name", displayName: "Marco" },
  { displayMode: "nickname", displayName: "eventi_con_ansia" },
  { displayMode: "real_name", displayName: "Serena" },
  { displayMode: "nickname", displayName: "budget_sotto_controllo" },
  { displayMode: "real_name", displayName: "Alessandro" },
  { displayMode: "real_name", displayName: "Marta" },
  { displayMode: "nickname", displayName: "lista_evidenziatore" },
  { displayMode: "real_name", displayName: "Chiara" },
  { displayMode: "nickname", displayName: "fornitori_no_panico" },
  { displayMode: "real_name", displayName: "Elena" },
  { displayMode: "real_name", displayName: "Davide" },
  { displayMode: "anonymous", displayName: null }
];

type QuestionForEnrichment = Awaited<ReturnType<typeof loadQuestions>>[number];

type CostQuestionSeed = {
  title: string;
  content: string;
  categorySlug: string;
  eventType: string;
  city: string;
  region: string;
  peopleCount: number;
  budgetRange: string;
  displayName: string;
  statusLabel: string;
  answers: string[];
  usefulVotes: number;
  notUsefulVotes: number;
};

function compactLocation(question: QuestionForEnrichment) {
  return [question.city, question.region].filter(Boolean).join(", ") || "la tua zona";
}

function eventName(question: QuestionForEnrichment) {
  return question.eventType?.toLowerCase() ?? "evento";
}

function hash(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function targetAnswers(question: QuestionForEnrichment, index: number) {
  return 3 + ((hash(`${question.slug}:${question.title}:${index}`) + index) % 12);
}

const costServices = [
  {
    service: "catering",
    categorySlug: "catering-menu",
    eventType: "Cena privata",
    city: "Roma",
    region: "Lazio",
    peopleCount: 52,
    budgetRange: "4.600-5.400 euro",
    detail: "buffet salato, primo caldo, dolce, acqua, vino base e quattro persone di servizio",
    doubt: "bevande extra, torta e smontaggio serale non sono chiarissimi"
  },
  {
    service: "DJ e luci",
    categorySlug: "musica-dj",
    eventType: "Diciottesimo",
    city: "Milano",
    region: "Lombardia",
    peopleCount: 80,
    budgetRange: "750-1.100 euro",
    detail: "cinque ore di musica, impianto base, microfono e piccole luci da sala",
    doubt: "ore extra, SIAE e montaggio non sono scritti bene"
  },
  {
    service: "location",
    categorySlug: "location",
    eventType: "Compleanno",
    city: "Firenze",
    region: "Toscana",
    peopleCount: 65,
    budgetRange: "5.800-7.200 euro",
    detail: "villa con giardino, sala interna, tavoli base e pulizie fino a mezzanotte",
    doubt: "security, parcheggio e piano B pioggia restano vaghi"
  },
  {
    service: "open bar",
    categorySlug: "catering-menu",
    eventType: "Festa privata",
    city: "Bologna",
    region: "Emilia-Romagna",
    peopleCount: 90,
    budgetRange: "2.400-3.200 euro",
    detail: "tre ore di cocktail, due bartender, ghiaccio, bicchieri e distillati standard",
    doubt: "premium, consumazione dopo pacchetto e chiusura bar non sono chiari"
  },
  {
    service: "fotografo",
    categorySlug: "matrimoni",
    eventType: "Matrimonio",
    city: "Verona",
    region: "Veneto",
    peopleCount: 110,
    budgetRange: "2.500-3.400 euro",
    detail: "otto ore di copertura, galleria online e selezione foto editate",
    doubt: "trasferta, secondo fotografo e tempi di consegna sono lasciati aperti"
  },
  {
    service: "fiori e allestimento",
    categorySlug: "matrimoni",
    eventType: "Matrimonio",
    city: "Lecce",
    region: "Puglia",
    peopleCount: 95,
    budgetRange: "3.500-4.800 euro",
    detail: "bouquet, arco cerimonia, centrotavola, candele e allestimento tableau",
    doubt: "il preventivo dice a partire da e non capisco cosa fa salire il totale"
  },
  {
    service: "event planner",
    categorySlug: "matrimoni",
    eventType: "Matrimonio",
    city: "Siena",
    region: "Toscana",
    peopleCount: 120,
    budgetRange: "4.500-6.500 euro",
    detail: "ricerca fornitori, timeline, sopralluoghi e coordinamento del giorno evento",
    doubt: "il numero di incontri e revisioni sembra limitato"
  },
  {
    service: "transfer ospiti",
    categorySlug: "eventi-aziendali",
    eventType: "Evento aziendale",
    city: "Bologna",
    region: "Emilia-Romagna",
    peopleCount: 70,
    budgetRange: "1.900-2.600 euro",
    detail: "navette aeroporto, hotel, location e rientro serale",
    doubt: "tempi di attesa, bagagli e ritardi non sono specificati"
  },
  {
    service: "audio video per conferenza",
    categorySlug: "eventi-aziendali",
    eventType: "Evento aziendale",
    city: "Torino",
    region: "Piemonte",
    peopleCount: 140,
    budgetRange: "3.000-4.200 euro",
    detail: "due schermi, microfoni, tecnico in sala e registrazione base",
    doubt: "prove tecniche e ore extra del tecnico non sono nel totale"
  },
  {
    service: "animazione e intrattenimento",
    categorySlug: "compleanni-feste-private",
    eventType: "Festa privata",
    city: "Napoli",
    region: "Campania",
    peopleCount: 75,
    budgetRange: "1.200-1.800 euro",
    detail: "performer live, breve set DJ e supporto tecnico",
    doubt: "spazio necessario, audio e tempi di montaggio sono poco chiari"
  },
  {
    service: "band matrimonio",
    categorySlug: "musica-dj",
    eventType: "Matrimonio",
    city: "Como",
    region: "Lombardia",
    peopleCount: 100,
    budgetRange: "3.800-5.200 euro",
    detail: "trio aperitivo, musica cena e set festa dopo torta",
    doubt: "pause, DJ di appoggio e ore oltre mezzanotte sono vaghe"
  },
  {
    service: "chef privato",
    categorySlug: "catering-menu",
    eventType: "Anniversario",
    city: "Lucca",
    region: "Toscana",
    peopleCount: 28,
    budgetRange: "2.900-3.600 euro",
    detail: "chef, aiuto cucina, menu quattro portate e spesa ingredienti",
    doubt: "servizio al tavolo, calici e pulizia cucina risultano extra"
  }
];

const eventCostSeeds = [
  {
    eventType: "Matrimonio",
    categorySlug: "matrimoni",
    city: "Roma",
    region: "Lazio",
    peopleCount: 90,
    budgetRange: "22.000-31.000 euro",
    detail: "location, catering, musica, foto e fiori base",
    doubt: "non capisco quale voce rischia di esplodere dopo la firma"
  },
  {
    eventType: "Compleanno",
    categorySlug: "compleanni-feste-private",
    city: "Milano",
    region: "Lombardia",
    peopleCount: 60,
    budgetRange: "6.000-8.500 euro",
    detail: "sala, buffet, torta, DJ e bar semplice",
    doubt: "il totale sembra gestibile ma ogni fornitore lascia fuori qualcosa"
  },
  {
    eventType: "Evento aziendale",
    categorySlug: "eventi-aziendali",
    city: "Torino",
    region: "Piemonte",
    peopleCount: 130,
    budgetRange: "14.000-19.000 euro",
    detail: "sala, welcome coffee, audio, cena e supporto accoglienza",
    doubt: "temo che check-in, prove e personale extra non siano conteggiati"
  },
  {
    eventType: "Laurea",
    categorySlug: "compleanni-feste-private",
    city: "Padova",
    region: "Veneto",
    peopleCount: 45,
    budgetRange: "2.200-3.400 euro",
    detail: "aperitivo rinforzato, torta, musica leggera e spazio privato",
    doubt: "non so se convenga pacchetto completo o pagare le voci separate"
  },
  {
    eventType: "Cena privata",
    categorySlug: "catering-menu",
    city: "Palermo",
    region: "Sicilia",
    peopleCount: 35,
    budgetRange: "3.000-4.100 euro",
    detail: "chef, mise en place, personale, vino base e dolce",
    doubt: "sembra elegante ma non vedo chiaramente noleggi e trasporto"
  },
  {
    eventType: "Team building",
    categorySlug: "eventi-aziendali",
    city: "Bari",
    region: "Puglia",
    peopleCount: 55,
    budgetRange: "5.500-7.500 euro",
    detail: "attivita, pranzo, facilitatore e sala appoggio",
    doubt: "non capisco se logistica e materiali siano davvero inclusi"
  }
];

function firstAnswerForCost(seed: Pick<CostQuestionSeed, "eventType" | "city" | "peopleCount" | "budgetRange">) {
  return `Io guarderei il totale per persona, ma solo dopo aver separato IVA, personale, orari, trasporto e materiali. Con ${seed.peopleCount} invitati a ${seed.city}, anche un extra piccolo puo cambiare parecchio il conto.`;
}

function secondAnswerForCost(seed: Pick<CostQuestionSeed, "content" | "budgetRange">) {
  return `Il preventivo non mi sembra da bocciare subito: chiederei una versione con incluso, escluso e opzionale. Su ${seed.budgetRange} la chiarezza vale quasi quanto lo sconto.`;
}

function makeCostQuestionSeeds() {
  const serviceTitlePairs = [
    [
      "Catering a Roma: menu chiaro, ma bevande e smontaggio restano fuori",
      "Buffet per 52 persone: il prezzo sale sulle voci che non avevo letto"
    ],
    [
      "DJ e luci a Milano: cinque ore scritte, extra poco chiari",
      "Diciottesimo con musica fino a tardi: cosa chiedere prima del si"
    ],
    [
      "Villa a Firenze: affitto bello, ma piano pioggia e sicurezza pesano",
      "Compleanno in villa: il preventivo sembra elegante ma incompleto"
    ],
    [
      "Open bar a Bologna: tre ore, due bartender e il dubbio del dopo pacchetto",
      "Cocktail a pacchetto o a consumo: dove si rischia il conto finale"
    ],
    [
      "Fotografo a Verona: otto ore incluse, consegna e trasferta da chiarire",
      "Album e secondo fotografo fuori preventivo: come leggerlo prima della firma"
    ],
    [
      "Fiori matrimonio a Lecce: il pacchetto parte bene, poi arrivano le varianti",
      "Arco, bouquet e centrotavola: quali dettagli fanno muovere il totale"
    ],
    [
      "Wedding planner a Siena: fee chiaro, numero incontri meno chiaro",
      "Coordinamento matrimonio: cosa deve essere scritto oltre al prezzo"
    ],
    [
      "Navette per evento aziendale: bagagli e attese non sono dettagli piccoli",
      "Transfer ospiti a Bologna: il preventivo dimentica i tempi morti"
    ],
    [
      "Audio video per conferenza: schermi inclusi, prove tecniche no",
      "Evento clienti a Torino: tecnico in sala, ma quante ore davvero?"
    ],
    [
      "Intrattenimento a Napoli: show interessante, spazio e montaggio da capire",
      "Festa privata con performer: prima del prezzo serve capire la logistica"
    ],
    [
      "Band matrimonio a Como: trio, cena e festa nella stessa proposta",
      "Musica live sul lago: pause e DJ di appoggio vanno messi nero su bianco"
    ],
    [
      "Chef privato a Lucca: menu completo, ma servizio e calici sono extra",
      "Cena in casa con chef: quando il preventivo non finisce nel menu"
    ]
  ];

  const eventTitlePairs = [
    [
      "Matrimonio a Roma: sto dividendo il budget prima di innamorarmi della villa",
      "Budget matrimonio: le voci che rischiano di scappare dopo la firma"
    ],
    [
      "Compleanno a Milano: sala, buffet e DJ stanno entrando nello stesso conto",
      "Festa per 60 persone: dove tagliare senza rovinare la serata"
    ],
    [
      "Evento aziendale a Torino: preventivo unico, troppe voci tecniche aperte",
      "Cena e talk per 130 persone: cosa manca prima di presentare il budget"
    ],
    [
      "Laurea a Padova: pacchetto completo o voci separate?",
      "Aperitivo di laurea: il totale sembra basso finche non aggiungo musica e torta"
    ],
    [
      "Cena privata a Palermo: elegante sulla carta, noleggi poco chiari",
      "Chef e servizio per 35 persone: quali extra chiedere subito"
    ],
    [
      "Team building a Bari: attivita, pranzo e sala appoggio nello stesso preventivo",
      "Giornata aziendale leggera: materiali e logistica sono davvero inclusi?"
    ]
  ];

  const serviceQuestions = costServices.flatMap((item, index): CostQuestionSeed[] => {
    const displayName = index % 3 === 0 ? "budget_sincero" : index % 3 === 1 ? "Chiara" : "lista_preventivi";
    const titles = serviceTitlePairs[index] ?? [
      `${item.service} a ${item.city}: cosa leggere prima della caparra`,
      `${item.service} per ${item.eventType.toLowerCase()}: le voci che cambiano il totale`
    ];
    const base: CostQuestionSeed = {
      title: titles[0],
      content: `Ho ricevuto un preventivo per ${item.detail}. Il range e ${item.budgetRange}, pero ${item.doubt}. Vorrei capire se la cifra e normale e quali domande fare prima di confermare.`,
      categorySlug: item.categorySlug,
      eventType: item.eventType,
      city: item.city,
      region: item.region,
      peopleCount: item.peopleCount,
      budgetRange: item.budgetRange,
      displayName,
      statusLabel: "Prezzo in verifica",
      answers: [],
      usefulVotes: 14 + (index * 7) % 29,
      notUsefulVotes: 1 + (index % 6)
    };
    return [
      {
        ...base,
        answers: [
          firstAnswerForCost(base),
          secondAnswerForCost(base),
          `Chiedi cosa succede se cambiano orario o numero finale. Molti preventivi sembrano puliti, poi si muovono su extra dopo mezzanotte, trasporto o personale.`
        ]
      },
      {
        ...base,
        title: titles[1],
        content: `Sto confrontando due opzioni per ${item.eventType.toLowerCase()} con ${item.peopleCount} persone a ${item.city}. Questo preventivo include ${item.detail}, ma ${item.doubt}. Mi serve capire se manca qualcosa di importante.`,
        displayName: index % 2 === 0 ? "Marta" : "preventivo_senza_panico",
        statusLabel: "Preventivo confrontato",
        usefulVotes: 18 + (index * 5) % 31,
        notUsefulVotes: 2 + (index % 5),
        answers: [
          `Io lo confronterei con un preventivo identico per orario e servizi. Se cambi una sola voce, il prezzo piu basso spesso e solo quello con piu cose lasciate fuori.`,
          `Fatti scrivere massimo orario incluso, numero persone presenti dello staff e cosa resta a consumo. Sono tre domande secche e di solito fanno uscire subito le differenze.`,
          `Se il fornitore risponde bene e separa le voci, non partirei dallo sconto. Prima renderei il preventivo leggibile, poi deciderei cosa togliere.`
        ]
      }
    ];
  });

  const eventQuestions = eventCostSeeds.flatMap((item, index): CostQuestionSeed[] => {
    const titles = eventTitlePairs[index] ?? [
      `${item.eventType} a ${item.city}: come leggere il budget senza farsi prendere dall'ansia`,
      `${item.eventType} per ${item.peopleCount} persone: le righe da chiarire prima di scegliere`
    ];
    const base: CostQuestionSeed = {
      title: titles[0],
      content: `Sto provando a fare un budget realistico. Vorrei includere ${item.detail}. Il range che sto immaginando e ${item.budgetRange}, ma ${item.doubt}.`,
      categorySlug: item.categorySlug,
      eventType: item.eventType,
      city: item.city,
      region: item.region,
      peopleCount: item.peopleCount,
      budgetRange: item.budgetRange,
      displayName: index % 2 === 0 ? "Giulia" : "organizzo_da_zero",
      statusLabel: "Budget da costruire",
      answers: [],
      usefulVotes: 20 + (index * 6) % 27,
      notUsefulVotes: 1 + (index % 7)
    };
    return [
      {
        ...base,
        answers: [
          `Io farei tre colonne: indispensabile, bello da avere, eliminabile. Con ${item.peopleCount} persone il budget non si controlla tagliando a caso, ma capendo cosa pesa davvero.`,
          `Il range puo avere senso, ma dipende da orari, stagione e livello di servizio. Chiedi sempre almeno una versione "base completa" e una "consigliata".`,
          `Non bloccherei nulla prima di avere location, catering e musica con lo stesso numero di ore. Sono le tre voci che spostano di piu il conto.`
        ]
      },
      {
        ...base,
        title: titles[1],
        content: `Siamo nella fase iniziale e non voglio illudermi con un budget troppo basso. Per ora considero ${item.detail}, pero ${item.doubt}. Quali costi dimenticano quasi tutti?`,
        displayName: index % 2 === 0 ? "budget_reale" : "Sara",
        statusLabel: "Budget aggiornato",
        usefulVotes: 17 + (index * 8) % 33,
        notUsefulVotes: 2 + (index % 4),
        answers: [
          `I costi dimenticati sono quasi sempre pulizie, extra orari, trasporto, tecnico audio, materiali, IVA e pasti staff. Sembrano dettagli finche non arrivano tutti insieme.`,
          `Metterei un margine del 10-15% senza dirlo subito ai fornitori. Ti serve per non arrivare all'ultima settimana con ogni decisione che diventa un problema.`,
          `Chiedi preventivi comparabili. Stessa data indicativa, stessi invitati, stessi orari e stessa zona: altrimenti non stai confrontando prezzi, stai confrontando ipotesi.`
        ]
      }
    ];
  });

  return [...serviceQuestions, ...eventQuestions];
}

async function ensureCostQuestions() {
  const categories = new Map<string, string>();

  for (const category of CATEGORIES) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description
      }
    });
    categories.set(category.slug, saved.id);
  }

  for (const seed of makeCostQuestionSeeds()) {
    const categoryId = categories.get(seed.categorySlug) ?? categories.get("quanto-costa");
    if (!categoryId) continue;

    const slug = slugify(seed.title);
    const createdAt = new Date(Date.now() - (hash(slug) % 90) * 24 * 60 * 60 * 1000);
    const existing = await prisma.question.findUnique({
      where: { slug },
      include: { answers: { where: { status: "published" } } }
    });

    if (!existing) {
      await prisma.question.create({
        data: {
          title: seed.title,
          slug,
          content: seed.content,
          categoryId,
          postType: "Quanto costa",
          eventType: seed.eventType,
          city: seed.city,
          region: seed.region,
          peopleCount: seed.peopleCount,
          budgetRange: seed.budgetRange,
          eventDate: null,
          displayMode: seed.displayName.includes("_") ? "nickname" : "real_name",
          displayName: seed.displayName,
          privateEmail: null,
          usefulVotes: seed.usefulVotes,
          notUsefulVotes: seed.notUsefulVotes,
          answersCount: seed.answers.length,
          status: "published",
          createdAt,
          updatedAt: createdAt,
          answers: {
            create: seed.answers.map((content, index) => {
              const voice = voices[(hash(`${slug}:${content}`) + index) % voices.length];
              return {
                content,
                displayMode: content.startsWith("Io ") ? voice.displayMode : "nickname",
                displayName: content.startsWith("Io ") ? voice.displayName : "fornitori_no_panico",
                privateEmail: null,
                usefulVotes: 5 + ((hash(`${slug}:${content}:useful`) + index) % 18),
                notUsefulVotes: (hash(`${slug}:${content}:not`) + index) % 5,
                isBestAnswer: index === 0,
                status: "published",
                createdAt: new Date(createdAt.getTime() + (index + 1) * 9 * 60 * 60 * 1000),
                updatedAt: new Date(createdAt.getTime() + (index + 1) * 9 * 60 * 60 * 1000)
              };
            })
          }
        }
      });
      continue;
    }

    if (existing.answers.length < 3) {
      const existingContents = new Set(existing.answers.map((answer) => answer.content));
      for (const [index, content] of seed.answers.entries()) {
        if (existingContents.has(content)) continue;
        const voice = voices[(hash(`${slug}:${content}`) + index) % voices.length];
        await prisma.answer.create({
          data: {
            questionId: existing.id,
            content,
            displayMode: voice.displayMode,
            displayName: voice.displayName,
            privateEmail: null,
            usefulVotes: 5 + ((hash(`${slug}:${content}:useful`) + index) % 18),
            notUsefulVotes: (hash(`${slug}:${content}:not`) + index) % 5,
            isBestAnswer: index === 0 && !existing.answers.some((answer) => answer.isBestAnswer),
            status: "published",
            createdAt: new Date(existing.createdAt.getTime() + (index + 1) * 9 * 60 * 60 * 1000),
            updatedAt: new Date(existing.createdAt.getTime() + (index + 1) * 9 * 60 * 60 * 1000)
          }
        });
      }
    }
  }
}

const legacyHumanUpdates = [
  `Aggiornamento dell'autore: ho iniziato a chiedere preventivi con le voci separate. Solo questo ha gia cambiato le risposte: alcuni fornitori sono stati chiarissimi, altri molto vaghi.`,
  `Alla fine ho scelto la soluzione piu semplice: meno extra, contratto scritto bene e una persona di riferimento il giorno dell'evento. Mi sono tolto parecchia ansia.`,
  `Problema risolto: ho chiesto una risposta scritta su orari, penali e cosa succede se cambia il numero degli invitati. Il fornitore serio mi ha risposto subito.`,
  `Preventivo rifiutato: non per il prezzo in se, ma perche non erano chiari IVA, personale e ore extra. Preferisco pagare qualcosa in piu ma sapere cosa sto firmando.`,
  `Evento concluso: la cosa piu utile e stata avere una mini scaletta condivisa con location, catering e musica. Quando qualcuno chiedeva qualcosa, sapevamo tutti dove guardare.`
];

function humanUpdate(question: QuestionForEnrichment) {
  const where = compactLocation(question);
  const people = question.peopleCount ? `${question.peopleCount} invitati` : "gli invitati";
  const budget = question.budgetRange ?? "il budget che avevo in mente";
  const options = [
    `Aggiornamento dell'autore: ho rimandato la stessa richiesta a tre fornitori di ${where}, identica parola per parola. Il piu utile non era il piu economico, era quello che ha risposto punto per punto.`,
    `Alla fine ho scelto una strada piu semplice: meno cose da coordinare e un referente unico il giorno dell'evento. Con ${people} mi sono resa conto che l'organizzazione vale quasi quanto l'effetto wow.`,
    `Problema risolto: ho chiesto per iscritto orari, penali, cosa succede se cambia il numero finale e chi decide sul posto. Da li ho capito subito chi era solido e chi stava improvvisando.`,
    `Preventivo rifiutato: il prezzo poteva anche starci, ma su ${budget} non accetto frasi tipo "poi vediamo". Ho preferito un'offerta meno scenografica e molto piu chiara.`,
    `Evento concluso: la cosa che ci ha salvato e stata una scaletta di una pagina, condivisa con tutti. Non elegante da vedere, ma quando qualcuno chiedeva qualcosa avevamo gia la risposta.`
  ];

  return options[hash(question.slug) % options.length];
}

function legacyAnswerBank(question: QuestionForEnrichment) {
  const where = compactLocation(question);
  const eventType = eventName(question);
  const budget = question.budgetRange ?? "il budget indicato";
  const people = question.peopleCount ? `${question.peopleCount} persone` : "il numero di invitati";

  return [
    `Io partirei da una tabella molto semplice: prezzo finale, cosa include, cosa e escluso, orario di inizio e fine, caparra e penali. Quando metti i preventivi cosi, le differenze saltano fuori subito.`,
    `Chiederei sempre una frase scritta su cosa succede se cambiano gli invitati. Con ${people} basta una variazione piccola per spostare parecchio il conto finale.`,
    `Per ${where} guarderei almeno tre alternative con lo stesso orario e gli stessi servizi. Se cambi una sola variabile, poi confrontare i prezzi diventa impossibile.`,
    `Occhio agli extra "piccoli": pulizie, facchinaggio, ore dopo mezzanotte, tecnico audio, guardaroba, trasporto e IVA. Spesso non sono piccoli quando arrivano tutti insieme.`,
    `Se il budget e ${budget}, io terrei un margine del 10-15% per imprevisti. Non lo direi subito al fornitore, ma mi eviterebbe di arrivare tirato alla fine.`,
    `Una domanda pratica che aiuta molto: "Mi mandi un esempio di evento simile gia fatto?". Da foto e orari capisci se quel fornitore e abituato al tuo tipo di situazione.`,
    `Io mi farei confermare chi sara presente il giorno dell'evento. La persona commerciale spesso non e quella che coordina davvero sala, musica o catering.`,
    `Per un ${eventType} eviterei di scegliere solo in base alla foto piu bella. Guarderei bagni, parcheggio, rumore, piano B, orari e tempi di spostamento degli ospiti.`,
    `Se hai dubbi, manda una mail breve con tre domande secche. Chi risponde in modo ordinato di solito lavora meglio anche il giorno dell'evento.`,
    `Il prezzo puo essere giusto anche se sembra alto, ma deve spiegarsi da solo. Se devi inseguire il fornitore per capire le voci, io lo considererei gia un segnale.`,
    `A me ha aiutato chiedere: "Cosa non e compreso?". E una domanda un po' antipatica, ma fa uscire fuori quasi tutti gli extra prima di firmare.`,
    `Non sottovalutare i tempi. Se aperitivo, cena, torta e musica sono troppo compressi, la serata sembra sempre in ritardo anche quando hai pagato bene.`,
    `Per il catering chiederei numero camerieri, gestione intolleranze, bevande, torta, attrezzature e orario di smontaggio. Sono le voci che cambiano di piu l'esperienza.`,
    `Con la musica parlerei prima di pubblico e momenti: ingresso, cena, taglio torta, ballo o chiusura. Un DJ o una band non devono solo "mettere musica".`,
    `Se c'e una caparra alta, chiedi esattamente se e acconto o caparra confirmatoria e in quali casi si perde. Non firmerei finche questa parte non e chiarissima.`,
    `Io aggiungerei nel contratto una riga su autorizzazioni, SIAE o permessi quando c'e musica. Meglio capirlo prima che scoprirlo la settimana dell'evento.`,
    `Per renderla una discussione utile, scriverei anche cosa ti piace e cosa non vuoi assolutamente. Le risposte diventano piu precise e meno da manuale.`,
    `Se una proposta sembra perfetta ma ti mette fretta, prenditi una notte. Le decisioni sugli eventi costano troppo per farle solo per paura di perdere la data.`,
    `Una cosa concreta: chiedi sempre entro quando devi dare il numero finale. Poi metti una scadenza agli invitati almeno una settimana prima di quella data.`,
    `Secondo me qui la scelta migliore e quella che riduce i punti deboli, non quella piu scenografica. Gli ospiti notano se stanno bene, se mangiano bene e se tutto scorre.`
  ];
}

function previousGeneratedAnswerBank(question: QuestionForEnrichment) {
  const where = compactLocation(question);
  const eventType = eventName(question);
  const budget = question.budgetRange ?? "budget non ancora chiuso";
  const people = question.peopleCount ? `${question.peopleCount} persone` : "gli invitati previsti";
  const categorySlug = question.category.slug;

  const byCategory: Record<string, string[]> = {
    "da-dove-inizio": [
      `Io farei una cosa molto poco romantica ma utile: apri una nota e scrivi data possibile, ${people}, zona ${where}, budget massimo e cosa non vuoi gestire da sola. Tutto il resto viene dopo.`,
      `Quando sei all'inizio il rischio e chiedere preventivi troppo presto. Prima scegli tre paletti: orario, stile e livello di servizio. Senza quelli ogni risposta sembra giusta e ti confonde.`,
      `Non partirei dai fornitori, partirei dagli ospiti. Come arrivano, quanto restano, cosa devono capire subito? Se rispondi a questo, location e menu diventano molto piu facili.`
    ],
    "quanto-costa": [
      `Io chiederei due versioni: una "pulita" dentro ${budget} e una con gli extra consigliati. Cosi vedi subito se il prezzo base e reale o serve solo ad agganciarti.`,
      `Il numero da guardare non e solo il totale: dividilo per ospite e poi aggiungi IVA, ore extra, trasporto e personale. A me quel secondo conto ha cambiato completamente la scelta.`,
      `Se vuoi capire se e caro, manda la stessa richiesta a tre fornitori di ${where}. Non chiedere "quanto costa?", chiedi proprio cosa include, cosa resta fuori e fino a che ora.`
    ],
    location: [
      `Io tornerei a vedere la location nell'orario in cui userai davvero lo spazio. Di giorno sembrano tutte comode; alle 23 capisci rumore, parcheggi, bagni e gestione uscita.`,
      `Chiedi una planimetria con tavoli, buffet, musica e piano B. Se devono spiegartela a voce per mezz'ora, spesso vuol dire che il flusso degli ospiti non e cosi naturale.`,
      `Una location bella ma rigida puo costarti piu stress di una meno fotografabile. Verifica subito fine musica, pulizie, sicurezza, fornitori esterni e chi apre/chiude gli spazi.`
    ],
    "catering-menu": [
      `Per il catering chiederei una prova scritta sulle quantita, non solo sul menu. "Buffet ricco" non significa niente: meglio pezzi a persona, camerieri, bevande e tempi di rifornimento.`,
      `Con ${people}, io guarderei soprattutto servizio e ritmo. Il cibo puo essere buono, ma se tutti fanno coda o il vino arriva tardi la percezione cambia subito.`,
      `Fatti separare menu, personale, noleggi, trasporto, torta e bevande. Quando il catering non separa niente, e impossibile capire dove stai spendendo davvero.`
    ],
    "musica-dj": [
      `Parlerei col DJ di momenti, non solo di canzoni. Ingresso, cena, torta, ballo e chiusura hanno energie diverse; chi sa guidarle ti fa risparmiare parecchi imbarazzi.`,
      `Chiedi cosa succede se il pubblico non balla subito. Sembra una domanda strana, ma un professionista vero ti racconta come legge la sala senza offendersi.`,
      `Nel preventivo musica io voglio vedere impianto, microfono, luci, orari, SIAE, montaggio e costo dopo mezzanotte. Se manca anche solo una voce, prima chiarirei.`
    ],
    matrimoni: [
      `Per un matrimonio io non sceglierei nulla che non abbia un piano B dignitoso. Non "una stanza qualsiasi", proprio una versione alternativa in cui ti riconosci comunque.`,
      `Metti nero su bianco chi decide il giorno stesso: spostamenti, ritardi, pioggia, tempi della cucina. Gli sposi non possono diventare centralino.`,
      `La domanda che farei sempre: "Qual e la cosa che di solito mette in difficolta le coppie qui?". Le risposte oneste valgono piu di dieci foto perfette.`
    ],
    "compleanni-feste-private": [
      `Per una festa privata io proteggerei tre cose: ospiti comodi, bevande gestite bene e un finale chiaro. Il resto puo essere semplice senza sembrare povero.`,
      `Non farei troppe attivita. Meglio un momento forte e poi spazio per parlare. Le feste adulte diventano belle quando non sembrano un programma obbligatorio.`,
      `Con ${people}, valuta chi sparecchia, chi controlla il bar e chi chiude la sala. Sono dettagli noiosi, ma a fine serata fanno la differenza.`
    ],
    "eventi-aziendali": [
      `Per un evento aziendale taglierei tutto quello che sembra riempitivo. Meglio accoglienza fluida, audio che funziona, tempi brevi e un motivo chiaro per restare a parlare.`,
      `Fai una mini regia: chi accoglie, chi introduce, quando si mangia, quando si parla e quando finisce. Senza regia anche una cena bella diventa un'attesa lunga.`,
      `Se ci sono clienti, il menu deve permettere di parlare. Eviterei piatti complicati, musica troppo alta e speech messi quando le persone hanno gia fame.`
    ],
    "problemi-fornitori": [
      `Io scriverei un messaggio calmo ma molto preciso: accordi, data, cosa manca e scadenza per rispondere. Niente accuse, solo fatti e richiesta chiara.`,
      `Se c'e gia una caparra, raccogli tutto in una cartella: preventivo, bonifico, chat, mail e contratto. Ti serve lucidita prima ancora di alzare i toni.`,
      `Il campanello d'allarme non e un ritardo singolo, e quando ogni risposta apre un dubbio nuovo. A quel punto chiederei un riepilogo firmato o valuterei un piano B.`
    ],
    "idee-evento": [
      `L'idea funziona se puoi raccontarla in una frase semplice agli invitati. Se devi spiegarla troppo, probabilmente il format e ancora troppo complicato.`,
      `Io sceglierei un solo dettaglio memorabile e renderei tutto il resto facile: arrivo, cibo, musica, uscita. Le persone ricordano l'atmosfera, non dieci micro-attivita.`,
      `Prima di innamorarti dell'idea, prova a scrivere la timeline minuto per minuto. Se ci sono troppi buchi o troppi spostamenti, va semplificata.`
    ]
  };

  const general = [
    `Nel tuo caso non chiederei uno sconto subito. Chiederei prima una versione piu chiara, poi toglierei una voce alla volta. Cosi capisci cosa pesa davvero.`,
    `Mi farei mandare tutto in una mail unica. Quando le informazioni restano sparse tra telefonate e messaggi, alla fine ognuno ricorda una cosa diversa.`,
    `Prima di firmare, prova a immaginare la giornata nei suoi momenti peggiori: pioggia, ritardo, ospite che non arriva, musica che sfora. Il fornitore giusto ha risposte anche li.`,
    `Una cosa che mi ha aiutato: chiedere "cosa devo decidere io e cosa gestite voi?". Scopri subito se stai comprando un servizio o solo una parte del problema.`,
    `Se hai due opzioni quasi pari, sceglierei quella che ti fa meno inseguire le risposte. Nell'organizzazione di un ${eventType}, la comunicazione e gia mezzo servizio.`
  ];

  return [...(byCategory[categorySlug] ?? []), ...general];
}

function questionText(question: QuestionForEnrichment) {
  return `${question.title} ${question.content} ${question.postType} ${question.eventType ?? ""} ${question.category.name}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function categoryAnswerBank(question: QuestionForEnrichment) {
  const where = compactLocation(question);
  const people = question.peopleCount ? `${question.peopleCount} persone` : "gli invitati";
  const categorySlug = question.category.slug;

  const byCategory: Record<string, string[]> = {
    "da-dove-inizio": [
      `Prima di chiedere altri preventivi, io bloccherei una mini scheda: cosa stai organizzando, quando, zona ${where}, ${people}, budget massimo e due cose che non vuoi assolutamente.`,
      `Qui serve ordine, non ancora perfezione. Se scrivi una richiesta uguale per tutti, capisci subito chi risponde davvero al tuo caso e chi manda solo brochure.`,
      `Dividerei le decisioni in tre blocchi: luogo e data, cibo e servizio, atmosfera. Mischiare tutto insieme e il modo piu rapido per andare in confusione.`
    ],
    "quanto-costa": [
      `Per capire se il prezzo sta in piedi, chiedi sempre cosa resta fuori. Il totale ha senso solo se sai gia IVA, personale, trasporto, orari extra e materiali.`,
      `Io farei una versione "minima ma completa" e una con extra. Se il fornitore non riesce a separarle, il preventivo non e ancora pronto per essere confrontato.`,
      `Il confronto va fatto a parita di orario, numero persone e servizi. Altrimenti il prezzo piu basso spesso e solo quello con piu cose lasciate fuori.`
    ],
    location: [
      `Per la location non guarderei solo foto e prezzo. Guarderei flusso degli ospiti, bagni, parcheggio, orario musica, pulizie e chi e presente fisicamente quella sera.`,
      `Chiedi sempre di vedere il piano B o la sala alternativa allestita. Una stanza vuota racconta pochissimo di come funzionera davvero l'evento.`,
      `Se devi portare fornitori esterni, fatti dire accessi, orari di carico, vincoli cucina e costi di pulizia. Sono dettagli poco belli, ma pesano tanto.`
    ],
    "catering-menu": [
      `Per il catering chiederei numeri, non aggettivi: quanti pezzi a persona, quanti camerieri, bevande incluse, tempi di servizio e cosa succede con intolleranze.`,
      `Con ${people}, il servizio conta quasi quanto il menu. Un piatto semplice servito bene batte spesso un menu scenografico con code e bicchieri vuoti.`,
      `Fatti separare cibo, personale, noleggi, trasporto, torta e bevande. Solo cosi puoi tagliare qualcosa senza rovinare l'esperienza.`
    ],
    "musica-dj": [
      `Per musica e DJ chiederei scaletta dei momenti, non solo playlist: arrivo, cena, torta, ballo, chiusura. Ogni fase ha energia e volume diversi.`,
      `Nel preventivo devono esserci impianto, microfono, luci, montaggio, orario fine, eventuali ore extra e SIAE se c'entra. Le parole "tutto incluso" non mi bastano.`,
      `Chiedi cosa succede se la pista parte lenta. Un professionista vero sa spiegarti come cambia musica senza forzare gli ospiti.`
    ],
    matrimoni: [
      `Per un matrimonio io chiederei sempre chi coordina il giorno stesso. Sposi, testimoni e genitori non possono diventare assistenza clienti durante l'evento.`,
      `Ogni scelta dovrebbe avere una versione B dignitosa: pioggia, ritardi, invitati in piu, caldo, musica che deve abbassarsi. Se il piano B non ti piace, non e un piano.`,
      `Fatti raccontare un matrimonio simile gia fatto nella stessa stagione. Capisci molto da come parlano di tempi, ospiti, fornitori e problemi risolti.`
    ],
    "compleanni-feste-private": [
      `Per una festa privata salverei tre cose: ospiti comodi, bevande gestite bene e finale senza caos. Le decorazioni arrivano dopo.`,
      `Se il budget non e enorme, scegli un solo elemento memorabile e tieni semplice il resto. Troppe idee insieme fanno sembrare tutto meno curato.`,
      `Chiedi chi gestisce riordino, bar, torta e chiusura. Nelle feste private il problema spesso non e iniziare bene, ma finire senza stress.`
    ],
    "eventi-aziendali": [
      `Per un evento aziendale io partirei dall'obiettivo: relazione, vendita, formazione o team. Se non e chiaro quello, location e menu diventano solo estetica.`,
      `Serve una scaletta asciutta: accoglienza, intervento breve, cibo, networking e chiusura. Ogni minuto in piu deve avere un motivo.`,
      `Audio, check-in e tempi sono piu importanti dell'effetto wow. Se gli ospiti aspettano o non sentono bene, il resto perde valore.`
    ],
    "problemi-fornitori": [
      `Risponderei con tono calmo ma preciso: accordi presi, cosa manca, entro quando serve una risposta e quale sara il prossimo passo. Niente frasi vaghe.`,
      `Metti insieme contratto, preventivo, pagamenti e messaggi. Prima di decidere se insistere o cambiare fornitore serve una fotografia ordinata dei fatti.`,
      `Se ogni chiarimento apre un dubbio nuovo, io chiederei un riepilogo unico firmato o scritto via mail. La confusione non deve restare a voce.`
    ],
    "idee-evento": [
      `L'idea funziona se puoi spiegarla agli invitati in una frase. Se servono troppe istruzioni, probabilmente il format va semplificato.`,
      `Prima di innamorarti dell'effetto, scrivi la timeline reale. Arrivo, cibo, momento centrale, musica, uscita: se scorre li, allora l'idea regge.`,
      `Io sceglierei un dettaglio forte e lo renderei facile da vivere. Gli ospiti ricordano un momento chiaro, non dieci micro-attivita scollegate.`
    ]
  };

  return byCategory[categorySlug] ?? [];
}

function topicAnswerBank(question: QuestionForEnrichment) {
  const text = questionText(question);
  const people = question.peopleCount ? `${question.peopleCount} persone` : "il numero di ospiti";
  const budget = question.budgetRange ?? "il budget indicato";
  const answers: string[] = [];

  if (hasAny(text, ["fior", "bouquet", "bottoniera", "arco", "allestiment", "centrotavola", "fleurs", "flores", "florist"])) {
    answers.push(
      `Qui non confronterei solo il tipo di fiore. Chiedi stagionalita, quantita, struttura, trasporto, montaggio e smontaggio: spesso il prezzo sale piu per il lavoro che per i fiori.`,
      `Se il budget e limitato, io metterei forza su bouquet e tavoli, poi riuserei i fiori della cerimonia dove possibile. L'arco e bellissimo, ma puo mangiarsi mezzo preventivo.`,
      `Fatti mandare foto di composizioni con misure simili, non solo moodboard. "Romantico e pieno" puo voler dire cose molto diverse tra cliente e fiorista.`,
      `Chiedi cosa succede ai fiori dopo l'evento: smontaggio, recupero vasi, eventuale riuso e orario di ritiro. Sono voci piccole solo finche non arrivano in fattura.`
    );
  }

  if (hasAny(text, ["dj", "musica", "band", "playlist", "siae", "microfono", "audio", "music", "musique", "banda"])) {
    answers.push(
      `Per la musica la risposta deve partire dai momenti: accoglienza, cena, torta, ballo e chiusura. Un DJ o una band validi ti spiegano cosa fanno in ogni fase.`,
      `Chiedi dotazione precisa: impianto, sub, microfono, luci, consolle, cavi, montaggio e persona di backup. "Porto tutto io" e troppo poco per decidere.`,
      `Se c'e SIAE, non lasciarla in una frase laterale. Chiedi chi compila cosa, entro quando e con quali dati: evento privato, numero invitati e musica registrata o live.`,
      `Una cosa utile e chiedere tre esempi di scaletta: pubblico giovane, pubblico misto, cena elegante. Capisci subito se ragionano sul tuo evento o su una playlist standard.`
    );
  }

  if (hasAny(text, ["catering", "menu", "buffet", "cena", "torta", "intolleranze", "traiteur", "comida", "aperitivo"])) {
    answers.push(
      `Per il catering chiedi quantita e servizio: pezzi a persona, numero camerieri, tempi di uscita, bevande, intolleranze e chi gestisce torta o dolce.`,
      `Buffet non vuol dire automaticamente risparmio. Con ${people} devi guardare code, punti di servizio, tavoli d'appoggio e personale che rifornisce.`,
      `Nel preventivo separerei cibo, bevande, personale, noleggi, trasporto e IVA. Se e tutto in una riga, non puoi capire dove intervenire.`,
      `Chiedi cosa succede se cambiano gli invitati. Il catering vive di numeri finali: data limite, tolleranza e menu bambini vanno scritti prima.`
    );
  }

  if (hasAny(text, ["open bar", "drink", "cocktail", "bartender", "bar", "bevande"])) {
    answers.push(
      `Per l'open bar serve una lista secca: durata, drink inclusi, numero bartender, ghiaccio, bicchieri, alcolici premium o base e cosa succede quando finisce il pacchetto.`,
      `Io metterei sempre un tetto massimo scritto. A consumo puo andare bene solo se sai quando il servizio si ferma o passa a pagamento individuale.`,
      `Chiedi se il bar ha una postazione vera o viene improvvisato. La differenza si vede subito quando arrivano trenta persone insieme a chiedere da bere.`
    );
  }

  if (hasAny(text, ["location", "villa", "ristorante", "sala", "agriturismo", "giardino", "terrazza", "parcheggio", "piove", "pioggia", "venue", "lieu", "finca"])) {
    answers.push(
      `Per la location chiedi il percorso reale degli ospiti: arrivo, guardaroba, aperitivo, cena, bagni, musica, uscita. Se il flusso e scomodo, la bellezza non basta.`,
      `Il piano B va visto allestito, non raccontato. Deve contenere tavoli, buffet, musica, passaggi del personale e un punto dignitoso per torta o momento centrale.`,
      `Parcheggio, limiti orari, rumore, pulizie e fornitori esterni sono parte del prezzo. Io li chiederei prima ancora di parlare di decorazioni.`
    );
  }

  if (hasAny(text, ["fotograf", "foto", "video", "videomaker", "gallery", "photographer", "photographe", "fotografo"])) {
    answers.push(
      `Per foto e video non guarderei solo lo stile. Chiedi ore reali, momenti coperti, consegna, numero minimo di immagini, backup file e uso delle foto dopo l'evento.`,
      `Scrivi i momenti che ti dispiacerebbe perdere. Se sono pochi e chiari, magari non serve giornata intera; se ci sono spostamenti, le ore salgono subito.`,
      `Se il fornitore arriva da fuori, hotel, pasti, transfer e orari di viaggio vanno messi nello stesso preventivo. Le spese vive non devono restare aperte.`
    );
  }

  if (hasAny(text, ["caparra", "acconto", "fornitore", "non risponde", "ritardo", "disdetta", "contratto", "penal", "deposit", "supplier", "prestataire", "proveedor"])) {
    answers.push(
      `Qui starei sui fatti: cosa avete concordato, cosa e stato pagato, cosa manca e entro quando serve risposta. Piu il messaggio e pulito, piu e difficile ignorarlo.`,
      `Caparra e acconto non sono la stessa cosa. Prima di versare o discutere, chiedi come viene chiamato nel contratto e in quali casi si perde.`,
      `Se il fornitore comunica male gia adesso, considera un piano B. Non significa accusare nessuno, significa proteggere data, soldi e serenita.`
    );
  }

  if (hasAny(text, ["aziendale", "clienti", "team building", "convention", "networking", "corporate", "empresa", "entreprise", "seminaire"])) {
    answers.push(
      `Per un evento aziendale la risposta giusta parte dall'obiettivo: clienti da far parlare, team da coinvolgere o contenuto da comunicare. Il format cambia completamente.`,
      `Check-in, audio e tempi sono cruciali. Se ingresso e microfoni non funzionano, anche una location bella sembra poco professionale.`,
      `Lascia spazio vero al networking. Pause da dieci minuti sembrano efficienti, ma spesso servono solo a fare coda al caffe.`
    );
  }

  if (hasAny(text, ["bambini", "animazione", "animatori", "menu bambini", "children", "kids"])) {
    answers.push(
      `Con i bambini chiedi fasce d'eta, numero animatori, materiali, responsabilita e durata reale dell'attivita. "Animazione inclusa" puo voler dire quasi nulla.`,
      `Per il menu bambini io chiederei servizio piu rapido e porzioni semplici. Il problema non e solo cosa mangiano, ma quanto aspettano.`,
      `Se ci sono bambini piccoli, serve uno spazio visibile ma non in mezzo al passaggio dei camerieri. Altrimenti diventa caos per tutti.`
    );
  }

  if (hasAny(text, ["invitati", "rsvp", "confermano", "conferme", "guest", "invites", "invites"])) {
    answers.push(
      `Per le conferme io metterei una scadenza tua prima di quella del catering. Se il fornitore vuole il numero a dieci giorni, tu devi chiudere almeno una settimana prima.`,
      `Chiedi una tolleranza scritta sui coperti. Anche tre o cinque persone possono spostare il conto se menu, sedute e personale sono gia bloccati.`
    );
  }

  if (hasAny(text, ["preventivo", "quanto costa", "prezzo", "budget", "costo", "quote", "cost", "devis", "presupuesto"])) {
    answers.push(
      `Sul preventivo io evidenzierei tre colori: incluso, escluso, poco chiaro. Le domande da fare nascono quasi tutte dalla terza colonna.`,
      `Il prezzo e utile solo se racconta una scena reale: quante persone, per quante ore, con che personale, in quale zona e con quali extra gia inclusi.`,
      `Se due preventivi sembrano lontani, chiedi a entrambi una versione comparabile. Stesso orario, stessi ospiti, stesso livello di servizio.`
    );
  }

  if (hasAny(text, ["idea", "idee", "diverso", "originale", "format", "esperienza", "noiosa", "imbarazzanti"])) {
    answers.push(
      `L'idea migliore e quella che gli ospiti capiscono senza istruzioni. Se devi spiegare troppo, semplifica il format prima di cercare fornitori.`,
      `Io farei una prova su carta: arrivo, primo momento, cibo, momento centrale, uscita. Se la timeline sembra naturale, l'idea e gia piu solida.`,
      `Originale non deve voler dire complicato. Spesso basta cambiare ritmo, spazio o modo di far parlare le persone.`
    );
  }

  return answers;
}

function answerBank(question: QuestionForEnrichment) {
  const eventType = eventName(question);
  const topicAnswers = topicAnswerBank(question);
  const categoryAnswers = categoryAnswerBank(question);
  const universalAnswers = [
    `Mi farei mandare tutto in una mail unica. Quando informazioni e promesse restano sparse tra telefonate e messaggi, alla fine ognuno ricorda una cosa diversa.`,
    `Chiedi sempre cosa gestisce il fornitore e cosa resta a te. A volte il problema non e il prezzo, ma scoprire troppo tardi che devi coordinare pezzi separati.`,
    `Prima di firmare, immagina il momento piu fragile dell'evento: ritardo, pioggia, ospite in piu, musica da abbassare. La risposta del fornitore li dice molto.`,
    `Se hai due opzioni simili, sceglierei quella che risponde in modo piu chiaro. Nell'organizzazione di un ${eventType}, la comunicazione e gia mezzo servizio.`
  ];

  return [...topicAnswers, ...categoryAnswers, ...universalAnswers];
}

function pickFreshAnswer(question: QuestionForEnrichment, seed: string, usedContents: Set<string>) {
  const candidates = [humanUpdate(question), ...answerBank(question)];
  let cursor = hash(`${question.slug}:${seed}`);

  for (let attempts = 0; attempts < candidates.length * 3; attempts += 1) {
    const content = candidates[(cursor + attempts) % candidates.length];
    if (!usedContents.has(content)) return content;
  }

  return `${candidates[cursor % candidates.length]} Nel tuo caso lo scriverei proprio nella richiesta, cosi chi risponde parte dal problema reale e non da un preventivo standard.`;
}

async function loadQuestions() {
  return prisma.question.findMany({
    where: { status: "published" },
    orderBy: [{ usefulVotes: "desc" }, { createdAt: "asc" }],
    include: {
      category: true,
      answers: {
        where: { status: "published" },
        orderBy: { createdAt: "asc" }
      }
    }
  });
}

async function main() {
  await ensureCostQuestions();
  const questions = await loadQuestions();

  for (const [index, question] of questions.entries()) {
    const target = targetAnswers(question, index);
    const legacyContents = new Set([...legacyHumanUpdates, ...legacyAnswerBank(question), ...previousGeneratedAnswerBank(question)]);
    const existingContents = new Set(question.answers.map((answer) => answer.content));

    for (const [answerIndex, answer] of question.answers.entries()) {
      if (!legacyContents.has(answer.content)) continue;

      existingContents.delete(answer.content);
      const replacement = pickFreshAnswer(question, `${answer.id}:${answerIndex}`, existingContents);
      existingContents.add(replacement);

      await prisma.answer.update({
        where: { id: answer.id },
        data: {
          content: replacement,
          displayMode: replacement.startsWith("Aggiornamento") ? question.displayMode : answer.displayMode,
          displayName: replacement.startsWith("Aggiornamento") ? question.displayName : answer.displayName
        }
      });

      answer.content = replacement;
    }

    const createdContents: string[] = [];
    const candidates = [humanUpdate(question), ...answerBank(question)];
    let cursor = hash(question.slug);

    while (question.answers.length + createdContents.length < target && cursor < candidates.length + hash(question.slug) + 60) {
      const content = candidates[cursor % candidates.length];
      cursor += 1;

      if (existingContents.has(content) || createdContents.includes(content)) continue;

      const voice = voices[(cursor + index) % voices.length];
      const createdAt = new Date(Date.now() - (index + createdContents.length + 3) * 36 * 60 * 60 * 1000);

      await prisma.answer.create({
        data: {
          questionId: question.id,
          content,
          displayMode: content.includes("dell'autore") ? question.displayMode : voice.displayMode,
          displayName: content.includes("dell'autore") ? question.displayName : voice.displayName,
          privateEmail: null,
          usefulVotes: 2 + ((hash(`${question.slug}:${content}:${index}`) + createdContents.length * 7) % 23),
          notUsefulVotes: (hash(`${question.slug}:${content}:not:${index}`) + createdContents.length) % 5,
          isBestAnswer: false,
          status: "published",
          createdAt,
          updatedAt: createdAt
        }
      });

      createdContents.push(content);
    }

    const answers = await prisma.answer.findMany({
      where: { questionId: question.id, status: "published" },
      select: { id: true, usefulVotes: true, notUsefulVotes: true, isBestAnswer: true },
      orderBy: [{ usefulVotes: "desc" }, { createdAt: "asc" }]
    });

    for (const [answerIndex, answer] of answers.entries()) {
      const usefulVotes = 2 + ((hash(`${question.slug}:${answer.id}:${answerIndex}`) + index * 5) % 24);
      const notUsefulVotes = (hash(`${question.slug}:${answer.id}:not:${answerIndex}`) + index) % 5;
      if (answer.usefulVotes !== usefulVotes || answer.notUsefulVotes !== notUsefulVotes) {
        await prisma.answer.update({
          where: { id: answer.id },
          data: { usefulVotes, notUsefulVotes }
        });
      }
    }

    if (answers.length && !answers.some((answer) => answer.isBestAnswer)) {
      await prisma.answer.update({
        where: { id: answers[0].id },
        data: { isBestAnswer: true }
      });
    }

    await prisma.question.update({
      where: { id: question.id },
      data: {
        answersCount: answers.length,
        usefulVotes: Math.max(question.usefulVotes, 6 + ((hash(question.slug) + answers.length * 5 + index * 3) % 31)),
        notUsefulVotes: 1 + ((hash(`${question.slug}:question:not`) + index) % 9)
      }
    });
  }

  console.log(`Community enrichment completato su ${questions.length} conversazioni.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
