"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapVisitor {
  id: number;
  deviceId: string;
  ipAddress: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  region: string | null;
  country: string | null;
  lastPath: string | null;
  firstSeenAt: number;
  lastSeenAt: number;
}

interface VisitorsMapProps {
  visitors: MapVisitor[];
}

function formatLocation(visitor: MapVisitor): string {
  const parts = [visitor.city, visitor.region, visitor.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown location";
}

function jitterCoordinates(lat: number, lng: number, index: number): [number, number] {
  const angle = (index * 137.5 * Math.PI) / 180;
  const radius = 0.02 + (index % 5) * 0.008;
  return [lat + Math.sin(angle) * radius, lng + Math.cos(angle) * radius];
}

export default function VisitorsMap({ visitors }: VisitorsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  const mappable = visitors.filter(
    (v) => v.latitude != null && v.longitude != null,
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      renderMarkers(L, map, mappable);

      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    });

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    void import("leaflet").then((L) => {
      if (!mapRef.current) return;
      renderMarkers(L, mapRef.current, mappable);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitors]);

  function renderMarkers(
    L: typeof import("leaflet"),
    map: LeafletMap,
    items: MapVisitor[],
  ) {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const icon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;border-radius:50%;background:#e85d4c;border:2px solid #fff;box-shadow:0 0 8px rgba(232,93,76,0.6);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    const bounds: [number, number][] = [];

    items.forEach((visitor, index) => {
      if (visitor.latitude == null || visitor.longitude == null) return;

      const [lat, lng] = jitterCoordinates(visitor.latitude, visitor.longitude, index);
      bounds.push([lat, lng]);

      const marker = L.marker([lat, lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="min-width:200px;font-family:system-ui,sans-serif;font-size:13px;line-height:1.5;">
          <strong style="display:block;margin-bottom:6px;color:#111;">Visitor</strong>
          <div><strong>Device ID:</strong><br/><code style="font-size:11px;word-break:break-all;">${visitor.deviceId}</code></div>
          <div style="margin-top:6px;"><strong>IP:</strong> ${visitor.ipAddress}</div>
          <div style="margin-top:4px;"><strong>Location:</strong> ${formatLocation(visitor)}</div>
          ${visitor.lastPath ? `<div style="margin-top:4px;"><strong>Last page:</strong> ${visitor.lastPath}</div>` : ""}
          <div style="margin-top:4px;color:#666;font-size:11px;">Last seen: ${new Date(visitor.lastSeenAt).toLocaleString()}</div>
        </div>
      `);
      markersRef.current.push(marker);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 10);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }

    requestAnimationFrame(() => {
      map.invalidateSize();
    });
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[280px] sm:h-[400px] lg:h-[520px] w-full rounded-xl border border-zinc-800 overflow-hidden z-0"
      />
      {mappable.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-sm text-zinc-500 bg-zinc-900/80 px-4 py-2 rounded-lg">
            No geolocated visitors yet. Visitors appear after they load the site.
          </p>
        </div>
      )}
    </div>
  );
}
