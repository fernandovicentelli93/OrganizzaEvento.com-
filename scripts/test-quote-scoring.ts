import assert from "node:assert/strict";
import { analyzeQuoteQuality, type QuoteQualityInput } from "../lib/quoteScoring";

function assertRange(value: number, min: number, max: number, label: string) {
  assert.ok(value >= min && value <= max, `${label}: expected ${value} between ${min} and ${max}`);
}

function quoteInput(
  input: Partial<QuoteQualityInput> & Pick<QuoteQualityInput, "locale" | "serviceType" | "eventType" | "rawText">
): QuoteQualityInput {
  return {
    sanitizedText: input.rawText,
    city: "",
    province: "",
    region: "",
    eventDate: "",
    guests: "",
    estimatedDuration: "",
    indicatedAmount: "",
    userGoal: "Capire se il preventivo è chiaro e confrontabile prima di confermare.",
    selectedDetails: [],
    ...input
  };
}

const complete = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "catering",
  eventType: "matrimonio",
  city: "Roma",
  region: "Lazio",
  eventDate: "2026-09-18",
  guests: 90,
  estimatedDuration: "8 ore",
  indicatedAmount: "8.900 euro IVA inclusa",
  selectedDetails: ["prezzo a persona", "bevande", "camerieri", "torta", "numero minimo", "IVA", "caparra", "saldo", "annullamento"],
  rawText: `
    Preventivo n. 24 del 16/06/2026 - Catering matrimonio Roma per 90 ospiti.
    Totale 8.900 euro IVA inclusa. Menu servito con antipasto, due portate, torta, acqua, vino, caffe e mise en place.
    Servizio con 8 camerieri, cucina di appoggio, trasporto, montaggio e smontaggio inclusi.
    Caparra 30%, saldo 7 giorni prima tramite bonifico. Offerta valida 20 giorni.
    Extra: open bar, camerieri aggiuntivi e ore extra esclusi e quotati separatamente.
    Cancellazione: cambio data gratuito entro 90 giorni, poi penale come da contratto.
    Ragione sociale Esempio Catering SRL, P.IVA 12345678901, email info@example.com, telefono +39 333 1234567.
  `
}));
assertRange(complete.score, 9, 10, "complete quote");

const priceOnly = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "dj",
  eventType: "matrimonio",
  rawText: "DJ matrimonio 1.200 euro tutto incluso."
}));
assert.ok(priceOnly.score <= 5, `price-only quote should be capped, got ${priceOnly.score}`);

const reservedDetailed = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "location",
  eventType: "matrimonio",
  city: "Firenze",
  guests: 120,
  estimatedDuration: "10 ore",
  rawText: `
    Villa per matrimonio a Firenze. Trattativa riservata.
    Uso esclusivo della sala interna, giardino, parcheggio e piano B pioggia.
    Orario evento 16-02, pulizie finali incluse, fornitori esterni ammessi.
    Extra: ore oltre le 02, guardiania notturna, tecnica audio e climatizzazione potenziata.
    Caparra richiesta, saldo prima dell'evento, cambio data possibile secondo contratto.
    Preventivo su carta intestata con sede, telefono, email e riferimenti fiscali.
  `
}));
assertRange(reservedDetailed.score, 6, 7.2, "reserved detailed quote");

const reservedGeneric = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "location",
  eventType: "matrimonio",
  rawText: "Location elegante per eventi. Prezzo su richiesta."
}));
assertRange(reservedGeneric.score, 1, 5.5, "reserved generic quote");

const startingGood = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "dj",
  eventType: "diciottesimo",
  city: "Milano",
  guests: 80,
  estimatedDuration: "5 ore",
  selectedDetails: ["ore di musica", "impianto incluso", "luci incluse", "microfoni", "ore extra", "trasferta"],
  rawText: `
    Pacchetto base a partire da 900 euro + IVA per diciottesimo a Milano.
    Include 5 ore di musica, impianto audio, console, luci base, microfono e playlist concordata.
    Extra: SIAE, seconda postazione audio, trasferta fuori provincia e ore extra.
    Acconto 30%, saldo prima dell'evento, cambio data da concordare per iscritto.
    Preventivo con numero, data, telefono ed email.
  `
}));
assertRange(startingGood.score, 6.5, 8, "starting-from detailed quote");

const startingVague = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "dj",
  eventType: "festa_privata",
  rawText: "Prezzi da 900 euro per eventi privati. Servizio DJ disponibile."
}));
assertRange(startingVague.score, 1, 6.5, "starting-from vague quote");

const photographer = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "fotografo",
  eventType: "matrimonio",
  city: "Como",
  guests: 70,
  estimatedDuration: "10 ore",
  rawText: `
    Fotografo matrimonio Lago di Como. Totale 2.400 euro IVA inclusa.
    Ore di copertura 10, due fotografi, post-produzione, 600 foto consegnate, gallery online, album 30x30 e video highlights.
    Tempi di consegna 90 giorni, diritti di utilizzo personali inclusi, file raw esclusi.
    Acconto 40%, saldo alla consegna, penale per cancellazione entro 30 giorni.
    Studio con partita IVA, telefono, email e numero preventivo.
  `
}));
assert.ok(photographer.criteria.find((item) => item.id === "included")?.points ?? 0 > 12);

const dj = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "dj",
  eventType: "diciottesimo",
  city: "Napoli",
  guests: 80,
  estimatedDuration: "6 ore",
  rawText: `
    DJ per diciottesimo Napoli. Totale 1.100 euro + IVA.
    6 ore di musica, impianto audio, luci, microfoni, console, setup aperitivo e playlist.
    SIAE esclusa, trasferta inclusa entro provincia, extra orario 100 euro.
    Acconto 300 euro, saldo il giorno prima, cancellazione come da contratto.
    Email e telefono presenti nel preventivo.
  `
}));
assert.ok(dj.criteria.find((item) => item.id === "included")?.points ?? 0 > 12);

const band = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "band",
  eventType: "matrimonio",
  city: "Siena",
  guests: 100,
  estimatedDuration: "4 ore live",
  rawText: `
    Band matrimonio Siena. Totale 3.200 euro IVA esclusa.
    Numero musicisti 5, durata live 3 set da 45 minuti, tecnico audio, impianto, DJ set finale, scaletta personalizzabile.
    Pasti staff inclusi, pernottamento escluso, extra orario 250 euro.
    Acconto 30%, saldo a fine evento, cancellazione con penale scritta.
    Preventivo con partita IVA, sede, telefono e data.
  `
}));
assert.ok(band.criteria.find((item) => item.id === "included")?.points ?? 0 > 12);

const privacy = analyzeQuoteQuality(quoteInput({
  locale: "it",
  serviceType: "catering",
  eventType: "matrimonio",
  city: "Roma",
  rawText: "Mario Rossi Catering SRL, mario@example.com, +39 333 1234567, P.IVA 12345678901. Menu 70 euro a persona IVA inclusa.",
  sanitizedText: "[fornitore oscurato], [email oscurata], [telefono oscurato], [partita iva oscurata]. Menu 70 euro a persona IVA inclusa."
}));
const publicResult = JSON.stringify({
  criteria: privacy.criteria,
  strengths: privacy.strengths,
  missingItems: privacy.missingItems,
  mainRisk: privacy.mainRisk,
  questions: privacy.questions,
  recommendedAction: privacy.recommendedAction,
  appliedCaps: privacy.appliedCaps
});
assert.equal(publicResult.includes("mario@example.com"), false);
assert.equal(publicResult.includes("+39 333"), false);
assert.equal(publicResult.includes("Mario Rossi"), false);
assert.equal(publicResult.includes("12345678901"), false);

console.info("Quote scoring tests passed.");
