"use client";

import { useEffect, useState } from "react";
import PricingCard from "@/components/PricingCard";
import Link from "next/link";
import { Radio, ArrowLeft } from "lucide-react";

interface Tier {
  id: number;
  name: string;
  description: string;
  priceCents: number;
  slotFrequency: number;
  durationSeconds: number;
}

export default function PricingPage() {
  const [tiers, setTiers] = useState<Tier[]>([]);

  useEffect(() => {
    fetch("/api/ads/tiers")
      .then((r) => r.json())
      .then(setTiers);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-blue-400" />
            <span className="font-bold text-white">MEL Radio</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="text-blue-400 transition-colors">Advertise</Link>
            <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16 pb-24">
        <Link href="/" className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-sm mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to player
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Advertise on MEL Radio</h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Reach our listeners with audio ad spots placed between tracks.
            Choose the frequency that fits your budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tiers.map((tier, i) => (
            <PricingCard
              key={tier.id}
              name={tier.name}
              description={tier.description}
              price={tier.priceCents / 100}
              frequency={tier.slotFrequency === 1 ? "immediately after current track" : `every ${tier.slotFrequency} tracks`}
              duration={`${tier.durationSeconds}s`}
              featured={i === 1}
            />
          ))}
        </div>

        <div className="mt-12 text-center bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-2">Why Advertise With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 text-left">
            <div>
              <h3 className="text-sm font-medium text-white mb-1">Engaged Audience</h3>
              <p className="text-xs text-zinc-500">Listeners actively tune in — your ad reaches them during focused listening sessions.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-1">Simple Pricing</h3>
              <p className="text-xs text-zinc-500">No minimum spend. Pay per spot. Start with a single ad slot.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-1">Real Analytics</h3>
              <p className="text-xs text-zinc-500">Track exactly how many times your ad plays. Transparent reporting.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Get Started — Contact Us
          </Link>
        </div>
      </main>
    </div>
  );
}
