"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, Copy, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import MelLogo from "@/components/brand/MelLogo";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { localePath, type Locale } from "@/lib/i18n";
import { getAbsoluteUrl } from "@/lib/site";

const copy = {
  en: {
    label: "Show QR code",
    title: "Scan to open MEL Radio",
    subtitle: "Point your camera at the code to jump into the app instantly.",
    copied: "Link copied",
    copy: "Copy link",
  },
  fr: {
    label: "Afficher le code QR",
    title: "Scannez pour ouvrir MEL Radio",
    subtitle: "Pointez votre appareil photo vers le code pour accéder à l'app.",
    copied: "Lien copié",
    copy: "Copier le lien",
  },
} as const;

interface QrShareButtonProps {
  locale?: Locale;
  className?: string;
  panelClassName?: string;
}

export default function QrShareButton({
  locale = "en",
  className,
  panelClassName,
}: QrShareButtonProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const strings = copy[locale];

  useEffect(() => {
    setShareUrl(getAbsoluteUrl(localePath("/", locale)));
  }, [locale]);

  const close = useCallback(() => {
    setOpen(false);
    setCopied(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [close, open]);

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable in some embedded contexts.
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <IconButton
        type="button"
        size="sm"
        variant="ghost"
        label={strings.label}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          open && "text-brand-accent bg-brand-accent/10",
          "max-md:size-11 max-md:[&_svg]:size-5",
        )}
        onClick={() => setOpen((value) => !value)}
      >
        <QrCode aria-hidden />
      </IconButton>

      {open && shareUrl && (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={`${panelId}-title`}
          className={cn(
            "absolute right-0 top-[calc(100%+0.5rem)] z-[var(--z-modal)] w-[min(18rem,calc(100vw-2rem))]",
            "rounded-2xl border border-border bg-surface-raised shadow-xl p-4 animate-fade-in",
            panelClassName,
          )}
        >
          <div className="text-center space-y-1 mb-4">
            <p id={`${panelId}-title`} className="text-sm font-semibold text-text-primary">
              {strings.title}
            </p>
            <p className="text-xs text-text-muted leading-relaxed">{strings.subtitle}</p>
          </div>

          <div className="relative mx-auto w-fit rounded-xl bg-white p-3 shadow-inner">
            <QRCode
              value={shareUrl}
              size={168}
              level="H"
              bgColor="#ffffff"
              fgColor="#121212"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden
            >
              <div className="rounded-lg bg-white p-1.5 shadow-sm ring-2 ring-white">
                <MelLogo size={28} pixelColor="#121212" glow={false} />
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-center text-text-muted break-all leading-snug">
            {shareUrl}
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "mt-3 w-full inline-flex items-center justify-center gap-2 min-h-10 px-3 rounded-xl text-sm font-medium transition-colors",
              copied
                ? "bg-success/15 text-success border border-success/30"
                : "bg-brand-accent/10 text-brand-accent border border-brand-accent/25 hover:bg-brand-accent/15",
            )}
          >
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? strings.copied : strings.copy}
          </button>
        </div>
      )}
    </div>
  );
}
