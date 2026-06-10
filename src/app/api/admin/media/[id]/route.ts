import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAdminSession } from "@/lib/auth";
import { updateMediaFileAlt } from "@/lib/services/media";

const payloadSchema = z.object({
  alt: z.string().max(500),
});

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  const parsed = payloadSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid media payload." }, { status: 400 });
  }

  const { id } = await context.params;

  try {
    const media = await updateMediaFileAlt(id, parsed.data.alt);
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update media alt.",
      },
      { status: 404 },
    );
  }
}
