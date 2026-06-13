import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAdminSession } from "@/lib/auth";
import { deleteMediaFile, updateMediaFileAlt } from "@/lib/services/media";

const payloadSchema = z.object({
  alt: z.string().max(500),
});

function unauthorized() {
  return NextResponse.json({ error: "未授权访问。" }, { status: 401 });
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
    return NextResponse.json({ error: "素材参数无效。" }, { status: 400 });
  }

  const { id } = await context.params;

  try {
    const media = await updateMediaFileAlt(id, parsed.data.alt);
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "更新 Alt 失败。",
      },
      { status: 404 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  const { id } = await context.params;

  try {
    const media = await deleteMediaFile(id);
    return NextResponse.json({ id: media.id, ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "删除素材失败。",
      },
      { status: 404 },
    );
  }
}
