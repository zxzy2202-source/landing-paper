export type MediaSlotKind = "image" | "video";

export type ImageProcessingProfile = {
  fit?: "cover" | "inside";
  height: number;
  quality?: number;
  thumbHeight?: number;
  thumbWidth?: number;
  width: number;
};

export type ImageSlotDefinition = {
  category: string;
  description: string;
  fallbackUrl: string;
  label: string;
  mediaKind: MediaSlotKind;
  slotKey: string;
};

export const imageSlotRegistry: ImageSlotDefinition[] = [
  {
    slotKey: "brand.logo.primary",
    label: "站点主 Logo",
    category: "brand",
    mediaKind: "image",
    description: "导航栏与全站品牌识别使用的主 Logo。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/02.png",
  },
  {
    slotKey: "brand.logo.footer",
    label: "页脚 Logo",
    category: "brand",
    mediaKind: "image",
    description: "前台页脚区域使用的 Logo，可单独替换。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/02.png",
  },
  {
    slotKey: "hero.default.background",
    label: "首页首屏背景图",
    category: "hero",
    mediaKind: "image",
    description: "首页首屏默认背景图。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/432585374.webp",
  },
  {
    slotKey: "hero.us.background",
    label: "美国站首屏背景图",
    category: "hero",
    mediaKind: "image",
    description: "美国站落地页首屏背景图。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/432585374.webp",
  },
  {
    slotKey: "hero.ca.background",
    label: "加拿大站首屏背景图",
    category: "hero",
    mediaKind: "image",
    description: "加拿大站落地页首屏背景图。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/432585374.webp",
  },
  {
    slotKey: "hero.eu.background",
    label: "欧洲站首屏背景图",
    category: "hero",
    mediaKind: "image",
    description: "欧洲站落地页首屏背景图。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/432585374.webp",
  },
  {
    slotKey: "seo.default.og",
    label: "默认 OG 分享图",
    category: "seo",
    mediaKind: "image",
    description: "全站默认 Open Graph 分享图。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/432585374.webp",
  },
  {
    slotKey: "marquee.default.background",
    label: "认证横幅背景图",
    category: "marquee",
    mediaKind: "image",
    description: "首页认证横幅使用的背景图。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0-29-2.png",
  },
  {
    slotKey: "trust.default.background",
    label: "信任区背景视频",
    category: "trust",
    mediaKind: "video",
    description: "信任区背景视频，未绑定视频时回退到默认封面图。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0018.webp",
  },
  {
    slotKey: "about.factory.preview.video",
    label: "工厂预览视频",
    category: "about",
    mediaKind: "video",
    description: "前台工厂预览模块的主视频。",
    fallbackUrl: "/defaults/factory-preview.mp4",
  },
  {
    slotKey: "about.factory.preview.poster",
    label: "工厂预览封面图",
    category: "about",
    mediaKind: "image",
    description: "工厂预览视频的封面图。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0018.webp",
  },
  {
    slotKey: "about.factory.gallery.1",
    label: "工厂相册 1",
    category: "about-gallery",
    mediaKind: "image",
    description: "工厂图片库第 1 张图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0018.webp",
  },
  {
    slotKey: "about.factory.gallery.2",
    label: "工厂相册 2",
    category: "about-gallery",
    mediaKind: "image",
    description: "工厂图片库第 2 张图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0-11.jpg",
  },
  {
    slotKey: "about.factory.gallery.3",
    label: "工厂相册 3",
    category: "about-gallery",
    mediaKind: "image",
    description: "工厂图片库第 3 张图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0-46.jpg",
  },
  {
    slotKey: "about.factory.gallery.4",
    label: "工厂相册 4",
    category: "about-gallery",
    mediaKind: "image",
    description: "工厂图片库第 4 张图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0-15-scaled.jpg",
  },
  {
    slotKey: "about.factory.gallery.5",
    label: "工厂相册 5",
    category: "about-gallery",
    mediaKind: "image",
    description: "工厂图片库第 5 张图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0-7.jpg",
  },
  {
    slotKey: "about.factory.gallery.6",
    label: "工厂相册 6",
    category: "about-gallery",
    mediaKind: "image",
    description: "工厂图片库第 6 张图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0-6.jpg",
  },
  {
    slotKey: "about.factory.gallery.7",
    label: "工厂相册 7",
    category: "about-gallery",
    mediaKind: "image",
    description: "工厂图片库第 7 张图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/32b6c697519b48fc814b3a4712323de2.jpg",
  },
  {
    slotKey: "about.factory.gallery.8",
    label: "工厂相册 8",
    category: "about-gallery",
    mediaKind: "image",
    description: "工厂图片库第 8 张图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/04/1ca668e4-96e7-4f29-8ccb-84f670e2c29c.jpg",
  },
  {
    slotKey: "products.showcase.1",
    label: "产品卡 1 图片",
    category: "products",
    mediaKind: "image",
    description: "Coreless Paper Roll 产品卡图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0010.webp",
  },
  {
    slotKey: "products.showcase.2",
    label: "产品卡 2 图片",
    category: "products",
    mediaKind: "image",
    description: "Portable / Mobile Printer Rolls 产品卡图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0011.webp",
  },
  {
    slotKey: "products.showcase.3",
    label: "产品卡 3 图片",
    category: "products",
    mediaKind: "image",
    description: "Custom Printed Rolls 产品卡图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0016.webp",
  },
  {
    slotKey: "products.showcase.4",
    label: "产品卡 4 图片",
    category: "products",
    mediaKind: "image",
    description: "BPA-Free Thermal Rolls 产品卡图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/fTqEH1zAZ-1.webp",
  },
  {
    slotKey: "products.showcase.5",
    label: "产品卡 5 图片",
    category: "products",
    mediaKind: "image",
    description: "Colored Thermal Paper Rolls 产品卡图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0024.webp",
  },
  {
    slotKey: "products.showcase.6",
    label: "产品卡 6 图片",
    category: "products",
    mediaKind: "image",
    description: "High-Sensitivity Thermal Rolls 产品卡图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/drg.webp",
  },
  {
    slotKey: "pain-points.card.1",
    label: "痛点卡 1 图片",
    category: "pain-points",
    mediaKind: "image",
    description: "Color appears dull, fades easily 卡片图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0023.webp",
  },
  {
    slotKey: "pain-points.card.2",
    label: "痛点卡 2 图片",
    category: "pain-points",
    mediaKind: "image",
    description: "Excessive paper debris 卡片图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0022.webp",
  },
  {
    slotKey: "pain-points.card.3",
    label: "痛点卡 3 图片",
    category: "pain-points",
    mediaKind: "image",
    description: "Shortage of length 卡片图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/0013.webp",
  },
  {
    slotKey: "pain-points.card.4",
    label: "痛点卡 4 图片",
    category: "pain-points",
    mediaKind: "image",
    description: "Delivery delays 卡片图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/005.webp",
  },
  {
    slotKey: "logistics.card.1",
    label: "物流卡 1 图片",
    category: "logistics",
    mediaKind: "image",
    description: "Secure Storage & Shipping Solutions 卡片图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/007.webp",
  },
  {
    slotKey: "logistics.card.2",
    label: "物流卡 2 图片",
    category: "logistics",
    mediaKind: "image",
    description: "Marine-Grade Export Packaging 卡片图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/003.webp",
  },
  {
    slotKey: "logistics.card.3",
    label: "物流卡 3 图片",
    category: "logistics",
    mediaKind: "image",
    description: "Precision Container Loading 卡片图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/004.webp",
  },
  {
    slotKey: "logistics.card.4",
    label: "物流卡 4 图片",
    category: "logistics",
    mediaKind: "image",
    description: "End-to-End Global Freight 卡片图片。",
    fallbackUrl: "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/005.webp",
  },
];

export function getImageSlotByKey(slotKey: string) {
  return imageSlotRegistry.find((slot) => slot.slotKey === slotKey) ?? null;
}

export function getImageProcessingProfile(
  slotKey?: string | null,
): ImageProcessingProfile | null {
  if (!slotKey) {
    return null;
  }

  if (slotKey.startsWith("brand.logo.")) {
    return {
      width: 480,
      height: 180,
      fit: "inside",
      quality: 82,
      thumbWidth: 240,
      thumbHeight: 90,
    };
  }

  if (slotKey.startsWith("hero.")) {
    return {
      width: 1600,
      height: 900,
      fit: "cover",
      quality: 68,
      thumbWidth: 640,
      thumbHeight: 360,
    };
  }

  if (slotKey === "seo.default.og") {
    return {
      width: 1200,
      height: 630,
      fit: "cover",
      quality: 72,
      thumbWidth: 600,
      thumbHeight: 315,
    };
  }

  if (slotKey === "marquee.default.background") {
    return {
      width: 1440,
      height: 360,
      fit: "cover",
      quality: 66,
      thumbWidth: 640,
      thumbHeight: 160,
    };
  }

  if (slotKey === "about.factory.preview.poster") {
    return {
      width: 960,
      height: 540,
      fit: "cover",
      quality: 68,
      thumbWidth: 400,
      thumbHeight: 225,
    };
  }

  if (slotKey.startsWith("about.factory.gallery.")) {
    return {
      width: 720,
      height: 540,
      fit: "cover",
      quality: 68,
      thumbWidth: 240,
      thumbHeight: 180,
    };
  }

  if (slotKey.startsWith("products.showcase.")) {
    return {
      width: 900,
      height: 675,
      fit: "inside",
      quality: 74,
      thumbWidth: 300,
      thumbHeight: 225,
    };
  }

  if (slotKey.startsWith("pain-points.card.")) {
    return {
      width: 900,
      height: 675,
      fit: "cover",
      quality: 74,
      thumbWidth: 300,
      thumbHeight: 225,
    };
  }

  if (slotKey.startsWith("logistics.card.")) {
    return {
      width: 900,
      height: 675,
      fit: "cover",
      quality: 74,
      thumbWidth: 300,
      thumbHeight: 225,
    };
  }

  return null;
}

export function getImageSlotSeedRows() {
  return imageSlotRegistry.map((slot) => ({
    slotKey: slot.slotKey,
    label: slot.label,
    category: slot.category,
    description: slot.description,
    fallbackUrl: slot.fallbackUrl,
  }));
}
