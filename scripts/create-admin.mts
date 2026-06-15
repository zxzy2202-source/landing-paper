import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { requireDatabase } from "../src/lib/db/client";
import { createAdminUser } from "../src/lib/services/admin-users";

async function main() {
  requireDatabase();

  const rl = createInterface({ input, output });

  try {
    const name = (await rl.question("Admin name: ")).trim();
    const email = (await rl.question("Admin email: ")).trim();
    const password = await rl.question("Admin password (min 8 chars): ");

    if (!name || !email || password.length < 8) {
      throw new Error("Name, email, and a password with at least 8 characters are required.");
    }

    const user = await createAdminUser({
      name,
      email,
      password,
      role: "owner",
    });

    console.log(`Created admin ${user.email} (${user.id})`);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
