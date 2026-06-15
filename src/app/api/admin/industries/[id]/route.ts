import { NextResponse } from "next/server";

import { getCurrentAdminSession } from "@/lib/auth";
import { logActivity } from "@/lib/services/activity-log";
import { deleteIndustryPage } from "@/lib/services/product-overrides";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteIndustryPage(id);

  if (!deleted) {
    return NextResponse.json({ error: "Industry page not found." }, { status: 404 });
  }

  await logActivity({
    action: "industry.delete",
    adminUserId: admin.id,
    entityId: id,
    entityType: "product_override",
    payload: {
      slug: deleted.slug,
      title: deleted.title,
    },
  });

  return NextResponse.json({ ok: true });
}
