import Link from "next/link";

import { LogoutButton } from "@/components/admin/LogoutButton";
import type { AdminUser } from "@/lib/db/schema";

type Props = {
  admin: AdminUser;
  children: React.ReactNode;
};

const navItems = [
  { href: "/admin", label: "总览" },
  { href: "/admin/settings", label: "站点设置" },
  { href: "/admin/inquiries", label: "询盘中心" },
  { href: "/admin/industries", label: "行业页面" },
  { href: "/admin/media", label: "媒体资源" },
];

const frontendLinks = [
  { href: "/", label: "打开首页" },
  { href: "/us", label: "打开美国站" },
  { href: "/ca", label: "打开加拿大站" },
  { href: "/eu", label: "打开欧洲站" },
];

export function AdminShell({ admin, children }: Props) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              后台管理
            </p>
            <h1 className="text-xl font-semibold text-slate-950">
              Zhixinpaper 中文后台
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-slate-950">{admin.name}</p>
              <p className="text-xs text-slate-500">
                {admin.email} / {admin.role}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white/75 p-4 shadow-sm">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="px-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              前台预览
            </p>
            <div className="mt-2 space-y-2">
              {frontendLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
