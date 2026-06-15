import { getAdminSummary } from "@/lib/services/admin-users";
import { getInquirySummary } from "@/lib/services/inquiries";
import { getEditableSiteSettings } from "@/lib/services/site-settings";

export default async function AdminOverviewPage() {
  const [adminSummary, inquirySummary, settings] = await Promise.all([
    getAdminSummary(),
    getInquirySummary(),
    getEditableSiteSettings(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
          后台总览
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
          内容运营后台已就绪
        </h2>
        <p className="mt-4 max-w-3xl text-slate-600">
          当前 Next.js 项目已经接入 Turso + Drizzle 数据结构、JWT 管理员鉴权、
          SEO 驱动的站点设置，以及询盘处理工作流。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">管理员数量</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {adminSummary.totalAdmins}
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">联系询盘</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {inquirySummary.contact}
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">报价需求</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {inquirySummary.quote}
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">样品申请</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {inquirySummary.sample}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-950">最近管理员</h3>
          <div className="mt-5 space-y-3">
            {adminSummary.latestAdmins.length ? (
              adminSummary.latestAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="font-medium text-slate-950">{admin.name}</p>
                  <p className="text-sm text-slate-500">{admin.email}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">
                完成 Turso 配置后，可运行 `pnpm admin:create` 创建第一个管理员账号。
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
            当前 SEO
          </p>
          <h3 className="mt-3 text-xl font-semibold">{settings.seo.title}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            {settings.seo.description}
          </p>
        </div>
      </section>
    </div>
  );
}
