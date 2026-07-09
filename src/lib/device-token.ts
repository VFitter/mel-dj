import { createHmac, randomUUID, timingSafeEqual } from "crypto";

const COOKIE_NAME = "mel_device";
const TOKEN_VERSION = "v1";

function getSigningSecret(): string {
  return process.env.DEVICE_TOKEN_SECRET || process.env.ADMIN_PASSWORD || "mel-device-fallback-secret";
}

export function createDeviceId(): string {
  return randomUUID();
}

export function signDeviceToken(deviceId: string): string {
  const payload = `${TOKEN_VERSION}.${deviceId}`;
  const sig = createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyDeviceToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [version, deviceId, sig] = parts;
  if (version !== TOKEN_VERSION || !deviceId || !sig) return null;

  const expected = createHmac("sha256", getSigningSecret())
    .update(`${version}.${deviceId}`)
    .digest("base64url");

  try {
    const sigBuf = Buffer.from(sig, "base64url");
    const expectedBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;
    return deviceId;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
