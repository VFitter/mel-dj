"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface PricingTier {
  id: number;
  name: string;
  description: string | null;
  priceCents: number;
  slotFrequency: number;
  durationSeconds: number;
  active: boolean;
}

interface Campaign {
  id: number;
  advertiserName: string;
  pricingTierId: number;
  websiteUrl: string | null;
  imageUrl: string | null;
  startDate: number;
  endDate: number | null;
  playsRemaining: number | null;
  totalPlays: number;
  active: boolean;
  pricingTier?: { name: string } | null;
}

export default function AdminAds() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ advertiserName: "", pricingTierId: 0, websiteUrl: "", startDate: "", endDate: "" });

  function loadData() {
    fetch("/api/ads/tiers").then(r => r.json()).then(setTiers);
    fetch("/api/ads/campaigns").then(r => r.json()).then(setCampaigns);
  }

  useEffect(() => { loadData(); }, []);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/ads/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        advertiserName: form.advertiserName,
        pricingTierId: form.pricingTierId,
        websiteUrl: form.websiteUrl,
        startDate: new Date(form.startDate).getTime(),
        endDate: form.endDate ? new Date(form.endDate).getTime() : null,
      }),
    });
    setShowForm(false);
    setForm({ advertiserName: "", pricingTierId: 0, websiteUrl: "", startDate: "", endDate: "" });
    loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Ads & Pricing</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm">
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {showForm && (
        <form onSubmit={createCampaign} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-6 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300">New Ad Campaign</h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Advertiser Name" required
              value={form.advertiserName} onChange={e => setForm({ ...form, advertiserName: e.target.value })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <select
              value={form.pricingTierId} onChange={e => setForm({ ...form, pricingTierId: Number(e.target.value) })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              required
            >
              <option value={0}>Select tier</option>
              {tiers.map(t => (
                <option key={t.id} value={t.id}>{t.name} (${(t.priceCents / 100).toFixed(2)})</option>
              ))}
            </select>
            <input
              placeholder="Website URL"
              value={form.websiteUrl} onChange={e => setForm({ ...form, websiteUrl: e.target.value })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-zinc-400 px-3 py-2 text-sm">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Create Campaign</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Pricing Tiers</h2>
          <div className="space-y-3">
            {tiers.map(tier => (
              <div key={tier.id} className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{tier.name}</h3>
                  <span className="text-lg font-bold text-blue-400">${(tier.priceCents / 100).toFixed(2)}</span>
                </div>
                <p className="text-zinc-500 text-sm mb-2">{tier.description}</p>
                <div className="flex gap-3 text-xs text-zinc-500">
                  <span>Every {tier.slotFrequency} tracks</span>
                  <span>·</span>
                  <span>{tier.durationSeconds}s duration</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Active Campaigns</h2>
          <div className="space-y-3">
            {campaigns.filter(c => c.active).map(c => (
              <div key={c.id} className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{c.advertiserName}</h3>
                    <p className="text-zinc-500 text-xs">{c.pricingTier?.name || "Unknown tier"}</p>
                  </div>
                  <span className="text-xs text-zinc-500">{c.totalPlays} plays</span>
                </div>
              </div>
            ))}
            {campaigns.filter(c => c.active).length === 0 && (
              <p className="text-zinc-500 text-sm text-center py-8">No active campaigns</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
