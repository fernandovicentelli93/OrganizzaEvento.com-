const { existsSync } = require("fs");
const fs = require("fs/promises");
const { createRequire } = require("module");
const path = require("path");

const projectRequire = createRequire(path.join(process.cwd(), "package.json"));

async function walkFiles(dir, onFile) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walkFiles(fullPath, onFile);
      } else if (entry.isFile()) {
        await onFile(fullPath, entry.name);
      }
    }),
  );
}

function shouldPruneFile(root, filePath, fileName) {
  const relativePath = path.relative(root, filePath).replace(/\\/g, "/");

  if (
    filePath.endsWith(".map") ||
    fileName.endsWith(".d.ts") ||
    fileName.startsWith("README") ||
    fileName.startsWith("LICENSE") ||
    filePath.endsWith(".md")
  ) {
    return true;
  }

  if (
    relativePath.startsWith("node_modules/typescript/") ||
    relativePath.startsWith("node_modules/.pnpm/typescript@")
  ) {
    return true;
  }

  if (fileName === "query_engine-windows.dll.node" || fileName.startsWith("query_engine-windows.dll.node.tmp")) {
    return true;
  }

  const isNextDist =
    relativePath.startsWith("node_modules/next/dist/") ||
    /^node_modules\/\.pnpm\/next@.*\/node_modules\/next\/dist\//.test(relativePath);

  if (isNextDist && /development|\.dev\.|turbo-experimental|experimental/.test(fileName)) {
    return true;
  }

  return false;
}

async function directorySize(dir) {
  let total = 0;
  await walkFiles(dir, async (filePath) => {
    const stat = await fs.stat(filePath);
    total += stat.size;
  });
  return total;
}

async function pruneDirectoryIfExists(root, relativePath) {
  const target = path.join(root, relativePath);
  if (!existsSync(target)) {
    return { removed: false, bytes: 0 };
  }

  const bytes = await directorySize(target);
  await fs.rm(target, { recursive: true, force: true });
  return { removed: true, bytes };
}

async function findPnpmPackageDir(packageName) {
  const pnpmDir = path.join(process.cwd(), "node_modules", ".pnpm");
  const encodedName = packageName.replace("/", "+");
  let entries;
  try {
    entries = await fs.readdir(pnpmDir, { withFileTypes: true });
  } catch {
    return null;
  }

  const packageRoot = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${encodedName}@`))
    .map((entry) => path.join(pnpmDir, entry.name, "node_modules", ...packageName.split("/")))
    .find((candidate) => existsSync(path.join(candidate, "package.json")));

  return packageRoot || null;
}

async function copyRuntimePackage(packageName, handlerRoot) {
  let sourceDir;
  try {
    sourceDir = path.dirname(projectRequire.resolve(`${packageName}/package.json`));
  } catch {
    sourceDir = await findPnpmPackageDir(packageName);
    if (!sourceDir) {
      return false;
    }
  }

  const destinationDir = path.join(handlerRoot, "node_modules", ...packageName.split("/"));
  await fs.mkdir(path.dirname(destinationDir), { recursive: true });
  await fs.rm(destinationDir, { recursive: true, force: true });
  await fs.cp(sourceDir, destinationDir, { recursive: true, force: true });
  return true;
}

async function copyGeneratedPrismaClient(handlerRoot) {
  let sourceDir = path.join(process.cwd(), "node_modules", ".prisma");
  if (!existsSync(sourceDir)) {
    const pnpmDir = path.join(process.cwd(), "node_modules", ".pnpm");
    let entries = [];
    try {
      entries = await fs.readdir(pnpmDir, { withFileTypes: true });
    } catch {
      entries = [];
    }

    sourceDir =
      entries
        .filter((entry) => entry.isDirectory() && entry.name.startsWith("@prisma+client@"))
        .map((entry) => path.join(pnpmDir, entry.name, "node_modules", ".prisma"))
        .find((candidate) => existsSync(path.join(candidate, "client", "default.js"))) || sourceDir;
  }

  if (!existsSync(sourceDir)) {
    return false;
  }

  const destinationDir = path.join(handlerRoot, "node_modules", ".prisma");
  await fs.rm(destinationDir, { recursive: true, force: true });
  await fs.cp(sourceDir, destinationDir, { recursive: true, force: true });
  return true;
}

async function onBuild({ utils }) {
  const handlerRoot = path.join(
    process.cwd(),
    ".netlify",
    "functions-internal",
    "___netlify-server-handler",
  );

  if (!existsSync(handlerRoot)) {
    utils.status.show({ title: "Prune Next function", summary: "Server handler not found; skipped." });
    return;
  }

  const before = await directorySize(handlerRoot);
  const copiedRuntimePackages = [];
  for (const packageName of [
    "next",
    "@next/env",
    "react",
    "@swc/helpers",
    "@prisma/client",
    "caniuse-lite",
    "postcss",
    "react-dom",
    "styled-jsx",
  ]) {
    if (await copyRuntimePackage(packageName, handlerRoot)) {
      copiedRuntimePackages.push(packageName);
    }
  }
  if (await copyGeneratedPrismaClient(handlerRoot)) {
    copiedRuntimePackages.push(".prisma/client");
  }

  let removedDirectories = 0;
  let removedDirectoryBytes = 0;
  for (const relativePath of ["node_modules/.pnpm", "node_modules/sharp", "node_modules/@img"]) {
    const result = await pruneDirectoryIfExists(handlerRoot, relativePath);
    if (result.removed) {
      removedDirectories += 1;
      removedDirectoryBytes += result.bytes;
    }
  }

  let removedFiles = 0;
  let removedBytes = 0;

  await walkFiles(handlerRoot, async (filePath, fileName) => {
    if (!shouldPruneFile(handlerRoot, filePath, fileName)) {
      return;
    }

    const stat = await fs.stat(filePath);
    await fs.rm(filePath, { force: true });
    removedFiles += 1;
    removedBytes += stat.size;
  });

  const after = await directorySize(handlerRoot);
  utils.status.show({
    title: "Pruned Next function",
    summary: `Copied ${copiedRuntimePackages.join(", ") || "no extra packages"}. Removed ${removedFiles} files (${Math.round(removedBytes / 1024 / 1024)} MB) and ${removedDirectories} directories (${Math.round(removedDirectoryBytes / 1024 / 1024)} MB). Handler is now ${Math.round(after / 1024 / 1024)} MB.`,
  });
}

module.exports = { onBuild };
