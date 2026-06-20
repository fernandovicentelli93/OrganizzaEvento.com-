export const LOCALES = ["it", "en", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "it";

export const localeLabels: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  es: "Español",
  fr: "Français"
};

export const localeShortLabels: Record<Locale, string> = {
  it: "IT",
  en: "EN",
  es: "ES",
  fr: "FR"
};

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && (LOCALES as readonly string[]).includes(value));
}

export function localeFromPathname(pathname: string | null | undefined): Locale {
  const first = pathname?.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

export function withoutLocale(pathname: string | null | undefined) {
  const parts = pathname?.split("/").filter(Boolean) ?? [];
  if (isLocale(parts[0])) return `/${parts.slice(1).join("/")}` || "/";
  return pathname || "/";
}

export const routeKeys = [
  "home",
  "questions",
  "ask",
  "realPrices",
  "topics",
  "magazine",
  "eventGuides",
  "localSuppliers",
  "suppliers",
  "analyzeQuote",
  "findSuppliers",
  "partnerships",
  "faq",
  "rules",
  "privacy",
  "terms",
  "signup",
  "login"
] as const;

export type RouteKey = (typeof routeKeys)[number];

export const staticRouteSegments: Record<Locale, Record<RouteKey, string>> = {
  it: {
    home: "",
    questions: "domande",
    ask: "fai-domanda",
    realPrices: "quanto-costa",
    topics: "categorie",
    magazine: "magazine",
    eventGuides: "guide-eventi",
    localSuppliers: "fornitori-eventi",
    suppliers: "fornitori",
    analyzeQuote: "analizza-preventivo",
    findSuppliers: "trova-fornitori",
    partnerships: "collaborazioni",
    faq: "faq",
    rules: "regole",
    privacy: "privacy",
    terms: "termini",
    signup: "registrati",
    login: "login"
  },
  en: {
    home: "",
    questions: "questions",
    ask: "ask-question",
    realPrices: "real-prices",
    topics: "topics",
    magazine: "magazine",
    eventGuides: "event-guides",
    localSuppliers: "event-suppliers",
    suppliers: "suppliers",
    analyzeQuote: "analyze-quote",
    findSuppliers: "find-suppliers",
    partnerships: "partnerships",
    faq: "faq",
    rules: "rules",
    privacy: "privacy",
    terms: "terms",
    signup: "sign-up",
    login: "login"
  },
  es: {
    home: "",
    questions: "preguntas",
    ask: "hacer-pregunta",
    realPrices: "precios-reales",
    topics: "temás",
    magazine: "revista",
    eventGuides: "guías-eventos",
    localSuppliers: "proveedores-eventos",
    suppliers: "proveedores",
    analyzeQuote: "analizar-presupuesto",
    findSuppliers: "encontrar-proveedores",
    partnerships: "colaboraciones",
    faq: "faq",
    rules: "reglas",
    privacy: "privacidad",
    terms: "terminos",
    signup: "registrarse",
    login: "acceso"
  },
  fr: {
    home: "",
    questions: "questions",
    ask: "poser-question",
    realPrices: "prix-réels",
    topics: "sujets",
    magazine: "magazine",
    eventGuides: "guides-événements",
    localSuppliers: "prestataires-événements",
    suppliers: "prestataires",
    analyzeQuote: "analyser-devis",
    findSuppliers: "trouver-prestataires",
    partnerships: "partenariats",
    faq: "faq",
    rules: "regles",
    privacy: "confidentialité",
    terms: "conditions",
    signup: "inscription",
    login: "connexion"
  }
};

export function localePrefix(locale: Locale) {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

export function localizedStaticPath(locale: Locale, key: RouteKey) {
  const segment = staticRouteSegments[locale][key];
  if (!segment) return `${localePrefix(locale)}/`;
  return `${localePrefix(locale)}/${segment}`;
}

export function languageHomePath(locale: Locale) {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
}

export const headerCopy: Record<
  Locale,
  {
    home: string;
    analyzeQuote: string;
    talkAbout: string;
    signup: string;
    login: string;
    ask: string;
    mobileAsk: string;
    menu: string;
    close: string;
    language: string;
    openConversation: string;
    readDiscussions: string;
    supplierLink: string;
    supplierDescription: string;
    sections: Array<{ key: RouteKey; label: string; intro: string; items: Array<{ key?: RouteKey; href?: string; label: string; description: string }> }>;
  }
> = {
  it: {
    home: "Home",
    analyzeQuote: "Analizza preventivo",
    talkAbout: "Parliamo di...",
    signup: "Iscriviti",
    login: "Accedi",
    ask: "Fai una domanda",
    mobileAsk: "Domanda",
    menu: "Menu",
    close: "Chiudi",
    language: "Lingua",
    openConversation: "Apri una nuova conversazione",
    readDiscussions: "Leggi le discussioni aperte",
    supplierLink: "Sei un fornitore?",
    supplierDescription: "Entra nella community con badge, scheda e risposte utili.",
    sections: [
      {
        key: "realPrices",
        label: "Quanto costa",
        intro: "Budget, preventivi e cifre già viste.",
        items: [
          { key: "realPrices", label: "Tutte le domande sui costi", description: "Cifre e casi concreti" },
          { href: "/domande?category=location&postType=Quanto%20costa", label: "Location", description: "Ville, sale, ristoranti" },
          { href: "/domande?category=catering-menu&postType=Quanto%20costa", label: "Catering e open bar", description: "Menu, bevande e servizio" },
          { href: "/domande?category=musica-dj&postType=Quanto%20costa", label: "Musica e DJ", description: "DJ, band, SIAE" }
        ]
      },
      {
        key: "topics",
        label: "Eventi",
        intro: "Matrimoni, feste private, aziendali e idee.",
        items: [
          { key: "localSuppliers", label: "Fornitori locali", description: "Zone, servizi e richieste mirate" },
          { href: "/categorie/matrimonio", label: "Matrimonio", description: "Discussioni e problemi comuni" },
          { href: "/categorie/compleanni-feste-private", label: "Compleanni e feste private", description: "Discussioni e problemi comuni" },
          { href: "/categorie/eventi-aziendali", label: "Eventi aziendali", description: "Discussioni e problemi comuni" },
          { href: "/categorie/idee-evento", label: "Idee evento", description: "Discussioni e problemi comuni" }
        ]
      },
      {
        key: "magazine",
        label: "Magazine",
        intro: "Guide, storie e approfondimenti editoriali.",
        items: [
          { key: "magazine", label: "Homepage magazine", description: "Ultime guide pubblicate" },
          { key: "eventGuides", label: "Guide pratiche", description: "Pagine utili per decidere meglio" }
        ]
      }
    ]
  },
  en: {
    home: "Home",
    analyzeQuote: "Analyze quote",
    talkAbout: "Talk about...",
    signup: "Sign up",
    login: "Log in",
    ask: "Ask a question",
    mobileAsk: "Ask",
    menu: "Menu",
    close: "Close",
    language: "Language",
    openConversation: "Open a new conversation",
    readDiscussions: "Read open discussions",
    supplierLink: "Are you a supplier?",
    supplierDescription: "Join the community with a profile, badges and useful answers.",
    sections: [
      {
        key: "realPrices",
        label: "How much does it cost",
        intro: "Budgets, quotes and numbers already discussed.",
        items: [
          { key: "realPrices", label: "All cost questions", description: "Concrete numbers and cases" },
          { key: "localSuppliers", label: "Local suppliers", description: "Services and areas" },
          { key: "analyzeQuote", label: "Analyze an Italian quote", description: "Compare price with Italian clients and suppliers" }
        ]
      },
      {
        key: "topics",
        label: "Events",
        intro: "Weddings, private parties, corporate events and ideas.",
        items: [
          { key: "topics", label: "All topics", description: "Choose the right conversation" },
          { key: "questions", label: "Community questions", description: "Read practical cases" },
          { key: "ask", label: "Ask the community", description: "No mandatory registration" }
        ]
      },
      {
        key: "magazine",
        label: "Magazine",
        intro: "Guides, stories and editorial insights.",
        items: [
          { key: "magazine", label: "Magazine homepage", description: "Latest editorial content" },
          { key: "eventGuides", label: "Practical guides", description: "Local guides for clearer decisions" }
        ]
      }
    ]
  },
  es: {
    home: "Inicio",
    analyzeQuote: "Analizar presupuesto",
    talkAbout: "Hablemos de...",
    signup: "Registrarse",
    login: "Acceso",
    ask: "Hacer una pregunta",
    mobileAsk: "Pregunta",
    menu: "Menú",
    close: "Cerrar",
    language: "Idioma",
    openConversation: "Abrir una nueva conversación",
    readDiscussions: "Leer conversaciones abiertas",
    supplierLink: "¿Eres proveedor?",
    supplierDescription: "Entra en la comunidad con ficha, insignias y respuestas útiles.",
    sections: [
      {
        key: "realPrices",
        label: "Cuánto cuesta",
        intro: "Presupuestos, costes y cifras ya comentadas.",
        items: [
          { key: "realPrices", label: "Todas las preguntas de costes", description: "Casos y cifras concretas" },
          { key: "localSuppliers", label: "Proveedores locales", description: "Servicios y zonas" },
          { key: "analyzeQuote", label: "Analizar presupuesto italiano", description: "Compara precio con clientes y proveedores italianos" }
        ]
      },
      {
        key: "topics",
        label: "Eventos",
        intro: "Bodas, fiestas privadas, eventos de empresa e ideas.",
        items: [
          { key: "topics", label: "Todos los temás", description: "Elige la conversación adecuada" },
          { key: "questions", label: "Preguntas de la comunidad", description: "Lee casos prácticos" },
          { key: "ask", label: "Pregunta a la comunidad", description: "Sin registro obligatorio" }
        ]
      },
      {
        key: "magazine",
        label: "Revista",
        intro: "Guías, historias y contenido editorial.",
        items: [
          { key: "magazine", label: "Inicio revista", description: "Últimos contenidos" },
          { key: "eventGuides", label: "Guías prácticas", description: "Guías locales para decidir mejor" }
        ]
      }
    ]
  },
  fr: {
    home: "Accueil",
    analyzeQuote: "Analyser un devis",
    talkAbout: "Parlons de...",
    signup: "Inscription",
    login: "Connexion",
    ask: "Poser une question",
    mobileAsk: "Question",
    menu: "Menu",
    close: "Fermer",
    language: "Langue",
    openConversation: "Ouvrir une nouvelle discussion",
    readDiscussions: "Lire les discussions ouvertes",
    supplierLink: "Vous êtes prestataire ?",
    supplierDescription: "Rejoignez la communauté avec profil, badges et réponses utiles.",
    sections: [
      {
        key: "realPrices",
        label: "Combien ça coûte",
        intro: "Coûts, devis et montants déjà discutes.",
        items: [
          { key: "realPrices", label: "Toutes les questions de coût", description: "Cas et chiffres concrets" },
          { key: "localSuppliers", label: "Prestataires locaux", description: "Services et zones" },
          { key: "analyzeQuote", label: "Analyser un devis italien", description: "Comparer prix avec clients et prestataires italiens" }
        ]
      },
      {
        key: "topics",
        label: "événements",
        intro: "Mariages, fêtes privées, événements d'entreprise et idées.",
        items: [
          { key: "topics", label: "Tous les sujets", description: "Choisir la bonne discussion" },
          { key: "questions", label: "Questions de la communauté", description: "Lire des cas pratiques" },
          { key: "ask", label: "Demander è la communauté", description: "Sans inscription obligatoire" }
        ]
      },
      {
        key: "magazine",
        label: "Magazine",
        intro: "Guides, récits et contenus éditoriaux.",
        items: [
          { key: "magazine", label: "Accueil magazine", description: "Dernières publications" },
          { key: "eventGuides", label: "Guides pratiques", description: "Guides locaux pour mieux décider" }
        ]
      }
    ]
  }
};

export const footerCopy: Record<
  Locale,
  {
    description: string;
    collaboration: string;
    contacts: string;
    contactText: string;
    legal: string;
  }
> = {
  it: {
    description: "OrganizzaEvento.com è una community indipendente per condividere dubbi, consigli ed esperienze sull'organizzazione di eventi.",
    collaboration: "In collaborazione con",
    contacts: "Contatti",
    contactText: "Per assistenza puoi usare il modulo supporto oppure scrivere a",
    legal: "Link legali"
  },
  en: {
    description: "OrganizzaEvento.com is an independent community for sharing questions, advice and real experiences about event planning.",
    collaboration: "In partnership with",
    contacts: "Contact",
    contactText: "For support, use the help form or write to",
    legal: "Legal links"
  },
  es: {
    description: "OrganizzaEvento.com es una comunidad independiente para compartir dudas, consejos y experiencias reales sobre organización de eventos.",
    collaboration: "En colaboración con",
    contacts: "Contacto",
    contactText: "Para recibir ayuda, usa el formulario de soporte o escribe a",
    legal: "Enlaces legales"
  },
  fr: {
    description: "OrganizzaEvento.com est une communauté indépendante pour partager questions, conseils et expériences réelles autour de l'organisation d'événements.",
    collaboration: "En collaboration avec",
    contacts: "Contact",
    contactText: "Pour obtenir de l'aide, utilisez le formulaire de support ou écrivez ?",
    legal: "Liens légaux"
  }
};
