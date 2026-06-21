import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoogleIcon } from "@/components/GoogleIcon";
import { LocalizedRegisterForm } from "@/components/LocalizedRegisterForm";
import { QuoteAnalyzer } from "@/components/QuoteAnalyzer";
import { QuoteAnalysisSeoPage } from "@/components/QuoteAnalysisSeoPage";
import { VibesSupplierSearch } from "@/components/VibesSupplierSearch";
import { VibesSupplierCta } from "@/components/VibesSupplierCta";
import { getPublishedLandingPages, type LandingPage } from "@/content/landing-pages";
import { getFeaturedLocalSeoPages, getLocalSeoPagesByRegion, localSeoCategories, type LocalSeoPage } from "@/content/local-seo";
import { getQuoteAnalysisHubPage, quoteAnalysisAlternates } from "@/content/quote-analysis";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import {
  localizedCommunity,
  localizedConversationAnswers,
  localizedConversationHref,
  localizedConversationNotUsefulVotes,
  localizedConversationReplyCount,
  type LocalizedConversation,
  type LocalizedMagazineArticle
} from "@/lib/localized-community";
import { HERO_IMAGE, HOME_STORY_IMAGES } from "@/lib/magazine";
import { faqMainEntity, uniqueSuggestedAnswers } from "@/lib/structured-data";
import { LOCALES, Locale, RouteKey, localeLabels, localeShortLabels, localizedStaticPath } from "@/lib/i18n-basic";
import {
  localeFromParam,
  localizedCategorySlug,
  localizedLocalSeoSlug,
  localizedMetadata,
  localizedPath,
  resolveLocalizedRoute,
  t
} from "@/lib/i18n-routing";
import ItalianQuestionDetailPage from "@/app/domande/[slug]/page";

type PageProps = {
  params: Promise<{ locale: string; path?: string[] }>;
};

type TranslationLocale = "en" | "es" | "fr";
type ResolvedRoute = NonNullable<ReturnType<typeof resolveLocalizedRoute>>;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://organizzaevento.com";

type FallbackLocalizedQuestion = {
  type: "question";
  slug: string;
};

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function findLocalizedFallbackQuestion(slug: string) {
  try {
    return await prisma.question.findFirst({
      where: { slug },
      select: { slug: true }
    });
  } catch (error) {
    console.error("Errore lookup discussione fallback", { slug, error });
    return null;
  }
}

async function resolveFallbackLocalizedRoute(locale: TranslationLocale, path: string[]) {
  if (path.length < 2) return null;
  const [first, second] = path;
  const firstSegment = localizedStaticPath(locale, "questions").split("/").filter(Boolean).at(-1);
  if (firstSegment !== first || !second) return null;
  const slug = safeDecode(second);
  if (!slug) return null;
  const found = await findLocalizedFallbackQuestion(slug);
  if (!found) return null;
  return { type: "question", slug: found.slug } as FallbackLocalizedQuestion;
}

async function getInternationalGuideForPath(locale: TranslationLocale, path: string[]) {
  if (locale !== "en" || path[0] !== "event-guides") return null;
  const guideModule = await import("@/content/international-seo");
  const page = guideModule.getInternationalEventGuideByPath(path);
  return page ? { page, canonical: guideModule.getInternationalEventGuideCanonicalUrl(page) } : null;
}

type StaticPageCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  bullets: string[];
  cta: string;
};

type LocaleCopy = {
  heroKicker: string;
  heroTitle: string;
  heroText: string;
  noSignup: string;
  ask: string;
  explore: string;
  supplierSearchCta: string;
  languageTitle: string;
  languageText: string;
  activeDiscussions: string;
  problemsTitle: string;
  pricesTitle: string;
  guidesTitle: string;
  suppliersTitle: string;
  magazineTitle: string;
  faqTitle: string;
  budget: string;
  suppliers: string;
  timeline: string;
  community: string;
  staticDescriptions: Record<Exclude<RouteKey, "home">, StaticPageCopy>;
  guide: {
    eyebrow: string;
    intro: (eventType: string, place: string) => string;
    checklist: string;
    mistakes: string;
    community: string;
    checklistItems: string[];
    mistakeItems: string[];
  };
  localSeo: {
    eyebrow: string;
    h1Suffix: string;
    intro: (category: string, place: string) => string;
    checklistTitle: string;
    communityTitle: string;
    faqTitle: string;
    ctaTitle: string;
    ctaText: string;
    checks: string[];
    cases: string[];
    questions: string[];
  };
};

const cityNames: Record<TranslationLocale, Record<string, string>> = {
  en: {
    Roma: "Rome",
    Milano: "Milan",
    Napoli: "Naples",
    Torino: "Turin",
    Firenze: "Florence",
    Genova: "Genoa",
    Venezia: "Venice",
    "Lago di Como": "Lake Como"
  },
  es: {
    Roma: "Roma",
    Milano: "Milan",
    Napoli: "Nápoles",
    Torino: "Turin",
    Firenze: "Florencia",
    Genova: "Genova",
    Venezia: "Venecia",
    "Lago di Como": "Lago de Como"
  },
  fr: {
    Roma: "Rome",
    Milano: "Milan",
    Napoli: "Naples",
    Torino: "Turin",
    Firenze: "Florence",
    Genova: "Genes",
    Venezia: "Venise",
    "Lago di Como": "Lac de Come"
  }
};

function placeName(locale: TranslationLocale, value: string) {
  return cityNames[locale][value] ?? value;
}

const copy: Record<TranslationLocale, LocaleCopy> = {
  en: {
    heroKicker: "Real questions, useful answers",
    heroTitle: "Plan your event in Italy with trusted local suppliers.",
    heroText:
      "Ask practical questions, compare real quotes and find your way through venues, catering, music and event suppliers in Italy.",
    noSignup: "No mandatory registration: read, search and ask whenever you need.",
    ask: "Ask a question",
    explore: "Explore topics",
    supplierSearchCta: "Find Italian suppliers",
    languageTitle: "Choose your language",
    languageText: "Italian remains available on the main version. Choose the language that makes planning easier for you.",
    activeDiscussions: "Open community topics",
    problemsTitle: "Four practical paths",
    pricesTitle: "How much does it cost",
    guidesTitle: "Event guides",
    suppliersTitle: "Local suppliers",
    magazineTitle: "Magazine",
    faqTitle: "FAQ",
    budget: "Budget",
    suppliers: "Suppliers",
    timeline: "Timeline",
    community: "Community",
    staticDescriptions: {
      questions: {
        title: "Event planning questions",
        description: "Read practical event planning questions and choose the right conversation before asking the community.",
        h1: "Read practical event planning conversations.",
        intro: "Use this area to understand what people ask about budgets, venues, catering, music, suppliers and timing.",
        bullets: ["Search for a similar case first.", "Open a new question when you need a specific answer.", "Add city, budget and number of guests."],
        cta: "Ask the community"
      },
      ask: {
        title: "Ask the event community",
        description: "Ask a practical event planning question without mandatory registration.",
        h1: "Ask the community.",
        intro: "Write the event type, city, approximate budget and the point you need to clarify.",
        bullets: ["Do not publish private data.", "Remove supplier names if you discuss a quote.", "The more concrete the case, the better the answers."],
        cta: "Start a question"
      },
      realPrices: {
        title: "How much does an event in Italy cost",
        description: "Compare event costs in Italy, quote items, extras and practical budgets shared by the community.",
        h1: "How much does it cost",
        intro: "Read chat-style questions about venues, catering, music, photo, open bar and supplier prices in Italy. This is not a paid section: it helps you compare real quote details before confirming.",
        bullets: ["Check what is included.", "Ask about extra hours and staff.", "Compare only similar quotes."],
        cta: "Analyze a quote"
      },
      topics: {
        title: "Event topics",
        description: "Choose the right event topic: weddings, private parties, corporate events and ideas.",
        h1: "Choose the right conversation.",
        intro: "Start from the event type, then open the most useful discussion area.",
        bullets: ["Weddings", "Birthdays and private parties", "Corporate events", "Event ideas"],
        cta: "See topics"
      },
      magazine: {
        title: "Event planning magazine",
        description: "Editorial guides and practical stories for events, weddings, private parties and suppliers.",
        h1: "Read guides before deciding.",
        intro: "The magazine gives context and method. The community helps with the specific case.",
        bullets: ["Costs and budgets", "Weddings and destination events", "Private parties", "Corporate events"],
        cta: "Open the guides"
      },
      eventGuides: {
        title: "Event guides",
        description: "Local and practical event guides for cities, regions, suppliers and budgets.",
        h1: "Local guides to decide faster.",
        intro: "Browse guides by city, event type and problem: costs, venues, catering, music, open bar and suppliers.",
        bullets: ["City guides", "Regional guides", "Supplier guides", "Budget guides"],
        cta: "Browse guides"
      },
      localSuppliers: {
        title: "Event suppliers",
        description: "Find practical guides for local event suppliers and services.",
        h1: "Understand what to ask suppliers.",
        intro: "Before sending a request, clarify service, area, timing, budget and what must be included.",
        bullets: ["Venues", "Catering", "Music", "Photography", "Event planners"],
        cta: "Find suppliers"
      },
      suppliers: {
        title: "Supplier area",
        description: "A simple community-first area for event suppliers.",
        h1: "Answer where you can really help.",
        intro: "Suppliers can build trust by answering practical questions clearly and respectfully.",
        bullets: ["Complete your profile.", "Follow relevant conversations.", "Give useful answers.", "Earn reputation badges."],
        cta: "Create a supplier profile"
      },
      analyzeQuote: {
        title: "Analyze my Italian event quote",
        description: "Upload or paste an Italian event quote, hide sensitive data, compare it with Italian clients and suppliers and understand if the price makes sense.",
        h1: "Analyze my Italian event quote.",
        intro: "Upload a photo, PDF, Word file or text. The page reads the available lines, hides sensitive data and prepares real questions for the Italian event market.",
        bullets: ["Included items", "Possible extras", "Italian market questions", "Discussion with clients and suppliers"],
        cta: "Analyze a quote"
      },
      findSuppliers: {
        title: "Find Italian event suppliers",
        description: "Send a simple request to find suitable Italian event suppliers.",
        h1: "Find Italian suppliers for your event.",
        intro: "Tell us the city, event type, guest count and budget so the request can point toward suitable Italian suppliers.",
        bullets: ["Event type", "City or region", "Number of guests", "Budget range"],
        cta: "Find Italian suppliers"
      },
      partnerships: {
        title: "Advertising partnerships",
        description: "Advertising and partnership opportunities on OrganizzaEvento.com.",
        h1: "Partnerships for event brands.",
        intro: "A discreet area for collaborations, banners and visibility for event-related services.",
        bullets: ["Editorial visibility", "Banner placements", "Supplier audience", "Community-first context"],
        cta: "Contact us"
      },
      faq: {
        title: "Frequently asked questions",
        description: "Common questions about OrganizzaEvento.com and the community.",
        h1: "Quick answers before you start.",
        intro: "Here are the essential rules for using the platform well.",
        bullets: ["No mandatory registration.", "Do not publish third-party personal data.", "Use reports for problematic content."],
        cta: "Ask a question"
      },
      rules: {
        title: "Community rules",
        description: "Simple rules for using the event planning community respectfully.",
        h1: "Community rules.",
        intro: "The platform works when people ask clearly and answer respectfully.",
        bullets: ["No insults.", "No politics.", "No spam.", "No unproven accusations.", "No personal data of third parties."],
        cta: "Read questions"
      },
      privacy: {
        title: "Privacy policy",
        description: "Basic privacy information for OrganizzaEvento.com.",
        h1: "Privacy policy.",
        intro: "This page explains how contact details, accounts, community content and support requests can be handled.",
        bullets: ["Support forms may collect contact details.", "Account forms collect profile data.", "Analytics may measure aggregate visits."],
        cta: "Contact support"
      },
      terms: {
        title: "Terms",
        description: "Basic terms for using OrganizzaEvento.com.",
        h1: "Terms of use.",
        intro: "These terms explain how to use the community respectfully and what content can be moderated.",
        bullets: ["Use the site responsibly.", "Do not publish illegal or offensive content.", "Content can be moderated."],
        cta: "Back to home"
      },
      signup: {
        title: "Sign up",
        description: "Create an optional customer or supplier account.",
        h1: "Sign up only if you want to keep everything organized.",
        intro: "Registration is optional. You can still read and ask without an account.",
        bullets: ["Customer badge", "Supplier badge", "Profile photo", "Short biography", "Account deletion"],
        cta: "Create account"
      },
      login: {
        title: "Log in",
        description: "Access your customer or supplier dashboard.",
        h1: "Log in to your dashboard.",
        intro: "Use your email and password to manage your profile, badge and activity.",
        bullets: ["Customer dashboard", "Supplier dashboard", "Profile settings", "Account deletion"],
        cta: "Log in"
      }
    },
    guide: {
      eyebrow: "Practical guide",
      intro: (eventType, place) => `A practical guide for ${eventType.toLowerCase()} in ${place}: budget, timing, suppliers and questions to ask before deciding.`,
      checklist: "Checklist before confirming",
      mistakes: "Mistakes to avoid",
      community: "Turn your case into a community question",
      checklistItems: ["Define the type of event and guest count.", "Ask for comparable quotes.", "Check extra hours, staff and cancellation rules.", "Keep a written backup plan."],
      mistakeItems: ["Comparing offers with different inclusions.", "Confirming without a clear payment schedule.", "Ignoring rain, noise or timing constraints.", "Leaving final guest numbers too late."]
    },
    localSeo: {
      eyebrow: "Local supplier guide",
      h1Suffix: "how to choose without wasting time",
      intro: (category, place) => `${place} needs a clear approach when you compare ${category}. Use this page to prepare better questions before contacting suppliers.`,
      checklistTitle: "What to check before choosing",
      communityTitle: "Cases worth discussing",
      faqTitle: "Questions before sending a request",
      ctaTitle: "Need suppliers for your event?",
      ctaText: "Prepare a clear request with city, budget, number of guests and type of service.",
      checks: ["Availability on the exact date", "What is included in the base price", "Travel, setup and overtime costs", "Cancellation and deposit conditions", "Similar events already handled", "Response times before the event"],
      cases: ["A quote looks high but includes coordination.", "Two suppliers offer different service hours.", "The venue requires specific technical equipment."],
      questions: ["What is included in the price?", "Which extras are charged separately?", "How many similar events have you handled?"]
    }
  },
  es: {
    heroKicker: "Preguntas reales, respuestas útiles",
    heroTitle: "Organiza tu evento en Italia con proveedores locales de confianza.",
    heroText:
      "Haz preguntas prácticas, compara presupuestos reales y oriéntate entre lugares, catering, música y proveedores para eventos en Italia.",
    noSignup: "Sin registro obligatorio: lee, busca y pregunta cuando lo necesites.",
    ask: "Hacer una pregunta",
    explore: "Explorar temas",
    supplierSearchCta: "Encontrar proveedores italianos",
    languageTitle: "Elige tu idioma",
    languageText: "El italiano sigue disponible como versión principal. Elige el idioma que te ayude a organizar con más claridad.",
    activeDiscussions: "Temas abiertos de la comunidad",
    problemsTitle: "Cuatro caminos prácticos",
    pricesTitle: "Cuánto cuesta",
    guidesTitle: "Guías de eventos",
    suppliersTitle: "Proveedores locales",
    magazineTitle: "Revista",
    faqTitle: "Preguntas frecuentes",
    budget: "Presupuesto",
    suppliers: "Proveedores",
    timeline: "Calendario",
    community: "Comunidad",
    staticDescriptions: {
      questions: {
        title: "Preguntas sobre organización de eventos",
        description: "Lee preguntas prácticas sobre eventos y elige la conversación adecuada antes de preguntar.",
        h1: "Lee conversaciones prácticas sobre eventos.",
        intro: "Aquí puedes entender qué preguntan otras personas sobre presupuestos, lugares, catering, música, proveedores y tiempos.",
        bullets: ["Busca primero un caso parecido.", "Abre una pregunta nueva si necesitas una respuesta concreta.", "Añade ciudad, presupuesto y número de invitados."],
        cta: "Preguntar a la comunidad"
      },
      ask: {
        title: "Pregunta a la comunidad de eventos",
        description: "Haz una pregunta práctica sobre eventos sin registro obligatorio.",
        h1: "Pregunta a la comunidad.",
        intro: "Escribe el tipo de evento, ciudad, presupuesto aproximado y el punto que necesitas aclarar.",
        bullets: ["No publiques datos privados.", "Elimina nombres de proveedores si hablas de un presupuesto.", "Cuanto más concreto sea el caso, mejores serán las respuestas."],
        cta: "Empezar una pregunta"
      },
      realPrices: {
        title: "Cuánto cuesta organizar un evento en Italia",
        description: "Compara costes de eventos en Italia, partidas de presupuesto, extras y cifras compartidas por la comunidad.",
        h1: "Cuánto cuesta",
        intro: "Lee conversaciones sobre costes de lugares, catering, música, fotografía, barra libre y proveedores en Italia. No es una sección de pago: sirve para comparar detalles reales antes de confirmar.",
        bullets: ["Comprueba qué incluye.", "Pregunta por horas extra y personal.", "Compara solo presupuestos parecidos."],
        cta: "Analizar un presupuesto"
      },
      topics: {
        title: "Temas de eventos",
        description: "Elige el tema correcto: bodas, fiestas privadas, eventos de empresa e ideas.",
        h1: "Elige la conversación correcta.",
        intro: "Empieza por el tipo de evento y abre el área de discusión más útil.",
        bullets: ["Bodas", "Cumpleaños y fiestas privadas", "Eventos de empresa", "Ideas para eventos"],
        cta: "Ver temas"
      },
      magazine: {
        title: "Revista de organización de eventos",
        description: "Guías editoriales e historias prácticas para eventos, bodas, fiestas privadas y proveedores.",
        h1: "Lee guías antes de decidir.",
        intro: "La revista aporta contexto y método. La comunidad ayuda con el caso específico.",
        bullets: ["Costes y presupuestos", "Bodas y eventos destino", "Fiestas privadas", "Eventos de empresa"],
        cta: "Abrir guías"
      },
      eventGuides: {
        title: "Guías de eventos",
        description: "Guías locales y prácticas para ciudades, regiones, proveedores y presupuestos.",
        h1: "Guías locales para decidir antes.",
        intro: "Explora guías por ciudad, tipo de evento y problema: costes, lugares, catering, música, barra libre y proveedores.",
        bullets: ["Guías por ciudad", "Guías regionales", "Guías de proveedores", "Guías de presupuesto"],
        cta: "Ver guías"
      },
      localSuppliers: {
        title: "Proveedores de eventos",
        description: "Encuentra guías prácticas sobre proveedores locales y servicios para eventos.",
        h1: "Entiende qué preguntar a los proveedores.",
        intro: "Antes de enviar una solicitud, aclara servicio, zona, tiempos, presupuesto y lo que debe estar incluido.",
        bullets: ["Lugares", "Catering", "Musica", "Fotografia", "Organizadores de eventos"],
        cta: "Encontrar proveedores"
      },
      suppliers: {
        title: "Area proveedores",
        description: "Un area sencilla y orientada a comunidad para proveedores de eventos.",
        h1: "Responde dónde puedes ayudar de verdad.",
        intro: "Los proveedores pueden generar confianza respondiendo con claridad y respeto.",
        bullets: ["Completa tu perfil.", "Sigue conversaciones relevantes.", "Da respuestas útiles.", "Consigue insignias de reputación."],
        cta: "Crear perfil de proveedor"
      },
      analyzeQuote: {
        title: "Analiza mi presupuesto italiano",
        description: "Sube o pega un presupuesto de evento en Italia, oculta datos sensibles, compáralo con clientes y proveedores italianos y entiende si el precio tiene sentido.",
        h1: "Analiza mi presupuesto italiano.",
        intro: "Sube una foto, PDF, Word o texto. La página lee las partidas disponibles, oculta los datos sensibles y prepara preguntas reales para el mercado italiano.",
        bullets: ["Partidas incluidas", "Posibles extras", "Preguntas para el mercado italiano", "Conversacion con clientes y proveedores"],
        cta: "Analizar presupuesto"
      },
      findSuppliers: {
        title: "Encontrar proveedores italianos para eventos",
        description: "Envia una solicitud sencilla para encontrar proveedores italianos adecuados.",
        h1: "Encuentra proveedores italianos para tu evento.",
        intro: "Indica ciudad, tipo de evento, invitados y presupuesto para orientar la solicitud hacia proveedores italianos adecuados.",
        bullets: ["Tipo de evento", "Ciudad o region", "Numero de invitados", "Rango de presupuesto"],
        cta: "Encontrar proveedores italianos"
      },
      partnerships: {
        title: "Colaboraciones publicitarias",
        description: "Oportunidades de publicidad y colaboracion en OrganizzaEvento.com.",
        h1: "Colaboraciones para marcas de eventos.",
        intro: "Un area discreta para colaboraciones, banners y visibilidad para servicios del sector eventos.",
        bullets: ["Visibilidad editorial", "Espacios banner", "Audiencia de proveedores", "Contexto community-first"],
        cta: "Contactar"
      },
      faq: {
        title: "Preguntas frecuentes",
        description: "Preguntas comunes sobre OrganizzaEvento.com y la comunidad.",
        h1: "Respuestas rápidas antes de empezar.",
        intro: "Estas son las reglas esenciales para usar bien la plataforma.",
        bullets: ["No hay registro obligatorio.", "No publiques datos personales de terceros.", "Usa los reportes para contenido problemático."],
        cta: "Hacer una pregunta"
      },
      rules: {
        title: "Reglas de la comunidad",
        description: "Reglas sencillas para usar la comunidad de eventos con respeto.",
        h1: "Reglas de la comunidad.",
        intro: "La plataforma funciona cuando las personas preguntan con claridad y responden con respeto.",
        bullets: ["Sin insultos.", "Sin política.", "Sin spam.", "Sin acusaciones no demostradas.", "Sin datos personales de terceros."],
        cta: "Leer preguntas"
      },
      privacy: {
        title: "Política de privacidad",
        description: "Información básica de privacidad para OrganizzaEvento.com.",
        h1: "Política de privacidad.",
        intro: "Esta página explica cómo se gestionan contactos, cuentas, contenido de la comunidad y solicitudes de soporte.",
        bullets: ["Los formularios de soporte pueden recoger datos de contacto.", "Los formularios de cuenta recogen datos de perfil.", "La analítica puede medir visitas agregadas."],
        cta: "Contactar soporte"
      },
      terms: {
        title: "Términos",
        description: "Términos básicos para usar OrganizzaEvento.com.",
        h1: "Términos de uso.",
        intro: "Estos términos explican cómo usar la comunidad con respeto y qué contenido puede moderarse.",
        bullets: ["Usa el sitio de forma responsable.", "No publiques contenido ilegal u ofensivo.", "El contenido puede ser moderado."],
        cta: "Volver al inicio"
      },
      signup: {
        title: "Registrarse",
        description: "Crea una cuenta opcional como cliente o proveedor.",
        h1: "Regístrate solo si quieres tener todo ordenado.",
        intro: "El registro es opcional. Puedes leer y preguntar también sin cuenta.",
        bullets: ["Insignia cliente", "Insignia proveedor", "Foto de perfil", "Biografía breve", "Eliminación de cuenta"],
        cta: "Crear cuenta"
      },
      login: {
        title: "Acceso",
        description: "Accede a tu panel de cliente o proveedor.",
        h1: "Accede a tu panel.",
        intro: "Usa email y contraseña para gestionar perfil, insignia y actividad.",
        bullets: ["Panel cliente", "Panel proveedor", "Ajustes de perfil", "Eliminación de cuenta"],
        cta: "Entrar"
      }
    },
    guide: {
      eyebrow: "Guía práctica",
      intro: (eventType, place) => `Una guía práctica para ${eventType.toLowerCase()} en ${place}: presupuesto, tiempos, proveedores y preguntas antes de decidir.`,
      checklist: "Checklist antes de confirmar",
      mistakes: "Errores que evitar",
      community: "Convierte tu caso en una pregunta para la comunidad",
      checklistItems: ["Define tipo de evento y número de invitados.", "Pide presupuestos comparables.", "Revisa horas extra, personal y condiciones de cancelación.", "Prepara un plan alternativo por escrito."],
      mistakeItems: ["Comparar ofertas con partidas diferentes.", "Confirmar sin calendario de pagos claro.", "Ignorar lluvia, ruido o límites de horario.", "Cerrar demasiado tarde el número de invitados."]
    },
    localSeo: {
      eyebrow: "Guía local de proveedores",
      h1Suffix: "como elegir sin perder tiempo",
      intro: (category, place) => `${place} necesita un enfoque claro cuando comparas ${category}. Usa esta página para preparar mejores preguntas antes de contactar proveedores.`,
      checklistTitle: "Qué revisar antes de elegir",
      communityTitle: "Casos que merece la pena comentar",
      faqTitle: "Preguntas antes de enviar una solicitud",
      ctaTitle: "¿Buscas proveedores para tu evento?",
      ctaText: "Prepara una solicitud clara con ciudad, presupuesto, invitados y tipo de servicio.",
      checks: ["Disponibilidad en la fecha exacta", "Qué incluye el precio base", "Costes de desplazamiento, montaje y horas extra", "Condiciones de cancelación y depósito", "Eventos similares ya realizados", "Tiempos de respuesta antes del evento"],
      cases: ["Un presupuesto parece alto pero incluye coordinación.", "Dos proveedores ofrecen horas de servicio distintas.", "El lugar exige material técnico específico."],
      questions: ["¿Qué incluye el precio?", "¿Qué extras se cobran aparte?", "¿Cuántos eventos similares habéis realizado?"]
    }
  },
  fr: {
    heroKicker: "Questions réelles, réponses utiles",
    heroTitle: "Planifiez votre événement en Italie avec des prestataires locaux de confiance.",
    heroText:
      "Posez des questions pratiques, comparez des devis réels et avancez plus clairement entre lieux, traiteurs, musique et prestataires événementiels en Italie.",
    noSignup: "Aucune inscription obligatoire : lisez, cherchez et posez une question quand vous en avez besoin.",
    ask: "Poser une question",
    explore: "Explorer les sujets",
    supplierSearchCta: "Trouver des prestataires italiens",
    languageTitle: "Choisissez votre langue",
    languageText: "L'italien reste disponible comme version principale. Choisissez la langue qui rend l'organisation plus simple pour vous.",
    activeDiscussions: "Sujets ouverts dans la communauté",
    problemsTitle: "Quatre parcours pratiques",
    pricesTitle: "Combien ça coûte",
    guidesTitle: "Guides événementiels",
    suppliersTitle: "Prestataires locaux",
    magazineTitle: "Magazine",
    faqTitle: "FAQ",
    budget: "Budget",
    suppliers: "Prestataires",
    timeline: "Calendrier",
    community: "Communauté",
    staticDescriptions: {
      questions: {
        title: "Questions sur l'organisation d'événements",
        description: "Lisez des questions pratiques et choisissez la bonne discussion avant de demander à la communauté.",
        h1: "Lisez des discussions pratiques sur les événements.",
        intro: "Cette zone aide à comprendre les questions sur budgets, lieux, traiteurs, musique, prestataires et délais.",
        bullets: ["Cherchez d'abord un cas similaire.", "Ouvrez une nouvelle question si vous avez besoin d'une réponse précise.", "Ajoutez ville, budget et nombre d'invités."],
        cta: "Demander à la communauté"
      },
      ask: {
        title: "Poser une question à la communauté",
        description: "Posez une question pratique sur l'organisation d'événements sans inscription obligatoire.",
        h1: "Posez une question à la communauté.",
        intro: "Indiquez le type d'événement, la ville, le budget approximatif et le point à clarifier.",
        bullets: ["Ne publiez pas de données privées.", "Retirez les noms de prestataires si vous parlez d'un devis.", "Plus le cas est concret, meilleures seront les réponses."],
        cta: "Commencer une question"
      },
      realPrices: {
        title: "Combien coûte un événement en Italie",
        description: "Comparez coûts d'événements en Italie, lignes de devis, extras et budgets partages par la communauté.",
        h1: "Combien ça coûte",
        intro: "Lisez des discussions sur les coûts des lieux, traiteurs, musique, photo, open bar et prestataires en Italie. Ce n'est pas une section payante: elle aide à comparer les détails réels avant de confirmer.",
        bullets: ["Vérifiez ce qui est inclus.", "Demandez les heures supplémentaires et le personnel.", "Comparez uniquement des devis similaires."],
        cta: "Analyser un devis"
      },
      topics: {
        title: "Sujets événementiels",
        description: "Choisissez le bon sujet : mariages, fêtes privées, événements d'entreprise et idées.",
        h1: "Choisissez la bonne discussion.",
        intro: "Commencez par le type d'événement, puis ouvrez la zone de discussion la plus utile.",
        bullets: ["Mariages", "Anniversaires et fêtes privées", "Événements d'entreprise", "Idées d'événement"],
        cta: "Voir les sujets"
      },
      magazine: {
        title: "Magazine organisation d'événements",
        description: "Guides éditoriaux et récits pratiques pour événements, mariages, fêtes privées et prestataires.",
        h1: "Lire les guides avant de décider.",
        intro: "Le magazine donne le contexte et la méthode. La communauté aide sur le cas précis.",
        bullets: ["Coûts et budgets", "Mariages et événements destination", "Fêtes privées", "Événements d'entreprise"],
        cta: "Ouvrir les guides"
      },
      eventGuides: {
        title: "Guides événementiels",
        description: "Guides locaux et pratiques pour villes, régions, prestataires et budgets.",
        h1: "Guides locaux pour décider plus vite.",
        intro: "Parcourez les guides par ville, type d'événement et problème : coûts, lieux, traiteur, musique, open bar et prestataires.",
        bullets: ["Guides par ville", "Guides régionaux", "Guides prestataires", "Guides budget"],
        cta: "Parcourir les guides"
      },
      localSuppliers: {
        title: "Prestataires événementiels",
        description: "Trouvez des guides pratiques sur les prestataires locaux et services événementiels.",
        h1: "Comprendre quoi demander aux prestataires.",
        intro: "Avant d'envoyer une demande, clarifiez service, zone, délais, budget et éléments inclus.",
        bullets: ["Lieux", "Traiteur", "Musique", "Photographie", "Organisateurs d'événements"],
        cta: "Trouver des prestataires"
      },
      suppliers: {
        title: "Espace prestataires",
        description: "Un espace simple et community-first pour les prestataires événementiels.",
        h1: "Répondez là où vous pouvez vraiment aider.",
        intro: "Les prestataires peuvent construire la confiance avec des réponses claires, utiles et respectueuses.",
        bullets: ["Complétez votre profil.", "Suivez les discussions pertinentes.", "Donnez des réponses utiles.", "Gagnez des badges de réputation."],
        cta: "Créer un profil prestataire"
      },
      analyzeQuote: {
        title: "Analyser mon devis italien",
        description: "Ajoutez ou collez un devis événementiel en Italie, masquez les données sensibles, comparez-le avec clients et prestataires italiens et comprenez si le prix est cohérent.",
        h1: "Analyser mon devis italien.",
        intro: "Ajoutez une photo, un PDF, un Word ou du texte. La page lit les lignes disponibles, masque les données sensibles et prépare des questions utiles pour le marché italien.",
        bullets: ["Éléments inclus", "Extras possibles", "Questions pour le marché italien", "Discussion avec clients et prestataires"],
        cta: "Analyser un devis"
      },
      findSuppliers: {
        title: "Trouver des prestataires italiens pour événements",
        description: "Envoyez une demande simple pour trouver des prestataires italiens adaptés.",
        h1: "Trouvez des prestataires italiens pour votre événement.",
        intro: "Indiquez ville, type d'événement, nombre d'invités et budget pour orienter la demande vers les bons prestataires italiens.",
        bullets: ["Type d'événement", "Ville ou région", "Nombre d'invités", "Fourchette budget"],
        cta: "Trouver des prestataires italiens"
      },
      partnerships: {
        title: "Partenariats publicitaires",
        description: "Opportunités de publicité et de partenariat sur OrganizzaEvento.com.",
        h1: "Partenariats pour marques événementielles.",
        intro: "Un espace discret pour collaborations, bannières et visibilité pour les services du secteur événementiel.",
        bullets: ["Visibilité éditoriale", "Emplacements bannière", "Audience prestataires", "Contexte community-first"],
        cta: "Nous contacter"
      },
      faq: {
        title: "Questions fréquentes",
        description: "Questions courantes sur OrganizzaEvento.com et la communauté.",
        h1: "Réponses rapides avant de commencer.",
        intro: "Voici les règles essentielles pour bien utiliser la plateforme.",
        bullets: ["Aucune inscription obligatoire.", "Ne publiez pas de données personnelles de tiers.", "Utilisez les signalements pour les contenus problématiques."],
        cta: "Poser une question"
      },
      rules: {
        title: "Règles de la communauté",
        description: "Règles simples pour utiliser la communauté événementielle avec respect.",
        h1: "Règles de la communauté.",
        intro: "La plateforme fonctionne lorsque les questions sont claires et les réponses respectueuses.",
        bullets: ["Pas d'insultes.", "Pas de politique.", "Pas de spam.", "Pas d'accusations non prouvées.", "Pas de données personnelles de tiers."],
        cta: "Lire les questions"
      },
      privacy: {
        title: "Politique de confidentialité",
        description: "Informations de confidentialité de base pour OrganizzaEvento.com.",
        h1: "Politique de confidentialité.",
        intro: "Cette page explique comment les contacts, comptes, contenus communautaires et demandes de support peuvent être gérés.",
        bullets: ["Les formulaires de support peuvent collecter des coordonnées.", "Les formulaires de compte collectent des données de profil.", "L'analyse peut mesurer des visites agrégées."],
        cta: "Contacter le support"
      },
      terms: {
        title: "Conditions",
        description: "Conditions de base pour utiliser OrganizzaEvento.com.",
        h1: "Conditions d'utilisation.",
        intro: "Ces conditions expliquent comment utiliser la communauté avec respect et quels contenus peuvent être modérés.",
        bullets: ["Utilisez le site de façon responsable.", "Ne publiez pas de contenu illégal ou offensant.", "Le contenu peut être modéré."],
        cta: "Retour à l'accueil"
      },
      signup: {
        title: "Inscription",
        description: "Créez un compte facultatif comme client ou prestataire.",
        h1: "Inscrivez-vous seulement si vous voulez tout organiser.",
        intro: "L'inscription est facultative. Vous pouvez lire et poser une question sans compte.",
        bullets: ["Badge client", "Badge prestataire", "Photo de profil", "Courte biographie", "Suppression du compte"],
        cta: "Créer un compte"
      },
      login: {
        title: "Connexion",
        description: "Accédez à votre tableau de bord client ou prestataire.",
        h1: "Connectez-vous à votre tableau de bord.",
        intro: "Utilisez votre email et mot de passe pour gérer profil, badge et activité.",
        bullets: ["Tableau client", "Tableau prestataire", "Paramètres profil", "Suppression du compte"],
        cta: "Se connecter"
      }
    },
    guide: {
      eyebrow: "Guide pratique",
      intro: (eventType, place) => `Un guide pratique pour ${eventType.toLowerCase()} à ${place} : budget, calendrier, prestataires et questions à poser avant de décider.`,
      checklist: "Checklist avant de confirmer",
      mistakes: "Erreurs à éviter",
      community: "Transformer votre cas en question pour la communauté",
      checklistItems: ["Définir le type d'événement et le nombre d'invités.", "Demander des devis comparables.", "Vérifier heures supplémentaires, personnel et annulation.", "Prévoir un plan B écrit."],
      mistakeItems: ["Comparer des offres avec des inclusions différentes.", "Confirmer sans calendrier de paiement clair.", "Ignorer pluie, bruit ou limites horaires.", "Finaliser trop tard le nombre d'invités."]
    },
    localSeo: {
      eyebrow: "Guide local prestataires",
      h1Suffix: "comment choisir sans perdre de temps",
      intro: (category, place) => `${place} demande une approche claire lorsque vous comparez ${category}. Utilisez cette page pour préparer de meilleures questions avant de contacter des prestataires.`,
      checklistTitle: "À vérifier avant de choisir",
      communityTitle: "Cas à discuter",
      faqTitle: "Questions avant d'envoyer une demande",
      ctaTitle: "Besoin de prestataires pour votre événement ",
      ctaText: "Préparez une demande claire avec ville, budget, nombre d'invités et type de service.",
      checks: ["Disponibilité à la date exacte", "Ce qui est inclus dans le prix de base", "Frais de déplacement, installation et heures supplémentaires", "Conditions d'annulation et acompte", "Événements similaires déjà réalisés", "Délais de réponse avant l'événement"],
      cases: ["Un devis semble élevé mais inclut la coordination.", "Deux prestataires proposent des durées de service différentes.", "Le lieu demande un équipement technique précis."],
      questions: ["Qu'est-ce qui est inclus dans le prix ?", "Quels extras sont facturés séparément ?", "Combien d'événements similaires avez-vous réalisés ?"]
    }
  }
};

const localizedCategoryCopy: Record<TranslationLocale, Record<string, { name: string; description: string }>> = {
  en: {
    "da-dove-inizio": {
      name: "Where to start",
      description: "For when the event is in your head but the first step is still unclear."
    },
    "quanto-costa": {
      name: "How much does it cost",
      description: "Prices, quotes, extras and numbers to understand before confirming."
    },
    location: {
      name: "Venues",
      description: "Villas, restaurants, private rooms, countryside venues and spaces to evaluate carefully."
    },
    "catering-menu": {
      name: "Catering and menu",
      description: "Buffet, served dinner, open bar, cake, allergies and service."
    },
    "musica-dj": {
      name: "Music and DJ",
      description: "DJ, bands, playlists, live music, music rights and key moments."
    },
    matrimoni: {
      name: "Weddings",
      description: "Real doubts about venues, guests, budget, suppliers and the wedding day."
    },
    "compleanni-feste-private": {
      name: "Birthdays and private parties",
      description: "Birthdays, graduations, anniversaries, home parties and venue parties."
    },
    "eventi-aziendali": {
      name: "Corporate events",
      description: "Company dinners, team building, client events, meetings and conventions."
    },
    "problemi-fornitori": {
      name: "Supplier problems",
      description: "Deposits, delays, unclear quotes, missing replies and agreements to understand."
    },
    "idee-evento": {
      name: "Event ideas",
      description: "Ideas to make feasible without turning everything into an impossible project."
    }
  },
  es: {
    "da-dove-inizio": {
      name: "Por dónde empezar",
      description: "Para cuando tienes el evento en mente pero aún no sabes cuál es el primer paso."
    },
    "quanto-costa": {
      name: "Cuánto cuesta",
      description: "Precios, presupuestos, extras y cifras que entender antes de confirmar."
    },
    location: {
      name: "Lugares",
      description: "Villas, restaurantes, salas privadas, fincas y espacios que conviene revisar bien."
    },
    "catering-menu": {
      name: "Catering y menú",
      description: "Buffet, cena servida, barra libre, tarta, intolerancias y servicio."
    },
    "musica-dj": {
      name: "Música y DJ",
      description: "DJ, bandas, playlist, música en vivo, permisos musicales y momentos de la noche."
    },
    matrimoni: {
      name: "Bodas",
      description: "Dudas reales sobre lugares, invitados, presupuesto, proveedores y día de la boda."
    },
    "compleanni-feste-private": {
      name: "Cumpleaños y fiestas privadas",
      description: "Cumpleaños, graduaciones, aniversarios, fiestas en casa y fiestas en espacios."
    },
    "eventi-aziendali": {
      name: "Eventos corporativos",
      description: "Cenas de empresa, team building, eventos con clientes, reuniones y convenciones."
    },
    "problemi-fornitori": {
      name: "Problemas con proveedores",
      description: "Señales, retrasos, presupuestos poco claros, respuestas que no llegan y acuerdos que entender."
    },
    "idee-evento": {
      name: "Ideas para eventos",
      description: "Ideas para hacer viables sin convertir todo en un proyecto imposible."
    }
  },
  fr: {
    "da-dove-inizio": {
      name: "Par où commencer",
      description: "Pour quand l'événement est dans votre tête mais que le premier pas n'est pas clair."
    },
    "quanto-costa": {
      name: "Combien ça coûte",
      description: "Prix, devis, extras et montants à comprendre avant de confirmer."
    },
    location: {
      name: "Lieux",
      description: "Villas, restaurants, salles privées, domaines et espaces à évaluer avec soin."
    },
    "catering-menu": {
      name: "Traiteur et menu",
      description: "Buffet, dîner servi, open bar, gâteau, allergies et service."
    },
    "musica-dj": {
      name: "Musique et DJ",
      description: "DJ, groupes, playlists, musique live, droits musicaux et moments de la soirée."
    },
    matrimoni: {
      name: "Mariages",
      description: "Doutes réels sur lieux, invités, budget, prestataires et jour du mariage."
    },
    "compleanni-feste-private": {
      name: "Anniversaires et fêtes privées",
      description: "Anniversaires, diplômes, célébrations, fêtes à la maison et en lieu privé."
    },
    "eventi-aziendali": {
      name: "Événements d'entreprise",
      description: "Dîners d'entreprise, team building, événements clients, réunions et conventions."
    },
    "problemi-fornitori": {
      name: "Problèmes avec prestataires",
      description: "Acomptes, retards, devis flous, réponses absentes et accords à comprendre."
    },
    "idee-evento": {
      name: "Idées d'événement",
      description: "Idées à rendre réalistes sans transformer tout cela en projet impossible."
    }
  }
};

function localizedCategoryText(locale: TranslationLocale, category: (typeof CATEGORIES)[number]) {
  return localizedCategoryCopy[locale][category.slug] ?? { name: t(locale, category.name), description: t(locale, category.description) };
}

function getCopy(locale: Locale): LocaleCopy {
  if (locale === "it") notFound();
  return copy[locale];
}

function staticPageData(locale: TranslationLocale, key: RouteKey) {
  if (key === "home") return null;
  return copy[locale].staticDescriptions[key];
}

function routeTitle(locale: TranslationLocale, route: ResolvedRoute) {
  const c = copy[locale];
  if (route.type === "home") return { title: c.heroTitle, description: c.heroText };
  if (route.type === "quoteAnalysis") return { title: route.page.title, description: route.page.metaDescription };
  if (route.type === "static") {
    const data = staticPageData(locale, route.key);
    return data ? { title: data.title, description: data.description } : { title: c.heroTitle, description: c.heroText };
  }
  if (route.type === "localizedConversation") {
    return {
      title: route.conversation.title,
      description: route.conversation.excerpt.replace(/\s+/g, " ").slice(0, 155)
    };
  }
  if (route.type === "category") {
    const category = CATEGORIES.find((item) => item.slug === route.slug);
    const name = category ? localizedCategoryText(locale, category).name : route.slug;
    return { title: `${name} | ${SITE_NAME}`, description: `${name}: ${c.heroText}` };
  }
  if (route.type === "guideList") return { title: c.staticDescriptions.eventGuides.title, description: c.staticDescriptions.eventGuides.description };
  if (route.type === "guide") {
    const eventType = t(locale, route.page.eventType);
    const place = placeName(locale, route.page.city);
    return { title: `${eventType} - ${place}`, description: c.guide.intro(eventType, place) };
  }
  if (route.type === "localSeo") {
    const category = t(locale, route.page.categoryName);
    const place = placeName(locale, route.page.city);
    return { title: `${category} ${place}`, description: c.localSeo.intro(category, place) };
  }
  if (route.type === "magazineCategory") return { title: `${route.slug} Magazine`, description: c.staticDescriptions.magazine.description };
  return { title: c.heroTitle, description: c.heroText };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, path = [] } = await params;
  const locale = localeFromParam(rawLocale);
  if (!locale || locale === "it") return {};
  const internationalGuide = await getInternationalGuideForPath(locale, path);
  if (internationalGuide) {
    const { page, canonical } = internationalGuide;
    return {
      title: page.seoTitle,
      description: page.metaDescription,
      alternates: {
        canonical
      },
      robots: {
        index: true,
        follow: true
      },
      openGraph: {
        title: page.seoTitle,
        description: page.metaDescription,
        siteName: SITE_NAME,
        locale: "en_US",
        type: "article",
        url: canonical
      }
    };
  }
  const route = resolveLocalizedRoute(locale, path);
  if (!route) {
    const fallback = await resolveFallbackLocalizedRoute(locale, path);
    if (fallback) {
      const title = safeDecode(fallback.slug).replace(/-/g, " ");
      return {
        title: `${title} | ${SITE_NAME}`,
        description: `${title}. Leggi il caso completo nella discussione nella tua lingua con contenuti verificati.`,
        alternates: {
          canonical: localizedStaticPath(locale, "questions")
        },
        robots: {
          index: true,
          follow: true
        },
        openGraph: {
          title: `${title} | ${SITE_NAME}`,
          description: `${title}. Leggi il caso completo nella discussione.`,
          siteName: SITE_NAME,
          locale: locale === "en" ? "en_US" : locale === "es" ? "es_ES" : "fr_FR",
          type: "article",
          url: `${siteUrl}${localizedStaticPath(locale, "questions")}/${encodeURIComponent(fallback.slug)}`
        }
      };
    }
    return {};
  }
  if (route.type === "quoteAnalysis") {
    return {
      title: route.page.title,
      description: route.page.metaDescription,
      alternates: quoteAnalysisAlternates(route.page, locale),
      robots: {
        index: route.page.indexable,
        follow: true
      },
      openGraph: {
        title: route.page.title,
        description: route.page.metaDescription,
        siteName: SITE_NAME,
        locale: locale === "en" ? "en_US" : locale === "es" ? "es_ES" : "fr_FR",
        type: "website",
        url: route.page.url
      }
    };
  }
  const meta = routeTitle(locale, route);
  return localizedMetadata(locale, route, meta.title, meta.description);
}

function LanguageBlock({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  return (
    <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.languageTitle}</p>
      <p className="mt-2 text-sm leading-7 text-muted">{c.languageText}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {LOCALES.map((item) => (
          <Link
            key={item}
            href={item === "it" ? "/" : `/${item}/`}
            hrefLang={item}
            className="focus-ring flex items-center justify-between rounded-xl border border-line bg-cream px-3 py-3 text-sm font-semibold text-ink transition hover:bg-petal"
          >
            {localeShortLabels[item]} - {localeLabels[item]}
          </Link>
        ))}
      </div>
    </section>
  );
}

function Card({ title, text, href }: { title: string; text: string; href: string }) {
  return (
    <Link href={href} className="focus-ring rounded-xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <span className="block text-lg font-semibold text-ink">{title}</span>
      <span className="mt-2 block text-sm leading-7 text-muted">{text}</span>
    </Link>
  );
}

function ActivityTicker({ locale }: { locale: TranslationLocale }) {
  const community = localizedCommunity[locale];
  return (
    <div className="overflow-hidden border-y border-line bg-white/85 py-3">
      <div className="oe-marquee flex w-max gap-3 px-4">
        {[...community.ticker, ...community.ticker].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-full border border-line bg-cream px-4 py-2 text-xs font-semibold text-ink shadow-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function conversationLabels(locale: TranslationLocale) {
  if (locale === "es") {
    return { replies: "respuestas", useful: "útiles", notUseful: "no útiles", views: "vistas hoy", open: "Abrir conversación" };
  }
  if (locale === "fr") {
    return { replies: "réponses", useful: "utiles", notUseful: "non utiles", views: "vues aujourd'hui", open: "Ouvrir la discussion" };
  }
  return { replies: "replies", useful: "useful", notUseful: "not useful", views: "views today", open: "Open conversation" };
}

function localizedConversationViews(conversation: LocalizedConversation) {
  if (conversation.viewsToday <= 20) return conversation.viewsToday;
  const seed = `${conversation.title}:${conversation.author}:${conversation.city}`;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return 12 + (hash % 9);
}

function topicPageLabels(locale: TranslationLocale) {
  if (locale === "es") {
    return {
      conversations: "Conversaciones abiertas",
      count: "casos reales",
      all: "Todos los temas",
      active: "Se está hablando de esto",
      ask: "Abrir una pregunta en este tema"
    };
  }
  if (locale === "fr") {
    return {
      conversations: "Discussions ouvertes",
      count: "cas concrets",
      all: "Tous les sujets",
      active: "On parle de ce sujet",
      ask: "Poser une question sur ce sujet"
    };
  }
  return {
    conversations: "Open conversations",
    count: "real cases",
    all: "All topics",
    active: "People are discussing this",
    ask: "Ask about this topic"
  };
}

function conversationsForCategory(locale: TranslationLocale, slug: string) {
  const community = localizedCommunity[locale];
  const direct = community.conversations.filter((item) => item.categorySlug === slug);
  if (direct.length) return direct;

  const fallback: Record<string, RegExp> = {
    "da-dove-inizio": /start|first|empezar|primer|commencer|premier/i,
    "quanto-costa": /price|cost|quote|budget|precio|presupuesto|devis|prix|coût/i,
    location: /venue|villa|location|lugar|salle|lieu/i,
    "catering-menu": /catering|menú|traiteur|buffet|drink|bebida|boisson/i,
    "musica-dj": /dj|music|música|musique|band|siaE/i,
    matrimoni: /wedding|boda|mariage/i,
    "compleanni-feste-private": /birthday|party|cumpleaños|fiesta|anniversaire|fête/i,
    "eventi-aziendali": /corporate|company|empresa|client|seminar|entreprise/i,
    "problemi-fornitori": /supplier|provider|proveedor|prestataire|reply|responde|silencieux/i,
    "idee-evento": /idea|welcome|format|idée|ideas/i
  };
  const matcher = fallback[slug];
  return matcher ? community.conversations.filter((item) => matcher.test(`${item.title} ${item.excerpt} ${item.eventType}`)) : community.conversations.slice(0, 4);
}

function ConversationCard({ conversation, href, locale }: { conversation: LocalizedConversation; href: string; locale: TranslationLocale }) {
  const labels = conversationLabels(locale);
  const replyCount = localizedConversationReplyCount(conversation);
  const notUsefulVotes = localizedConversationNotUsefulVotes(conversation);
  const viewsToday = localizedConversationViews(conversation);
  return (
    <Link href={href} className="focus-ring group block overflow-hidden rounded-xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="grid min-h-full sm:grid-cols-[12rem_1fr]">
        <div className="relative min-h-48 overflow-hidden sm:min-h-full">
          <img
            src={conversation.image}
            alt={`${conversation.title} - ${conversation.eventType} ${conversation.city}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-ink">
            {conversation.status}
          </span>
        </div>
        <div className="flex flex-col p-5">
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
            <span className="rounded-full bg-petal px-3 py-1 text-violet-cta">{conversation.eventType}</span>
            <span className="rounded-full border border-line px-3 py-1">{conversation.city}</span>
            <span className="rounded-full border border-line px-3 py-1">{conversation.badge}</span>
          </div>
          <h3 className="mt-4 text-xl font-semibold leading-tight text-ink">{conversation.title}</h3>
          <p className="mt-2 text-sm font-medium text-muted">{conversation.author} - {conversation.budget}</p>
          <p className="mt-3 text-sm leading-7 text-muted">{conversation.excerpt}</p>
          <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-sm leading-7 text-muted">{conversation.answerPreview}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-xs font-semibold text-muted">
            <span>{replyCount} {labels.replies}</span>
            <span>{conversation.usefulVotes} {labels.useful}</span>
            <span>{notUsefulVotes} {labels.notUseful}</span>
            <span>{viewsToday} {labels.views}</span>
            <span className="ml-auto text-violet-cta group-hover:text-violet-hover">
              {labels.open}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HomeConversationCard({ conversation, href, locale }: { conversation: LocalizedConversation; href: string; locale: TranslationLocale }) {
  const labels = conversationLabels(locale);
  const replyCount = localizedConversationReplyCount(conversation);
  const notUsefulVotes = localizedConversationNotUsefulVotes(conversation);
  const viewsToday = localizedConversationViews(conversation);
  const readers =
    locale === "es"
      ? `Hoy ${viewsToday} personas han visto esta conversación`
      : locale === "fr"
        ? `Aujourd'hui ${viewsToday} personnes ont vu cette discussion`
        : `Today ${viewsToday} people viewed this conversation`;
  const openedBy = locale === "es" ? "Abierta por" : locale === "fr" ? "Ouverte par" : "Opened by";
  const active =
    locale === "es"
      ? "Conversación activa: entra y añade tu punto de vista."
      : locale === "fr"
        ? "Discussion active : ajoutez votre point de vue."
        : "Active discussion: join with your point of view.";
  const heartsLabel = locale === "en" ? "hearts" : labels.useful;

  return (
    <Link
      href={href}
      className="focus-ring group block overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="grid min-h-full md:grid-cols-[18rem_1fr]">
        <div className="relative min-h-72 overflow-hidden md:min-h-full">
          <img
            src={conversation.image}
            alt={`${conversation.title} - ${conversation.eventType} ${conversation.city}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/92 px-4 py-3 text-sm font-semibold leading-6 text-ink shadow-sm">
            {readers}
          </span>
        </div>
        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
            <span className="rounded-lg bg-emerald-50 px-3 py-1 text-emerald-700">{conversation.eventType}</span>
            <span className="rounded-lg border border-line px-3 py-1">{conversation.city}</span>
            <span className="rounded-lg border border-line px-3 py-1">{conversation.badge}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold leading-tight text-ink">{conversation.title}</h3>
          <p className="mt-2 text-sm font-medium text-muted">
            {openedBy} <span className="font-semibold text-ink">{conversation.author}</span>
          </p>
          <span className="mt-4 inline-flex w-fit rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {conversation.status}
          </span>
          <p className="mt-3 text-sm leading-7 text-muted">{conversation.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-semibold text-muted">
            <span>{conversation.eventType}</span>
            <span>{conversation.city}</span>
            <span>{replyCount} {labels.replies}</span>
            <span>{conversation.usefulVotes} {heartsLabel}</span>
            <span>{notUsefulVotes} {labels.notUseful}</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <span className="min-w-0 flex-1 rounded-xl bg-petal px-4 py-3 text-sm font-semibold leading-6 text-muted">
              {active}
            </span>
            <span className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-violet-hover">
              {labels.open}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MagazineArticleCard({ article }: { article: LocalizedMagazineArticle }) {
  return (
    <article className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={article.image} alt={article.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">{article.category} - {article.readTime}</p>
        <h3 className="mt-3 text-xl font-semibold leading-tight text-ink">{article.title}</h3>
        <p className="mt-2 text-sm font-medium text-muted">{article.author}</p>
        <p className="mt-3 text-sm leading-7 text-muted">{article.excerpt}</p>
      </div>
    </article>
  );
}

function ClientPathGrid({ locale }: { locale: TranslationLocale }) {
  const community = localizedCommunity[locale];
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{community.liveLabel}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{community.clientPathTitle}</h2>
        <p className="mt-4 text-base leading-8 text-muted">{community.clientPathIntro}</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {community.clientPaths.map((item) => (
          <Link
            key={item.title}
            href={localizedStaticPath(locale, item.hrefKey)}
            className="focus-ring rounded-xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <span className="block text-lg font-semibold text-ink">{item.title}</span>
            <span className="mt-3 block text-sm leading-7 text-muted">{item.text}</span>
            <span className="mt-5 inline-flex text-sm font-semibold text-violet-cta">{item.action}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LocalizedEventAreaCards({ locale }: { locale: TranslationLocale }) {
  const areas = [
    { slug: "matrimoni", kicker: { en: "Weddings", es: "Bodas", fr: "Mariages" }[locale] },
    { slug: "compleanni-feste-private", kicker: { en: "Private parties", es: "Fiestas privadas", fr: "Fêtes privées" }[locale] },
    { slug: "eventi-aziendali", kicker: { en: "Corporate", es: "Empresa", fr: "Entreprise" }[locale] },
    { slug: "idee-evento", kicker: { en: "Ideas", es: "Ideas", fr: "Idées" }[locale] }
  ];
  const action = { en: "Read discussions", es: "Leer conversaciones", fr: "Lire les discussions" }[locale];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-5 md:grid-cols-2">
        {areas.map((area) => {
          const category = CATEGORIES.find((item) => item.slug === area.slug) ?? CATEGORIES[0];
          const related = conversationsForCategory(locale, area.slug);
          const categoryText = localizedCategoryText(locale, category);
          const visual = related[0]?.image ?? HERO_IMAGE;
          return (
            <Link
              key={area.slug}
              href={`${localizedStaticPath(locale, "topics")}/${localizedCategorySlug(locale, area.slug)}`}
              className="focus-ring group relative min-h-[19rem] overflow-hidden rounded-xl border border-line bg-ink shadow-sm"
            >
              <img src={visual} alt={categoryText.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.18),rgba(47,36,48,0.76))]" />
              <div className="relative flex min-h-[19rem] flex-col justify-end p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-100">{area.kicker}</p>
                <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight">{categoryText.name}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-rose-50">{categoryText.description}</p>
                <span className="mt-5 inline-flex w-fit rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink">{action}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function LocalizedFaqSection({ locale }: { locale: TranslationLocale }) {
  const items =
    locale === "es"
      ? [
          ["¿Tengo que registrarme?", "No. Puedes leer, buscar y abrir una pregunta sin registro obligatorio."],
          ["¿Sirve si organizo un evento en Italia desde otro país?", "Sí. Las conversaciones están pensadas para comparar precios, proveedores y dudas prácticas con contexto italiano."],
          ["¿Puedo pedir proveedores italianos?", "Sí. El botón con Vibes Planner abre el módulo dedicado para buscar proveedores locales."],
          ["¿Las respuestas son consejos legales?", "No. Son experiencias y consejos prácticos de comunidad: verifica contratos y aspectos legales con profesionales."]
        ]
      : locale === "fr"
        ? [
            ["Dois-je m'inscrire?", "Non. Vous pouvez lire, chercher et poser une question sans inscription obligatoire."],
            ["Est-ce utile si j'organise en Italie depuis l'étranger", "Oui. Les discussions aident à comparer prix, prestataires et decisions avec un contexte italien."],
            ["Puis-je demander des prestataires italiens?", "Oui. Le bouton avec Vibes Planner ouvre le formulaire dédié aux prestataires locaux."],
            ["Les réponses sont-elles juridiques?", "Non. Ce sont des expériences et conseils pratiques: faites vérifier les contrats par des professionnels."]
          ]
        : [
            ["Do I need to register?", "No. You can read, search and open a question without mandatory registration."],
            ["Does it help if I plan in Italy from abroad?", "Yes. Conversations are built to compare prices, suppliers and practical decisions with Italian context."],
            ["Can I request Italian suppliers?", "Yes. The Vibes Planner button opens the dedicated form for local supplier requests."],
            ["Are answers legal advice?", "No. They are community experience and practical advice: contracts and legal points should be checked professionally."]
          ];
  const title = { en: "A few simple answers", es: "Algunas respuestas simples", fr: "Quelques réponses simples" }[locale];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">FAQ</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map(([question, answer]) => (
          <article key={question} className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-ink">{question}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function LegacyLocalizedHome({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  const community = localizedCommunity[locale];
  const heroAlt =
    locale === "es"
      ? "Decoración floral elegante para un evento en Italia"
      : locale === "fr"
        ? "Décoration florale élégante pour un événement en Italie"
        : "Elegant floral event setup in Italy";
  return (
    <div className="bg-cream">
      <section className="relative isolate overflow-hidden">
        <img src={HERO_IMAGE} alt={heroAlt} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.86),rgba(47,36,48,0.55),rgba(47,36,48,0.18))]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">{c.heroKicker}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">{c.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-rose-50 sm:text-lg">{c.heroText}</p>
          <p className="mt-4 inline-flex max-w-fit rounded-xl border border-white/40 bg-white/20 px-4 py-2 text-sm font-semibold">{c.noSignup}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={localizedStaticPath(locale, "ask")} className="focus-ring rounded-xl bg-white px-6 py-3 text-base font-semibold text-ink shadow-soft transition hover:bg-petal">
              {c.ask}
            </Link>
            <Link href={localizedStaticPath(locale, "topics")} className="focus-ring rounded-xl border border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/20">
              {c.explore}
            </Link>
            <VibesSupplierSearch locale={locale} variant="dark" className="text-base shadow-soft" trackingPlacement={`${locale}_hero`}>
              {c.supplierSearchCta}
            </VibesSupplierSearch>
          </div>
        </div>
      </section>
      <ActivityTicker locale={locale} />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.activeDiscussions}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{community.conversationsTitle}</h2>
            <p className="mt-4 text-base leading-8 text-muted">{community.conversationsIntro}</p>
          </div>
          <Link href={localizedStaticPath(locale, "questions")} className="focus-ring rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
            {community.conversationsCta}
          </Link>
        </div>
        <div className="mt-8 grid gap-5">
          {community.conversations.slice(0, 3).map((conversation) => (
            <ConversationCard key={conversation.title} conversation={conversation} href={localizedConversationHref(locale, conversation)} locale={locale} />
          ))}
        </div>
      </section>
      <LocalizedEventAreaCards locale={locale} />
      <ClientPathGrid locale={locale} />
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 lg:grid-cols-[0.85fr_1.15fr]">
        <LanguageBlock locale={locale} />
        <div className="grid gap-4 sm:grid-cols-2">
          {community.guides.map((guide) => (
            <Card key={guide.title} title={guide.title} text={guide.excerpt} href={localizedStaticPath(locale, guide.hrefKey)} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.magazineTitle}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{community.magazineIntroTitle}</h2>
            <p className="mt-4 text-base leading-8 text-muted">{community.magazineIntro}</p>
            <Link href={localizedStaticPath(locale, "magazine")} className="focus-ring mt-6 inline-flex rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
              {c.staticDescriptions.magazine.cta}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {community.articles.slice(0, 2).map((article) => (
              <MagazineArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
      <LocalizedFaqSection locale={locale} />
    </div>
  );
}

function localizedHomeLabels(locale: TranslationLocale) {
  if (locale === "es") {
    return {
      searchEyebrow: "Busca primero en la comunidad",
      searchPlaceholder: "Ej. presupuesto, DJ, señal, barra libre...",
      searchButton: "Buscar",
      openNow: "Conversaciones abiertas ahora",
      openNowText: "Mira si alguien ya tiene la misma duda.",
      seeAll: "Ver todas",
      talkingEyebrow: "Se está hablando de",
      talkingTitle: "Problemas concretos, no teoría.",
      moreConversations: "Ver más conversaciones",
      featured: "En evidencia",
      featuredText: (votes: number, replies: number) => `${votes} corazones y ${replies} respuestas de personas que ya pasaron por algo parecido.`,
      realPricesTitle: "Cuánto cuesta",
      realPricesText: "Costes, presupuestos y detalles que conviene revisar antes de decir que sí.",
      eventEyebrow: "Tu evento",
      eventTitle: "Entra en la conversación correcta.",
      eventText: "Cada área reúne dudas, precios, presupuestos y problemas reales: elige por dónde empezar.",
      readDiscussions: "Leer las conversaciones",
      magazineTitle: "Guías para leer antes de hacerte una idea.",
      magazineText: "Ideas sobre presupuesto, lugares, fiestas privadas, bodas y eventos de empresa. Luego puedes llevar tu caso al foro.",
      magazineCta: "Ir al magazine",
      guidesEyebrow: "Guías regionales",
      guidesTitle: "Dos guías para leer antes de elegir.",
      guidesText: "Contenido local para 2026/2027: temporadas, presupuesto y proveedores qué revisar antes de cerrar una fecha.",
      guidesCta: "Buscar entre las guías",
      suppliersEyebrow: "Proveedores en la zona",
      suppliersTitle: "Primero entiende lo que necesitas, después pide proveedores.",
      suppliersText: "Guías rápidas para saber qué preguntar a lugares, catering, música y servicios locales antes de enviar una solicitud.",
      suppliersCta: "Ver proveedores locales",
      faqEyebrow: "Preguntas frecuentes",
      faqTitle: "FAQ rápidas",
      faqText: "Respuestas esenciales para usar foro, magazine y solicitudes privadas.",
      heroAlt: "Decoración floral elegante para un evento en Italia"
    };
  }
  if (locale === "fr") {
    return {
      searchEyebrow: "Cherchez d'abord dans la communauté",
      searchPlaceholder: "Ex. budget, DJ, acompte, open bar...",
      searchButton: "Chercher",
      openNow: "Discussions ouvertes maintenant",
      openNowText: "Regardez si quelqu'un a déjà le même doute.",
      seeAll: "Voir toutes",
      talkingEyebrow: "On parle de",
      talkingTitle: "Des problèmes concrets, pas de théorie.",
      moreConversations: "Voir plus de discussions",
      featured: "En avant",
      featuredText: (votes: number, replies: number) => `${votes} cœurs et ${replies} réponses de personnes ayant déjà vécu un cas similaire.`,
      realPricesTitle: "Combien ça coûte",
      realPricesText: "Coûts, devis et détails à vérifier avant de dire oui.",
      eventEyebrow: "Votre événement",
      eventTitle: "Entrez dans la bonne discussion.",
      eventText: "Chaque espace rassemble doutes, prix, devis et problèmes réels : choisissez par où commencer.",
      readDiscussions: "Lire les discussions",
      magazineTitle: "Des guides à lire avant de vous faire une idée.",
      magazineText: "Budget, lieux, fêtes privées, mariages et événements d'entreprise. Puis, si besoin, portez votre cas dans le forum.",
      magazineCta: "Aller au magazine",
      guidesEyebrow: "Guides régionaux",
      guidesTitle: "Deux guides à lire avant de choisir.",
      guidesText: "Contenus locaux pour 2026/2027 : saisons, budget et prestataires à vérifier avant de bloquer une date.",
      guidesCta: "Chercher dans les guides",
      suppliersEyebrow: "Prestataires locaux",
      suppliersTitle: "Comprenez d'abord le besoin, demandez ensuite des prestataires.",
      suppliersText: "Guides rapides pour savoir quoi demander aux lieux, traiteurs, musiciens et services locaux avant d'envoyer une demande.",
      suppliersCta: "Voir les prestataires locaux",
      faqEyebrow: "Questions fréquentes",
      faqTitle: "FAQ rapide",
      faqText: "Les réponses essentielles pour utiliser forum, magazine et demandes privées.",
      heroAlt: "Décoration florale élégante pour un événement en Italie"
    };
  }
  return {
    searchEyebrow: "Search the community first",
    searchPlaceholder: "E.g. quote, DJ, deposit, open bar...",
    searchButton: "Search",
    openNow: "Open conversations now",
    openNowText: "See if someone already has the same doubt.",
    seeAll: "See all",
    talkingEyebrow: "People are talking about",
    talkingTitle: "Real problems, not theory.",
    moreConversations: "See more conversations",
    featured: "Featured",
    featuredText: (votes: number, replies: number) => `${votes} hearts and ${replies} replies from people who already faced a similar case.`,
    realPricesTitle: "How much does it cost",
    realPricesText: "Costs, quotes and details to check before saying yes.",
    eventEyebrow: "Your event",
    eventTitle: "Enter the right conversation.",
    eventText: "Each area collects real doubts, prices, quotes and supplier problems: choose where to start.",
    readDiscussions: "Read discussions",
    magazineTitle: "Guides to read before making up your mind.",
    magazineText: "Ideas on budgets, venues, private parties, weddings and corporate events. Then bring your case to the forum.",
    magazineCta: "Go to magazine",
    guidesEyebrow: "Regional guides",
    guidesTitle: "Two guides to read before choosing.",
    guidesText: "Local content for 2026/2027: seasons, budgets and suppliers to check before fixing a date.",
    guidesCta: "Search guides",
    suppliersEyebrow: "Local suppliers",
    suppliersTitle: "First understand what you need, then request suppliers.",
    suppliersText: "Quick guides to understand what to ask venues, catering, music and local services before sending a request.",
    suppliersCta: "See local suppliers",
    faqEyebrow: "Frequent questions",
    faqTitle: "Quick FAQ",
    faqText: "Essential answers for using the forum, magazine and private requests.",
    heroAlt: "Elegant floral event setup in Italy"
  };
}

function LocalizedHomeSearch({ locale }: { locale: TranslationLocale }) {
  const labels = localizedHomeLabels(locale);
  return (
    <div className="mt-8 max-w-3xl rounded-2xl border border-line bg-white p-3 text-ink shadow-sm">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">{labels.searchEyebrow}</p>
      <form action={localizedStaticPath(locale, "questions")} className="flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">{labels.searchEyebrow}</span>
          <input
            name="q"
            placeholder={labels.searchPlaceholder}
            className="focus-ring min-h-12 w-full rounded-xl border border-line bg-cream px-5 py-3 text-sm text-ink placeholder:text-muted"
          />
        </label>
        <button className="focus-ring min-h-12 rounded-xl bg-violet-cta px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
          {labels.searchButton}
        </button>
      </form>
    </div>
  );
}

function LocalizedEventTeaserImage({ locale }: { locale: TranslationLocale }) {
  const community = localizedCommunity[locale];
  const image = community.conversations[1]?.image ?? HERO_IMAGE;
  const alt =
    locale === "es"
      ? "Evento real discutido en la comunidad"
      : locale === "fr"
        ? "Événement réel discuté dans la communauté"
        : "Real event discussed in the community";
  const label =
    locale === "es"
      ? "Ahora también se habla de fiestas privadas"
      : locale === "fr"
        ? "On parle aussi de fêtes privées"
        : "People are also discussing private parties";

  return (
    <div className="relative min-h-44 overflow-hidden rounded-lg border border-white bg-white shadow-sm">
      <img src={image} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.02),rgba(47,36,48,0.58))]" />
      <div className="absolute bottom-3 left-3 right-3 rounded-md bg-white/95 px-3 py-2 text-xs font-semibold text-ink shadow-sm backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function LocalizedConversationEntryGrid({ locale }: { locale: TranslationLocale }) {
  const entries =
    locale === "es"
      ? [
          {
            label: "Presupuesto",
            title: "Analiza un presupuesto",
            description: "Si recibiste un precio y no entiendes qué incluye, empieza aquí.",
            example: "Sube o pega el presupuesto: ocultamos datos sensibles y preparamos la conversación.",
            href: localizedStaticPath(locale, "analyzeQuote"),
            cta: "Analizar",
            featured: true
          },
          {
            label: "Opinión",
            title: "Tengo una pregunta",
            description: "Para cuando no sabes qué elegir y quieres una opinión concreta.",
            example: "¿Mejor villa o restaurante para 60 personas?",
            href: localizedStaticPath(locale, "ask"),
            cta: "Abrir discusión"
          },
          {
            label: "Precios",
            title: "Quiero saber cuánto cuesta",
            description: "Para entender si una cifra es normal o si falta algo por aclarar.",
            example: "DJ, barra libre, catering: qué precio tiene sentido?",
            href: localizedStaticPath(locale, "realPrices"),
            cta: "Comparar precios"
          },
          {
            label: "Ayuda",
            title: "Tengo un problema",
            description: "Senal alta, respuestas que no llegan, acuerdos poco claros.",
            example: "El proveedor ya no responde: qué hago?",
            href: localizedStaticPath(locale, "ask"),
            cta: "Pedir ayuda"
          }
        ]
      : locale === "fr"
        ? [
            {
              label: "Devis",
              title: "Analyser un devis",
              description: "Si vous avez reçu un prix sans comprendre ce qui est inclus, commencez ici.",
              example: "Ajoutez ou collez le devis : nous masquons les données sensibles et préparons la discussion.",
              href: localizedStaticPath(locale, "analyzeQuote"),
              cta: "Analyser",
              featured: true
            },
            {
              label: "Avis",
              title: "J'ai une question",
              description: "Quand vous hésitez entre deux choix et voulez un avis concret.",
              example: "Villa ou restaurant pour 60 personnes?",
              href: localizedStaticPath(locale, "ask"),
              cta: "Ouvrir une discussion"
            },
            {
              label: "Prix",
              title: "Je veux comprendre le prix",
              description: "Pour voir si un montant est normal ou si un point reste flou.",
              example: "DJ, open bar, traiteur : quel prix a du sens?",
              href: localizedStaticPath(locale, "realPrices"),
              cta: "Comparer les prix"
            },
            {
              label: "Aide",
              title: "J'ai un problème",
              description: "Acompte élevé, réponses absentes, accords peu clairs.",
              example: "Le prestataire ne répond plus : que faire?",
              href: localizedStaticPath(locale, "ask"),
              cta: "Demander de l'aide"
            }
          ]
        : [
            {
              label: "Quote",
              title: "Analyze a quote",
              description: "If you received a price and do not understand what is included, start here.",
              example: "Upload or paste the quote: sensitive data is hidden and the discussion is prepared.",
              href: localizedStaticPath(locale, "analyzeQuote"),
              cta: "Analyze",
              featured: true
            },
            {
              label: "Advice",
              title: "I have a question",
              description: "For moments when you are choosing between options and need a practical opinion.",
              example: "Villa or restaurant for 60 guests?",
              href: localizedStaticPath(locale, "ask"),
              cta: "Open discussion"
            },
            {
              label: "Prices",
              title: "I want to understand the cost",
              description: "Use it to see whether a figure is normal or something is unclear.",
              example: "DJ, open bar, catering: what price makes sense?",
              href: localizedStaticPath(locale, "realPrices"),
              cta: "Compare prices"
            },
            {
              label: "Help",
              title: "I have a problem",
              description: "High deposit, missing replies, vague conditions or unclear agreements.",
              example: "The supplier stopped replying: what should I do?",
              href: localizedStaticPath(locale, "ask"),
              cta: "Ask for help"
            }
          ];

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <div className="border-b border-line bg-petal/60 p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_18rem] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">
              {locale === "es" ? "Comunidad del foro" : locale === "fr" ? "Communauté du forum" : "Forum community"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink">
              {locale === "es" ? "¿De qué quieres hablar?" : locale === "fr" ? "De quoi voulez-vous parler ?" : "What do you want to talk about?"}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              {locale === "es"
                ? "Elige el tipo de discusión: quien lee entiende enseguida si debe darte un precio, una opinión o revisar un presupuesto."
                : locale === "fr"
                  ? "Choisissez le type de discussion : les lecteurs comprennent vite s'il faut donner un prix, un avis ou vérifier un devis."
                  : "Choose the type of discussion: readers immediately understand whether you need a price, an opinion or a quote check."}
            </p>
          </div>
          <LocalizedEventTeaserImage locale={locale} />
        </div>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map((entry, index) => (
          <Link
            key={entry.title}
            href={entry.href}
            className={[
              "focus-ring group rounded-lg border p-4 transition hover:-translate-y-0.5 hover:shadow-sm",
              entry.featured
                ? "border-violet-cta bg-violet-cta text-white shadow-soft sm:col-span-2 lg:col-span-1"
                : "border-line bg-cream hover:border-violet-cta hover:bg-white"
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-white px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-violet-cta shadow-sm">
                {entry.label}
              </span>
              <span className={entry.featured ? "text-xs font-semibold text-white/75" : "text-xs font-semibold text-muted"}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className={entry.featured ? "mt-4 text-lg font-semibold leading-snug text-white" : "mt-4 text-lg font-semibold leading-snug text-ink"}>
              {entry.title}
            </h3>
            <p className={entry.featured ? "mt-2 text-sm leading-6 text-white/85" : "mt-2 text-sm leading-6 text-muted"}>{entry.description}</p>
            <div
              className={
                entry.featured
                  ? "mt-4 border-l-2 border-white/45 pl-3 text-sm leading-6 text-white"
                  : "mt-4 border-l-2 border-violet-cta/40 pl-3 text-sm leading-6 text-ink"
              }
            >
              {entry.example}
            </div>
            <span
              className={
                entry.featured
                  ? "mt-5 inline-flex min-h-10 items-center rounded-lg bg-white px-3 text-sm font-semibold text-violet-cta transition group-hover:bg-petal"
                  : "mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-violet-cta transition group-hover:text-violet-hover"
              }
            >
              {entry.cta}
              <span aria-hidden="true" className="ml-2 transition group-hover:translate-x-0.5">
                -&gt;
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LocalizedEventAreasHomeSection({ locale }: { locale: TranslationLocale }) {
  const labels = localizedHomeLabels(locale);
  const areas = [
    { slug: "matrimoni", kicker: { en: "For weddings", es: "Para bodas", fr: "Pour les mariages" }[locale] },
    { slug: "compleanni-feste-private", kicker: { en: "Private parties", es: "Fiestas privadas", fr: "Fêtes privées" }[locale] },
    { slug: "eventi-aziendali", kicker: { en: "Work, but warmer", es: "Trabajo, pero cercano", fr: "Travail, mais humain" }[locale] },
    { slug: "idee-evento", kicker: { en: "When you want something different", es: "Cuando quieres algo distinto", fr: "Quand vous voulez autre chose" }[locale] }
  ];

  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{labels.eventEyebrow}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{labels.eventTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{labels.eventText}</p>
        </div>
        <Link href={localizedStaticPath(locale, "topics")} className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-violet-cta">
          {labels.seeAll}
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {areas.map((area) => {
          const category = CATEGORIES.find((item) => item.slug === area.slug) ?? CATEGORIES[0];
          const related = conversationsForCategory(locale, area.slug);
          const categoryText = localizedCategoryText(locale, category);
          const visual = related[0]?.image ?? HERO_IMAGE;
          const areaName = categoryText.name.toLowerCase();
          const title =
            locale === "es"
              ? `Hablemos de ${areaName}`
              : locale === "fr"
                ? `Parlons de ${areaName}`
                : `Let's talk about ${areaName}`;

          return (
            <Link
              key={area.slug}
              href={`${localizedStaticPath(locale, "topics")}/${localizedCategorySlug(locale, area.slug)}`}
              className="focus-ring group overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="relative h-72 sm:h-80 lg:h-[22rem]">
                <img
                  src={visual}
                  alt={categoryText.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.08),rgba(47,36,48,0.30)_42%,rgba(47,36,48,0.88))]" />
                <div className="absolute bottom-0 p-6 text-white sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{area.kicker}</p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 max-w-xl text-base leading-7 text-rose-50">{categoryText.description}</p>
                  <span className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition group-hover:bg-petal">
                    {labels.readDiscussions}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function LocalizedMagazineHomeSection({ locale }: { locale: TranslationLocale }) {
  const labels = localizedHomeLabels(locale);
  const community = localizedCommunity[locale];
  const [leadArticle, ...secondaryArticles] = community.articles;
  return (
    <section className="border-y border-line bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{copy[locale].magazineTitle}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{labels.magazineTitle}</h2>
            <p className="mt-4 text-base leading-8 text-muted">{labels.magazineText}</p>
          </div>
          <div className="flex lg:justify-end">
            <Link href={localizedStaticPath(locale, "magazine")} className="focus-ring rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
              {labels.magazineCta}
            </Link>
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {leadArticle ? (
            <Link href={localizedStaticPath(locale, "magazine")} className="focus-ring group overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <img
                src={leadArticle.image}
                alt={leadArticle.title}
                loading="lazy"
                decoding="async"
                className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{leadArticle.category}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-ink">{leadArticle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{leadArticle.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-petal px-3 py-1 text-xs font-semibold text-muted">{leadArticle.readTime}</span>
                  <span className="rounded-lg bg-petal px-3 py-1 text-xs font-semibold text-muted">{leadArticle.author}</span>
                </div>
              </div>
            </Link>
          ) : null}
          <div className="grid gap-3">
            {secondaryArticles.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={localizedStaticPath(locale, "magazine")}
                className="focus-ring grid gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm transition hover:bg-petal sm:grid-cols-[7rem_1fr]"
              >
                <img src={article.image} alt={article.title} loading="lazy" decoding="async" className="h-28 w-full rounded-xl object-cover" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-cta">{article.category}</p>
                  <h3 className="mt-2 text-base font-semibold leading-snug text-ink">{article.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LocalizedGuidesHomeSection({ locale }: { locale: TranslationLocale }) {
  const labels = localizedHomeLabels(locale);
  const guides = getPublishedLandingPages().filter((page) => page.guideType === "regional").slice(0, 2);
  return (
    <section className="border-t border-line bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{labels.guidesEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{labels.guidesTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{labels.guidesText}</p>
          </div>
          <Link href={localizedStaticPath(locale, "eventGuides")} className="focus-ring rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
            {labels.guidesCta}
          </Link>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {guides.map((guide) => {
            const eventLabel = t(locale, guide.eventType);
            const regionLabel = placeName(locale, guide.region);
            const title =
              locale === "es"
                ? `${eventLabel} en ${regionLabel}: guía 2026/2027`
                : locale === "fr"
                  ? `${eventLabel} en ${regionLabel}: guide 2026/2027`
                  : `${eventLabel} in ${regionLabel}: 2026/2027 guide`;
            const intro = copy[locale].guide.intro(eventLabel, regionLabel);
            return (
            <Link
              key={guide.title}
              href={localizedPath(locale, { type: "guide", page: guide })}
              className="focus-ring group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="relative h-64">
                <img
                  src={guide.heroImage}
                  alt={guide.heroAlt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.04),rgba(47,36,48,0.76))]" />
                <div className="absolute bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{t(locale, guide.eyebrow)}</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight">{title}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="line-clamp-3 text-sm leading-7 text-muted">{intro}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted">
                  <span className="rounded-lg bg-petal px-2.5 py-1">{regionLabel}</span>
                  <span className="rounded-lg bg-petal px-2.5 py-1">{eventLabel}</span>
                  <span className="rounded-lg bg-petal px-2.5 py-1">2026/2027</span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LocalizedSuppliersHomeSection({ locale }: { locale: TranslationLocale }) {
  const labels = localizedHomeLabels(locale);
  const pages = getFeaturedLocalSeoPages().slice(0, 3);
  return (
    <section className="border-t border-line bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{labels.suppliersEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{labels.suppliersTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{labels.suppliersText}</p>
          </div>
          <Link href={localizedStaticPath(locale, "localSuppliers")} className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white shadow-sm">
            {labels.suppliersCta}
          </Link>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {pages.map((page) => {
            const href = `/${locale}/${localizedLocalSeoSlug(page, locale)}`;
            return (
              <Link
                key={page.slug}
                href={href}
                className="focus-ring group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="relative h-56">
                  <img
                    src={page.heroImage}
                    alt={page.heroAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.08),rgba(47,36,48,0.72))]" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{page.region}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">{t(locale, page.categoryName)} {placeName(locale, page.city)}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="line-clamp-3 text-sm leading-7 text-muted">{copy[locale].localSeo.intro(t(locale, page.categoryName), placeName(locale, page.city))}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LocalizedFaqHomeSection({ locale }: { locale: TranslationLocale }) {
  const labels = localizedHomeLabels(locale);
  const items =
    locale === "es"
      ? [
          ["¿Cómo hago una pregunta?", "Elige el tipo de conversación, escribe ciudad, presupuesto y duda concreta. No hace falta registrarse."],
          ["¿Tengo que registrarme para usar el sitio?", "No. La cuenta es opcional y sirve solo para seguir mejor tus conversaciones."],
          ["¿Puedo no mostrar mi nombre?", "Sí. Puedes usar un nickname o publicar sin mostrar tu nombre real."],
          ["¿La solicitud de proveedores se ve en el foro?", "No. El módulo con Vibes Planner se abre aparte y no publica tus contactos."],
          ["¿Puedo cargar un presupuesto?", "Sí. La página de análisis oculta datos sensibles y prepara una conversación."],
          ["¿Se puede hablar de política?", "No. La comunidad está dedicada solo a eventos, proveedores, presupuestos y organización."]
        ]
      : locale === "fr"
        ? [
            ["Comment poser une question?", "Choisissez le type de discussion, indiquez ville, budget et doute concret. L'inscription n'est pas obligatoire."],
            ["Dois-je m'inscrire?", "Non. Le compte est optionnel et sert seulement à mieux suivre vos discussions."],
            ["Puis-je ne pas afficher mon nom?", "Oui. Vous pouvez utiliser un pseudo ou ne pas afficher votre nom réel."],
            ["La demande de prestataires est-elle visible dans le forum?", "Non. Le formulaire Vibes Planner s'ouvre séparément et ne publie pas vos contacts."],
            ["Puis-je ajouter un devis", "Oui. La page d'analyse masque les données sensibles et prépare une discussion."],
            ["Peut-on parler de politique", "Non. La communauté parle uniquement d'événements, prestataires, budgets et organisation."]
          ]
        : [
            ["How do I ask a question?", "Choose the conversation type, add city, budget and the specific doubt. Registration is not mandatory."],
            ["Do I need to register?", "No. Accounts are optional and only help you follow your conversations."],
            ["Can I hide my name?", "Yes. You can use a nickname or avoid showing your real name."],
            ["Is the supplier request visible in the forum?", "No. The Vibes Planner form opens separately and does not publish your contact details."],
            ["Can I upload a quote?", "Yes. The quote analysis page hides sensitive data and prepares a discussion draft."],
            ["Can people discuss politics?", "No. The community is only for events, suppliers, budgets and organization."]
          ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{labels.faqEyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{labels.faqTitle}</h2>
          <p className="mt-4 text-base leading-8 text-muted">{labels.faqText}</p>
        </div>
        <div className="grid gap-3">
          {items.map(([question, answer]) => (
            <details key={question} className="group rounded-xl border border-line bg-white p-4 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-ink">
                <span>{question}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-petal text-violet-cta transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  const labels = localizedHomeLabels(locale);
  const community = localizedCommunity[locale];
  const heroQuestions = community.conversations.slice(0, 3);
  const latestQuestions = community.conversations.slice(0, 3);
  const priceThreads = community.conversations.filter((item) => /quote|budget|price|cost|presupuesto|precio|devis|prix|catering|deposit|acompte|señal/i.test(`${item.title} ${item.budget} ${item.excerpt}`));
  const highlightedQuestion = priceThreads[0] ?? community.conversations[0];

  return (
    <div>
      <section className="relative isolate min-h-[76vh] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt={labels.heroAlt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.84),rgba(47,36,48,0.50),rgba(47,36,48,0.18))]" />
        <div className="relative mx-auto flex min-h-[76vh] max-w-6xl flex-col justify-center px-4 py-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">{c.heroKicker}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">{c.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-rose-50 sm:text-lg">{c.heroText}</p>
          <p className="mt-4 inline-flex max-w-fit rounded-xl border border-white/40 bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            {c.noSignup}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={localizedStaticPath(locale, "analyzeQuote")} className="focus-ring inline-flex min-h-12 justify-center rounded-xl bg-violet-cta px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-violet-hover">
              {c.staticDescriptions.analyzeQuote.cta}
            </Link>
            <VibesSupplierSearch locale={locale} variant="dark" className="text-base shadow-soft" trackingPlacement={`${locale}_supplier_section`}>
              {c.supplierSearchCta}
            </VibesSupplierSearch>
          </div>

          <div className="mt-7 max-w-4xl rounded-2xl border border-white/40 bg-white/95 p-3 text-ink shadow-soft backdrop-blur">
            <div className="flex flex-col gap-2 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">{labels.openNow}</p>
                <p className="mt-1 text-sm text-muted">{labels.openNowText}</p>
              </div>
              <Link href={localizedStaticPath(locale, "questions")} className="focus-ring rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
                {labels.seeAll}
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {heroQuestions.map((question) => (
                <Link key={question.title} href={localizedConversationHref(locale, question)} className="focus-ring rounded-xl bg-cream px-4 py-3 transition hover:bg-petal">
                  <span className="block text-xs font-semibold text-violet-cta">{localizedConversationReplyCount(question)} {conversationLabels(locale).replies}</span>
                  <span className="mt-1 line-clamp-2 block text-sm font-semibold leading-5 text-ink">{question.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-7 px-4 py-14 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{labels.talkingEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{labels.talkingTitle}</h2>
            </div>
            <Link href={localizedStaticPath(locale, "questions")} className="focus-ring rounded-xl px-3 py-2 text-sm font-semibold text-violet-cta">
              {labels.seeAll}
            </Link>
          </div>
          <div className="grid gap-5">
            {latestQuestions.map((question) => (
              <HomeConversationCard key={question.title} conversation={question} href={localizedConversationHref(locale, question)} locale={locale} />
            ))}
          </div>
          <div className="mt-5 flex justify-center sm:justify-start">
            <Link
              href={localizedStaticPath(locale, "questions")}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-cta bg-white px-5 py-3 text-sm font-semibold text-violet-cta shadow-sm transition hover:bg-petal"
            >
              {labels.moreConversations}
            </Link>
          </div>
          <div className="mt-10">
            <LocalizedConversationEntryGrid locale={locale} />
          </div>
        </div>

        <aside className="space-y-5">
          {highlightedQuestion ? (
            <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <img
                src={highlightedQuestion.image ?? HOME_STORY_IMAGES[0].src}
                alt={highlightedQuestion.title}
                loading="lazy"
                decoding="async"
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-cta">{labels.featured}</p>
                <Link href={localizedConversationHref(locale, highlightedQuestion)} className="focus-ring mt-2 block rounded-md">
                  <h2 className="text-xl font-semibold leading-snug text-ink">{highlightedQuestion.title}</h2>
                </Link>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {labels.featuredText(highlightedQuestion.usefulVotes, localizedConversationReplyCount(highlightedQuestion))}
                </p>
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-line bg-white/90 p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">{labels.realPricesTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{labels.realPricesText}</p>
            <div className="mt-4 space-y-3">
              {(priceThreads.length ? priceThreads : community.conversations).slice(0, 3).map((question) => (
                <Link key={question.title} href={localizedConversationHref(locale, question)} className="focus-ring block rounded-xl bg-petal p-4">
                  <span className="text-sm font-semibold leading-6 text-ink">{question.title}</span>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <LocalizedEventAreasHomeSection locale={locale} />
      </section>

      <LocalizedMagazineHomeSection locale={locale} />
      <LocalizedGuidesHomeSection locale={locale} />
      <LocalizedSuppliersHomeSection locale={locale} />
      <LocalizedFaqHomeSection locale={locale} />
    </div>
  );
}

function registerPageCopy(locale: TranslationLocale) {
  if (locale === "es") {
    return {
      kicker: "Cuenta opcional",
      title: "Regístrate solo si quieres tener tu perfil en orden.",
      intro:
        "Puedes leer, buscar y abrir preguntas sin registrarte. La cuenta sirve para mostrar una etiqueta clara junto a tu nombre, guardar actividad y construir reputación.",
      clientTitle: "Cliente",
      clientText: "Para hacer preguntas, seguir conversaciones y explicar mejor qué evento estás organizando.",
      supplierTitle: "Proveedor",
      supplierText: "Para responder con autoridad y mostrar desde el inicio qué tipo de profesional eres.",
      google: "Continuar con Google - en activación",
      or: "o email"
    };
  }
  if (locale === "fr") {
    return {
      kicker: "Compte optionnel",
      title: "Inscrivez-vous seulement si vous voulez garder votre profil en ordre.",
      intro:
        "Vous pouvez lire, chercher et poser une question sans inscription. Le compte sert à afficher une étiquette claire près de votre nom, suivre l'activité et construire la confiance.",
      clientTitle: "Client",
      clientText: "Pour poser des questions, suivre des discussions et expliquer le type d'événement que vous organisez.",
      supplierTitle: "Prestataire",
      supplierText: "Pour répondre avec autorité et indiquer clairement votre métier.",
      google: "Continuer avec Google - en activation",
      or: "ou email"
    };
  }
  return {
    kicker: "Optional account",
    title: "Sign up only if you want to keep your profile tidy.",
    intro:
      "You can read, search and ask without registering. An account adds a clear tag next to your name, keeps activity together and helps build trust.",
    clientTitle: "Client",
    clientText: "For asking questions, following conversations and explaining what kind of event you are planning.",
    supplierTitle: "Supplier",
    supplierText: "For replying with authority and showing what you do from the first line.",
    google: "Continue with Google - coming soon",
    or: "or email"
  };
}

function LocalizedRegisterPage({ locale }: { locale: TranslationLocale }) {
  const data = registerPageCopy(locale);
  const startedAt = Date.now();
  return (
    <main className="bg-cream">
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{data.kicker}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{data.title}</h1>
          <p className="mt-5 text-base leading-8 text-muted">{data.intro}</p>
          <div className="mt-7 grid gap-3">
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
              <span className="inline-flex rounded-lg bg-petal px-3 py-1 text-xs font-semibold text-violet-cta">Badge</span>
              <h2 className="mt-3 text-xl font-semibold text-ink">{data.clientTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{data.clientText}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
              <span className="inline-flex rounded-lg bg-petal px-3 py-1 text-xs font-semibold text-violet-cta">Badge</span>
              <h2 className="mt-3 text-xl font-semibold text-ink">{data.supplierTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{data.supplierText}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-5 shadow-soft sm:p-7">
          <LocalizedRegisterForm locale={locale} startedAt={startedAt} />
        </div>
      </section>
    </main>
  );
}

function localizedLoginPageCopy(locale: TranslationLocale) {
  if (locale === "es") {
    return {
      kicker: "área personal",
      title: "Accede a tu panel.",
      intro: "La cuenta es opcional, pero te ayuda a gestionar perfil, actividad y respuestas.",
      google: "Continuar con Google",
      email: "Email",
      password: "Password",
      submit: "Entrar",
      signupText: "¿No tienes cuenta?",
      signupLink: "Registrate"
    };
  }
  if (locale === "fr") {
    return {
      kicker: "Espace personnel",
      title: "Connectez-vous ? votre tableau de bord.",
      intro: "Le compte est optionnel, mais il aide à gérer profil, activité et réponses.",
      google: "Continuer avec Google",
      email: "Email",
      password: "Mot de passe",
      submit: "Connexion",
      signupText: "Pas encore de compte ?",
      signupLink: "S'inscrire"
    };
  }
  return {
    kicker: "Personal area",
    title: "Log in to your dashboard.",
    intro: "An account is optional, but it helps you manage profile, activity and replies.",
    google: "Continue with Google",
    email: "Email",
    password: "Password",
    submit: "Log in",
    signupText: "No account yetà",
    signupLink: "Sign up"
  };
}

function LocalizedLoginPage({ locale }: { locale: TranslationLocale }) {
  const data = localizedLoginPageCopy(locale);
  const startedAt = Date.now();
  const loginPath = localizedStaticPath(locale, "login");
  return (
    <main className="bg-cream">
      <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
        <div className="w-full rounded-xl border border-line bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{data.kicker}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{data.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">{data.intro}</p>

          <Link
            href={`/api/auth/google/start?locale=${locale}&returnTo=${encodeURIComponent(loginPath)}`}
            className="focus-ring mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink transition hover:bg-petal"
          >
            <GoogleIcon />
            {data.google}
          </Link>

          <form action="/api/account/login" method="post" className="mt-5 grid gap-4">
            <input type="hidden" name="loginPath" value={loginPath} />
            <input type="hidden" name="formStartedAt" value={startedAt} />
            <label className="sr-only">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <label>
              <span className="text-sm font-semibold text-ink">{data.email}</span>
              <input name="email" type="email" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
            </label>
            <label>
              <span className="text-sm font-semibold text-ink">{data.password}</span>
              <input name="password" type="password" required className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink" />
            </label>
            <button className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
              {data.submit}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            {data.signupText}{" "}
            <Link href={localizedStaticPath(locale, "signup")} className="font-semibold text-violet-cta">
              {data.signupLink}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function StaticPage({ locale, routeKey }: { locale: TranslationLocale; routeKey: RouteKey }) {
  const data = staticPageData(locale, routeKey);
  if (!data) notFound();
  if (routeKey === "ask") return <LocalizedAskPage locale={locale} />;
  if (routeKey === "questions") return <LocalizedQuestionsPage locale={locale} />;
  if (routeKey === "magazine") return <LocalizedMagazinePage locale={locale} />;
  if (routeKey === "topics") return <LocalizedTopicsPage locale={locale} />;
  if (routeKey === "realPrices") return <LocalizedPricesPage locale={locale} />;
  if (routeKey === "localSuppliers") return <LocalizedSuppliersPage locale={locale} />;
  if (routeKey === "findSuppliers") return <LocalizedFindSuppliersPage locale={locale} />;
  if (routeKey === "analyzeQuote") return <QuoteAnalysisSeoPage page={getQuoteAnalysisHubPage(locale)} locale={locale} />;
  if (routeKey === "signup") return <LocalizedRegisterPage locale={locale} />;
  if (routeKey === "login") return <LocalizedLoginPage locale={locale} />;
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{data.title}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{data.h1}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{data.intro}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {data.bullets.map((bullet) => (
            <div key={bullet} className="rounded-xl border border-line bg-white p-5 text-sm font-semibold leading-6 text-ink shadow-sm">
              {bullet}
            </div>
          ))}
        </div>
        <Link
          href={localizedStaticPath(locale, "ask")}
          className="focus-ring mt-8 inline-flex rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover"
        >
          {data.cta}
        </Link>
      </section>
    </main>
  );
}

function supplierRequestPageCopy(locale: TranslationLocale) {
  if (locale === "es") {
    return {
      kicker: "Búsqueda de proveedores",
      title: "Una solicitud clara para encontrar proveedores en Italia.",
      intro:
        "Escribe lo esencial: ciudad italiana, fecha aproximada, número de invitados, presupuesto y tipo de servicio. La solicitud se gestiona fuera de las conversaciones públicas.",
      note: "Ideal para bodas, fiestas privadas, cumpleaños, eventos corporativos y celebraciónes en Italia.",
      formTitle: "Datos que conviene preparar",
      fields: ["Ciudad o región italiana", "Fecha o periodo del evento", "Número aproximado de invitados", "Servicios que necesitas", "Presupuesto orientativo", "Notas importantes"],
      secondary: "Leer conversaciones primero"
    };
  }
  if (locale === "fr") {
    return {
      kicker: "Recherche de prestataires",
      title: "Une demande claire pour trouver des prestataires en Italie.",
      intro:
        "Indiquez l'essentiel : ville italienne, date approximative, nombre d'invités, budget et type de service. La demande reste séparée des discussions publiques.",
      note: "Utile pour mariages, fêtes privées, anniversaires, événements d'entreprise et célébrations en Italie.",
      formTitle: "Informations a preparer",
      fields: ["Ville ou region italienne", "Date ou periode de l'événement", "Nombre approximatif d'invités", "Services recherches", "Budget indicatif", "Notes importantes"],
      secondary: "Lire les discussions d'abord"
    };
  }
  return {
    kicker: "Supplier search",
    title: "A clear request to find suppliers in Italy.",
    intro:
      "Write the essentials: Italian city, approximate date, guest count, budget and the services you need. The request is handled separately from public community discussions.",
    note: "Useful for weddings, private parties, birthdays, corporate events and célébrations in Italy.",
    formTitle: "Details to prepare",
    fields: ["Italian city or region", "Event date or period", "Approximate guest count", "Services you need", "Indicative budget", "Important notes"],
    secondary: "Read discussions first"
  };
}

function LocalizedFindSuppliersPage({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  const data = staticPageData(locale, "findSuppliers");
  const page = supplierRequestPageCopy(locale);
  const venueAlt =
    locale === "es"
      ? "Sala elegante preparada para buscar proveedores de eventos en Italia"
      : locale === "fr"
        ? "Salle élégante préparée pour trouver des prestataires événementiels en Italie"
        : "Elegant venue prepared for finding event suppliers in Italy";
  if (!data) notFound();

  return (
    <main className="bg-cream">
      <section className="mx-auto grid max-w-6xl gap-7 px-4 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <aside className="rounded-xl border border-line bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{page.kicker}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">{data.h1}</h1>
          <p className="mt-5 text-base leading-8 text-muted">{page.intro}</p>
          <p className="mt-5 rounded-xl bg-petal p-4 text-sm font-semibold leading-7 text-ink">{page.note}</p>
          <div className="mt-7 flex flex-col gap-3">
            <VibesSupplierCta variant="pink" className="min-h-12 px-5 py-3 shadow-soft">
              {c.supplierSearchCta}
            </VibesSupplierCta>
            <Link
              href={localizedStaticPath(locale, "questions")}
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-petal"
            >
              {page.secondary}
            </Link>
          </div>
        </aside>

        <section className="rounded-xl border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{page.formTitle}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{page.title}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{data.intro}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {page.fields.map((field) => (
              <div key={field} className="rounded-xl border border-line bg-cream p-4 text-sm font-semibold text-ink">
                {field}
              </div>
            ))}
          </div>
          <div className="mt-6 overflow-hidden rounded-xl border border-line">
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=76"
              alt={venueAlt}
              loading="lazy"
              decoding="async"
              className="h-64 w-full object-cover"
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function analyzeQuotePageCopy(locale: TranslationLocale) {
  if (locale === "es") {
    return {
      kicker: "Laboratorio de presupuestos",
      title: "Analiza mi presupuesto italiano",
      intro:
        "Sube una foto, PDF, Word o texto. La página lee las partidas disponibles, oculta los datos sensibles y prepara preguntas reales para comparar el precio con clientes y proveedores italianos.",
      resultKicker: "Que te devuelve",
      results: [
        "Partidas incluidas y posibles extras",
        "Preguntas distintas para DJ, catering, location, foto, flores y barra libre",
        "Puntuación por puntos de 1 a 10 sobre claridad, extras y comparación del precio",
        "Borrador listo para abrir una conversación con la comunidad"
      ],
      steps: [
        {
          title: "1. Sube o pega el presupuesto italiano",
          text: "Puedes usar texto, foto, PDF, Word o TXT. Las fotos se leen automáticamente y el archivo no se publica.",
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=76",
          alt: "Presupuesto de evento para revisar antes de confirmar en Italia"
        },
        {
          title: "2. Revisa la versión anonimizada",
          text: "Emails, teléfonos, direcciones y nombres de proveedor se sustituyen antes de publicar.",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=76",
          alt: "Control digital de un presupuesto anonimizado"
        },
        {
          title: "3. Abre una conversación",
          text: "El botón queda visible desde el inicio y se desbloquea después de cargar material: así puedes pedir una comparación real.",
          image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=640&q=76",
          alt: "Discusion con otras personas sobre un presupuesto de evento italiano"
        }
      ]
    };
  }
  if (locale === "fr") {
    return {
      kicker: "Laboratoire devis",
      title: "Analyser mon devis italien",
      intro:
        "Ajoutez une photo, un PDF, un Word ou du texte. La page lit les lignes disponibles, masque les données sensibles et prépare de vraies questions pour comparer le prix avec des clients et prestataires italiens.",
      resultKicker: "Ce que vous obtenez",
      results: [
        "Postes inclus et extras possibles",
        "Questions différentes pour DJ, traiteur, lieu, photo, fleurs et open bar",
        "Note par points de 1 a 10 sur la clarté, les extras et la comparaison du prix",
        "Brouillon prêt pour ouvrir une discussion dans la communauté"
      ],
      steps: [
        {
          title: "1. Ajoutez ou collez le devis italien",
          text: "Texte, photo, PDF, Word ou TXT : les photos sont lues automatiquement et le fichier n'est pas publié.",
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=76",
          alt: "Devis événementiel à contrôler avant de confirmer en Italie"
        },
        {
          title: "2. Vérifiez la version anonymisée",
          text: "Emails, téléphones, adresses et noms de prestataires sont remplacés avant publication.",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=76",
          alt: "Vérification numérique d'un devis anonymisé"
        },
        {
          title: "3. Ouvrez une discussion",
          text: "Le bouton reste visible dès le début et se débloque après ajout du document : vous pouvez demander un avis concret.",
          image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=640&q=76",
          alt: "Discussion avec d'autres personnes sur un devis événementiel italien"
        }
      ]
    };
  }
  return {
    kicker: "Quote Lab",
    title: "Analyze my Italian event quote",
    intro:
      "Upload a photo, PDF, Word file or text. The page reads the available lines, hides sensitive data and prepares real questions so you can compare the offer with Italian clients and suppliers.",
    resultKicker: "What you get back",
    results: [
      "Included items and possible extras",
      "Different questions for DJs, catering, venues, photos, flowers and open bar",
      "A 1 to 10 dot score on clarity, extras and price comparison",
      "A ready draft to open a conversation in the community"
    ],
    steps: [
      {
        title: "1. Upload or paste the Italian quote",
        text: "Use text, photo, PDF, Word or TXT. Photos are read automatically and the file is not published.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=76",
        alt: "Printed event quote checked before confirming an event in Italy"
      },
      {
        title: "2. Check the redacted version",
        text: "Emails, phone numbers, addresses and supplier names are replaced before posting.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=76",
        alt: "Digital check of a redacted event quote"
      },
      {
        title: "3. Open a conversation",
        text: "The button stays visible from the start and unlocks after the upload, so you can ask for a real comparison.",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=640&q=76",
        alt: "Discussion with other people about an Italian event quote"
      }
    ]
  };
}

function LocalizedAnalyzeQuotePage({ locale }: { locale: TranslationLocale }) {
  const data = staticPageData(locale, "analyzeQuote");
  const page = analyzeQuotePageCopy(locale);
  if (!data) notFound();

  return (
    <main className="bg-cream">
      <section className="relative isolate overflow-hidden border-b border-line">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=80"
          alt={page.title}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.88),rgba(47,36,48,0.62),rgba(47,36,48,0.22))]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 text-white sm:py-16 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">{page.kicker}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-rose-50 sm:text-lg">{page.intro}</p>
            <a
              href="#quote-analyzer"
              className="focus-ring mt-7 inline-flex min-h-12 items-center rounded-xl bg-violet-cta px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-violet-hover"
            >
              {data.cta}
            </a>
          </div>
          <div className="w-full min-w-0 rounded-lg border border-white/35 bg-white/95 p-5 text-ink shadow-soft backdrop-blur xl:max-w-none">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-cta">{page.resultKicker}</p>
            <ul className="mt-4 grid gap-3 text-sm font-semibold leading-6">
              {page.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-4 py-8 md:grid-cols-3">
        {page.steps.map((step) => (
          <article key={step.title} className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
            <img src={step.image} alt={step.alt} loading="lazy" decoding="async" className="h-36 w-full object-cover" />
            <div className="p-4">
              <h2 className="text-base font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
            </div>
          </article>
        ))}
      </section>
      <div id="quote-analyzer" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-14">
        <QuoteAnalyzer locale={locale} />
      </div>
    </main>
  );
}

function LocalizedAskPage({ locale }: { locale: TranslationLocale }) {
  const data = staticPageData(locale, "ask");
  const c = copy[locale];
  const community = localizedCommunity[locale];
  if (!data) notFound();

  const formCopy = {
    en: {
      prefill: "The public form is ready for your case.",
      primary: "Open the question form",
      secondary: "Read similar cases first",
      intro: "Before posting, remove private data and supplier names. Add city, guest count and the doubt you want to solve."
    },
    es: {
      prefill: "El formulario publico está listo para tu caso.",
      primary: "Abrir el formulario",
      secondary: "Leer casos parecidos",
      intro: "Antes de publicar, elimina datos privados y nombres de proveedores. Añade ciudad, invitados y la duda concreta."
    },
    fr: {
      prefill: "Le formulaire public est pret pour votre cas.",
      primary: "Ouvrir le formulaire",
      secondary: "Lire des cas proches",
      intro: "Avant de publier, retirez les données privées et les noms de prestataires. Ajoutez ville, invités et question précise."
    }
  }[locale];

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{data.title}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{data.h1}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{data.intro}</p>
            <p className="mt-5 rounded-xl border border-line bg-white p-4 text-sm leading-7 text-muted shadow-sm">{formCopy.intro}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/fai-domanda?locale=${locale}`}
                className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover"
              >
                {formCopy.primary}
              </Link>
              <Link
                href={localizedStaticPath(locale, "questions")}
                className="focus-ring rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-petal"
              >
                {formCopy.secondary}
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {data.bullets.map((bullet) => (
              <div key={bullet} className="rounded-xl border border-line bg-white p-5 text-sm font-semibold leading-6 text-ink shadow-sm">
                {bullet}
              </div>
            ))}
            <div className="rounded-xl border border-line bg-petal p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{community.liveLabel}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{formCopy.prefill}</p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.activeDiscussions}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{community.conversationsTitle}</h2>
          </div>
          <Link href={localizedStaticPath(locale, "questions")} className="focus-ring rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
            {community.conversationsCta}
          </Link>
        </div>
        <div className="mt-6 grid gap-5">
          {community.conversations.slice(0, 4).map((conversation) => (
            <ConversationCard key={conversation.title} conversation={conversation} href={localizedConversationHref(locale, conversation)} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}

function LocalizedQuestionsPage({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  const community = localizedCommunity[locale];
  return (
    <main className="bg-cream">
      <ActivityTicker locale={locale} />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.activeDiscussions}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{community.conversationsTitle}</h1>
            <p className="mt-5 text-base leading-8 text-muted">{community.conversationsIntro}</p>
          </div>
          <Link href={localizedStaticPath(locale, "ask")} className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
            {c.ask}
          </Link>
        </div>
        <LocalizedHomeSearch locale={locale} />
        <div className="mt-8 grid gap-5">
          {community.conversations.map((conversation) => (
            <ConversationCard key={conversation.title} conversation={conversation} href={localizedConversationHref(locale, conversation)} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}

function conversationDetailCopy(locale: TranslationLocale) {
  if (locale === "es") {
    return {
      back: "Volver a conversaciones",
      context: "Contexto del caso",
      answers: "Respuestas de la comunidad",
      best: "Respuesta más util",
      replyCount: "respuestas publicadas",
      budget: "Presupuesto",
      city: "Ciudad / region",
      eventType: "Tipo de evento",
      status: "Estado",
      views: "personas han visto esta conversación hoy",
      ctaTitle: "¿Tienes un caso parecido?",
      ctaText: "Abre una pregunta con ciudad, presupuesto y punto que necesitas aclarar. No hace falta registrarse.",
      ask: "Abrir mi pregunta",
      suppliersTitle: "¿Necesitas proveedores italianos?",
      suppliersText: "Puedes comparar la conversación con clientes y proveedores locales antes de decidir."
    };
  }
  if (locale === "fr") {
    return {
      back: "Retour aux discussions",
      context: "Contexte du cas",
      answers: "Reponses de la communauté",
      best: "Reponse la plus utile",
      replyCount: "réponses publiées",
      budget: "Budget",
      city: "Ville / region",
      eventType: "Type d'événement",
      status: "Statut",
      views: "personnes ont vu cette discussion aujourd'hui",
      ctaTitle: "Vous avez un cas similaire ?",
      ctaText: "Posez une question avec ville, budget et point a clarifier. L'inscription n'est pas obligatoire.",
      ask: "Poser ma question",
      suppliersTitle: "Besoin de prestataires italiens ?",
      suppliersText: "Comparez votre cas avec des clients et prestataires locaux avant de choisir."
    };
  }
  return {
    back: "Back to conversations",
    context: "Case context",
    answers: "Community answers",
    best: "Most useful answer",
    replyCount: "published replies",
    budget: "Budget",
    city: "City / region",
    eventType: "Event type",
    status: "Status",
    views: "people viewed this conversation today",
    ctaTitle: "Do you have a similar case?",
    ctaText: "Open a question with city, budget and the point you need to clarify. Registration is not mandatory.",
    ask: "Open my question",
    suppliersTitle: "Need Italian suppliers?",
    suppliersText: "Compare your case with local clients and suppliers before deciding."
  };
}

function LocalizedConversationDetailPage({ locale, conversation }: { locale: TranslationLocale; conversation: LocalizedConversation }) {
  const labels = conversationLabels(locale);
  const copy = conversationDetailCopy(locale);
  const answers = localizedConversationAnswers(locale, conversation);
  const replyCount = localizedConversationReplyCount(conversation);
  const notUsefulVotes = localizedConversationNotUsefulVotes(conversation);
  const viewsToday = localizedConversationViews(conversation);
  const highlightedAnswer = answers.find((answer) => answer.isBestAnswer) ?? answers[0];
  const conversationUrl = `${siteUrl}${localizedConversationHref(locale, conversation)}`;
  const structuredPublishedAt = "2026-06-15T09:00:00.000Z";
  const bestStructuredAnswer = answers.find((answer) => answer.isBestAnswer);
  function localizedAnswerStructuredData(answer: (typeof answers)[number], index: number) {
    const answerUrl = `${conversationUrl}#answer-${index + 1}`;
    return {
      "@type": "Answer",
      "@id": answerUrl,
      text: answer.content,
      datePublished: structuredPublishedAt,
      upvoteCount: answer.usefulVotes,
      url: answerUrl,
      author: {
        "@type": "Person",
        "@id": `${answerUrl}-author`,
        name: answer.author,
        url: answerUrl
      }
    };
  }
  const acceptedStructuredAnswer = bestStructuredAnswer
    ? localizedAnswerStructuredData(bestStructuredAnswer, answers.indexOf(bestStructuredAnswer))
    : undefined;
  const suggestedStructuredAnswers = uniqueSuggestedAnswers(
    answers
      .map((answer, index) => ({ answer, index }))
      .filter(({ answer }) => !answer.isBestAnswer)
      .map(({ answer, index }) => localizedAnswerStructuredData(answer, index)),
    acceptedStructuredAnswer
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${conversationUrl}#qa`,
    url: conversationUrl,
    mainEntity: {
      "@type": "Question",
      "@id": `${conversationUrl}#question`,
      name: conversation.title,
      text: conversation.excerpt,
      answerCount: (acceptedStructuredAnswer ? 1 : 0) + suggestedStructuredAnswers.length,
      upvoteCount: conversation.usefulVotes,
      url: conversationUrl,
      datePublished: structuredPublishedAt,
      author: {
        "@type": "Person",
        "@id": `${conversationUrl}#question-author`,
        name: conversation.author,
        url: `${conversationUrl}#question-author`
      },
      acceptedAnswer: acceptedStructuredAnswer,
      suggestedAnswer: suggestedStructuredAnswers
    }
  };

  return (
    <main className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative isolate overflow-hidden">
        <img
          src={conversation.image}
          alt={`${conversation.title} - ${conversation.eventType}`}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.9),rgba(47,36,48,0.62),rgba(47,36,48,0.22))]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 text-white sm:py-14">
          <Link href={localizedStaticPath(locale, "questions")} className="focus-ring inline-flex rounded-xl border border-white/45 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            {copy.back}
          </Link>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/95 px-3 py-1 text-ink">{conversation.eventType}</span>
            <span className="rounded-full border border-white/50 px-3 py-1">{conversation.city}</span>
            <span className="rounded-full border border-white/50 px-3 py-1">{conversation.status}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{conversation.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-rose-50 sm:text-lg">{conversation.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a href="#localized-answers" className="focus-ring inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-petal">
              {replyCount} {copy.replyCount}
            </a>
            <Link href={localizedStaticPath(locale, "ask")} className="focus-ring inline-flex rounded-xl border border-white/45 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
              {copy.ask}
            </Link>
          </div>
          <p id="question-author" className="mt-4 text-sm font-semibold text-rose-50">
            {conversation.author} · {conversation.badge} · {viewsToday} {copy.views}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          {highlightedAnswer ? (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                    {highlightedAnswer.isBestAnswer ? copy.best : copy.answers}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {highlightedAnswer.author} · {highlightedAnswer.role}
                  </p>
                </div>
                <a href="#localized-answers" className="focus-ring rounded-lg bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:bg-petal">
                  {replyCount} {labels.replies}
                </a>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink">{highlightedAnswer.content}</p>
            </section>
          ) : null}

          <section id="localized-answers" className="scroll-mt-24 rounded-xl border border-line bg-white p-5 shadow-soft">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{copy.answers}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{replyCount} {copy.replyCount}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-petal px-3 py-1 text-xs font-semibold text-violet-cta">
                  {conversation.usefulVotes} {labels.useful}
                </span>
                <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted">
                  {notUsefulVotes} {labels.notUseful}
                </span>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {answers.map((answer, index) => (
                <article id={`answer-${index + 1}`} key={`${answer.author}-${answer.role}`} className={`rounded-xl border p-4 ${answer.isBestAnswer ? "border-emerald-200 bg-emerald-50" : "border-line bg-cream"}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{answer.author}</span>
                    <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted">{answer.role}</span>
                    {answer.isBestAnswer ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">{copy.best}</span> : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink">{answer.content}</p>
                  <p className="mt-3 text-xs font-semibold text-muted">
                    {answer.usefulVotes} {labels.useful} ? {answer.notUsefulVotes} {labels.notUseful}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{copy.context}</p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                [copy.eventType, conversation.eventType],
                [copy.city, conversation.city],
                [copy.budget, conversation.budget],
                [copy.status, conversation.status]
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-cream p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
                  <dd className="mt-2 text-sm font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">{copy.ctaTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{copy.ctaText}</p>
            <Link href={localizedStaticPath(locale, "ask")} className="focus-ring mt-5 inline-flex w-full justify-center rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover">
              {copy.ask}
            </Link>
          </section>
          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">{copy.suppliersTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{copy.suppliersText}</p>
            <VibesSupplierCta variant="pink" className="mt-5 w-full justify-center">
              {copy.suppliersTitle}
            </VibesSupplierCta>
          </section>
        </aside>
      </section>
    </main>
  );
}

function LocalizedMagazinePage({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  const community = localizedCommunity[locale];
  const heroAlt =
    locale === "es"
      ? "Inspiracion editorial para organizar eventos en Italia"
      : locale === "fr"
        ? "Inspiration éditoriale pour organiser des événements en Italie"
        : "Editorial inspiration for planning events in Italy";
  return (
    <main className="bg-cream">
      <section className="relative isolate overflow-hidden">
        <img src={HERO_IMAGE} alt={heroAlt} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.88),rgba(47,36,48,0.58),rgba(47,36,48,0.16))]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">{c.magazineTitle}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">{community.magazineIntroTitle}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-rose-50">{community.magazineIntro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 md:grid-cols-2">
          {community.articles.map((article) => (
            <MagazineArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
      <ClientPathGrid locale={locale} />
    </main>
  );
}

function LocalizedTopicsPage({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  const community = localizedCommunity[locale];
  const labels = topicPageLabels(locale);
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.staticDescriptions.topics.title}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{c.staticDescriptions.topics.h1}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{c.staticDescriptions.topics.intro}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {CATEGORIES.map((category) => {
            const related = conversationsForCategory(locale, category.slug);
            const categoryText = localizedCategoryText(locale, category);
            return (
            <Link
              key={category.slug}
              href={`${localizedStaticPath(locale, "topics")}/${localizedCategorySlug(locale, category.slug)}`}
              className="focus-ring rounded-xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="block text-xl font-semibold text-ink">{categoryText.name}</span>
              <span className="mt-2 block text-sm leading-7 text-muted">{categoryText.description}</span>
              <span className="mt-4 inline-flex rounded-full bg-petal px-3 py-1 text-xs font-semibold text-violet-cta">
                {related.length} {labels.count}
              </span>
            </Link>
            );
          })}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{community.liveLabel}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {community.conversations.slice(0, 6).map((item) => (
              <Link key={item.title} href={localizedConversationHref(locale, item)} className="focus-ring rounded-xl bg-cream p-4 transition hover:bg-petal">
                <span className="block text-sm font-semibold text-ink">{item.title}</span>
                <span className="mt-2 block text-xs leading-5 text-muted">{item.city} ? {item.eventType}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function LocalizedPricesPage({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  const community = localizedCommunity[locale];
  const priceThreads = community.conversations.filter((item) => /quote|budget|presupuesto|devis|prix|cost|catering|deposit/i.test(`${item.title} ${item.budget}`));
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.pricesTitle}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{c.staticDescriptions.realPrices.h1}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{c.staticDescriptions.realPrices.intro}</p>
        <div className="mt-8 grid gap-5">
          {(priceThreads.length ? priceThreads : community.conversations.slice(0, 3)).map((conversation) => (
            <ConversationCard key={conversation.title} conversation={conversation} href={localizedConversationHref(locale, conversation)} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}

function localSuppliersHubCopy(locale: TranslationLocale) {
  if (locale === "es") {
    return {
      kicker: "Proveedores locales",
      h1: "Elige servicio y zona antes de pedir presupuestos.",
      intro:
        "Aquí encuentras páginas locales pensadas para quien está organizando de verdad un evento en Italia: qué revisar, qué preguntas hacer, qué errores evitar y cuando abrir una conversación con la comunidad.",
      searchByArea: "Buscar por zona",
      requestSuppliers: "Solicitar proveedores",
      servicesMapped: "servicios mapeados",
      regionsAvailable: "regiones disponibles",
      featuredPages: "páginas destacadas",
      startHere: "Empieza aqui",
      highIntentTitle: "Búsquedas locales con alta intención.",
      openQuestion: "Abrir una pregunta",
      localGuide: "Guía local",
      methodKicker: "Ruta rápida",
      methodStepLabel: "Paso",
      methodTitle: "Encuentra la página correcta sin perder tiempo.",
      methodIntro:
        "Esta sección no es un escaparate: te ayuda a orientarte antes de pedir presupuestos a proveedores italianos.",
      methodSteps: [
        {
          title: "Elige la zona",
          text: "Empieza por ciudad o región: disponibilidad, tiempos y desplazamientos cambian mucho en Italia."
        },
        {
          title: "Elige el servicio",
          text: "Lugar, catering, música, foto o decoración: cada guía te lleva a las preguntas adecuadas."
        },
        {
          title: "Revisa el presupuesto",
          text: "Antes de confirmar, mira extras, anticipos, horarios, personal y todo lo que queda fuera."
        },
        {
          title: "Pide una comparación",
          text: "Si tienes dudas, abre una conversación o solicita proveedores con un brief más claro."
        }
      ],
      regionArchive: "Archivo por región",
      archiveTitle: "Abre la región y elige la guía más cercana.",
      archiveText:
        "Las páginas se publican solo cuando aportan utilidad: zona, categoría, casos típicos, checklist y enlaces internos cohérentes. No son fichas de proveedores y no contienen reseñas inventadas.",
      publishedGuides: "guías locales publicadas",
      faqKicker: "Preguntas útiles",
      faqTitle: "Antes de pedir un presupuesto en Italia.",
      faqIntro:
        "Respuestas breves para entender cómo usar las guías locales y cuando pasar a una solicitud de proveedores.",
      faqs: [
        {
          question: "Estas páginas son fichas de proveedores",
          answer:
            "No. Son guías locales para entender qué preguntar antes de contactar o comparar proveedores para eventos en Italia."
        },
        {
          question: "¿Puedo pedir proveedores desde esta sección",
          answer:
            "Sì. El botón con el logo de Vibes Planner abre el módulo para buscar proveedores italianos según zona y tipo de evento."
        },
        {
          question: "¿Por qué empezar por la zona",
          answer:
            "Porque precios, logística, horarios y disponibilidad cambian mucho entre Milan, Roma, provincias y regiones italianas."
        },
        {
          question: "¿Puedo abrir una pregunta a la comunidad",
          answer:
            "Si. Si quieres una opinión pública sobre presupuesto, servicio o elección, puedes abrir una pregunta sin registro obligatorio."
        }
      ]
    };
  }

  if (locale === "fr") {
    return {
      kicker: "Prestataires locaux",
      h1: "Choisissez le service et la zone avant de demander des devis.",
      intro:
        "Vous trouvez ici des pages locales pensées pour ceux qui organisent vraiment un événement en Italie : points à vérifier, questions à poser, erreurs à éviter et moment utile pour ouvrir une discussion.",
      searchByArea: "Chercher par zone",
      requestSuppliers: "Demander des prestataires",
      servicesMapped: "services cartographies",
      regionsAvailable: "regions disponibles",
      featuredPages: "pages en avant",
      startHere: "Commencer ici",
      highIntentTitle: "Recherches locales à forte intention.",
      openQuestion: "Ouvrir une question",
      localGuide: "Guide local",
      methodKicker: "Parcours rapide",
      methodStepLabel: "Étape",
      methodTitle: "Trouvez la bonne page sans perdre de temps.",
      methodIntro:
        "Cette section n'est pas une vitrine : elle sert ? clarifier votre demande avant de contacter des prestataires italiens.",
      methodSteps: [
        {
          title: "Choisissez la zone",
          text: "Commencez par la ville ou la region : disponibilité, temps et déplacements changent beaucoup en Italie."
        },
        {
          title: "Choisissez le service",
          text: "Lieu, traiteur, musique, photo ou décoration : chaque guide vous amène aux bonnes questions."
        },
        {
          title: "Vérifiez le devis",
          text: "Avant de confirmer, regardez les extras, acomptes, horaires, personnel et ce qui reste exclu."
        },
        {
          title: "Demandez une comparaison",
          text: "En cas de doute, ouvrez une discussion ou demandez des prestataires avec un brief plus précis."
        }
      ],
      regionArchive: "Archive par région",
      archiveTitle: "Ouvrez la region et choisissez le guide le plus proche.",
      archiveText:
        "Les pages sont publiées uniquement lorsqu'elles sont utiles : zone, catégorie, cas typiques, checklist et liens internes cohérents. Ce ne sont pas des fiches prestataires et elles ne contiennent pas d'avis inventés.",
      publishedGuides: "guides locaux publiés",
      faqKicker: "Questions utiles",
      faqTitle: "Avant de demander un devis en Italie.",
      faqIntro:
        "Des réponses courtes pour comprendre comment utiliser les guides locaux et quand passer à une demande de prestataires.",
      faqs: [
        {
          question: "Ces pages sont-elles des fiches prestataires ?",
          answer:
            "Non. Ce sont des guides locaux pour comprendre quoi demander avant de contacter ou comparer des prestataires événementiels en Italie."
        },
        {
          question: "Puis-je demander des prestataires depuis cette section ?",
          answer:
            "Oui. Le bouton avec le logo Vibes Planner ouvre le formulaire pour chercher des prestataires italiens selon la zone et le type d'événement."
        },
        {
          question: "Pourquoi commencer par la zone ?",
          answer:
            "Parce que les prix, la logistique, les horaires et les disponibilités changent beaucoup entre Milan, Rome, les provinces et les régions italiennes."
        },
        {
          question: "Puis-je poser une question è la communauté ?",
          answer:
            "Oui. Si vous voulez un avis public sur un budget, un devis ou un service, vous pouvez poser une question sans inscription obligatoire."
        }
      ]
    };
  }

  return {
    kicker: "Local suppliers",
    h1: "Choose service and area before asking for quotes.",
    intro:
      "Here you will find local pages for people who are actually planning an event in Italy: what to check, which questions to ask, which mistakes to avoid and when to open a community conversation.",
    searchByArea: "Search by area",
    requestSuppliers: "Request suppliers",
    servicesMapped: "services mapped",
    regionsAvailable: "available regions",
    featuredPages: "featured pages",
    startHere: "Start here",
    highIntentTitle: "High-intent local searches.",
    openQuestion: "Open a question",
    localGuide: "Local guide",
    methodKicker: "Fast path",
    methodStepLabel: "Step",
    methodTitle: "Find the right local page without wasting time.",
    methodIntro:
      "This section is not a supplier directory: it helps you prepare a clearer request before contacting Italian suppliers.",
    methodSteps: [
      {
        title: "Choose the area",
        text: "Start from city or region: availability, travel time and logistics can change a lot in Italy."
      },
      {
        title: "Choose the service",
        text: "Venue, catering, music, photo or décor: each guide points you to the questions worth asking."
      },
      {
        title: "Check the quote",
        text: "Before confirming, review extras, deposits, timing, staff and what is not included."
      },
      {
        title: "Ask for a comparison",
        text: "If something is unclear, open a conversation or request suppliers with a sharper brief."
      }
    ],
    regionArchive: "Archive by region",
    archiveTitle: "Open the region and choose the closest guide.",
    archiveText:
      "Pages are published only when they are useful: area, category, typical cases, checklist and cohérent internal links. They are not supplier listings and do not contain invented reviews.",
    publishedGuides: "published local guides",
    faqKicker: "Useful questions",
    faqTitle: "Before asking for a quote in Italy.",
    faqIntro:
      "Short answers to understand how to use local guides and when to move to a supplier request.",
    faqs: [
      {
        question: "Are these supplier listings",
        answer:
          "No. They are local guides that help you understand what to ask before contacting or comparing Italian event suppliers."
      },
      {
        question: "Can I request suppliers from this section",
        answer:
          "Yes. The button with the Vibes Planner logo opens the form to find Italian suppliers by area and event type."
      },
      {
        question: "Why should I start from the area",
        answer:
          "Because costs, logistics, timing and availability can change a lot between Milan, Rome, provinces and Italian regions."
      },
      {
        question: "Can I open a community question",
        answer:
          "Yes. If you want a public opinion about a budget, quote or service choice, you can open a question without mandatory registration."
      }
    ]
  };
}

function LocalizedSuppliersPage({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  const pageCopy = localSuppliersHubCopy(locale);
  const featured = getFeaturedLocalSeoPages();
  const regionGroups = getLocalSeoPagesByRegion();
  const pageUrl = `https://organizzaevento.com${localizedStaticPath(locale, "localSuppliers")}`;
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageCopy.h1,
    description: pageCopy.intro,
    inLanguage: locale,
    url: pageUrl,
    hasPart: featured.slice(0, 9).map((page) => {
      const category = t(locale, page.categoryName);
      const place = placeName(locale, page.city);
      return {
        "@type": "Article",
        headline: `${category} ${place}`,
        url: `https://organizzaevento.com${localizedPath(locale, { type: "localSeo", page })}`,
        image: page.heroImage,
        about: category,
        spatialCoverage: page.region
      };
    })
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://organizzaevento.com${localizedStaticPath(locale, "localSuppliers")}#faq`,
    mainEntity: faqMainEntity(
      pageCopy.faqs.map((item) => ({ question: item.question, answer: item.answer })),
      `https://organizzaevento.com${localizedStaticPath(locale, "localSuppliers")}`
    )
  };

  return (
    <main className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{pageCopy.kicker}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl xl:text-6xl">{pageCopy.h1}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">{pageCopy.intro}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#zone"
                className="focus-ring inline-flex justify-center rounded-xl bg-violet-cta px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-hover"
              >
                {pageCopy.searchByArea}
              </Link>
              <VibesSupplierCta className="px-6">{pageCopy.requestSuppliers}</VibesSupplierCta>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-xl border border-line bg-white shadow-sm sm:grid-cols-3">
            <div className="border-b border-line p-5 sm:border-b-0 sm:border-r">
              <strong className="block text-3xl text-ink">{localSeoCategories.length}</strong>
              <span className="mt-1 block text-sm text-muted">{pageCopy.servicesMapped}</span>
            </div>
            <div className="border-b border-line p-5 sm:border-b-0 sm:border-r">
              <strong className="block text-3xl text-ink">{regionGroups.length}</strong>
              <span className="mt-1 block text-sm text-muted">{pageCopy.regionsAvailable}</span>
            </div>
            <div className="p-5">
              <strong className="block text-3xl text-ink">{featured.length}</strong>
              <span className="mt-1 block text-sm text-muted">{pageCopy.featuredPages}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid overflow-hidden rounded-xl border border-line bg-white shadow-sm lg:grid-cols-[0.82fr_1.18fr]">
          <div className="border-b border-line bg-[#fff8f4] p-6 lg:border-b-0 lg:border-r lg:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{pageCopy.methodKicker}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{pageCopy.methodTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{pageCopy.methodIntro}</p>
          </div>
          <div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {pageCopy.methodSteps.map((step, index) => (
              <div key={step.title} className="p-5 sm:p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-cta">
                  {pageCopy.methodStepLabel} {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{pageCopy.startHere}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{pageCopy.highIntentTitle}</h2>
            </div>
            <Link href={localizedStaticPath(locale, "ask")} className="focus-ring rounded-xl bg-petal px-5 py-3 text-sm font-semibold text-violet-cta">
              {pageCopy.openQuestion}
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((page) => {
              const category = t(locale, page.categoryName);
              const place = placeName(locale, page.city);
              return (
                <Link
                  key={page.slug}
                  href={localizedPath(locale, { type: "localSeo", page })}
                  className="focus-ring group overflow-hidden rounded-xl border border-line bg-cream transition hover:-translate-y-1 hover:bg-white hover:shadow-soft"
                >
                  <div className="relative h-56">
                    <img
                      src={page.heroImage}
                      alt={`${category} ${place}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,36,48,0.08),rgba(47,36,48,0.70))]" />
                    <div className="absolute bottom-0 p-5 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-100">{page.region}</p>
                      <h3 className="mt-2 text-xl font-semibold leading-tight">
                        {category} {place}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="line-clamp-3 text-sm leading-7 text-muted">{c.localSeo.intro(category, place)}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted">
                      <span className="rounded-lg bg-white px-2.5 py-1">{category}</span>
                      <span className="rounded-lg bg-white px-2.5 py-1">{pageCopy.localGuide}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="zone" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{pageCopy.regionArchive}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{pageCopy.archiveTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{pageCopy.archiveText}</p>
        </div>

        <div className="mt-6 grid gap-3">
          {regionGroups.map((group, index) => (
            <details key={group.region} open={index < 2} className="group rounded-xl border border-line bg-white p-4 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span>
                  <span className="block text-lg font-semibold text-ink">{group.region}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {group.pages.length} {pageCopy.publishedGuides}
                  </span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-petal text-violet-cta transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {group.pages.slice(0, 18).map((page) => {
                  const category = t(locale, page.categoryName);
                  const place = placeName(locale, page.city);
                  return (
                    <Link
                      key={page.slug}
                      href={localizedPath(locale, { type: "localSeo", page })}
                      className="focus-ring rounded-xl border border-line bg-cream px-4 py-3 transition hover:bg-petal"
                    >
                      <span className="block font-semibold leading-6 text-ink">
                        {category} {place}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {category} - {place}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{pageCopy.faqKicker}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{pageCopy.faqTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{pageCopy.faqIntro}</p>
          </div>
          <div className="grid gap-3">
            {pageCopy.faqs.map((item) => (
              <details key={item.question} className="group rounded-xl border border-line bg-white p-4 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                  {item.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-petal text-violet-cta transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CategoryPage({ locale, slug }: { locale: TranslationLocale; slug: string }) {
  const c = copy[locale];
  const labels = topicPageLabels(locale);
  const related = conversationsForCategory(locale, slug);
  const category = CATEGORIES.find((item) => item.slug === slug);
  const name = category ? localizedCategoryText(locale, category).name : slug;
  const cards = [
    { title: c.budget, text: c.staticDescriptions.realPrices.intro, href: localizedStaticPath(locale, "realPrices") },
    { title: c.suppliers, text: c.staticDescriptions.localSuppliers.intro, href: localizedStaticPath(locale, "localSuppliers") },
    { title: c.timeline, text: c.guide.checklistItems[0], href: localizedStaticPath(locale, "ask") },
    { title: c.community, text: c.noSignup, href: localizedStaticPath(locale, "questions") }
  ];

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.staticDescriptions.topics.title}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{name}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{c.staticDescriptions.topics.intro}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cards.map((item) => (
            <Card key={item.title} title={item.title} text={item.text} href={item.href} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{labels.active}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{labels.conversations}: {name}</h2>
          </div>
          <Link
            href={localizedStaticPath(locale, "ask")}
            className="focus-ring rounded-xl bg-violet-cta px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover"
          >
            {labels.ask}
          </Link>
        </div>
        <div className="mt-6 grid gap-5">
          {related.slice(0, 8).map((conversation) => (
            <ConversationCard key={conversation.title} conversation={conversation} href={localizedConversationHref(locale, conversation)} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}

function GuideList({ locale }: { locale: TranslationLocale }) {
  const c = copy[locale];
  const community = localizedCommunity[locale];
  const pages = getPublishedLandingPages().slice(0, 12);
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{c.staticDescriptions.eventGuides.title}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{c.staticDescriptions.eventGuides.h1}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{community.guidesIntro}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {community.guides.map((guide) => (
            <Card key={guide.title} title={guide.title} text={guide.excerpt} href={localizedStaticPath(locale, guide.hrefKey)} />
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pages.map((page) => {
            const eventType = t(locale, page.eventType);
            const place = placeName(locale, page.city);
            return (
              <Card
                key={page.slug}
                title={`${eventType} ? ${place}`}
                text={c.guide.intro(eventType, place)}
                href={localizedPath(locale, { type: "guide", page })}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}

function GuideDetail({ locale, page }: { locale: TranslationLocale; page: LandingPage }) {
  const c = copy[locale];
  const eventType = t(locale, page.eventType);
  const place = placeName(locale, page.city);
  return (
    <article className="bg-cream">
      <section className="relative isolate overflow-hidden">
        <img src={page.heroImage} alt={page.heroAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.88),rgba(47,36,48,0.55),rgba(47,36,48,0.18))]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">{c.guide.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
            {eventType} ? {place}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-rose-50">{c.guide.intro(eventType, place)}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
        <Card title={c.guide.checklist} text={c.guide.checklistItems.slice(0, 3).join(" ? ")} href={localizedStaticPath(locale, "ask")} />
        <Card title={c.guide.mistakes} text={c.guide.mistakeItems.slice(0, 3).join(" ? ")} href={localizedStaticPath(locale, "realPrices")} />
        <Card title={c.guide.community} text={c.noSignup} href={localizedStaticPath(locale, "ask")} />
      </section>
    </article>
  );
}

function LocalSeoDetail({ locale, page }: { locale: TranslationLocale; page: LocalSeoPage }) {
  const c = copy[locale];
  const category = t(locale, page.categoryName);
  const place = placeName(locale, page.city);
  return (
    <main className="bg-cream">
      <section className="relative isolate overflow-hidden">
        <img src={page.heroImage} alt={page.heroAlt} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,36,48,0.88),rgba(47,36,48,0.60),rgba(47,36,48,0.20))]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-100">{c.localSeo.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
            {category} {place}: {c.localSeo.h1Suffix}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-rose-50">{c.localSeo.intro(category, place)}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-ink">{c.localSeo.ctaTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{c.localSeo.ctaText}</p>
          <VibesSupplierCta variant="pink" className="mt-5">
            {c.staticDescriptions.findSuppliers.cta}
          </VibesSupplierCta>
        </aside>
        <div className="grid gap-6">
          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">{c.localSeo.checklistTitle}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {c.localSeo.checks.map((item) => (
                <div key={item} className="rounded-xl bg-cream p-4 text-sm font-semibold text-ink">
                  {item}
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">{c.localSeo.communityTitle}</h2>
            <div className="mt-4 grid gap-3">
              {c.localSeo.cases.map((item, index) => (
                <div key={item} className="rounded-xl bg-cream p-4 text-sm leading-7 text-muted">
                  {index + 1}. {item}
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">{c.localSeo.faqTitle}</h2>
            <div className="mt-4 grid gap-3">
              {c.localSeo.questions.map((item) => (
                <p key={item} className="rounded-xl bg-petal p-4 text-sm font-semibold text-ink">
                  {item}
                </p>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default async function LocalizedCatchAllPage({ params }: PageProps) {
  const { locale: rawLocale, path = [] } = await params;
  const locale = localeFromParam(rawLocale);
  if (!locale || locale === "it") notFound();
  getCopy(locale);
  const internationalGuide = await getInternationalGuideForPath(locale, path);
  if (internationalGuide) {
    const { InternationalEventGuidePage } = await import("@/components/InternationalEventGuidePage");
    return <InternationalEventGuidePage page={internationalGuide.page} />;
  }
  const route = resolveLocalizedRoute(locale, path);
  if (!route) {
    const fallback = await resolveFallbackLocalizedRoute(locale, path);
    if (fallback) {
      return (
        <ItalianQuestionDetailPage
          params={Promise.resolve({ slug: fallback.slug })}
          searchParams={Promise.resolve({})}
        />
      );
    }
    notFound();
  }

  if (route.type === "home") return <Home locale={locale} />;
  if (route.type === "static") return <StaticPage locale={locale} routeKey={route.key} />;
  if (route.type === "localizedConversation") return <LocalizedConversationDetailPage locale={locale} conversation={route.conversation} />;
  if (route.type === "category" || route.type === "magazineCategory") return <CategoryPage locale={locale} slug={route.slug} />;
  if (route.type === "guideList") return <GuideList locale={locale} />;
  if (route.type === "guide") return <GuideDetail locale={locale} page={route.page} />;
  if (route.type === "localSeo") return <LocalSeoDetail locale={locale} page={route.page} />;
  if (route.type === "quoteAnalysis") return <QuoteAnalysisSeoPage page={route.page} locale={locale} />;
  notFound();
}
