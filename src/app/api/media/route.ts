import sharp from "sharp";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";

const LEGACY_MEDIA_HOSTS = new Set(["pos.zhixinpaper.com"]);

function getAllowedHosts(request: Request) {
  const hosts = new Set<string>(LEGACY_MEDIA_HOSTS);

  try {
    hosts.add(new URL(request.url).host);
  } catch {}

  if (env.NEXT_PUBLIC_R2_URL) {
    try {
      hosts.add(new URL(env.NEXT_PUBLIC_R2_URL).host);
    } catch {}
  }

  return hosts;
}

function resolveSourceUrl(request: Request, src: string) {
  try {
    const parsed = new URL(src);
    return parsed;
  } catch {
    return new URL(src, request.url);
  }
}

function isAllowedSource(request: Request, src: string) {
  const resolved = resolveSourceUrl(request, src);

  if (resolved.protocol !== "https:" && resolved.origin !== new URL(request.url).origin) {
    return false;
  }

  return getAllowedHosts(request).has(resolved.host);
}

function getCacheControl(contentType: string) {
  if (contentType.startsWith("image/") || contentType.startsWith("video/") || contentType.startsWith("font/")) {
    return "public, max-age=31536000, s-maxage=31536000, immutable";
  }

  return "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";
}

function normalizeWidth(value: string | null) {
  const parsed = Number(value || "0");

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return Math.min(Math.round(parsed), 2000);
}

async function transformImage(buffer: Buffer, width: number, contentType: string) {
  if (!width || !contentType.startsWith("image/")) {
    return { body: new Uint8Array(buffer), contentType };
  }

  const transformed = await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({
      width,
      withoutEnlargement: true,
    })
    .webp({ quality: width >= 1200 ? 62 : width >= 720 ? 68 : 72 })
    .toBuffer();

  return {
    body: new Uint8Array(transformed),
    contentType: "image/webp",
  };
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const src = requestUrl.searchParams.get("src") ?? "";
  const width = normalizeWidth(requestUrl.searchParams.get("w"));

  if (!src || !isAllowedSource(request, src)) {
    return NextResponse.json({ error: "Invalid media source." }, { status: 400 });
  }

  const upstream = resolveSourceUrl(request, src);
  const response = await fetch(upstream, {
    headers: {
      Accept: request.headers.get("accept") || "image/avif,image/webp,image/*,*/*;q=0.8",
    },
    cache: "force-cache",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to load media." }, { status: 502 });
  }

  const sourceContentType = response.headers.get("content-type") || "application/octet-stream";
  const sourceBuffer = Buffer.from(await response.arrayBuffer());
  const transformed = await transformImage(sourceBuffer, width, sourceContentType);

  return new NextResponse(transformed.body, {
    status: 200,
    headers: {
      "Cache-Control": getCacheControl(transformed.contentType),
      "Content-Length": String(transformed.body.byteLength),
      "Content-Type": transformed.contentType,
      Vary: "Accept",
    },
  });
}
