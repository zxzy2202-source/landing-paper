import { MarketingLandingPage } from "@/components/pages/MarketingLandingPage";
import { getPublicMediaSlots, getPublicSiteSettings } from "@/lib/services/site-settings";

export const revalidate = 3600;

export default async function Home() {
  const [settings, mediaSlots] = await Promise.all([
    getPublicSiteSettings(),
    getPublicMediaSlots(),
  ]);

  return (
    <MarketingLandingPage
      hero={settings.hero}
      contact={settings.contact}
      categories={settings.productCategories}
      mediaSlots={mediaSlots}
    />
  );
}
