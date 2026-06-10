"use client";

import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MediaFileItem = {
  alt: string;
  category?: {
    name: string;
  } | null;
  createdAt?: Date | string | null;
  height: number;
  id: string;
  mimeType: string;
  size: number;
  url: string;
  webpThumbUrl: string;
  width: number;
};

type SlotItem = {
  category: string;
  defaultFallbackUrl?: string;
  description?: string | null;
  fallbackUrl: string;
  label: string;
  mediaFile: {
    alt?: string;
    id: string;
    mimeType?: string;
    url: string;
    webpThumbUrl?: string;
  } | null;
  mediaFileId: string | null;
  mediaKind?: "image" | "video";
  slotKey: string;
};

type Props = {
  files: MediaFileItem[];
  slots: SlotItem[];
};

const TEXT = {
  altEmptyHint: "\u7559\u7a7a\u5219\u4e0d\u8bbe\u7f6e Alt \u6587\u672c",
  altLabel: "Alt \u6587\u672c",
  altPlaceholder: "\u8f93\u5165\u524d\u53f0\u56fe\u7247\u66ff\u4ee3\u6587\u5b57",
  altSave: "\u4fdd\u5b58 Alt",
  altSaveFail: "Alt \u6587\u672c\u4fdd\u5b58\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002",
  altSaveSuccess: "Alt \u6587\u672c\u5df2\u66f4\u65b0\u3002",
  altSaving: "\u4fdd\u5b58\u4e2d...",
  currentLink: "\u5f53\u524d\u94fe\u63a5\uff1a",
  defaultImageFallback: "\u4f7f\u7528\u9ed8\u8ba4\u56fe\u7247\u56de\u9000",
  defaultVideoFallback: "\u4f7f\u7528\u9ed8\u8ba4\u89c6\u9891\u56de\u9000",
  fileLinkCopied: "\u6587\u4ef6\u94fe\u63a5\u5df2\u590d\u5236\u3002",
  filterAll: "\u5168\u90e8",
  filterImage: "\u56fe\u7247",
  filterVideo: "\u89c6\u9891",
  kindImage: "\u56fe\u7247",
  kindImageSlot: "\u56fe\u7247\u69fd\u4f4d",
  kindVideo: "\u89c6\u9891",
  kindVideoSlot: "\u89c6\u9891\u69fd\u4f4d",
  library: "\u7d20\u6750\u5e93",
  librarySubtitle: "\u56fe\u7247\u4e0e\u89c6\u9891\u7edf\u4e00\u7ba1\u7406",
  linkCopyFailed: "\u590d\u5236\u94fe\u63a5\u5931\u8d25\uff0c\u8bf7\u624b\u52a8\u590d\u5236\u3002",
  manageSlots: "\u53ef\u7ba1\u7406\u69fd\u4f4d",
  mediaUploadSuccess: "\u5a92\u4f53\u6587\u4ef6\u4e0a\u4f20\u6210\u529f\u3002",
  noAssets: "\u5f53\u524d\u7b5b\u9009\u6761\u4ef6\u4e0b\u8fd8\u6ca1\u6709\u7d20\u6750\u3002",
  noCategory: "\u672a\u5206\u7c7b",
  noImageName: "\u672a\u547d\u540d\u56fe\u7247",
  noPreview: "\u65e0\u9884\u89c8",
  noSetting: "\u672a\u8bbe\u7f6e",
  noVideoName: "\u672a\u547d\u540d\u89c6\u9891",
  noAssetName: "\u672a\u547d\u540d\u7d20\u6750",
  openInNewWindow: "\u65b0\u7a97\u53e3\u67e5\u770b",
  searchPlaceholder: "\u641c\u7d22\u540d\u79f0\u3001\u5206\u7c7b\u3001\u683c\u5f0f\u6216\u94fe\u63a5",
  slotBinding: "\u69fd\u4f4d\u7ed1\u5b9a",
  slotBindingFail: "\u66f4\u65b0\u69fd\u4f4d\u7ed1\u5b9a\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002",
  slotBindingSubtitle: "\u524d\u53f0\u56fe\u7247 / \u89c6\u9891\u69fd\u4f4d\u6620\u5c04",
  slotBindingSuccess: "\u69fd\u4f4d\u7ed1\u5b9a\u5df2\u66f4\u65b0\u3002",
  statsAssets: "\u7d20\u6750\u603b\u6570",
  statsImages: "\u56fe\u7247\u6570\u91cf",
  statsVideos: "\u89c6\u9891\u6570\u91cf",
  unknownAuto: "\u81ea\u52a8\u8bc6\u522b",
  unnamedAsset: "\u672a\u547d\u540d\u7d20\u6750",
  uploadAction: "\u4e0a\u4f20\u7d20\u6750",
  uploadFail: "\u4e0a\u4f20\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002",
  uploading: "\u4e0a\u4f20\u4e2d...",
  uploadSection: "\u4e0a\u4f20\u8d44\u6e90",
  uploadSubtitle:
    "\u652f\u6301\u5e38\u89c1\u56fe\u7247\u4e0e\u89c6\u9891\u683c\u5f0f\uff0c\u4e0a\u4f20\u540e\u53ef\u76f4\u63a5\u7528\u4e8e\u524d\u53f0\u7d20\u6750\u66ff\u6362\u4e0e\u69fd\u4f4d\u7ed1\u5b9a\u3002",
  uploadTitle: "\u56fe\u7247 / \u89c6\u9891\u7d20\u6750\u4e0a\u4f20",
};

function getMediaKind(file: Pick<MediaFileItem, "mimeType">) {
  return file.mimeType.startsWith("video/") ? "video" : "image";
}

function isVideoLikeUrl(url?: string | null) {
  if (!url) {
    return false;
  }

  return /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(url);
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatMediaDate(value?: Date | string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("zh-CN");
}

function matchesQuery(file: MediaFileItem, query: string) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return true;
  }

  return [file.alt, file.category?.name, file.mimeType, file.url]
    .filter(Boolean)
    .some((item) => String(item).toLowerCase().includes(keyword));
}

export function MediaManager({ files: initialFiles, slots: initialSlots }: Props) {
  const [files, setFiles] = useState(initialFiles);
  const [slots, setSlots] = useState(initialSlots);
  const [altInputs, setAltInputs] = useState<Record<string, string>>(
    Object.fromEntries(initialFiles.map((file) => [file.id, file.alt || ""])),
  );
  const [slotUrlInputs, setSlotUrlInputs] = useState<Record<string, string>>(
    Object.fromEntries(initialSlots.map((slot) => [slot.slotKey, slot.fallbackUrl || ""])),
  );
  const [uploading, setUploading] = useState(false);
  const [savingAltId, setSavingAltId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  const filteredFiles = files.filter((file) => {
    const kind = getMediaKind(file);
    const kindMatch = filter === "all" || kind === filter;
    return kindMatch && matchesQuery(file, query);
  });

  const imageCount = files.filter((file) => getMediaKind(file) === "image").length;
  const videoCount = files.length - imageCount;

  async function upload(formData: FormData) {
    setUploading(true);
    setFeedback("");

    const response = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as MediaFileItem & { error?: string };
    setUploading(false);

    if (!response.ok || result.error) {
      setFeedback(result.error ?? TEXT.uploadFail);
      return;
    }

    setFiles((current) => [result, ...current]);
    setAltInputs((current) => ({
      ...current,
      [result.id]: result.alt || "",
    }));
    setFeedback(TEXT.mediaUploadSuccess);
  }

  function syncMediaAlt(fileId: string, alt: string) {
    setFiles((current) =>
      current.map((file) => (file.id === fileId ? { ...file, alt } : file)),
    );
    setSlots((current) =>
      current.map((slot) =>
        slot.mediaFile?.id === fileId
          ? {
              ...slot,
              mediaFile: {
                ...slot.mediaFile,
                alt,
              },
            }
          : slot,
      ),
    );
  }

  function updateSlotState(
    slotKey: string,
    next: {
      fallbackUrl?: string;
      mediaFile: SlotItem["mediaFile"];
      mediaFileId: string | null;
    },
  ) {
    setSlots((current) =>
      current.map((slot) =>
        slot.slotKey === slotKey
          ? {
              ...slot,
              fallbackUrl: next.fallbackUrl ?? slot.fallbackUrl,
              mediaFile: next.mediaFile,
              mediaFileId: next.mediaFileId,
            }
          : slot,
      ),
    );
  }

  async function bindSlot(
    slotKey: string,
    mediaFileId: string | null,
    fallbackUrl?: string | null,
  ) {
    const encodedSlotKey = encodeURIComponent(slotKey);
    const response = await fetch(`/api/admin/slots/${encodedSlotKey}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fallbackUrl, mediaFileId }),
    });

    if (!response.ok) {
      setFeedback(TEXT.slotBindingFail);
      return;
    }

    const nextMedia = files.find((file) => file.id === mediaFileId) ?? null;
    const nextFallbackUrl =
      fallbackUrl !== undefined
        ? fallbackUrl || slots.find((slot) => slot.slotKey === slotKey)?.defaultFallbackUrl || ""
        : undefined;

    updateSlotState(slotKey, {
      fallbackUrl: nextFallbackUrl,
      mediaFileId,
      mediaFile: nextMedia
        ? {
            alt: nextMedia.alt,
            id: nextMedia.id,
            mimeType: nextMedia.mimeType,
            url: nextMedia.url,
            webpThumbUrl: nextMedia.webpThumbUrl,
          }
        : null,
    });
    setFeedback(TEXT.slotBindingSuccess);
  }

  async function applyDirectUrl(slot: SlotItem) {
    const rawUrl = slotUrlInputs[slot.slotKey] ?? "";
    const nextUrl = rawUrl.trim();

    if (!nextUrl) {
      setFeedback("请先输入要替换的图片或视频链接。");
      return;
    }

    await bindSlot(slot.slotKey, null, nextUrl);
  }

  async function resetSlotToDefault(slot: SlotItem) {
    const nextFallbackUrl = slot.defaultFallbackUrl ?? slot.fallbackUrl;
    setSlotUrlInputs((current) => ({
      ...current,
      [slot.slotKey]: nextFallbackUrl,
    }));
    await bindSlot(slot.slotKey, null, nextFallbackUrl);
  }

  async function saveAlt(fileId: string) {
    setSavingAltId(fileId);
    setFeedback("");

    const response = await fetch(`/api/admin/media/${fileId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alt: (altInputs[fileId] ?? "").trim(),
      }),
    });

    const result = (await response.json()) as { alt?: string; error?: string };
    setSavingAltId(null);

    if (!response.ok || result.error) {
      setFeedback(result.error ?? TEXT.altSaveFail);
      return;
    }

    const nextAlt = result.alt ?? "";
    setAltInputs((current) => ({
      ...current,
      [fileId]: nextAlt,
    }));
    syncMediaAlt(fileId, nextAlt);
    setFeedback(TEXT.altSaveSuccess);
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setFeedback(TEXT.fileLinkCopied);
    } catch {
      setFeedback(TEXT.linkCopyFailed);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{TEXT.statsAssets}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{files.length}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{TEXT.statsImages}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{imageCount}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{TEXT.statsVideos}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{videoCount}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{TEXT.manageSlots}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{slots.length}</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              {TEXT.uploadSection}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {TEXT.uploadTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{TEXT.uploadSubtitle}</p>
          </div>
        </div>

        <form
          action={(formData) => startTransition(() => void upload(formData))}
          className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_auto]"
        >
          <Input
            name="file"
            type="file"
            accept="image/*,video/*"
            required
            className="h-11"
          />
          <Input
            name="alt"
            placeholder="\u7d20\u6750\u540d\u79f0 / Alt \u6587\u672c"
            className="h-11"
          />
          <Input
            name="categoryName"
            placeholder="\u7d20\u6750\u5206\u7c7b\uff0c\u4f8b\u5982\uff1a\u9996\u9875\u6a2a\u5e45"
            className="h-11"
          />
          <Button type="submit" disabled={uploading} className="h-11 rounded-full px-6">
            {uploading ? TEXT.uploading : TEXT.uploadAction}
          </Button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              {TEXT.slotBinding}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {TEXT.slotBindingSubtitle}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {slots.map((slot) => {
            const acceptedKind = slot.mediaKind ?? "image";
            const slotPreviewIsVideo =
              ((slot.mediaFile?.mimeType?.startsWith("video/") ?? false) ||
                acceptedKind === "video") &&
              isVideoLikeUrl(slot.mediaFile?.url || slot.fallbackUrl);
            const slotPreviewUrl =
              acceptedKind === "video"
                ? slot.mediaFile?.url || slot.fallbackUrl
                : slot.mediaFile?.webpThumbUrl || slot.mediaFile?.url || slot.fallbackUrl;

            return (
              <div
                key={slot.slotKey}
                className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-slate-200">
                    {slotPreviewIsVideo ? (
                      <video
                        src={slotPreviewUrl}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                    ) : slotPreviewUrl ? (
                      <img
                        src={slotPreviewUrl}
                        alt={slot.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">{TEXT.noPreview}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-950">{slot.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                      {slot.slotKey} /{" "}
                      {acceptedKind === "video" ? TEXT.kindVideoSlot : TEXT.kindImageSlot}
                    </p>
                    {slot.description ? (
                      <p className="mt-2 text-sm text-slate-500">{slot.description}</p>
                    ) : null}
                    <p className="mt-3 break-all text-sm text-slate-600">
                      {TEXT.currentLink}
                      {slot.mediaFile?.url ?? (slot.fallbackUrl || TEXT.noSetting)}
                    </p>
                  </div>
                </div>

                <select
                  value={slot.mediaFileId ?? ""}
                  onChange={(event) =>
                    startTransition(() =>
                      void bindSlot(slot.slotKey, event.target.value || null),
                    )
                  }
                  className="mt-4 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/50"
                >
                  <option value="">
                    {acceptedKind === "video"
                      ? TEXT.defaultVideoFallback
                      : TEXT.defaultImageFallback}
                  </option>
                    {files
                      .filter((file) => getMediaKind(file) === acceptedKind)
                      .map((file) => {
                      const label =
                        file.alt ||
                        file.category?.name ||
                        (acceptedKind === "video" ? TEXT.noVideoName : TEXT.noImageName);
                      const meta =
                        acceptedKind === "video"
                          ? formatFileSize(file.size)
                          : `${file.width}x${file.height}`;

                      return (
                        <option key={file.id} value={file.id}>
                          {`${label} (${meta})`}
                        </option>
                        );
                      })}
                </select>

                <div className="mt-4 space-y-3">
                  <Input
                    value={slotUrlInputs[slot.slotKey] ?? ""}
                    onChange={(event) =>
                      setSlotUrlInputs((current) => ({
                        ...current,
                        [slot.slotKey]: event.target.value,
                      }))
                    }
                    placeholder={
                      acceptedKind === "video"
                        ? "粘贴视频链接后可直接替换当前视频槽位"
                        : "粘贴图片链接后可直接替换当前图片槽位"
                    }
                    className="h-11"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() =>
                        startTransition(() => void applyDirectUrl(slot))
                      }
                    >
                      使用链接替换
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() =>
                        startTransition(() => void resetSlotToDefault(slot))
                      }
                    >
                      恢复默认
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              {TEXT.library}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {TEXT.librarySubtitle}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={TEXT.searchPlaceholder}
              className="h-11 w-[260px]"
            />
            <div className="flex rounded-full border border-slate-200 p-1">
              {[
                { key: "all", label: TEXT.filterAll },
                { key: "image", label: TEXT.filterImage },
                { key: "video", label: TEXT.filterVideo },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key as "all" | "image" | "video")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    filter === item.key
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredFiles.length ? (
            filteredFiles.map((file) => {
              const kind = getMediaKind(file);

              return (
                <article
                  key={file.id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50"
                >
                  <div className="relative h-56 bg-slate-200">
                    {kind === "video" ? (
                      <video
                        src={file.url}
                        controls
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={file.webpThumbUrl || file.url}
                        alt={file.alt || "\u5a92\u4f53\u9884\u89c8"}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                      {kind === "video" ? TEXT.kindVideo : TEXT.kindImage}
                    </span>
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <p className="font-medium text-slate-950">
                        {file.alt || file.category?.name || TEXT.noAssetName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {file.category?.name || TEXT.noCategory}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {TEXT.altLabel}
                      </label>
                      <Input
                        value={altInputs[file.id] ?? ""}
                        onChange={(event) =>
                          setAltInputs((current) => ({
                            ...current,
                            [file.id]: event.target.value,
                          }))
                        }
                        placeholder={TEXT.altPlaceholder}
                        className="mt-2 h-10"
                      />
                      <p className="mt-2 text-xs text-slate-400">{TEXT.altEmptyHint}</p>
                      <div className="mt-3 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full"
                          disabled={savingAltId === file.id}
                          onClick={() => startTransition(() => void saveAlt(file.id))}
                        >
                          {savingAltId === file.id ? TEXT.altSaving : TEXT.altSave}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                      <p>
                        {"\u683c\u5f0f\uff1a"}
                        {file.mimeType}
                      </p>
                      <p>
                        {"\u5927\u5c0f\uff1a"}
                        {formatFileSize(file.size)}
                      </p>
                      <p>
                        {"\u5c3a\u5bf8\uff1a"}
                        {file.width > 0 && file.height > 0
                          ? `${file.width} x ${file.height}`
                          : TEXT.unknownAuto}
                      </p>
                      <p>
                        {"\u4e0a\u4f20\uff1a"}
                        {formatMediaDate(file.createdAt)}
                      </p>
                    </div>

                    <p className="break-all text-xs text-slate-400">{file.url}</p>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => startTransition(() => void copyLink(file.url))}
                      >
                        {"\u590d\u5236\u94fe\u63a5"}
                      </Button>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center rounded-full border border-slate-200 px-4 text-sm text-slate-700 transition hover:bg-slate-100"
                      >
                        {TEXT.openInNewWindow}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              {TEXT.noAssets}
            </div>
          )}
        </div>
      </section>

      {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
    </div>
  );
}
