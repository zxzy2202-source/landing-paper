import { NextResponse } from "next/server";
import { z } from "zod";

import { createContactInquiry } from "@/lib/services/inquiries";

const contactSchema = z.object({
  companyName: z.string().optional(),
  contactEmail: z.string().email(),
  contactName: z.string().min(2),
  geoCode: z.string().optional(),
  message: z.string().optional(),
  productInterest: z.string().optional(),
  sourcePath: z.string().optional(),
  whatsappNumber: z.string().optional(),
});

export async function POST(request: Request) {
  const payload = contactSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again." },
      { status: 400 },
    );
  }

  const inquiry = await createContactInquiry(payload.data);

  return NextResponse.json({
    message: "Inquiry submitted successfully.",
    inquiryId: inquiry.id,
  });
}
