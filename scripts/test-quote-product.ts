import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { analyzeQuote } from "../lib/quote-analysis-engine";
import { redactQuoteText } from "../lib/redaction-engine";
import { matchSuppliers } from "../lib/supplier-matching-engine";

const forbiddenVisibleStrings = [
  "Quality score",
  "Priorita",
  "Priorità",
  "Canonical",
  "URL type",
  "P0",
  "P1",
  "P2",
  "P3",
  "boost iniziale",
  "Search Console",
  "capoluoghi ISTAT",
  "quality_score",
  "priority_tier",
  "canonical self",
  "content_fingerprint",
  "sitemap",
  "indexable",
  "manual boost",
  "benchmark caricati",
  "dati incompleti: verificare"
];

function stripNonVisibleHtml(html: string) {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const next = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(next) : [next];
  });
}

function testRedaction() {
  const result = redactQuoteText("Mario Rossi SRL - mario@example.com - +39 333 1234567 - https://fornitore.it - Via Roma 10");
  assert.equal(result.redactedText.includes("mario@example.com"), false);
  assert.equal(result.redactedText.includes("+39 333"), false);
  assert.equal(result.redactedText.includes("https://fornitore.it"), false);
  assert.ok(result.totalRedactions >= 4);
}

function testQuoteAnalysis() {
  const report = analyzeQuote({
    locale: "it",
    serviceType: "dj",
    eventType: "matrimonio",
    city: "Milano",
    province: "MI",
    region: "Lombardia",
    guestsCount: 90,
    totalAmount: "a partire da 1.100 euro",
    text: "Preventivo DJ matrimonio. Servizio musicale 6 ore. Impianto audio incluso. Luci base incluse. A partire da 1.100 euro + eventuale SIAE. Email dj@example.com",
    serviceSpecificFields: ["ore di musica", "impianto incluso", "luci incluse"]
  });

  assert.equal(report.detected_service, "dj");
  assert.ok(report.questions_to_ask.length >= 5);
  assert.ok(report.score_chiarezza > 0);
  assert.equal(report.public_anonymized_summary.includes("dj@example.com"), false);
  assert.notEqual(report.verdict, "Preventivo poco chiaro");
}

function testSupplierMatching() {
  const matches = matchSuppliers(
    { serviceType: "dj", province: "MI", region: "Lombardia", budget: 1500, urgency: "media", userConsentToShare: true },
    [
      {
        id: "supplier-1",
        categoryMain: "dj",
        servicesOffered: ["dj", "service audio"],
        coveredProvinces: ["MI"],
        coveredRegions: ["Lombardia"],
        minimumBudget: 900,
        reputationScore: 80,
        responseQualityScore: 85,
        availabilityScore: 70
      },
      {
        id: "supplier-2",
        categoryMain: "fotografo",
        servicesOffered: ["foto"],
        coveredProvinces: ["RM"],
        coveredRegions: ["Lazio"],
        minimumBudget: 1000,
        reputationScore: 90,
        responseQualityScore: 90,
        availabilityScore: 90
      }
    ]
  );

  assert.equal(matches.length, 1);
  assert.equal(matches[0].supplierId, "supplier-1");
  assert.equal(matches[0].canShareContact, true);
}

function testBuiltPublicHtml() {
  const appDir = path.join(process.cwd(), ".next", "server", "app");
  const htmlFiles = walk(appDir).filter((file) => file.endsWith(".html") && /analizza-preventivo|analyze-quote|analizar-presupuesto|analyser-devis/.test(file));

  if (!htmlFiles.length) {
    console.info("HTML build non trovato: esegui pnpm build prima del test completo.");
    return;
  }

  for (const file of htmlFiles) {
    const visibleText = stripNonVisibleHtml(fs.readFileSync(file, "utf8"));
    for (const forbidden of forbiddenVisibleStrings) {
      assert.equal(visibleText.includes(forbidden), false, `${forbidden} trovato in ${file}`);
    }
  }
}

testRedaction();
testQuoteAnalysis();
testSupplierMatching();
testBuiltPublicHtml();

console.info("Quote product tests passed.");
