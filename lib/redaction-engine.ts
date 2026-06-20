export type RedactionKind =
  | "email"
  | "phone"
  | "link"
  | "tax_code"
  | "vat"
  | "pec"
  | "iban"
  | "address"
  | "supplier_name";

export type RedactionHit = {
  kind: RedactionKind;
  count: number;
};

export type RedactionCounts = {
  emails: number;
  phones: number;
  vatNumbers: number;
  taxCodes: number;
  pec: number;
  iban: number;
  links: number;
  addresses: number;
  supplierNames: number;
};

export type RedactionResult = {
  originalText: string;
  redactedText: string;
  sanitizedText: string;
  totalRedactions: number;
  hits: RedactionHit[];
  redactions: RedactionCounts;
};

type RedactionRule = {
  kind: RedactionKind;
  countKey: keyof RedactionCounts;
  pattern: RegExp;
  replacement: string | ((value: string) => string);
};

const emptyCounts: RedactionCounts = {
  emails: 0,
  phones: 0,
  vatNumbers: 0,
  taxCodes: 0,
  pec: 0,
  iban: 0,
  links: 0,
  addresses: 0,
  supplierNames: 0
};

const rules: RedactionRule[] = [
  {
    kind: "pec",
    countKey: "pec",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]*\bpec\b[A-Z0-9.-]*\.[A-Z]{2,}\b/gi,
    replacement: "[PEC_OSCURATA]"
  },
  {
    kind: "email",
    countKey: "emails",
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    replacement: "[EMAIL_OSCURATA]"
  },
  {
    kind: "link",
    countKey: "links",
    pattern: /(?:https?:\/\/|www\.)\S+/gi,
    replacement: "[LINK_OSCURATO]"
  },
  {
    kind: "iban",
    countKey: "iban",
    pattern: /\b(?:iban\s*[:#-]\s*)?[A-Z]{2}\d{2}(?:\s?[A-Z0-9]){11,30}\b/gi,
    replacement: "[IBAN_OSCURATO]"
  },
  {
    kind: "vat",
    countKey: "vatNumbers",
    pattern: /\b(?:p\.?\s*iva|partita\s+iva|vat|nif|cif|siret|siren)\s*[:#-]?\s*[A-Z0-9 .-]{6,24}\b/gi,
    replacement: "[PIVA_OSCURATA]"
  },
  {
    kind: "tax_code",
    countKey: "taxCodes",
    pattern: /\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/gi,
    replacement: "[CF_OSCURATO]"
  },
  {
    kind: "phone",
    countKey: "phones",
    pattern: /(?<!\w)(?:\+\d[\d\s().-]{7,}\d)(?!\w)/g,
    replacement: "[TELEFONO_OSCURATO]"
  },
  {
    kind: "address",
    countKey: "addresses",
    pattern:
      /\b(?:via|viale|piazza|corso|largo|strada|vicolo|indirizzo|address|dirección|adresse|rue|avenue)\s+[A-Za-zÀ-ÿ0-9' .,-]{4,90}(?:\s+\d{1,5}[A-Za-z]?)/gi,
    replacement: "[INDIRIZZO_OSCURATO]"
  },
  {
    kind: "supplier_name",
    countKey: "supplierNames",
    pattern:
      /\b[A-ZÀ-Ý][A-Za-zÀ-ÿ'&.\- ]{1,70}\s+(?:s\.r\.l\.|srl|s\.p\.a\.|spa|s\.a\.s\.|sas|s\.n\.c\.|snc|ltd|limited|límited|llc|sl|s\.l\.|sarl|eurl|gmbh)(?=\s|$|[.,;:])/gi,
    replacement: "[FORNITORE_OSCURATO]"
  },
  {
    kind: "supplier_name",
    countKey: "supplierNames",
    pattern:
      /\b(?:preventivo\s+(?:di|da)|offerta\s+(?:di|da)|proposta\s+(?:di|da)|fornitore|supplier|proveedor|prestataire|azienda|società|company|empresa|entreprise|ragione sociale|denominazione|nome fornitore|brand|ditta)\s*[:#-]?\s*[^\n\r]{2,90}/gi,
    replacement: (value) =>
      value.replace(
        /(\b(?:preventivo\s+(?:di|da)|offerta\s+(?:di|da)|proposta\s+(?:di|da)|fornitore|supplier|proveedor|prestataire|azienda|società|company|empresa|entreprise|ragione sociale|denominazione|nome fornitore|brand|ditta)\s*[:#-]?\s*)[^\n\r]{2,90}$/i,
        "$1[FORNITORE_OSCURATO]"
      )
  }
];

function normalizeWhitespace(value: string) {
  return value.replace(/\s{3,}/g, "  ").trim();
}

export function sanitizeSensitiveData(value: string): RedactionResult {
  const hits = new Map<RedactionKind, number>();
  const redactions: RedactionCounts = { ...emptyCounts };
  let sanitizedText = value;

  for (const rule of rules) {
    let count = 0;
    sanitizedText = sanitizedText.replace(rule.pattern, (match) => {
      count += 1;
      return typeof rule.replacement === "function" ? rule.replacement(match) : rule.replacement;
    });

    if (count > 0) {
      hits.set(rule.kind, (hits.get(rule.kind) ?? 0) + count);
      redactions[rule.countKey] += count;
    }
  }

  const hitList = Array.from(hits.entries()).map(([kind, count]) => ({ kind, count }));
  const cleanText = normalizeWhitespace(sanitizedText);

  return {
    originalText: value,
    redactedText: cleanText,
    sanitizedText: cleanText,
    totalRedactions: hitList.reduce((total, hit) => total + hit.count, 0),
    hits: hitList,
    redactions
  };
}

export function redactQuoteText(value: string): RedactionResult {
  return sanitizeSensitiveData(value);
}

export function containsPublicContact(value: string) {
  return sanitizeSensitiveData(value).totalRedactions > 0;
}
