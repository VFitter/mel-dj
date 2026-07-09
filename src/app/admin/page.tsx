"use client";

import { useEffect, useState } from "react";
import { Disc3, ListOrdered, DollarSign, Play } from "lucide-react";

interface Stats {
  totalTracks: number;
  activeTracks: number;
  pendingQueue: number;
  totalPlays: number;
  activeCampaigns: number;
  revenueEstimate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/tracks?stats=true")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const cards = [
    { label: "Total Tracks", value: stats?.totalTracks ?? "—", icon: Disc3, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { label: "Active Tracks", value: stats?.activeTracks ?? "—", icon: Play, color: "bg-green-500/10 text-green-400 border-green-500/20" },
    { label: "Queue Pending", value: stats?.pendingQueue ?? "—", icon: ListOrdered, color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    { label: "Active Campaigns", value: stats?.activeCampaigns ?? "—", icon: DollarSign, color: "bg-brand-primary/10 text-brand-primary border-brand-primary/20" },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 hidden lg:block">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl border p-4 ${card.color}`}>
            <div className="flex items-center justify-between">
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
            <p className="text-xs mt-1 opacity-80">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <a href="/admin/tracks" className="block bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 text-center text-sm text-zinc-300 transition-colors">
            Add New Track
          </a>
          <a href="/admin/queue" className="block bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 text-center text-sm text-zinc-300 transition-colors">
            Manage Queue
          </a>
          <a href="/admin/ads" className="block bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 text-center text-sm text-zinc-300 transition-colors">
            Manage Ad Campaigns
          </a>
          <a href="/admin/visitors" className="block bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 text-center text-sm text-zinc-300 transition-colors">
            View Visitor Map
          </a>
        </div>
      </div>
    </div>
  );
}
