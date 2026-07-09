"use client";

import { useEffect, useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";

interface Track {
  id: number;
  youtubeUrl: string;
  youtubeId: string;
  title: string;
  artist: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
  status: string;
}

export default function AdminTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTracks() {
    const res = await fetch("/api/tracks");
    const data = await res.json();
    setTracks(data);
  }

  useEffect(() => { loadTracks(); }, []);

  async function addTrack(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/tracks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (res.ok) {
      setUrl("");
      loadTracks();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add track");
    }
    setLoading(false);
  }

  async function removeTrack(id: number) {
    if (!confirm("Remove this track?")) return;
    await fetch("/api/tracks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadTracks();
  }

  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Tracks</h1>

      <form onSubmit={addTrack} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">Add YouTube Track</h2>
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {loading ? "Adding..." : "Add Track"}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {tracks.map((track) => (
          <div key={track.id} className="bg-zinc-900 rounded-lg border border-zinc-800 p-3 flex items-center gap-3">
            <img
              src={track.thumbnailUrl || `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`}
              alt=""
              className="w-12 h-9 rounded object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{track.title}</p>
              <p className="text-zinc-500 text-xs">{track.artist} · {formatDuration(track.durationSeconds)}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              track.status === "active" ? "bg-green-500/20 text-green-400" :
              track.status === "archived" ? "bg-red-500/20 text-red-400" :
              "bg-zinc-700 text-zinc-400"
            }`}>
              {track.status}
            </span>
            <a href={track.youtubeUrl} target="_blank" className="text-zinc-500 hover:text-white p-1">
              <ExternalLink className="h-4 w-4" />
            </a>
            <button onClick={() => removeTrack(track.id)} className="text-zinc-500 hover:text-red-400 p-1">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {tracks.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-8">No tracks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}
