export const DEFAULT_HERO_IMAGE_WIDTHS = [360, 540, 768, 960, 1280, 1600] as const;
export const DEFAULT_SECTION_IMAGE_WIDTHS = [320, 480, 640, 768, 960, 1280] as const;
export const DEFAULT_CARD_IMAGE_WIDTHS = [180, 240, 320, 400, 480, 640] as const;
export const DEFAULT_LOGO_IMAGE_WIDTHS = [96, 128, 160, 240, 320] as const;

function isProxyMediaUrl(src: string) {
  return src.startsWith("/api/media?");
}

export function buildMediaProxyUrl(src: string, width?: number) {
  if (!src) {
    return "";
  }

  if (isProxyMediaUrl(src)) {
    const url = new URL(src, "https://local.accio");

    if (width) {
      url.searchParams.set("w", String(width));
    }

    return `${url.pathname}?${url.searchParams.toString()}`;
  }

  const params = new URLSearchParams({ src });

  if (width) {
    params.set("w", String(width));
  }

  return `/api/media?${params.toString()}`;
}

export function buildImageSrcSet(src: string, widths: readonly number[]) {
  if (!src) {
    return "";
  }

  return widths.map((width) => `${buildMediaProxyUrl(src, width)} ${width}w`).join(", ");
}
