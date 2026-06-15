import type { Metadata } from "next";

import { buildMediaProxyUrl } from "@/lib/media-url";
import type { SeoConfig } from "@/lib/siteSettingsTypes";

export function scoreSeoConfig(seo: SeoConfig) {
  const suggestions: string[] = [];
  let score = 0;

  if (seo.title.length >= 30 && seo.title.length <= 65) {
    score += 30;
  } else {
    suggestions.push("Keep the SEO title between 30 and 65 characters.");
  }

  if (seo.description.length >= 80 && seo.description.length <= 160) {
    score += 30;
  } else {
    suggestions.push("Keep the meta description between 80 and 160 characters.");
  }

  if (seo.keywords.length >= 3) {
    score += 15;
  } else {
    suggestions.push("Add at least three focused keywords.");
  }

  if (seo.canonicalUrl.startsWith("http")) {
    score += 10;
  } else {
    suggestions.push("Provide a valid canonical URL.");
  }

  if (seo.ogImage.startsWith("http")) {
    score += 15;
  } else {
    suggestions.push("Provide an absolute OG image URL.");
  }

  return {
    score,
    suggestions,
  };
}

export function buildMetadataFromSeo(
  seo: SeoConfig,
  pathname = "/",
): Metadata {
  const baseUrl = new URL(seo.canonicalUrl);
  const url = pathname === "/" ? baseUrl : new URL(pathname, baseUrl);
  const ogImageUrl = new URL(buildMediaProxyUrl(seo.ogImage, 1200), baseUrl).toString();

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: baseUrl,
    alternates: {
      canonical: url.pathname === "/" ? baseUrl.toString() : url.toString(),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: seo.siteName,
      type: "website",
      url: url.toString(),
      images: [
        {
          url: ogImageUrl,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImageUrl],
    },
  };
}
