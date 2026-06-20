import { localizedStaticPath, type Locale } from "@/lib/i18n-basic";

type TranslationLocale = Exclude<Locale, "it">;

export type LocalizedConversationAnswer = {
  author: string;
  role: string;
  content: string;
  usefulVotes: number;
  notUsefulVotes?: number;
  isBestAnswer?: boolean;
};

export type LocalizedConversation = {
  title: string;
  author: string;
  badge: string;
  categorySlug?: string;
  city: string;
  eventType: string;
  budget: string;
  excerpt: string;
  answerPreview: string;
  replies: number;
  usefulVotes: number;
  notUsefulVotes?: number;
  viewsToday: number;
  status: string;
  image: string;
};

export type LocalizedMagazineArticle = {
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  readTime: string;
  image: string;
};

export type LocalizedGuideHighlight = {
  title: string;
  label: string;
  excerpt: string;
  hrefKey: "eventGuides" | "localSuppliers" | "realPrices" | "analyzeQuote" | "findSuppliers" | "ask";
};

export type LocalizedClientPath = {
  title: string;
  text: string;
  action: string;
  hrefKey: "questions" | "ask" | "realPrices" | "analyzeQuote" | "findSuppliers";
};

export type LocalizedCommunityBundle = {
  conversationsTitle: string;
  conversationsIntro: string;
  conversationsCta: string;
  liveLabel: string;
  clientPathTitle: string;
  clientPathIntro: string;
  magazineIntroTitle: string;
  magazineIntro: string;
  guidesIntroTitle: string;
  guidesIntro: string;
  ticker: string[];
  conversations: LocalizedConversation[];
  articles: LocalizedMagazineArticle[];
  guides: LocalizedGuideHighlight[];
  clientPaths: LocalizedClientPath[];
};

const weddingTable =
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=76";
const privateParty =
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=76";
const corporateRoom =
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=76";
const cateringTable =
  "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=76";
const musicLights =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=76";
const lakeEvent =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=76";
const floralInstall =
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=76";
const poolVenue =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=76";
const guestTransfer =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=76";
const chefTable =
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=76";
const workshopTable =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=76";
const seasideToast =
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=76";

function stableSmallHash(value: string) {
  return value.split("").reduce((total, char, index) => total + char.charCodeAt(0) * (index + 3), 17);
}

export const localizedCommunity: Record<Exclude<Locale, "it">, LocalizedCommunityBundle> = {
  en: {
    conversationsTitle: "Open conversations from people planning in Italy",
    conversationsIntro:
      "Realistic questions, clear budgets and practical answers: read a similar case before opening yours.",
    conversationsCta: "Read all conversations",
    liveLabel: "Live from the community",
    clientPathTitle: "Start from the problem, not from a blank form",
    clientPathIntro:
      "Choose the route that matches your doubt. You can read first, ask later and use the platform without mandatory registration.",
    magazineIntroTitle: "Magazine stories that still lead back to the community",
    magazineIntro:
      "Editorial articles give context; conversations turn that context into decisions for your venue, budget and suppliers.",
    guidesIntroTitle: "Guides for international clients planning in Italy",
    guidesIntro:
      "Use the guides to prepare better questions before contacting venues, caterers, musicians or planners.",
    ticker: [
      "Maya is comparing two Florence venues",
      "Nico received 4 answers on an open bar quote",
      "Priya saved a corporate dinner checklist",
      "Emma updated her Tuscany wedding thread",
      "A supplier clarified music overtime costs"
    ],
    conversations: [
      {
        title: "Tuscany villa asks 50% deposit: is that normal?",
        author: "Emma R.",
        badge: "Real name",
        city: "Siena, Tuscany",
        eventType: "Wedding",
        budget: "EUR 28,000",
        excerpt:
          "We are planning from London and the venue wants half of the rental fee now. The place is beautiful, but the cancellation paragraph feels vague.",
        answerPreview:
          "Sofia wrote back from her own Tuscany wedding: she would not argue on the amount first, but would ask for the exact legal wording, rain-room photos and a second payment after tasting.",
        replies: 9,
        usefulVotes: 31,
        viewsToday: 27,
        status: "Quote under review",
        image: weddingTable
      },
      {
        title: "Rooftop dinner in Rome for a 40th birthday: worth the extra cost?",
        author: "lucas_travels",
        badge: "Nickname",
        city: "Rome, Lazio",
        eventType: "Private birthday",
        budget: "EUR 4,500",
        excerpt:
          "The rooftop is twice the price of a private trattoria room. Guests are flying in for one weekend, so I want it to feel special without wasting money.",
        answerPreview:
          "Lucas got a very practical answer: if the view is shared, drinks end early and rain moves everyone inside, the trattoria may actually feel more generous.",
        replies: 7,
        usefulVotes: 24,
        viewsToday: 18,
        status: "Decision pending",
        image: privateParty
      },
      {
        title: "Milan client dinner: AV package doubled the venue quote",
        author: "Priya",
        badge: "Real name",
        city: "Milan, Lombardy",
        eventType: "Corporate event",
        budget: "EUR 12,000",
        excerpt:
          "We need microphones, a screen and a short product talk before dinner. The venue's technical package looks more expensive than the food.",
        answerPreview:
          "Marco, who runs sales dinners, told Priya to ask the venue for rehearsal minutes, technician end time, projector brightness and the fee for bringing an outside AV team.",
        replies: 12,
        usefulVotes: 38,
        viewsToday: 33,
        status: "Problem solved",
        image: corporateRoom
      },
      {
        title: "Welcome aperitivo on the Amalfi Coast: what should be included?",
        author: "Megan",
        badge: "Real name",
        city: "Amalfi Coast, Campania",
        eventType: "Wedding weekend",
        budget: "EUR 85 per guest",
        excerpt:
          "The caterer says the price includes finger food and two drinks, but the line about staff and transport is not clear.",
        answerPreview:
          "Megan updated the thread after asking for pieces per guest: the real extra was not the food, it was staff after 10 pm plus glassware return.",
        replies: 8,
        usefulVotes: 29,
        viewsToday: 21,
        status: "More details requested",
        image: cateringTable
      },
      {
        title: "DJ for Lake Como ceremony and party: one supplier or two?",
        author: "Theo",
        badge: "Real name",
        city: "Lake Como, Lombardy",
        eventType: "Wedding",
        budget: "EUR 1,900",
        excerpt:
          "The DJ can cover ceremony audio, aperitivo and dancing. Another quote separates ceremony musicians and party DJ.",
        answerPreview:
          "Theo was told to walk the route with the DJ: ceremony corner, aperitivo terrace and dance room needed three sound moments, not one generic music service.",
        replies: 10,
        usefulVotes: 35,
        viewsToday: 30,
        status: "Author update added",
        image: musicLights
      },
      {
        title: "Florist replies very slowly: should we keep looking?",
        author: "Claire",
        badge: "Real name",
        city: "Venice, Veneto",
        eventType: "Elopement",
        budget: "EUR 1,200",
        excerpt:
          "The style is exactly right, but every answer takes a week. We only need bouquet, boutonniere and one small table setup.",
        answerPreview:
          "Claire sent one gentle but firm recap with delivery hour, bouquet size and payment date. People suggested keeping a second florist warm, without drama.",
        replies: 6,
        usefulVotes: 20,
        viewsToday: 14,
        status: "Supplier follow-up",
        image: lakeEvent
      }
    ],
    articles: [
      {
        title: "How to compare Italian venue quotes without losing the atmosphere",
        slug: "compare-italian-venue-quotes",
        category: "Costs and venues",
        author: "OrganizzaEvento editors",
        excerpt:
          "A practical way to read rental fees, catering minimums, service hours, weather plans and hidden extras before you fall in love with a place.",
        readTime: "7 min",
        image: weddingTable
      },
      {
        title: "A wedding weekend in Italy: what foreign guests need to know",
        slug: "italy-wedding-weekend-guests",
        category: "Weddings",
        author: "Laura M.",
        excerpt:
          "Transfers, welcome drinks, dress code, timing and language details that make the weekend smoother for guests arriving from abroad.",
        readTime: "8 min",
        image: lakeEvent
      },
      {
        title: "Corporate dinners in Italy that do not feel like another meeting",
        slug: "corporate-dinners-italy",
        category: "Corporate events",
        author: "Marta Bellini",
        excerpt:
          "How to balance brand, food, speeches and networking without turning the evening into a long agenda with plates.",
        readTime: "6 min",
        image: corporateRoom
      },
      {
        title: "Private birthdays in Rome, Florence and Milan: where money disappears",
        slug: "private-birthday-italy-costs",
        category: "Private parties",
        author: "Event desk",
        excerpt:
          "The small items that change the final bill: room rental, beverage packages, cake service, security, music timing and late-night transport.",
        readTime: "6 min",
        image: privateParty
      }
    ],
    guides: [
      {
        title: "Planning from abroad",
        label: "First decisions",
        excerpt: "Clarify city, guest count, payment steps and who speaks with suppliers before comparing prices.",
        hrefKey: "eventGuides"
      },
      {
        title: "Read a quote line by line",
        label: "Budget",
        excerpt: "Separate included services, staff, travel, overtime, VAT and cancellation rules.",
        hrefKey: "analyzeQuote"
      },
      {
        title: "Find local suppliers",
        label: "Suppliers",
        excerpt: "Prepare one clear request instead of sending ten vague messages.",
        hrefKey: "findSuppliers"
      },
      {
        title: "Ask the community",
        label: "Forum",
        excerpt: "Use a real case, city and budget so answers can be concrete.",
        hrefKey: "ask"
      }
    ],
    clientPaths: [
      {
        title: "Read a similar case",
        text: "Start with people who already had your same doubt.",
        action: "Browse conversations",
        hrefKey: "questions"
      },
      {
        title: "Check if the price makes sense",
        text: "Use community examples before accepting a quote.",
        action: "Compare prices",
        hrefKey: "realPrices"
      },
      {
        title: "Analyze a quote",
        text: "Turn a confusing supplier proposal into questions to ask.",
        action: "Analyze quote",
        hrefKey: "analyzeQuote"
      },
      {
        title: "Find suppliers",
        text: "Send a clear request when you need help finding local options.",
        action: "Request suppliers",
        hrefKey: "findSuppliers"
      }
    ]
  },
  es: {
    conversationsTitle: "Conversaciones abiertas por personas que organizan eventos en Italia",
    conversationsIntro:
      "Preguntas concretas, presupuestos claros y respuestas útiles para decidir sin empezar desde cero.",
    conversationsCta: "Ver conversaciones",
    liveLabel: "Ahora en la comunidad",
    clientPathTitle: "Empieza por el problema, no por un formulario vacio",
    clientPathIntro:
      "Lee un caso parecido, compara cuánto cuesta y abre tu pregunta solo cuando necesites una respuesta concreta.",
    magazineIntroTitle: "Revista editorial conectada con la comunidad",
    magazineIntro:
      "Los artículos dan contexto; las conversaciones ayudan a decidir con ciudad, presupuesto y proveedores reales.",
    guidesIntroTitle: "Guías para clientes hispanohablantes que organizan en Italia",
    guidesIntro:
      "Prepara mejores preguntas antes de contactar con fincas, catering, música, fotografos o wedding planners.",
    ticker: [
      "Lucia compara dos villas cerca de Roma",
      "Andres recibió respuestas sobre open bar",
      "Una empresa revisa un presupuesto en Milan",
      "Sofia actualizo su hilo de boda en Toscana",
      "Un proveedor explico los costes de horas extra"
    ],
    conversations: [
      {
        title: "Boda en Roma: el catering cobra aparte el montaje, es normal?",
        author: "Lucia M.",
        badge: "Nombre real",
        city: "Roma, Lazio",
        eventType: "Boda",
        budget: "EUR 18.000",
        excerpt:
          "Vivimos en Madrid y el presupuesto del catering parece razonable, pero luego aparecen montaje, traslado, camareros extra y cristalería.",
        answerPreview:
          "Carmen le contesto como si estuviera revisando el PDF de catering en la mesa: una columna para comida, otra para personal, otra para material y una línea separada para desmontaje.",
        replies: 11,
        usefulVotes: 34,
        viewsToday: 26,
        status: "Presupuesto revisado",
        image: cateringTable
      },
      {
        title: "Cumpleaños de 30 en Milan: local bonito o cena pequeña?",
        author: "andre_mx",
        badge: "Nickname",
        city: "Milan, Lombardía",
        eventType: "Fiesta privada",
        budget: "EUR 3.200",
        excerpt:
          "Somos 32 personas. El local tiene música y barra, pero la cena en una sala privada parece más fácil de controlar.",
        answerPreview:
          "André cambió de idea al calcular taxi, música y coste por invitado: el local era más bonito, pero la sala privada permitía hablar y terminar sin prisas.",
        replies: 8,
        usefulVotes: 27,
        viewsToday: 19,
        status: "Decision pendiente",
        image: privateParty
      },
      {
        title: "Evento de empresa en Florencia: cómo evitar que parezca una reunión larga?",
        author: "Paula",
        badge: "Nombre real",
        city: "Florencia, Toscana",
        eventType: "Evento corporativo",
        budget: "EUR 9.000",
        excerpt:
          "Tenemos una presentacion breve y luego cena. No queremos discursos eternos ni una actividad que incomode al equipo.",
        answerPreview:
          "Paula recibió una propuesta muy concreta: bienvenida de siete minutos, mesas mezcladas por proyecto y una dinamica corta que nadie tuviera que 'actuar'.",
        replies: 12,
        usefulVotes: 39,
        viewsToday: 32,
        status: "Problema resuelto",
        image: corporateRoom
      },
      {
        title: "DJ en Nápoles para fiesta privada: el precio incluye sonido?",
        author: "Sofia",
        badge: "Nombre real",
        city: "Nápoles, Campania",
        eventType: "Cumpleaños",
        budget: "EUR 750",
        excerpt:
          "El DJ dice que trae equipo básico, pero no sé si sirve para una sala con 70 personas y una pequeña terraza.",
        answerPreview:
          "Un DJ de la comunidad le pidió que no aceptara 'equipo básico' como respuesta: potencia, micrófono, luces y terraza tenían que aparecer por escrito.",
        replies: 7,
        usefulVotes: 22,
        viewsToday: 16,
        status: "Faltan datos técnicos",
        image: musicLights
      },
      {
        title: "Lago de Como: planner completo o coordinación solo el día del evento?",
        author: "Marta y Leo",
        badge: "Nombre real",
        city: "Lago de Como, Lombardía",
        eventType: "Boda",
        budget: "EUR 4.000 servicio planner",
        excerpt:
          "Ya tenemos venue y fotografo. No sabemos si pagar planificacion completa o solo coordinación final.",
        answerPreview:
          "Marta hizo una lista con venue, fotografo, pagos e idioma. Al verla, varios usuarios le dijeron que necesitaba coordinación fuerte, no planificacion completa.",
        replies: 9,
        usefulVotes: 30,
        viewsToday: 24,
        status: "Coordinacion definida",
        image: lakeEvent
      },
      {
        title: "Fotografo en Venecia: medio día basta para una boda pequeña?",
        author: "Daniela",
        badge: "Nombre real",
        city: "Venecia, Veneto",
        eventType: "Boda intima",
        budget: "EUR 1.600",
        excerpt:
          "Somos 18 personas. Queremos ceremonia, paseo y cena, pero no necesitamos cobertura hasta tarde.",
        answerPreview:
          "Daniela recibió un consejo muy humano: escribir los cinco momentos que le doleria no tener fotografíados, y pagar horas solo alrededor de esos momentos.",
        replies: 6,
        usefulVotes: 21,
        viewsToday: 13,
        status: "Presupuesto aceptado",
        image: weddingTable
      }
    ],
    articles: [
      {
        title: "Organizar una boda en Italia desde España: lo que conviene cerrar primero",
        slug: "boda-italia-desde-espana",
        category: "Bodas",
        author: "Redaccion OrganizzaEvento",
        excerpt:
          "Lugar, idioma, pagos, traslados y calendario: las decisiones que evitan correos interminables con proveedores.",
        readTime: "7 min",
        image: weddingTable
      },
      {
        title: "Cómo leer un presupuesto de catering italiano sin perderse en las partidas",
        slug: "leer-presupuesto-catering-italia",
        category: "Costes reales",
        author: "Elena Ruiz",
        excerpt:
          "Personal, bebidas, menaje, transporte, horarios e IVA: una guia simple para comparar propuestas parecidas.",
        readTime: "6 min",
        image: cateringTable
      },
      {
        title: "Fiestas privadas en Roma y Milan: ideas bonitas que no se disparan",
        slug: "fiestas-privadas-roma-milan",
        category: "Fiestas privadas",
        author: "Mesa editorial",
        excerpt:
          "Aperitivos, cenas privadas, rooftops y formatos cortos para grupos que quieren recordar la noche sin perder el control del presupuesto.",
        readTime: "5 min",
        image: privateParty
      },
      {
        title: "Eventos de empresa en Italia: detalles que los invitados notan de verdad",
        slug: "eventos-empresa-italia-detalles",
        category: "Eventos corporativos",
        author: "Marta Bellini",
        excerpt:
        "Audio, ritmo, comida, tiempos muertos y conversaciones: la diferencia entre una cena correcta y una experiencia útil.",
        readTime: "6 min",
        image: corporateRoom
      }
    ],
    guides: [
      {
        title: "Organizar desde otro país",
        label: "Primeros pasos",
        excerpt: "Define ciudad, número de invitados, pagos y quien habla con proveedores.",
        hrefKey: "eventGuides"
      },
      {
        title: "Revisar un presupuesto",
        label: "Costes",
        excerpt: "Separa lo incluido, los extras, el personal, el transporte y las penalizaciones.",
        hrefKey: "analyzeQuote"
      },
      {
        title: "Pedir proveedores",
        label: "Ayuda practica",
        excerpt: "Cuenta que necesitas con ciudad, fecha, presupuesto y tipo de evento.",
        hrefKey: "findSuppliers"
      },
      {
        title: "Abrir una pregunta",
        label: "Comunidad",
        excerpt: "Publica tu caso sin datos privados para recibir respuestas concretas.",
        hrefKey: "ask"
      }
    ],
    clientPaths: [
      {
        title: "Lee un caso parecido",
        text: "Ahorra tiempo mirando dudas que otros ya publicaron.",
        action: "Ver conversaciones",
        hrefKey: "questions"
      },
      {
        title: "Compara cuánto cuesta",
        text: "Entiende si una cifra es normal antes de aceptar.",
        action: "Ver precios",
        hrefKey: "realPrices"
      },
      {
        title: "Analiza tu presupuesto",
        text: "Transforma un documento confuso en preguntas claras.",
        action: "Analizar",
        hrefKey: "analyzeQuote"
      },
      {
        title: "Busca proveedores",
        text: "Cuando quieras ayuda directa, envia una solicitud clara.",
        action: "Pedir ayuda",
        hrefKey: "findSuppliers"
      }
    ]
  },
  fr: {
    conversationsTitle: "Discussions ouvertes par des personnes qui organisent en Italie",
    conversationsIntro:
      "Des cas concrets, des budgets lisibles et des réponses utiles avant de confirmer un lieu ou un prestataire.",
    conversationsCta: "Lire les discussions",
    liveLabel: "En direct de la communauté",
    clientPathTitle: "Partez du problème, pas d'une page blanche",
    clientPathIntro:
      "Lisez un cas proche, comparez les montants et posez votre question quand vous avez besoin d'un avis concret.",
    magazineIntroTitle: "Un magazine editorial qui revient toujours au terrain",
    magazineIntro:
      "Les articles donnent le contexte; les discussions aident a trancher avec ville, budget et contraintes réelles.",
    guidesIntroTitle: "Guides pour les clients francophones qui organisent en Italie",
    guidesIntro:
      "Preparez vos questions avant de contacter lieux, traiteurs, musiciens, photographes ou wedding planners.",
    ticker: [
      "Camille compare deux lieux en Toscane",
      "Nadia a recu des avis sur un devis traiteur",
      "Une equipe prepare un seminaire a Milan",
      "Thomás a ajoute une mise à jour sur son DJ",
      "Un prestataire a explique les frais de déplacement"
    ],
    conversations: [
      {
        title: "Mariage en Toscane: le lieu impose un minimum traiteur élevé",
        author: "Camille",
        badge: "Nom réel",
        city: "Val d'Orcia, Toscane",
        eventType: "Mariage",
        budget: "EUR 32 000",
        excerpt:
          "Le lieu est magnifique, mais le minimum traiteur depasse notre estimation. Nous ne savons pas si c'est negocieable.",
        answerPreview:
          "Camille a compris que le minimum du lieu n'etait pas seulement le traiteur: boissons, enfants et brunch etaient melanges. La discussion lui a donne une demande plus nette.",
        replies: 10,
        usefulVotes: 36,
        viewsToday: 28,
        status: "Devis a clarifier",
        image: weddingTable
      },
      {
        title: "Anniversaire à Rome: terrasse ou salle privée plus simple?",
        author: "nadía_paris",
        badge: "Pseudo",
        city: "Rome, Latium",
        eventType: "Anniversaire",
        budget: "EUR 3 800",
        excerpt:
          "Nous serons 38. La terrasse donne envie, mais la salle privée semble plus facile pour la musique et les horaires.",
        answerPreview:
          "Nadia a recu une réponse très directe: si la terrasse límite la musique, ferme tot et depend de la pluie, elle paie surtout une photo, pas une soirée plus confortable.",
        replies: 8,
        usefulVotes: 25,
        viewsToday: 17,
        status: "Choix en cours",
        image: privateParty
      },
      {
        title: "Séminaire à Milan: comment garder un format vivant?",
        author: "Julien",
        badge: "Nom réel",
        city: "Milan, Lombardie",
        eventType: "événement d'entreprise",
        budget: "EUR 14 000",
        excerpt:
          "Nous avons une demi-journée de réunion puis un dîner. J'aimerais éviter l'ambiance conférence fatiguée.",
        answerPreview:
          "Julien a gardé l'idée d'un atelier debout de vingt minutes et a supprimé deux prises de parole. Le dîner a enfin ressemblé à une rencontre, pas à une suite de slides.",
        replies: 13,
        usefulVotes: 42,
        viewsToday: 34,
        status: "Problème résolu",
        image: corporateRoom
      },
      {
        title: "Traiteur à Naples: le prix apéritif inclut-il assez à manger?",
        author: "Sophie L.",
        badge: "Nom réel",
        city: "Naples, Campanie",
        eventType: "Fête privée",
        budget: "EUR 55 par invité",
        excerpt:
          "Le devis parle d'apéritif renforcé, mais je ne comprends pas le nombre de pièces ni le service inclus.",
        answerPreview:
          "Sophie a demandé le nombre de pièces par personne et le traiteur a baissé le flou tout de suite: moins de phrases jolies, plus de quantités.",
        replies: 7,
        usefulVotes: 23,
        viewsToday: 15,
        status: "Question au traiteur",
        image: cateringTable
      },
      {
        title: "DJ au lac de Come: frais de déplacement trop vagues",
        author: "Thomás",
        badge: "Nom réel",
        city: "Lac de Come, Lombardie",
        eventType: "Mariage",
        budget: "EUR 1 700",
        excerpt:
          "Le DJ convient pour le style, mais son devis ajoute transport et hôtel sans montant clair.",
        answerPreview:
          "Thomas a reçu une formule simple pour le DJ: 'Je peux valider si transport, hotel et heures après minuit sont chiffrés maintenant, même en plafond maximum.'",
        replies: 9,
        usefulVotes: 31,
        viewsToday: 22,
        status: "Mise a jour auteur",
        image: musicLights
      },
      {
        title: "Photographe à Venise: forfait court ou journée complète?",
        author: "Claire et Hugo",
        badge: "Nom réel",
        city: "Venise, Venetie",
        eventType: "Mariage intime",
        budget: "EUR 2 100",
        excerpt:
          "Nous sommes 24. Le forfait journée complète semble beaucoup, mais nous avons peur de rater les moments importants.",
        answerPreview:
          "Claire et Hugo ont liste les photos indispensables: mairie, bateau, portraits des parents et dîner. La discussion leur a evite de payér trois heures faibles.",
        replies: 6,
        usefulVotes: 19,
        viewsToday: 12,
        status: "Decision presque prise",
        image: lakeEvent
      }
    ],
    articles: [
      {
        title: "Organiser un mariage en Italie depuis la France: les décisions à prendre tôt",
        slug: "mariage-italie-depuis-france",
        category: "Mariages",
        author: "Redaction OrganizzaEvento",
        excerpt:
          "Lieu, calendrier, langue, paiements et transports: les points a fixer avant de demander vingt devis.",
        readTime: "7 min",
        image: weddingTable
      },
      {
        title: "Lire un devis traiteur italien sans se perdre dans les lignes",
        slug: "lire-devis-traiteur-italie",
        category: "Coûts réels",
        author: "Elise Martin",
        excerpt:
          "Personnel, boissons, vaisselle, transport, horaires et TVA: comment comparer deux propositions qui semblent proches.",
        readTime: "6 min",
        image: cateringTable
      },
      {
        title: "Anniversaires privés à Rome, Milan ou Florence: les postes qui gonflent vite",
        slug: "anniversaires-prives-italie-coûts",
        category: "Fêtes privées",
        author: "Bureau editorial",
        excerpt:
          "Salle, boissons, musique, gâteau, sécurité et retour des invités: les détails à clarifier avant de confirmer.",
        readTime: "5 min",
        image: privateParty
      },
      {
        title: "Événements d'entreprise en Italie: créer du lien sans forcer l'ambiance",
        slug: "événements-entreprise-italie",
        category: "Entreprise",
        author: "Marta Bellini",
        excerpt:
          "Rythme, acoustique, dîner, prises de parole et networking: ce qui transforme une soirée correcte en moment utile.",
        readTime: "6 min",
        image: corporateRoom
      }
    ],
    guides: [
      {
        title: "Organiser à distance",
        label: "Depart",
        excerpt: "Ville, nombre d'invités, paiements et interlocuteur local: clarifiez avant les devis.",
        hrefKey: "eventGuides"
      },
      {
        title: "Analyser un devis",
        label: "Budget",
        excerpt: "Distinguez inclus, extras, personnel, transport, TVA et conditions d'annulation.",
        hrefKey: "analyzeQuote"
      },
      {
        title: "Trouver des prestataires",
        label: "Aide",
        excerpt: "Envoyez une demande precise avec ville, date, budget et type d'événement.",
        hrefKey: "findSuppliers"
      },
      {
        title: "Demander à la communauté",
        label: "Forum",
        excerpt: "Publiez votre cas sans données privées pour recevoir des avis utiles.",
        hrefKey: "ask"
      }
    ],
    clientPaths: [
      {
        title: "Lire un cas proche",
        text: "Commencez par les doutes déjà poses par d'autres personnes.",
        action: "Voir les discussions",
        hrefKey: "questions"
      },
      {
        title: "Comprendre combien ça coûte",
        text: "Comprenez si un montant est cohérent avant de confirmer.",
        action: "Voir les prix",
        hrefKey: "realPrices"
      },
      {
        title: "Analyser un devis",
        text: "Transformez une proposition floue en questions concretes.",
        action: "Analyser",
        hrefKey: "analyzeQuote"
      },
      {
        title: "Chercher des prestataires",
        text: "Demandez de l'aide quand vous voulez des options locales.",
        action: "Demander",
        hrefKey: "findSuppliers"
      }
    ]
  }
};

const extraConversations: Record<TranslationLocale, LocalizedConversation[]> = {
  en: [
    {
      title: "Where do we even start for a small wedding in Puglia?",
      author: "Anna & Rob",
      badge: "Real names",
      categorySlug: "da-dove-inizio",
      city: "Ostuni, Apulia",
      eventType: "Wedding",
      budget: "EUR 22,000",
      excerpt:
        "We have a guest list and a month in mind, but no venue yet. Every planner asks for decisions we have not made.",
      answerPreview:
        "Anna came back saying the breakthrough was boring but real: guest count, ceremony style and transport first, then only three venue emails, all with the same dates.",
      replies: 14,
      usefulVotes: 47,
      viewsToday: 31,
      status: "First steps",
      image: lakeEvent
    },
    {
      title: "Venue near Florence adds security and cleaning after midnight",
      author: "hannah_notes",
      badge: "Nickname",
      categorySlug: "location",
      city: "Florence, Tuscany",
      eventType: "Wedding",
      budget: "EUR 6,400 venue",
      excerpt:
        "The base rental looked fair, but the final PDF adds night security, cleaning and a furniture reset fee.",
      answerPreview:
        "Hannah was told to ask one uncomfortable venue question: what disappears if music stops at 11:30à That single reply exposed which fees were timing, not rental.",
      replies: 11,
      usefulVotes: 41,
      viewsToday: 26,
      status: "Quote clarified",
      image: weddingTable
    },
    {
      title: "Catering for 45 guests in Rome: buffet sounds cheaper but is it?",
      author: "Daniel",
      badge: "Real name",
      categorySlug: "catering-menu",
      city: "Rome, Lazio",
      eventType: "Family dinner",
      budget: "EUR 72 per guest",
      excerpt:
        "A served dinner is only slightly more expensive than buffet once staff, rentals and drinks are included.",
      answerPreview:
        "Daniel decided after a caterer described the buffet queue with jackets, children and wine glasses in hand. The served dinner suddenly looked less expensive.",
      replies: 13,
      usefulVotes: 44,
      viewsToday: 29,
      status: "Menu compared",
      image: cateringTable
    },
    {
      title: "Band or DJ for a mixed Italian and UK crowd?",
      author: "Maya K.",
      badge: "Real name",
      categorySlug: "musica-dj",
      city: "Lake Garda, Veneto",
      eventType: "Wedding",
      budget: "EUR 2,800",
      excerpt:
        "The band feels special, but we are worried about breaks, song range and keeping everyone dancing after dinner.",
      answerPreview:
        "Maya liked the answer from a musician: pay the band where people actually listen, then let a DJ carry the messy, happy part after dinner.",
      replies: 16,
      usefulVotes: 53,
      viewsToday: 34,
      status: "Author update",
      image: musicLights
    },
    {
      title: "Birthday in a villa: how many staff for 70 people?",
      author: "Oliver",
      badge: "Real name",
      categorySlug: "compleanni-feste-private",
      city: "Lucca, Tuscany",
      eventType: "Private party",
      budget: "EUR 5,200",
      excerpt:
        "The caterer proposes three waiters and one bar person. It feels light for buffet, drinks and cake service.",
      answerPreview:
        "Oliver added one floating waiter after a caterer described the exact villa bottleneck: plates empty, bar busy and cake waiting while everyone looks around.",
      replies: 10,
      usefulVotes: 37,
      viewsToday: 23,
      status: "Staff adjusted",
      image: privateParty
    },
    {
      title: "Client event in Turin: how much time for check-in and welcome drink?",
      author: "Priya S.",
      badge: "Real name",
      categorySlug: "eventi-aziendali",
      city: "Turin, Piedmont",
      eventType: "Corporate event",
      budget: "EUR 18,000",
      excerpt:
        "We have 130 guests, badges and a short keynote. The venue wants dinner to start exactly at 8 pm.",
      answerPreview:
        "Priya copied a tiny venue run sheet from the thread: two badge points, welcome drink already poured and one person allowed to move the keynote by five minutes.",
      replies: 15,
      usefulVotes: 49,
      viewsToday: 32,
      status: "Timeline fixed",
      image: corporateRoom
    },
    {
      title: "Planner stopped replying after deposit: what can we do politely?",
      author: "Sarah",
      badge: "Real name",
      categorySlug: "problemi-fornitori",
      city: "Sorrento, Campania",
      eventType: "Wedding",
      budget: "EUR 3,500 planner fee",
      excerpt:
        "No drama yet, but two emails and one WhatsApp have gone unanswered. We need the supplier shortlist this week.",
      answerPreview:
        "Sarah did not send an angry message. She sent a dated recap, named the missing shortlist and asked for a handover file if the planner could not deliver by Friday.",
      replies: 18,
      usefulVotes: 61,
      viewsToday: 33,
      status: "Supplier issue",
      image: lakeEvent
    },
    {
      title: "Low-key welcome event in Venice that is not another dinner",
      author: "beatrice_london",
      badge: "Nickname",
      categorySlug: "idee-evento",
      city: "Venice, Veneto",
      eventType: "Wedding weekend",
      budget: "EUR 3,000",
      excerpt:
        "Guests arrive at different times. We want something light, local and easy to leave without feeling rude.",
      answerPreview:
        "Beatrice loved the least complicated idea: a two-hour cicchetti stop with one optional boat arrival. People could join late without feeling they ruined anything.",
      replies: 12,
      usefulVotes: 45,
      viewsToday: 27,
      status: "Ideas collected",
      image: lakeEvent
    },
    {
      title: "Photographer quote includes travel but not accommodation",
      author: "Noah",
      badge: "Real name",
      categorySlug: "quanto-costa",
      city: "Taormina, Sicily",
      eventType: "Wedding",
      budget: "EUR 2,900",
      excerpt:
        "The photographer is based in Rome. Travel is included, hotel is not. I do not know what amount is normal.",
      answerPreview:
        "Noah solved the photographer quote by offering a hotel cap instead of an open promise. The thread also reminded him to include meals and airport transfer in the same email.",
      replies: 9,
      usefulVotes: 33,
      viewsToday: 20,
      status: "Cost checked",
      image: weddingTable
    },
    {
      title: "Graduation party in Bologna with a small budget: what matters most?",
      author: "Leo",
      badge: "Real name",
      categorySlug: "da-dove-inizio",
      city: "Bologna, Emilia-Romagna",
      eventType: "Graduation party",
      budget: "EUR 1,200",
      excerpt:
        "We are 28 people. I can spend on either a better room, better food or a small DJ setup, not all three.",
      answerPreview:
        "Leo kept the room and dropped the DJ. A student in Bologna wrote: nobody remembers the brand of the speaker, but everyone remembers being squeezed in a bad room.",
      replies: 8,
      usefulVotes: 28,
      viewsToday: 18,
      status: "Budget focused",
      image: privateParty
    },
    {
      title: "Lake Garda venue quote looks fine until rain backup and cleanup appear",
      author: "Maya and Tom",
      badge: "Real names",
      categorySlug: "location",
      city: "Desenzano del Garda, Lombardy",
      eventType: "Wedding",
      budget: "EUR 7,400",
      excerpt:
        "The terrace is the reason we liked the place, but the PDF adds a rain-room fee, late cleanup and a furniture reset charge after midnight.",
      answerPreview:
        "Maya said the useful reply was simple: ask to see the rainy-day setup physically and ask which fees disappear if the music ends at 11 pm instead of midnight.",
      replies: 11,
      usefulVotes: 38,
      viewsToday: 24,
      status: "Quote under review",
      image: weddingTable
    },
    {
      title: "Turin client dinner needs a separate check-in desk, not just a host",
      author: "Olivia",
      badge: "Real name",
      categorySlug: "eventi-aziendali",
      city: "Turin, Piedmont",
      eventType: "Corporate event",
      budget: "EUR 14,500",
      excerpt:
        "We have 110 guests, name badges and a short product talk. The venue can handle dinner, but the arrival flow still feels improvised.",
      answerPreview:
        "Olivia tightened the brief after one commenter asked how many people could actually arrive in ten minutes. The fix was a separate welcome point and a shorter first speech.",
      replies: 12,
      usefulVotes: 41,
      viewsToday: 29,
      status: "Timeline fixed",
      image: corporateRoom
    }
  ],
  es: [
    {
      title: "Por dónde empezar una boda pequeña en Puglia si vivimos en Valencia?",
      author: "Marta y Alex",
      badge: "Nombre real",
      categorySlug: "da-dove-inizio",
      city: "Ostuni, Puglia",
      eventType: "Boda",
      budget: "EUR 20.000",
      excerpt:
        "Tenemos invitados aproximados y fecha ideal, pero cada proveedor nos pide datos que aún no sabemos decidir.",
      answerPreview:
        "Marta contó después que dejó de pedir 'información general' y envió una sola ficha con invitados, très fechas y transporte. Las respuestas cambiaron por completo.",
      replies: 15,
      usefulVotes: 48,
      viewsToday: 30,
      status: "Primeros pasos",
      image: lakeEvent
    },
    {
      title: "Villa en Florencia: limpieza, seguridad y cierre se pagan aparte?",
      author: "clara_madrid",
      badge: "Nickname",
      categorySlug: "location",
      city: "Florencia, Toscana",
      eventType: "Boda",
      budget: "EUR 6.700 location",
      excerpt:
        "El alquiler parecía claro, pero al final añaden limpieza nocturna, seguridad y recolocación del mobiliario.",
      answerPreview:
        "Clara pidió a la villa una versión terminando música media hora antes. La diferencia no era pequeña: descubrió que casi todo el extra venía del horario.",
      replies: 12,
      usefulVotes: 43,
      viewsToday: 25,
      status: "Location revisada",
      image: weddingTable
    },
    {
      title: "Catering para 60 personas en Roma: buffet o cena servida?",
      author: "Pablo",
      badge: "Nombre real",
      categorySlug: "catering-menu",
      city: "Roma, Lazio",
      eventType: "Cena privada",
      budget: "EUR 78 por persona",
      excerpt:
        "Pensaba que el buffet era más barato, pero con camareros, alquiler y bebidas la diferencia casi desaparece.",
      answerPreview:
        "Pablo se convencio cuando un catering le pregunto quien rellenaba el buffet mientras los invitados brindaban. No era buffet contra cena, era ritmo contra ahorro pequeño.",
      replies: 14,
      usefulVotes: 46,
      viewsToday: 28,
      status: "Menu comparado",
      image: cateringTable
    },
    {
      title: "Música para boda mixta Italia-España: ¿DJ solo se queda corto?",
      author: "Elena R.",
      badge: "Nombre real",
      categorySlug: "musica-dj",
      city: "Lago de Garda, Veneto",
      eventType: "Boda",
      budget: "EUR 2.400",
      excerpt:
        "Queremos algo elegante durante el aperitivo y luego fiesta. La banda nos gusta, pero no sabemos si compensa.",
      answerPreview:
        "Elena guardo una respuesta muy concreta: duo acustico solo donde se escucha, DJ donde la gente ya quiere bailar y SIAE aclarada antes de la firma.",
      replies: 13,
      usefulVotes: 42,
      viewsToday: 27,
      status: "Duda musical cerrada",
      image: musicLights
    },
    {
      title: "40 cumpleaños en una villa: cuantos camareros hacen falta?",
      author: "Javier",
      badge: "Nombre real",
      categorySlug: "compleanni-feste-private",
      city: "Lucca, Toscana",
      eventType: "Fiesta privada",
      budget: "EUR 4.800",
      excerpt:
        "Somos 65 personas. El proveedor propone tres camareros y una persona de barra, pero me parece poco.",
      answerPreview:
        "Javier anadio una persona de apoyo en la villa solo para los momentos criticos. Le dijeron que una hora extra de personal podía salvar toda la sensacion de servicio.",
      replies: 11,
      usefulVotes: 36,
      viewsToday: 22,
      status: "Personal ajustado",
      image: privateParty
    },
    {
      title: "Evento de clientes en Turin: como organizar entrada, badges y aperitivo?",
      author: "Natalia",
      badge: "Nombre real",
      categorySlug: "eventi-aziendali",
      city: "Turin, Piamonte",
      eventType: "Evento corporativo",
      budget: "EUR 16.000",
      excerpt:
        "Tenemos 120 invitados, una charla breve y cena. Me preocupa que la entrada sea lenta y se retrase todo.",
      answerPreview:
        "Natalia uso una idea sencilla: una mesa para apellidos A-L y otra M-Z, bebida ya lista y alguien con permiso para cortar la charla si se alargaba.",
      replies: 16,
      usefulVotes: 51,
      viewsToday: 33,
      status: "Escaleta resuelta",
      image: corporateRoom
    },
    {
      title: "Proveedor no responde después de la señal: como escribir sin pelear?",
      author: "Ana",
      badge: "Nombre real",
      categorySlug: "problemi-fornitori",
      city: "Sorrento, Campania",
      eventType: "Boda",
      budget: "EUR 2.700 servicio",
      excerpt:
        "No quiero acusar a nadie, pero necesito respuestas esta semana. Ya enviamos dos emails y un mensaje.",
      answerPreview:
        "Ana escribio un mensaje sin enfado: fecha, pagos, entregables pendientes y plazo. La comunidad insistio en no mezclar ansiedad con acusaciones.",
      replies: 17,
      usefulVotes: 59,
      viewsToday: 34,
      status: "Problema con proveedor",
      image: lakeEvent
    },
    {
      title: "Welcome drink en Venecia sin hacer otra cena formal",
      author: "Silvia",
      badge: "Nombre real",
      categorySlug: "idee-evento",
      city: "Venecia, Veneto",
      eventType: "Fin de semana de boda",
      budget: "EUR 3.200",
      excerpt:
        "Los invitados llegan a horas distintas. Queremos algo bonito, local y facil para entrar y salir.",
      answerPreview:
        "Silvia eligio un aperitivo corto en patio privado porque no obligaba a nadie a cenar otra vez. El barco quedo como detalle para quien llegaba temprano.",
      replies: 12,
      usefulVotes: 44,
      viewsToday: 26,
      status: "Ideas guardadas",
      image: lakeEvent
    },
    {
      title: "Fotografo de Roma para boda en Sicilia: hotel aparte es normal?",
      author: "Nico",
      badge: "Nickname",
      categorySlug: "quanto-costa",
      city: "Taormina, Sicilia",
      eventType: "Boda",
      budget: "EUR 2.950",
      excerpt:
        "El viaje está incluido, pero el alojamiento no. Quiero poner un límite sin parecer pesado.",
      answerPreview:
        "Nico copió una frase para el fotografo: 'Incluimos hasta X euro de hotel por una noche, si necesitas más lo validamos antes'. Sonaba firme, no antipática.",
      replies: 10,
      usefulVotes: 35,
      viewsToday: 21,
      status: "Coste aclarado",
      image: weddingTable
    },
    {
      title: "Fiesta de graduacion en Bolonia con poco presupuesto",
      author: "Rocio",
      badge: "Nombre real",
      categorySlug: "da-dove-inizio",
      city: "Bolonia, Emilia-Romagna",
      eventType: "Graduacion",
      budget: "EUR 1.100",
      excerpt:
        "Somos 30. No puedo pagar buen local, DJ y comida completa. Necesito priorizar sin que parezca pobre.",
      answerPreview:
        "Rocío decidió gastar en una sala cómoda y preparar la música con una canción de cada amigo. La respuesta más votada decía: sencillo si, improvisado no.",
      replies: 9,
      usefulVotes: 29,
      viewsToday: 18,
      status: "Presupuesto enfocado",
      image: privateParty
    },
    {
      title: "Boda en Lecce: el DJ trae sonido, pero el permiso musical queda sin importe",
      author: "Lucia y Diego",
      badge: "Nombres reales",
      categorySlug: "musica-dj",
      city: "Lecce, Puglia",
      eventType: "Boda",
      budget: "EUR 2.200",
      excerpt:
        "El DJ incluye micro y altavoces, pero en el contrato solo pone que la SIAE la gestiona la pareja.",
      answerPreview:
        "A la conversación le funcionó pedir una línea separada para el permiso, porque así ya no había excusa para dejarlo para el final.",
      replies: 10,
      usefulVotes: 34,
      viewsToday: 21,
      status: "Faltan datos",
      image: musicLights
    },
    {
      title: "Villa en Bolzano: el plan de lluvia pesa más que la sala bonita",
      author: "Sofía",
      badge: "Nombre real",
      categorySlug: "location",
      city: "Bolzano, Trentino-Alto Adige",
      eventType: "Boda",
      budget: "EUR 8.100",
      excerpt:
        "El salón panorámico nos gusta, pero el precio cambia mucho si usamos la sala interior, la limpieza nocturna y el cierre del servicio.",
      answerPreview:
        "Sofía se quedó con una frase útil: 'si el plan B no está montado de verdad, no es un plan B'.",
      replies: 11,
      usefulVotes: 37,
      viewsToday: 23,
      status: "Location revisada",
      image: weddingTable
    }
  ],
  fr: [
    {
      title: "Par où commencer pour un petit mariage dans les Pouilles?",
      author: "Lea et Max",
      badge: "Noms réels",
      categorySlug: "da-dove-inizio",
      city: "Ostuni, Pouilles",
      eventType: "Mariage",
      budget: "EUR 21 000",
      excerpt:
        "Nous avons une idée du nombre d'invités, mais les prestataires demandent déjà des choix très precis.",
      answerPreview:
        "Lea a raconte que tout s'est debloque avec une fiche d'une page: invités, trois dates, type de repas et besoin de navette. Avant, les devis partaient dans tous les sens.",
      replies: 14,
      usefulVotes: 46,
      viewsToday: 30,
      status: "Premiers pas",
      image: lakeEvent
    },
    {
      title: "Villa pres de Florence: nettoyage et sécurité en supplément",
      author: "marie_paris",
      badge: "Pseudo",
      categorySlug: "location",
      city: "Florence, Toscane",
      eventType: "Mariage",
      budget: "EUR 6 500 lieu",
      excerpt:
        "Le tarif de location semblait correct, mais le devis final ajoute sécurité de nuit, nettoyage et remise en place.",
      answerPreview:
        "Marie a demandé le même devis avec une fin musicale plus tot. La discussion lui a montre que le problème n'etait pas la villa, mais la soirée trop tardive.",
      replies: 12,
      usefulVotes: 42,
      viewsToday: 26,
      status: "Lieu clarifie",
      image: weddingTable
    },
    {
      title: "Traiteur pour 55 personnes à Rome: buffet ou dîner servi?",
      author: "Antoine",
      badge: "Nom réel",
      categorySlug: "catering-menu",
      city: "Rome, Latium",
      eventType: "Dîner privé",
      budget: "EUR 76 par invité",
      excerpt:
        "Le buffet paraissait moins cher, mais avec personnel, matériel et boissons la différence devient faible.",
      answerPreview:
        "Antoine a gardé une phrase d'un membre: 'un buffet sans personnel devient vite le travail des invités'. Il a donc comparé service, pas seulement menu.",
      replies: 13,
      usefulVotes: 45,
      viewsToday: 27,
      status: "Menu comparé",
      image: cateringTable
    },
    {
      title: "Musique franco-italienne: groupe ou DJ pour garder l'énergie?",
      author: "Ines",
      badge: "Nom réel",
      categorySlug: "musica-dj",
      city: "Lac de Garde, Vénétie",
      eventType: "Mariage",
      budget: "EUR 2 600",
      excerpt:
        "Nous aimons le groupe pour l'apéritif, mais nous voulons une vraie fête après le dîner.",
      answerPreview:
        "Ines a choisi duo puis DJ après qu'un musicien a expliqué les pauses: le groupe crée l'émotion, le DJ tient la piste quand tout le monde se lâche.",
      replies: 15,
      usefulVotes: 50,
      viewsToday: 32,
      status: "Mise à jour",
      image: musicLights
    },
    {
      title: "Anniversaire dans une villa: combien de personnel pour 68 invités?",
      author: "Bastien",
      badge: "Nom réel",
      categorySlug: "compleanni-feste-private",
      city: "Lucques, Toscane",
      eventType: "Fête privée",
      budget: "EUR 4 900",
      excerpt:
        "Le traiteur propose trois serveurs et une personne au bar. J'ai peur que cela bloque au moment du gâteau.",
      answerPreview:
        "Bastien a ajouté une personne volante dans la villa, pas une équipe entière. Le conseil venait d'un traiteur: le blocage arrive entre bar, gâteau et assiettes vides.",
      replies: 10,
      usefulVotes: 35,
      viewsToday: 22,
      status: "Équipe ajustée",
      image: privateParty
    },
    {
      title: "Événement clients à Turin: entrée, badges et cocktail sans retard",
      author: "Amelie",
      badge: "Nom réel",
      categorySlug: "eventi-aziendali",
      city: "Turin, Piemont",
      eventType: "événement d'entreprise",
      budget: "EUR 17 000",
      excerpt:
        "Nous avons 125 invités et une courte presentation. Le dîner ne peut pas commencer en retard.",
      answerPreview:
        "Amelie a transforme la réponse en conducteur minute par minute: badges alphabetiques, cocktail déjà servi et une personne chargee de fermer l'accueil.",
      replies: 16,
      usefulVotes: 52,
      viewsToday: 33,
      status: "Timing cale",
      image: corporateRoom
    },
    {
      title: "Prestataire silencieux après acompte: quel message envoyer?",
      author: "Nora",
      badge: "Nom réel",
      categorySlug: "problemi-fornitori",
      city: "Sorrente, Campanie",
      eventType: "Mariage",
      budget: "EUR 2 800 prestation",
      excerpt:
        "Je ne veux pas attaquer, mais nous avons besoin des réponses cette semaine. Deux emails restent sans retour.",
      answerPreview:
        "Nora a envoyé un mail très court: ce qui est payé, ce qui manque, la date límite. Les membres lui ont surtout conseillé de rester factuelle.",
      replies: 18,
      usefulVotes: 60,
      viewsToday: 34,
      status: "Problème prestataire",
      image: lakeEvent
    },
    {
      title: "Accueil a Venise: une idée simple qui ne soit pas un autre dîner",
      author: "Clara",
      badge: "Nom réel",
      categorySlug: "idee-evento",
      city: "Venise, Venetie",
      eventType: "Week-end mariage",
      budget: "EUR 3 100",
      excerpt:
        "Les invités arrivent a des horaires differents. Nous cherchons quelque chose de local, court et facile.",
      answerPreview:
        "Clara a retenu une cour privee avec cicchetti, deux heures maximum. La meilleure idée etait justement de laisser les gens sortir sans se justifier.",
      replies: 12,
      usefulVotes: 43,
      viewsToday: 26,
      status: "Idées retenues",
      image: lakeEvent
    },
    {
      title: "Photographe de Rome pour la Sicile: hôtel non inclus",
      author: "Matthieu",
      badge: "Nom réel",
      categorySlug: "quanto-costa",
      city: "Taormine, Sicile",
      eventType: "Mariage",
      budget: "EUR 3 000",
      excerpt:
        "Le déplacement est inclus, mais pas l'hôtel. Je voudrais poser une limite claire avant signature.",
      answerPreview:
        "Matthieu a fixé au photographe un plafond hôtel et une seule nuit. Quelqu'un lui a aussi fait ajouter les repas, détail petit mais rarement gratuit.",
      replies: 9,
      usefulVotes: 34,
      viewsToday: 20,
      status: "Coût vérifié",
      image: weddingTable
    },
    {
      title: "Fête de diplôme à Bologne avec petit budget",
      author: "Emma",
      badge: "Nom réel",
      categorySlug: "da-dove-inizio",
      city: "Bologne, Émilie-Romagne",
      eventType: "Fête de diplôme",
      budget: "EUR 1 150",
      excerpt:
        "Nous sommes 28. Je dois choisir entre meilleur lieu, meilleur repas ou petite installation musique.",
      answerPreview:
        "Emma a gardé le lieu confortable et a fait une playlist musique partagée. Une étudiante lui a écrit: 'on pardonne des chips, pas une salle où personne ne respire'.",
      replies: 8,
      usefulVotes: 28,
      viewsToday: 17,
      status: "Budget recentre",
      image: privateParty
    },
    {
      title: "Mariage à Vérone: qui paie la licence musicale?",
      author: "Camille et Hugo",
      badge: "Noms réels",
      categorySlug: "musica-dj",
      city: "Vérone, Vénétie",
      eventType: "Mariage",
      budget: "EUR 2 500",
      excerpt:
        "Le DJ inclut le son et les lumières, mais la licence musicale reste notée comme 'à la charge du client'.",
      answerPreview:
        "Camille a retenu la réponse la plus utile: demander le montant exact, le responsable du dépôt et une confirmation écrite avant de bloquer la date.",
      replies: 10,
      usefulVotes: 35,
      viewsToday: 22,
      status: "Point à clarifier",
      image: musicLights
    },
    {
      title: "Lieu à Lecce: le devis change dès qu'on vérifie le plan pluie",
      author: "Nora",
      badge: "Nom réel",
      categorySlug: "location",
      city: "Lecce, Pouilles",
      eventType: "Mariage",
      budget: "EUR 7 900",
      excerpt:
        "La terrasse est superbe, mais la salle intérieure, le nettoyage et la remise en place font bouger le total.",
      answerPreview:
        "Nora a demandé à voir la salle intérieure dressée, pas seulement vide. Le devis est devenu beaucoup plus lisible après ça.",
      replies: 12,
      usefulVotes: 39,
      viewsToday: 25,
      status: "Devis à revoir",
      image: weddingTable
    }
  ]
};

const extraArticles: Record<TranslationLocale, LocalizedMagazineArticle[]> = {
  en: [
    {
      title: "What international couples forget when comparing Italian wedding venues",
      slug: "international-couples-italian-venues",
      category: "Weddings",
      author: "Event desk",
      excerpt: "Curfew, transport, rain plans, local taxes and supplier access often matter more than the first rental fee.",
      readTime: "6 min",
      image: weddingTable
    },
    {
      title: "How to ask an Italian caterer for a quote that can actually be compared",
      slug: "ask-italian-caterer-comparable-quote",
      category: "Catering",
      author: "Laura M.",
      excerpt: "A clean request template for menu, drinks, staff, rentals, children, allergies, transport and timing.",
      readTime: "5 min",
      image: cateringTable
    },
    {
      title: "Private parties in Italy: small details that change the whole budget",
      slug: "private-parties-italy-budget-details",
      category: "Private parties",
      author: "OrganizzaEvento editors",
      excerpt: "Music time, cake service, cleaning, security, late transport and minimum spend can quietly move the final number.",
      readTime: "6 min",
      image: privateParty
    }
  ],
  es: [
    {
      title: "Lo que muchas parejas olvidan al comparar villas para boda en Italia",
      slug: "comparar-villas-boda-italia",
      category: "Bodas",
      author: "Redaccion OrganizzaEvento",
      excerpt: "Horario limite, transporte, lluvia, impuestos locales y acceso de proveedores pesan más que el alquiler inicial.",
      readTime: "6 min",
      image: weddingTable
    },
    {
      title: "Como pedir un presupuesto de catering italiano que se pueda comparar",
      slug: "pedir-presupuesto-catering-comparable",
      category: "Catering",
      author: "Elena Ruiz",
      excerpt: "Menu, bebidas, personal, menaje, ninos, intolerancias, transporte y horario en una sola solicitud clara.",
      readTime: "5 min",
      image: cateringTable
    },
    {
      title: "Fiestas privadas en Italia: detalles pequeños que cambian el presupuesto",
      slug: "fiestas-privadas-italia-detalles-presupuesto",
      category: "Fiestas privadas",
      author: "Mesa editorial",
      excerpt: "Musica, tarta, limpieza, seguridad, transporte nocturno y consumos minimos pueden mover mucho el total.",
      readTime: "6 min",
      image: privateParty
    }
  ],
  fr: [
    {
      title: "Ce que les couples oublient en comparant des lieux de mariage en Italie",
      slug: "comparer-lieux-mariage-italie",
      category: "Mariages",
      author: "Redaction OrganizzaEvento",
      excerpt: "Couvre-feu, transport, pluie, taxes locales et acces prestataires comptent autant que le prix de location.",
      readTime: "6 min",
      image: weddingTable
    },
    {
      title: "Comment demander un devis traiteur italien vraiment comparable",
      slug: "demander-devis-traiteur-comparable",
      category: "Traiteur",
      author: "Elise Martin",
      excerpt: "Menu, boissons, personnel, vaisselle, enfants, allergies, transport et horaires dans une demande claire.",
      readTime: "5 min",
      image: cateringTable
    },
    {
      title: "Fêtes privées en Italie: les petits détails qui changent le budget",
      slug: "fêtes-privées-italie-details-budget",
      category: "Fêtes privées",
      author: "Bureau editorial",
      excerpt: "Musique, gâteau, nettoyage, sécurité, retours tardifs et minimum de consommation peuvent modifier le total.",
      readTime: "6 min",
      image: privateParty
    }
  ]
};

type CostConversationSeed = {
  service: string;
  eventType: string;
  city: string;
  budget: string;
  amount: string;
  detail: string;
  concern: string;
  categorySlug?: string;
  image: string;
};

const localizedCostSeeds: Record<TranslationLocale, CostConversationSeed[]> = {
  en: [
    { service: "catering", eventType: "private dinner", city: "Rome, Lazio", budget: "EUR 4,800", amount: "EUR 96 per guest", detail: "buffet, two hot dishes, cake service and four staff members", concern: "drinks and late clearing are written in a separate paragraph", categorySlug: "catering-menu", image: cateringTable },
    { service: "DJ and basic lights", eventType: "18th birthday", city: "Milan, Lombardy", budget: "EUR 900", amount: "EUR 900 for five hours", detail: "console, two speakers, small light kit and wireless microphone", concern: "overtime and music permits are not explained", categorySlug: "musica-dj", image: musicLights },
    { service: "villa rental", eventType: "40th birthday", city: "Florence, Tuscany", budget: "EUR 6,200", amount: "EUR 6,200 venue fee", detail: "garden, indoor hall, basic tables and cleaning until midnight", concern: "security, parking and bad weather setup remain unclear", categorySlug: "location", image: weddingTable },
    { service: "open bar", eventType: "wedding party", city: "Lake Como, Lombardy", budget: "EUR 3,400", amount: "EUR 28 per person", detail: "three-hour cocktail bar, two bartenders, ice and standard spirits", concern: "premium drinks and extensión after midnight are quoted separately", categorySlug: "catering-menu", image: privateParty },
    { service: "photographer", eventType: "symbolic wedding", city: "Taormina, Sicily", budget: "EUR 2,700", amount: "EUR 2,700", detail: "eight hours, online gallery and basic editing", concern: "travel, second shooter and delivery timing are not detailed", categorySlug: "matrimoni", image: lakeEvent },
    { service: "flowers and setup", eventType: "small wedding", city: "Puglia", budget: "EUR 3,900", amount: "EUR 3,900 starting package", detail: "bridal bouquet, ceremony arch, six table pieces and candles", concern: "it says starting from, but not what changes the final total", categorySlug: "matrimoni", image: weddingTable },
    { service: "event planner", eventType: "destination wedding", city: "Siena, Tuscany", budget: "EUR 5,500", amount: "EUR 5,500 planning fee", detail: "supplier search, timeline, venue visits and wedding-day coordination", concern: "the number of supplier meetings is capped", categorySlug: "matrimoni", image: lakeEvent },
    { service: "transfer service", eventType: "corporate retreat", city: "Bologna, Emilia-Romagna", budget: "EUR 2,100", amount: "EUR 2,100", detail: "airport pickup, hotel shuttle and evening return", concern: "waiting time and luggage are not specified", categorySlug: "eventi-aziendali", image: corporateRoom },
    { service: "conference AV", eventType: "client event", city: "Turin, Piedmont", budget: "EUR 3,200", amount: "EUR 3,200", detail: "two screens, microphones, technician and basic recording", concern: "rehearsal time and extra technician hours are missing", categorySlug: "eventi-aziendali", image: corporateRoom },
    { service: "birthday entertainment", eventType: "private party", city: "Naples, Campania", budget: "EUR 1,450", amount: "EUR 1,450", detail: "live performer, short DJ set and two technical staff", concern: "setup space and sound limits are not clear", categorySlug: "compleanni-feste-private", image: privateParty },
    { service: "wedding band", eventType: "wedding reception", city: "Verona, Veneto", budget: "EUR 4,600", amount: "EUR 4,600", detail: "aperitif trio, dinner background music and party set", concern: "breaks, DJ backup and overtime are written too vaguely", categorySlug: "musica-dj", image: musicLights },
    { service: "private chef", eventType: "family celebration", city: "Lucca, Tuscany", budget: "EUR 3,300", amount: "EUR 110 per guest", detail: "chef, assistant, four-course menu and shopping", concern: "table service, wine glasses and kitchen cleaning are separate", categorySlug: "catering-menu", image: cateringTable },
    { service: "music permit", eventType: "wedding reception", city: "Verona, Veneto", budget: "EUR 420-580", amount: "EUR 320-560", detail: "DJ set after dinner, one handheld mic and recorded music until midnight", concern: "the venue says the permit is the couple's job and the amount is not listed", categorySlug: "musica-dj", image: musicLights },
    { service: "venue rental", eventType: "wedding weekend", city: "Desenzano del Garda, Lombardy", budget: "EUR 7,400", amount: "EUR 7,400 venue fee", detail: "lake-view terrace, indoor backup room and basic furniture setup", concern: "cleaning after midnight and furniture reset are listed as extra lines", categorySlug: "location", image: weddingTable },
    { service: "catering", eventType: "family celebration", city: "Parma, Emilia-Romagna", budget: "EUR 6,300", amount: "EUR 105 per guest", detail: "served dinner, kids' menu, vegetarian option and table service", concern: "allergies, cake service and late-night coffee are priced separately", categorySlug: "catering-menu", image: cateringTable }
  ],
  es: [
    { service: "catering", eventType: "cena privada", city: "Roma, Lazio", budget: "4.600 euros", amount: "92 euros por invitado", detail: "buffet, dos platos calientes, servicio de tarta y cuatro camareros", concern: "bebidas y desmontaje tarde aparecen en otra línea", categorySlug: "catering-menu", image: cateringTable },
    { service: "DJ e iluminación básica", eventType: "cumpleaños número 18", city: "Milan, Lombardía", budget: "880 euros", amount: "880 euros por cinco horas", detail: "consola, dos altavoces, luces pequeñas y micrófono", concern: "horas extra y permisos musicales no están claros", categorySlug: "musica-dj", image: musicLights },
    { service: "alquiler de villa", eventType: "40 cumpleaños", city: "Florencia, Toscana", budget: "6.100 euros", amount: "6.100 euros de alquiler", detail: "jardin, sala interior, mesas básicas y limpieza hasta mezzanotte", concern: "seguridad, parking y plan de lluvia quedan abiertos", categorySlug: "location", image: weddingTable },
    { service: "barra libre", eventType: "boda", city: "Lago de Como, Lombardía", budget: "3.300 euros", amount: "27 euros por persona", detail: "très horas de cócteles, dos bartenders, hielo y destilados básicos", concern: "bebidas premium y extensión después de mezzanotte van aparte", categorySlug: "catering-menu", image: privateParty },
    { service: "fotografo", eventType: "boda simbólica", city: "Taormina, Sicilia", budget: "2.650 euros", amount: "2.650 euros", detail: "ocho horas, galería online y edición básica", concern: "viaje, secondo fotografo y tiempos de entrega no están detallados", categorySlug: "matrimoni", image: lakeEvent },
    { service: "flores y montaje", eventType: "boda pequeña", city: "Puglia", budget: "3.800 euros", amount: "paquete desde 3.800 euros", detail: "ramo, arco de ceremonia, seis centros y velas", concern: "pone desde, pero no explica qué mueve el total final", categorySlug: "matrimoni", image: weddingTable },
    { service: "event planner", eventType: "boda destino", city: "Siena, Toscana", budget: "5.400 euros", amount: "5.400 euros de fee", detail: "búsqueda de proveedores, timeline, visitas y coordinación del día", concern: "las reuniones con proveedores tienen límite", categorySlug: "matrimoni", image: lakeEvent },
    { service: "transfers", eventType: "retiro de empresa", city: "Bolonia, Emilia-Romagna", budget: "2.050 euros", amount: "2.050 euros", detail: "aeropuerto, hotel y regreso por la noche", concern: "esperas y equipaje no están especificados", categorySlug: "eventi-aziendali", image: corporateRoom },
    { service: "audio y video", eventType: "evento de clientes", city: "Turin, Piamonte", budget: "3.150 euros", amount: "3.150 euros", detail: "dos pantallas, micrófonos, técnico y grabación básica", concern: "ensayo y horas extra de técnico faltan", categorySlug: "eventi-aziendali", image: corporateRoom },
    { service: "animación", eventType: "fiesta privada", city: "Nápoles, Campania", budget: "1.400 euros", amount: "1.400 euros", detail: "show en vivo, pequeño set DJ y dos técnicos", concern: "espacio de montaje y límites de sonido no son claros", categorySlug: "compleanni-feste-private", image: privateParty },
    { service: "banda de boda", eventType: "recepción de boda", city: "Verona, Veneto", budget: "4.500 euros", amount: "4.500 euros", detail: "trio para aperitivo, música durante cena y set de fiesta", concern: "pausas, DJ de apoyo y horas extra son demasiado vagos", categorySlug: "musica-dj", image: musicLights },
    { service: "chef privado", eventType: "celebración familiar", city: "Lucca, Toscana", budget: "3.250 euros", amount: "108 euros por invitado", detail: "chef, ayudante, menú de cuatro tiempos y compra", concern: "servicio en mesa, copas y limpieza de cocina van aparte", categorySlug: "catering-menu", image: cateringTable },
    { service: "permiso musical", eventType: "boda", city: "Lecce, Puglia", budget: "2.200 euros", amount: "2.200 euros", detail: "DJ set, micrófono inalámbrico y música grabada hasta medianoche", concern: "el permiso aparece como cargo de la pareja y sin importe", categorySlug: "musica-dj", image: musicLights },
    { service: "alquiler de villa", eventType: "boda", city: "Bolzano, Trentino-Alto Adige", budget: "7.900 euros", amount: "7.900 euros de alquiler", detail: "terraza panorámica, sala interior de lluvia y montaje básico", concern: "limpieza nocturna y recolocación del mobiliario van aparte", categorySlug: "location", image: weddingTable },
    { service: "catering corporativo", eventType: "evento de empresa", city: "Trieste, Friuli-Venezia Giulia", budget: "5.800 euros", amount: "72 euros por invitado", detail: "aperitivo, cena sentada, opción vegetariana y servicio de sala", concern: "las intolerancias, el café final y las bebidas premium quedan aparte", categorySlug: "catering-menu", image: cateringTable }
  ],
  fr: [
    { service: "traiteur", eventType: "dîner privé", city: "Rome, Latium", budget: "4 700 euros", amount: "94 euros par invité", detail: "buffet, deux plats chauds, service du gâteau et quatre serveurs", concern: "boissons et rangement tardif sont dans une ligne séparée", categorySlug: "catering-menu", image: cateringTable },
    { service: "DJ et lumiere simple", eventType: "18 ans", city: "Milan, Lombardie", budget: "890 euros", amount: "890 euros pour cinq heures", detail: "console, deux enceintes, petit kit lumiere et micro", concern: "heures supplémentaires et droits musicaux ne sont pas expliques", categorySlug: "musica-dj", image: musicLights },
    { service: "location de villa", eventType: "anniversaire 40 ans", city: "Florence, Toscane", budget: "6 150 euros", amount: "6 150 euros de location", detail: "jardin, salle intérieure, tables basiques et nettoyage jusqu'à minuit", concern: "sécurité, parking et plan pluie restent flous", categorySlug: "location", image: weddingTable },
    { service: "open bar", eventType: "soirée de mariage", city: "Lac de Come, Lombardie", budget: "3 350 euros", amount: "28 euros par personne", detail: "trois heures de cocktails, deux bartenders, glace et alcools standards", concern: "premium et prolongation après minuit sont sépares", categorySlug: "catering-menu", image: privateParty },
    { service: "photographe", eventType: "mariage symbolique", city: "Taormine, Sicile", budget: "2 680 euros", amount: "2 680 euros", detail: "huit heures, galerie en ligne et retouche simple", concern: "déplacement, second photographe et délai de livraison manquent", categorySlug: "matrimoni", image: lakeEvent },
    { service: "fleurs et décor", eventType: "petit mariage", city: "Pouilles", budget: "3 850 euros", amount: "forfait à partir de 3 850 euros", detail: "bouquet, arche de cérémonie, six centres de table et bougies", concern: "à partir de ne dit pas ce qui change le total", categorySlug: "matrimoni", image: weddingTable },
    { service: "event planner", eventType: "mariage destination", city: "Sienne, Toscane", budget: "5 450 euros", amount: "5 450 euros d'honoraires", detail: "recherche prestataires, planning, visites et coordination du jour J", concern: "le nombre de rendez-vous fournisseurs est limité", categorySlug: "matrimoni", image: lakeEvent },
    { service: "transferts", eventType: "séminaire d'entreprise", city: "Bologne, Émilie-Romagne", budget: "2 080 euros", amount: "2 080 euros", detail: "aéroport, navette hôtel et retour en soirée", concern: "temps d'attente et bagages ne sont pas spécifiés", categorySlug: "eventi-aziendali", image: corporateRoom },
    { service: "AV conférence", eventType: "événement clients", city: "Turin, Piémont", budget: "3 180 euros", amount: "3 180 euros", detail: "deux écrans, micros, technicien et captation simple", concern: "répétition et heures techniques supplémentaires manquent", categorySlug: "eventi-aziendali", image: corporateRoom },
    { service: "animation", eventType: "fête privée", city: "Naples, Campanie", budget: "1 420 euros", amount: "1 420 euros", detail: "performance live, court set DJ et deux techniciens", concern: "espace d'installation et limites sonores sont flous", categorySlug: "compleanni-feste-private", image: privateParty },
    { service: "groupe live mariage", eventType: "réception de mariage", city: "Vérone, Vénétie", budget: "4 550 euros", amount: "4 550 euros", detail: "trio apéritif, ambiance dîner et set danse", concern: "pauses, DJ backup et heures en plus restent vagues", categorySlug: "musica-dj", image: musicLights },
    { service: "chef privé", eventType: "fête familiale", city: "Lucques, Toscane", budget: "3 280 euros", amount: "109 euros par invité", detail: "chef, assistant, menu quatre services et courses", concern: "service à table, verres et nettoyage cuisine sont séparés", categorySlug: "catering-menu", image: cateringTable },
    { service: "licence musicale", eventType: "mariage", city: "Vérone, Vénétie", budget: "EUR 430-570", amount: "EUR 330-560", detail: "DJ après le dîner, micro main et musique enregistrée jusqu'à minuit", concern: "le lieu dit que la demande est à la charge du couple et le montant n'est pas écrit", categorySlug: "musica-dj", image: musicLights },
    { service: "location de lieu", eventType: "mariage", city: "Lecce, Pouilles", budget: "EUR 7 900", amount: "EUR 7 900 de location", detail: "terrasse panoramique, salle intérieure pour la pluie et mise en place simple", concern: "nettoyage tardif et remise en place du mobilier sont en supplément", categorySlug: "location", image: weddingTable },
    { service: "traiteur", eventType: "événement d'entreprise", city: "Bologne, Émilie-Romagne", budget: "EUR 6 100", amount: "EUR 79 par invité", detail: "apéritif, dîner assis, option végétarienne et service en salle", concern: "allergies, café final et boissons premium ne sont pas inclus", categorySlug: "catering-menu", image: cateringTable }
  ]
};

function buildHumanCostTitle(locale: TranslationLocale, seed: CostConversationSeed, index: number, variant: 0 | 1) {
  const titles: Record<TranslationLocale, [string, string][]> = {
    en: [
      [
        "Rome caterer says drinks are separate: does EUR 96 per guest still work",
        "Catering quote in Rome: food is clear, but late clearing is hiding in the notes"
      ],
      [
        "Milan DJ at EUR 900: fair price if lights and microphone are basic",
        "The DJ quote says five hours, but who pays if the party runs late"
      ],
      [
        "Florence villa fee looks elegant on paper, then security and rain plan appear",
        "EUR 6,200 for a 40th birthday venue: what would you ask before blocking it"
      ],
      [
        "Lake Como open bar at EUR 28 per guest: good deal or too many exclusions",
        "Premium drinks after midnight are separate: how risky is this bar quote"
      ],
      [
        "Taormina photographer for EUR 2,700: I like the style, but delivery is vague",
        "Eight hours of wedding photos in Sicily: is travel usually written separately"
      ],
      [
        "Puglia flowers start at EUR 3,900: what could push the final bill up",
        "The floral package says 'starting from': which details should be fixed now"
      ],
      [
        "Siena planner fee includes visits, but supplier meetings are capped",
        "EUR 5,500 for destination wedding planning: full support or just the essentials"
      ],
      [
        "Bologna retreat transfers: the quote forgot luggage and waiting time",
        "Airport, hotel and evening shuttle for EUR 2,100: what should be written better"
      ],
      [
        "Turin AV quote has screens and microphones, but no rehearsal time",
        "Client event tech package: EUR 3,200 before extra technician hours"
      ],
      [
        "Naples birthday entertainment sounds fun, but the setup space is unclear",
        "EUR 1,450 for live act plus DJ set: what happens if the room is small"
      ],
      [
        "Verona wedding band quote: beautiful lineup, vague breaks and overtime",
        "Aperitif trio, dinner music and party set for EUR 4,600: too much or complete"
      ],
      [
        "Private chef in Lucca at EUR 110 per guest: table service is not included",
        "Family celebration quote: chef and menu are clear, glasses and cleanup are not"
      ],
      [
        "Verona wedding music permit: who actually files it",
        "The DJ quote mentions a licence, but the venue says it is on us"
      ],
      [
        "Lake Garda venue fee looks fair until the rain backup is added",
        "Venue quote near Lake Garda: what should you confirm before the deposit"
      ],
      [
        "Parma catering at EUR 105 per guest: what is still missing",
        "Catering quote for a family celebration in Parma: would you sign this"
      ]
    ],
    es: [
      [
        "Catering en Roma a 92 euros por invitado: las bebidas quedan fuera",
        "El presupuesto de catering parece cerrado, pero el desmontaje tarde no lo está"
      ],
      [
        "DJ en Milan por 880 euros: cinco horas, luces básicas y muchas dudas pequeñas",
        "La fiesta de 18 acaba tarde: quién paga las horas extra del DJ"
      ],
      [
        "Villa en Florencia por 6.100 euros: bonita, pero el plan de lluvia no aparece",
        "Antes de reservar esa villa en Florencia: qué revisarías en el contrato"
      ],
      [
        "Barra libre en Lago de Como: 27 euros suena bien hasta leer lo premium",
        "Cocteles très horas y luego todo aparte: como cerrar este presupuesto"
      ],
      [
        "Fotografo en Taormina: 2.650 euros y ninguna fecha clara de entrega",
        "Boda simbólica en Sicilia: el precio está, pero viaje y secondo fotografo no"
      ],
      [
        "Flores en Puglia desde 3.800 euros: qué significa exactamente 'desde'",
        "Ramo, arco y velas incluidos: dónde puede crecer el total floral"
      ],
      [
        "Planner en Siena por 5.400 euros: las reuniones tienen límite",
        "Boda destino en Toscana: fee claro, alcance no tan claro"
      ],
      [
        "Transfers en Bolonia: aeropuerto y hotel sí, pero esperas y maletas no",
        "2.050 euros de transporte para retiro: qué falta antes de confirmar"
      ],
      [
        "Audio y video en Turin: pantallas incluidas, ensayo desaparecido",
        "Evento de clientes: 3.150 euros de técnica sin saber las horas reales"
      ],
      [
        "Animación en Nápoles: buen precio, pero no entiendo el montaje",
        "Show y pequeño DJ set por 1.400 euros: qué pasa con ruido y espacio"
      ],
      [
        "Banda en Verona por 4.500 euros: música preciosa, pausas demasiado vagas",
        "Trio, cena y fiesta: el presupuesto musical esta completo de verdad"
      ],
      [
        "Chef privado en Lucca: 108 euros por invitado sin copas ni limpieza",
        "Celebracion familiar con menú cerrado: el servicio de mesa queda fuera"
      ],
      [
        "Boda en Lecce: el permiso musical lo dejan para la pareja",
        "El DJ incluye sonido, pero la SIAE queda en una línea vacía"
      ],
      [
        "Villa en Bolzano: el plan de lluvia cambia el presupuesto",
        "El alquiler parece claro hasta que aparecen limpieza y cierre"
      ],
      [
        "Evento de empresa en Trieste: 79 euros por invitado, pero que falta",
        "El catering corporativo no incluye todo: intolerancias y café van aparte"
      ]
    ],
    fr: [
      [
        "Traiteur à Rome à 94 euros par invité: les boissons restent à part",
        "Le devis traiteur semble propre, sauf la ligne rangement tardif"
      ],
      [
        "DJ a Milan pour 890 euros: cinq heures, petite lumiere et questions ouvertes",
        "La soirée des 18 ans peut finir tard: qui paie les heures en plus"
      ],
      [
        "Villa a Florence: 6 150 euros et un plan pluie encore trop flou",
        "Anniversaire 40 ans en villa: que demander avant de bloquer la date"
      ],
      [
        "Open bar au lac de Come: 28 euros par personne avant les options premium",
        "Trois heures de cocktails, puis tout se sépare: devis bar a securiser"
      ],
      [
        "Photographe a Taormine: 2 680 euros, mais livraison et voyage manquent",
        "Mariage symbolique en Sicile: huit heures incluses, second photographe absent"
      ],
      [
        "Fleurs dans les Pouilles à partir de 3 850 euros: ou peut grimper le total",
        "Bouquet, arche et bougies: le forfait floral a encore trop de variables"
      ],
      [
        "Wedding planner a Sienne: honoraires clairs, rendez-vous límites",
        "5 450 euros pour organiser en Toscane: accompagnement complet ou partiel"
      ],
      [
        "Transferts à Bologne: aéroport et hotel oui, attente et bagages non",
        "Seminaire en Italie: 2 080 euros de navettes avec des zones grises"
      ],
      [
        "Technique à Turin: écrans et micros inclus, répétition oubliée",
        "Événement clients: 3 180 euros d'AV sans heures supplémentaires chiffrées"
      ],
      [
        "Animation à Naples: le show me plaît, l'installation beaucoup moins",
        "Fête privée à 1 420 euros: comment vérifier son et espace avant signature"
      ],
      [
        "Groupe live à Vérone: belle formule, pauses et DJ backup trop vagues",
        "Trio apéritif, dîner et danse: 4 550 euros pour quelle durée réelle"
      ],
      [
        "Chef privé à Lucques: 109 euros par invité, mais service à table séparé",
        "Fête familiale en Toscane: menu clair, verres et nettoyage à clarifier"
      ],
      [
        "Mariage à Vérone: qui dépose la licence musicale?",
        "Le devis DJ parle d'une licence, mais pas du montant"
      ],
      [
        "Lieu à Lecce: le plan pluie fait monter le devis",
        "La location semble propre jusqu'aux lignes nettoyage et remise en place"
      ],
      [
        "Dîner d'entreprise à Bologne: 79 euros par invité, mais que manque-t-il?",
        "Le devis traiteur pour 78 invités n'inclut pas tout"
      ]
    ]
  };

  return titles[locale][index]?.[variant] ?? (
    variant === 0
      ? `${seed.service} in ${seed.city}: ${seed.amount} with unclear extras`
      : `${seed.eventType} quote: what should be clarified before paying`
  );
}

function buildCostConversation(locale: TranslationLocale, seed: CostConversationSeed, index: number, variant: 0 | 1): LocalizedConversation {
  const authorPools: Record<TranslationLocale, string[]> = {
    en: ["Claire M.", "budget_in_italy", "Helen and Mark", "James R.", "Natalie", "quote_checklist"],
    es: ["Lucia M.", "presupuesto_claro", "Mar y Pablo", "Diego R.", "Natalia", "dudas_en_italia"],
    fr: ["Camille M.", "devis_sans_panique", "Lea et Thomás", "Julien R.", "Nathalie", "budget_italie"]
  };
  const badgePools: Record<TranslationLocale, string[]> = {
    en: ["Real name", "Nickname", "Real names", "Real name", "Real name", "Nickname"],
    es: ["Nombre real", "Nickname", "Nombres reales", "Nombre real", "Nombre real", "Nickname"],
    fr: ["Nom réel", "Pseudo", "Noms réels", "Nom réel", "Nom réel", "Pseudo"]
  };
  const author = authorPools[locale][index % authorPools[locale].length];
  const badge = badgePools[locale][index % badgePools[locale].length];
  const questionNumber = index * 2 + variant;
  const replies = 3 + (stableSmallHash(`${locale}:${seed.service}:${seed.city}:${variant}`) % 12);
  const usefulVotes = 16 + (stableSmallHash(`${seed.amount}:${seed.detail}:${locale}`) % 39);
  const notUsefulVotes = 1 + (stableSmallHash(`${seed.concern}:${locale}:${variant}`) % 7);

  if (locale === "es") {
    const title = buildHumanCostTitle(locale, seed, index, variant);
    return {
      title,
      author,
      badge,
      categorySlug: seed.categorySlug,
      city: seed.city,
      eventType: seed.eventType,
      budget: seed.budget,
      excerpt:
        variant === 0
          ? `Estoy organizando desde fuera de Italia y el proveedor incluye ${seed.detail}. La cifra es ${seed.amount}, pero ${seed.concern}.`
          : `El presupuesto parece ordenado, pero antes de pagar la señal quiero entender si ${seed.concern} y qué preguntas conviene hacer.`,
      answerPreview:
        variant === 0
          ? `Una respuesta útil fue separar ${seed.service}, precio base, personal, horarios e IVA en ${seed.city}. Así ${seed.amount} deja de ser una sensación y se puede comparar mejor.`
          : `La comunidad recomendó pedir una versión del presupuesto de ${seed.service} con incluidos, extras y límites de horario, especialmente por el punto abierto sobre ${seed.concern}.`,
      replies,
      usefulVotes,
      notUsefulVotes,
      viewsToday: 7 + (questionNumber % 24),
      status: variant === 0 ? "Precio en revisión" : "Presupuesto aclarado",
      image: seed.image
    };
  }

  if (locale === "fr") {
    const title = buildHumanCostTitle(locale, seed, index, variant);
    return {
      title,
      author,
      badge,
      categorySlug: seed.categorySlug,
      city: seed.city,
      eventType: seed.eventType,
      budget: seed.budget,
      excerpt:
        variant === 0
          ? `Nous organisons depuis l'étranger et le prestataire inclut ${seed.detail}. Le montant annonce est ${seed.amount}, mais ${seed.concern}.`
          : `Le devis semble propre, mais avant de verser l'acompte je veux comprendre si ${seed.concern} et quelles questions poser.`,
      answerPreview:
        variant === 0
          ? `La réponse la plus utile a séparé ${seed.service}, base, personnel, horaires et TVA à ${seed.city}. Le montant ${seed.amount} devient alors plus comparable.`
          : `La communauté a conseillé de demander une version du devis ${seed.service} avec inclus, extras et limites horaires, surtout sur le point flou: ${seed.concern}.`,
      replies,
      usefulVotes,
      notUsefulVotes,
      viewsToday: 8 + (questionNumber % 23),
      status: variant === 0 ? "Prix en lecture" : "Devis clarifie",
      image: seed.image
    };
  }

  const title = buildHumanCostTitle(locale, seed, index, variant);
  return {
    title,
    author,
    badge,
    categorySlug: seed.categorySlug,
    city: seed.city,
    eventType: seed.eventType,
    budget: seed.budget,
    excerpt:
      variant === 0
        ? `We are planning from abroad and the supplier includes ${seed.detail}. The number is ${seed.amount}, but ${seed.concern}.`
        : `The quote looks tidy, but before paying the deposit I want to understand whether ${seed.concern} and what questions we should ask.`,
    answerPreview:
      variant === 0
        ? `The most useful reply split ${seed.service}, base price, staff, timing and VAT in ${seed.city}. Once the quote was read that way, ${seed.amount} became easier to compare.`
        : `The community suggested asking for an included/excluded version of the ${seed.service} quote, with time limits and the unclear point on ${seed.concern}. The goal was to close the vague parts before signing.`,
    replies,
    usefulVotes,
    notUsefulVotes,
    viewsToday: 9 + (questionNumber % 22),
    status: variant === 0 ? "Price check" : "Quote clarified",
    image: seed.image
  };
}

const extraCostConversations: Record<TranslationLocale, LocalizedConversation[]> = {
  en: localizedCostSeeds.en.flatMap((seed, index) => [buildCostConversation("en", seed, index, 0), buildCostConversation("en", seed, index, 1)]),
  es: localizedCostSeeds.es.flatMap((seed, index) => [buildCostConversation("es", seed, index, 0), buildCostConversation("es", seed, index, 1)]),
  fr: localizedCostSeeds.fr.flatMap((seed, index) => [buildCostConversation("fr", seed, index, 0), buildCostConversation("fr", seed, index, 1)])
};

const homepageConversationBoosts: Record<TranslationLocale, LocalizedConversation[]> = {
  en: [
    {
      title: "US guests in Tuscany: shuttle quote is bigger than the welcome dinner",
      author: "Rebecca J.",
      badge: "Real name",
      categorySlug: "matrimoni",
      city: "Chianti, Tuscany",
      eventType: "Wedding weekend",
      budget: "EUR 3,800 transfers",
      excerpt: "We have guests staying in three villages. The transfer quote feels high, but asking everyone to drive after dinner sounds worse.",
      answerPreview:
        "The best reply split the shuttle into two waves and one emergency taxi budget. It did not make transport cheap, but it made the plan feel controlled.",
      replies: 13,
      usefulVotes: 46,
      notUsefulVotes: 3,
      viewsToday: 31,
      status: "Transport plan fixed",
      image: guestTransfer
    },
    {
      title: "Puglia pool villa for a 50th birthday: noise limit at 11 pm scares me",
      author: "mark_aus",
      badge: "Nickname",
      categorySlug: "compleanni-feste-private",
      city: "Monopoli, Puglia",
      eventType: "Private birthday",
      budget: "EUR 7,200",
      excerpt:
        "The villa is perfect during the day, but the contract says amplified music outside ends at 11 pm. Guests are flying from Australia.",
      answerPreview:
        "People suggested designing the party around the limit: pool aperitivo, dinner outside, then a small indoor bar moment instead of pretending the rule does not exist.",
      replies: 11,
      usefulVotes: 39,
      notUsefulVotes: 5,
      viewsToday: 28,
      status: "Format changed",
      image: poolVenue
    },
    {
      title: "Rome DJ speaks English, but the contract is only in Italian",
      author: "Amelia",
      badge: "Real name",
      categorySlug: "musica-dj",
      city: "Rome, Lazio",
      eventType: "Wedding party",
      budget: "EUR 1,350",
      excerpt:
        "The call went well, the playlist feels right, but I do not want to sign a contract where I miss the overtime and cancellation details.",
      answerPreview:
        "A supplier replied that she should not ask for a full legal translation, but for a written English recap of timing, gear, overtime, deposit and cancellation.",
      replies: 10,
      usefulVotes: 34,
      notUsefulVotes: 2,
      viewsToday: 22,
      status: "Contract recap requested",
      image: musicLights
    },
    {
      title: "Sicily team offsite: beach club looks fun, hotel room looks safer",
      author: "Noah - ops",
      badge: "Nickname",
      categorySlug: "eventi-aziendali",
      city: "Catania, Sicily",
      eventType: "Corporate retreat",
      budget: "EUR 24,000",
      excerpt:
        "The beach club is memorable, but we need one strategy session, lunch, a light activity and transfers. I worry it becomes messy.",
      answerPreview:
        "The most practical answer kept the beach for the reward moment and moved the working session to a shaded hotel room with proper audio.",
      replies: 14,
      usefulVotes: 52,
      notUsefulVotes: 4,
      viewsToday: 34,
      status: "Agenda rebuilt",
      image: workshopTable
    },
    {
      title: "Florence florist wrote seasonal premium blooms: what does that mean?",
      author: "Katherine",
      badge: "Real name",
      categorySlug: "matrimoni",
      city: "Florence, Tuscany",
      eventType: "Wedding",
      budget: "EUR 3,600 flowers",
      excerpt:
        "The moodboard is beautiful, but the quote has a vague line about seasonal premium blooms and substitution rights.",
      answerPreview:
        "A florist in the thread suggested asking for a color palette, three acceptable substitutions and a maximum upgrade amount before paying the deposit.",
      replies: 9,
      usefulVotes: 33,
      notUsefulVotes: 3,
      viewsToday: 19,
      status: "Floral details clarified",
      image: floralInstall
    },
    {
      title: "Catering tasting from Canada: can we decide without flying twice?",
      author: "Mira and Josh",
      badge: "Real names",
      categorySlug: "catering-menu",
      city: "Umbria",
      eventType: "Wedding",
      budget: "EUR 115 per guest",
      excerpt:
        "We can visit Italy once before the wedding. The caterer offers a tasting, but travel makes the timing complicated.",
      answerPreview:
        "The community told them to use the visit for menu risk, not for every dish: taste sauces, service style, wine level and the one course they cared about most.",
      replies: 12,
      usefulVotes: 41,
      notUsefulVotes: 2,
      viewsToday: 27,
      status: "Tasting plan chosen",
      image: chefTable
    }
  ],
  es: [
    {
      title: "Desde México a Positano: el barco para invitados se dispara de precio",
      author: "Fernanda",
      badge: "Nombre real",
      categorySlug: "matrimoni",
      city: "Positano, Campania",
      eventType: "Boda destino",
      budget: "EUR 4.900 traslados",
      excerpt:
        "La idea del barco era preciosa, pero entre horarios, muelle y regreso de noche empieza a parecer una parte enorme del presupuesto.",
      answerPreview:
        "La respuesta más útil fue no quitar el barco, sino convertirlo en un único momento corto y usar vans para el regreso. Menos postal, más tranquilidad.",
      replies: 13,
      usefulVotes: 47,
      notUsefulVotes: 4,
      viewsToday: 32,
      status: "Traslados rediseñados",
      image: guestTransfer
    },
    {
      title: "Masseria en Puglia para aniversario: preciosa, pero todos duermen lejos",
      author: "isa_barcelona",
      badge: "Nickname",
      categorySlug: "compleanni-feste-private",
      city: "Ostuni, Puglia",
      eventType: "Aniversario",
      budget: "EUR 6.300",
      excerpt:
        "El espacio tiene muchísimo encanto, pero los alojamientos están repartidos y no quiero terminar organizando taxis toda la noche.",
      answerPreview:
        "Varios usuarios le dijeron que la masseria valía la pena solo con un horario de regreso pactado y una persona responsable de cerrar la noche.",
      replies: 10,
      usefulVotes: 36,
      notUsefulVotes: 5,
      viewsToday: 24,
      status: "Logística revisada",
      image: poolVenue
    },
    {
      title: "Cena de empresa en Verona: el menú gusta, el audio no aparece claro",
      author: "Carolina",
      badge: "Nombre real",
      categorySlug: "eventi-aziendali",
      city: "Verona, Veneto",
      eventType: "Cena corporativa",
      budget: "EUR 11.500",
      excerpt:
        "Tenemos brindis, pequeño discurso y video de dos minutos. El restaurante dice que se arregla, pero no hay línea técnica.",
      answerPreview:
        "La comunidad fue directa: si hay discurso y video, el audio no puede ser una promesa verbal. Pidieron micrófono, prueba y persona técnica por escrito.",
      replies: 12,
      usefulVotes: 44,
      notUsefulVotes: 3,
      viewsToday: 29,
      status: "Parte técnica pedida",
      image: workshopTable
    },
    {
      title: "DJ en Toscana: nos encanta, pero no incluye SIAE ni luces",
      author: "Leo y Marina",
      badge: "Nombres reales",
      categorySlug: "musica-dj",
      city: "Siena, Toscana",
      eventType: "Boda",
      budget: "EUR 1.250",
      excerpt:
        "El precio base parece correcto, pero entre permiso musical, luces y horas extra no sé si acabará siendo caro.",
      answerPreview:
        "Un DJ respondió con una lista sencilla: música, permiso, equipo, luces y overtime en cinco líneas separadas. Así pudieron comparar sin discutir gustos.",
      replies: 14,
      usefulVotes: 50,
      notUsefulVotes: 2,
      viewsToday: 35,
      status: "Comparación cerrada",
      image: musicLights
    },
    {
      title: "Flores en Como: el arco cuesta casi como todo el centro de mesa",
      author: "Paula G.",
      badge: "Nombre real",
      categorySlug: "matrimoni",
      city: "Lago de Como, Lombardía",
      eventType: "Boda",
      budget: "EUR 4.200 flores",
      excerpt:
        "Quiero algo elegante, pero el arco floral ocupa demasiado presupuesto y no sé si los invitados lo recordarán.",
      answerPreview:
        "La respuesta más votada fue usar flores donde aparecen en fotos y mesa, y convertir el arco en estructura verde con pocas flores protagonistas.",
      replies: 9,
      usefulVotes: 37,
      notUsefulVotes: 4,
      viewsToday: 23,
      status: "Diseño floral ajustado",
      image: floralInstall
    },
    {
      title: "Chef privado en Lucca: cocina pequeña y limpieza no incluidas",
      author: "Tomas",
      badge: "Nombre real",
      categorySlug: "catering-menu",
      city: "Lucca, Toscana",
      eventType: "Cena familiar",
      budget: "EUR 2.900",
      excerpt:
        "El menú está claro y suena buenísimo, pero la villa tiene cocina pequeña y el chef dice que limpieza final no está incluida.",
      answerPreview:
        "Un usuario le pidió fotos de cocina, lista de material necesario y una hora de salida realista. El problema no era el chef, era el espacio.",
      replies: 11,
      usefulVotes: 38,
      notUsefulVotes: 3,
      viewsToday: 26,
      status: "Cocina verificada",
      image: chefTable
    }
  ],
  fr: [
    {
      title: "Invités suisses au lac de Garde: navettes ou voitures de location?",
      author: "Camille D.",
      badge: "Nom réel",
      categorySlug: "matrimoni",
      city: "Lac de Garde, Vénétie",
      eventType: "Mariage",
      budget: "EUR 3 200 transport",
      excerpt:
        "Les hôtels sont proches sur la carte, mais les routes tournent beaucoup. J'ai peur que chacun arrive en retard au dîner.",
      answerPreview:
        "La discussion a transformé le choix: navette obligatoire pour l'aller, retour en deux créneaux et taxis seulement pour les derniers invités.",
      replies: 12,
      usefulVotes: 43,
      notUsefulVotes: 3,
      viewsToday: 29,
      status: "Transport calé",
      image: guestTransfer
    },
    {
      title: "Fête à Naples: rooftop magnifique, mais ascenseur minuscule",
      author: "julien_event",
      badge: "Pseudo",
      categorySlug: "compleanni-feste-private",
      city: "Naples, Campanie",
      eventType: "Fête privée",
      budget: "EUR 5 600",
      excerpt:
        "La vue est incroyable, mais il faut monter matériel, gâteau et fleurs par un ascenseur très lent. Je sens le piège logistique.",
      answerPreview:
        "Les réponses ont été très concrètes: limiter le décor, livrer avant midi, choisir un gâteau simple à transporter et prévoir un responsable d'accès.",
      replies: 10,
      usefulVotes: 35,
      notUsefulVotes: 5,
      viewsToday: 24,
      status: "Accès vérifié",
      image: poolVenue
    },
    {
      title: "Séminaire en Toscane: l'activité team building semble trop scolaire",
      author: "Nora",
      badge: "Nom réel",
      categorySlug: "eventi-aziendali",
      city: "Arezzo, Toscane",
      eventType: "Team building",
      budget: "EUR 14 000",
      excerpt:
        "Le lieu propose un atelier très cadré. Notre équipe est internationale et je ne veux pas une activité gênante.",
      answerPreview:
        "La meilleure réponse a proposé une dégustation guidée avec mission légère par table. Personne ne joue un rôle, tout le monde parle naturellement.",
      replies: 13,
      usefulVotes: 48,
      notUsefulVotes: 4,
      viewsToday: 31,
      status: "Format assoupli",
      image: workshopTable
    },
    {
      title: "DJ à Rome: bon feeling, mais les heures après minuit sont floues",
      author: "Mathilde",
      badge: "Nom réel",
      categorySlug: "musica-dj",
      city: "Rome, Latium",
      eventType: "Soirée de mariage",
      budget: "EUR 1 480",
      excerpt:
        "Il parle français et comprend l'ambiance, mais le devis dit seulement fin de soirée à définir.",
      answerPreview:
        "Un prestataire a conseillé de fixer trois seuils: fin prévue, première heure supplémentaire et prix maximum si la salle autorise plus tard.",
      replies: 11,
      usefulVotes: 39,
      notUsefulVotes: 2,
      viewsToday: 27,
      status: "Horaires clarifiés",
      image: musicLights
    },
    {
      title: "Fleurs en Sicile: j'aime les agrumes, mais le devis devient décor complet",
      author: "Claire et Hugo",
      badge: "Noms réels",
      categorySlug: "matrimoni",
      city: "Syracuse, Sicile",
      eventType: "Mariage",
      budget: "EUR 3 300 décor",
      excerpt:
        "Nous voulions quelques touches d'agrumes. La proposition ajoute arches, tables, coin photo et beaucoup de bougies.",
      answerPreview:
        "La communauté a conseillé de choisir deux zones fortes seulement: table et cérémonie. Le reste devait rester simple pour ne pas payer un décor de shooting.",
      replies: 9,
      usefulVotes: 34,
      notUsefulVotes: 3,
      viewsToday: 21,
      status: "Décor réduit",
      image: floralInstall
    },
    {
      title: "Traiteur en Ombrie: menu parfait, mais enfants et allergies restent hors devis",
      author: "Aline",
      badge: "Nom réel",
      categorySlug: "catering-menu",
      city: "Pérouse, Ombrie",
      eventType: "Mariage intime",
      budget: "EUR 98 par invité",
      excerpt:
        "Le repas adulte est très clair. Les menus enfants, allergies et repas prestataires sont dans une note séparée sans prix.",
      answerPreview:
        "Plusieurs réponses ont insisté sur une ligne par type de repas. Le prix adulte ne voulait rien dire tant que les enfants et prestataires restaient ouverts.",
      replies: 12,
      usefulVotes: 42,
      notUsefulVotes: 3,
      viewsToday: 28,
      status: "Menu détaillé",
      image: chefTable
    }
  ]
};

const editorialArticleBoosts: Record<TranslationLocale, LocalizedMagazineArticle[]> = {
  en: [
    {
      title: "How to plan guest transport in Italy without turning the weekend into a puzzle",
      slug: "guest-transport-italy-event-weekend",
      category: "Planning from abroad",
      author: "OrganizzaEvento editors",
      excerpt: "Villages, villas, late dinners and return trips: the transport lines that should be clear before you confirm a venue.",
      readTime: "7 min",
      image: guestTransfer
    },
    {
      title: "Italian flower quotes: when a beautiful moodboard needs a budget boundary",
      slug: "italian-flower-quote-budget-boundary",
      category: "Weddings",
      author: "Event desk",
      excerpt: "How to ask for substitutions, seasonal flowers, reuse between ceremony and dinner, and a maximum upgrade amount.",
      readTime: "6 min",
      image: floralInstall
    }
  ],
  es: [
    {
      title: "Traslados para invitados en Italia: cómo evitar que el plan se coma el presupuesto",
      slug: "traslados-invitados-italia-presupuesto",
      category: "Organizar desde fuera",
      author: "Redacción OrganizzaEvento",
      excerpt: "Hoteles repartidos, villas, horarios de cena y regreso: las preguntas que conviene cerrar antes de reservar.",
      readTime: "7 min",
      image: guestTransfer
    },
    {
      title: "Flores para boda en Italia: cuándo un moodboard bonito necesita límites",
      slug: "flores-boda-italia-limites-presupuesto",
      category: "Bodas",
      author: "Mesa editorial",
      excerpt: "Sustituciones, flores de temporada, reutilización entre ceremonia y cena, y un techo claro para extras.",
      readTime: "6 min",
      image: floralInstall
    }
  ],
  fr: [
    {
      title: "Transport des invités en Italie: éviter que la logistique mange le budget",
      slug: "transport-invites-italie-budget",
      category: "Organiser depuis l'étranger",
      author: "Rédaction OrganizzaEvento",
      excerpt: "Hôtels dispersés, villas, dîners tardifs et retours: les lignes à clarifier avant de bloquer un lieu.",
      readTime: "7 min",
      image: guestTransfer
    },
    {
      title: "Fleurs de mariage en Italie: poser une limite avant que le décor grandisse",
      slug: "fleurs-mariage-italie-limite-budget",
      category: "Mariages",
      author: "Bureau éditorial",
      excerpt: "Substitutions, fleurs de saison, réutilisation cérémonie-dîner et plafond d'extras à demander par écrit.",
      readTime: "6 min",
      image: floralInstall
    }
  ]
};

function inferLocalizedCategorySlug(conversation: LocalizedConversation) {
  const text = `${conversation.title} ${conversation.eventType} ${conversation.excerpt}`.toLowerCase();
  if (/dj|music|musica|musique|band|banda|siae|audio|luci|luces|lumi/.test(text)) return "musica-dj";
  if (/catering|traiteur|menu|menú|buffet|chef|bar|drink|boissons|aperitivo|ap[eé]ritif|food/.test(text)) return "catering-menu";
  if (/villa|venue|location|lieu|lugar|rooftop|terraz|sala|room|masseria|hotel|finca/.test(text)) return "location";
  if (/corporate|empresa|entreprise|client|seminar|séminaire|team building|azienda|badge|workshop/.test(text)) return "eventi-aziendali";
  if (/birthday|cumple|anniversaire|fiesta privada|fête privée|private party|graduation|laurea|aniversario/.test(text)) return "compleanni-feste-private";
  if (/planner|stopped replying|no responde|ne répond|deposit|señal|acompte|proveedor|prestataire|supplier/.test(text)) return "problemi-fornitori";
  if (/idea|ideas|idée|welcome drink|aperitivo|format/.test(text)) return "idee-evento";
  if (/price|cost|budget|presupuesto|precio|prix|devis|quote|quanto/.test(text)) return "quanto-costa";
  if (/wedding|boda|mariage|elopement|spos/.test(text)) return "matrimoni";
  return "da-dove-inizio";
}

for (const locale of ["en", "es", "fr"] as const) {
  localizedCommunity[locale].conversations.unshift(...homepageConversationBoosts[locale]);
  localizedCommunity[locale].conversations.push(...extraConversations[locale], ...extraCostConversations[locale]);
  localizedCommunity[locale].articles.push(...extraArticles[locale], ...editorialArticleBoosts[locale]);
  localizedCommunity[locale].conversations.forEach((conversation) => {
    conversation.categorySlug ??= inferLocalizedCategorySlug(conversation);
  });
}

function cleanConversationSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 92)
    .replace(/-$/g, "");
}

export function localizedConversationSlug(conversation: LocalizedConversation) {
  return cleanConversationSlug(conversation.title);
}

export function localizedConversationHref(locale: TranslationLocale, conversation: LocalizedConversation) {
  return `${localizedStaticPath(locale, "questions")}/${localizedConversationSlug(conversation)}`;
}

export function findLocalizedConversation(locale: TranslationLocale, slug: string) {
  return localizedCommunity[locale].conversations.find((conversation) => localizedConversationSlug(conversation) === slug) ?? null;
}

export function localizedConversationReplyCount(conversation: LocalizedConversation) {
  return Math.max(3, Math.min(14, conversation.replies));
}

export function localizedConversationNotUsefulVotes(conversation: LocalizedConversation) {
  return conversation.notUsefulVotes ?? (1 + (stableSmallHash(`${conversation.title}:${conversation.city}:not-useful`) % 7));
}

function localizedAnswerCopy(locale: TranslationLocale) {
  if (locale === "es") {
    return {
      authorUpdate: "Actualización del autor",
      client: "Cliente",
      planner: "Event planner",
      supplier: "Proveedor",
      locationOwner: "Propietario de espacio",
      catering: "Catering",
      music: "DJ / Música",
      corporate: "Organizador corporativo",
      askFirst: "Yo pediría primero",
      beforeSigning: "antes de firmar",
      usefulFrame: "Para comparar bien, separa",
      fromSimilar: "En un caso parecido en Italia, la diferencia real apareció cuando revisaron",
      cityBudget: "en {city} con presupuesto {budget}"
    };
  }
  if (locale === "fr") {
    return {
      authorUpdate: "Mise à jour de l'auteur",
      client: "Client",
      planner: "Event planner",
      supplier: "Prestataire",
      locationOwner: "Propriétaire de lieu",
      catering: "Traiteur",
      music: "DJ / Musique",
      corporate: "Organisateur entreprise",
      askFirst: "Je demanderais d'abord",
      beforeSigning: "avant de signer",
      usefulFrame: "Pour comparer proprement, séparez",
      fromSimilar: "Dans un cas proche en Italie, le vrai écart est apparu en regardant",
      cityBudget: "à {city} avec un budget {budget}"
    };
  }
  return {
    authorUpdate: "Author update",
    client: "Client",
    planner: "Event planner",
    supplier: "Supplier",
    locationOwner: "Venue owner",
    catering: "Catering",
    music: "DJ / Music",
    corporate: "Corporate organizer",
    askFirst: "I would ask first for",
    beforeSigning: "before signing",
    usefulFrame: "To compare properly, split",
    fromSimilar: "In a similar Italy case, the real difference appeared when they checked",
    cityBudget: "in {city} with a {budget} budget"
  };
}

function categoryAnswer(locale: TranslationLocale, conversation: LocalizedConversation) {
  const c = localizedAnswerCopy(locale);
  const context = c.cityBudget.replace("{city}", conversation.city).replace("{budget}", conversation.budget);
  const category = conversation.categorySlug ?? "";

  if (locale === "es") {
    if (category === "location") {
      return `${c.askFirst} horarios reales de cierre, limpieza, seguridad, plan de lluvia y qué cambia si la música termina antes ${c.beforeSigning}. ${c.fromSimilar} la logística del espacio, no solo el alquiler, ${context}.`;
    }
    if (category === "catering-menu") {
      return `${c.usefulFrame} comida, personal, vajilla, bebidas, transporte y servicio tarde. Para ${conversation.eventType}, un menú barato deja de serlo si copas, camareros extra o montaje quedan fuera.`;
    }
    if (category === "musica-dj") {
      return `${c.askFirst} puntos de sonido, montaje, luces, micrófono, horas extra y gestión SIAE. En esta conversación la música no es solo ambiente: también es técnica y horarios.`;
    }
    if (category === "eventi-aziendali") {
      return `${c.usefulFrame} sala, audio, registro, ensayo, personal técnico y tiempos entre bienvenida, discurso y cena. En eventos de empresa el problema suele aparecer en las transiciones.`;
    }
    if (category === "problemi-fornitori") {
      return `${c.askFirst} un resumen escrito y tranquilo: qué se pagó, qué falta, para cuándo lo necesitas y qué alternativa proponen si no pueden cumplir. Mejor hechos claros que mensajes nerviosos.`;
    }
    if (category === "idee-evento") {
      return `La mejor idea es la que los invitados entienden en diez segundos. Mantén un formato simple, un punto de encuentro claro y una salida fácil; luego invierte en el momento que sí recordarán.`;
    }
    if (category === "quanto-costa") {
      return `${c.usefulFrame} incluidos, opcionales y gastos con límite. Con ${conversation.budget}, la pregunta justa no es solo si es caro, sino qué parte puede moverse después de confirmar.`;
    }
    return `${c.askFirst} tres opciones comparables con el mismo número de invitados, misma fecha aproximada y mismo nivel de servicio. Si no, cada proveedor contesta una pregunta distinta.`;
  }

  if (locale === "fr") {
    if (category === "location") {
      return `${c.askFirst} l'heure réelle de fin, le nettoyage, la sécurité, le plan pluie et ce qui change si la musique finit plus tôt ${c.beforeSigning}. ${c.fromSimilar} les horaires du lieu, pas seulement la location, ${context}.`;
    }
    if (category === "catering-menu") {
      return `${c.usefulFrame} nourriture, personnel, vaisselle, boissons, transport et service tardif. Pour ${conversation.eventType}, un menu attractif peut devenir cher si verres, serveurs ou installation restent hors devis.`;
    }
    if (category === "musica-dj") {
      return `${c.askFirst} points son, montage, lumières, micro, heures supplémentaires et droits musicaux. Ici, la musique est autant une ambiance qu'une question technique.`;
    }
    if (category === "eventi-aziendali") {
      return `${c.usefulFrame} lieu, audio, accueil, répétition, technicien et transitions. Dans un événement d'entreprise, le risque se cache souvent entre deux moments du programme.`;
    }
    if (category === "problemi-fornitori") {
      return `${c.askFirst} un récapitulatif calme par écrit : ce qui a été payé, ce qui manque, la date limite et la solution proposée si le prestataire ne peut pas suivre. Restez factuel.`;
    }
    if (category === "idee-evento") {
      return `La meilleure idée est celle que les invités comprennent en dix secondes. Gardez un format simple, un point de rendez-vous clair et une sortie facile, puis mettez le budget sur le moment mémorable.`;
    }
    if (category === "quanto-costa") {
      return `${c.usefulFrame} inclus, options et dépenses plafonnées. Avec ${conversation.budget}, la vraie question n'est pas seulement le prix, mais ce qui peut encore changer après confirmation.`;
    }
    return `${c.askFirst} trois options comparables avec le même nombre d'invités, la même période et le même niveau de service. Sinon chaque prestataire répond à une question différente.`;
  }

  if (category === "location") {
    return `${c.askFirst} the exact end time, cleaning window, security hours and what changes if music finishes earlier ${c.beforeSigning}. ${c.fromSimilar} venue timing, not just the rental fee, ${context}.`;
  }
  if (category === "catering-menu") {
    return `${c.usefulFrame} food, staff, rentals, drinks, transport and late-night service. For ${conversation.eventType}, a cheap menu can stop being cheap if glassware, staff after midnight or setup are outside the line items.`;
  }
  if (category === "musica-dj") {
    return `${c.askFirst} number of sound points, setup time, lights, microphone, overtime and SIAE/music-permit handling. The image and the case suggest music is part atmosphere and part logistics, so write both into the quote.`;
  }
  if (category === "eventi-aziendali") {
    return `${c.usefulFrame} venue, AV, check-in, staff, rehearsal and dinner timing. Corporate events often fail in transitions, so the answer is not only price: it is who moves people from welcome to speech to dinner.`;
  }
  if (category === "problemi-fornitori") {
    return `${c.askFirst} a calm written recap: what has been paid, what is missing, by when you need it and what happens if they cannot deliver. Keep it factual, especially when the supplier is already slow.`;
  }
  if (category === "idee-evento") {
    return `The strongest idea is the one guests understand in ten seconds. Keep one simple format, one clear meeting point and one easy exit, then spend the budget on the moment people will actually remember.`;
  }
  if (category === "quanto-costa") {
    return `${c.usefulFrame} included items, optional items and capped expenses. With ${conversation.budget}, the fair question is not only "is it expensive?", but "which part can still move after confirmation?".`;
  }
  return `${c.askFirst} three comparable options with the same guest count, same date window and same service level. Without that, every supplier answers a different question and the budget becomes impossible to read.`;
}

function localizedAuthorFollowUp(locale: TranslationLocale, conversation: LocalizedConversation) {
  const category = conversation.categorySlug ?? "";
  const place = conversation.city;

  if (locale === "es") {
    if (category === "catering-menu") return `Actualizo: voy a pedir una versión con menú, bebidas, camareros, transporte y limpieza separados. En ${place} el precio ya no me preocupa tanto como entender qué puede quedar fuera.`;
    if (category === "musica-dj") return `Gracias, me llevo una lista concreta: equipo, luces, SIAE, horarios y horas extra. Antes pensaba solo en la música; ahora veo que el contrato tiene que cubrir la noche completa.`;
    if (category === "location") return `Al final no voy a mirar solo las fotos del espacio. Pediré plan de lluvia, horarios de carga, limpieza y límites de ruido antes de decidir.`;
    if (category === "eventi-aziendali") return `Me ayudó mucho leerlo como agenda, no como presupuesto suelto. Ahora pediré una escaleta con audio, registro, tiempos de discurso y responsable en sala.`;
    if (category === "matrimoni") return `Actualizo porque las respuestas me bajaron a tierra: voy a pedir el mismo escenario por escrito, con invitados, horarios y extras, antes de pagar la siguiente parte.`;
    if (category === "compleanni-feste-private") return `Voy a simplificar el formato. Prefiero una fiesta que fluya bien, aunque tenga menos decoración, a un plan bonito pero imposible de gestionar durante la noche.`;
    return `Gracias a todos, ahora voy a escribir al proveedor con cuatro puntos concretos y pedir una versión cerrada. Así la decisión será menos emocional y más comparable.`;
  }

  if (locale === "fr") {
    if (category === "catering-menu") return `Je mets à jour : je vais demander une version séparant menu, boissons, serveurs, transport et nettoyage. À ${place}, le vrai sujet est de savoir ce qui peut rester hors devis.`;
    if (category === "musica-dj") return `Merci, je repars avec une liste claire : matériel, lumières, droits musicaux, horaires et heures supplémentaires. Je pensais ambiance; je dois aussi sécuriser la technique.`;
    if (category === "location") return `Je ne vais plus juger seulement sur les photos. Je demanderai plan pluie, horaires de livraison, nettoyage et limites sonores avant de confirmer.`;
    if (category === "eventi-aziendali") return `Vos réponses m'ont aidée à lire le devis comme un déroulé. Je vais demander accueil, audio, timing des prises de parole et responsable sur place.`;
    if (category === "matrimoni") return `Mise à jour utile : je vais demander le même scénario écrit, avec invités, horaires et extras, avant de verser le prochain acompte.`;
    if (category === "compleanni-feste-private") return `Je vais simplifier le format. Je préfère une fête fluide avec moins de décor qu'un plan superbe mais impossible à gérer le soir même.`;
    return `Merci à tous, je vais écrire au prestataire avec quatre points précis et demander une version fermée. La décision sera plus comparable et moins instinctive.`;
  }

  if (category === "catering-menu") return `Quick update: I am asking for menu, drinks, staff, transport and cleaning as separate lines. In ${place}, the question is less "is it expensive?" and more "what can still be added later?".`;
  if (category === "musica-dj") return `Thank you, this changed how I read the quote. I am now asking for gear, lights, permits, timing and overtime in writing before deciding.`;
  if (category === "location") return `I am not choosing from the photos alone anymore. I will ask for the rain plan, loading hours, cleaning rules and noise limits before moving forward.`;
  if (category === "eventi-aziendali") return `The useful shift was reading this as a run sheet, not just a supplier quote. I will ask who owns welcome, audio, speeches and transitions on site.`;
  if (category === "matrimoni") return `Author update: I am asking for the same scenario in writing, with guests, hours and extras, before paying the next instalment.`;
  if (category === "compleanni-feste-private") return `I am going to simplify the format. A party that flows well matters more than a pretty plan that becomes hard to manage during the night.`;
  return `Thanks everyone, I am sending the supplier a short list of concrete questions and asking for a closed version. That makes the decision calmer and easier to compare.`;
}

function roleForConversation(locale: TranslationLocale, categorySlug?: string) {
  const c = localizedAnswerCopy(locale);
  if (categorySlug === "location") return c.locationOwner;
  if (categorySlug === "catering-menu") return c.catering;
  if (categorySlug === "musica-dj") return c.music;
  if (categorySlug === "eventi-aziendali") return c.corporate;
  if (categorySlug === "problemi-fornitori") return c.planner;
  return c.supplier;
}

function localizedExtraAnswerBank(locale: TranslationLocale, conversation: LocalizedConversation) {
  const category = conversation.categorySlug ?? "";
  const budget = conversation.budget;
  const place = conversation.city;

  if (locale === "es") {
    const common = [
      `Yo pediría una tabla con incluido, excluido, límite horario, IVA y condiciones de cancelación. Con ${budget} lo importante es que el precio se pueda leer sin llamadas posteriores.`,
      `Compara solo presupuestos con el mismo número de invitados y las mismas horas. Si un proveedor cuenta cinco horas y otro ocho, el total no dice casi nada.`,
      `No intentaría negociar antes de entender las voces abiertas. Primero que expliquen que cambia el total; después decides si quitar algo o buscar otra opción.`,
      `Pregunta quién estará físicamente el día del evento en ${place}. La persona que vende no siempre es la que resuelve problemas cuando la sala ya está llena.`
    ];
    const byCategory: Record<string, string[]> = {
      "catering-menu": [
        `Para catering miraría camareros, bebidas, vajilla, transporte, tarta y hora de desmontaje. El menú puede parecer barato, pero el servicio mueve mucho el total.`,
        `Pide cantidades por persona y no solo nombres bonitos de platos. Con buffet, una cifra sin piezas, puntos de servicio y reposición es difícil de comparar.`,
        `Si hay barra libre, quiero ver duración, marcas incluidas, hielo, copas, bartenders y qué pasa cuando se acaba el paquete.`
      ],
      "musica-dj": [
        `En música preguntaría por equipo, micrófono, luces, montaje, fin de servicio y permisos. Un DJ no se compara solo por playlist.`,
        `Pide que expliquen descansos, plan B técnico y coste después de medianoche. Son detalles pequeños hasta que el evento se alarga.`,
        `Si hay banda, separa actuación en vivo, DJ de apoyo y tiempos muertos. A veces el presupuesto alto incluye continuidad real.`
      ],
      location: [
        `Para un espacio pediría plano real con lluvia, horarios de carga, limpieza, parking y límites de ruido. La foto no enseña esos costes.`,
        `Si la villa obliga proveedores internos, pregunta precios antes de bloquear fecha. El alquiler puede ser correcto y el resto no.`,
        `Comprueba que el plan B sea una opción aceptable, no una sala usada solo para justificar el contrato.`
      ],
      matrimoni: [
        `En una boda destino preguntaría por coordinación del día, transporte, plan de lluvia y plazos de pago. No es solo estética, es gestión de riesgo.`,
        `Si el precio dice "desde", pide tres escenarios: mínimo realista, recomendado y completo. Así entiendes dónde termina la cifra final.`,
        `Para flores, foto o planner, pregunta cuántas revisiones o reuniones incluye. Es donde aparecen límites que no se ven al principio.`
      ],
      "eventi-aziendali": [
        `En un evento corporativo revisaría check-in, audio, ensayo, personal técnico y tiempos de cambio entre momentos. El fallo suele estar en las transiciones.`,
        `Pide una escaleta de trabajo, no solo una propuesta bonita. Si nadie sabe quién mueve a los invitados, el presupuesto no está completo.`,
        `Para transfers, aclara esperas, equipaje, retrasos de vuelos y contacto del conductor.`
      ],
      "compleanni-feste-private": [
        `Para una fiesta privada miraría cierre, limpieza, bar y seguridad. Son las voces que se notan cuando todos quieren disfrutar y nadie quiere coordinar.`,
        `Si hay animación o show, pide requisitos de espacio, corriente, sonido y montaje. El precio aislado no basta.`,
        `Yo dejaría por escrito quién gestiona tarta, brindis y último giro de bebidas.`
      ]
    };
    return [...(byCategory[category] ?? []), ...common];
  }

  if (locale === "fr") {
    const common = [
      `Je demanderais un tableau avec inclus, exclus, limite horaire, TVA et conditions d'annulation. Avec ${budget}, le prix doit pouvoir se lire sans appel supplémentaire.`,
      `Comparez seulement des devis avec le même nombre d'invités et les mêmes horaires. Sinon le total donne une impression, pas une réponse.`,
      `Je ne négocierais pas avant d'avoir fermé les zones floues. D'abord comprendre ce qui peut changer, ensuite seulement ajuster.`,
      `Demandez qui sera présent physiquement le jour de l'événement à ${place}. Le commercial n'est pas toujours la personne qui résout sur place.`
    ];
    const byCategory: Record<string, string[]> = {
      "catering-menu": [
        `Pour le traiteur, regardez serveurs, boissons, vaisselle, transport, gâteau et heure de démontage. Le menu seul ne raconte pas le vrai coût.`,
        `Demandez des quantités par personne, pas seulement des intitulés de plats. Un buffet sans pièces, points de service et réassort reste flou.`,
        `Pour l'open bar, il faut durée, marques incluses, glace, verres, bartenders et règle de dépassement.`
      ],
      "musica-dj": [
        `Pour la musique, demandez matériel, micro, lumières, montage, fin de service et droits musicaux. On ne compare pas un DJ seulement sur une playlist.`,
        `Clarifiez pauses, backup technique et coût après minuit. Ce sont des détails jusqu'au moment où la soirée continue.`,
        `Avec un groupe live, séparez live, DJ de secours et temps morts. Un devis plus cher peut parfois inclure une vraie continuité.`
      ],
      location: [
        `Pour le lieu, demandez plan pluie, horaires de chargement, nettoyage, parking et limites sonores. La photo ne montre pas ces coûts.`,
        `Si la villa impose certains prestataires, demandez leurs tarifs avant de bloquer la date. Le loyer peut être juste et le reste beaucoup moins.`,
        `Le plan B doit être acceptable, pas seulement une piece citee pour rassurer dans le contrat.`
      ],
      matrimoni: [
        `Pour un mariage en Italie, vérifiez coordination du jour J, transports, plan pluie et échéancier. Ce n'est pas seulement une question d'esthétique.`,
        `Quand le prix dit "à partir de", demandez trois scénarios: minimal réaliste, conseillé et complet. Vous verrez où peut finir le total.`,
        `Pour fleurs, photo ou planning, demandez le nombre de révisions et rendez-vous inclus. Les limites apparaissent souvent là.`
      ],
      "eventi-aziendali": [
        `Pour un événement corporate, je vérifierais accueil, audio, répétition, technicien et transitions. Les problèmes arrivent souvent entre deux moments.`,
        `Demandez un déroulé operationnel, pas seulement une belle proposition. Si personne ne déplace les invités, le devis n'est pas complet.`,
        `Pour les transferts, clarifiez attente, bagages, retards de vol et contact chauffeur.`
      ],
      "compleanni-feste-private": [
        `Pour une fête privée, regardez fermeture, nettoyage, bar et sécurité. Ce sont les lignes visibles quand tout le monde veut profiter.`,
        `S'il y a animation ou show, demandez espace, électricité, son et montage. Le prix seul ne suffit pas.`,
        `Je mettrais par écrit qui gère gâteau, toast et dernier service boissons.`
      ]
    };
    return [...(byCategory[category] ?? []), ...common];
  }

  const common = [
    `I would ask for a simple included/excluded table with VAT, time limits and cancellation terms. With ${budget}, the quote should be readable without chasing calls.`,
    `Compare only quotes with the same guest count and the same service hours. If one supplier counts five hours and another counts eight, the total is not really comparable.`,
    `I would not negotiate before understanding the vague lines. First close what can still move; then decide whether to remove something or look elsewhere.`,
    `Ask who will physically be there on the event day in ${place}. The person selling the service is not always the person solving problems on site.`
  ];
  const byCategory: Record<string, string[]> = {
    "catering-menu": [
      `For catering, check staff, drinks, rentals, transport, cake service and clearing time. A menu can look cheap while service makes the final bill move.`,
      `Ask for quantities per guest, not just attractive dish names. A buffet without pieces, service points and refill timing is hard to compare.`,
      `For open bar, I want duration, included brands, ice, glasses, bartenders and what happens when the package ends.`
    ],
    "musica-dj": [
      `For music, ask about equipment, microphone, lights, setup time, end time and music permits. A DJ is not comparable only by playlist.`,
      `Clarify breaks, technical backup and overtime after midnight. These are small details only until the party keeps going.`,
      `With a live band, separate live sets, DJ backup and empty moments. A higher quote may include real continuity.`
    ],
    location: [
      `For the venue, ask for rain plan, loading hours, cleaning, parking and noise limits. The photo does not show those costs.`,
      `If the villa requires internal suppliers, ask for those prices before locking the date. The rental fee may be fair while the rest is not.`,
      `The plan B should be acceptable, not just a room mentioned to make the contract feel safe.`
    ],
    matrimoni: [
      `For a destination wedding, check day-of coordination, transport, rain plan and payment milestones. It is risk management, not only aesthetics.`,
      `When a price says "starting from", ask for three scenarios: minimum realistic, recommended and complete. That shows where the final total can land.`,
      `For flowers, photo or planning, ask how many revisions or supplier meetings are included. Limits often appear there.`
    ],
    "eventi-aziendali": [
      `For a corporate event, check registration, audio, rehearsal, technician hours and transitions. Most problems happen between one moment and the next.`,
      `Ask for an operational run sheet, not only a nice proposal. If nobody owns guest movement, the quote is incomplete.`,
      `For transfers, clarify waiting time, luggage, flight delays and driver contact.`
    ],
    "compleanni-feste-private": [
      `For a private party, check closing, cleaning, bar and security. These lines are visible when everyone wants to enjoy the night.`,
      `If there is entertainment or a show, ask for space, power, sound and setup needs. The price alone is not enough.`,
      `I would write down who handles cake, toast and the final drink round.`
    ]
  };
  return [...(byCategory[category] ?? []), ...common];
}

function contextualExtraAnswer(locale: TranslationLocale, base: string, conversation: LocalizedConversation, index: number) {
  const threadTitle = conversation.title.trim();
  const answerAngle = Math.max(1, index - 2);
  const suffixes: Record<TranslationLocale, string[]> = {
    en: [
      `For this specific thread, I would write "${threadTitle}" at the top of the supplier recap so everyone answers the same case.`,
      `Because the event is in ${conversation.city}, I would also ask who is reachable on the day, not only who sends the quote.`,
      `With ${conversation.budget}, the useful comparison is the calm one: same hours, same guests, same responsibilities.`,
      `I would keep this question open until the supplier replies in writing, because the small unclear line is usually the expensive one.`
    ],
    es: [
      `Para este caso, yo pondría "${threadTitle}" al inicio del resumen al proveedor, así todos contestan sobre el mismo escenario.`,
      `Como el evento es en ${conversation.city}, también preguntaría quién estará disponible ese día, no solo quién envía el presupuesto.`,
      `Con ${conversation.budget}, la comparación útil es la tranquila: mismas horas, mismos invitados y mismas responsabilidades.`,
      `Dejaría la conversación abierta hasta recibir respuesta escrita, porque la línea pequeña y poco clara suele ser la que mueve el precio.`
    ],
    fr: [
      `Pour ce cas précis, j'écrirais "${threadTitle}" en haut du récapitulatif au prestataire afin que tout le monde parle du même scénario.`,
      `Comme l'événement est à ${conversation.city}, je demanderais aussi qui sera joignable le jour même, pas seulement qui envoie le devis.`,
      `Avec ${conversation.budget}, la comparaison utile reste simple: mêmes horaires, mêmes invités, mêmes responsabilités.`,
      `Je laisserais la discussion ouverte jusqu'à une réponse écrite, car la petite ligne floue est souvent celle qui fait bouger le prix.`
    ]
  };
  const threadNotes: Record<TranslationLocale, string> = {
    en: `This is my check ${answerAngle} for "${threadTitle}", so the replies stay on the real case rather than a generic Italy event.`,
    es: `Este sería mi punto ${answerAngle} para "${threadTitle}", así las respuestas se quedan en el caso real y no en un evento genérico en Italia.`,
    fr: `C'est mon point ${answerAngle} pour "${threadTitle}", afin de garder les réponses sur le cas réel et non sur un événement générique en Italie.`
  };
  return `${base} ${suffixes[locale][index % suffixes[locale].length]} ${threadNotes[locale]}`;
}

function threadSpecificAnswer(locale: TranslationLocale, content: string, conversation: LocalizedConversation) {
  const threadTitle = conversation.title.trim();
  if (locale === "es") {
    return `${content} En este caso concreto, "${threadTitle}" es la frase que yo usaría para que el proveedor entienda rápido el problema.`;
  }
  if (locale === "fr") {
    return `${content} Dans ce cas précis, "${threadTitle}" est la phrase que j'utiliserais pour que le prestataire comprenne vite le problème.`;
  }
  return `${content} In this thread, "${threadTitle}" is the line I would use so the supplier understands the problem quickly.`;
}

export function localizedConversationAnswers(locale: TranslationLocale, conversation: LocalizedConversation): LocalizedConversationAnswer[] {
  const c = localizedAnswerCopy(locale);
  const bestVotes = Math.max(7, conversation.usefulVotes - 6);
  const target = localizedConversationReplyCount(conversation);
  const answers: LocalizedConversationAnswer[] = [
    {
      author: locale === "es" ? "Carmen" : locale === "fr" ? "Elise" : "Sofia",
      role: roleForConversation(locale, conversation.categorySlug),
      content: conversation.answerPreview,
      usefulVotes: bestVotes,
      notUsefulVotes: Math.max(0, localizedConversationNotUsefulVotes(conversation) - 1),
      isBestAnswer: true
    },
    {
      author: locale === "es" ? "Marco B." : locale === "fr" ? "Marc B." : "Marco B.",
      role: c.planner,
      content: threadSpecificAnswer(locale, categoryAnswer(locale, conversation), conversation),
      usefulVotes: Math.max(5, conversation.usefulVotes - 13),
      notUsefulVotes: localizedConversationNotUsefulVotes(conversation)
    },
    {
      author: conversation.author,
      role: c.authorUpdate,
      content: threadSpecificAnswer(locale, localizedAuthorFollowUp(locale, conversation), conversation),
      usefulVotes: Math.max(4, target + 3),
      notUsefulVotes: Math.max(0, localizedConversationNotUsefulVotes(conversation) - 2)
    }
  ];

  const extraAuthors =
    locale === "es"
      ? ["Sergio", "Marta V.", "planner_en_italia", "Lucia", "Raul", "proveedor_local"]
      : locale === "fr"
        ? ["Nora", "Antoine", "planner_italie", "Claire", "Hugo", "prestataire_local"]
        : ["Nora", "Anthony", "italy_planner", "Claire", "Hugh", "local_supplier"];
  const extraRoles = [c.client, c.planner, roleForConversation(locale, conversation.categorySlug), c.supplier];
  const candidates = localizedExtraAnswerBank(locale, conversation);
  let cursor = stableSmallHash(`${locale}:${conversation.title}`);

  while (answers.length < target) {
    const content = contextualExtraAnswer(locale, candidates[cursor % candidates.length], conversation, answers.length);
    const author = extraAuthors[(cursor + answers.length) % extraAuthors.length];
    const role = extraRoles[(cursor + answers.length) % extraRoles.length];
    answers.push({
      author,
      role,
      content,
      usefulVotes: 3 + ((stableSmallHash(`${content}:${author}`) + answers.length) % 22),
      notUsefulVotes: (stableSmallHash(`${content}:not:${author}`) + answers.length) % 5
    });
    cursor += 1;
  }

  return answers;
}

