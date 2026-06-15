import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAdminSession } from "@/lib/auth";
import { logActivity } from "@/lib/services/activity-log";
import {
  inquiryKinds,
  updateInquiryStatus,
} from "@/lib/services/inquiries";

const bodySchema = z.object({
  status: z.string().min(1),
});

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string; kind: string }>;
  },
) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id, kind } = await context.params;

  if (!inquiryKinds.includes(kind as (typeof inquiryKinds)[number])) {
    return NextResponse.json({ error: "Unknown inquiry type." }, { status: 400 });
  }

  const payload = bodySchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await updateInquiryStatus(
    kind as (typeof inquiryKinds)[number],
    id,
    payload.data.status,
  );

  await logActivity({
    action: "inquiry.status.update",
    adminUserId: admin.id,
    entityId: id,
    entityType: `${kind}_inquiry`,
    payload: {
      status: payload.data.status,
    },
  });

  return NextResponse.json(updated);
}
