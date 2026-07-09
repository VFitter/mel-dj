import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import * as schema from "./schema";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

function createDb(): BetterSQLite3Database<typeof schema> {
  const isVercel = process.env.VERCEL === "1";
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Database = require("better-sqlite3");
  const dbPath = process.env.DATABASE_URL || (isVercel ? "/tmp/mel.db" : "mel.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  const _db = drizzle(sqlite, { schema });

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS tracks (id INTEGER PRIMARY KEY AUTOINCREMENT, youtube_url TEXT NOT NULL UNIQUE, youtube_id TEXT NOT NULL UNIQUE, title TEXT NOT NULL, artist TEXT NOT NULL, duration_seconds INTEGER NOT NULL, thumbnail_url TEXT, status TEXT NOT NULL DEFAULT 'available', added_by INTEGER REFERENCES users(id), created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS ad_pricing_tiers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, price_cents INTEGER NOT NULL, slot_frequency INTEGER NOT NULL, duration_seconds INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS ad_campaigns (id INTEGER PRIMARY KEY AUTOINCREMENT, advertiser_name TEXT NOT NULL, pricing_tier_id INTEGER NOT NULL REFERENCES ad_pricing_tiers(id), website_url TEXT, image_url TEXT, start_date INTEGER NOT NULL, end_date INTEGER, plays_remaining INTEGER, total_plays INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS queue (id INTEGER PRIMARY KEY AUTOINCREMENT, position REAL NOT NULL, type TEXT NOT NULL CHECK(type IN ('track','ad')), track_id INTEGER REFERENCES tracks(id) ON DELETE SET NULL, ad_campaign_id INTEGER REFERENCES ad_campaigns(id) ON DELETE SET NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','playing','played')), created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS play_history (id INTEGER PRIMARY KEY AUTOINCREMENT, track_id INTEGER REFERENCES tracks(id) ON DELETE SET NULL, queue_id INTEGER, was_ad_slot INTEGER NOT NULL DEFAULT 0, ad_campaign_id INTEGER, played_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','read','archived')), created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS queue_submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, device_id TEXT NOT NULL, ip_hash TEXT NOT NULL, track_id INTEGER REFERENCES tracks(id) ON DELETE SET NULL, queue_id INTEGER, youtube_id TEXT NOT NULL, submitted_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS visitors (id INTEGER PRIMARY KEY AUTOINCREMENT, device_id TEXT NOT NULL UNIQUE, ip_address TEXT NOT NULL, latitude REAL, longitude REAL, city TEXT, region TEXT, country TEXT, user_agent TEXT, last_path TEXT, first_seen_at INTEGER NOT NULL, last_seen_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS queue_submissions_device_time_idx ON queue_submissions(device_id, submitted_at);
    CREATE INDEX IF NOT EXISTS queue_submissions_ip_time_idx ON queue_submissions(ip_hash, submitted_at);
    CREATE INDEX IF NOT EXISTS visitors_last_seen_idx ON visitors(last_seen_at);
  `);

  const queueColumns = sqlite.prepare("PRAGMA table_info(queue)").all() as { name: string }[];
  if (!queueColumns.some((column) => column.name === "started_at")) {
    sqlite.exec(`ALTER TABLE queue ADD COLUMN started_at INTEGER`);
  }

  const adminUsername = process.env.ADMIN_USERNAME || "MelGang";
  const admin = _db.select().from(schema.users).where(eq(schema.users.username, adminUsername)).get();
  if (!admin) {
    const pw = process.env.ADMIN_PASSWORD || "AdminMel@";
    _db.insert(schema.users).values({ username: adminUsername, passwordHash: hashSync(pw, 10), role: "admin", createdAt: Date.now(), updatedAt: Date.now() }).run();
  }

  const tiers = [
    { name: "Standard Slot", desc: "Your ad plays after every 5 tracks.", price: 1000, freq: 5, dur: 15 },
    { name: "Premium Slot", desc: "Your ad plays after every 3 tracks.", price: 2500, freq: 3, dur: 30 },
    { name: "Featured Slot", desc: "Your ad plays immediately after the current track.", price: 5000, freq: 1, dur: 45 },
  ];
  for (const t of tiers) {
    const exists = _db.select().from(schema.adPricingTiers).where(eq(schema.adPricingTiers.name, t.name)).get();
    if (!exists) {
      _db.insert(schema.adPricingTiers).values({ name: t.name, description: t.desc, priceCents: t.price, slotFrequency: t.freq, durationSeconds: t.dur, createdAt: Date.now() }).run();
    }
  }

  return _db;
}

let _db: BetterSQLite3Database<typeof schema> | null = null;

export const db = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_, prop) {
    if (!_db) _db = createDb();
    return (_db as any)[prop];
  },
});
