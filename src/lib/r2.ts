import "@/lib/serverOnly";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { env, hasR2Config, requireEnvValue } from "@/lib/env";

function getR2Client() {
  if (!hasR2Config()) {
    throw new Error("R2 is not configured.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${requireEnvValue(env.R2_ACCOUNT_ID, "R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnvValue(env.R2_ACCESS_KEY_ID, "R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnvValue(env.R2_SECRET_ACCESS_KEY, "R2_SECRET_ACCESS_KEY"),
    },
  });
}

function sanitizeBaseName(fileName: string) {
  const parsed = path.parse(fileName);
  const baseName = parsed.name || "asset";
  const ext = parsed.ext.toLowerCase().replace(/[^a-z0-9.]/g, "");
  const safeName = `${Date.now()}-${baseName}`.replace(/[^a-zA-Z0-9-_]/g, "-");

  return {
    ext,
    safeName,
  };
}

async function storePublicFile(fileKey: string, body: Buffer) {
  if (hasR2Config()) {
    const client = getR2Client();
    const bucket = requireEnvValue(env.R2_BUCKET, "R2_BUCKET");

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: body,
      }),
    );

    const publicBase = requireEnvValue(env.NEXT_PUBLIC_R2_URL, "NEXT_PUBLIC_R2_URL").replace(
      /\/+$/,
      "",
    );

    return `${publicBase}/${fileKey}`;
  }

  const fullPath = path.join(process.cwd(), "public", fileKey);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, body);

  return `/${fileKey.replace(/\\/g, "/")}`;
}

async function uploadAsset(fileKey: string, body: Buffer, contentType: string) {
  if (hasR2Config()) {
    const client = getR2Client();
    const bucket = requireEnvValue(env.R2_BUCKET, "R2_BUCKET");

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: body,
        ContentType: contentType,
      }),
    );

    const publicBase = requireEnvValue(env.NEXT_PUBLIC_R2_URL, "NEXT_PUBLIC_R2_URL").replace(
      /\/+$/,
      "",
    );

    return `${publicBase}/${fileKey}`;
  }

  return storePublicFile(fileKey, body);
}

export async function processMediaUpload(
  fileName: string,
  contentType: string,
  buffer: Buffer,
) {
  const { ext, safeName } = sanitizeBaseName(fileName);
  const assetExt = ext || (contentType.startsWith("video/") ? ".mp4" : ".bin");

  if (contentType.startsWith("image/")) {
    const main = sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true });

    const thumb = sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 });

    const [mainResult, thumbResult, metadata] = await Promise.all([
      main.toBuffer(),
      thumb.toBuffer(),
      sharp(buffer).metadata(),
    ]);

    const mainKey = `uploads/${safeName}${assetExt}`;
    const thumbKey = `uploads/${safeName}-thumb.webp`;
    const [url, webpThumbUrl] = await Promise.all([
      uploadAsset(mainKey, mainResult, contentType),
      uploadAsset(thumbKey, thumbResult, "image/webp"),
    ]);

    return {
      fileKey: mainKey,
      height: metadata.height ?? 0,
      mimeType: contentType,
      size: mainResult.byteLength,
      thumbKey,
      url,
      webpThumbUrl,
      width: metadata.width ?? 0,
    };
  }

  const fileKey = `uploads/${safeName}${assetExt}`;
  const url = await uploadAsset(fileKey, buffer, contentType);

  return {
    fileKey,
    height: 0,
    mimeType: contentType,
    size: buffer.byteLength,
    thumbKey: fileKey,
    url,
    webpThumbUrl: url,
    width: 0,
  };
}
