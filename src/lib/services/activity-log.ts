import "@/lib/serverOnly";

import { db } from "@/lib/db/client";
import { activityLog } from "@/lib/db/schema";

type ActivityPayload = {
  action: string;
  adminUserId?: string | null;
  entityId?: string | null;
  entityType: string;
  ipAddress?: string | null;
  payload?: Record<string, unknown>;
  userAgent?: string | null;
};

export async function logActivity(entry: ActivityPayload) {
  if (!db) {
    return null;
  }

  await db.insert(activityLog).values({
    action: entry.action,
    adminUserId: entry.adminUserId ?? null,
    entityId: entry.entityId ?? null,
    entityType: entry.entityType,
    ipAddress: entry.ipAddress ?? null,
    payload: entry.payload ?? null,
    userAgent: entry.userAgent ?? null,
  });

  return true;
}
