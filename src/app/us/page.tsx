import type { Metadata } from "next";

import { MarketingLandingPage } from "@/components/pages/MarketingLandingPage";
import { buildMetadataFromSeo } from "@/lib/seo";
import { getPublicMediaSlots, getPublicSiteSettings } from "@/lib/services/site-settings";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();

  return buildMetadataFromSeo(
    {
      ...settings.seo,
      title: settings.geo.us.seoTitle,
      description: settings.geo.us.seoDescription,
      ogImage: settings.seo.ogImage,
    },
    settings.geo.us.path,
  );
}

export default async function UsLandingPage() {
  const [settings, mediaSlots] = await Promise.all([
    getPublicSiteSettings(),
    getPublicMediaSlots(),
  ]);

  return (
    <MarketingLandingPage
      hero={settings.geo.us.hero}
      contact={settings.contact}
      categories={settings.productCategories}
      mediaSlots={mediaSlots}
    />
  );
}
