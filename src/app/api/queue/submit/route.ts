import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tracks, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { extractYouTubeId, fetchYouTubeMeta } from "@/lib/youtube";
import { ensureQueueFilled, prioritizeNewTrack, getQueuePosition } from "@/lib/queue-engine";
import { getCooldownStatus, recordSubmission } from "@/lib/cooldown";
import { resolveRequestIdentity } from "@/lib/request-identity";

export async function POST(req: NextRequest) {
  const identity = await resolveRequestIdentity(req);
  if (!identity) {
    return NextResponse.json(
      { error: "Device not registered. Refresh the page and try again." },
      { status: 401 },
    );
  }

  const cooldown = getCooldownStatus(identity.deviceId, identity.ipHash);
  if (!cooldown.allowed) {
    return NextResponse.json(
      {
        error: "Cooldown active",
        retryAfterMs: cooldown.retryAfterMs,
        nextAvailableAt: cooldown.nextAvailableAt,
      },
      { status: 429 },
    );
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "YouTube URL required" }, { status: 400 });
  }

  const videoId = extractYouTubeId(url.trim());
  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  let track = db.select().from(tracks).where(eq(tracks.youtubeId, videoId)).get();

  if (!track) {
    let meta;
    try {
      meta = await fetchYouTubeMeta(videoId);
    } catch {
      return NextResponse.json({ error: "Could not fetch video info. Check the URL and try again." }, { status: 502 });
    }

    const admin = db.select().from(users).where(eq(users.role, "admin")).get();
    if (!admin) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    track = db.insert(tracks).values({
      youtubeUrl: url.trim(),
      youtubeId: videoId,
      title: meta.title,
      artist: meta.artist,
      durationSeconds: meta.durationSeconds,
      thumbnailUrl: meta.thumbnailUrl,
      addedBy: admin.id,
      status: "available",
    }).returning().get();
  } else if (track.status === "archived") {
    db.update(tracks)
      .set({ status: "available", updatedAt: Date.now() })
      .where(eq(tracks.id, track.id))
      .run();
    track = { ...track, status: "available" as const };
  }

  const queueItemId = prioritizeNewTrack(track.id);
  await ensureQueueFilled();

  recordSubmission({
    deviceId: identity.deviceId,
    ipHash: identity.ipHash,
    trackId: track.id,
    queueId: queueItemId,
    youtubeId: videoId,
  });

  const position = getQueuePosition(queueItemId);

  return NextResponse.json({
    success: true,
    track: {
      id: track.id,
      title: track.title,
      artist: track.artist,
      thumbnailUrl: track.thumbnailUrl,
      youtubeId: track.youtubeId,
    },
    position,
    cooldown: getCooldownStatus(identity.deviceId, identity.ipHash),
  });
}
