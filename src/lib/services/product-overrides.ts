import "@/lib/serverOnly";

import { and, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { safeRevalidatePath, safeRevalidateTag } from "@/lib/cacheRevalidate";
import { db, requireDatabase } from "@/lib/db/client";
import { productOverrides } from "@/lib/db/schema";
import {
  defaultIndustryPages,
  getDefaultIndustryBySlug,
  type IndustryPageContent,
} from "@/lib/industryPages";

const INDUSTRY_CACHE_TAG = "industry-pages";

export type IndustryPageRecord = {
  content: IndustryPageContent;
  id: string;
  isPublished: boolean;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  summary: string | null;
  title: string;
};

function mergeIndustryContent(
  slug: string,
  content?: Record<string, unknown> | null,
): IndustryPageContent {
  const fallback = getDefaultIndustryBySlug(slug)?.content ?? defaultIndustryPages[0].content;

  if (!content) {
    return structuredClone(fallback);
  }

  return {
    ...structuredClone(fallback),
    ...content,
  } as IndustryPageContent;
}

function mapIndustryRecord(row: typeof productOverrides.$inferSelect): IndustryPageRecord {
  return {
    id: row.id,
    isPublished: row.isPublished,
    seoDescription: row.seoDescription,
    seoTitle: row.seoTitle,
    slug: row.slug,
    summary: row.summary,
    title: row.title,
    content: mergeIndustryContent(row.slug, row.productData),
  };
}

const getPublishedIndustryPagesCached = unstable_cache(
  async () => {
    if (!db) {
      return defaultIndustryPages.map((item, index) => ({
        id: `seed-${index}`,
        isPublished: true,
        seoDescription: item.seoDescription,
        seoTitle: item.seoTitle,
        slug: item.slug,
        summary: item.summary,
        title: item.title,
        content: item.content,
      }));
    }

    const rows = await db.query.productOverrides.findMany({
      where: eq(productOverrides.isPublished, true),
      orderBy: desc(productOverrides.updatedAt),
    });

    return rows.map(mapIndustryRecord);
  },
  ["published-industry-pages"],
  {
    revalidate: 3600,
    tags: [INDUSTRY_CACHE_TAG],
  },
);

export async function listPublishedIndustryPages() {
  return getPublishedIndustryPagesCached();
}

export async function listEditableIndustryPages() {
  if (!db) {
    return defaultIndustryPages.map((item, index) => ({
      id: `seed-${index}`,
      isPublished: true,
      seoDescription: item.seoDescription,
      seoTitle: item.seoTitle,
      slug: item.slug,
      summary: item.summary,
      title: item.title,
      content: item.content,
    }));
  }

  const rows = await db.query.productOverrides.findMany({
    orderBy: desc(productOverrides.updatedAt),
  });

  return rows.map(mapIndustryRecord);
}

export async function getIndustryPageBySlug(slug: string) {
  const published = await listPublishedIndustryPages();
  return published.find((item) => item.slug === slug) ?? null;
}

export async function ensureDefaultIndustryPages() {
  const database = requireDatabase();

  for (const item of defaultIndustryPages) {
    const existing = await database.query.productOverrides.findFirst({
      where: eq(productOverrides.slug, item.slug),
    });

    if (!existing) {
      await database.insert(productOverrides).values({
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        productData: item.content,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        isPublished: true,
      });
    }
  }

  safeRevalidateTag(INDUSTRY_CACHE_TAG);
}

type SaveIndustryInput = {
  content: IndustryPageContent;
  id?: string;
  isPublished: boolean;
  seoDescription?: string | null;
  seoTitle?: string | null;
  slug: string;
  summary?: string | null;
  title: string;
};

export async function saveIndustryPage(input: SaveIndustryInput) {
  const database = requireDatabase();
  const payload = {
    isPublished: input.isPublished,
    productData: input.content,
    seoDescription: input.seoDescription ?? null,
    seoTitle: input.seoTitle ?? null,
    slug: input.slug,
    summary: input.summary ?? null,
    title: input.title,
    updatedAt: new Date(),
  };

  if (input.id) {
    const [updated] = await database
      .update(productOverrides)
      .set(payload)
      .where(eq(productOverrides.id, input.id))
      .returning();

    safeRevalidateTag(INDUSTRY_CACHE_TAG);
    safeRevalidatePath(`/industries/${updated.slug}`);

    return mapIndustryRecord(updated);
  }

  const [created] = await database
    .insert(productOverrides)
    .values(payload)
    .returning();

  safeRevalidateTag(INDUSTRY_CACHE_TAG);
  safeRevalidatePath(`/industries/${created.slug}`);

  return mapIndustryRecord(created);
}

export async function deleteIndustryPage(id: string) {
  const database = requireDatabase();
  const existing = await database.query.productOverrides.findFirst({
    where: eq(productOverrides.id, id),
  });

  if (!existing) {
    return null;
  }

  const [deleted] = await database
    .delete(productOverrides)
    .where(and(eq(productOverrides.id, id), eq(productOverrides.slug, existing.slug)))
    .returning();

  safeRevalidateTag(INDUSTRY_CACHE_TAG);
  safeRevalidatePath(`/industries/${existing.slug}`);

  return deleted;
}
