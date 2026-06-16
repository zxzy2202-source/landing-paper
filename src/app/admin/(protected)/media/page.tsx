import { MediaManager } from "@/components/admin/MediaManager";
import { env, hasR2Config } from "@/lib/env";
import { listMediaLibrary } from "@/lib/services/media";

export default async function AdminMediaPage() {
  const media = await listMediaLibrary();
  const r2Enabled = hasR2Config();
  const browserDirectUploadEnabled = false;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
          Media Architecture
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
          Cloudflare R2 图床、媒体库与前台槽位统一管理
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          后台已按两层抽象组织：媒体库负责沉淀图片和视频资产，槽位负责把资产投放到前台具体位置。
          启用 R2 后改为由服务端写入 Cloudflare R2，避免浏览器直传时的跨域失败；图片仍会自动压缩并生成 WebP 缩略图。
        </p>
      </section>

      <MediaManager
        directUploadEnabled={browserDirectUploadEnabled}
        files={media.files}
        r2Configured={r2Enabled}
        slots={media.slots}
        storage={{
          bucketName: r2Enabled ? env.R2_BUCKET ?? null : null,
          directUploadEnabled: browserDirectUploadEnabled,
          libraryPathPattern: "wp-content/uploads/YYYY/MM/library-{timestamp}-{name}.webp|mp4",
          protocolLabel: r2Enabled ? "S3 Compatible API" : "Server Upload Fallback",
          providerLabel: r2Enabled ? "Cloudflare R2" : "Local Public Storage",
          publicBaseUrl: r2Enabled ? env.NEXT_PUBLIC_R2_URL ?? null : null,
          slotPathPattern: "wp-content/uploads/YYYY/MM/{slot-key}-{timestamp}.webp|mp4",
        }}
      />
    </div>
  );
}
