const spamPhrases = [
  "buy now",
  "free money",
  "guadagna subito",
  "casino online",
  "crypto",
  "viagra",
  "telegram",
  "whatsapp marketing",
  "seo backlink",
  "prestito immediato"
];

const suspiciousDomains = [
  "bit.ly",
  "tinyurl.com",
  "t.me",
  "wa.me",
  "casino",
  "porn",
  "xxx"
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function countLinks(value: string) {
  return (value.match(/https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|info|biz|ru|cn|xyz)\b/gi) ?? []).length;
}

function hasRepeatedCharacters(value: string) {
  return /(.)\1{8,}/.test(value);
}

function uppercaseRatio(value: string) {
  const letters = value.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 18) return 0;
  const uppercase = letters.replace(/[^A-Z]/g, "");
  return uppercase.length / letters.length;
}

export function assertHumanPace(formData: FormData, minimumSeconds = 4) {
  const startedAt = Number.parseInt(String(formData.get("formStartedAt") ?? ""), 10);
  const now = Date.now();
  if (!Number.isFinite(startedAt)) {
    throw new Error("Controllo anti-spam non valido. Ricarica la pagina e riprova.");
  }

  if (startedAt > now + 2 * 60 * 60 * 1000) {
    throw new Error("Controllo anti-spam non valido. Ricarica la pagina e riprova.");
  }

  if (startedAt > now) return;

  if (now - startedAt < minimumSeconds * 1000) {
    throw new Error("Invio troppo rapido. Rileggi il testo e riprova tra pochi secondi.");
  }
}

export function assertHoneypotEmpty(formData: FormData) {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) {
    throw new Error("Invio bloccato dai filtri anti-spam.");
  }
}

export function assertNotSpam(fields: Array<string | null | undefined>, options?: { maxLinks?: number }) {
  const text = normalize(fields.filter(Boolean).join(" "));
  const maxLinks = options?.maxLinks ?? 1;

  if (!text.trim()) return;

  if (countLinks(text) > maxLinks) {
    throw new Error("Inserisci al massimo un link. I messaggi con troppi link vengono bloccati.");
  }

  if (spamPhrases.some((phrase) => text.includes(phrase))) {
    throw new Error("Il testo sembra promozionale o spam. Riscrivilo in modo concreto e neutro.");
  }

  if (suspiciousDomains.some((domain) => text.includes(domain))) {
    throw new Error("Link o riferimenti non ammessi dai filtri anti-spam.");
  }

  if (hasRepeatedCharacters(text) || uppercaseRatio(fields.join(" ")) > 0.55) {
    throw new Error("Il testo sembra generato o poco leggibile. Riscrivilo in modo normale.");
  }
}
