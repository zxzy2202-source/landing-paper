import { SettingsForm } from "@/components/admin/SettingsForm";
import { getEditableSiteSettings } from "@/lib/services/site-settings";
import { listMediaLibrary } from "@/lib/services/media";

export default async function AdminSettingsPage() {
  const [settings, media] = await Promise.all([
    getEditableSiteSettings(),
    listMediaLibrary(),
  ]);

  return <SettingsForm initialSettings={settings} slots={media.slots} />;
}
