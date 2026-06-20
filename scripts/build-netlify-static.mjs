import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { CATEGORIES } from "../lib/constants.ts";
import { EDITORIAL_CATEGORIES } from "../lib/editorial.ts";
import { MAGAZINE_AREAS } from "../lib/magazine.ts";
import { getPublishedLandingPages } from "../content/landing-pages/index.ts";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outputDir = path.join(root, ".netlify-static-site");
const baseUrl = process.env.STATIC_EXPORT_BASE_URL ?? "http://127.0.0.1:3000";
const prisma = new PrismaClient();

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(source, destination) {
  if (!(await pathExists(source))) return;
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const from = path.join(source, entry.name);
      const to = path.join(destination, entry.name);
      if (entry.isDirectory()) {
        await copyDir(from, to);
      } else if (entry.isFile()) {
        await fs.copyFile(from, to);
      }
    })
  );
}

function filePathForRoute(route) {
  const clean = route.replace(/^\/+|\/+$/g, "");
  if (!clean) return path.join(outputDir, "index.html");
  if (path.extname(clean)) return path.join(outputDir, clean);
  return path.join(outputDir, clean, "index.html");
}

function uniqueRoutes(routes) {
  return Array.from(new Set(routes.map((route) => (route === "/" ? "/" : `/${route.replace(/^\/+|\/+$/g, "")}`)))).sort();
}

async function fetchRoute(route) {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) throw new Error(`${route} ha risposto ${response.status}`);
  const html = await response.text();
  const file = filePathForRoute(route);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html, "utf8");
}

async function main() {
  const [questions, articles] = await Promise.all([
    prisma.question.findMany({ where: { status: "published" }, select: { slug: true } }),
    prisma.editorialArticle.findMany({
      where: { status: "published", publishedAt: { lte: new Date() } },
      select: { slug: true }
    })
  ]);

  const routes = uniqueRoutes([
    "/",
    "/blog",
    "/categorie",
    "/domande",
    "/fai-domanda",
    "/faq",
    "/guide-eventi",
    "/magazine",
    "/magazine/categorie",
    "/manifest.webmanifest",
    "/privacy",
    "/quanto-costa",
    "/regole",
    "/sitemap.xml",
    "/termini",
    "/trova-fornitori",
    ...CATEGORIES.map((category) => `/categorie/${category.slug}`),
    ...MAGAZINE_AREAS.map((area) => `/categorie/${area.slug}`),
    ...questions.map((question) => `/domande/${question.slug}`),
    ...articles.map((article) => `/magazine/${article.slug}`),
    ...EDITORIAL_CATEGORIES.map((category) => `/magazine/categorie/${category.slug}`),
    ...getPublishedLandingPages().map((page) => `/guide-eventi/${page.slug}`)
  ]);

  await prisma.$disconnect();
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  await Promise.all([
    copyDir(path.join(root, "public"), outputDir),
    copyDir(path.join(root, ".next", "static"), path.join(outputDir, "_next", "static"))
  ]);

  for (const route of routes) {
    await fetchRoute(route);
  }

  await fs.writeFile(
    path.join(outputDir, "netlify.toml"),
    "[build]\ncommand = \"\"\npublish = \".\"\n\n[[redirects]]\nfrom = \"/*\"\nto = \"/index.html\"\nstatus = 404\n",
    "utf8"
  );
  await fs.writeFile(path.join(root, ".netlify-static-routes.txt"), `${routes.join("\n")}\n`, "utf8");
  console.log(`Static export completato: ${routes.length} pagine in ${outputDir}`);
}

main().catch(async (error) => {
  await prisma.$disconnect();
  console.error(error);
  process.exit(1);
});
