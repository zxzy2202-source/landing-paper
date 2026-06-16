import "@/lib/serverOnly";

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";

import { env, hasR2Config, requireEnvValue } from "@/lib/env";

type ImageVariantOptions = {
  fit?: "cover" | "inside";
  height?: number;
  mode?: "optimized" | "original";
  quality?: number;
  thumbHeight?: number;
  thumbWidth?: number;
  width?: number;
};

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
  const safeName = baseName.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "asset";

  return {
    ext,
    safeName,
  };
}

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "slot";
}

function getUploadDateSegments(date = new Date()) {
  return {
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
}

function buildSlotSlug(slotKey: string) {
  return slotKey
    .split(".")
    .map((segment) => sanitizePathSegment(segment))
    .join("-");
}

function buildUploadDirectory(options?: {
  date?: Date;
  temporary?: boolean;
}) {
  const { month, year } = getUploadDateSegments(options?.date);
  const prefix = options?.temporary ? "wp-content/uploads/tmp" : "wp-content/uploads";

  return `${prefix}/${year}/${month}`;
}

function buildUploadBaseName(fileName: string, slotKey?: string) {
  if (slotKey) {
    return `${buildSlotSlug(slotKey)}-${Date.now()}`;
  }

  const { safeName } = sanitizeBaseName(fileName);
  return `library-${Date.now()}-${safeName}`;
}

export function createUploadDescriptor(
  fileName: string,
  contentType: string,
  slotKey?: string,
  options?: ImageVariantOptions,
) {
  const { ext } = sanitizeBaseName(fileName);
  const assetExt = ext || (contentType.startsWith("video/") ? ".mp4" : ".bin");
  const preserveOriginal = contentType.startsWith("image/") && options?.mode === "original";
  const processedExt = contentType.startsWith("image/") && !preserveOriginal ? ".webp" : assetExt;
  const baseDirectory = buildUploadDirectory();
  const tempDirectory = buildUploadDirectory({ temporary: true });
  const baseName = buildUploadBaseName(fileName, slotKey);
  const processedFileKey = `${baseDirectory}/${baseName}${processedExt}`;
  const fileKey = contentType.startsWith("image/") && !preserveOriginal
    ? `${tempDirectory}/${baseName}${assetExt}`
    : processedFileKey;

  return {
    assetExt,
    baseDirectory,
    baseName,
    fileKey,
    processedFileKey,
    safeName: baseName,
    thumbKey: contentType.startsWith("image/") && !preserveOriginal
      ? `${baseDirectory}/${baseName}-thumb.webp`
      : fileKey,
  };
}

export function getPublicAssetUrl(fileKey: string) {
  if (hasR2Config()) {
    const publicBase = requireEnvValue(env.NEXT_PUBLIC_R2_URL, "NEXT_PUBLIC_R2_URL").replace(
      /\/+$/,
      "",
    );

    return `${publicBase}/${fileKey}`;
  }

  return `/${fileKey.replace(/\\/g, "/")}`;
}

export function getLocalAssetPath(fileKey: string) {
  return path.join(process.cwd(), "public", fileKey);
}

export function getThumbKeyForFileKey(fileKey: string) {
  return fileKey.replace(/\.[^.]+$/, "") + "-thumb.webp";
}

function getProcessedFileKey(fileKey: string, contentType?: string) {
  const baseKey = fileKey
    .replace(/^wp-content\/uploads\/tmp\//, "wp-content/uploads/")
    .replace(/^uploads\/tmp\//, "uploads/");

  if (contentType?.startsWith("image/")) {
    return baseKey.replace(/\.[^.]+$/, ".webp");
  }

  return baseKey;
}

export async function createPresignedUploadUrl(fileKey: string, contentType: string) {
  const client = getR2Client();
  const bucket = requireEnvValue(env.R2_BUCKET, "R2_BUCKET");

  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      ContentType: contentType,
    }),
    { expiresIn: 600 },
  );
}

export async function deleteStoredAsset(fileKey: string) {
  if (hasR2Config()) {
    const client = getR2Client();
    const bucket = requireEnvValue(env.R2_BUCKET, "R2_BUCKET");

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      }),
    );

    return;
  }

  await rm(getLocalAssetPath(fileKey), {
    force: true,
  });
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

async function readStoredAsset(fileKey: string) {
  if (hasR2Config()) {
    const client = getR2Client();
    const bucket = requireEnvValue(env.R2_BUCKET, "R2_BUCKET");
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      }),
    );

    if (!response.Body) {
      throw new Error(`Stored asset body is empty: ${fileKey}`);
    }

    const bytes = await response.Body.transformToByteArray();
    return Buffer.from(bytes);
  }

  return readFile(getLocalAssetPath(fileKey));
}

function applyOutputFormat(
  instance: sharp.Sharp,
  quality: number,
) {
  return instance.webp({ quality });
}

async function buildImageVariants(
  buffer: Buffer,
  options?: ImageVariantOptions,
) {
  if (options?.mode === "original") {
    const metadata = await sharp(buffer, { failOn: "none" }).rotate().metadata();

    return {
      height: metadata.height ?? 0,
      mainResult: buffer,
      size: buffer.byteLength,
      thumbResult: buffer,
      width: metadata.width ?? 0,
    };
  }

  const fit = options?.fit ?? "inside";
  const resizeWidth = options?.width ?? 1600;
  const resizeHeight = options?.height ?? 1200;
  const quality = options?.quality ?? 74;
  const thumbWidth = options?.thumbWidth ?? Math.min(resizeWidth, 400);
  const thumbHeight = options?.thumbHeight ?? Math.min(resizeHeight, 300);

  const base = sharp(buffer, { failOn: "none" }).rotate();
  const mainPipeline = applyOutputFormat(
    base.clone().resize({
      width: resizeWidth,
      height: resizeHeight,
      fit,
      position: "centre",
      withoutEnlargement: true,
    }),
    quality,
  );

  const thumbPipeline = base
    .clone()
    .resize({
      width: thumbWidth,
      height: thumbHeight,
      fit,
      position: "centre",
      withoutEnlargement: true,
    })
    .webp({ quality: Math.max(quality - 4, 60) });

  const [mainResult, thumbResult] = await Promise.all([
    mainPipeline.toBuffer(),
    thumbPipeline.toBuffer(),
  ]);
  const metadata = await sharp(mainResult, { failOn: "none" }).metadata();

  return {
    height: metadata.height ?? 0,
    mainResult,
    size: mainResult.byteLength,
    thumbResult,
    width: metadata.width ?? 0,
  };
}

export async function finalizeDirectUploadedImage(
  fileKey: string,
  contentType: string,
  options?: ImageVariantOptions,
) {
  const buffer = await readStoredAsset(fileKey);
  const processedFileKey = getProcessedFileKey(fileKey, contentType);
  const preserveOriginal = options?.mode === "original";
  const thumbKey = preserveOriginal ? processedFileKey : getThumbKeyForFileKey(processedFileKey);
  const variants = await buildImageVariants(buffer, options);
  const [url, webpThumbUrl] = preserveOriginal
    ? await Promise.all([
        uploadAsset(processedFileKey, variants.mainResult, contentType),
        Promise.resolve(getPublicAssetUrl(processedFileKey)),
      ])
    : await Promise.all([
        uploadAsset(processedFileKey, variants.mainResult, contentType),
        uploadAsset(thumbKey, variants.thumbResult, "image/webp"),
      ]);

  if (processedFileKey !== fileKey) {
    await deleteStoredAsset(fileKey).catch(() => {});
  }

  return {
    fileKey: processedFileKey,
    height: variants.height,
    mimeType: preserveOriginal ? contentType : "image/webp",
    size: variants.size,
    thumbKey,
    url,
    webpThumbUrl,
    width: variants.width,
  };
}

export async function processMediaUpload(
  fileName: string,
  contentType: string,
  buffer: Buffer,
  slotKey?: string,
  options?: ImageVariantOptions,
) {
  const { fileKey, processedFileKey, thumbKey } = createUploadDescriptor(
    fileName,
    contentType,
    slotKey,
    options,
  );

  if (contentType.startsWith("image/")) {
    const variants = await buildImageVariants(buffer, options);
    const preserveOriginal = options?.mode === "original";

    const [url, webpThumbUrl] = preserveOriginal
      ? await Promise.all([
          uploadAsset(processedFileKey, variants.mainResult, contentType),
          Promise.resolve(getPublicAssetUrl(processedFileKey)),
        ])
      : await Promise.all([
          uploadAsset(processedFileKey, variants.mainResult, contentType),
          uploadAsset(thumbKey, variants.thumbResult, "image/webp"),
        ]);

    return {
      fileKey: processedFileKey,
      height: variants.height,
      mimeType: preserveOriginal ? contentType : "image/webp",
      size: variants.size,
      thumbKey,
      url,
      webpThumbUrl,
      width: variants.width,
    };
  }

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
