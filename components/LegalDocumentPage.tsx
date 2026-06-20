import fs from "node:fs";
import path from "node:path";

type LegalDocumentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  textFile: string;
  pdfHref: string;
};

function readLegalBlocks(textFile: string, title: string) {
  const filePath = path.join(process.cwd(), "content", "legal", textFile);
  const raw = fs.readFileSync(filePath, "utf8");
  return raw
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block, index) => index === 0 || block !== title);
}

function blockHeading(block: string) {
  const [firstLine] = block.split("\n");
  if (/^(Indice operativo|\d+\.\s+)/.test(firstLine)) return firstLine;
  return null;
}

export function LegalDocumentPage({ eyebrow, title, description, textFile, pdfHref }: LegalDocumentPageProps) {
  const blocks = readLegalBlocks(textFile, title);
  const intro = blocks[0] ?? description;
  const bodyBlocks = blocks.slice(1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-cta">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted">{intro}</p>
      <a
        className="focus-ring mt-6 inline-flex rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-hover"
        href={pdfHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        Scarica il PDF
      </a>

      <div className="mt-8 space-y-4">
        {bodyBlocks.map((block, index) => {
          const heading = blockHeading(block);
          const content = heading ? block.split("\n").slice(1).join("\n").trim() : block;
          return (
            <section key={`${heading ?? "section"}-${index}`} className="rounded-xl border border-line bg-white p-5 shadow-sm">
              {heading ? <h2 className="text-lg font-semibold text-ink">{heading}</h2> : null}
              {content ? <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted">{content}</p> : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
