import { sanitizeSensitiveData } from "../lib/redaction-engine";

const sample = `
Preventivo di Esempio Catering S.R.L.
Ragione sociale: Festa Bella Milano Srl
Email commerciale: preventivi@fornitore.it
PEC: amministrazione@pec.fornitore.it
Telefono +39 333 123 4567
Partita IVA 12345678901
Codice fiscale RSSMRA80A01H501U
IBAN IT60 X054 2811 1010 0000 0123 456
Sede in Via Roma 12, Milano
Link: https://fornitore.example/preventivo
`;

const result = sanitizeSensitiveData(sample);
const forbidden = [
  "Esempio Catering",
  "Festa Bella",
  "preventivi@fornitore.it",
  "amministrazione@pec.fornitore.it",
  "333 123",
  "12345678901",
  "RSSMRA80A01H501U",
  "IT60",
  "Via Roma",
  "https://fornitore.example"
];

for (const value of forbidden) {
  if (result.sanitizedText.includes(value)) {
    throw new Error(`Sensitive value was not removed: ${value}`);
  }
}

const requiredPlaceholders = [
  "[FORNITORE_OSCURATO]",
  "[EMAIL_OSCURATA]",
  "[PEC_OSCURATA]",
  "[TELEFONO_OSCURATO]",
  "[PIVA_OSCURATA]",
  "[CF_OSCURATO]",
  "[IBAN_OSCURATO]",
  "[INDIRIZZO_OSCURATO]",
  "[LINK_OSCURATO]"
];

for (const value of requiredPlaceholders) {
  if (!result.sanitizedText.includes(value)) {
    throw new Error(`Expected placeholder missing: ${value}`);
  }
}

console.log("Redaction engine tests passed.");
