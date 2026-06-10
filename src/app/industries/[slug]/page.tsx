import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IndustryPageView } from "@/components/pages/IndustryPageView";
import { buildMetadataFromSeo } from "@/lib/seo";
import { getIndustryPageBySlug, listPublishedIndustryPages } from "@/lib/services/product-overrides";
import { getPublicSiteSettings } from "@/lib/services/site-settings";

export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await listPublishedIndustryPages();
  return pages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const [industry, settings] = await Promise.all([
    getIndustryPageBySlug(slug),
    getPublicSiteSettings(),
  ]);

  if (!industry) {
    return buildMetadataFromSeo(settings.seo, `/industries/${slug}`);
  }

  return buildMetadataFromSeo(
    {
      ...settings.seo,
      title: industry.seoTitle || industry.title,
      description: industry.seoDescription || industry.summary || settings.seo.description,
      ogImage: industry.content.heroImageUrl || settings.seo.ogImage,
    },
    `/industries/${slug}`,
  );
}

export default async function IndustryDetailPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const [industry, settings] = await Promise.all([
    getIndustryPageBySlug(slug),
    getPublicSiteSettings(),
  ]);

  if (!industry) {
    notFound();
  }

  return <IndustryPageView industry={industry} contact={settings.contact} />;
}
