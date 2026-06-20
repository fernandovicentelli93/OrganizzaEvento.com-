import type { Locale } from "@/lib/i18n-basic";

import { italianProvinceLabels } from "@/lib/vibes-geo";

export type VibesSupplierCategory = {
  label: string;
  slug: string;
  aliases: string[];
  subcategories: string[];
};

export type VibesSupplierCard = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  location: string;
  address?: string | null;
  imageUrl: string | null;
  vibesUrl: string;
  premium: boolean;
  serviceArea: "local" | "italy" | "unknown";
  serviceAreaLabel: string;
  services: string[];
  score: number;
  distanceKm?: number;
  distanceSource?: "address" | "city";
};

export const VIBES_SUPPLIER_CATEGORIES: VibesSupplierCategory[] = [
  {
    label: "Esperienze",
    slug: "esperienze",
    aliases: ["esperienza", "degustazione", "tour", "attività", "experience"],
    subcategories: ["Enogastronomiche", "Culturali", "Rurali", "Acquatiche e marine", "Wellness", "Outdoor"]
  },
  {
    label: "Event Planner",
    slug: "event-planner",
    aliases: ["planner", "wedding planner", "organizzatore", "coordinamento", "regia", "corporate retreat", "retreat", "destination event"],
    subcategories: ["Wedding planner", "Event planner aziendale", "Coordinamento evento", "Destination wedding", "Private party planner"]
  },
  {
    label: "Location",
    slug: "location",
    aliases: ["location", "venue", "place", "lieu", "lugar", "villa", "ristorante", "sala", "spazio", "hotel", "rooftop", "agriturismo", "piscina", "pool"],
    subcategories: [
      "Agriturismi",
      "Hotel & Resort",
      "Parchi / Giardini",
      "Ristoranti",
      "Rooftop",
      "Sale Conferenze",
      "Spazi Industriali",
      "Stabilimenti Balneari e Spiagge",
      "Ville e Dimore Storiche",
      "Location per Eventi Aziendali"
    ]
  },
  {
    label: "Catering e Gastronomia",
    slug: "catering-e-gastronomia",
    aliases: ["catering", "traiteur", "menu", "chef", "banqueting", "open bar", "drink", "food", "bar", "comida", "gastronomie"],
    subcategories: ["Catering", "Banqueting", "Private chef", "Open bar", "Cocktail bar", "Fruit catering", "Degustazioni", "BBQ"]
  },
  {
    label: "Hostess, Promoter e Ragazze immagine",
    slug: "hostess-promoter-e-ragazze-immagine",
    aliases: ["hostess", "promoter", "steward", "accoglienza"],
    subcategories: ["Hostess eventi", "Promoter", "Steward", "Accoglienza multilingue", "Ragazze immagine"]
  },
  {
    label: "Supporto Eventi",
    slug: "supporto-eventi",
    aliases: ["supporto", "allestimento", "noleggio", "service", "logistica", "staff"],
    subcategories: ["Noleggi", "Allestimenti", "Logistica", "Service eventi", "Coordinamento operativo"]
  },
  {
    label: "Musica",
    slug: "musica",
    aliases: ["musica", "dj", "band", "cantante", "sound", "siae"],
    subcategories: ["DJ", "Band", "Musica dal vivo", "Cantanti", "Pianobar", "Service audio", "Cerimonia"]
  },
  {
    label: "Intrattenimento",
    slug: "intrattenimento",
    aliases: ["intrattenimento", "animazione", "artista", "spettacolo", "performer", "team building", "animation", "entertainment"],
    subcategories: ["Animazione", "Performer", "Artisti", "Team building", "Spettacoli", "Magia", "Esperienze interattive"]
  },
  {
    label: "Fioristi, Allestimenti floreali e verde",
    slug: "fioristi-allestimenti-floreali-e-verde",
    aliases: ["fiori", "fiorista", "floreale", "verde", "allestimento floreale"],
    subcategories: ["Bouquet", "Centrotavola", "Cerimonia", "Allestimenti floreali", "Piante e verde", "Flower design"]
  },
  {
    label: "Fotografi e Videomaker",
    slug: "fotografi-e-videomaker",
    aliases: ["fotografo", "fotografia", "photographer", "photographe", "fotografía", "video", "videomaker", "shooting", "drone"],
    subcategories: ["Fotografi", "Videomaker", "Drone", "Shooting", "Reportage evento", "Photo booth"]
  },
  {
    label: "Servizi Creativi e Digitali",
    slug: "servizi-creativi-e-digitali",
    aliases: ["creativo", "digitale", "inviti", "grafica", "social", "comunicazione"],
    subcategories: ["Grafica", "Inviti digitali", "Social media", "Siti evento", "Branding evento", "Contenuti digitali"]
  },
  {
    label: "Salute e Bellezza",
    slug: "salute-e-bellezza",
    aliases: ["trucco", "make up", "parrucco", "beauty", "benessere"],
    subcategories: ["Make-up", "Hair stylist", "Beauty", "Benessere", "Massaggi", "Preparazione sposi"]
  },
  {
    label: "Articoli da Regalo",
    slug: "articoli-da-regalo",
    aliases: ["regali", "bomboniere", "gadget", "cadeau"],
    subcategories: ["Bomboniere", "Gadget", "Regali ospiti", "Gift box", "Personalizzati"]
  },
  {
    label: "Tecnici e Allestitori",
    slug: "tecnici-e-allestitori",
    aliases: ["técnico", "luci", "audio", "palco", "allestitore", "ledwall"],
    subcategories: ["Audio", "Luci", "Palchi", "LED wall", "Tecnici evento", "Strutture temporanee"]
  },
  {
    label: "Gioiellerie",
    slug: "gioiellerie",
    aliases: ["gioielli", "fedi", "anelli", "orologio"],
    subcategories: ["Fedi", "Gioielli sposi", "Accessori cerimonia", "Regali preziosi"]
  },
  {
    label: "Sicurezza Privata",
    slug: "sicurezza-privata",
    aliases: ["sicurezza", "security", "sorveglianza", "buttafuori"],
    subcategories: ["Security eventi", "Controllo accessi", "Sorveglianza", "Steward sicurezza"]
  },
  {
    label: "Trasporti",
    slug: "trasporti",
    aliases: ["trasporto", "navetta", "auto", "ncc", "bus", "transfer"],
    subcategories: ["NCC", "Navette", "Bus ospiti", "Auto cerimonia", "Transfer", "Logistica trasporti"]
  },
  {
    label: "Vestiti per Eventi e Cerimonie",
    slug: "vestiti-per-eventi-e-cerimonie",
    aliases: ["vestito", "abito", "cerimonia", "sposa", "sposo"],
    subcategories: ["Abiti cerimonia", "Abiti sposa", "Abiti sposo", "Accessori", "Noleggio abiti"]
  }
];

export const VIBES_EVENT_TYPES = ["Matrimonio", "Compleanno", "Festa privata", "Evento aziendale", "Team building", "Laurea", "Diciottesimo", "Cena privata", "Destination wedding"];

export const VIBES_PROVINCES = italianProvinceLabels();

const CATEGORY_LABELS: Record<string, Partial<Record<Locale, string>>> = {
  esperienze: {
    en: "Experiences",
    es: "Experiencias",
    fr: "Expériences"
  },
  "event-planner": {
    en: "Event planners",
    es: "Organización de eventos",
    fr: "Organisation événementielle"
  },
  location: {
    en: "Venues",
    es: "Espacios y lugares",
    fr: "Lieux de réception"
  },
  "catering-e-gastronomia": {
    en: "Catering and food",
    es: "Catering y gastronomía",
    fr: "Traiteur et gastronomie"
  },
  "hostess-promoter-e-ragazze-immagine": {
    en: "Hostesses and promoters",
    es: "Azafatas y promotores",
    fr: "Hôtes et promoteurs"
  },
  "supporto-eventi": {
    en: "Event support",
    es: "Soporte para eventos",
    fr: "Support événementiel"
  },
  musica: {
    en: "Music",
    es: "Música",
    fr: "Musique"
  },
  intrattenimento: {
    en: "Entertainment",
    es: "Entretenimiento",
    fr: "Animation"
  },
  "fioristi-allestimenti-floreali-e-verde": {
    en: "Florists and floral design",
    es: "Floristas y decoración floral",
    fr: "Fleuristes et décoration florale"
  },
  "fotografi-e-videomaker": {
    en: "Photographers and videomakers",
    es: "Fotógrafos y videógrafos",
    fr: "Photographes et vidéastes"
  },
  "servizi-creativi-e-digitali": {
    en: "Creative and digital services",
    es: "Servicios creativos y digitales",
    fr: "Services créatifs et digitaux"
  },
  "salute-e-bellezza": {
    en: "Beauty and wellness",
    es: "Belleza y bienestar",
    fr: "Beauté et bien-être"
  },
  "articoli-da-regalo": {
    en: "Gifts and favors",
    es: "Regalos y detalles",
    fr: "Cadeaux et souvenirs"
  },
  "tecnici-e-allestitori": {
    en: "Technicians and production",
    es: "Técnicos y montaje",
    fr: "Technique et installation"
  },
  gioiellerie: {
    en: "Jewelry",
    es: "Joyerías",
    fr: "Bijouteries"
  },
  "sicurezza-privata": {
    en: "Private security",
    es: "Seguridad privada",
    fr: "Sécurité privée"
  },
  trasporti: {
    en: "Transport",
    es: "Transporte",
    fr: "Transport"
  },
  "vestiti-per-eventi-e-cerimonie": {
    en: "Event and ceremony outfits",
    es: "Vestidos para eventos y ceremonias",
    fr: "Tenues de cérémonie"
  }
};

const SUBCATEGORY_LABELS: Record<string, Partial<Record<Locale, string>>> = {
  Esperienze: { en: "Experiences", es: "Experiencias", fr: "Expériences" },
  "Event Planner": { en: "Event planners", es: "Organización de eventos", fr: "Organisation événementielle" },
  Location: { en: "Venues", es: "Espacios y lugares", fr: "Lieux de réception" },
  "Catering e Gastronomia": { en: "Catering and food", es: "Catering y gastronomía", fr: "Traiteur et gastronomie" },
  "Hostess, Promoter e Ragazze immagine": { en: "Hostesses and promoters", es: "Azafatas y promotores", fr: "Hôtes et promoteurs" },
  "Supporto Eventi": { en: "Event support", es: "Soporte para eventos", fr: "Support événementiel" },
  Musica: { en: "Music", es: "Música", fr: "Musique" },
  Intrattenimento: { en: "Entertainment", es: "Entretenimiento", fr: "Animation" },
  "Fioristi, Allestimenti floreali e verde": { en: "Florists and floral design", es: "Floristas y decoración floral", fr: "Fleuristes et décoration florale" },
  "Fotografi e Videomaker": { en: "Photographers and videomakers", es: "Fotógrafos y videógrafos", fr: "Photographes et vidéastes" },
  "Servizi Creativi e Digitali": { en: "Creative and digital services", es: "Servicios creativos y digitales", fr: "Services créatifs et digitaux" },
  "Salute e Bellezza": { en: "Beauty and wellness", es: "Belleza y bienestar", fr: "Beauté et bien-être" },
  "Articoli da Regalo": { en: "Gifts and favors", es: "Regalos y detalles", fr: "Cadeaux et souvenirs" },
  "Tecnici e Allestitori": { en: "Technicians and production", es: "Técnicos y montaje", fr: "Technique et installation" },
  Gioiellerie: { en: "Jewelry", es: "Joyerías", fr: "Bijouteries" },
  "Sicurezza Privata": { en: "Private security", es: "Seguridad privada", fr: "Sécurité privée" },
  Trasporti: { en: "Transport", es: "Transporte", fr: "Transport" },
  "Vestiti per Eventi e Cerimonie": { en: "Event and ceremony outfits", es: "Vestidos para eventos y ceremonias", fr: "Tenues de cérémonie" },
  Enogastronomiche: { en: "Food and wine", es: "Enogastronómicas", fr: "Gastronomie et vin" },
  Culturali: { en: "Cultural", es: "Culturales", fr: "Culturelles" },
  Rurali: { en: "Countryside", es: "Rurales", fr: "Rurales" },
  "Acquatiche e marine": { en: "Water and seaside", es: "Acuáticas y marinas", fr: "Aquatiques et marines" },
  Wellness: { en: "Wellness", es: "Bienestar", fr: "Bien-être" },
  Outdoor: { en: "Outdoor", es: "Al aire libre", fr: "Plein air" },
  "Wedding planner": { en: "Wedding planner", es: "Wedding planner", fr: "Wedding planner" },
  "Event planner aziendale": { en: "Corporate event planner", es: "Event planner corporativo", fr: "Event planner corporate" },
  "Coordinamento evento": { en: "Event coordination", es: "Coordinación del evento", fr: "Coordination événementielle" },
  "Destination wedding": { en: "Destination wedding", es: "Boda de destino", fr: "Mariage de destination" },
  "Private party planner": { en: "Private party planner", es: "Organizador de fiestas privadas", fr: "Planner de fêtes privées" },
  Agriturismi: { en: "Farm stays", es: "Agriturismos", fr: "Agritourismes" },
  "Hotel & Resort": { en: "Hotels and resorts", es: "Hoteles y resorts", fr: "Hôtels et resorts" },
  "Parchi / Giardini": { en: "Parks and gardens", es: "Parques y jardines", fr: "Parcs et jardins" },
  Ristoranti: { en: "Restaurants", es: "Restaurantes", fr: "Restaurants" },
  Rooftop: { en: "Rooftops", es: "Rooftops", fr: "Rooftops" },
  "Sale Conferenze": { en: "Conference rooms", es: "Salas de conferencias", fr: "Salles de conférence" },
  "Spazi Industriali": { en: "Industrial spaces", es: "Espacios industriales", fr: "Espaces industriels" },
  "Stabilimenti Balneari e Spiagge": { en: "Beach clubs and beaches", es: "Playas y clubs de playa", fr: "Plages et établissements balnéaires" },
  "Ville e Dimore Storiche": { en: "Villas and historic residences", es: "Villas y residencias históricas", fr: "Villas et demeures historiques" },
  "Location per Eventi Aziendali": { en: "Corporate event venues", es: "Espacios para eventos corporativos", fr: "Lieux pour événements corporate" },
  Catering: { en: "Catering", es: "Catering", fr: "Traiteur" },
  Banqueting: { en: "Banqueting", es: "Banqueting", fr: "Banqueting" },
  "Private chef": { en: "Private chef", es: "Chef privado", fr: "Chef privé" },
  "Open bar": { en: "Open bar", es: "Bar libre", fr: "Open bar" },
  "Cocktail bar": { en: "Cocktail bar", es: "Bar de cócteles", fr: "Bar à cocktails" },
  "Fruit catering": { en: "Fruit catering", es: "Catering de fruta", fr: "Fruit catering" },
  Degustazioni: { en: "Tastings", es: "Degustaciones", fr: "Dégustations" },
  BBQ: { en: "BBQ", es: "BBQ", fr: "BBQ" },
  "Hostess eventi": { en: "Event hostesses", es: "Azafatas para eventos", fr: "Hôtes et hôtesses événementiels" },
  Promoter: { en: "Promoters", es: "Promotores", fr: "Promoteurs" },
  Steward: { en: "Stewards", es: "Stewards", fr: "Stewards" },
  "Accoglienza multilingue": { en: "Multilingual welcome staff", es: "Recepción multilingüe", fr: "Accueil multilingue" },
  "Ragazze immagine": { en: "Promotional staff", es: "Personal de imagen", fr: "Personnel d'image" },
  Noleggi: { en: "Rentals", es: "Alquileres", fr: "Locations" },
  Allestimenti: { en: "Set-ups", es: "Montajes", fr: "Installations" },
  Logistica: { en: "Logistics", es: "Logística", fr: "Logistique" },
  "Service eventi": { en: "Event services", es: "Servicios para eventos", fr: "Services événementiels" },
  "Coordinamento operativo": { en: "On-site coordination", es: "Coordinación operativa", fr: "Coordination opérationnelle" },
  DJ: { en: "DJ", es: "DJ", fr: "DJ" },
  Band: { en: "Band", es: "Banda", fr: "Groupe" },
  "Musica dal vivo": { en: "Live music", es: "Música en vivo", fr: "Musique live" },
  Cantanti: { en: "Singers", es: "Cantantes", fr: "Chanteurs" },
  Pianobar: { en: "Piano bar", es: "Piano bar", fr: "Piano-bar" },
  "Service audio": { en: "Audio service", es: "Servicio de audio", fr: "Service audio" },
  Cerimonia: { en: "Ceremony", es: "Ceremonia", fr: "Cérémonie" },
  Animazione: { en: "Animation", es: "Animación", fr: "Animation" },
  Performer: { en: "Performers", es: "Performers", fr: "Performers" },
  Artisti: { en: "Artists", es: "Artistas", fr: "Artistes" },
  "Team building": { en: "Team building", es: "Team building", fr: "Team building" },
  Spettacoli: { en: "Shows", es: "Espectáculos", fr: "Spectacles" },
  Magia: { en: "Magic", es: "Magia", fr: "Magie" },
  "Esperienze interattive": { en: "Interactive experiences", es: "Experiencias interactivas", fr: "Expériences interactives" },
  Bouquet: { en: "Bouquets", es: "Ramos", fr: "Bouquets" },
  Centrotavola: { en: "Centerpieces", es: "Centros de mesa", fr: "Centres de table" },
  "Allestimenti floreali": { en: "Floral installations", es: "Montajes florales", fr: "Décors floraux" },
  "Piante e verde": { en: "Plants and greenery", es: "Plantas y verde", fr: "Plantes et végétal" },
  "Flower design": { en: "Flower design", es: "Diseño floral", fr: "Design floral" },
  Fotografi: { en: "Photographers", es: "Fotógrafos", fr: "Photographes" },
  Videomaker: { en: "Videomakers", es: "Videógrafos", fr: "Vidéastes" },
  Drone: { en: "Drone", es: "Drone", fr: "Drone" },
  Shooting: { en: "Photo shoots", es: "Sesiones de fotos", fr: "Shooting photo" },
  "Reportage evento": { en: "Event reportage", es: "Reportaje de evento", fr: "Reportage événementiel" },
  "Photo booth": { en: "Photo booth", es: "Photobooth", fr: "Photobooth" },
  Grafica: { en: "Graphic design", es: "Diseño gráfico", fr: "Graphisme" },
  "Inviti digitali": { en: "Digital invitations", es: "Invitaciones digitales", fr: "Invitations digitales" },
  "Social media": { en: "Social media", es: "Redes sociales", fr: "Réseaux sociaux" },
  "Siti evento": { en: "Event websites", es: "Webs de evento", fr: "Sites événementiels" },
  "Branding evento": { en: "Event branding", es: "Branding de evento", fr: "Branding événementiel" },
  "Contenuti digitali": { en: "Digital content", es: "Contenidos digitales", fr: "Contenus digitaux" },
  "Make-up": { en: "Make-up", es: "Maquillaje", fr: "Maquillage" },
  "Hair stylist": { en: "Hair stylist", es: "Peluquería", fr: "Coiffure" },
  Beauty: { en: "Beauty", es: "Belleza", fr: "Beauté" },
  Benessere: { en: "Wellness", es: "Bienestar", fr: "Bien-être" },
  Massaggi: { en: "Massages", es: "Masajes", fr: "Massages" },
  "Preparazione sposi": { en: "Wedding preparation", es: "Preparación de novios", fr: "Préparation des mariés" },
  Bomboniere: { en: "Wedding favors", es: "Detalles para invitados", fr: "Cadeaux d'invités" },
  Gadget: { en: "Gadgets", es: "Gadgets", fr: "Goodies" },
  "Regali ospiti": { en: "Guest gifts", es: "Regalos para invitados", fr: "Cadeaux invités" },
  "Gift box": { en: "Gift boxes", es: "Gift boxes", fr: "Coffrets cadeaux" },
  Personalizzati: { en: "Personalized items", es: "Personalizados", fr: "Personnalisés" },
  Audio: { en: "Audio", es: "Audio", fr: "Audio" },
  Luci: { en: "Lighting", es: "Luces", fr: "Lumières" },
  Palchi: { en: "Stages", es: "Escenarios", fr: "Scènes" },
  "LED wall": { en: "LED wall", es: "Pantalla LED", fr: "Mur LED" },
  "Tecnici evento": { en: "Event technicians", es: "Técnicos de evento", fr: "Techniciens événementiels" },
  "Strutture temporanee": { en: "Temporary structures", es: "Estructuras temporales", fr: "Structures temporaires" },
  Fedi: { en: "Wedding rings", es: "Alianzas", fr: "Alliances" },
  "Gioielli sposi": { en: "Wedding jewelry", es: "Joyas para novios", fr: "Bijoux de mariage" },
  "Accessori cerimonia": { en: "Ceremony accessories", es: "Accesorios de ceremonia", fr: "Accessoires de cérémonie" },
  "Regali preziosi": { en: "Fine gifts", es: "Regalos preciosos", fr: "Cadeaux précieux" },
  "Security eventi": { en: "Event security", es: "Seguridad para eventos", fr: "Sécurité événementielle" },
  "Controllo accessi": { en: "Access control", es: "Control de accesos", fr: "Contrôle d'accès" },
  Sorveglianza: { en: "Surveillance", es: "Vigilancia", fr: "Surveillance" },
  "Steward sicurezza": { en: "Security stewards", es: "Stewards de seguridad", fr: "Stewards sécurité" },
  NCC: { en: "Chauffeur service", es: "Coche con conductor", fr: "Chauffeur privé" },
  Navette: { en: "Shuttles", es: "Lanzaderas", fr: "Navettes" },
  "Bus ospiti": { en: "Guest buses", es: "Autobuses para invitados", fr: "Bus invités" },
  "Auto cerimonia": { en: "Ceremony cars", es: "Coches de ceremonia", fr: "Voitures de cérémonie" },
  Transfer: { en: "Transfers", es: "Traslados", fr: "Transferts" },
  "Logistica trasporti": { en: "Transport logistics", es: "Logística de transporte", fr: "Logistique transport" },
  "Abiti cerimonia": { en: "Ceremony outfits", es: "Vestidos de ceremonia", fr: "Tenues de cérémonie" },
  "Abiti sposa": { en: "Wedding dresses", es: "Vestidos de novia", fr: "Robes de mariée" },
  "Abiti sposo": { en: "Groom suits", es: "Trajes de novio", fr: "Costumes de marié" },
  Accessori: { en: "Accessories", es: "Accesorios", fr: "Accessoires" },
  "Noleggio abiti": { en: "Outfit rental", es: "Alquiler de ropa", fr: "Location de tenues" }
};

const EVENT_TYPE_LABELS: Record<string, Partial<Record<Locale, string>>> = {
  Matrimonio: { en: "Wedding", es: "Boda", fr: "Mariage" },
  Compleanno: { en: "Birthday", es: "Cumpleaños", fr: "Anniversaire" },
  "Festa privata": { en: "Private party", es: "Fiesta privada", fr: "Fête privée" },
  "Evento aziendale": { en: "Corporate event", es: "Evento corporativo", fr: "Événement d'entreprise" },
  "Team building": { en: "Team building", es: "Team building", fr: "Team building" },
  Laurea: { en: "Graduation party", es: "Fiesta de graduación", fr: "Fête de diplôme" },
  Diciottesimo: { en: "18th birthday", es: "18 cumpleaños", fr: "18e anniversaire" },
  "Cena privata": { en: "Private dinner", es: "Cena privada", fr: "Dîner privé" },
  "Destination wedding": { en: "Destination wedding", es: "Boda de destino", fr: "Mariage de destination" }
};

function localizedSupplierLabel(value: string, locale: Locale, labels: Record<string, Partial<Record<Locale, string>>>) {
  if (locale === "it") return value;
  return labels[value]?.[locale] ?? value;
}

export function supplierCategoryLabel(category: Pick<VibesSupplierCategory, "label" | "slug">, locale: Locale) {
  if (locale === "it") return category.label;
  return CATEGORY_LABELS[category.slug]?.[locale] ?? category.label;
}

export function supplierSubcategoryLabel(value: string, locale: Locale) {
  return localizedSupplierLabel(value, locale, SUBCATEGORY_LABELS);
}

export function supplierEventTypeLabel(value: string, locale: Locale) {
  return localizedSupplierLabel(value, locale, EVENT_TYPE_LABELS);
}

export function normalizeSearchText(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function categoryFromSearch(value: string | null | undefined) {
  const normalized = normalizeSearchText(value);
  if (!normalized) return null;

  return (
    VIBES_SUPPLIER_CATEGORIES.find((category) => {
      const tokens = [category.label, category.slug, ...category.aliases, ...category.subcategories]
        .map((item) => normalizeSearchText(item))
        .filter(Boolean);
      const words = new Set(normalized.split(" ").filter(Boolean));
      return tokens.some((token) => normalized.includes(token) || words.has(token));
    }) ?? null
  );
}

export function supplierSearchCopy(locale: Locale) {
  if (locale === "en") {
    return {
      button: "Find Italian suppliers",
      title: "Find suppliers with Vibes Planner",
      intro: "Search real Vibes Planner supplier showcases by category, service and city. If you allow location, nearby Italian suppliers appear first.",
      query: "What do you need",
      queryPlaceholder: "Venue, DJ, catering, flowers, team building...",
      category: "Category",
      subcategory: "Service type",
      province: "City / province",
      eventType: "Event",
      all: "All",
      search: "Search suppliers",
      loading: "Searching Vibes Planner...",
      loadingTitle: "Reading Vibes Planner showcases",
      loadingText: "We are loading nearby Italian suppliers when location is available, then real Vibes Planner profiles by relevance.",
      initial: "We are loading a first selection of Italian suppliers. You can refine it by category, city or service.",
      empty: "No supplier found with these filters. Try a broader category or open the guided request.",
      premium: "Premium Vibes Club",
      open: "Open showcase",
      external: "View on Vibes",
      more: "Show more",
      request: "Send guided request",
      requestHint: "Open the Vibes Planner request form",
      source: "Results are based on public Vibes Planner supplier pages and, when allowed, approximate distance from you.",
      cardText: "Official Vibes Planner supplier profile. Open it to read details, photos and updated information.",
      resultsLabel: "results",
      premiumFirst: "Nearby results first, with Premium and base showcases",
      close: "Close supplier search",
      save: "Save",
      advancedFilters: "More filters",
      previous: "Previous",
      pageLabel: "Showing",
      profileBadge: "Vibes Planner profile"
    };
  }
  if (locale === "es") {
    return {
      button: "Encontrar proveedores italianos",
      title: "Busca proveedores con Vibes Planner",
      intro: "Busca vitrinas reales de Vibes Planner por categoría, servicio y ciudad. Si permites la ubicación, aparecen primero proveedores italianos cercanos.",
      query: "Qué necesitas",
      queryPlaceholder: "Lugar, DJ, catering, flores, team building...",
      category: "Categoría",
      subcategory: "Tipo de servicio",
      province: "Ciudad / provincia",
      eventType: "Evento",
      all: "Todo",
      search: "Buscar proveedores",
      loading: "Buscando en Vibes Planner...",
      loadingTitle: "Leyendo vitrinas de Vibes Planner",
      loadingText: "Estamos cargando proveedores italianos cercanos cuando la ubicación está disponible, y luego vitrinas reales por relevancia.",
      initial: "Estamos cargando una primera selección de proveedores italianos. Puedes afinar por categoría, ciudad o servicio.",
      empty: "No encontramos proveedores con estos filtros. Prueba una categoría más amplia o abre la solicitud guiada.",
      premium: "Premium Vibes Club",
      open: "Descubrir más",
      external: "Ver en Vibes",
      more: "Ver más",
      request: "Enviar solicitud guiada",
      requestHint: "Abrir el formulario de solicitud de Vibes Planner",
      source: "Resultados basados en páginas públicas de Vibes Planner y, si lo permites, en la distancia aproximada.",
      cardText: "Perfil oficial del proveedor en Vibes Planner. Ábrelo para ver detalles, fotos e información actualizada.",
      resultsLabel: "resultados",
      premiumFirst: "Cercanos primero, con Premium y vitrinas base",
      close: "Cerrar búsqueda de proveedores",
      save: "Guardar",
      advancedFilters: "Más filtros",
      previous: "Anterior",
      pageLabel: "Mostrando",
      profileBadge: "Perfil Vibes Planner"
    };
  }
  if (locale === "fr") {
    return {
      button: "Trouver des prestataires italiens",
      title: "Trouvez des prestataires avec Vibes Planner",
      intro: "Cherchez des vitrines Vibes Planner réelles par catégorie, service et ville. Si vous autorisez la localisation, les prestataires italiens proches apparaissent d'abord.",
      query: "Que cherchez-vous ?",
      queryPlaceholder: "Lieu, DJ, traiteur, fleurs, team building...",
      category: "Catégorie",
      subcategory: "Type de service",
      province: "Ville / province",
      eventType: "événement",
      all: "Tout",
      search: "Chercher des prestataires",
      loading: "Recherche sur Vibes Planner...",
      loadingTitle: "Lecture des vitrines Vibes Planner",
      loadingText: "Nous chargeons des prestataires italiens proches quand la localisation est disponible, puis les vitrines réelles par pertinence.",
      initial: "Nous chargeons une première sélection de prestataires italiens. Vous pouvez affiner par catégorie, ville ou service.",
      empty: "Aucun prestataire trouvé avec ces filtres. Essayez une catégorie plus large ou ouvrez la demande guidée.",
      premium: "Premium Vibes Club",
      open: "Découvrir",
      external: "Voir sur Vibes",
      more: "Voir plus",
      request: "Envoyer une demande guidée",
      requestHint: "Ouvrir le formulaire de demande Vibes Planner",
      source: "Résultats basés sur les pages publiques Vibes Planner et, si vous l'autorisez, sur la distance approximative.",
      cardText: "Profil officiel du prestataire sur Vibes Planner. Ouvrez-le pour voir détails, photos et informations à jour.",
      resultsLabel: "résultats",
      premiumFirst: "Proches d'abord, avec Premium et vitrines standard",
      close: "Fermer la recherche de prestataires",
      save: "Enregistrer",
      advancedFilters: "Plus de filtres",
      previous: "Précédents",
      pageLabel: "Affichage",
      profileBadge: "Profil Vibes Planner"
    };
  }
  return {
    button: "Trova fornitori",
    title: "Trova fornitori con Vibes Planner",
    intro: "Cerca tra vetrine reali Vibes Planner per categoria, servizio e città. Se autorizzi la posizione, i fornitori italiani più vicini compaiono prima.",
    query: "Cosa ti serve",
    queryPlaceholder: "Location, DJ, catering, fiori, team building...",
    category: "Categoria",
    subcategory: "Tipo fornitore",
    province: "Città / provincia",
    eventType: "Evento",
    all: "Tutto",
    search: "Cerca fornitori",
    loading: "Sto cercando su Vibes Planner...",
    loadingTitle: "Sto leggendo le vetrine Vibes Planner",
    loadingText: "Carico fornitori italiani vicini quando la posizione è disponibile, poi ordino le vetrine reali per pertinenza.",
    initial: "Sto caricando una prima selezione di fornitori italiani. Puoi rifinire per categoria, città o servizio.",
    empty: "Nessun fornitore trovato con questi filtri. Prova una categoria più ampia o apri la richiesta guidata.",
    premium: "Premium Vibes Club",
    open: "Scopri di più",
    external: "Vedi su Vibes",
    more: "Vedi altri",
    request: "Invia richiesta guidata",
    requestHint: "Apri il modulo richiesta Vibes Planner",
    source: "Risultati basati sulle pagine pubbliche Vibes Planner e, se lo consenti, sulla distanza approssimativa.",
    cardText: "Scheda ufficiale del fornitore su Vibes Planner. Aprila per vedere dettagli, foto e informazioni aggiornate.",
    resultsLabel: "risultati",
    premiumFirst: "Vicini prima, con Premium e vetrine base",
    close: "Chiudi ricerca fornitori",
    save: "Salva",
    advancedFilters: "Altri filtri",
    previous: "Indietro",
    pageLabel: "Stai vedendo",
    profileBadge: "Scheda Vibes Planner"
  };
}
