import { NextResponse } from "next/server";

import { adminCookieName, getCurrentAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { logActivity } from "@/lib/services/activity-log";

export async function POST() {
  const session = await getCurrentAdminSession();

  if (session) {
    await logActivity({
      action: "admin.logout",
      adminUserId: session.id,
      entityId: session.id,
      entityType: "admin_user",
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
