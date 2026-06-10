import "@/lib/serverOnly";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env, requireEnvValue } from "@/lib/env";
import { getAdminById } from "@/lib/services/admin-users";

export type AdminSessionPayload = {
  email: string;
  role: string;
  userId: string;
};

const encoder = new TextEncoder();

export const adminCookieName = env.ADMIN_COOKIE_NAME;

function getJwtSecret() {
  return encoder.encode(requireEnvValue(env.JWT_SECRET, "JWT_SECRET"));
}

export async function createAdminSessionToken(payload: AdminSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAdminSessionToken(token: string) {
  const result = await jwtVerify<AdminSessionPayload>(token, getJwtSecret());
  return result.payload;
}

export async function getCurrentAdminSession() {
  if (!env.JWT_SECRET) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await verifyAdminSessionToken(token);
    const user = await getAdminById(session.userId);
    return user?.isActive ? user : null;
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getCurrentAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
