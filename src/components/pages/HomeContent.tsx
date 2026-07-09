"use client";

import PlayerBar from "@/components/PlayerBar";
import QueuePanel from "@/components/QueuePanel";
import QueueSubmitForm from "@/components/QueueSubmitForm";
import PageShell from "@/components/layout/PageShell";
import { Heading, Text, Skeleton } from "@/components/ui";
import { useRadio } from "@/context/RadioContext";
import { Radio } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const copy = {
  en: {
    noTracks: "No tracks in queue",
    addTracks: "Add a YouTube link below to request a song",
  },
  fr: {
    noTracks: "Aucune piste en file d'attente",
    addTracks: "Ajoutez un lien YouTube ci-dessous pour demander une chanson",
  },
} as const;

interface HomeContentProps {
  locale?: Locale;
}

export default function HomeContent({ locale = "en" }: HomeContentProps) {
  const t = copy[locale];
  const { currentTrack, isAdPlaying, loading, queueVersion, setDockTarget, refreshQueue } = useRadio();

  return (
    <PageShell locale={locale} className="py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-3 space-y-3 sm:space-y-4 min-w-0">
          <div
            ref={setDockTarget}
            className="w-full aspect-video max-[220px]:aspect-square bg-surface-base rounded-xl sm:rounded-2xl border border-border shadow-lg overflow-hidden"
          />
          <div className="animate-fade-in min-w-0">
            {loading && !currentTrack && !isAdPlaying ? (
              <div className="space-y-2">
                <Skeleton className="h-6 sm:h-7 w-full max-w-xs" />
                <Skeleton className="h-4 w-full max-w-[12rem]" />
              </div>
            ) : currentTrack ? (
              <>
                <Heading as="h1" size="md" className="line-clamp-2 break-words">
                  {currentTrack.title}
                </Heading>
                <Text variant="secondary" className="truncate mt-0.5">
                  {currentTrack.artist}
                </Text>
              </>
            ) : !isAdPlaying ? (
              <div className="text-center py-8 sm:py-12">
                <Radio className="h-10 w-10 sm:h-12 sm:w-12 text-text-muted mx-auto mb-3" />
                <Heading as="h2" size="sm" className="text-text-secondary">
                  {t.noTracks}
                </Heading>
                <Text variant="muted" className="mt-1 max-[220px]:text-xs">
                  {t.addTracks}
                </Text>
              </div>
            ) : null}
          </div>
          <QueueSubmitForm locale={locale} onSubmitted={refreshQueue} />
        </div>

        <div className="lg:col-span-1 min-w-0">
          <QueuePanel refreshTrigger={queueVersion} locale={locale} />
        </div>
      </div>

      <PlayerBar track={currentTrack} isAdPlaying={isAdPlaying} locale={locale} />
    </PageShell>
  );
}
