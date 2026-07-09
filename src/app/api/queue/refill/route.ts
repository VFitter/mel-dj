import { NextResponse } from "next/server";
import { ensureQueueFilled } from "@/lib/queue-engine";

export async function POST() {
  await ensureQueueFilled();
  return NextResponse.json({ success: true });
}
