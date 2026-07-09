import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tracks, users, queue } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { extractYouTubeId, fetchYouTubeMeta } from "@/lib/youtube";
import { ensureQueueFilled, prioritizeNewTrack } from "@/lib/queue-engine";

export async function GET(req: NextRequest) {
  const isStats = req.nextUrl.searchParams.get("stats");

  if (isStats) {
    const totalTracks = db.select({ count: sql<number>`count(*)` }).from(tracks).get();
    const activeTracks = db.select({ count: sql<number>`count(*)` }).from(tracks)
      .where(inArray(tracks.status, ["available", "active"])).get();
    const pendingQueue = db.select({ count: sql<number>`count(*)` }).from(queue)
      .where(eq(queue.status, "pending")).get();
    const activeCampaigns = db.select({ count: sql<number>`count(*)` }).from(queue)
      .where(eq(queue.type, "ad")).get();

    return NextResponse.json({
      totalTracks: totalTracks?.count ?? 0,
      activeTracks: activeTracks?.count ?? 0,
      pendingQueue: pendingQueue?.count ?? 0,
      activeCampaigns: activeCampaigns?.count ?? 0,
    });
  }

  const allTracks = db.select().from(tracks).all();
  return NextResponse.json(allTracks);
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  const existing = db.select().from(tracks).where(eq(tracks.youtubeId, videoId)).get();
  if (existing) {
    return NextResponse.json({ error: "Track already exists" }, { status: 409 });
  }

  let meta;
  try {
    meta = await fetchYouTubeMeta(videoId);
  } catch {
    return NextResponse.json({ error: "Failed to fetch video metadata" }, { status: 500 });
  }

  const admin = db.select().from(users).where(eq(users.role, "admin")).get();
  if (!admin) {
    return NextResponse.json({ error: "Admin user not found" }, { status: 500 });
  }

  const newTrack = db.insert(tracks).values({
    youtubeUrl: url,
    youtubeId: videoId,
    title: meta.title,
    artist: meta.artist,
    durationSeconds: meta.durationSeconds,
    thumbnailUrl: meta.thumbnailUrl,
    addedBy: admin.id,
  }).returning().get();

  prioritizeNewTrack(newTrack.id);
  await ensureQueueFilled();

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  db.update(tracks)
    .set({ status: "archived" })
    .where(eq(tracks.id, id))
    .run();
  return NextResponse.json({ success: true });
}
