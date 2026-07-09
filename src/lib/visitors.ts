import { eq } from "drizzle-orm";
import { db } from "@/db";
import { visitors } from "@/db/schema";
import { lookupGeoIp } from "@/lib/geo-ip";

export interface VisitorRecord {
  id: number;
  deviceId: string;
  ipAddress: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  region: string | null;
  country: string | null;
  userAgent: string | null;
  lastPath: string | null;
  firstSeenAt: number;
  lastSeenAt: number;
}

export interface TrackVisitorInput {
  deviceId: string;
  ipAddress: string;
  userAgent?: string | null;
  path?: string | null;
}

export async function trackVisitor(input: TrackVisitorInput): Promise<void> {
  const now = Date.now();
  const existing = db
    .select()
    .from(visitors)
    .where(eq(visitors.deviceId, input.deviceId))
    .get();

  if (existing) {
    const updates: Partial<typeof visitors.$inferInsert> = {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent ?? existing.userAgent,
      lastPath: input.path ?? existing.lastPath,
      lastSeenAt: now,
    };

    if (existing.latitude == null || existing.longitude == null) {
      const geo = await lookupGeoIp(input.ipAddress);
      if (geo) {
        updates.latitude = geo.latitude;
        updates.longitude = geo.longitude;
        updates.city = geo.city;
        updates.region = geo.region;
        updates.country = geo.country;
      }
    }

    db.update(visitors)
      .set(updates)
      .where(eq(visitors.deviceId, input.deviceId))
      .run();
    return;
  }

  const geo = await lookupGeoIp(input.ipAddress);

  db.insert(visitors)
    .values({
      deviceId: input.deviceId,
      ipAddress: input.ipAddress,
      latitude: geo?.latitude ?? null,
      longitude: geo?.longitude ?? null,
      city: geo?.city ?? null,
      region: geo?.region ?? null,
      country: geo?.country ?? null,
      userAgent: input.userAgent ?? null,
      lastPath: input.path ?? null,
      firstSeenAt: now,
      lastSeenAt: now,
    })
    .run();
}

export function listVisitors(): VisitorRecord[] {
  return db.select().from(visitors).all();
}
