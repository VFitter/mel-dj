import { createHash } from "crypto";
import { db } from "@/db";
import { queueSubmissions } from "@/db/schema";
import { desc, eq, gte, and } from "drizzle-orm";

export const QUEUE_COOLDOWN_MS = 30 * 60 * 1000;

export interface CooldownStatus {
  allowed: boolean;
  retryAfterMs: number;
  nextAvailableAt: number | null;
  lastSubmittedAt: number | null;
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(`mel-ip:${ip}`).digest("hex");
}

function getLatestSubmission(deviceId: string, ipHash: string) {
  const windowStart = Date.now() - QUEUE_COOLDOWN_MS;

  const byDevice = db
    .select({ submittedAt: queueSubmissions.submittedAt })
    .from(queueSubmissions)
    .where(and(eq(queueSubmissions.deviceId, deviceId), gte(queueSubmissions.submittedAt, windowStart)))
    .orderBy(desc(queueSubmissions.submittedAt))
    .limit(1)
    .get();

  const byIp = db
    .select({ submittedAt: queueSubmissions.submittedAt })
    .from(queueSubmissions)
    .where(and(eq(queueSubmissions.ipHash, ipHash), gte(queueSubmissions.submittedAt, windowStart)))
    .orderBy(desc(queueSubmissions.submittedAt))
    .limit(1)
    .get();

  const timestamps = [byDevice?.submittedAt, byIp?.submittedAt].filter(
    (t): t is number => t != null,
  );

  if (timestamps.length === 0) return null;
  return Math.max(...timestamps);
}

export function getCooldownStatus(deviceId: string, ipHash: string): CooldownStatus {
  const lastSubmittedAt = getLatestSubmission(deviceId, ipHash);

  if (!lastSubmittedAt) {
    return {
      allowed: true,
      retryAfterMs: 0,
      nextAvailableAt: null,
      lastSubmittedAt: null,
    };
  }

  const nextAvailableAt = lastSubmittedAt + QUEUE_COOLDOWN_MS;
  const retryAfterMs = Math.max(0, nextAvailableAt - Date.now());

  return {
    allowed: retryAfterMs === 0,
    retryAfterMs,
    nextAvailableAt,
    lastSubmittedAt,
  };
}

export function recordSubmission(params: {
  deviceId: string;
  ipHash: string;
  trackId: number;
  queueId: number | null;
  youtubeId: string;
}): void {
  db.insert(queueSubmissions).values({
    deviceId: params.deviceId,
    ipHash: params.ipHash,
    trackId: params.trackId,
    queueId: params.queueId,
    youtubeId: params.youtubeId,
    submittedAt: Date.now(),
  }).run();
}
