"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Maximize2, ChevronDown, ChevronUp, Radio } from "lucide-react";
import { useRadio } from "@/context/RadioContext";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import AdOverlay from "@/components/AdOverlay";
import { localePath, type Locale } from "@/lib/i18n";

interface DockRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Persistent player mounted once in the root layout. The YouTube iframe is
 * never unmounted, so audio keeps playing across route changes:
 * - On the home page it docks over the registered placeholder element.
 * - Everywhere else (admin included) it floats as a picture-in-picture
 *   style mini player in the bottom-right corner.
 */
export default function GlobalPlayer() {
  const pathname = usePathname();
  const locale: Locale = pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
  const t =
    locale === "fr"
      ? {
          sponsored: "Sponsorisé",
          musicResumes: (s: number) => `La musique reprend dans ${s}s`,
          adLeft: (s: number) => `Pub · ${s}s restantes`,
          skip: "Passer",
          showVideo: "Afficher la vidéo",
          hideVideo: "Masquer la vidéo",
          openPlayer: "Ouvrir le lecteur complet",
        }
      : {
          sponsored: "Sponsored",
          musicResumes: (s: number) => `Music resumes in ${s}s`,
          adLeft: (s: number) => `Ad · ${s}s left`,
          showVideo: "Show video",
          hideVideo: "Hide video",
          openPlayer: "Open full player",
        };

  const {
    currentTrack,
    currentAd,
    isAdPlaying,
    playbackSync,
    handleVideoEnd,
    resyncPlayback,
    dockTarget,
  } = useRadio();

  const { isReady, loadVideoAt } = useYouTubePlayer({
    onVideoEnd: handleVideoEnd,
    onPlaybackResume: resyncPlayback,
  });
  const [rect, setRect] = useState<DockRect | null>(null);
  const [minimized, setMinimized] = useState(false);

  const lastSyncIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isReady || !playbackSync || isAdPlaying) return;

    if (lastSyncIdRef.current === playbackSync.syncId) return;

    lastSyncIdRef.current = playbackSync.syncId;
    loadVideoAt(playbackSync.youtubeId, playbackSync.elapsedSeconds);
  }, [isReady, playbackSync, isAdPlaying, loadVideoAt]);

  // Track the dock placeholder's document position (absolute positioning
  // scrolls with the page, so only size/layout changes need observing).
  useEffect(() => {
    if (!dockTarget) {
      setRect(null);
      return;
    }
    const update = () => {
      const r = dockTarget.getBoundingClientRect();
      setRect({
        top: r.top + window.scrollY,
        left: r.left + window.scrollX,
        width: r.width,
        height: r.height,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(dockTarget);
    ro.observe(document.body);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [dockTarget]);

  const docked = Boolean(dockTarget && rect);
  const hasContent = Boolean(currentTrack || isAdPlaying);

  return (
    <div
      className={
        docked
          ? "absolute z-30"
          : `fixed right-4 z-[var(--z-toast)] w-[calc(100vw-2rem-var(--safe-left)-var(--safe-right))] max-w-[20rem] sm:max-w-[22rem] max-[220px]:right-[var(--content-gutter)] max-[220px]:max-w-[calc(100vw-var(--content-gutter)*2)] bottom-[calc(var(--player-bar-height,4rem)+var(--safe-bottom)+0.75rem)] ${
              hasContent ? "" : "hidden"
            }`
      }
      style={
        docked && rect
          ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
          : undefined
      }
    >
      <div
        className={
          docked
            ? "relative w-full h-full bg-black rounded-xl overflow-hidden"
            : "rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/60"
        }
      >
        {/* Video — kept mounted at all times. Collapsed (not unmounted) when minimized. */}
        <div
          className={
            docked
              ? "relative w-full h-full"
              : `relative w-full bg-black transition-all ${
                  minimized ? "h-0" : "aspect-video"
                }`
          }
        >
          <div id="youtube-player" className="w-full h-full" />

          {/* Ad overlay */}
          {isAdPlaying && currentAd && docked && (
            <AdOverlay
              name={currentAd.name}
              remaining={currentAd.remaining}
              duration={currentAd.duration}
            />
          )}
          {isAdPlaying && currentAd && !docked && !minimized && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-b from-black/90 via-zinc-900/90 to-black/90 px-3 text-center">
              <span className="rounded-full border border-yellow-500/30 bg-yellow-500/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-yellow-400">
                {t.sponsored}
              </span>
              <p className="truncate text-lg font-bold text-white max-w-full">
                {currentAd.name}
              </p>
              <p className="text-xs text-zinc-400">
                {t.musicResumes(currentAd.remaining)}
              </p>
            </div>
          )}
        </div>

        {/* Mini player control bar (only in floating mode) */}
        {!docked && (
          <div
            className={`flex items-center gap-2 px-3 py-2 ${
              isAdPlaying ? "bg-yellow-900/30" : "bg-zinc-900"
            }`}
          >
            {isAdPlaying ? (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-yellow-500/20">
                <span className="text-[10px] font-bold text-yellow-400">AD</span>
              </div>
            ) : currentTrack ? (
              <img
                src={
                  currentTrack.thumbnailUrl ||
                  `https://i.ytimg.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`
                }
                alt=""
                className="h-8 w-8 flex-shrink-0 rounded object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-zinc-800">
                <Radio className="h-4 w-4 text-zinc-500" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              {isAdPlaying && currentAd ? (
                <>
                  <p className="truncate text-xs font-medium text-yellow-400">
                    {currentAd.name}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {t.adLeft(currentAd.remaining)}
                  </p>
                </>
              ) : currentTrack ? (
                <>
                  <p className="truncate text-xs font-medium text-white">
                    {currentTrack.title}
                  </p>
                  <p className="truncate text-[10px] text-zinc-400">
                    {currentTrack.artist}
                  </p>
                </>
              ) : (
                <p className="text-xs text-zinc-500">MEL Radio</p>
              )}
            </div>

            <button
              onClick={() => setMinimized((m) => !m)}
              className="p-1.5 text-zinc-400 transition-colors hover:text-white"
              title={minimized ? t.showVideo : t.hideVideo}
              aria-label={minimized ? t.showVideo : t.hideVideo}
            >
              {minimized ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <Link
              href={localePath("/", locale)}
              className="p-1.5 text-zinc-400 transition-colors hover:text-white"
              title={t.openPlayer}
              aria-label={t.openPlayer}
            >
              <Maximize2 className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
