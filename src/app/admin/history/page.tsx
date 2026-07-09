"use client";

import { useEffect, useState } from "react";
import { Music, DollarSign } from "lucide-react";

interface HistoryItem {
  id: number;
  wasAdSlot: boolean;
  playedAt: number;
  track?: { title: string; artist: string } | null;
  adCampaign?: { advertiserName: string } | null;
}

export default function AdminHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch("/api/queue/history")
      .then(r => r.json())
      .then(setHistory);
  }, []);

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 hidden lg:block">Play History</h1>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="divide-y divide-zinc-800">
          {history.map(item => (
            <div key={item.id} className="p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {item.wasAdSlot ? (
                  <DollarSign className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Music className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-white text-sm min-w-0">
                  {item.wasAdSlot
                    ? `Ad: ${item.adCampaign?.advertiserName || "Unknown"}`
                    : `${item.track?.title || "Unknown"} — ${item.track?.artist || ""}`
                  }
                </p>
              </div>
              <span className="text-xs text-zinc-500 pl-7 sm:pl-0 shrink-0">
                {new Date(item.playedAt).toLocaleString()}
              </span>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-8">No play history yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
