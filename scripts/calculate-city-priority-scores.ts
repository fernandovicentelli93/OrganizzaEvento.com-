import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { capitalMunicipalities, getAllQuoteAnalysisPages, quoteServices } from "@/content/quote-analysis";

const outputDir = path.join(process.cwd(), "content", "quote-analysis", "generated");
const outputFile = path.join(outputDir, "city-priority-scores.json");

function main() {
  const calculatedAt = new Date().toISOString();
  const rows = [];

  for (const municipality of capitalMunicipalities) {
    for (const service of quoteServices) {
      const page = getAllQuoteAnalysisPages("it").find((item) => item.service?.id === service.id && item.municipality?.istatCode === municipality.istatCode);
      if (!page) continue;
      rows.push({
        istatCode: municipality.istatCode,
        serviceId: service.id,
        populationScore: null,
        incomeScore: null,
        supplierScore: null,
        searchDemandScore: null,
        internalConversionScore: null,
        eventBudgetScore: null,
        finalPriorityScore: page.finalPriorityScore,
        priorityTier: page.priorityTier,
        reason: page.reason,
        calculatedAt
      });
    }
  }

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputFile, `${JSON.stringify({ calculatedAt, scores: rows }, null, 2)}\n`, "utf8");
  console.log(`City priority scores: ${rows.length}`);
  console.log(`Output: ${outputFile}`);
}

main();
