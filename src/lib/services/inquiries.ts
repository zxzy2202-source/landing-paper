import "@/lib/serverOnly";

import { count, desc, eq } from "drizzle-orm";

import { db, requireDatabase } from "@/lib/db/client";
import {
  contactInquiries,
  quoteRequests,
  sampleRequests,
} from "@/lib/db/schema";
import { notifyAll } from "@/lib/notifications";

export const inquiryKinds = ["contact", "quote", "sample"] as const;

export type InquiryKind = (typeof inquiryKinds)[number];

export type ContactInquiryInput = {
  companyName?: string;
  contactEmail: string;
  contactName: string;
  geoCode?: string;
  message?: string;
  productInterest?: string;
  sourcePath?: string;
  whatsappNumber?: string;
};

export async function createContactInquiry(input: ContactInquiryInput) {
  const database = requireDatabase();

  const [created] = await database
    .insert(contactInquiries)
    .values({
      companyName: input.companyName?.trim() || null,
      contactEmail: input.contactEmail.trim().toLowerCase(),
      contactName: input.contactName.trim(),
      geoCode: input.geoCode ?? "global",
      message: input.message?.trim() || null,
      productInterest: input.productInterest?.trim() || null,
      sourcePath: input.sourcePath ?? "/",
      whatsappNumber: input.whatsappNumber?.trim() || null,
    })
    .returning();

  await notifyAll({
    category: "contact",
    email: created.contactEmail,
    title: `New contact inquiry from ${created.contactName}`,
    message: [
      `Name: ${created.contactName}`,
      `Email: ${created.contactEmail}`,
      `Company: ${created.companyName ?? "-"}`,
      `WhatsApp: ${created.whatsappNumber ?? "-"}`,
      `Interest: ${created.productInterest ?? "-"}`,
      `Message: ${created.message ?? "-"}`,
    ].join("\n"),
  });

  return created;
}

export async function listInquiries() {
  if (!db) {
    return {
      contact: [],
      quote: [],
      sample: [],
    };
  }

  const [contact, quote, sample] = await Promise.all([
    db.query.contactInquiries.findMany({
      orderBy: desc(contactInquiries.createdAt),
      limit: 100,
    }),
    db.query.quoteRequests.findMany({
      orderBy: desc(quoteRequests.createdAt),
      limit: 100,
    }),
    db.query.sampleRequests.findMany({
      orderBy: desc(sampleRequests.createdAt),
      limit: 100,
    }),
  ]);

  return { contact, quote, sample };
}

export async function updateInquiryStatus(
  kind: InquiryKind,
  id: string,
  status: string,
) {
  const database = requireDatabase();
  const next = {
    status,
    updatedAt: new Date(),
  };

  if (kind === "contact") {
    const [updated] = await database
      .update(contactInquiries)
      .set(next)
      .where(eq(contactInquiries.id, id))
      .returning();

    return updated;
  }

  if (kind === "quote") {
    const [updated] = await database
      .update(quoteRequests)
      .set(next)
      .where(eq(quoteRequests.id, id))
      .returning();

    return updated;
  }

  const [updated] = await database
    .update(sampleRequests)
    .set(next)
    .where(eq(sampleRequests.id, id))
    .returning();

  return updated;
}

export async function getInquirySummary() {
  if (!db) {
    return {
      contact: 0,
      quote: 0,
      sample: 0,
    };
  }

  const [contact, quote, sample] = await Promise.all([
    db.select({ value: count() }).from(contactInquiries),
    db.select({ value: count() }).from(quoteRequests),
    db.select({ value: count() }).from(sampleRequests),
  ]);

  return {
    contact: contact[0]?.value ?? 0,
    quote: quote[0]?.value ?? 0,
    sample: sample[0]?.value ?? 0,
  };
}
