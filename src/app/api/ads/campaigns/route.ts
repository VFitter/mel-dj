import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adCampaigns, adPricingTiers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const campaigns = db.select().from(adCampaigns).all();

  const enriched = campaigns.map((c) => {
    const tier = db.select({ name: adPricingTiers.name })
      .from(adPricingTiers).where(eq(adPricingTiers.id, c.pricingTierId)).get();
    return { ...c, pricingTier: tier };
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  db.insert(adCampaigns).values({
    advertiserName: data.advertiserName,
    pricingTierId: data.pricingTierId,
    websiteUrl: data.websiteUrl || null,
    startDate: data.startDate,
    endDate: data.endDate || null,
    active: true,
  }).run();

  return NextResponse.json({ success: true });
}
