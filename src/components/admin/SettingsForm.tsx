"use client";

import { startTransition, useState } from "react";

import { SeoEditor } from "@/components/admin/SeoEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@/lib/siteSettingsTypes";

type SlotSummary = {
  category: string;
  fallbackUrl: string;
  label: string;
  mediaFile: {
    url: string;
  } | null;
  slotKey: string;
};

type Props = {
  initialSettings: SiteSettings;
  slots: SlotSummary[];
};

export function SettingsForm({ initialSettings, slots }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState(false);

  function setHeroField(key: keyof SiteSettings["hero"], value: string) {
    setSettings((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [key]: value,
      },
    }));
  }

  function setSeoField(key: keyof SiteSettings["seo"], value: string | string[]) {
    setSettings((current) => ({
      ...current,
      seo: {
        ...current.seo,
        [key]: value,
      },
    }));
  }

  function setGeoField(
    geo: keyof SiteSettings["geo"],
    key: keyof SiteSettings["geo"]["us"]["hero"],
    value: string,
  ) {
    setSettings((current) => ({
      ...current,
      geo: {
        ...current.geo,
        [geo]: {
          ...current.geo[geo],
          hero: {
            ...current.geo[geo].hero,
            [key]: value,
          },
        },
      },
    }));
  }

  function setContactField(key: keyof SiteSettings["contact"], value: string) {
    setSettings((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [key]: value,
      },
    }));
  }

  async function save() {
    setPending(true);
    setFeedback("");

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    setPending(false);

    if (!response.ok) {
      setFeedback("保存站点设置失败，请稍后重试。");
      return;
    }

    setFeedback("站点设置已保存。");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              首页首屏
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              首页文案与行动按钮
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="hero-eyebrow" className="text-sm font-medium text-slate-700">顶部短标签</label>
              <Input
                id="hero-eyebrow"
                value={settings.hero.eyebrow}
                onChange={(event) => setHeroField("eyebrow", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="hero-highlight" className="text-sm font-medium text-slate-700">高亮词</label>
              <Input
                id="hero-highlight"
                value={settings.hero.highlight}
                onChange={(event) => setHeroField("highlight", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="hero-title" className="text-sm font-medium text-slate-700">主标题</label>
            <Input
              id="hero-title"
              value={settings.hero.title}
              onChange={(event) => setHeroField("title", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="hero-description" className="text-sm font-medium text-slate-700">首屏描述</label>
            <Textarea
              id="hero-description"
              value={settings.hero.description}
              onChange={(event) => setHeroField("description", event.target.value)}
              className="min-h-32"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">主按钮文案</label>
              <Input
                value={settings.hero.primaryCtaLabel}
                onChange={(event) => setHeroField("primaryCtaLabel", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">主按钮链接</label>
              <Input
                value={settings.hero.primaryCtaHref}
                onChange={(event) => setHeroField("primaryCtaHref", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">次按钮文案</label>
              <Input
                value={settings.hero.secondaryCtaLabel}
                onChange={(event) => setHeroField("secondaryCtaLabel", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">次按钮链接</label>
              <Input
                value={settings.hero.secondaryCtaHref}
                onChange={(event) => setHeroField("secondaryCtaHref", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">首屏背景图链接</label>
            <Input
              value={settings.hero.backgroundImage}
              onChange={(event) => setHeroField("backgroundImage", event.target.value)}
            />
            <p className="text-xs text-slate-500">
              未绑定“hero.default.background”槽位时，前台将使用这里的链接。
            </p>
          </div>
        </section>

        <SeoEditor seo={settings.seo} />
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
            SEO 元信息
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            动态元数据来源
          </h2>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">SEO 标题</label>
            <Input
              value={settings.seo.title}
              onChange={(event) => setSeoField("title", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Meta 描述</label>
            <Textarea
              value={settings.seo.description}
              onChange={(event) => setSeoField("description", event.target.value)}
              className="min-h-28"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">规范链接 URL</label>
              <Input
                value={settings.seo.canonicalUrl}
                onChange={(event) => setSeoField("canonicalUrl", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">OG 图片链接</label>
              <Input
                value={settings.seo.ogImage}
                onChange={(event) => setSeoField("ogImage", event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">关键词</label>
            <Input
              value={settings.seo.keywords.join(", ")}
              onChange={(event) =>
                setSeoField(
                  "keywords",
                  event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                )
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
            联系信息
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            前台展示的联系方式
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">邮箱</label>
            <Input
              value={settings.contact.email}
              onChange={(event) => setContactField("email", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">电话</label>
            <Input
              value={settings.contact.phone}
              onChange={(event) => setContactField("phone", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">WhatsApp</label>
            <Input
              value={settings.contact.whatsapp}
              onChange={(event) => setContactField("whatsapp", event.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">地址</label>
            <Textarea
              value={settings.contact.address}
              onChange={(event) => setContactField("address", event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
            地区版本
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            美国 / 加拿大 / 欧洲首屏文案
          </h2>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {(["us", "ca", "eu"] as const).map((geo) => (
            <div key={geo} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-lg font-semibold uppercase text-slate-950">
                {geo === "us" ? "美国" : geo === "ca" ? "加拿大" : "欧洲"}
              </h3>
              <div className="mt-4 space-y-3">
                <Input
                  placeholder="地区标题"
                  value={settings.geo[geo].hero.title}
                  onChange={(event) => setGeoField(geo, "title", event.target.value)}
                />
                <Textarea
                  placeholder="地区描述"
                  value={settings.geo[geo].hero.description}
                  onChange={(event) => setGeoField(geo, "description", event.target.value)}
                  className="min-h-28"
                />
                <Input
                  placeholder="地区背景图链接"
                  value={settings.geo[geo].hero.backgroundImage}
                  onChange={(event) => setGeoField(geo, "backgroundImage", event.target.value)}
                />
                <p className="text-xs text-slate-500">
                  未绑定对应地区 hero 槽位时，前台将使用这里的链接。
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
            图片槽位
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            槽位绑定概览
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {slots.map((slot) => (
            <div key={slot.slotKey} className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-950">{slot.label}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                {slot.slotKey}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                当前图片：{slot.mediaFile?.url ?? slot.fallbackUrl}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                该槽位会直接影响前台对应位置显示。
              </p>
              <p className="mt-2 text-xs text-blue-600">
                建议优先通过槽位绑定媒体库素材，不要长期依赖回退外链。
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => void save())}
          className="h-11 rounded-full px-6"
        >
          {pending ? "保存中..." : "保存站点设置"}
        </Button>
        {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
      </div>
    </div>
  );
}
 "保存站点设置"}
        </Button>
        {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
      </div>
    </div>
  );
}
