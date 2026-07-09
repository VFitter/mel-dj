"use client";

interface AdOverlayProps {
  name: string;
  remaining: number;
  duration: number;
}

export default function AdOverlay({ name, remaining, duration }: AdOverlayProps) {
  const progress = ((duration - remaining) / duration) * 100;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/90 via-zinc-900/90 to-black/90 z-20">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
          <span className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">Sponsored</span>
        </div>

        <div className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
          {name}
        </div>

        <p className="text-zinc-400 text-sm">Music resumes in {remaining}s</p>

        <div className="w-48 h-1.5 bg-zinc-800 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <a
          href="/pricing"
          className="inline-block text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
        >
          Advertise with us →
        </a>
      </div>
    </div>
  );
}
