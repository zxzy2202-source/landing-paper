import { NextResponse } from "next/server";

import { getCurrentAdminSession } from "@/lib/auth";
import { listMediaLibrary, uploadMediaFile } from "@/lib/services/media";

function isSupportedMediaType(file: File) {
  return file.type.startsWith("image/") || file.type.startsWith("video/");
}

function unauthorized() {
  return NextResponse.json({ error: "未授权访问。" }, { status: 401 });
}

export async function GET() {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  return NextResponse.json(await listMediaLibrary());
}

export async function POST(request: Request) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请选择要上传的文件。" }, { status: 400 });
    }

    if (!isSupportedMediaType(file)) {
      return NextResponse.json(
        { error: "当前仅支持图片和视频文件上传。" },
        { status: 400 },
      );
    }

    const media = await uploadMediaFile({
      alt: String(formData.get("alt") ?? ""),
      categoryName: String(formData.get("categoryName") ?? "通用素材"),
      categorySlug: String(formData.get("categorySlug") ?? "general"),
      contentType: file.type || "application/octet-stream",
      fileBuffer: Buffer.from(await file.arrayBuffer()),
      fileName: file.name,
    });

    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "上传失败，请稍后重试。",
      },
      { status: 500 },
    );
  }
}
