import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAdminSession } from "@/lib/auth";
import { hasR2Config } from "@/lib/env";
import { createDirectUpload, registerProcessedDirectUpload } from "@/lib/services/media";

const createUploadSchema = z.object({
  contentType: z.string().min(1),
  fileName: z.string().min(1).max(255),
  slotKey: z.string().max(255).optional(),
});

const completeUploadSchema = z.object({
  alt: z.string().max(500).optional(),
  categoryName: z.string().max(120).optional(),
  categorySlug: z.string().max(120).optional(),
  contentType: z.string().min(1),
  fileKey: z.string().min(1),
  height: z.number().int().min(0).optional(),
  size: z.number().int().min(1).optional(),
  slotKey: z.string().optional(),
  url: z.string().url().optional(),
  webpThumbUrl: z.string().url().optional(),
  width: z.number().int().min(0).optional(),
});

function unauthorized() {
  return NextResponse.json({ error: "未授权访问。" }, { status: 401 });
}

export async function POST(request: Request) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  if (!hasR2Config()) {
    return NextResponse.json({ error: "当前环境尚未配置 R2 直传。" }, { status: 400 });
  }

  try {
    const parsed = createUploadSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "上传参数无效。" }, { status: 400 });
    }

    const result = await createDirectUpload(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "创建上传地址失败。",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  try {
    const parsed = completeUploadSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "素材登记参数无效。" }, { status: 400 });
    }

    const media = await registerProcessedDirectUpload(parsed.data);
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "登记上传素材失败。",
      },
      { status: 500 },
    );
  }
}
