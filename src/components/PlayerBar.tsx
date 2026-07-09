"use client";

import { Play, Pause, SkipForward, Volume2, ExternalLink } from "lucide-react";

interface PlayerBarProps {
  track: {
    title: string;
    artist: string;
    thumbnailUrl: string | null;
    youtubeId: string;
  } | null;
  isAdPlaying: boolean;
  onSkip?: () => void;
}

export default function PlayerBar({ track, isAdPlaying, onSkip }: PlayerBarProps) {
  if (!track && !isAdPlaying) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-3 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center">
              <Play className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-zinc-500 text-sm">No track playing</p>
              <p className="text-zinc-600 text-xs">Add tracks in admin</p>
            </div>
          </div>
          <a href="/pricing" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            Advertise Here
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t px-4 py-3 z-50 ${
      isAdPlaying ? "bg-yellow-900/30 border-yellow-600/30" : "bg-zinc-900/95 border-zinc-800 backdrop-blur"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {isAdPlaying ? (
            <div className="w-10 h-10 rounded bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-400 text-xs font-bold">AD</span>
            </div>
          ) : track && (
            <img
              src={track.thumbnailUrl || `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`}
              alt=""
              className="w-10 h-10 rounded object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            {isAdPlaying ? (
              <p className="text-yellow-400 text-sm font-medium">Advertisement</p>
            ) : track && (
              <>
                <p className="text-white text-sm font-medium truncate">{track.title}</p>
                <p className="text-zinc-400 text-xs truncate">{track.artist}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAdPlaying && onSkip && (
            <button onClick={onSkip} className="text-zinc-400 hover:text-white p-2" title="Skip">
              <SkipForward className="h-5 w-5" />
            </button>
          )}
          <a
            href="/pricing"
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors ml-2"
          >
            Advertise Here
          </a>
        </div>
      </div>
    </div>
  );
}
