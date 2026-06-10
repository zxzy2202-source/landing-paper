import { InquiriesBoard } from "@/components/admin/InquiriesBoard";
import { listInquiries } from "@/lib/services/inquiries";

export default async function AdminInquiriesPage() {
  const inquiries = await listInquiries();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
          询盘中心
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
          联系 / 报价 / 样品统一处理流
        </h2>
      </section>

      <InquiriesBoard
        contact={inquiries.contact}
        quote={inquiries.quote}
        sample={inquiries.sample}
      />
    </div>
  );
}
