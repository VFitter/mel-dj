"use client";

import { useState, useCallback } from "react";
import YouTubePlayer from "@/components/YouTubePlayer";
import PlayerBar from "@/components/PlayerBar";
import QueuePanel from "@/components/QueuePanel";
import AdOverlay from "@/components/AdOverlay";
import { useDJRadio } from "@/hooks/useDJRadio";
import Link from "next/link";
import { Radio } from "lucide-react";

export default function Home() {
  const {
    currentTrack,
    currentAd,
    isAdPlaying,
    loading,
    onVideoEnd,
    fetchNext,
  } = useDJRadio();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSkip = useCallback(() => {
    fetchNext();
    setRefreshTrigger((t) => t + 1);
  }, [fetchNext]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-blue-400" />
            <span className="font-bold text-white">MEL Radio</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">Advertise</Link>
            <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact</Link>
            <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="relative">
              <YouTubePlayer
                videoId={currentTrack?.youtubeId ?? null}
                onVideoEnd={() => {
                  onVideoEnd();
                  setRefreshTrigger((t) => t + 1);
                }}
                isAdPlaying={isAdPlaying}
              />
              {isAdPlaying && currentAd && (
                <AdOverlay
                  name={currentAd.name}
                  remaining={currentAd.remaining}
                  duration={currentAd.duration}
                />
              )}
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-6 bg-zinc-800 rounded w-64" />
                  <div className="h-4 bg-zinc-800 rounded w-48" />
                </div>
              ) : currentTrack ? (
                <>
                  <h1 className="text-xl font-bold text-white">{currentTrack.title}</h1>
                  <p className="text-zinc-400">{currentTrack.artist}</p>
                </>
              ) : (
                <div className="text-center py-12">
                  <Radio className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                  <h2 className="text-lg font-medium text-zinc-400">No tracks in queue</h2>
                  <p className="text-zinc-600 text-sm mt-1">Admin needs to add tracks</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <QueuePanel refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>

      <PlayerBar
        track={currentTrack}
        isAdPlaying={isAdPlaying}
        onSkip={handleSkip}
      />
    </div>
  );
}
