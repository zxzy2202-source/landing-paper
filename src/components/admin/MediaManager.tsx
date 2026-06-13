"use client";

import { useRef, useState } from "react";

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
  directUploadEnabled: boolean;
  files: MediaFileItem[];
  slots: SlotItem[];
};

const FALLBACK_UPLOAD_LIMIT = 4 * 1024 * 1024;

const TEXT = {
  altEmptyHint: "留空则不设置 Alt 文本",
  altLabel: "Alt 文本",
  altPlaceholder: "输入前台图片替代文字",
  altSave: "保存 Alt",
  altSaveFail: "Alt 文本保存失败，请稍后重试。",
  altSaveSuccess: "Alt 文本已更新。",
  altSaving: "保存中...",
  currentLink: "当前链接：",
  defaultImageFallback: "使用默认图片回退",
  defaultVideoFallback: "使用默认视频回退",
  deleteAction: "删除素材",
  deleteConfirm: "确认删除这个素材吗？删除后对应槽位会解绑。",
  deleteFail: "删除素材失败，请稍后重试。",
  deleteSuccess: "素材已删除。",
  deleting: "删除中...",
  fileLinkCopied: "文件链接已复制。",
  filterAll: "全部",
  filterImage: "图片",
  filterVideo: "视频",
  kindImage: "图片",
  kindImageSlot: "图片槽位",
  kindVideo: "视频",
  kindVideoSlot: "视频槽位",
  library: "素材库",
  librarySubtitle: "图片与视频统一管理",
  linkCopyFailed: "复制链接失败，请手动复制。",
  manageSlots: "可管理槽位",
  mediaUploadSuccess: "媒体文件上传成功。",
  noAssets: "当前筛选条件下还没有素材。",
  noCategory: "未分类",
  noImageName: "未命名图片",
  noPreview: "无预览",
  noSetting: "未设置",
  noVideoName: "未命名视频",
  noAssetName: "未命名素材",
  openInNewWindow: "新窗口查看",
  searchPlaceholder: "搜索名称、分类、格式或链接",
  slotBinding: "槽位绑定",
  slotBindingFail: "更新槽位绑定失败，请稍后重试。",
  slotBindingSubtitle: "前台图片 / 视频槽位映射",
  slotBindingSuccess: "槽位绑定已更新。",
  statsAssets: "素材总数",
  statsImages: "图片数量",
  statsVideos: "视频数量",
  unknownAuto: "自动识别",
  unnamedAsset: "未命名素材",
  uploadAction: "上传素材",
  uploadFail: "上传失败，请稍后重试。",
  uploading: "上传中...",
  uploadSection: "上传资源",
  uploadSubtitle:
    "支持常见图片与视频格式，上传后可直接用于前台素材替换与槽位绑定。",
  uploadTitle: "图片 / 视频素材上传",
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

async function readImageMeta(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const instance = new Image();
      instance.onload = () => resolve(instance);
      instance.onerror = () => reject(new Error("图片尺寸读取失败。"));
      instance.src = objectUrl;
    });

    return {
      height: image.naturalHeight || 0,
      width: image.naturalWidth || 0,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function MediaManager({
  directUploadEnabled,
  files: initialFiles,
  slots: initialSlots,
}: Props) {
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredFiles = files.filter((file) => {
    const kind = getMediaKind(file);
    const kindMatch = filter === "all" || kind === filter;
    return kindMatch && matchesQuery(file, query);
  });

  const imageCount = files.filter((file) => getMediaKind(file) === "image").length;
  const videoCount = files.length - imageCount;

  async function uploadViaServer(formData: FormData) {
    const response = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as MediaFileItem & { error?: string };

    if (!response.ok || result.error) {
      throw new Error(result.error ?? TEXT.uploadFail);
    }

    return result;
  }

  async function uploadDirectly(file: File, formData: FormData) {
    const createResponse = await fetch("/api/admin/media/direct-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType: file.type || "application/octet-stream",
        fileName: file.name,
      }),
    });

    const createResult = (await createResponse.json()) as {
      error?: string;
      fileKey?: string;
      uploadUrl?: string;
      url?: string;
      webpThumbUrl?: string;
    };

    if (!createResponse.ok || !createResult.uploadUrl || !createResult.fileKey || !createResult.url) {
      throw new Error(createResult.error ?? "创建上传地址失败。");
    }

    const uploadResponse = await fetch(createResult.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`文件上传到对象存储失败（${uploadResponse.status}）。`);
    }

    const imageMeta = file.type.startsWith("image/") ? await readImageMeta(file) : null;

    const registerResponse = await fetch("/api/admin/media/direct-upload", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alt: String(formData.get("alt") ?? ""),
        categoryName: String(formData.get("categoryName") ?? "通用素材"),
        categorySlug: String(formData.get("categorySlug") ?? "general"),
        contentType: file.type || "application/octet-stream",
        fileKey: createResult.fileKey,
        height: imageMeta?.height ?? 0,
        size: file.size,
        url: createResult.url,
        webpThumbUrl: createResult.webpThumbUrl || createResult.url,
        width: imageMeta?.width ?? 0,
      }),
    });

    const registerResult = (await registerResponse.json()) as MediaFileItem & { error?: string };

    if (!registerResponse.ok || registerResult.error) {
      throw new Error(registerResult.error ?? "素材登记失败。");
    }

    return registerResult;
  }

  async function handleUploadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setFeedback("请选择要上传的文件。");
      return;
    }

    setUploading(true);
    setFeedback("");

    try {
      if (!directUploadEnabled && file.size > FALLBACK_UPLOAD_LIMIT) {
        throw new Error("当前环境未启用直传，大于 4MB 的文件会被平台拦截，请先配置 R2。");
      }

      const result = directUploadEnabled
        ? await uploadDirectly(file, formData)
        : await uploadViaServer(formData);

      setFiles((current) => [result, ...current]);
      setAltInputs((current) => ({
        ...current,
        [result.id]: result.alt || "",
      }));
      formRef.current?.reset();
      setFeedback(TEXT.mediaUploadSuccess);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : TEXT.uploadFail);
    } finally {
      setUploading(false);
    }
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

  function removeMediaFromSlots(fileId: string) {
    setSlots((current) =>
      current.map((slot) =>
        slot.mediaFile?.id === fileId
          ? {
              ...slot,
              mediaFile: null,
              mediaFileId: null,
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

  async function removeMedia(fileId: string) {
    if (!window.confirm(TEXT.deleteConfirm)) {
      return;
    }

    setDeletingId(fileId);
    setFeedback("");

    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok || result.error) {
        throw new Error(result.error ?? TEXT.deleteFail);
      }

      setFiles((current) => current.filter((file) => file.id !== fileId));
      setAltInputs((current) => {
        const next = { ...current };
        delete next[fileId];
        return next;
      });
      removeMediaFromSlots(fileId);
      setFeedback(TEXT.deleteSuccess);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : TEXT.deleteFail);
    } finally {
      setDeletingId(null);
    }
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
            <p className="mt-2 text-xs text-slate-400">
              {directUploadEnabled
                ? "当前为 R2 直传模式，可稳定上传较大的图片与视频文件。"
                : "当前为本地上传模式，建议单个文件控制在 4MB 内。"}
            </p>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={(event) => void handleUploadSubmit(event)}
          className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_auto]"
        >
          <Input
            ref={fileInputRef}
            name="file"
            type="file"
            accept="image/*,video/*"
            required
            className="h-11"
          />
          <Input
            name="alt"
            placeholder="素材名称 / Alt 文本"
            className="h-11"
          />
          <Input
            name="categoryName"
            placeholder="素材分类，例如：首页横幅"
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
                  onChange={(event) => void bindSlot(slot.slotKey, event.target.value || null)}
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
                      onClick={() => void applyDirectUrl(slot)}
                    >
                      使用链接替换
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => void resetSlotToDefault(slot)}
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
                        alt={file.alt || "媒体预览"}
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
                      <div className="mt-3 flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full"
                          disabled={savingAltId === file.id}
                          onClick={() => void saveAlt(file.id)}
                        >
                          {savingAltId === file.id ? TEXT.altSaving : TEXT.altSave}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          className="rounded-full"
                          disabled={deletingId === file.id}
                          onClick={() => void removeMedia(file.id)}
                        >
                          {deletingId === file.id ? TEXT.deleting : TEXT.deleteAction}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                      <p>格式：{file.mimeType}</p>
                      <p>大小：{formatFileSize(file.size)}</p>
                      <p>
                        尺寸：
                        {file.width > 0 && file.height > 0
                          ? `${file.width} x ${file.height}`
                          : TEXT.unknownAuto}
                      </p>
                      <p>上传：{formatMediaDate(file.createdAt)}</p>
                    </div>

                    <p className="break-all text-xs text-slate-400">{file.url}</p>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => void copyLink(file.url)}
                      >
                        复制链接
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
