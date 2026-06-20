type QuestionVisualInput = {
  slug: string;
  title?: string;
  content?: string;
  postType: string;
  eventType?: string | null;
  category?: {
    slug: string;
    name: string;
  };
};

type VisualPool = {
  alt: string;
  images: string[];
};

const imageParams = "?auto=format&fit=crop&w=760&q=76";

function photo(id: string) {
  return `https://images.unsplash.com/${id}${imageParams}`;
}

const categoryVisuals: Record<string, VisualPool> = {
  "da-dove-inizio": {
    alt: "Dettaglio di pianificazione evento con appunti e tavolo di lavoro",
    images: [
      photo("photo-1454165804606-c3d57bc86b40"),
      photo("photo-1516321318423-f06f85e504b3"),
      photo("photo-1497366754035-f200968a6e72"),
      photo("photo-1500530855697-b586d89ba3ee"),
      photo("photo-1517245386807-bb43f82c33c4"),
      photo("photo-1522202176988-66273c2fd55f"),
      photo("photo-1506784983877-45594efa4cbe"),
      photo("photo-1517048676732-d65bc937f952"),
      photo("photo-1521737604893-d14cc237f11d"),
      photo("photo-1519389950473-47ba0277781c")
    ]
  },
  "quanto-costa": {
    alt: "Dettaglio di preventivo, budget o tavola evento",
    images: [
      photo("photo-1554224155-6726b3ff858f"),
      photo("photo-1554224154-26032ffc0d07"),
      photo("photo-1450101499163-c8848c66ca85"),
      photo("photo-1467003909585-2f8a72700288"),
      photo("photo-1555244162-803834f70033"),
      photo("photo-1464366400600-7168b8af9bc3"),
      photo("photo-1414235077428-338989a2e8c0"),
      photo("photo-1540189549336-e6e99c3679fe"),
      photo("photo-1504674900247-0877df9cc836"),
      photo("photo-1529692236671-f1f6cf9683ba")
    ]
  },
  location: {
    alt: "Dettaglio di location per eventi",
    images: [
      photo("photo-1464366400600-7168b8af9bc3"),
      photo("photo-1519167758481-83f550bb49b3"),
      photo("photo-1505236858219-8359eb29e329"),
      photo("photo-1528605248644-14dd04022da1"),
      photo("photo-1414235077428-338989a2e8c0"),
      photo("photo-1505373877841-8d25f7d46678"),
      photo("photo-1517245386807-bb43f82c33c4"),
      photo("photo-1524777313293-86d2ab467344"),
      photo("photo-1556761175-b413da4baf72"),
      photo("photo-1500530855697-b586d89ba3ee")
    ]
  },
  "catering-menu": {
    alt: "Dettaglio di catering, menù e servizio tavola",
    images: [
      photo("photo-1555244162-803834f70033"),
      photo("photo-1467003909585-2f8a72700288"),
      photo("photo-1543352634-a1c51d9f1fa7"),
      photo("photo-1504674900247-0877df9cc836"),
      photo("photo-1540189549336-e6e99c3679fe"),
      photo("photo-1498654896293-37aacf113fd9"),
      photo("photo-1515003197210-e0cd71810b5f"),
      photo("photo-1529692236671-f1f6cf9683ba"),
      photo("photo-1514986888952-8cd320577b68"),
      photo("photo-1478144592103-25e218a04891")
    ]
  },
  "musica-dj": {
    alt: "Dettaglio di musica, DJ o intrattenimento per eventi",
    images: [
      photo("photo-1514525253161-7a46d19cd819"),
      photo("photo-1506157786151-b8491531f063"),
      photo("photo-1524368535928-5b5e00ddc76b"),
      photo("photo-1493225457124-a3eb161ffa5f"),
      photo("photo-1470225620780-dba8ba36b745"),
      photo("photo-1501386761578-eac5c94b800a"),
      photo("photo-1516280440614-37939bbacd81"),
      photo("photo-1487180144351-b8472da7d491"),
      photo("photo-1499364615650-ec38552f4f34"),
      photo("photo-1508700115892-45ecd05ae2ad")
    ]
  },
  "fiori-allestimenti": {
    alt: "Dettaglio di fiori e allestimenti per evento",
    images: [
      photo("photo-1519741497674-611481863552"),
      photo("photo-1523438885200-e635ba2c371e"),
      photo("photo-1469371670807-013ccf25f16a"),
      photo("photo-1509927083803-4bd519298ac4"),
      photo("photo-1529634597503-139d3726fed5"),
      photo("photo-1525258946800-98cfd641d0de"),
      photo("photo-1519225421980-715cb0215aed"),
      photo("photo-1522673607200-164d1b6ce486"),
      photo("photo-1511285560929-80b456fea0bc"),
      photo("photo-1520854221256-17451cc331bf")
    ]
  },
  "foto-video": {
    alt: "Dettaglio di fotografía e video per evento",
    images: [
      photo("photo-1529634597503-139d3726fed5"),
      photo("photo-1516035069371-29a1b244cc32"),
      photo("photo-1492691527719-9d1e07e534b4"),
      photo("photo-1502982720700-bfff97f2ecac"),
      photo("photo-1510127034890-ba27508e9f1c"),
      photo("photo-1487412720507-e7ab37603c6f"),
      photo("photo-1511285560929-80b456fea0bc"),
      photo("photo-1523438885200-e635ba2c371e"),
      photo("photo-1492684223066-81342ee5ff30"),
      photo("photo-1505373877841-8d25f7d46678")
    ]
  },
  matrimoni: {
    alt: "Dettaglio elegante di matrimonio",
    images: [
      photo("photo-1511285560929-80b456fea0bc"),
      photo("photo-1519741497674-611481863552"),
      photo("photo-1520854221256-17451cc331bf"),
      photo("photo-1519225421980-715cb0215aed"),
      photo("photo-1469371670807-013ccf25f16a"),
      photo("photo-1523438885200-e635ba2c371e"),
      photo("photo-1509927083803-4bd519298ac4"),
      photo("photo-1525258946800-98cfd641d0de"),
      photo("photo-1529634597503-139d3726fed5"),
      photo("photo-1522673607200-164d1b6ce486")
    ]
  },
  "compleanni-feste-private": {
    alt: "Dettaglio di compleanno o festa privata",
    images: [
      photo("photo-1527529482837-4698179dc6ce"),
      photo("photo-1530103862676-de8c9debad1d"),
      photo("photo-1496843916299-590492c751f4"),
      photo("photo-1519671482749-fd09be7ccebf"),
      photo("photo-1533174072545-7a4b6ad7a6c3"),
      photo("photo-1513151233558-d860c5398176"),
      photo("photo-1486591038957-19e7c73bdc41"),
      photo("photo-1519677100203-a0e668c92439"),
      photo("photo-1505236858219-8359eb29e329"),
      photo("photo-1492684223066-81342ee5ff30")
    ]
  },
  "eventi-aziendali": {
    alt: "Dettaglio di evento aziendale, meeting o team building",
    images: [
      photo("photo-1505373877841-8d25f7d46678"),
      photo("photo-1556761175-b413da4baf72"),
      photo("photo-1542744173-8e7e53415bb0"),
      photo("photo-1556761175-b413da4baf72"),
      photo("photo-1521737604893-d14cc237f11d"),
      photo("photo-1517245386807-bb43f82c33c4"),
      photo("photo-1511578314322-379afb476865"),
      photo("photo-1556761175-5973dc0f32e7"),
      photo("photo-1517048676732-d65bc937f952"),
      photo("photo-1559223607-a43c990c692c")
    ]
  },
  "problemi-fornitori": {
    alt: "Dettaglio di accordi, fornitori e organizzazione evento",
    images: [
      photo("photo-1450101499163-c8848c66ca85"),
      photo("photo-1554224155-6726b3ff858f"),
      photo("photo-1516321318423-f06f85e504b3"),
      photo("photo-1521791136064-7986c2920216"),
      photo("photo-1522202176988-66273c2fd55f"),
      photo("photo-1454165804606-c3d57bc86b40"),
      photo("photo-1519389950473-47ba0277781c"),
      photo("photo-1517245386807-bb43f82c33c4"),
      photo("photo-1497366754035-f200968a6e72"),
      photo("photo-1506784983877-45594efa4cbe")
    ]
  },
  "idee-evento": {
    alt: "Dettaglio creativo per idee evento",
    images: [
      photo("photo-1492684223066-81342ee5ff30"),
      photo("photo-1524777313293-86d2ab467344"),
      photo("photo-1529634806980-85c3dd6d34ac"),
      photo("photo-1491438590914-bc09fcaaf77a"),
      photo("photo-1533174072545-7a4b6ad7a6c3"),
      photo("photo-1528605248644-14dd04022da1"),
      photo("photo-1517457373958-b7bdd4587205"),
      photo("photo-1543269865-cbf427effbad"),
      photo("photo-1519671482749-fd09be7ccebf"),
      photo("photo-1505236858219-8359eb29e329")
    ]
  }
};

const areaFallbacks: Record<string, string> = {
  matrimonio: "matrimoni",
  "compleanni-feste-private": "compleanni-feste-private",
  "eventi-aziendali": "eventi-aziendali",
  "idee-evento": "idee-evento"
};

function hashValue(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function includesAny(value: string, words: string[]) {
  return words.some((word) => value.includes(word));
}

function topicKeyOverride(question: QuestionVisualInput) {
  const title = (question.title ?? "").toLowerCase();
  const content = (question.content ?? "").toLowerCase();
  const combined = `${title} ${content} ${question.eventType ?? ""} ${question.category?.name ?? ""}`.toLowerCase();
  const genericCategory = ["quanto-costa", "da-dove-inizio", "problemi-fornitori", "idee-evento"].includes(question.category?.slug ?? "");

  if (includesAny(title, ["dj", "musica", "band", "siae", "playlist"]) || (genericCategory && includesAny(combined, [" dj", "musica", "band", "siae", "playlist"]))) {
    return "musica-dj";
  }

  if (
    includesAny(title, ["catering", "menu", "buffet", "open bar", "torta", "bevande", "cena servita"]) ||
    (genericCategory && includesAny(combined, ["catering", "menu", "buffet", "open bar", "torta", "bevande", "cena servita"]))
  ) {
    return "catering-menu";
  }

  if (
    includesAny(title, ["location", "villa", "ristorante", "agriturismo", "sala", "hotel", "spazio"]) ||
    (genericCategory && includesAny(combined, ["location", "villa", "ristorante", "agriturismo", "sala", "hotel", "spazio"]))
  ) {
    return "location";
  }

  if (
    includesAny(title, ["fiori", "floreal", "allestiment", "décorazion", "bouquet"]) ||
    (genericCategory && includesAny(combined, ["fiori", "floreal", "allestiment", "décorazion", "bouquet"]))
  ) {
    return "fiori-allestimenti";
  }

  if (
    includesAny(title, ["fotografo", "fotografía", "foto", "video", "videomaker"]) ||
    (genericCategory && includesAny(combined, ["fotografo", "fotografía", "foto", "video", "videomaker"]))
  ) {
    return "foto-video";
  }

  return null;
}

function categoryKeyFor(question: QuestionVisualInput) {
  const override = topicKeyOverride(question);
  if (override) return override;

  const categorySlug = question.category?.slug ?? "";
  if (categoryVisuals[categorySlug]) return categorySlug;
  if (areaFallbacks[categorySlug]) return areaFallbacks[categorySlug];

  const eventType = question.eventType ?? "";
  if (eventType.includes("Matrimonio")) return "matrimoni";
  if (
    eventType.includes("Compleanno") ||
    eventType.includes("Diciottesimo") ||
    eventType.includes("Laurea") ||
    eventType.includes("Festa") ||
    eventType.includes("Anniversario")
  ) {
    return "compleanni-feste-private";
  }
  if (eventType.includes("aziendale") || eventType.includes("Team")) return "eventi-aziendali";
  if (question.postType === "Quanto costa" || question.postType === "Preventivo") return "quanto-costa";
  if (question.postType === "Idea") return "idee-evento";
  return "da-dove-inizio";
}

export function getQuestionVisual(question: QuestionVisualInput) {
  const categoryKey = categoryKeyFor(question);
  const pool = categoryVisuals[categoryKey] ?? categoryVisuals["da-dove-inizio"];
  const seed = `${categoryKey}:${question.slug}:${question.title ?? ""}:${question.content ?? ""}`;
  const index = hashValue(seed) % pool.images.length;

  return {
    src: pool.images[index],
    alt: pool.alt,
    categoryKey,
    index
  };
}
