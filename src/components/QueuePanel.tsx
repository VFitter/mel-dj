"use client";

import { useEffect, useState } from "react";
import { Music, DollarSign, ExternalLink, ChevronDown } from "lucide-react";
import { Card, CardContent, Badge, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import { localePath, type Locale } from "@/lib/i18n";

interface QueueItem {
  id: number;
  position: number;
  type: "track" | "ad";
  status: string;
  track?: {
    title: string;
    artist: string;
    thumbnailUrl: string | null;
    youtubeId: string;
  } | null;
  adCampaign?: {
    advertiserName: string;
  } | null;
}

function QueueHeaderContent({
  labels,
  count,
  showChevron,
}: {
  labels: { upNext: string; items: string };
  count: number;
  showChevron?: boolean;
}) {
  return (
    <>
      <span className="flex items-center gap-2 min-w-0">
        <Music className="h-4 w-4 text-brand-accent flex-shrink-0" />
        <span className="truncate">{labels.upNext}</span>
      </span>
      <span className="flex items-center gap-2 flex-shrink-0">
        <Badge variant="default">
          {count} {labels.items}
        </Badge>
        {showChevron && (
          <ChevronDown className="h-4 w-4 text-text-muted transition-transform group-open:rotate-180" />
        )}
      </span>
    </>
  );
}

function QueueList({
  queue,
  labels,
}: {
  queue: QueueItem[];
  labels: {
    adSpot: string;
    available: string;
    empty: string;
  };
}) {
  return (
    <div className="space-y-2">
      {queue.map((item) => (
        <div
          key={item.id}
          className={cn(
            "flex items-center gap-2 p-2 rounded-lg transition-colors min-w-0",
            item.type === "ad" ? "bg-warning/5 border border-warning/10" : "bg-surface-overlay/50",
          )}
        >
          {item.type === "track" ? (
            <>
              <img
                src={item.track?.thumbnailUrl || `https://i.ytimg.com/vi/${item.track?.youtubeId}/hqdefault.jpg`}
                alt=""
                className="w-8 h-6 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-xs font-medium truncate">{item.track?.title || "Unknown"}</p>
                <Text as="span" variant="caption" className="truncate">{item.track?.artist}</Text>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-6 rounded bg-warning/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-3 w-3 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <Text className="text-warning text-xs font-medium">{labels.adSpot}</Text>
                <Text variant="caption" className="truncate">
                  {item.adCampaign?.advertiserName || labels.available}
                </Text>
              </div>
            </>
          )}
        </div>
      ))}
      {queue.length === 0 && (
        <Text variant="caption" className="text-center py-4 block">{labels.empty}</Text>
      )}
    </div>
  );
}

function AdSlotsLink({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-border">
      <a
        href={localePath("/pricing", locale)}
        className="flex items-center justify-between gap-2 text-xs text-brand-accent hover:text-brand-accent-hover transition-colors touch-target min-h-10"
      >
        <span className="truncate">{label}</span>
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      </a>
    </div>
  );
}

export default function QueuePanel({
  refreshTrigger,
  locale = "en",
}: {
  refreshTrigger: number;
  locale?: Locale;
}) {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    fetch("/api/queue")
      .then((r) => r.json())
      .then((data: QueueItem[]) => setQueue(data.slice(0, 10)));
  }, [refreshTrigger]);

  const labels =
    locale === "fr"
      ? {
          upNext: "À suivre",
          items: "éléments",
          adSpot: "Emplacement pub",
          available: "Disponible",
          empty: "File vide",
          adSlots: "Emplacements pub disponibles",
        }
      : {
          upNext: "Up Next",
          items: "items",
          adSpot: "Ad Spot",
          available: "Available",
          empty: "Queue empty",
          adSlots: "Ad slots available",
        };

  return (
    <Card variant="glass">
      <CardContent className="p-3 sm:p-4">
        {/* lg+: always expanded */}
        <div className="hidden lg:block">
          <h2 className="text-sm font-semibold text-text-secondary mb-3 flex items-center justify-between gap-2">
            <QueueHeaderContent labels={labels} count={queue.length} />
          </h2>
          <QueueList queue={queue} labels={labels} />
          <AdSlotsLink locale={locale} label={labels.adSlots} />
        </div>

        {/* Below lg: collapsible via native details (no hydration mismatch) */}
        <details className="group lg:hidden">
          <summary
            className={cn(
              "text-sm font-semibold text-text-secondary mb-3 flex items-center justify-between gap-2",
              "cursor-pointer list-none touch-target [&::-webkit-details-marker]:hidden",
            )}
          >
            <QueueHeaderContent labels={labels} count={queue.length} showChevron />
          </summary>
          <div className="animate-fade-in">
            <QueueList queue={queue} labels={labels} />
            <AdSlotsLink locale={locale} label={labels.adSlots} />
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
