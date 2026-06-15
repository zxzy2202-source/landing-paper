import { NextResponse } from "next/server";

import { getCurrentAdminSession } from "@/lib/auth";
import { listInquiries } from "@/lib/services/inquiries";

export async function GET() {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const inquiries = await listInquiries();
  return NextResponse.json(inquiries);
}
