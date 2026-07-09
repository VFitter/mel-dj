import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { queue, tracks, adCampaigns, playHistory } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getNextQueueItem, markAsPlayed, ensureQueueFilled } from "@/lib/queue-engine";

export async function POST(req: NextRequest) {
  const { currentQueueItemId } = await req.json();

  if (currentQueueItemId) {
    markAsPlayed(currentQueueItemId);

    const played = db.select().from(queue).where(eq(queue.id, currentQueueItemId)).get();
    if (played) {
      db.insert(playHistory).values({
        queueId: played.id,
        trackId: played.trackId,
        wasAdSlot: played.type === "ad",
        adCampaignId: played.adCampaignId,
      }).run();
    }
  }

  await ensureQueueFilled();

  const next = getNextQueueItem();
  if (!next) {
    return NextResponse.json({ empty: true });
  }

  let track = null;
  let adCampaign = null;

  if (next.type === "track" && next.trackId) {
    track = db.select().from(tracks).where(eq(tracks.id, next.trackId)).get();
  }
  if (next.type === "ad" && next.adCampaignId) {
    adCampaign = db.select().from(adCampaigns).where(eq(adCampaigns.id, next.adCampaignId)).get();
  }

  return NextResponse.json({
    type: next.type,
    track,
    adCampaign,
  });
}
