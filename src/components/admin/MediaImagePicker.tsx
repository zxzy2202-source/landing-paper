"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildMediaProxyUrl } from "@/lib/media-url";

export type MediaImageOption = {
  alt: string;
  category?: {
    name: string;
  } | null;
  height: number;
  id: string;
  mimeType: string;
  url: string;
  webpThumbUrl: string;
  width: number;
};

type Props = {
  description?: string;
  emptyLabel?: string;
  files: MediaImageOption[];
  inputName: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  previewAlt: string;
  value: string;
};

function getFileLabel(file: MediaImageOption) {
  return file.alt || file.category?.name || "未命名图片";
}

export function MediaImagePicker({
  description,
  emptyLabel = "不使用媒体库图片",
  files,
  inputName,
  label,
  onChange,
  placeholder = "优先从下方媒体库选择，不建议直接粘贴外链图片",
  previewAlt,
  recommendedHint,
  value,
}: Props) {

  const currentFile = files.find((file) => file.url === value) ?? null;
  const selectValue = currentFile ? currentFile.url : "";

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700">{label}</label>
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
            {recommendedHint ? (
              <p className="mt-1 text-xs font-medium text-blue-600">建议规格：{recommendedHint}</p>
            ) : null}
            <p className="mt-1 text-xs text-amber-600">
              正式上线资源建议只使用媒体库素材，避免外链大图绕过压缩与缓存策略。
            </p>
          </div>

        {value ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => onChange("")}
          >
            清空
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
          {value ? (
            <img
              src={buildMediaProxyUrl(currentFile?.webpThumbUrl || currentFile?.url || value, 480)}
              alt={previewAlt}
              className="h-44 w-full object-cover"
            />
          ) : (
            <div className="flex h-44 items-center justify-center px-4 text-center text-sm text-slate-400">
              暂未设置图片
            </div>
          )}
          <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
            {currentFile ? getFileLabel(currentFile) : value || "未选择"}
          </div>
        </div>

        <div className="space-y-3">
          <Input
            name={inputName}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
          />

          <select
            value={selectValue}
            onChange={(event) => onChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            <option value="">{emptyLabel}</option>
            {files.map((file) => (
              <option key={file.id} value={file.url}>
                {`${getFileLabel(file)} (${file.width} x ${file.height})`}
              </option>
            ))}
          </select>

          <div className="grid max-h-72 gap-3 overflow-y-auto pr-1 md:grid-cols-2 2xl:grid-cols-3">
            {files.map((file) => {
              const active = file.url === value;

              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => onChange(file.url)}
                  className={`overflow-hidden rounded-[1.25rem] border text-left transition ${
                    active
                      ? "border-blue-400 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <img
                    src={file.webpThumbUrl || file.url}
                    alt={getFileLabel(file)}
                    className="h-28 w-full object-cover"
                  />
                  <div className="space-y-1 px-3 py-3">
                    <p className="line-clamp-1 text-sm font-medium text-slate-900">
                      {getFileLabel(file)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {file.category?.name || "未分类"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
  </div>
    </div>
  );
}
