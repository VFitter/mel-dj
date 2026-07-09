"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface Track {
  id: number;
  youtubeId: string;
  title: string;
  artist: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
}

interface AdSlot {
  advertiserName: string;
  websiteUrl: string | null;
  durationSeconds: number;
}

interface QueueNextResponse {
  type: "track" | "ad";
  track?: Track | null;
  adCampaign?: {
    id: number;
    advertiserName: string;
    websiteUrl: string | null;
    pricingTierId: number;
  } | null;
  empty?: boolean;
}

export function useDJRadio() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentAd, setCurrentAd] = useState<{ name: string; remaining: number; duration: number } | null>(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [currentQueueItemId, setCurrentQueueItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextCallbackRef = useRef<(() => void) | null>(null);

  const fetchNext = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/queue/next", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentQueueItemId: currentQueueItemId }),
    });
    const data: QueueNextResponse = await res.json();

    if (data.empty) {
      setLoading(false);
      return;
    }

    if (data.type === "ad" && data.adCampaign) {
      const tierRes = await fetch(`/api/ads/tiers`);
      const tiers = await tierRes.json();
      const tier = tiers.find((t: { id: number }) => t.id === data.adCampaign!.pricingTierId);
      const adDuration = tier?.durationSeconds || 15;

      setIsAdPlaying(true);
      setCurrentAd({
        name: data.adCampaign.advertiserName,
        remaining: adDuration,
        duration: adDuration,
      });
      setCurrentQueueItemId(null);

      adTimerRef.current = setInterval(() => {
        setCurrentAd((prev) => {
          if (!prev || prev.remaining <= 1) {
            clearInterval(adTimerRef.current!);
            adTimerRef.current = null;
            setIsAdPlaying(false);
            setCurrentAd(null);
            nextCallbackRef.current?.();
            return null;
          }
          return { ...prev, remaining: prev.remaining - 1 };
        });
      }, 1000);
    } else if (data.type === "track" && data.track) {
      setCurrentTrack(data.track);
      setIsAdPlaying(false);
      setCurrentAd(null);
    }

    setLoading(false);
  }, [currentQueueItemId]);

  useEffect(() => {
    fetchNext();
    return () => {
      if (adTimerRef.current) clearInterval(adTimerRef.current);
    };
  }, []);

  const onVideoEnd = useCallback(() => {
    nextCallbackRef.current = () => {
      fetchNext();
    };
  }, [fetchNext]);

  return {
    currentTrack,
    currentAd,
    isAdPlaying,
    loading,
    onVideoEnd,
    fetchNext,
  };
}
