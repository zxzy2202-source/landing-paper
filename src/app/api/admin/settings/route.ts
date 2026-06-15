import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getCurrentAdminSession } from "@/lib/auth";
import { logActivity } from "@/lib/services/activity-log";
import {
  getEditableSiteSettings,
  saveSiteSettings,
} from "@/lib/services/site-settings";
import { mergeSiteSettings } from "@/lib/siteSettingsTypes";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET() {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  const settings = await getEditableSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return unauthorized();
  }

  const payload = mergeSiteSettings(await request.json());
  const saved = await saveSiteSettings(payload, admin.id);

  await logActivity({
    action: "settings.update",
    adminUserId: admin.id,
    entityType: "site_settings",
    payload: {
      seoTitle: saved.seo.title,
    },
  });

  revalidatePath("/");
  revalidatePath("/us");
  revalidatePath("/ca");
  revalidatePath("/eu");

  return NextResponse.json({
    message: "Settings saved successfully.",
    settings: saved,
  });
}
