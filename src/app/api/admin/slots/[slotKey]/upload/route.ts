import { NextResponse } from "next/server";

import { getCurrentAdminSession } from "@/lib/auth";
import { getImageSlotByKey } from "@/lib/imageSlots";
import { uploadMediaToSlot } from "@/lib/services/media";

function unauthorized() {
  return NextResponse.json({ error: "未授权访问。" }, { status: 401 });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slotKey: string }> },
) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  const { slotKey } = await context.params;
  const slot = getImageSlotByKey(slotKey);

  if (!slot) {
    return NextResponse.json({ error: "未知槽位。" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请选择要上传的文件。" }, { status: 400 });
    }

    const contentType = file.type || "application/octet-stream";
    const isImage = contentType.startsWith("image/");
    const isVideo = contentType.startsWith("video/");

    if (slot.mediaKind === "image" && !isImage) {
      return NextResponse.json({ error: "当前槽位仅支持上传图片。" }, { status: 400 });
    }

    if (slot.mediaKind === "video" && !isVideo) {
      return NextResponse.json({ error: "当前槽位仅支持上传视频。" }, { status: 400 });
    }

    const media = await uploadMediaToSlot({
      contentType,
      fileBuffer: Buffer.from(await file.arrayBuffer()),
      fileName: file.name,
      slotKey,
    });

    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "槽位上传失败。",
      },
      { status: 500 },
    );
  }
}
