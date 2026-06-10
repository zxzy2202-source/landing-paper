import "@/lib/serverOnly";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env, requireEnvValue } from "@/lib/env";
import * as schema from "@/lib/db/schema";

declare global {
  var __landingDb__: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

function createDatabase() {
  const url = env.TURSO_DATABASE_URL;

  if (!url) {
    return null;
  }

  const client = createClient({
    url,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
}

export const db =
  globalThis.__landingDb__ ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
  globalThis.__landingDb__ = db ?? undefined;
}

export function requireDatabase() {
  requireEnvValue(env.TURSO_DATABASE_URL, "TURSO_DATABASE_URL");

  if (!db) {
    throw new Error("Database client is not configured.");
  }

  return db;
}
