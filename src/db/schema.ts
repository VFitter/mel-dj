import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin"] }).notNull().default("admin"),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
});

export const tracks = sqliteTable("tracks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  youtubeUrl: text("youtube_url").notNull().unique(),
  youtubeId: text("youtube_id").notNull().unique(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  durationSeconds: integer("duration_seconds", { mode: "number" }).notNull(),
  thumbnailUrl: text("thumbnail_url"),
  status: text("status", { enum: ["available", "active", "archived"] }).notNull().default("available"),
  addedBy: integer("added_by", { mode: "number" }).notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
}, (t) => ({
  statusIdx: index("tracks_status_idx").on(t.status),
}));

export const adPricingTiers = sqliteTable("ad_pricing_tiers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents", { mode: "number" }).notNull(),
  slotFrequency: integer("slot_frequency", { mode: "number" }).notNull(),
  durationSeconds: integer("duration_seconds", { mode: "number" }).notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
}, (t) => ({
  activeIdx: index("ad_tiers_active_idx").on(t.active),
}));

export const adCampaigns = sqliteTable("ad_campaigns", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  advertiserName: text("advertiser_name").notNull(),
  pricingTierId: integer("pricing_tier_id", { mode: "number" }).notNull().references(() => adPricingTiers.id),
  websiteUrl: text("website_url"),
  imageUrl: text("image_url"),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }),
  playsRemaining: integer("plays_remaining", { mode: "number" }),
  totalPlays: integer("total_plays", { mode: "number" }).notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
}, (t) => ({
  activeIdx: index("ad_campaigns_active_idx").on(t.active),
}));

export const queue = sqliteTable("queue", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  position: real("position").notNull(),
  type: text("type", { enum: ["track", "ad"] }).notNull(),
  trackId: integer("track_id", { mode: "number" }).references(() => tracks.id, { onDelete: "set null" }),
  adCampaignId: integer("ad_campaign_id", { mode: "number" }).references(() => adCampaigns.id, { onDelete: "set null" }),
  status: text("status", { enum: ["pending", "playing", "played"] }).notNull().default("pending"),
  startedAt: integer("started_at", { mode: "number" }),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
}, (t) => ({
  positionIdx: index("queue_position_idx").on(t.position),
  statusIdx: index("queue_status_idx").on(t.status),
}));

export const playHistory = sqliteTable("play_history", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  trackId: integer("track_id", { mode: "number" }).references(() => tracks.id, { onDelete: "set null" }),
  queueId: integer("queue_id", { mode: "number" }),
  wasAdSlot: integer("was_ad_slot", { mode: "boolean" }).notNull().default(false),
  adCampaignId: integer("ad_campaign_id", { mode: "number" }),
  playedAt: integer("played_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
}, (t) => ({
  playedAtIdx: index("play_history_played_at_idx").on(t.playedAt),
}));

export const queueSubmissions = sqliteTable("queue_submissions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  deviceId: text("device_id").notNull(),
  ipHash: text("ip_hash").notNull(),
  trackId: integer("track_id", { mode: "number" }).references(() => tracks.id, { onDelete: "set null" }),
  queueId: integer("queue_id", { mode: "number" }),
  youtubeId: text("youtube_id").notNull(),
  submittedAt: integer("submitted_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
}, (t) => ({
  deviceTimeIdx: index("queue_submissions_device_time_idx").on(t.deviceId, t.submittedAt),
  ipTimeIdx: index("queue_submissions_ip_time_idx").on(t.ipHash, t.submittedAt),
}));

export const visitors = sqliteTable("visitors", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  deviceId: text("device_id").notNull().unique(),
  ipAddress: text("ip_address").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  userAgent: text("user_agent"),
  lastPath: text("last_path"),
  firstSeenAt: integer("first_seen_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  lastSeenAt: integer("last_seen_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
}, (t) => ({
  lastSeenIdx: index("visitors_last_seen_idx").on(t.lastSeenAt),
}));

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "read", "archived"] }).notNull().default("new"),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
}, (t) => ({
  statusIdx: index("contact_messages_status_idx").on(t.status),
}));

export const usersRelations = relations(users, ({ many }) => ({
  tracks: many(tracks),
}));

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  addedByUser: one(users, { fields: [tracks.addedBy], references: [users.id] }),
  queueItems: many(queue),
}));

export const queueRelations = relations(queue, ({ one }) => ({
  track: one(tracks, { fields: [queue.trackId], references: [tracks.id] }),
  adCampaign: one(adCampaigns, { fields: [queue.adCampaignId], references: [adCampaigns.id] }),
}));

export const adPricingTiersRelations = relations(adPricingTiers, ({ many }) => ({
  campaigns: many(adCampaigns),
}));

export const adCampaignsRelations = relations(adCampaigns, ({ one, many }) => ({
  pricingTier: one(adPricingTiers, { fields: [adCampaigns.pricingTierId], references: [adPricingTiers.id] }),
  queueItems: many(queue),
}));
