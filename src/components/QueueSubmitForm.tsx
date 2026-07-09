"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Clock, ListMusic, Plus } from "lucide-react";
import { Alert, Button, Card, CardContent, Input, Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  deviceHeaders,
  ensureDeviceRegistered,
  getStoredDeviceId,
  getStoredDeviceToken,
} from "@/lib/device-id-client";
import type { Locale } from "@/lib/i18n";

interface CooldownStatus {
  allowed: boolean;
  retryAfterMs: number;
  nextAvailableAt: number | null;
}

const copy = {
  en: {
    title: "Add a song",
    subtitle: "Paste a YouTube link — one request every 30 minutes per device.",
    placeholder: "https://youtube.com/watch?v=…",
    submit: "Add to queue",
    submitting: "Adding…",
    cooldown: "Next request in",
    success: "Added to the queue!",
    invalidUrl: "Enter a valid YouTube URL.",
    deviceError: "Could not verify your device. Refresh and try again.",
    genericError: "Something went wrong. Try again shortly.",
  },
  fr: {
    title: "Ajouter une chanson",
    subtitle: "Collez un lien YouTube — une demande toutes les 30 minutes par appareil.",
    placeholder: "https://youtube.com/watch?v=…",
    submit: "Ajouter à la file",
    submitting: "Ajout…",
    cooldown: "Prochaine demande dans",
    success: "Ajouté à la file d'attente !",
    invalidUrl: "Entrez une URL YouTube valide.",
    deviceError: "Impossible de vérifier votre appareil. Actualisez et réessayez.",
    genericError: "Une erreur s'est produite. Réessayez bientôt.",
  },
} as const;

function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function QueueSubmitForm({
  locale = "en",
  onSubmitted,
}: {
  locale?: Locale;
  onSubmitted?: () => void;
}) {
  const t = copy[locale];
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceReady, setDeviceReady] = useState(false);
  const [cooldown, setCooldown] = useState<CooldownStatus | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCooldown = useCallback(async () => {
    const deviceId = getStoredDeviceId();
    const token = getStoredDeviceToken();
    if (!deviceId || !token) return;

    const res = await fetch("/api/queue/cooldown", {
      credentials: "include",
      headers: deviceHeaders(deviceId, token),
    });
    if (res.ok) {
      setCooldown(await res.json());
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const device = await ensureDeviceRegistered();
      if (cancelled) return;
      setDeviceReady(Boolean(device));
      if (device) await fetchCooldown();
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [fetchCooldown]);

  useEffect(() => {
    if (!cooldown || cooldown.allowed || cooldown.retryAfterMs <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (!prev || prev.allowed) return prev;
        const retryAfterMs = Math.max(0, (prev.nextAvailableAt ?? 0) - Date.now());
        if (retryAfterMs <= 0) {
          return { ...prev, allowed: true, retryAfterMs: 0 };
        }
        return { ...prev, retryAfterMs };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown?.allowed, cooldown?.retryAfterMs, cooldown?.nextAvailableAt]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!url.trim()) {
      setMessage({ type: "error", text: t.invalidUrl });
      return;
    }

    const device = await ensureDeviceRegistered();
    if (!device) {
      setMessage({ type: "error", text: t.deviceError });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/queue/submit", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...deviceHeaders(device.deviceId, device.token),
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setCooldown({
          allowed: false,
          retryAfterMs: data.retryAfterMs ?? 0,
          nextAvailableAt: data.nextAvailableAt ?? null,
        });
        return;
      }

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || t.genericError });
        return;
      }

      setUrl("");
      setMessage({ type: "success", text: t.success });
      if (data.cooldown) setCooldown(data.cooldown);
      onSubmitted?.();
    } catch {
      setMessage({ type: "error", text: t.genericError });
    } finally {
      setLoading(false);
    }
  }

  const onCooldown = cooldown && !cooldown.allowed && cooldown.retryAfterMs > 0;

  return (
    <Card variant="glass" className="mt-3 sm:mt-4">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-2.5 mb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent/15">
            <ListMusic className="h-4 w-4 text-brand-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">{t.title}</p>
            <Text variant="caption" className="mt-0.5">
              {t.subtitle}
            </Text>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="url"
            inputMode="url"
            placeholder={t.placeholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading || !deviceReady || Boolean(onCooldown)}
            aria-label={t.placeholder}
          />

          {onCooldown && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border border-warning/30",
                "bg-warning/10 px-3 py-2 text-sm text-warning",
              )}
            >
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                {t.cooldown}{" "}
                <span className="font-mono font-semibold tabular-nums">
                  {formatCountdown(cooldown.retryAfterMs)}
                </span>
              </span>
            </div>
          )}

          {message && (
            <Alert variant={message.type === "success" ? "success" : "error"}>
              {message.text}
            </Alert>
          )}

          <Button
            type="submit"
            variant="accent"
            size="md"
            className="w-full sm:w-auto"
            loading={loading}
            disabled={!deviceReady || Boolean(onCooldown)}
            leftIcon={!loading ? <Plus className="h-4 w-4" /> : undefined}
          >
            {loading ? t.submitting : t.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
