import "@/lib/serverOnly";

import { z } from "zod";

const serverEnvSchema = z.object({
  ADMIN_COOKIE_NAME: z.string().min(1).default("landing_admin_session"),
  JWT_SECRET: z.string().min(32).optional(),
  NEXT_PUBLIC_R2_URL: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_ACCOUNT_ID: z.string().min(1).optional(),
  R2_BUCKET: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  SERVERCHAN_SENDKEY: z.string().min(1).optional(),
  TURSO_AUTH_TOKEN: z.string().min(1).optional(),
  TURSO_DATABASE_URL: z.string().url().optional(),
});

const parsedEnv = serverEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(parsedEnv.error.flatten().fieldErrors);
  throw new Error("Invalid server environment variables.");
}

export const env = parsedEnv.data;

export function hasDatabaseConfig() {
  return Boolean(env.TURSO_DATABASE_URL);
}

export function hasJwtSecret() {
  return Boolean(env.JWT_SECRET);
}

export function hasR2Config() {
  return Boolean(
    env.R2_ACCOUNT_ID &&
      env.R2_ACCESS_KEY_ID &&
      env.R2_SECRET_ACCESS_KEY &&
      env.R2_BUCKET &&
      env.NEXT_PUBLIC_R2_URL,
  );
}

export function requireEnvValue(
  value: string | undefined,
  name: string,
): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
