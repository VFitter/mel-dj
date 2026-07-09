const DEVICE_ID_KEY = "mel_device_id";
const DEVICE_TOKEN_KEY = "mel_device_token";

export function getStoredDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(DEVICE_ID_KEY);
  } catch {
    return null;
  }
}

export function getStoredDeviceToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(DEVICE_TOKEN_KEY);
  } catch {
    return null;
  }
}

function persistDevice(deviceId: string, token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
    localStorage.setItem(DEVICE_TOKEN_KEY, token);
  } catch {
    // localStorage may be blocked in private mode
  }
}

export async function ensureDeviceRegistered(): Promise<{ deviceId: string; token: string } | null> {
  const res = await fetch("/api/queue/device", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId: getStoredDeviceId() }),
  });

  if (!res.ok) return null;

  const data: { deviceId: string; token: string } = await res.json();
  persistDevice(data.deviceId, data.token);
  return data;
}

export function deviceHeaders(deviceId: string, token: string): HeadersInit {
  return {
    "X-Device-Id": deviceId,
    "X-Device-Token": token,
  };
}
