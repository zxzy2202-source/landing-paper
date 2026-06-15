import { getImageSlotByKey } from "@/lib/imageSlots";

export type HeroContent = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  backgroundImage: string;
};

export type SeoConfig = {
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
};

export type GeoPageConfig = {
  path: string;
  hero: HeroContent;
  seoTitle: string;
  seoDescription: string;
};

export type ContactConfig = {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
};

export type SiteSettings = {
  contact: ContactConfig;
  geo: {
    ca: GeoPageConfig;
    eu: GeoPageConfig;
    us: GeoPageConfig;
  };
  hero: HeroContent;
  productCategories: string[];
  seo: SeoConfig;
  theme: {
    accent: string;
    primary: string;
    surface: string;
  };
};

const defaultHeroBackground =
  getImageSlotByKey("hero.default.background")?.fallbackUrl ?? "";

const defaultHero: HeroContent = {
  eyebrow: "ISO 9001 & FSC Certified Factory",
  title: "The Trusted OEM Partner for",
  highlight: "Custom Printed Thermal Receipt Rolls",
  description:
    "From logo design to custom packaging. We help 500+ distributors and retail chains stand out with specialty paper solutions.",
  primaryCtaLabel: "Get Factory-Direct Quote",
  primaryCtaHref: "mailto:Sales@zxpapers.com",
  secondaryCtaLabel: "Talk on WhatsApp",
  secondaryCtaHref: "https://api.whatsapp.com/send/?phone=8618092117618",
  backgroundImage: defaultHeroBackground,
};

export const defaultSiteSettings: SiteSettings = {
  theme: {
    primary: "#2563eb",
    accent: "#0f172a",
    surface: "#f8fafc",
  },
  seo: {
    siteName: "Zhixinpaper",
    title: "Zhixinpaper | Global Manufacturer of Premium Thermal Paper Rolls",
    description:
      "The trusted OEM partner for custom printed thermal receipt rolls globally. 15+ years of manufacturing excellence, ISO 9001 & FSC certified factory.",
    keywords: [
      "thermal paper rolls",
      "custom receipt rolls",
      "OEM thermal paper manufacturer",
      "POS receipt paper",
    ],
    canonicalUrl: "https://www.zhixinpaper.com",
    ogImage: defaultHero.backgroundImage,
  },
  hero: defaultHero,
  geo: {
    us: {
      path: "/us",
      hero: {
        ...defaultHero,
        description:
          "Built for U.S. distributors and retail chains that need stable lead times, FSC compliance, and private-label thermal paper at factory-direct cost.",
      },
      seoTitle: "Custom Thermal Receipt Rolls for U.S. Distributors | Zhixinpaper",
      seoDescription:
        "Factory-direct custom thermal paper for the U.S. market with FSC certification, OEM packaging, and reliable wholesale delivery.",
    },
    ca: {
      path: "/ca",
      hero: {
        ...defaultHero,
        description:
          "Support Canadian distributors with bilingual-ready packaging, compliant supply, and dependable custom thermal roll manufacturing.",
      },
      seoTitle: "Custom Thermal Receipt Rolls for Canada | Zhixinpaper",
      seoDescription:
        "OEM thermal receipt rolls for Canadian wholesalers with export-ready logistics and consistent paper quality.",
    },
    eu: {
      path: "/eu",
      hero: {
        ...defaultHero,
        description:
          "Serve EU retail, logistics, and banking clients with stable sourcing, custom sizes, and fast response from an experienced OEM partner.",
      },
      seoTitle: "OEM Thermal Paper Rolls for Europe | Zhixinpaper",
      seoDescription:
        "Private-label thermal paper manufacturing for Europe with export support, quality control, and responsive sample service.",
    },
  },
  contact: {
    email: "Sales@zxpapers.com",
    phone: "+86 180 9211 7618",
    whatsapp: "+86 180 9211 7618",
    address:
      "Building 15, Phase 1 Zone 2, Ronghao Industrial Park, Gaoling District, Xi'an, Shaanxi, China",
  },
  productCategories: [
    "POS Receipt Rolls",
    "ATM & Banking Rolls",
    "Kiosk & Ticketing Rolls",
    "Logistics & Waybill Rolls",
    "Custom OEM / Private Label",
  ],
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, incoming: Partial<T>): T {
  if (!isObject(base) || !isObject(incoming)) {
    return (incoming ?? base) as T;
  }

  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined) {
      continue;
    }

    const current = result[key];
    result[key] =
      isObject(current) && isObject(value)
        ? deepMerge(current, value)
        : value;
  }

  return result as T;
}

export function mergeSiteSettings(
  incoming?: Partial<SiteSettings> | null,
): SiteSettings {
  if (!incoming) {
    return structuredClone(defaultSiteSettings);
  }

  return deepMerge(structuredClone(defaultSiteSettings), incoming);
}
