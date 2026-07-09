"use client";

import { useEffect, useState } from "react";
import { Music, DollarSign, ExternalLink } from "lucide-react";

interface QueueItem {
  id: number;
  position: number;
  type: "track" | "ad";
  status: string;
  track?: {
    title: string;
    artist: string;
    thumbnailUrl: string | null;
    youtubeId: string;
  } | null;
  adCampaign?: {
    advertiserName: string;
  } | null;
}

export default function QueuePanel({ refreshTrigger }: { refreshTrigger: number }) {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    fetch("/api/queue")
      .then((r) => r.json())
      .then((data: QueueItem[]) => setQueue(data.slice(0, 10)));
  }, [refreshTrigger]);

  return (
    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
      <h2 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center justify-between">
        <span>Up Next</span>
        <span className="text-xs text-zinc-500">{queue.length} items</span>
      </h2>

      <div className="space-y-2">
        {queue.map((item) => (
          <div key={item.id} className={`flex items-center gap-2 p-2 rounded-lg ${
            item.type === "ad" ? "bg-yellow-500/5" : "bg-zinc-800/50"
          }`}>
            {item.type === "track" ? (
              <>
                <img
                  src={item.track?.thumbnailUrl || `https://i.ytimg.com/vi/${item.track?.youtubeId}/hqdefault.jpg`}
                  alt=""
                  className="w-8 h-6 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{item.track?.title || "Unknown"}</p>
                  <p className="text-zinc-500 text-[10px]">{item.track?.artist}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-6 rounded bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-3 w-3 text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-yellow-400 text-xs font-medium">Ad Spot</p>
                  <p className="text-zinc-500 text-[10px]">{item.adCampaign?.advertiserName || "Available"}</p>
                </div>
              </>
            )}
          </div>
        ))}
        {queue.length === 0 && (
          <p className="text-zinc-600 text-xs text-center py-4">Queue empty</p>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-800">
        <a
          href="/pricing"
          className="flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Ad slots available</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
