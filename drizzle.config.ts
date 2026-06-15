import { defineConfig } from "drizzle-kit";

const url = process.env.TURSO_DATABASE_URL;

if (!url) {
  throw new Error("Missing TURSO_DATABASE_URL for Drizzle.");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  strict: true,
  verbose: true,
});
