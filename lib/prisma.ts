import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function normalizeUrl(value?: string | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function isPostgresUrl(value?: string | null) {
  return typeof value === "string" && /^postgres(?:ql)?:\/\//i.test(value);
}

function isLocalUrl(value?: string | null) {
  return Boolean(value && /(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/i.test(value));
}

function getDatabaseUrl() {
  const configuredUrl = normalizeUrl(process.env.DATABASE_URL);
  const netlifyDatabaseUrl = normalizeUrl(process.env.NETLIFY_DATABASE_URL);
  const netlifyDbUrl = normalizeUrl(process.env.NETLIFY_DB_URL);
  const netlifyPublicUrl = normalizeUrl(process.env.NETLIFY_DATABASE_CONNECTION_URL);
  const isNetlifyRuntime = process.env.NETLIFY === "true";
  const isDev = process.env.NODE_ENV !== "production";

  const pickServerUrl = (value?: string | null, options: { allowLocal: boolean } = { allowLocal: false }) => {
    const normalized = normalizeUrl(value);
    if (!isPostgresUrl(normalized) || (!options.allowLocal && isLocalUrl(normalized))) {
      return null;
    }

    return normalized;
  };

  const resolveFromCandidates = (allowLocal: boolean) => {
    const sources = [netlifyDatabaseUrl, netlifyDbUrl, netlifyPublicUrl, configuredUrl];
    for (const source of sources) {
      const selected = pickServerUrl(source, { allowLocal });
      if (selected) return selected;
    }

    return null;
  };

  if (isNetlifyRuntime) {
    const runtimeUrl = resolveFromCandidates(false);
    if (runtimeUrl) return runtimeUrl;
    return null;
  }

  const fallbackUrl = resolveFromCandidates(isDev);
  if (fallbackUrl) return fallbackUrl;

  return configuredUrl;
}

const prismaOptions: ConstructorParameters<typeof PrismaClient>[0] = {
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
};

const databaseUrl = getDatabaseUrl();

if (databaseUrl) {
  prismaOptions.datasources = {
    db: {
      url: databaseUrl
    }
  };
}

function unavailablePrismaClient() {
  const reject = async () => {
    throw new Error("Database connection is not configured.");
  };
  const modelProxy = new Proxy(
    {},
    {
      get: () => reject
    }
  );

  return new Proxy(
    {},
    {
      get: (_target, property) => {
        if (property === "$connect" || property === "$disconnect" || property === "$transaction" || property === "$executeRaw") {
          return reject;
        }
        return modelProxy;
      }
    }
  ) as PrismaClient;
}

export const prisma =
  globalForPrisma.prisma ??
  (databaseUrl ? new PrismaClient(prismaOptions) : unavailablePrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
