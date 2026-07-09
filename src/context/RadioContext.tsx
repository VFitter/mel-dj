"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

export interface RadioTrack {
  id: number;
  youtubeId: string;
  title: string;
  artist: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
}

export interface RadioAd {
  name: string;
  remaining: number;
  duration: number;
}

export interface PlaybackSyncRequest {
  queueItemId: number;
  youtubeId: string;
  elapsedSeconds: number;
  syncId: number;
}

interface RadioStateResponse {
  serverTime: number;
  revision: number;
  empty: boolean;
  nowPlaying: {
    queueItemId: number;
    type: "track" | "ad";
    startedAt: number;
    elapsedSeconds: number;
    durationSeconds: number;
    track: RadioTrack | null;
    adCampaign: {
      id: number;
      advertiserName: string;
      websiteUrl: string | null;
      pricingTierId: number;
    } | null;
  } | null;
}

interface RadioContextValue {
  currentTrack: RadioTrack | null;
  currentAd: RadioAd | null;
  isAdPlaying: boolean;
  loading: boolean;
  queueVersion: number;
  playbackSync: PlaybackSyncRequest | null;
  refreshQueue: () => void;
  resyncPlayback: () => void;
  handleVideoEnd: () => void;
  setDockTarget: (el: HTMLElement | null) => void;
  dockTarget: HTMLElement | null;
}

const RadioContext = createContext<RadioContextValue | null>(null);

/** Light poll — only to detect when the station advances to a new item. */
const TRACK_CHANGE_POLL_MS = 15000;

export function RadioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<RadioTrack | null>(null);
  const [currentAd, setCurrentAd] = useState<RadioAd | null>(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queueVersion, setQueueVersion] = useState(0);
  const [playbackSync, setPlaybackSync] = useState<PlaybackSyncRequest | null>(null);
  const [dockTarget, setDockTargetState] = useState<HTMLElement | null>(null);

  const lastQueueItemIdRef = useRef<number | null>(null);
  const forceResyncRef = useRef(false);
  const syncIdRef = useRef(0);
  const pollingRef = useRef(false);
  const adTimingRef = useRef<{ startedAt: number; duration: number; name: string } | null>(null);

  const requestPlaybackSync = useCallback(
    (
      nowPlaying: NonNullable<RadioStateResponse["nowPlaying"]>,
    ) => {
      if (nowPlaying.type !== "track" || !nowPlaying.track) return;

      syncIdRef.current += 1;
      setPlaybackSync({
        queueItemId: nowPlaying.queueItemId,
        youtubeId: nowPlaying.track.youtubeId,
        elapsedSeconds: nowPlaying.elapsedSeconds,
        syncId: syncIdRef.current,
      });
    },
    [],
  );

  const applyState = useCallback(
    (data: RadioStateResponse) => {
      if (data.empty || !data.nowPlaying) {
        lastQueueItemIdRef.current = null;
        adTimingRef.current = null;
        setCurrentTrack(null);
        setCurrentAd(null);
        setIsAdPlaying(false);
        setPlaybackSync(null);
        return;
      }

      const { nowPlaying } = data;
      const itemChanged = lastQueueItemIdRef.current !== nowPlaying.queueItemId;
      const shouldSyncPlayback = itemChanged || forceResyncRef.current;

      if (itemChanged) {
        lastQueueItemIdRef.current = nowPlaying.queueItemId;
        setQueueVersion((version) => version + 1);
      }

      forceResyncRef.current = false;

      if (nowPlaying.type === "ad" && nowPlaying.adCampaign) {
        setIsAdPlaying(true);
        setCurrentTrack(null);
        setPlaybackSync(null);
        adTimingRef.current = {
          startedAt: nowPlaying.startedAt,
          duration: nowPlaying.durationSeconds,
          name: nowPlaying.adCampaign.advertiserName,
        };
        setCurrentAd({
          name: nowPlaying.adCampaign.advertiserName,
          remaining: Math.max(0, nowPlaying.durationSeconds - nowPlaying.elapsedSeconds),
          duration: nowPlaying.durationSeconds,
        });
        return;
      }

      if (nowPlaying.type === "track" && nowPlaying.track) {
        adTimingRef.current = null;
        setIsAdPlaying(false);
        setCurrentAd(null);
        setCurrentTrack(nowPlaying.track);

        if (shouldSyncPlayback) {
          requestPlaybackSync(nowPlaying);
        }
      }
    },
    [requestPlaybackSync],
  );

  const pollState = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;

    try {
      const res = await fetch("/api/queue/state", { cache: "no-store" });
      if (!res.ok) return;
      const data: RadioStateResponse = await res.json();
      applyState(data);
    } finally {
      pollingRef.current = false;
      setLoading(false);
    }
  }, [applyState]);

  useEffect(() => {
    let cancelled = false;

    const runPoll = async () => {
      if (cancelled) return;
      await pollState();
    };

    void runPoll();
    const intervalId = window.setInterval(() => {
      void runPoll();
    }, TRACK_CHANGE_POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [pollState]);

  useEffect(() => {
    if (!isAdPlaying || !adTimingRef.current) return;

    const tick = () => {
      const timing = adTimingRef.current;
      if (!timing) return;

      const elapsed = Math.floor((Date.now() - timing.startedAt) / 1000);
      const remaining = Math.max(0, timing.duration - elapsed);
      setCurrentAd({
        name: timing.name,
        remaining,
        duration: timing.duration,
      });
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [isAdPlaying]);

  const handleVideoEnd = useCallback(() => {
    void pollState();
  }, [pollState]);

  const resyncPlayback = useCallback(() => {
    forceResyncRef.current = true;
    void pollState();
  }, [pollState]);

  const setDockTarget = useCallback((el: HTMLElement | null) => {
    setDockTargetState(el);
  }, []);

  const refreshQueue = useCallback(() => {
    setQueueVersion((version) => version + 1);
    void pollState();
  }, [pollState]);

  return (
    <RadioContext.Provider
      value={{
        currentTrack,
        currentAd,
        isAdPlaying,
        loading,
        queueVersion,
        playbackSync,
        refreshQueue,
        resyncPlayback,
        handleVideoEnd,
        setDockTarget,
        dockTarget,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio(): RadioContextValue {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used within RadioProvider");
  return ctx;
}
