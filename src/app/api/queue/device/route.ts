import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, createDeviceId, signDeviceToken, verifyDeviceToken } from "@/lib/device-token";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(req: NextRequest) {
  let deviceId: string | null = null;

  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    deviceId = verifyDeviceToken(cookieToken);
  }

  if (!deviceId) {
    try {
      const body = await req.json();
      const clientId = typeof body?.deviceId === "string" ? body.deviceId : null;
      if (clientId && /^[0-9a-f-]{36}$/i.test(clientId)) {
        deviceId = clientId;
      }
    } catch {
      // no body — create fresh device
    }
  }

  if (!deviceId) {
    deviceId = createDeviceId();
  }

  const token = signDeviceToken(deviceId);
  const res = NextResponse.json({ deviceId, token });

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return res;
}
