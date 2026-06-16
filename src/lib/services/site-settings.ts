import "@/lib/serverOnly";

import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";

import { buildMediaProxyUrl } from "@/lib/media-url";
import { safeRevalidateTag } from "@/lib/cacheRevalidate";
import { db, requireDatabase } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { imageSlotRegistry } from "@/lib/imageSlots";
import { scoreSeoConfig } from "@/lib/seo";
import {
  defaultSiteSettings,
  mergeSiteSettings,
  type SiteSettings,
} from "@/lib/siteSettingsTypes";

export const SITE_SETTINGS_CACHE_TAG = "site-settings";
export const MEDIA_SLOTS_CACHE_TAG = "media-slots";
const DEFAULT_SITE_KEY = "global";

export type PublicMediaSlotMap = Record<string, string>;

function pickNonEmpty(...values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0) ?? "";
}

const loadPublicMediaSlots = unstable_cache(
  async () => {
    const fallbackMap = Object.fromEntries(
      imageSlotRegistry.map((slot) => [slot.slotKey, slot.fallbackUrl]),
    ) as PublicMediaSlotMap;

    if (!db) {
      return fallbackMap;
    }

    const slotRows = await db.query.imageSlots.findMany({
      with: {
        mediaFile: true,
      },
    });

    const slotRowMap = new Map(slotRows.map((slot) => [slot.slotKey, slot]));

    return Object.fromEntries(
      imageSlotRegistry.map((slot) => {
        const bound = slotRowMap.get(slot.slotKey);
        return [
          slot.slotKey,
          slot.mediaKind === "image"
            ? buildMediaProxyUrl(
                pickNonEmpty(bound?.mediaFile?.url, bound?.fallbackUrl, slot.fallbackUrl),
              )
            : pickNonEmpty(bound?.mediaFile?.url, bound?.fallbackUrl, slot.fallbackUrl),
        ];
      }),
    ) as PublicMediaSlotMap;
  },
  ["public-media-slots-v3"],
  { revalidate: 3600, tags: [MEDIA_SLOTS_CACHE_TAG] },
);

function applyResolvedImageSlots(settings: SiteSettings, mediaSlots: PublicMediaSlotMap) {
  return {
    ...settings,
    hero: {
      ...settings.hero,
      backgroundImage:
        mediaSlots["hero.default.background"] || settings.hero.backgroundImage,
    },
    geo: {
      ...settings.geo,
      us: {
        ...settings.geo.us,
        hero: {
          ...settings.geo.us.hero,
          backgroundImage:
            mediaSlots["hero.us.background"] || settings.geo.us.hero.backgroundImage,
        },
      },
      ca: {
        ...settings.geo.ca,
        hero: {
          ...settings.geo.ca.hero,
          backgroundImage:
            mediaSlots["hero.ca.background"] || settings.geo.ca.hero.backgroundImage,
        },
      },
      eu: {
        ...settings.geo.eu,
        hero: {
          ...settings.geo.eu.hero,
          backgroundImage:
            mediaSlots["hero.eu.background"] || settings.geo.eu.hero.backgroundImage,
        },
      },
    },
    seo: {
      ...settings.seo,
      ogImage: mediaSlots["seo.default.og"] || settings.seo.ogImage,
    },
  };
}

const loadPublicSiteSettings = unstable_cache(
  async () => {
    const baseSettings = !db
      ? structuredClone(defaultSiteSettings)
      : mergeSiteSettings(
          (
            await db.query.siteSettings.findFirst({
              where: eq(siteSettings.siteKey, DEFAULT_SITE_KEY),
            })
          )?.settings,
        );

    const mediaSlots = await loadPublicMediaSlots();
    return applyResolvedImageSlots(baseSettings, mediaSlots);
  },
  ["public-site-settings"],
  { revalidate: 3600, tags: [SITE_SETTINGS_CACHE_TAG, MEDIA_SLOTS_CACHE_TAG] },
);

export async function getPublicMediaSlots() {
  return loadPublicMediaSlots();
}

export async function getPublicSiteSettings() {
  return loadPublicSiteSettings();
}

export async function getEditableSiteSettings() {
  if (!db) {
    return structuredClone(defaultSiteSettings);
  }

  const row = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.siteKey, DEFAULT_SITE_KEY),
  });

  return mergeSiteSettings(row?.settings);
}

export async function ensureSiteSettings() {
  const database = requireDatabase();
  const existing = await database.query.siteSettings.findFirst({
    where: eq(siteSettings.siteKey, DEFAULT_SITE_KEY),
  });

  if (existing) {
    return existing;
  }

  const settings = structuredClone(defaultSiteSettings);
  const [created] = await database
    .insert(siteSettings)
    .values({
      siteKey: DEFAULT_SITE_KEY,
      settings,
      seoScore: scoreSeoConfig(settings.seo).score,
    })
    .returning();

  safeRevalidateTag(SITE_SETTINGS_CACHE_TAG);

  return created;
}

export async function saveSiteSettings(
  nextSettings: SiteSettings,
  adminUserId?: string | null,
) {
  const database = requireDatabase();
  const settings = mergeSiteSettings(nextSettings);
  const seoScore = scoreSeoConfig(settings.seo).score;

  const [saved] = await database
    .insert(siteSettings)
    .values({
      siteKey: DEFAULT_SITE_KEY,
      settings,
      seoScore,
      updatedBy: adminUserId ?? null,
    })
    .onConflictDoUpdate({
      target: siteSettings.siteKey,
      set: {
        settings,
        seoScore,
        updatedBy: adminUserId ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();

  safeRevalidateTag(SITE_SETTINGS_CACHE_TAG);

  return mergeSiteSettings(saved.settings);
}
