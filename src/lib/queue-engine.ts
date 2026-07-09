import { db } from "@/db";
import { tracks, queue, adPricingTiers, adCampaigns } from "@/db/schema";
import { and, asc, eq, inArray, sql } from "drizzle-orm";

const MIN_QUEUE_SIZE = 5;

export async function ensureQueueFilled(): Promise<void> {
  const pendingCount = db.select({ count: sql<number>`count(*)` })
    .from(queue)
    .where(eq(queue.status, "pending"))
    .get();

  if (!pendingCount || pendingCount.count >= MIN_QUEUE_SIZE) return;

  const needed = MIN_QUEUE_SIZE - (pendingCount?.count || 0);

  const availableTracks = db.select()
    .from(tracks)
    .where(inArray(tracks.status, ["available", "active"]))
    .all();

  if (availableTracks.length === 0) return;

  const lastPosition = db.select({ maxPos: sql<number>`max(${queue.position})` })
    .from(queue)
    .where(eq(queue.status, "pending"))
    .get();

  let pos = (lastPosition?.maxPos ?? 0) + 1;

  const activeTiers = db.select()
    .from(adPricingTiers)
    .where(eq(adPricingTiers.active, true))
    .all();

  const activeCampaigns = db.select()
    .from(adCampaigns)
    .where(
      and(
        eq(adCampaigns.active, true),
        sql`${adCampaigns.startDate} <= ${Date.now()}`,
        sql`${adCampaigns.endDate} IS NULL OR ${adCampaigns.endDate} >= ${Date.now()}`,
      )
    )
    .all();

  let tracksAdded = 0;
  let trackCounter = 0;

  for (const track of availableTracks) {
    if (tracksAdded >= needed) break;

    trackCounter++;

    const slotTier = activeTiers.find(t => trackCounter % t.slotFrequency === 0);
    if (slotTier && activeCampaigns.length > 0) {
      const campaign = activeCampaigns.find(c => c.pricingTierId === slotTier.id);
      if (campaign) {
        db.insert(queue).values({
          position: pos++,
          type: "ad",
          adCampaignId: campaign.id,
          status: "pending",
        }).run();
      }
    }

    db.insert(queue).values({
      position: pos++,
      type: "track",
      trackId: track.id,
      status: "pending",
    }).run();
    tracksAdded++;
  }
}

export function getNextQueueItem(): { type: "track" | "ad"; trackId?: number; adCampaignId?: number } | null {
  const item = db.select()
    .from(queue)
    .where(eq(queue.status, "pending"))
    .orderBy(asc(queue.position))
    .limit(1)
    .get();

  if (!item) return null;

  db.update(queue)
    .set({ status: "playing" })
    .where(eq(queue.id, item.id))
    .run();

  if (item.type === "track") {
    return { type: "track", trackId: item.trackId! };
  }
  return { type: "ad", adCampaignId: item.adCampaignId! };
}

export function markAsPlayed(queueItemId: number): void {
  db.update(queue)
    .set({ status: "played" })
    .where(eq(queue.id, queueItemId))
    .run();
}

export function requeueTrack(trackId: number): void {
  const lastPos = db.select({ maxPos: sql<number>`max(${queue.position})` })
    .from(queue)
    .get();
  db.insert(queue).values({
    position: (lastPos?.maxPos ?? 0) + 1,
    type: "track",
    trackId,
    status: "pending",
  }).run();
}

export function rebalanceQueue(): void {
  db.run(sql`
    UPDATE queue SET position = rowid * 1.0 
    WHERE status = 'pending' 
    ORDER BY position
  `);
}

export function getQueuePosition(queueItemId: number): number | null {
  const item = db.select({ position: queue.position })
    .from(queue)
    .where(eq(queue.id, queueItemId))
    .get();
  return item?.position ?? null;
}
