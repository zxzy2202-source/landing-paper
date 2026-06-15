"use client";

import { startTransition, useState } from "react";

import {
  MediaImagePicker,
  type MediaImageOption,
} from "@/components/admin/MediaImagePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { IndustryPageRecord } from "@/lib/services/product-overrides";

type Props = {
  initialItems: IndustryPageRecord[];
  mediaFiles: MediaImageOption[];
};

type FormProps = {
  feedback: string;
  mediaFiles: MediaImageOption[];
  onRemove: (id: string) => void;
  onSave: (formData: FormData) => void;
  selected: IndustryPageRecord;
};

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function IndustryEditorForm({
  feedback,
  mediaFiles,
  onRemove,
  onSave,
  selected,
}: FormProps) {
  const [heroImageUrl, setHeroImageUrl] = useState(selected.content.heroImageUrl ?? "");
  const [contentJson, setContentJson] = useState(formatJson(selected.content));

  function handleHeroImageChange(value: string) {
    setHeroImageUrl(value);
    setContentJson((current) => {
      try {
        const parsed = JSON.parse(current) as Record<string, unknown>;
        return formatJson({
          ...parsed,
          heroImageUrl: value,
        });
      } catch {
        return current;
      }
    });
  }

  return (
    <form
      action={(formData) => startTransition(() => void onSave(formData))}
      className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
          编辑器
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          {selected.id ? selected.title || "未命名行业页" : "新建行业页面"}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Slug 路径</label>
          <Input name="slug" defaultValue={selected.slug} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">页面标题</label>
          <Input name="title" defaultValue={selected.title} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">摘要说明</label>
        <Textarea name="summary" defaultValue={selected.summary ?? ""} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">SEO 标题</label>
          <Input name="seoTitle" defaultValue={selected.seoTitle ?? ""} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">SEO 描述</label>
          <Input
            name="seoDescription"
            defaultValue={selected.seoDescription ?? ""}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={selected.isPublished}
          className="h-4 w-4 rounded border-slate-300"
        />
        已发布
      </label>

      <MediaImagePicker
        files={mediaFiles}
        inputName="heroImageUrl"
        label="Hero 图片"
        description="这张图会直接用于前台行业页头图区域，同时会同步写入下方 JSON 的 heroImageUrl 字段。"
        previewAlt={selected.title || "行业页 Hero 图预览"}
        value={heroImageUrl}
        onChange={handleHeroImageChange}
        emptyLabel="不使用 Hero 图片"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">内容 JSON</label>
        <p className="text-sm text-slate-500">
          高级内容仍可直接在这里编辑，Hero 图片已经独立可视化管理。
        </p>
        <Textarea
          name="contentJson"
          value={contentJson}
          onChange={(event) => setContentJson(event.target.value)}
          className="min-h-[420px] font-mono text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="rounded-full px-6">
          保存行业页面
        </Button>
        {selected.id ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => startTransition(() => void onRemove(selected.id))}
          >
            删除
          </Button>
        ) : null}
        {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
      </div>
    </form>
  );
}

export function IndustryEditor({ initialItems, mediaFiles }: Props) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(initialItems[0]?.id ?? "");
  const [feedback, setFeedback] = useState("");

  const blankItem: IndustryPageRecord = {
    id: "",
    slug: "",
    title: "",
    summary: "",
    seoTitle: "",
    seoDescription: "",
    isPublished: false,
    content: {
      heroEyebrow: "行业落地页",
      heroImageUrl: "",
      heroTitle: "",
      heroDescription: "",
      challengeTitle: "",
      challenges: [],
      solutionTitle: "",
      solutions: [],
      capabilities: [],
      metrics: [],
      ctaHref: "#contact",
      ctaLabel: "立即咨询",
      faqs: [],
    },
  };

  const selected = selectedId
    ? items.find((item) => item.id === selectedId) ?? blankItem
    : blankItem;

  async function save(formData: FormData) {
    setFeedback("");

    let content;
    try {
      content = JSON.parse(String(formData.get("contentJson") ?? "{}"));
    } catch {
      setFeedback("内容 JSON 格式不正确。");
      return;
    }

    const resolvedHeroImageUrl = String(formData.get("heroImageUrl") ?? "").trim();

    const payload = {
      id: selected.id || undefined,
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      seoTitle: String(formData.get("seoTitle") ?? ""),
      seoDescription: String(formData.get("seoDescription") ?? ""),
      isPublished: formData.get("isPublished") === "on",
      content: {
        ...content,
        heroImageUrl: resolvedHeroImageUrl,
      },
    };

    const response = await fetch("/api/admin/industries", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as {
      error?: string;
      item?: IndustryPageRecord;
    };

    if (!response.ok || !result.item) {
      setFeedback("保存行业页面失败，请稍后重试。");
      return;
    }

    const nextItem = result.item;

    setItems((current) => {
      const exists = current.some((item) => item.id === nextItem.id);
      return exists
        ? current.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [nextItem, ...current];
    });
    setSelectedId(nextItem.id);
    setFeedback("行业页面已保存。");
  }

  async function remove(id: string) {
    const response = await fetch(`/api/admin/industries/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setFeedback("删除行业页面失败，请稍后重试。");
      return;
    }

    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
    setSelectedId(nextItems[0]?.id ?? "");
    setFeedback("行业页面已删除。");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              行业页面
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              动态路由数据源
            </h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedId("")}
          >
            新建
          </Button>
        </div>
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                selectedId === item.id
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <p className="font-medium text-slate-950">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                {item.slug}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <IndustryEditorForm
        key={selected.id || "new-industry"}
        selected={selected}
        mediaFiles={mediaFiles}
        onSave={save}
        onRemove={remove}
        feedback={feedback}
      />
    </div>
  );
}
