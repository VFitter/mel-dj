import { NextResponse } from "next/server";
import { skipCurrentItem, syncRadioState } from "@/lib/queue-engine";

export async function POST() {
  await skipCurrentItem();
  const state = await syncRadioState();
  return NextResponse.json(state);
}
