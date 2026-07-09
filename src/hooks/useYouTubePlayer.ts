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
  onReady?: () => void;
}

export function useYouTubePlayer({ onVideoEnd, onReady }: UseYouTubePlayerOptions) {
  const playerRef = useRef<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onVideoEndRef = useRef(onVideoEnd);
  onVideoEndRef.current = onVideoEnd;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

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
            if (event.data === YT.PlayerState.ENDED) {
              const player = event.target;
              if (player && player.getCurrentTime() > 0.5) {
                onVideoEndRef.current();
              }
            }
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

  const loadVideo = useCallback((videoId: string) => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    }
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  return { isReady, loadVideo, pause };
}
