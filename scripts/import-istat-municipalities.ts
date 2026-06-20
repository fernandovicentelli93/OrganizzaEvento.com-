import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ISTAT_URL = "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";
const outputDir = path.join(process.cwd(), "content", "quote-analysis", "generated");
const outputFile = path.join(outputDir, "italian-municipalities.json");

const regionNameOverrides: Record<string, string> = {
  "Valle d'Aosta/Vallée d'Aoste": "Valle d'Aosta",
  "Trentino-Alto Adige/Südtirol": "Trentino-Alto Adige"
};

const regionSlugOverrides: Record<string, string> = {
  "Valle d'Aosta/Vallée d'Aoste": "valle-d-aosta",
  "Trentino-Alto Adige/Südtirol": "trentino-alto-adige"
};

type CsvRow = string[];

type ImportedMunicipality = {
  istatCode: string;
  comuneName: string;
  comuneSlug: string;
  provinciaSigla: string;
  provinciaNome: string;
  provinciaCode: string;
  regioneNome: string;
  regioneSlug: string;
  isCapoluogo: boolean;
  isMetropolitanCityCapital: boolean;
  isLiberoConsorzioCapital: boolean;
  population: null;
  latitude: null;
  longitude: null;
  active: boolean;
  sourceUpdatedAt: string;
  importedAt: string;
};

function parseCsv(text: string, delimiter = ";"): CsvRow[] {
  const rows: CsvRow[] = [];
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
      } else if (char === "\"") {
        quoted = false;
      } else {
        cell += char;
      }
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
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((item) => item.some(Boolean));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function loadCsv(inputPath?: string) {
  const decoder = new TextDecoder("windows-1252");
  if (inputPath) return decoder.decode(readFileSync(inputPath));
  const response = await fetch(ISTAT_URL);
  if (!response.ok) throw new Error(`ISTAT download failed: ${response.status}`);
  return decoder.decode(await response.arrayBuffer());
}

function get(row: CsvRow, index: number) {
  return (row[index] ?? "").trim();
}

async function main() {
  const inputPath = process.argv.find((arg) => arg.startsWith("--input="))?.replace("--input=", "");
  const csv = await loadCsv(inputPath);
  const rows = parseCsv(csv);
  const dataRows = rows.slice(1);
  const importedAt = new Date().toISOString();
  const sourceUpdatedAt = importedAt;

  const municipalities: ImportedMunicipality[] = dataRows.map((row) => {
    const provinciaType = get(row, 12).toLowerCase();
    const isCapoluogo = get(row, 13) === "1";
    const regionName = get(row, 10);
    return {
      istatCode: get(row, 15),
      comuneName: get(row, 6) || get(row, 5),
      comuneSlug: slugify(get(row, 6) || get(row, 5)),
      provinciaSigla: get(row, 14),
      provinciaNome: get(row, 11),
      provinciaCode: get(row, 2),
      regioneNome: regionNameOverrides[regionName] ?? regionName,
      regioneSlug: regionSlugOverrides[regionName] ?? slugify(regionName),
      isCapoluogo,
      isMetropolitanCityCapital: isCapoluogo && provinciaType.includes("metropolitana"),
      isLiberoConsorzioCapital: isCapoluogo && provinciaType.includes("libero consorzio"),
      population: null,
      latitude: null,
      longitude: null,
      active: true,
      sourceUpdatedAt,
      importedAt
    };
  });

  const capoluoghi = municipalities.filter((item) => item.isCapoluogo);
  const duplicates = new Map<string, ImportedMunicipality[]>();
  for (const item of capoluoghi) {
    duplicates.set(item.provinciaSigla, [...(duplicates.get(item.provinciaSigla) ?? []), item]);
  }
  const multiCapital = Array.from(duplicates.entries()).filter(([, items]) => items.length > 1);

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(
    outputFile,
    `${JSON.stringify({ source: ISTAT_URL, importedAt, totalMunicipalities: municipalities.length, capitalCount: capoluoghi.length, municipalities }, null, 2)}\n`,
    "utf8"
  );

  console.log(`ISTAT comuni importati: ${municipalities.length}`);
  console.log(`Capoluoghi importati: ${capoluoghi.length}`);
  if (multiCapital.length) {
    console.log("Capoluoghi multipli per provincia/libero consorzio:");
    for (const [sigla, items] of multiCapital) {
      console.log(`- ${sigla}: ${items.map((item) => item.comuneName).join(", ")}`);
    }
  }
  console.log(`Output: ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
