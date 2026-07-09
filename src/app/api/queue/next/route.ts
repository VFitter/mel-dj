import { NextResponse } from "next/server";
import { skipCurrentItem, syncRadioState } from "@/lib/queue-engine";

/** Admin / legacy advance — skips the current item and returns unified radio state. */
export async function POST() {
  await skipCurrentItem();
  const state = await syncRadioState();
  return NextResponse.json(state);
}
