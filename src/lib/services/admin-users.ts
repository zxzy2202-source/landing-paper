import "@/lib/serverOnly";

import { count, desc, eq } from "drizzle-orm";

import { db, requireDatabase } from "@/lib/db/client";
import { adminUsers, type AdminUser } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/passwords";

type CreateAdminInput = {
  email: string;
  name: string;
  password: string;
  role?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createAdminUser(input: CreateAdminInput) {
  const database = requireDatabase();
  const email = normalizeEmail(input.email);
  const existing = await database.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });

  if (existing) {
    throw new Error("Admin email already exists.");
  }

  const [created] = await database
    .insert(adminUsers)
    .values({
      email,
      name: input.name.trim(),
      passwordHash: await hashPassword(input.password),
      role: input.role ?? "editor",
    })
    .returning();

  return created;
}

export async function getAdminById(id: string) {
  if (!db) {
    return null;
  }

  return db.query.adminUsers.findFirst({
    where: eq(adminUsers.id, id),
  });
}

export async function authenticateAdminUser(email: string, password: string) {
  const database = requireDatabase();
  const admin = await database.query.adminUsers.findFirst({
    where: eq(adminUsers.email, normalizeEmail(email)),
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  const matches = await verifyPassword(password, admin.passwordHash);
  return matches ? admin : null;
}

export async function updateAdminLastLogin(id: string) {
  const database = requireDatabase();

  await database
    .update(adminUsers)
    .set({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, id));
}

export async function getAdminSummary() {
  if (!db) {
    return {
      latestAdmins: [] as AdminUser[],
      totalAdmins: 0,
    };
  }

  const [{ value: totalAdmins }] = await db
    .select({ value: count() })
    .from(adminUsers);

  const latestAdmins = await db.query.adminUsers.findMany({
    orderBy: desc(adminUsers.createdAt),
    limit: 5,
  });

  return {
    latestAdmins,
    totalAdmins,
  };
}
