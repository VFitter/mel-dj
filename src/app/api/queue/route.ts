import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { queue, tracks, adCampaigns } from "@/db/schema";
import { eq, asc, isNotNull } from "drizzle-orm";

export async function GET() {
  const items = db.select().from(queue)
    .where(eq(queue.status, "pending"))
    .orderBy(asc(queue.position))
    .all();

  const enriched = items.map((item) => {
    let track = null;
    let adCampaign = null;

    if (item.type === "track" && item.trackId) {
      track = db.select().from(tracks).where(eq(tracks.id, item.trackId)).get() || null;
    }
    if (item.type === "ad" && item.adCampaignId) {
      adCampaign = db.select().from(adCampaigns).where(eq(adCampaigns.id, item.adCampaignId)).get() || null;
    }

    return { ...item, track, adCampaign };
  });

  return NextResponse.json(enriched);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  db.delete(queue).where(eq(queue.id, id)).run();
  return NextResponse.json({ success: true });
}
