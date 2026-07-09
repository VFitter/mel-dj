import { NextResponse } from "next/server";
import { db } from "@/db";
import { playHistory, tracks, adCampaigns } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const items = db.select().from(playHistory)
    .orderBy(desc(playHistory.playedAt))
    .limit(50)
    .all();

  const enriched = items.map((item) => {
    let track = null;
    let adCampaign = null;

    if (item.trackId) {
      track = db.select({ title: tracks.title, artist: tracks.artist })
        .from(tracks).where(eq(tracks.id, item.trackId)).get() || null;
    }
    if (item.adCampaignId) {
      adCampaign = db.select({ advertiserName: adCampaigns.advertiserName })
        .from(adCampaigns).where(eq(adCampaigns.id, item.adCampaignId)).get() || null;
    }

    return { ...item, track, adCampaign };
  });

  return NextResponse.json(enriched);
}
