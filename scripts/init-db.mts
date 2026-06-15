import { eq } from "drizzle-orm";

import { requireDatabase } from "../src/lib/db/client";
import { imageSlots } from "../src/lib/db/schema";
import { getImageSlotSeedRows } from "../src/lib/imageSlots";
import { ensureDefaultIndustryPages } from "../src/lib/services/product-overrides";
import { ensureSiteSettings } from "../src/lib/services/site-settings";

async function main() {
  const database = requireDatabase();

  await ensureSiteSettings();
  await ensureDefaultIndustryPages();

  for (const slot of getImageSlotSeedRows()) {
    const existing = await database.query.imageSlots.findFirst({
      where: eq(imageSlots.slotKey, slot.slotKey),
    });

    if (!existing) {
      await database.insert(imageSlots).values(slot);
    }
  }

  console.log("Database bootstrap finished.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
