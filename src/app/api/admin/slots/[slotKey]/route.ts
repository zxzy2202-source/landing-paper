import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAdminSession } from "@/lib/auth";
import { assignMediaToSlot } from "@/lib/services/media";

const bodySchema = z.object({
  fallbackUrl: z.string().nullable().optional(),
  mediaFileId: z.string().nullable(),
});

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ slotKey: string }>;
  },
) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = bodySchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid slot payload." }, { status: 400 });
  }

  const { slotKey } = await context.params;
  const slot = await assignMediaToSlot(
    slotKey,
    payload.data.mediaFileId,
    payload.data.fallbackUrl,
  );

  return NextResponse.json(slot);
}
