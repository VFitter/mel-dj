import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { hashSync } from "bcryptjs";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const sqlite = new Database(process.env.DATABASE_URL || "mel.db");
const db = drizzle(sqlite, { schema });

function seed() {
  const adminUsername = process.env.ADMIN_USERNAME || "MelGang";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminMel@";

  const existing = db.select().from(schema.users).where(
    eq(schema.users.username, adminUsername)
  ).get();

  if (!existing) {
    db.insert(schema.users).values({
      username: adminUsername,
      passwordHash: hashSync(adminPassword, 10),
      role: "admin",
    }).run();
    console.log("Admin user created: " + adminUsername);
  } else {
    console.log("Admin user already exists: " + adminUsername);
  }

  const tiers = [
    {
      name: "Standard Slot",
      description: "Your ad plays after every 5 tracks. Great for consistent exposure.",
      priceCents: 1000,
      slotFrequency: 5,
      durationSeconds: 15,
    },
    {
      name: "Premium Slot",
      description: "Your ad plays after every 3 tracks. Higher frequency, better visibility.",
      priceCents: 2500,
      slotFrequency: 3,
      durationSeconds: 30,
    },
    {
      name: "Featured Slot",
      description: "Your ad plays immediately after the current track. Maximum impact.",
      priceCents: 5000,
      slotFrequency: 1,
      durationSeconds: 45,
    },
  ];

  for (const tier of tiers) {
    const existing = db.select().from(schema.adPricingTiers).where(
      eq(schema.adPricingTiers.name, tier.name)
    ).get();
    if (!existing) {
      db.insert(schema.adPricingTiers).values(tier).run();
      console.log("Created tier: " + tier.name);
    } else {
      console.log("Tier already exists: " + tier.name);
    }
  }

  console.log("Seed complete!");
}

seed();
