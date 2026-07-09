"use client";

import { useEffect, useState } from "react";
import { MapPin, RefreshCw, Users } from "lucide-react";
import VisitorsMap, { type MapVisitor } from "@/components/admin/VisitorsMap";

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<MapVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadVisitors() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/visitors");
      if (!res.ok) throw new Error("Failed to load visitors");
      const data = (await res.json()) as MapVisitor[];
      setVisitors(data);
    } catch {
      setError("Could not load visitor data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVisitors();
    const interval = setInterval(() => {
      void loadVisitors();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const geolocated = visitors.filter((v) => v.latitude != null && v.longitude != null);
  const recent = visitors.filter((v) => Date.now() - v.lastSeenAt < 60 * 60 * 1000);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 hidden lg:flex">
            <MapPin className="h-6 w-6 text-brand-primary shrink-0" />
            Visitor Map
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Live map of site visitors with device ID and IP address.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadVisitors()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
            <Users className="h-4 w-4" />
            Total Visitors
          </div>
          <p className="text-2xl font-bold text-white">{visitors.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
            <MapPin className="h-4 w-4" />
            On Map
          </div>
          <p className="text-2xl font-bold text-white">{geolocated.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
            <RefreshCw className="h-4 w-4" />
            Active (1h)
          </div>
          <p className="text-2xl font-bold text-white">{recent.length}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <VisitorsMap visitors={visitors} />

      <div className="mt-6 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">All Visitors</h2>
        </div>

        <div className="md:hidden divide-y divide-zinc-800">
          {visitors.map((visitor) => (
            <div key={visitor.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500">Device ID</p>
                  <p className="font-mono text-xs text-zinc-300 break-all">{visitor.deviceId}</p>
                </div>
                <p className="text-xs text-zinc-500 shrink-0">{new Date(visitor.lastSeenAt).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-zinc-500">IP</p>
                  <p className="text-zinc-300">{visitor.ipAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Location</p>
                  <p className="text-zinc-300">{[visitor.city, visitor.country].filter(Boolean).join(", ") || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Last Page</p>
                <p className="text-sm text-zinc-300 break-all">{visitor.lastPath || "—"}</p>
              </div>
            </div>
          ))}
          {visitors.length === 0 && !loading && (
            <p className="px-4 py-8 text-center text-zinc-500 text-sm">No visitors recorded yet.</p>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-800">
                <th className="px-4 py-2 font-medium">Device ID</th>
                <th className="px-4 py-2 font-medium">IP</th>
                <th className="px-4 py-2 font-medium">Location</th>
                <th className="px-4 py-2 font-medium">Last Page</th>
                <th className="px-4 py-2 font-medium">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="text-zinc-300">
                  <td className="px-4 py-2 font-mono text-xs max-w-[200px] truncate" title={visitor.deviceId}>
                    {visitor.deviceId}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{visitor.ipAddress}</td>
                  <td className="px-4 py-2">
                    {[visitor.city, visitor.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-2">{visitor.lastPath || "—"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-zinc-500">
                    {new Date(visitor.lastSeenAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    No visitors recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
