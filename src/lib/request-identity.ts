import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { COOKIE_NAME, verifyDeviceToken } from "@/lib/device-token";
import { hashIp } from "@/lib/cooldown";

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export interface RequestIdentity {
  deviceId: string;
  ipHash: string;
}

export async function resolveRequestIdentity(req: NextRequest): Promise<RequestIdentity | null> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(COOKIE_NAME)?.value;
  const headerToken = req.headers.get("x-device-token");

  const token = cookieToken || headerToken;
  if (!token) return null;

  const deviceId = verifyDeviceToken(token);
  if (!deviceId) return null;

  const headerDeviceId = req.headers.get("x-device-id");
  if (headerDeviceId && headerDeviceId !== deviceId) return null;

  return {
    deviceId,
    ipHash: hashIp(getClientIp(req)),
  };
}
