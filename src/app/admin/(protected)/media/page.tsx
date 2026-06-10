import { MediaManager } from "@/components/admin/MediaManager";
import { listMediaLibrary } from "@/lib/services/media";

export default async function AdminMediaPage() {
  const media = await listMediaLibrary();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
          媒体资源
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
          图片、视频与图片槽位统一管理
        </h2>
      </section>

      <MediaManager files={media.files} slots={media.slots} />
    </div>
  );
}
