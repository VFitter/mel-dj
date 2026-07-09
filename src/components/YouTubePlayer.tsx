"use client";

import { useEffect } from "react";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

interface YouTubePlayerProps {
  videoId: string | null;
  onVideoEnd: () => void;
  isAdPlaying: boolean;
}

export default function YouTubePlayer({ videoId, onVideoEnd, isAdPlaying }: YouTubePlayerProps) {
  const { isReady, loadVideo } = useYouTubePlayer({ onVideoEnd });

  useEffect(() => {
    if (isReady && videoId && !isAdPlaying) {
      loadVideo(videoId);
    }
  }, [isReady, videoId, isAdPlaying, loadVideo]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <div id="youtube-player" className="w-full h-full" />
      {isAdPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white">
            <p className="text-sm text-yellow-400 font-medium mb-1">Sponsored</p>
          </div>
        </div>
      )}
    </div>
  );
}
