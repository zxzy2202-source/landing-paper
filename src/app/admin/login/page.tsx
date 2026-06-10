import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentAdminSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getCurrentAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.16),_transparent_36%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-6 py-12">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_460px]">
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
            B2B 落地页后台
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-slate-950">
            为内容运营、SEO 控制与询盘跟进而搭建。
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            这个后台已经接入 Turso、Drizzle、动态元数据、图片槽位和多类型询盘管理，
            后续可以直接部署到 Vercel 进行托管。
          </p>
        </section>

        <LoginForm />
      </div>
    </main>
  );
}
