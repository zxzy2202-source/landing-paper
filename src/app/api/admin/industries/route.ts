import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAdminSession } from "@/lib/auth";
import { logActivity } from "@/lib/services/activity-log";
import {
  listEditableIndustryPages,
  saveIndustryPage,
} from "@/lib/services/product-overrides";

const metricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const industryPayloadSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isPublished: z.boolean(),
  content: z.object({
    heroEyebrow: z.string(),
    heroImageUrl: z.string().optional(),
    heroTitle: z.string(),
    heroDescription: z.string(),
    challengeTitle: z.string(),
    challenges: z.array(z.string()),
    solutionTitle: z.string(),
    solutions: z.array(z.string()),
    capabilities: z.array(z.string()),
    metrics: z.array(metricSchema),
    ctaHref: z.string(),
    ctaLabel: z.string(),
    faqs: z.array(faqSchema),
  }),
});

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET() {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  return NextResponse.json(await listEditableIndustryPages());
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  const parsed = industryPayloadSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid industry payload." }, { status: 400 });
  }

  const saved = await saveIndustryPage(parsed.data);

  await logActivity({
    action: "industry.save",
    adminUserId: admin.id,
    entityId: saved.id,
    entityType: "product_override",
    payload: {
      slug: saved.slug,
      title: saved.title,
    },
  });

  return NextResponse.json({
    item: saved,
    message: "Industry page saved successfully.",
  });
}
