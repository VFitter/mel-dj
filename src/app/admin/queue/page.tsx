"use client";

import { useEffect, useState } from "react";
import { Play, SkipForward, RotateCcw, Music, DollarSign } from "lucide-react";

interface QueueItem {
  id: number;
  position: number;
  type: "track" | "ad";
  trackId: number | null;
  adCampaignId: number | null;
  status: string;
  track?: { title: string; artist: string; thumbnailUrl: string | null; youtubeId: string } | null;
  adCampaign?: { advertiserName: string } | null;
}

export default function AdminQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  function loadQueue() {
    fetch("/api/queue")
      .then((r) => r.json())
      .then(setQueue);
  }

  useEffect(() => { loadQueue(); }, []);

  async function skipTo(id: number) {
    await fetch("/api/queue/next", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queueItemId: id }),
    });
    loadQueue();
  }

  async function refill() {
    await fetch("/api/queue/refill", { method: "POST" });
    loadQueue();
  }

  async function removeItem(id: number) {
    await fetch("/api/queue", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadQueue();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Queue</h1>
        <button onClick={refill} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-lg text-sm">
          <RotateCcw className="h-4 w-4" />
          Refill Queue
        </button>
      </div>

      <div className="space-y-2">
        {queue.map((item, i) => (
          <div key={item.id} className={`rounded-lg border p-3 flex items-center gap-3 ${
            item.status === "playing"
              ? "bg-blue-600/10 border-blue-500/30"
              : item.type === "ad"
              ? "bg-yellow-500/10 border-yellow-500/20"
              : "bg-zinc-900 border-zinc-800"
          }`}>
            <span className="text-zinc-500 text-sm w-6 text-right">{i + 1}</span>

            {item.type === "track" ? (
              <>
                <img
                  src={item.track?.thumbnailUrl || `https://i.ytimg.com/vi/${item.track?.youtubeId}/hqdefault.jpg`}
                  alt=""
                  className="w-10 h-7 rounded object-cover flex-shrink-0"
                />
                <Music className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.track?.title || "Unknown"}</p>
                  <p className="text-zinc-500 text-xs">{item.track?.artist}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-7 rounded bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-yellow-400 text-sm font-medium">Ad Slot</p>
                  <p className="text-zinc-500 text-xs">{item.adCampaign?.advertiserName || "Open Slot"}</p>
                </div>
              </>
            )}

            <span className={`text-xs px-2 py-1 rounded-full ${
              item.status === "playing" ? "bg-blue-500/20 text-blue-400" :
              item.status === "played" ? "bg-zinc-700 text-zinc-500" :
              "bg-zinc-700 text-zinc-400"
            }`}>
              {item.status}
            </span>

            {item.status === "pending" && (
              <>
                <button onClick={() => skipTo(item.id)} className="text-zinc-500 hover:text-blue-400 p-1" title="Play now">
                  <Play className="h-4 w-4" />
                </button>
                <button onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-red-400 p-1" title="Remove">
                  <SkipForward className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
        {queue.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-8">Queue is empty. Add tracks or refill.</p>
        )}
      </div>
    </div>
  );
}
