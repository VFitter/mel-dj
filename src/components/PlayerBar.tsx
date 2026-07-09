"use client";

import { SkipForward, Play, ExternalLink, Megaphone } from "lucide-react";
import { IconButton, Badge, Text } from "@/components/ui";
import { cn } from "@/lib/cn";

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

function AdvertiseLink({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="/pricing"
      className={cn(
        "inline-flex items-center justify-center gap-1 font-medium rounded-md bg-brand-primary hover:bg-brand-primary-hover text-white shadow-glow transition-all touch-target",
        compact
          ? "h-9 w-9 p-0 max-[220px]:h-8 max-[220px]:w-8"
          : "h-9 px-3 text-xs ml-1 sm:ml-2",
      )}
      aria-label="Advertise on MEL Radio"
      title="Advertise Here"
    >
      {compact ? (
        <Megaphone className="h-4 w-4" />
      ) : (
        <>
          <Megaphone className="h-4 w-4 max-[220px]:inline hidden sm:hidden" />
          <span className="hidden sm:inline">Advertise Here</span>
          <span className="sm:hidden max-[220px]:hidden">Ads</span>
          <ExternalLink className="h-3 w-3 hidden sm:inline" />
        </>
      )}
    </a>
  );
}

export default function PlayerBar({ track, isAdPlaying, onSkip }: PlayerBarProps) {
  const barClass = cn(
    "fixed bottom-0 left-0 right-0 z-[var(--z-player)]",
    "pb-[calc(var(--safe-bottom))]",
    "bg-surface-glass backdrop-blur-lg backdrop-saturate-150 border-t border-border",
    isAdPlaying && "border-warning/30",
  );

  if (!track && !isAdPlaying) {
    return (
      <div className={barClass}>
        <div
          className="max-w-7xl mx-auto flex items-center justify-between gap-2 px-safe"
          style={{ minHeight: "var(--player-bar-height)" }}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-surface-overlay rounded-lg flex items-center justify-center flex-shrink-0">
              <Play className="h-4 w-4 sm:h-5 sm:w-5 text-text-muted" />
            </div>
            <div className="min-w-0">
              <Text variant="secondary" className="text-xs sm:text-sm truncate">
                No track playing
              </Text>
              <Text variant="caption" className="truncate max-[220px]:hidden">
                Add tracks in admin
              </Text>
            </div>
          </div>
          <AdvertiseLink compact={false} />
        </div>
      </div>
    );
  }

  return (
    <div className={barClass}>
      <div
        className="max-w-7xl mx-auto flex items-center justify-between gap-2 px-safe"
        style={{ minHeight: "var(--player-bar-height)" }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {isAdPlaying ? (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
              <Badge variant="warning">AD</Badge>
            </div>
          ) : (
            track && (
              <img
                src={track.thumbnailUrl || `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`}
                alt=""
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0 ring-1 ring-border"
              />
            )
          )}
          <div className="min-w-0">
            {isAdPlaying ? (
              <Text className="text-warning text-xs sm:text-sm font-medium truncate">Advertisement</Text>
            ) : (
              track && (
                <>
                  <p className="text-text-primary text-xs sm:text-sm font-medium line-clamp-1">{track.title}</p>
                  <Text variant="caption" className="truncate">{track.artist}</Text>
                </>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {!isAdPlaying && onSkip && (
            <IconButton onClick={onSkip} label="Skip" size="md" className="touch-target">
              <SkipForward className="h-5 w-5" />
            </IconButton>
          )}
          <AdvertiseLink compact={false} />
        </div>
      </div>
    </div>
  );
}
