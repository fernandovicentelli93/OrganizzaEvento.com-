export type MagazineStep = {
  title: string;
  description: string;
  categorySlug: string;
};

export type MagazineArea = {
  name: string;
  slug: string;
  eyebrow: string;
  description: string;
  image: string;
  eventTypes: string[];
  accent: string;
  steps: MagazineStep[];
};

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1700&q=78";

export const HOME_STORY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=76",
    alt: "Allestimento elegante per un matrimonio"
  },
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=76",
    alt: "Festa privata con palloncini e tavola colorata"
  },
  {
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=76",
    alt: "Sala preparata per un evento aziendale"
  }
] as const;

export const MAGAZINE_AREAS: MagazineArea[] = [
  {
    name: "Matrimonio",
    slug: "matrimonio",
    eyebrow: "Per chi si sposa",
    description:
      "Budget, location, invitati, menù, musica e mille decisioni che sembrano piccole finché non ci sei dentro.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1100&q=76",
    eventTypes: ["Matrimonio"],
    accent: "rose",
    steps: [
      {
        title: "Da dove inizio a organizzare il matrimonio?",
        description: "Le prime scelte da mettere in fila quando sembra tutto urgente.",
        categorySlug: "da-dove-inizio"
      },
      {
        title: "Budget reale e margine imprevisti",
        description: "Come dividere il budget tra location, cibo, musica, foto e dettagli.",
        categorySlug: "quanto-costa"
      },
      {
        title: "Location, capienza e piano pioggia",
        description: "Cosa chiedere prima di bloccare una villa, un ristorante o un agriturismo.",
        categorySlug: "location"
      },
      {
        title: "Catering, menù e degustazione",
        description: "Buffet, cena servita, intolleranze, torta e numero finale invitati.",
        categorySlug: "catering-menu"
      },
      {
        title: "Musica, DJ, band e SIAE",
        description: "Come scegliere l'intrattenimento e capire cosa è incluso.",
        categorySlug: "musica-dj"
      },
      {
        title: "Foto, video e ricordi",
        description: "Preventivi, consegne, stile del servizio e dettagli da mettere per iscritto.",
        categorySlug: "quanto-costa"
      },
      {
        title: "Invitati, conferme e tavoli",
        description: "RSVP tardivi, bambini, menù speciali e gestione delle aspettative.",
        categorySlug: "problemi-fornitori"
      },
      {
        title: "Contratti, caparre e fornitori",
        description: "Dubbi su penali, acconti, cancellazioni e promesse non scritte.",
        categorySlug: "problemi-fornitori"
      },
      {
        title: "Timeline dell'ultima settimana",
        description: "Cosa controllare prima del giorno dell'evento, senza arrivare sfiniti.",
        categorySlug: "da-dove-inizio"
      },
      {
        title: "Dettagli che rendono tutto più personale",
        description: "Idee semplici per rendere la festa riconoscibile senza gonfiare il budget.",
        categorySlug: "idee-evento"
      }
    ]
  },
  {
    name: "Compleanni e feste private",
    slug: "compleanni-feste-private",
    eyebrow: "Feste private",
    description:
      "Compleanni, diciottesimi, lauree e anniversari: idee belle, costi da tenere d'occhio e problemi molto normali.",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1100&q=76",
    eventTypes: ["Compleanno", "Diciottesimo", "Laurea", "Cena privata", "Festa privata", "Anniversario"],
    accent: "peach",
    steps: [
      {
        title: "Che tipo di festa voglio davvero?",
        description: "Cena, aperitivo, festa ballata, esperienza o qualcosa di più intimo.",
        categorySlug: "da-dove-inizio"
      },
      {
        title: "Budget basso, medio o elegante",
        description: "Dove spendere e dove tagliare senza far sembrare la festa improvvisata.",
        categorySlug: "quanto-costa"
      },
      {
        title: "Casa, sala privata o locale?",
        description: "Pro e contro di ogni scelta, dalla logistica al rumore dopo mezzanotte.",
        categorySlug: "location"
      },
      {
        title: "Buffet, torta e open bar",
        description: "Quantita, bevande, servizio e formule per non rimanere senza cibo.",
        categorySlug: "catering-menu"
      },
      {
        title: "Musica giusta per età diverse",
        description: "Playlist, DJ, animazione e momenti in cui alzare davvero l'energia.",
        categorySlug: "musica-dj"
      },
      {
        title: "Inviti e conferme senza rincorrere tutti",
        description: "Come chiedere RSVP, gestire ritardi e bloccare i numeri con il locale.",
        categorySlug: "problemi-fornitori"
      },
      {
        title: "Idee per una festa non banale",
        description: "Degustazioni, mini esperienze, giochi leggeri e idee da adattare al tuo gruppo.",
        categorySlug: "idee-evento"
      },
      {
        title: "Diciottesimo: cosa serve davvero",
        description: "Sicurezza, orari, musica, alcolici, genitori e responsabilità.",
        categorySlug: "compleanni-feste-private"
      },
      {
        title: "Laurea: festa bella con budget controllato",
        description: "Aperitivi, foto, parenti e amici senza duplicare i costi.",
        categorySlug: "compleanni-feste-private"
      },
      {
        title: "Fornitori che spariscono o cambiano prezzo",
        description: "Come muoversi quando un accordo non torna o una risposta non arriva.",
        categorySlug: "problemi-fornitori"
      }
    ]
  },
  {
    name: "Eventi aziendali",
    slug: "eventi-aziendali",
    eyebrow: "Lavoro, ma non freddo",
    description:
      "Cene aziendali, meeting e team building dove contano tempi, ospiti, budget e dettagli che si notano.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1100&q=76",
    eventTypes: ["Evento aziendale", "Team building"],
    accent: "sage",
    steps: [
      {
        title: "Obiettivo dell'evento prima della location",
        description: "Clienti, team, celebrazione o formazione: prima chiarisci perché lo fai.",
        categorySlug: "da-dove-inizio"
      },
      {
        title: "Budget aziendale senza sorprese",
        description: "Costi per persona, extra tecnici, IVA, trasporti e margine imprevisti.",
        categorySlug: "quanto-costa"
      },
      {
        title: "Location cómoda e coerente col brand",
        description: "Sale, ristoranti, hotel, spazi industriali e check di accessibilita.",
        categorySlug: "location"
      },
      {
        title: "Cena aziendale non noiosa",
        description: "Format, tempi dei discorsi, menù e piccoli momenti che funzionano.",
        categorySlug: "eventi-aziendali"
      },
      {
        title: "Team building leggero",
        description: "Attività inclusive che non mettono in imbarazzo chi partecipa.",
        categorySlug: "eventi-aziendali"
      },
      {
        title: "Audio, luci e presentazioni",
        description: "Microfoni, schermi, tecnico, prove e piano se qualcosa non parte.",
        categorySlug: "musica-dj"
      },
      {
        title: "Catering, pause e intolleranze",
        description: "Coffee break, pranzo, aperitivo e gestione di richieste speciali.",
        categorySlug: "catering-menu"
      },
      {
        title: "Inviti, reminder e presenze",
        description: "Come far confermare le persone e non sbagliare numeri finali.",
        categorySlug: "da-dove-inizio"
      },
      {
        title: "Foto, video e contenuti per dopo",
        description: "Cosa chiedere al fotografo se servono social, stampa o newsletter.",
        categorySlug: "quanto-costa"
      },
      {
        title: "Fornitori e responsabilità",
        description: "Contratti, assicurazioni, permessi e referenti il giorno dell'evento.",
        categorySlug: "problemi-fornitori"
      }
    ]
  },
  {
    name: "Idee evento",
    slug: "idee-evento",
    eyebrow: "Quando vuoi qualcosa di diverso",
    description:
      "Spunti da trasformare in qualcosa di realizzabile, senza perdere il controllo di costi e organizzazione.",
    image: "https://images.unsplash.com/photo-1524777313293-86d2ab467344?auto=format&fit=crop&w=1100&q=76",
    eventTypes: ["Altro", "Festa privata", "Anniversario", "Team building"],
    accent: "plum",
    steps: [
      {
        title: "Esperienze al posto della solita cena",
        description: "Degustazioni, laboratori, tour, cooking class e format interattivi.",
        categorySlug: "idee-evento"
      },
      {
        title: "Eventi piccoli ma curati",
        description: "Come creare atmosfera anche con pochi invitati e budget ragionevole.",
        categorySlug: "idee-evento"
      },
      {
        title: "Tema, palette e tono della festa",
        description: "Un filo estetico senza trasformare tutto in una scenografia costosa.",
        categorySlug: "idee-evento"
      },
      {
        title: "Musica e intrattenimento alternativi",
        description: "Duo acustici, quiz, karaoke elegante, animazione soft e momenti sorpresa.",
        categorySlug: "musica-dj"
      },
      {
        title: "Menu memorabile senza sprechi",
        description: "Isole food, tavoli condivisi, menù regionali e alternative al buffet classico.",
        categorySlug: "catering-menu"
      },
      {
        title: "Location insolite",
        description: "Musei, serre, terrazze, showroom, cortili, agriturismi e spazi ibridi.",
        categorySlug: "location"
      },
      {
        title: "Budget creativo",
        description: "Dove investire per far sembrare tutto più ricco senza moltiplicare i fornitori.",
        categorySlug: "quanto-costa"
      },
      {
        title: "Momenti foto e ricordi",
        description: "Angoli belli, guestbook, Polaroid, video messaggi e dettagli personali.",
        categorySlug: "idee-evento"
      },
      {
        title: "Evento all'aperto",
        description: "Piano B, luci, bagni, audio, insetti, freddo, caldo e vicini.",
        categorySlug: "location"
      },
      {
        title: "Cosa evitare",
        description: "Idee troppo complicate, costi nascosti e format che funzionano solo sulla carta.",
        categorySlug: "problemi-fornitori"
      }
    ]
  }
];

export function getMagazineArea(slug: string) {
  return MAGAZINE_AREAS.find((area) => area.slug === slug);
}

export function uniqueStepCategories(area: MagazineArea) {
  return Array.from(new Set(area.steps.map((step) => step.categorySlug)));
}
