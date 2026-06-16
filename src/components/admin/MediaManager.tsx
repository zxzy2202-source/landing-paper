"use client";

import { useDeferredValue, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getImageProcessingProfile } from "@/lib/imageSlots";
import { buildMediaProxyUrl } from "@/lib/media-url";

type MediaFileItem = {
  alt: string;
  category?: {
    name: string;
  } | null;
  createdAt?: Date | string | null;
  fileKey: string;
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
    fileKey?: string;
    id: string;
    mimeType?: string;
    url: string;
    webpThumbUrl?: string;
  } | null;
  mediaFileId: string | null;
  mediaKind?: "image" | "video";
  slotKey: string;
};

type StorageSummary = {
  bucketName: string | null;
  directUploadEnabled: boolean;
  libraryPathPattern: string;
  protocolLabel: string;
  providerLabel: string;
  publicBaseUrl: string | null;
  slotPathPattern: string;
};

type Props = {
  directUploadEnabled: boolean;
  files: MediaFileItem[];
  r2Configured: boolean;
  slots: SlotItem[];
  storage: StorageSummary;
};

type MediaFilter = "all" | "image" | "video";
type SlotFilter = "all" | "image" | "video" | "bound" | "unbound";
type AssetUsageFilter = "all" | "used" | "unused";
type AssetSort = "newest" | "oldest" | "largest" | "name";

const FALLBACK_UPLOAD_LIMIT = 4 * 1024 * 1024;

const TEXT = {
  altEmptyHint: "留空则不单独设置 Alt 文本。",
  altLabel: "Alt 文本",
  altPlaceholder: "输入前台展示时使用的替代文本",
  altSave: "保存 Alt",
  altSaveFail: "Alt 文本保存失败，请稍后重试。",
  altSaveSuccess: "Alt 文本已更新。",
  altSaving: "保存中...",
  copyLink: "复制链接",
  currentLink: "当前链接：",
  defaultImageFallback: "使用默认图片回退",
  defaultVideoFallback: "使用默认视频回退",
  deleteAction: "删除素材",
  deleteConfirm: "确认删除这个素材吗？删除后，已绑定的槽位会自动解绑。",
  deleteFail: "删除素材失败，请稍后重试。",
  deleteSuccess: "素材已删除。",
  deleting: "删除中...",
  directModeHint: "当前已启用 R2 直传，上传后服务端会自动压缩图片并生成 WebP 缩略图。",
  fallbackModeHint: "当前为服务端上传模式，建议单个文件控制在 4MB 以内。",
  fileLinkCopied: "文件链接已复制。",
  fileSortLargest: "按体积",
  fileSortName: "按名称",
  fileSortNewest: "最新上传",
  fileSortOldest: "最早上传",
  filterAll: "全部",
  filterImage: "图片",
  filterUnused: "未使用",
  filterUsed: "已使用",
  filterVideo: "视频",
  kindImage: "图片",
  kindImageSlot: "图片槽位",
  kindVideo: "视频",
  kindVideoSlot: "视频槽位",
  library: "媒体库",
  librarySubtitle: "统一管理图片与视频素材，可修改 Alt、查看使用槽位、复制链接或删除素材。",
  linkCopyFailed: "复制链接失败，请手动复制。",
  mediaUploadSuccess: "素材上传成功。",
  noAssets: "当前筛选条件下还没有素材。",
  noCategory: "未分类",
  noImageName: "未命名图片",
  noPreview: "暂无预览",
  noSetting: "未设置",
  noVideoName: "未命名视频",
  openInNewWindow: "新窗口打开",
  searchPlaceholder: "搜索名称、分类、格式、链接或已绑定槽位",
  slotBound: "已绑定",
  slotBinding: "槽位绑定",
  slotBindingFail: "更新槽位绑定失败，请稍后重试。",
  slotBindingSubtitle: "每个前台图片或视频槽位都可以单独上传、绑定、替换与定位。",
  slotBindingSuccess: "槽位绑定已更新。",
  slotFilterAll: "全部槽位",
  slotFilterBound: "已绑定",
  slotFilterUnbound: "未绑定",
  slotSearchPlaceholder: "搜索槽位名称、键名或描述",
  slotUnbound: "未绑定",
  slotUploadMissing: "请先选择要上传到当前槽位的文件。",
  slotUploadSuccess: " 上传并绑定成功。",
  statsAssets: "素材总数",
  statsImages: "图片数量",
  statsSlotsBound: "已绑定槽位",
  statsSlotsUnbound: "未绑定槽位",
  statsUsedAssets: "使用中素材",
  statsVideos: "视频数量",
  unknownAuto: "自动识别",
  usageSlots: "使用槽位",
  usedInCount: "已绑定槽位",
  unusedAsset: "未绑定到任何槽位",
  uploadAction: "上传素材",
  uploadFail: "上传失败，请稍后重试。",
  uploading: "上传中...",
  uploadSection: "上传资源",
  uploadSlotAction: "上传并绑定",
  uploadSubtitle: "支持常见图片与视频格式。图片上传后服务端会自动压缩、生成 WebP 缩略图并写入媒体库。",
  uploadTitle: "图片 / 视频素材上传",
  useLinkReplace: "使用链接替换",
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

function matchesQuery(file: MediaFileItem, query: string, boundSlots: SlotItem[]) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return true;
  }

  return [
    file.alt,
    file.category?.name,
    file.mimeType,
    file.url,
    file.fileKey,
    ...boundSlots.flatMap((slot) => [slot.label, slot.slotKey, slot.description]),
  ]
    .filter(Boolean)
    .some((item) => String(item).toLowerCase().includes(keyword));
}

function matchesSlotQuery(slot: SlotItem, query: string) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return true;
  }

  return [
    slot.label,
    slot.slotKey,
    slot.description,
    slot.category,
    slot.mediaFile?.alt,
    slot.mediaFile?.fileKey,
  ]
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

function getDisplayName(file: MediaFileItem, kind: "image" | "video") {
  return file.alt || file.category?.name || (kind === "video" ? TEXT.noVideoName : TEXT.noImageName);
}

function sortMediaFiles(items: MediaFileItem[], sort: AssetSort) {
  const sorted = [...items];

  sorted.sort((left, right) => {
    if (sort === "oldest") {
      return new Date(left.createdAt ?? 0).getTime() - new Date(right.createdAt ?? 0).getTime();
    }

    if (sort === "largest") {
      return right.size - left.size;
    }

    if (sort === "name") {
      const leftName = getDisplayName(left, getMediaKind(left));
      const rightName = getDisplayName(right, getMediaKind(right));
      return leftName.localeCompare(rightName, "zh-CN");
    }

    return new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime();
  });

  return sorted;
}

function formatCategoryLabel(value: string) {
  return value
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function buildSlotPathPreview(slotKey: string, mediaKind: SlotItem["mediaKind"]) {
  const baseName = slotKey
    .split(".")
    .map((segment) => segment.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-"))
    .filter(Boolean)
    .join("-");

  return `wp-content/uploads/YYYY/MM/${baseName}-{timestamp}${mediaKind === "video" ? ".mp4" : ".webp"}`;
}

function getSlotOutputSummary(slot: SlotItem) {
  if (slot.mediaKind === "video") {
    return {
      main: "原视频直传到 R2，并按槽位命名对象路径",
      secondary: "适合工厂预览、背景视频等播放型内容",
    };
  }

  const profile = getImageProcessingProfile(slot.slotKey);

  if (!profile) {
    return {
      main: "图片上传后自动转为 WebP，并生成缩略图",
      secondary: "未配置专属尺寸时按通用图片策略处理",
    };
  }

  if (profile.mode === "original") {
    return {
      main: "保留原图尺寸与原始文件大小，不做自动压缩",
      secondary: "仍按槽位命名对象路径，但不会转 WebP 或缩放尺寸",
    };
  }

  return {
    main: `主图输出 ${profile.width} x ${profile.height} · ${profile.fit === "cover" ? "cover" : "inside"} · WebP`,
    secondary: `缩略图 ${profile.thumbWidth ?? "-"} x ${profile.thumbHeight ?? "-"} · 质量 ${profile.quality ?? "-"}`,
  };
}

export function MediaManager({
  directUploadEnabled,
  files: initialFiles,
  r2Configured,
  slots: initialSlots,
  storage,
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
  const [uploadingSlotKey, setUploadingSlotKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [query, setQuery] = useState("");
  const [slotQuery, setSlotQuery] = useState("");
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [slotFilter, setSlotFilter] = useState<SlotFilter>("all");
  const [assetUsageFilter, setAssetUsageFilter] = useState<AssetUsageFilter>("all");
  const [assetSort, setAssetSort] = useState<AssetSort>("newest");
  const [activeSlotKey, setActiveSlotKey] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const slotFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const slotCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const uploadSectionRef = useRef<HTMLElement | null>(null);
  const slotSectionRef = useRef<HTMLElement | null>(null);
  const librarySectionRef = useRef<HTMLElement | null>(null);
  const deferredQuery = useDeferredValue(query);
  const deferredSlotQuery = useDeferredValue(slotQuery);

  const slotUsageMap = slots.reduce<Record<string, SlotItem[]>>((accumulator, slot) => {
    if (!slot.mediaFileId) {
      return accumulator;
    }

    if (!accumulator[slot.mediaFileId]) {
      accumulator[slot.mediaFileId] = [];
    }

    accumulator[slot.mediaFileId].push(slot);
    return accumulator;
  }, {});

  const filteredFiles = sortMediaFiles(
    files.filter((file) => {
      const kind = getMediaKind(file);
      const boundSlots = slotUsageMap[file.id] ?? [];
      const kindMatch = filter === "all" || kind === filter;
      const usageMatch =
        assetUsageFilter === "all"
          ? true
          : assetUsageFilter === "used"
            ? boundSlots.length > 0
            : boundSlots.length === 0;

      return kindMatch && usageMatch && matchesQuery(file, deferredQuery, boundSlots);
    }),
    assetSort,
  );

  const filteredSlots = slots.filter((slot) => {
    const acceptedKind = slot.mediaKind ?? "image";
    const typeMatch =
      slotFilter === "all" ||
      (slotFilter === "image" && acceptedKind === "image") ||
      (slotFilter === "video" && acceptedKind === "video");
    const bindingMatch =
      slotFilter === "bound"
        ? Boolean(slot.mediaFileId)
        : slotFilter === "unbound"
          ? !slot.mediaFileId
          : true;

    return typeMatch && bindingMatch && matchesSlotQuery(slot, deferredSlotQuery);
  });

  const imageCount = files.filter((file) => getMediaKind(file) === "image").length;
  const videoCount = files.length - imageCount;
  const usedAssetCount = files.filter((file) => Boolean(slotUsageMap[file.id]?.length)).length;
  const boundSlotCount = slots.filter((slot) => Boolean(slot.mediaFileId)).length;
  const unboundSlotCount = slots.length - boundSlotCount;
  const slotGroups = filteredSlots.reduce<Record<string, SlotItem[]>>((accumulator, slot) => {
    if (!accumulator[slot.category]) {
      accumulator[slot.category] = [];
    }

    accumulator[slot.category].push(slot);
    return accumulator;
  }, {});
  const slotGroupKeys = Object.keys(slotGroups).sort((left, right) => left.localeCompare(right));
  const uploadModeHint = directUploadEnabled
    ? TEXT.directModeHint
    : r2Configured
      ? "当前通过服务端写入 Cloudflare R2，可绕过浏览器跨域限制；图片仍会自动压缩并生成 WebP 缩略图。"
      : TEXT.fallbackModeHint;
  const uploadModeLabel = directUploadEnabled
    ? "浏览器直传 R2 + 服务端后处理"
    : r2Configured
      ? "服务端写入 R2"
      : "服务端中转上传";

  function focusSlot(slot: SlotItem) {
    setSlotQuery(slot.slotKey);
    setSlotFilter(slot.mediaKind === "video" ? "video" : "image");
    setActiveSlotKey(slot.slotKey);

    window.requestAnimationFrame(() => {
      slotCardRefs.current[slot.slotKey]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  function scrollToSection(ref: React.RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

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

  async function uploadSlotViaServer(slot: SlotItem, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/admin/slots/${encodeURIComponent(slot.slotKey)}/upload`, {
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
      if (!directUploadEnabled && !r2Configured && file.size > FALLBACK_UPLOAD_LIMIT) {
        throw new Error("当前未启用 R2 直传，大于 4MB 的文件可能会被平台拦截，请先完成 R2 配置。");
      }

      const result = directUploadEnabled
        ? await uploadDirectly(file, formData)
        : await uploadViaServer(formData);

      setFiles((current) => [result, ...current.filter((item) => item.id !== result.id)]);
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
    const response = await fetch(`/api/admin/slots/${encodeURIComponent(slotKey)}`, {
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
    const defaultFallbackUrl = slots.find((slot) => slot.slotKey === slotKey)?.defaultFallbackUrl || "";
    const nextFallbackUrl =
      fallbackUrl !== undefined ? fallbackUrl || defaultFallbackUrl : undefined;

    updateSlotState(slotKey, {
      fallbackUrl: nextFallbackUrl,
      mediaFileId,
      mediaFile: nextMedia
        ? {
            alt: nextMedia.alt,
            fileKey: nextMedia.fileKey,
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

  async function uploadSlotMedia(slot: SlotItem, file: File) {
    setUploadingSlotKey(slot.slotKey);
    setFeedback("");

    try {
      let result: MediaFileItem & { error?: string };

      if (directUploadEnabled) {
        const createResponse = await fetch("/api/admin/media/direct-upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentType: file.type || "application/octet-stream",
            fileName: file.name,
            slotKey: slot.slotKey,
          }),
        });

        const createResult = (await createResponse.json()) as {
          error?: string;
          fileKey?: string;
          uploadUrl?: string;
          url?: string;
          webpThumbUrl?: string;
        };

        if (
          !createResponse.ok ||
          !createResult.uploadUrl ||
          !createResult.fileKey ||
          !createResult.url
        ) {
          throw new Error(createResult.error ?? TEXT.uploadFail);
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

        const registerResponse = await fetch("/api/admin/media/direct-upload", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentType: file.type || "application/octet-stream",
            fileKey: createResult.fileKey,
            height: 0,
            size: file.size,
            slotKey: slot.slotKey,
            url: createResult.url,
            webpThumbUrl: createResult.webpThumbUrl || createResult.url,
            width: 0,
          }),
        });

        result = (await registerResponse.json()) as MediaFileItem & { error?: string };

        if (!registerResponse.ok || result.error) {
          throw new Error(result.error ?? TEXT.uploadFail);
        }
      } else {
        result = await uploadSlotViaServer(slot, file);
      }

      setFiles((current) => [result, ...current.filter((item) => item.id !== result.id)]);
      setAltInputs((current) => ({
        ...current,
        [result.id]: result.alt || "",
      }));
      updateSlotState(slot.slotKey, {
        fallbackUrl: slot.fallbackUrl,
        mediaFileId: result.id,
        mediaFile: {
          alt: result.alt,
          fileKey: result.fileKey,
          id: result.id,
          mimeType: result.mimeType,
          url: result.url,
          webpThumbUrl: result.webpThumbUrl,
        },
      });

      if (slotFileInputRefs.current[slot.slotKey]) {
        slotFileInputRefs.current[slot.slotKey]!.value = "";
      }

      setFeedback(`${slot.label}${TEXT.slotUploadSuccess}`);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : TEXT.uploadFail);
    } finally {
      setUploadingSlotKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
              Storage + Library + Slot
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              图床走 Cloudflare R2，后台按“媒体库层 + 槽位层”分开管理
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              媒体库负责沉淀与复用图片、视频资产；槽位负责把资产投放到前台具体位置。这样既能复用素材，也能保证每个页面位置独立可控。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => scrollToSection(uploadSectionRef)}
            >
              前往媒体库上传
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => scrollToSection(slotSectionRef)}
            >
              前往槽位绑定
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => scrollToSection(librarySectionRef)}
            >
              浏览媒体库
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
              存储层
            </p>
            <p className="mt-3 text-lg font-semibold">{storage.providerLabel}</p>
            <p className="mt-2 text-sm text-slate-300">协议：{storage.protocolLabel}</p>
            <p className="mt-2 text-sm text-slate-300">
              上传模式：{uploadModeLabel}
            </p>
            <p className="mt-2 break-all text-sm text-slate-400">
              Bucket：{storage.bucketName || "未配置"}
            </p>
            <p className="mt-2 break-all text-xs text-slate-400">
              公网前缀：{storage.publicBaseUrl || "未配置"}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
              媒体库层
            </p>
            <p className="mt-3 text-lg font-semibold">统一沉淀图片与视频资产</p>
            <p className="mt-2 text-sm text-slate-300">
              上传到媒体库后，素材可以被多个前台槽位复用，也可以只作为备用资源保留。
            </p>
            <p className="mt-3 rounded-2xl bg-black/20 px-3 py-2 font-mono text-xs text-slate-300">
              {storage.libraryPathPattern}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
              槽位层
            </p>
            <p className="mt-3 text-lg font-semibold">每个前台位置独立绑定与替换</p>
            <p className="mt-2 text-sm text-slate-300">
              槽位上传会自动按槽位命名、自动绑定、自动生成对应 Alt 文本，避免前后台位置错乱。
            </p>
            <p className="mt-3 rounded-2xl bg-black/20 px-3 py-2 font-mono text-xs text-slate-300">
              {storage.slotPathPattern}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
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
          <p className="text-sm text-slate-500">{TEXT.statsUsedAssets}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{usedAssetCount}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{TEXT.statsSlotsBound}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{boundSlotCount}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{TEXT.statsSlotsUnbound}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{unboundSlotCount}</p>
        </div>
      </section>

      <section
        ref={uploadSectionRef}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              {TEXT.uploadSection}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{TEXT.uploadTitle}</h2>
            <p className="mt-2 text-sm text-slate-500">{TEXT.uploadSubtitle}</p>
            <p className="mt-2 text-xs text-slate-400">
              {uploadModeHint}
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
            placeholder="素材名称或 Alt 文本"
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

      <section
        ref={slotSectionRef}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              {TEXT.slotBinding}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {TEXT.slotBindingSubtitle}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              这里管理的是前台展示位置，不是素材本身。一个素材可复用到多个槽位，一个槽位也可以单独上传专属资源。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Input
              value={slotQuery}
              onChange={(event) => setSlotQuery(event.target.value)}
              placeholder={TEXT.slotSearchPlaceholder}
              className="h-11 w-[260px]"
            />
            <div className="flex flex-wrap rounded-full border border-slate-200 p-1">
              {[
                { key: "all", label: TEXT.slotFilterAll },
                { key: "image", label: TEXT.filterImage },
                { key: "video", label: TEXT.filterVideo },
                { key: "bound", label: TEXT.slotFilterBound },
                { key: "unbound", label: TEXT.slotFilterUnbound },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSlotFilter(item.key as SlotFilter)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    slotFilter === item.key
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

        <div className="mt-6 flex flex-wrap gap-2">
          {slotGroupKeys.map((categoryKey) => {
            const groupSlots = slotGroups[categoryKey] ?? [];
            const groupBoundCount = groupSlots.filter((slot) => Boolean(slot.mediaFileId)).length;

            return (
              <button
                key={categoryKey}
                type="button"
                onClick={() => setSlotQuery(categoryKey)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                {formatCategoryLabel(categoryKey)} · {groupSlots.length} / 已绑定 {groupBoundCount}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-6">
          {filteredSlots.length ? (
            slotGroupKeys.map((categoryKey) => {
              const categorySlots = slotGroups[categoryKey] ?? [];

              return (
                <div key={categoryKey} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {formatCategoryLabel(categoryKey)}
                    </h3>
                    <p className="text-sm text-slate-500">
                      当前分类共 {categorySlots.length} 个槽位，其中已绑定 {categorySlots.filter((slot) => Boolean(slot.mediaFileId)).length} 个
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {categorySlots.map((slot) => {
                      const acceptedKind = slot.mediaKind ?? "image";
                      const previewUrl =
                        acceptedKind === "video"
                          ? slot.mediaFile?.url || slot.fallbackUrl
                          : slot.mediaFile?.webpThumbUrl || slot.mediaFile?.url || slot.fallbackUrl;
                      const previewIsVideo =
                        acceptedKind === "video" &&
                        isVideoLikeUrl(slot.mediaFile?.url || slot.fallbackUrl);
                      const isBound = Boolean(slot.mediaFileId);
                      const outputSummary = getSlotOutputSummary(slot);

                      return (
                        <div
                          key={slot.slotKey}
                          ref={(node) => {
                            slotCardRefs.current[slot.slotKey] = node;
                          }}
                          className={`rounded-[2rem] border p-5 transition ${
                            activeSlotKey === slot.slotKey
                              ? "border-blue-400 bg-blue-50 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <div className="flex gap-4">
                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-slate-200">
                              {previewIsVideo ? (
                                <video
                                  src={previewUrl}
                                  className="h-full w-full object-cover"
                                  muted
                                  playsInline
                                />
                              ) : previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt={slot.label}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xs text-slate-500">{TEXT.noPreview}</span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-slate-950">{slot.label}</p>
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                    isBound
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-slate-200 text-slate-600"
                                  }`}
                                >
                                  {isBound ? TEXT.slotBound : TEXT.slotUnbound}
                                </span>
                              </div>
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
                              {slot.mediaFile?.alt ? (
                                <p className="mt-2 text-xs text-slate-400">Alt：{slot.mediaFile.alt}</p>
                              ) : null}
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full"
                                  onClick={() => void copyLink(slot.mediaFile?.url ?? slot.fallbackUrl)}
                                >
                                  {TEXT.copyLink}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                推荐输出
                              </p>
                              <p className="mt-2 text-sm text-slate-700">{outputSummary.main}</p>
                              <p className="mt-1 text-xs text-slate-400">{outputSummary.secondary}</p>
                              <p className="mt-2 text-xs text-blue-600">
                                建议优先上传并绑定媒体库素材，避免外链图片绕过压缩与缓存。
                              </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                R2 对象路径
                              </p>
                              <p className="mt-2 break-all font-mono text-xs text-slate-700">
                                {slot.mediaFile?.fileKey || buildSlotPathPreview(slot.slotKey, acceptedKind)}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {isBound ? "当前已绑定媒体库素材" : "当前使用回退链接或默认资源"}
                              </p>
                            </div>
                          </div>

                          <select
                            value={slot.mediaFileId ?? ""}
                            onChange={(event) => void bindSlot(slot.slotKey, event.target.value || null)}
                            className="mt-4 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/50"
                          >
                            <option value="">
                              {acceptedKind === "video" ? TEXT.defaultVideoFallback : TEXT.defaultImageFallback}
                            </option>
                            {files
                              .filter((file) => getMediaKind(file) === acceptedKind)
                              .map((file) => {
                                const label = getDisplayName(file, acceptedKind);
                                const meta =
                                  acceptedKind === "video"
                                    ? formatFileSize(file.size)
                                    : `${file.width} x ${file.height}`;

                                return (
                                  <option key={file.id} value={file.id}>
                                    {`${label} (${meta})`}
                                  </option>
                                );
                              })}
                          </select>

                          <div className="mt-4 space-y-3">
                            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                              <Input
                                ref={(node) => {
                                  slotFileInputRefs.current[slot.slotKey] = node;
                                }}
                                type="file"
                                accept={acceptedKind === "video" ? "video/*" : "image/*"}
                                className="h-11"
                              />
                              <Button
                                type="button"
                                className="h-11 rounded-full px-5"
                                disabled={uploadingSlotKey === slot.slotKey}
                                onClick={() => {
                                  const file = slotFileInputRefs.current[slot.slotKey]?.files?.[0];

                                  if (!file) {
                                    setFeedback(TEXT.slotUploadMissing);
                                    return;
                                  }

                                  void uploadSlotMedia(slot, file);
                                }}
                              >
                                {uploadingSlotKey === slot.slotKey ? TEXT.uploading : TEXT.uploadSlotAction}
                              </Button>
                            </div>

                            <p className="text-xs text-slate-400">
                              上传到该槽位后，会自动绑定、按槽位命名对象路径，并根据槽位生成对应的 Alt 文本。
                            </p>

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
                                  ? "粘贴视频链接后，可直接替换当前视频槽位"
                                  : "粘贴图片链接后，可直接替换当前图片槽位"
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
                                {TEXT.useLinkReplace}
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
                </div>
              );
            })
          ) : (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              当前筛选条件下还没有槽位。
            </div>
          )}
        </div>
      </section>

      <section
        ref={librarySectionRef}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              {TEXT.library}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {TEXT.librarySubtitle}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              媒体库层是资产池，不直接等同于某个前台位置。素材可以保持未绑定状态，等到需要时再分配给槽位。
            </p>
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
                  onClick={() => setFilter(item.key as MediaFilter)}
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
            <div className="flex rounded-full border border-slate-200 p-1">
              {[
                { key: "all", label: TEXT.filterAll },
                { key: "used", label: TEXT.filterUsed },
                { key: "unused", label: TEXT.filterUnused },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setAssetUsageFilter(item.key as AssetUsageFilter)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    assetUsageFilter === item.key
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <select
              value={assetSort}
              onChange={(event) => setAssetSort(event.target.value as AssetSort)}
              className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value="newest">{TEXT.fileSortNewest}</option>
              <option value="oldest">{TEXT.fileSortOldest}</option>
              <option value="largest">{TEXT.fileSortLargest}</option>
              <option value="name">{TEXT.fileSortName}</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredFiles.length ? (
            filteredFiles.map((file) => {
              const kind = getMediaKind(file);
              const boundSlots = slotUsageMap[file.id] ?? [];
              const isUsed = boundSlots.length > 0;

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
                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                        isUsed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-white/90 text-slate-600"
                      }`}
                    >
                      {isUsed ? `${TEXT.usedInCount} ${boundSlots.length}` : TEXT.unusedAsset}
                    </span>
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <p className="font-medium text-slate-950">{getDisplayName(file, kind)}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {file.category?.name || TEXT.noCategory}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {TEXT.usageSlots}
                      </p>
                      {boundSlots.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {boundSlots.map((slot) => (
                            <button
                              key={`${file.id}-${slot.slotKey}`}
                              type="button"
                              onClick={() => focusSlot(slot)}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-200"
                              title={slot.slotKey}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-slate-500">{TEXT.unusedAsset}</p>
                      )}
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

                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        对象信息
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
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
                      <p className="mt-3 break-all font-mono text-xs text-slate-400">{file.fileKey}</p>
                      <p className="mt-2 break-all text-xs text-slate-400">{file.url}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => void copyLink(file.url)}
                      >
                        {TEXT.copyLink}
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
