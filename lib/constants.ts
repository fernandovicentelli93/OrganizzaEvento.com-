export const SITE_NAME = "OrganizzaEvento.com";
export const SITE_CLAIM = "Organizza eventi senza impazzire.";
export const SUPPORT_EMAIL = "supportoforumevento@gmail.com";
export const SUPPORT_EMAIL_LINK = `mailto:${SUPPORT_EMAIL}`;
export const VIBES_PLANNER_URL = "https://www.vibesplanner.com";
export const VIBES_PLANNER_CLIENT_REQUEST_URL = "https://www.vibesplanner.com/richiesta-cliente/#gbc165";

export const POST_TYPES = [
  "Domanda",
  "Quanto costa",
  "Preventivo",
  "Sfogo",
  "Esperienza reale",
  "Idea",
  "Problema",
  "Burocrazia"
] as const;

export function postTypePublicLabel(postType: string) {
  return postType === "Quanto costa" ? "Quanto costa" : postType;
}

export function categoryPublicName(category: { slug?: string | null; name: string }) {
  return category.slug === "quanto-costa" ? "Quanto costa" : category.name;
}

export const EVENT_TYPES = [
  "Matrimonio",
  "Compleanno",
  "Diciottesimo",
  "Laurea",
  "Cena privata",
  "Evento aziendale",
  "Team building",
  "Festa privata",
  "Anniversario",
  "Altro"
] as const;

export const EVENT_PHASES = [
  {
    value: "sto-iniziando",
    label: "Sto iniziando",
    helper: "Devo capire cosa fare prima e cosa può aspettare."
  },
  {
    value: "scelta-fornitori",
    label: "Sto scegliendo fornitori",
    helper: "Sto guardando location, catering, musica o preventivi."
  },
  {
    value: "manca-meno-di-un-mese",
    label: "Manca meno di un mese",
    helper: "Mi servono conferme, controlli finali e una scaletta chiara."
  },
  {
    value: "problema-urgente",
    label: "Problema urgente",
    helper: "Ho un imprevisto, una caparra, un ritardo o qualcosa che mi preoccupa."
  }
] as const;

export const DISPLAY_MODES = [
  { value: "anonymous", label: "Anonimo", helper: "Il tuo nome non viene mostrato sul sito." },
  { value: "nickname", label: "Nickname", helper: "Mostri solo un nome scelto da te." },
  { value: "real_name", label: "Nome reale", helper: "Mostri il nome che inserisci." }
] as const;

export const CATEGORIES = [
  {
    name: "Da dove inizio",
    slug: "da-dove-inizio",
    description: "Per quando hai l'evento in testa ma non sai ancora quale sia il primo passo."
  },
  {
    name: "Quanto costa",
    slug: "quanto-costa",
    description: "Prezzi, preventivi, extra e cifre da capire prima di confermare."
  },
  {
    name: "Location",
    slug: "location",
    description: "Ville, ristoranti, sale private, agriturismi e spazi da valutare bene."
  },
  {
    name: "Catering e menù",
    slug: "catering-menu",
    description: "Buffet, cena servita, open bar, torta, intolleranze e servizio."
  },
  {
    name: "Musica e DJ",
    slug: "musica-dj",
    description: "DJ, band, playlist, musica dal vivo, SIAE e momenti della serata."
  },
  {
    name: "Matrimoni",
    slug: "matrimoni",
    description: "Dubbi reali su location, invitati, budget, fornitori e giornata del matrimonio."
  },
  {
    name: "Compleanni e feste private",
    slug: "compleanni-feste-private",
    description: "Diciottesimi, lauree, anniversari, feste in casa e feste in location."
  },
  {
    name: "Eventi aziendali",
    slug: "eventi-aziendali",
    description: "Cene aziendali, team building, eventi clienti, meeting e convention."
  },
  {
    name: "Problemi con fornitori",
    slug: "problemi-fornitori",
    description: "Caparre, ritardi, preventivi poco chiari, risposte sparite e accordi da capire."
  },
  {
    name: "Idee evento",
    slug: "idee-evento",
    description: "Spunti da rendere fattibili, senza trasformare tutto in un progetto impossibile."
  }
] as const;
