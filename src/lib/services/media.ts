import "@/lib/serverOnly";

import { and, desc, eq } from "drizzle-orm";

import { db, requireDatabase } from "@/lib/db/client";
import { imageSlots, mediaCategories, mediaFiles } from "@/lib/db/schema";
import { getImageSlotByKey, imageSlotRegistry } from "@/lib/imageSlots";
import {
  createPresignedUploadUrl,
  createUploadDescriptor,
  deleteStoredAsset,
  getPublicAssetUrl,
  processMediaUpload,
} from "@/lib/r2";
import { safeRevalidateTag } from "@/lib/cacheRevalidate";
import { MEDIA_SLOTS_CACHE_TAG } from "@/lib/services/site-settings";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pickNonEmpty(...values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0) ?? "";
}

export async function listMediaLibrary() {
  if (!db) {
    return {
      files: [],
      slots: imageSlotRegistry.map((slot) => ({
        ...slot,
        createdAt: null,
        id: `registry-${slot.slotKey}`,
        mediaFile: null,
        mediaFileId: null,
        updatedAt: null,
      })),
    };
  }

  const [files, slotRows] = await Promise.all([
    db.query.mediaFiles.findMany({
      with: {
        category: true,
      },
      orderBy: desc(mediaFiles.createdAt),
      limit: 100,
    }),
    db.query.imageSlots.findMany({
      with: {
        mediaFile: true,
      },
      orderBy: desc(imageSlots.updatedAt),
      limit: 100,
    }),
  ]);

  const slotMap = new Map(slotRows.map((slot) => [slot.slotKey, slot]));
  const slots = imageSlotRegistry.map((registered) => {
    const bound = slotMap.get(registered.slotKey);
    return {
      ...registered,
      defaultFallbackUrl: registered.fallbackUrl,
      id: bound?.id ?? `registry-${registered.slotKey}`,
      createdAt: bound?.createdAt ?? null,
      fallbackUrl: pickNonEmpty(bound?.fallbackUrl, registered.fallbackUrl),
      updatedAt: bound?.updatedAt ?? null,
      mediaFile: bound?.mediaFile ?? null,
      mediaFileId: bound?.mediaFileId ?? null,
    };
  });

  return { files, slots };
}

export async function uploadMediaFile(input: {
  alt?: string;
  categoryName?: string;
  categorySlug?: string;
  contentType: string;
  fileName: string;
  fileBuffer: Buffer;
}) {
  const database = requireDatabase();
  const upload = await processMediaUpload(
    input.fileName,
    input.contentType,
    input.fileBuffer,
  );

  let categoryId: string | null = null;
  const resolvedSlug = slugify(input.categorySlug || input.categoryName || "general");

  const existingCategory = await database.query.mediaCategories.findFirst({
    where: eq(mediaCategories.slug, resolvedSlug),
  });

  if (existingCategory) {
    categoryId = existingCategory.id;
  } else {
    const [createdCategory] = await database
      .insert(mediaCategories)
      .values({
        slug: resolvedSlug,
        name: input.categoryName?.trim() || resolvedSlug,
      })
      .returning();

    categoryId = createdCategory.id;
  }

  const [created] = await database
    .insert(mediaFiles)
    .values({
      alt: input.alt?.trim() || "",
      categoryId,
      fileKey: upload.fileKey,
      height: upload.height,
      mimeType: upload.mimeType,
      size: upload.size,
      url: upload.url,
      webpThumbUrl: upload.webpThumbUrl,
      width: upload.width,
    })
    .returning();

  return created;
}

export async function createDirectUpload(input: {
  contentType: string;
  fileName: string;
}) {
  const descriptor = createUploadDescriptor(input.fileName, input.contentType);
  const uploadUrl = await createPresignedUploadUrl(descriptor.fileKey, input.contentType);

  return {
    fileKey: descriptor.fileKey,
    uploadUrl,
    url: getPublicAssetUrl(descriptor.fileKey),
    webpThumbUrl: input.contentType.startsWith("image/")
      ? getPublicAssetUrl(descriptor.thumbKey)
      : getPublicAssetUrl(descriptor.fileKey),
  };
}

export async function registerUploadedMedia(input: {
  alt?: string;
  categoryName?: string;
  categorySlug?: string;
  contentType: string;
  fileKey: string;
  height?: number;
  size: number;
  url: string;
  webpThumbUrl?: string;
  width?: number;
}) {
  const database = requireDatabase();
  let categoryId: string | null = null;
  const resolvedSlug = slugify(input.categorySlug || input.categoryName || "general");

  const existingCategory = await database.query.mediaCategories.findFirst({
    where: eq(mediaCategories.slug, resolvedSlug),
  });

  if (existingCategory) {
    categoryId = existingCategory.id;
  } else {
    const [createdCategory] = await database
      .insert(mediaCategories)
      .values({
        slug: resolvedSlug,
        name: input.categoryName?.trim() || resolvedSlug,
      })
      .returning();

    categoryId = createdCategory.id;
  }

  const [created] = await database
    .insert(mediaFiles)
    .values({
      alt: input.alt?.trim() || "",
      categoryId,
      fileKey: input.fileKey,
      height: input.height ?? 0,
      mimeType: input.contentType,
      size: input.size,
      url: input.url,
      webpThumbUrl: input.webpThumbUrl || input.url,
      width: input.width ?? 0,
    })
    .returning();

  return created;
}

export async function updateMediaFileAlt(fileId: string, alt: string) {
  const database = requireDatabase();
  const [updated] = await database
    .update(mediaFiles)
    .set({
      alt: alt.trim(),
      updatedAt: new Date(),
    })
    .where(eq(mediaFiles.id, fileId))
    .returning();

  if (!updated) {
    throw new Error(`Unknown media file: ${fileId}`);
  }

  return updated;
}

export async function deleteMediaFile(fileId: string) {
  const database = requireDatabase();
  const existing = await database.query.mediaFiles.findFirst({
    where: eq(mediaFiles.id, fileId),
    with: {
      slots: true,
    },
  });

  if (!existing) {
    throw new Error(`Unknown media file: ${fileId}`);
  }

  await Promise.all(
    existing.slots.map((slot) =>
      database
        .update(imageSlots)
        .set({
          mediaFileId: null,
          updatedAt: new Date(),
        })
        .where(eq(imageSlots.id, slot.id)),
    ),
  );

  await database.delete(mediaFiles).where(eq(mediaFiles.id, fileId));

  const fileKeys = new Set<string>([existing.fileKey]);
  if (existing.webpThumbUrl && existing.webpThumbUrl !== existing.url) {
    const thumbPrefix = `${getPublicAssetUrl("")}`.replace(/\/$/, "");
    if (existing.webpThumbUrl.startsWith(thumbPrefix)) {
      const thumbKey = existing.webpThumbUrl.slice(thumbPrefix.length + 1);
      if (thumbKey) {
        fileKeys.add(thumbKey);
      }
    }
  }

  await Promise.all(Array.from(fileKeys).map((fileKey) => deleteStoredAsset(fileKey)));
  safeRevalidateTag(MEDIA_SLOTS_CACHE_TAG);

  return existing;
}

export async function assignMediaToSlot(
  slotKey: string,
  mediaFileId: string | null,
  fallbackUrl?: string | null,
) {
  const database = requireDatabase();
  const slot = getImageSlotByKey(slotKey);

  if (!slot) {
    throw new Error(`Unknown slotKey: ${slotKey}`);
  }

  const existing = await database.query.imageSlots.findFirst({
    where: eq(imageSlots.slotKey, slotKey),
  });

  const resolvedFallbackUrl =
    fallbackUrl !== undefined
      ? pickNonEmpty(fallbackUrl, slot.fallbackUrl)
      : pickNonEmpty(existing?.fallbackUrl, slot.fallbackUrl);

  if (existing) {
    const [updated] = await database
      .update(imageSlots)
      .set({
        fallbackUrl: resolvedFallbackUrl,
        mediaFileId,
        updatedAt: new Date(),
      })
      .where(and(eq(imageSlots.id, existing.id), eq(imageSlots.slotKey, slotKey)))
      .returning();

    safeRevalidateTag(MEDIA_SLOTS_CACHE_TAG);
    return updated;
  }

  const [created] = await database
    .insert(imageSlots)
    .values({
      slotKey,
      label: slot.label,
      category: slot.category,
      description: slot.description,
      fallbackUrl: resolvedFallbackUrl,
      mediaFileId,
    })
    .returning();

  safeRevalidateTag(MEDIA_SLOTS_CACHE_TAG);
  return created;
}
