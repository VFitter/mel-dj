import { NextResponse } from "next/server";
import { db } from "@/db";
import { adPricingTiers } from "@/db/schema";

export async function GET() {
  const tiers = db.select().from(adPricingTiers).all();
  return NextResponse.json(tiers);
}
