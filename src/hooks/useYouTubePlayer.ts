"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | null;
  }
}

type PlayerState = -1 | 0 | 1 | 2 | 3 | 5;

interface UseYouTubePlayerOptions {
  onVideoEnd: () => void;
  onPlaybackResume?: () => void;
  onReady?: () => void;
}

export function useYouTubePlayer({ onVideoEnd, onPlaybackResume, onReady }: UseYouTubePlayerOptions) {
  const playerRef = useRef<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onVideoEndRef = useRef(onVideoEnd);
  onVideoEndRef.current = onVideoEnd;
  const onPlaybackResumeRef = useRef(onPlaybackResume);
  onPlaybackResumeRef.current = onPlaybackResume;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const lastStateRef = useRef<PlayerState | null>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript?.parentNode?.insertBefore(tag, firstScript);
    }

    const playerElement = document.getElementById("youtube-player");
    if (!playerElement) return;

    const createPlayer = () => {
      if (playerRef.current) return;
      playerRef.current = new YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          enablejsapi: 1,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            setIsReady(true);
            onReadyRef.current?.();
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            const state = event.data as PlayerState;

            if (
              state === YT.PlayerState.PLAYING &&
              lastStateRef.current === YT.PlayerState.PAUSED
            ) {
              onPlaybackResumeRef.current?.();
            }

            if (state === YT.PlayerState.ENDED) {
              const player = event.target;
              if (player && player.getCurrentTime() > 0.5) {
                onVideoEndRef.current();
              }
            }

            lastStateRef.current = state;
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  const loadVideoAt = useCallback((videoId: string, startSeconds = 0) => {
    if (!playerRef.current) return;

    if (startSeconds > 0) {
      playerRef.current.loadVideoById({
        videoId,
        startSeconds,
      });
      return;
    }

    playerRef.current.loadVideoById(videoId);
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  return { isReady, loadVideoAt, pause };
}
