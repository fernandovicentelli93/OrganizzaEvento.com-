import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { getConnectionString } from "@netlify/database";

function isPostgresUrl(value) {
  return typeof value === "string" && /^postgres(?:ql)?:\/\//i.test(value);
}

function resolveDatabaseUrl() {
  if (isPostgresUrl(process.env.DATABASE_URL)) {
    return process.env.DATABASE_URL;
  }

  try {
    return getConnectionString();
  } catch (error) {
    if (process.env.SKIP_DATABASE_SETUP === "true") {
      return "postgresql://user:pass@localhost:5432/organizzaevento?schema=public";
    }

    throw error;
  }
}

function run(command, args, env = {}, options = {}) {
  const result = spawnSync(command, args, {
    env: { ...process.env, ...env },
    shell: true,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    if (options.allowFailure) {
      console.warn(`${command} ${args.join(" ")} failed, continuing build.`);
      return;
    }

    process.exit(result.status ?? 1);
  }
}

function patchNextTraceSymlinksForWindows() {
  if (process.platform !== "win32") return;

  const patches = [
    {
      file: "node_modules/next/dist/build/utils.js",
      from: "await _fs.promises.symlink(symlink, fileOutputPath);",
      to: `const resolvedSymlinkTarget = _path.default.resolve(_path.default.dirname(tracedFilePath), symlink);
                        const symlinkStats = await _fs.promises.stat(resolvedSymlinkTarget);
                        if (symlinkStats.isDirectory()) {
                            await _fs.promises.cp(resolvedSymlinkTarget, fileOutputPath, {
                                recursive: true,
                                force: true
                            });
                        } else {
                            await _fs.promises.copyFile(resolvedSymlinkTarget, fileOutputPath);
                        }`
    },
    {
      file: "node_modules/next/dist/esm/build/utils.js",
      from: "await fs.symlink(symlink, fileOutputPath);",
      to: `const resolvedSymlinkTarget = path.resolve(path.dirname(tracedFilePath), symlink);
                        const symlinkStats = await fs.stat(resolvedSymlinkTarget);
                        if (symlinkStats.isDirectory()) {
                            await fs.cp(resolvedSymlinkTarget, fileOutputPath, {
                                recursive: true,
                                force: true
                            });
                        } else {
                            await fs.copyFile(resolvedSymlinkTarget, fileOutputPath);
                        }`
    }
  ];

  for (const patch of patches) {
    if (!existsSync(patch.file)) continue;
    const current = readFileSync(patch.file, "utf8");
    if (!current.includes(patch.from) || current.includes("resolvedSymlinkTarget")) continue;
    writeFileSync(patch.file, current.replace(patch.from, patch.to));
    console.log(`Patched Next trace symlink handling for Windows: ${patch.file}`);
  }
}

process.env.DATABASE_URL = resolveDatabaseUrl();

run("pnpm", ["prisma", "generate"]);
patchNextTraceSymlinksForWindows();

if (process.env.SKIP_DATABASE_SETUP === "true") {
  console.log("Database setup skipped for this deploy.");
} else {
  run("pnpm", ["prisma", "db", "push", "--skip-generate"], {}, { allowFailure: true });
  run("pnpm", ["prisma", "db", "seed"], { SEED_IF_EMPTY: "true" });
  run("pnpm", ["db:enrich"], {}, { allowFailure: true });
}

run("pnpm", ["next", "build"]);
