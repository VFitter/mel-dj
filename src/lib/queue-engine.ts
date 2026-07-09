import { db } from "@/db";
import { tracks, queue, adPricingTiers, adCampaigns, playHistory } from "@/db/schema";
import { and, asc, eq, inArray, sql } from "drizzle-orm";

const MIN_QUEUE_SIZE = 5;

export interface RadioTrackState {
  id: number;
  youtubeId: string;
  title: string;
  artist: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
}

export interface RadioAdCampaignState {
  id: number;
  advertiserName: string;
  websiteUrl: string | null;
  pricingTierId: number;
}

export interface RadioNowPlaying {
  queueItemId: number;
  type: "track" | "ad";
  startedAt: number;
  elapsedSeconds: number;
  durationSeconds: number;
  track: RadioTrackState | null;
  adCampaign: RadioAdCampaignState | null;
}

export interface RadioState {
  serverTime: number;
  revision: number;
  nowPlaying: RadioNowPlaying | null;
  empty: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getPendingTrackIds(): Set<number> {
  const pending = db.select({ trackId: queue.trackId })
    .from(queue)
    .where(and(eq(queue.status, "pending"), eq(queue.type, "track")))
    .all();
  return new Set(pending.map((item) => item.trackId).filter((id): id is number => id != null));
}

function getPlayingTrackId(): number | null {
  const playing = db.select({ trackId: queue.trackId })
    .from(queue)
    .where(and(eq(queue.status, "playing"), eq(queue.type, "track")))
    .get();
  return playing?.trackId ?? null;
}

function pickRandomTracks(count: number) {
  const availableTracks = db.select()
    .from(tracks)
    .where(inArray(tracks.status, ["available", "active"]))
    .all();

  if (availableTracks.length === 0) return [];

  const pendingIds = getPendingTrackIds();
  const playingId = getPlayingTrackId();

  let pool = availableTracks.filter(
    (track) => !pendingIds.has(track.id) && track.id !== playingId,
  );

  if (pool.length === 0) {
    pool = availableTracks.filter((track) => track.id !== playingId);
    if (pool.length === 0) pool = availableTracks;
  }

  const shuffled = shuffleArray(pool);
  const picked = [];
  for (let i = 0; i < count; i++) {
    picked.push(shuffled[i % shuffled.length]);
  }
  return picked;
}

export function prioritizeNewTrack(trackId: number): number {
  const playing = db.select()
    .from(queue)
    .where(eq(queue.status, "playing"))
    .get();

  let position: number;

  if (playing) {
    const nextPending = db.select()
      .from(queue)
      .where(eq(queue.status, "pending"))
      .orderBy(asc(queue.position))
      .limit(1)
      .get();

    position = nextPending
      ? (playing.position + nextPending.position) / 2
      : playing.position + 1;
  } else {
    const firstPending = db.select()
      .from(queue)
      .where(eq(queue.status, "pending"))
      .orderBy(asc(queue.position))
      .limit(1)
      .get();

    position = firstPending ? firstPending.position - 1 : 1;
  }

  const inserted = db.insert(queue).values({
    position,
    type: "track",
    trackId,
    status: "pending",
  }).returning({ id: queue.id }).get();

  return inserted.id;
}

export async function ensureQueueFilled(): Promise<void> {
  const pendingCount = db.select({ count: sql<number>`count(*)` })
    .from(queue)
    .where(eq(queue.status, "pending"))
    .get();

  if (!pendingCount || pendingCount.count >= MIN_QUEUE_SIZE) return;

  const needed = MIN_QUEUE_SIZE - (pendingCount?.count || 0);
  const tracksToAdd = pickRandomTracks(needed);

  if (tracksToAdd.length === 0) return;

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

  for (const track of tracksToAdd) {
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

export function getNextQueueItem(): { id: number; type: "track" | "ad"; trackId?: number; adCampaignId?: number } | null {
  const item = db.select()
    .from(queue)
    .where(eq(queue.status, "pending"))
    .orderBy(asc(queue.position))
    .limit(1)
    .get();

  if (!item) return null;

  const startedAt = Date.now();

  db.update(queue)
    .set({ status: "playing", startedAt })
    .where(eq(queue.id, item.id))
    .run();

  if (item.type === "track") {
    return { id: item.id, type: "track", trackId: item.trackId! };
  }
  return { id: item.id, type: "ad", adCampaignId: item.adCampaignId! };
}

export function markAsPlayed(queueItemId: number): void {
  db.update(queue)
    .set({ status: "played", startedAt: null })
    .where(eq(queue.id, queueItemId))
    .run();
}

function getQueueItemDuration(queueItem: typeof queue.$inferSelect): number {
  if (queueItem.type === "track" && queueItem.trackId) {
    const track = db.select({ durationSeconds: tracks.durationSeconds })
      .from(tracks)
      .where(eq(tracks.id, queueItem.trackId))
      .get();
    return track?.durationSeconds ?? 0;
  }

  if (queueItem.type === "ad" && queueItem.adCampaignId) {
    const campaign = db.select({ pricingTierId: adCampaigns.pricingTierId })
      .from(adCampaigns)
      .where(eq(adCampaigns.id, queueItem.adCampaignId))
      .get();
    if (!campaign) return 15;

    const tier = db.select({ durationSeconds: adPricingTiers.durationSeconds })
      .from(adPricingTiers)
      .where(eq(adPricingTiers.id, campaign.pricingTierId))
      .get();
    return tier?.durationSeconds ?? 15;
  }

  return 0;
}

function normalizePlayingItems(): typeof queue.$inferSelect | null {
  const playingItems = db.select()
    .from(queue)
    .where(eq(queue.status, "playing"))
    .orderBy(asc(queue.startedAt))
    .all();

  if (playingItems.length === 0) return null;

  const [current, ...extras] = playingItems;
  for (const extra of extras) {
    markAsPlayed(extra.id);
  }

  if (!current.startedAt) {
    const startedAt = Date.now();
    db.update(queue)
      .set({ startedAt })
      .where(eq(queue.id, current.id))
      .run();
    return { ...current, startedAt };
  }

  return current;
}

function recordPlayHistory(queueItem: typeof queue.$inferSelect): void {
  db.insert(playHistory).values({
    queueId: queueItem.id,
    trackId: queueItem.trackId,
    wasAdSlot: queueItem.type === "ad",
    adCampaignId: queueItem.adCampaignId,
  }).run();
}

function buildNowPlaying(
  queueItem: typeof queue.$inferSelect,
  serverTime: number,
): RadioNowPlaying {
  const startedAt = queueItem.startedAt ?? serverTime;
  const durationSeconds = getQueueItemDuration(queueItem);
  const elapsedSeconds = Math.min(
    durationSeconds,
    Math.max(0, Math.floor((serverTime - startedAt) / 1000)),
  );

  let track: RadioTrackState | null = null;
  let adCampaign: RadioAdCampaignState | null = null;

  if (queueItem.type === "track" && queueItem.trackId) {
    const row = db.select().from(tracks).where(eq(tracks.id, queueItem.trackId)).get();
    if (row) {
      track = {
        id: row.id,
        youtubeId: row.youtubeId,
        title: row.title,
        artist: row.artist,
        durationSeconds: row.durationSeconds,
        thumbnailUrl: row.thumbnailUrl,
      };
    }
  }

  if (queueItem.type === "ad" && queueItem.adCampaignId) {
    const row = db.select().from(adCampaigns).where(eq(adCampaigns.id, queueItem.adCampaignId)).get();
    if (row) {
      adCampaign = {
        id: row.id,
        advertiserName: row.advertiserName,
        websiteUrl: row.websiteUrl,
        pricingTierId: row.pricingTierId,
      };
    }
  }

  return {
    queueItemId: queueItem.id,
    type: queueItem.type,
    startedAt,
    elapsedSeconds,
    durationSeconds,
    track,
    adCampaign,
  };
}

function advanceQueueItem(queueItemId: number): void {
  const played = db.select().from(queue).where(eq(queue.id, queueItemId)).get();
  if (!played) return;

  markAsPlayed(queueItemId);
  recordPlayHistory(played);
}

export async function ensureRadioStarted(): Promise<void> {
  await ensureQueueFilled();

  const current = normalizePlayingItems();
  if (current) return;

  getNextQueueItem();
}

export async function advanceIfElapsed(now = Date.now()): Promise<boolean> {
  let advanced = false;

  while (true) {
    const current = normalizePlayingItems();
    if (!current) break;

    const startedAt = current.startedAt ?? now;
    const durationMs = getQueueItemDuration(current) * 1000;
    if (durationMs <= 0 || now < startedAt + durationMs) break;

    advanceQueueItem(current.id);
    advanced = true;
    getNextQueueItem();
  }

  return advanced;
}

export async function skipCurrentItem(): Promise<RadioNowPlaying | null> {
  const current = normalizePlayingItems();
  if (current) {
    advanceQueueItem(current.id);
  }

  await ensureQueueFilled();
  getNextQueueItem();
  return getRadioState().nowPlaying;
}

export async function playQueueItemNow(queueItemId: number): Promise<RadioNowPlaying | null> {
  const target = db.select()
    .from(queue)
    .where(eq(queue.id, queueItemId))
    .get();

  if (!target || target.status !== "pending") {
    return getRadioState().nowPlaying;
  }

  const current = normalizePlayingItems();
  if (current) {
    advanceQueueItem(current.id);
  }

  const startedAt = Date.now();
  db.update(queue)
    .set({ status: "playing", startedAt })
    .where(eq(queue.id, queueItemId))
    .run();

  await ensureQueueFilled();
  return getRadioState().nowPlaying;
}

export function getRadioState(now = Date.now()): RadioState {
  const current = normalizePlayingItems();

  if (!current) {
    return {
      serverTime: now,
      revision: 0,
      nowPlaying: null,
      empty: true,
    };
  }

  const nowPlaying = buildNowPlaying(current, now);

  return {
    serverTime: now,
    revision: current.id * 1_000_000 + (current.startedAt ?? 0),
    nowPlaying,
    empty: false,
  };
}

export async function syncRadioState(): Promise<RadioState> {
  await ensureRadioStarted();
  await advanceIfElapsed();
  return getRadioState();
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
