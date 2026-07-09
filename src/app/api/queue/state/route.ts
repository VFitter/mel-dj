import { NextResponse } from "next/server";
import { syncRadioState } from "@/lib/queue-engine";

export async function GET() {
  const state = await syncRadioState();
  return NextResponse.json(state);
}
