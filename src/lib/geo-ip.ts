export interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string | null;
  region: string | null;
  country: string | null;
}

function isPrivateOrLocalIp(ip: string): boolean {
  if (ip === "unknown" || ip === "::1" || ip === "127.0.0.1") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("169.254.")) return true;
  if (ip.startsWith("172.")) {
    const second = Number(ip.split(".")[1]);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

function devFallbackGeo(ip: string): GeoLocation | null {
  if (process.env.NODE_ENV !== "development" || !isPrivateOrLocalIp(ip)) return null;

  const seed = ip.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const angle = (seed * 137.5 * Math.PI) / 180;

  return {
    latitude: 43.6532 + Math.sin(angle) * 0.15,
    longitude: -79.3832 + Math.cos(angle) * 0.15,
    city: "Local (dev)",
    region: "ON",
    country: "Canada",
  };
}

export async function lookupGeoIp(ip: string): Promise<GeoLocation | null> {
  const devGeo = devFallbackGeo(ip);
  if (devGeo) return devGeo;

  if (isPrivateOrLocalIp(ip)) return null;

  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      success?: boolean;
      latitude?: number;
      longitude?: number;
      city?: string;
      region?: string;
      country?: string;
    };

    if (!data.success || data.latitude == null || data.longitude == null) return null;

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city ?? null,
      region: data.region ?? null,
      country: data.country ?? null,
    };
  } catch {
    return null;
  }
}
