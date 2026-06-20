import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "content", "quote-analysis", "generated");
const outputFile = path.join(outputDir, "income-scores.json");

type IncomeScore = {
  istatCode: string;
  incomeScore: number | null;
  source: "mef_csv" | "missing";
  reason: string;
};

function parseCsv(text: string, delimiter = ";") {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === "\"" && next === "\"") {
        cell += "\"";
        index += 1;
      } else if (char === "\"") quoted = false;
      else cell += char;
      continue;
    }
    if (char === "\"") quoted = true;
    else if (char === delimiter) {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") cell += char;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((item) => item.some(Boolean));
}

function normalizeHeader(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
}

function toNumber(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function main() {
  const inputPath = process.argv.find((arg) => arg.startsWith("--input="))?.replace("--input=", "");
  if (!inputPath || !existsSync(inputPath)) {
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(
      outputFile,
      `${JSON.stringify({ importedAt: new Date().toISOString(), source: "missing", scores: [] satisfies IncomeScore[] }, null, 2)}\n`,
      "utf8"
    );
    console.log("Nessun CSV MEF indicato. Creato file fallback vuoto: usare --input=percorso.csv quando disponibile.");
    return;
  }

  const rows = parseCsv(readFileSync(inputPath, "utf8"));
  const headers = rows[0].map(normalizeHeader);
  const codeIndex = headers.findIndex((item) => item.includes("codicecomune") || item.includes("istat"));
  const incomeIndex = headers.findIndex((item) => item.includes("redditocomplessivomedio") || item.includes("redditomedio") || item.includes("imponibilemedio"));

  if (codeIndex < 0 || incomeIndex < 0) {
    throw new Error("CSV MEF non riconosciuto: servono codice comune/ISTAT e reddito medio o imponibile medio.");
  }

  const values = rows.slice(1).map((row) => ({ istatCode: row[codeIndex]?.trim(), income: toNumber(row[incomeIndex] ?? "") })).filter((item) => item.istatCode && item.income);
  const maxIncome = Math.max(...values.map((item) => item.income ?? 0));
  const scores = values.map<IncomeScore>((item) => ({
    istatCode: item.istatCode,
    incomeScore: maxIncome ? Math.round(((item.income ?? 0) / maxIncome) * 100) : null,
    source: "mef_csv",
    reason: "Score normalizzato da CSV MEF/Dipartimento delle Finanze importato manualmente."
  }));

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputFile, `${JSON.stringify({ importedAt: new Date().toISOString(), source: inputPath, scores }, null, 2)}\n`, "utf8");
  console.log(`Score reddito importati: ${scores.length}`);
}

main();
