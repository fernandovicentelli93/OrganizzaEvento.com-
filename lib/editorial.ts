export type EditorialCategory = {
  name: string;
  slug: string;
  eyebrow: string;
  description: string;
  articleCategories: string[];
  image: string;
  faq: {
    question: string;
    answer: string;
  }[];
};

export const EDITORIAL_CATEGORIES: EditorialCategory[] = [
  {
    name: "Matrimoni",
    slug: "matrimoni",
    eyebrow: "Nozze pratiche",
    description:
      "Guide editoriali su budget, timeline, ospiti, location e scelte che rendono un matrimonio più facile da vivere.",
    articleCategories: ["Matrimoni"],
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=76",
    faq: [
      {
        question: "Da dove conviene partire per organizzare un matrimonio?",
        answer: "Da data indicativa, numero ospiti, budget massimo e tipo di esperienza che vuoi creare."
      },
      {
        question: "Gli articoli sostituiscono le conversazioni?",
        answer: "No. Gli articoli danno metodo, poi puoi aprire una domanda con il tuo caso specifico."
      }
    ]
  },
  {
    name: "Costi e budget",
    slug: "costi-budget",
    eyebrow: "Quanto costa",
    description:
      "Approfondimenti su preventivi, voci nascoste, costi per persona, location, catering, open bar e fornitori.",
    articleCategories: ["Costi"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=76",
    faq: [
      {
        question: "Perché due preventivi simili possono essere molto diversi?",
        answer: "Perché cambiano inclusioni, personale, orari extra, IVA, trasporti, pulizie e condizioni."
      },
      {
        question: "Posso pubblicare un preventivo?",
        answer: "Sì, ma senza dati personali o nomi di fornitori se vuoi evitare problemi."
      }
    ]
  },
  {
    name: "Matrimoni VIP e destination",
    slug: "matrimoni-vip-destination",
    eyebrow: "Ispirazione utile",
    description:
      "Cosa imparare da matrimoni osservati, destination wedding, privacy, ospitalità e scelte scenografiche applicabili.",
    articleCategories: ["Matrimoni VIP"],
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=76",
    faq: [
      {
        question: "Cosa ha senso copiare dai matrimoni VIP?",
        answer: "Metodo, coerenza, privacy e cura degli ospiti. Non serve copiare lusso o scenografie."
      },
      {
        question: "Un destination wedding è sempre più costoso?",
        answer: "Non sempre, ma richiede molta più attenzione a logistica, ospiti e tempi."
      }
    ]
  },
  {
    name: "Compleanni e feste private",
    slug: "feste-private",
    eyebrow: "Feste con carattere",
    description:
      "Idee e guide per compleanni adulti, diciottesimi, lauree, feste in casa, anniversari e piccoli eventi curati.",
    articleCategories: ["Feste private"],
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=76",
    faq: [
      {
        question: "Come si organizza una festa privata senza esagerare?",
        answer: "Scegli un solo elemento forte, poi semplifica cibo, musica, orari e inviti."
      },
      {
        question: "Meglio casa o location?",
        answer: "Dipende da rumore, pulizie, bagni, vicini, servizio e responsabilità sul giorno della festa."
      }
    ]
  },
  {
    name: "Eventi aziendali",
    slug: "eventi-aziendali",
    eyebrow: "Corporate umano",
    description:
      "Format, team building, cene aziendali, networking, meeting e contenuti utili per eventi meno freddi.",
    articleCategories: ["Eventi aziendali"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=76",
    faq: [
      {
        question: "Qual è l'errore più comune negli eventi aziendali?",
        answer: "Riempire troppo l'agenda e lasciare poco spazio a relazione, pause e conversazioni reali."
      },
      {
        question: "Come scelgo un team building non imbarazzante?",
        answer: "Punta su attività inclusive, leggere, non fisiche e non troppo competitive."
      }
    ]
  },
  {
    name: "Catering e food experience",
    slug: "catering-food",
    eyebrow: "Menu che funziona",
    description:
      "Catering, buffet, cena servita, open bar, intolleranze, servizio e idee food che restano pratiche.",
    articleCategories: ["Catering"],
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=76",
    faq: [
      {
        question: "Quando il buffet diventa rischioso?",
        answer: "Quando c'è un solo punto servizio, poco personale o più di 50 ospiti senza flussi chiari."
      },
      {
        question: "Come controllo il costo dell'open bar?",
        answer: "Definendo durata, drink inclusi, bartender, tetto massimo e consumi extra per iscritto."
      }
    ]
  },
  {
    name: "Idee evento",
    slug: "idee-evento",
    eyebrow: "Format realizzabili",
    description:
      "Ispirazioni concrete da trasformare in format: esperienze, temi, location insolite, momenti foto e piani B.",
    articleCategories: ["Idee evento"],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=76",
    faq: [
      {
        question: "Come capisco se un'idea evento è realizzabile?",
        answer: "Se riesci a descrivere pubblico, durata, budget, location, fornitori e piano B."
      },
      {
        question: "Meglio un'idea originale o semplice?",
        answer: "Meglio originale in un punto preciso ? semplice in tutto ciò che deve funzionare."
      }
    ]
  }
];

export function getEditorialCategory(slug: string) {
  return EDITORIAL_CATEGORIES.find((category) => category.slug === slug);
}

export function findEditorialCategoryByName(name: string) {
  return EDITORIAL_CATEGORIES.find((category) => category.articleCategories.includes(name));
}
