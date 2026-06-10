"use client";

import { scoreSeoConfig } from "@/lib/seo";
import type { SeoConfig } from "@/lib/siteSettingsTypes";

type Props = {
  seo: SeoConfig;
};

export function SeoEditor({ seo }: Props) {
  const result = scoreSeoConfig(seo);

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
            实时 SEO 评分
          </p>
          <h3 className="mt-2 text-2xl font-semibold">{result.score}/100</h3>
        </div>
        <div className="h-24 w-24 rounded-full border border-white/15 bg-white/5 p-2">
          <div className="flex h-full items-center justify-center rounded-full border border-white/10">
            <span className="text-2xl font-semibold">{result.score}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-slate-200">
        {result.suggestions.length ? (
          result.suggestions.map((item) => <p key={item}>- {item}</p>)
        ) : (
          <p>- SEO 标题、描述、关键词、规范链接和 OG 图片都处于健康范围。</p>
        )}
      </div>
    </div>
  );
}
