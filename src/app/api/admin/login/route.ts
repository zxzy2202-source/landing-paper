import { NextResponse } from "next/server";
import { z } from "zod";

import { adminCookieName, createAdminSessionToken } from "@/lib/auth";
import { env } from "@/lib/env";
import { logActivity } from "@/lib/services/activity-log";
import {
  authenticateAdminUser,
  updateAdminLastLogin,
} from "@/lib/services/admin-users";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const payload = loginSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid email or password format." },
      { status: 400 },
    );
  }

  const admin = await authenticateAdminUser(
    payload.data.email,
    payload.data.password,
  );

  if (!admin) {
    return NextResponse.json(
      { error: "Incorrect credentials." },
      { status: 401 },
    );
  }

  const token = await createAdminSessionToken({
    email: admin.email,
    role: admin.role,
    userId: admin.id,
  });

  await updateAdminLastLogin(admin.id);

  await logActivity({
    action: "admin.login",
    adminUserId: admin.id,
    entityId: admin.id,
    entityType: "admin_user",
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
