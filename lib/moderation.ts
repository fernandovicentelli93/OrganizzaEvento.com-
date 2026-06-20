const separatorPattern = "[\\s\\W_]*";

const leetMap: Record<string, string> = {
  "0": "o",
  "1": "i",
  "!": "i",
  "3": "e",
  "4": "a",
  "@": "a",
  "5": "s",
  "$": "s",
  "7": "t",
  "+": "t",
  "8": "b"
};

const blockedStarts = [
  "porc",
  "dio",
  "cristo",
  "gesu",
  "madonna",
  "vaff",
  "puttan",
  "troi",
  "zocc",
  "bestemm",
  "porn",
  "xxx",
  "escort"
];

const blockedFragments = [
  "cazz",
  "stronz",
  "merd",
  "coglion",
  "fancul",
  "incazz",
  "scop",
  "figa",
  "tromba",
  "ammazz",
  "uccid",
  "spacco",
  "truffatore",
  "ladro",
  "delinquente"
];

const blockedLoosePhrases = [
  "ti spacco",
  "ti ammazzo",
  "fa schifo",
  "mi ha truffato",
  "sono dei ladri",
  "partito politico",
  "campagna elettorale",
  "propaganda politica",
  "vota per",
  "votate per",
  "elezioni politiche",
  "destra politica",
  "sinistra politica",
  "governo ladro"
];

const politicalTerms = [
  "politica",
  "politico",
  "politici",
  "partito",
  "elezioni",
  "elettorale",
  "governo",
  "parlamento",
  "senato",
  "deputati",
  "ministro",
  "presidente",
  "sindaco",
  "referendum",
  "propaganda"
];

const blockedShortObfuscations = [
  /(^|[^a-z0-9])p[\s\W_]+o[\s\W_]+r([^a-z0-9]|$)/i
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[01345$!@7+8]/g, (char) => leetMap[char] ?? char);
}

function loosePattern(value: string) {
  return value
    .split("")
    .map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(separatorPattern);
}

function hasBlockedStart(text: string, value: string) {
  const pattern = new RegExp(`(^|[^a-z0-9])${loosePattern(value)}[a-z0-9]*`, "i");
  return pattern.test(text);
}

function hasBlockedFragment(compactText: string, value: string) {
  return compactText.includes(value);
}

function hasBlockedPhrase(text: string, value: string) {
  const pattern = new RegExp(loosePattern(value), "i");
  return pattern.test(text);
}

export function moderateText(value: string) {
  const normalized = normalizeText(value);
  const compact = normalized.replace(/[^a-z0-9]/g, "");

  if (blockedShortObfuscations.some((pattern) => pattern.test(normalized))) return false;
  if (blockedStarts.some((item) => hasBlockedStart(normalized, item))) return false;
  if (blockedFragments.some((item) => hasBlockedFragment(compact, item))) return false;
  if (blockedLoosePhrases.some((item) => hasBlockedPhrase(normalized, item))) return false;
  if (politicalTerms.some((item) => hasBlockedStart(normalized, item))) return false;

  return true;
}

export function assertCleanText(fields: Array<string | null | undefined>) {
  const hasBlockedContent = fields.some((field) => field && !moderateText(field));

  if (hasBlockedContent) {
    throw new Error(
      "Il testo contiene parole o espressioni non ammesse dalla community. Riscrivi il contenuto in modo neutro e rispettoso."
    );
  }
}
