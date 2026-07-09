"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getStoredDeviceId } from "@/lib/device-id-client";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    fetch("/api/visitors/ping", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: getStoredDeviceId(),
        path: pathname,
      }),
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{ deviceId: string }>;
      })
      .then((data) => {
        if (!data?.deviceId || typeof window === "undefined") return;
        try {
          localStorage.setItem("mel_device_id", data.deviceId);
        } catch {
          // localStorage may be blocked
        }
      })
      .catch(() => {
        // tracking is best-effort
      });
  }, [pathname]);

  return null;
}
