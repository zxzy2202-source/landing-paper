import { IndustryEditor } from "@/components/admin/IndustryEditor";
import { listMediaLibrary } from "@/lib/services/media";
import { listEditableIndustryPages } from "@/lib/services/product-overrides";

export default async function AdminIndustriesPage() {
  const [{ files }, items] = await Promise.all([
    listMediaLibrary(),
    listEditableIndustryPages(),
  ]);
  const imageFiles = files.filter((file) => file.mimeType.startsWith("image/"));

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
          行业页面
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
          动态行业落地页管理
        </h2>
      </section>

      <IndustryEditor initialItems={items} mediaFiles={imageFiles} />
    </div>
  );
}
