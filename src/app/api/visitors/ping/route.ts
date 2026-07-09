import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, createDeviceId, signDeviceToken, verifyDeviceToken } from "@/lib/device-token";
import { getClientIp } from "@/lib/request-identity";
import { trackVisitor } from "@/lib/visitors";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface PingBody {
  deviceId?: string;
  path?: string;
}

async function resolveDeviceId(req: NextRequest, body: PingBody): Promise<string> {
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    const verified = verifyDeviceToken(cookieToken);
    if (verified) return verified;
  }

  const clientId = typeof body.deviceId === "string" ? body.deviceId : null;
  if (clientId && /^[0-9a-f-]{36}$/i.test(clientId)) {
    return clientId;
  }

  return createDeviceId();
}

export async function POST(req: NextRequest) {
  let body: PingBody = {};
  try {
    body = await req.json();
  } catch {
    // body is optional
  }

  const deviceId = await resolveDeviceId(req, body);
  const ipAddress = getClientIp(req);
  const userAgent = req.headers.get("user-agent");
  const path = typeof body.path === "string" ? body.path.slice(0, 500) : null;

  await trackVisitor({
    deviceId,
    ipAddress,
    userAgent,
    path,
  });

  const token = signDeviceToken(deviceId);
  const res = NextResponse.json({ ok: true, deviceId });

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return res;
}
