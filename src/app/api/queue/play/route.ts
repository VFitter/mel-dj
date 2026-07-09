import { NextRequest, NextResponse } from "next/server";
import { playQueueItemNow, syncRadioState } from "@/lib/queue-engine";

export async function POST(req: NextRequest) {
  let body: { queueItemId?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { queueItemId } = body;
  if (!queueItemId || typeof queueItemId !== "number") {
    return NextResponse.json({ error: "queueItemId required" }, { status: 400 });
  }

  await playQueueItemNow(queueItemId);
  const state = await syncRadioState();
  return NextResponse.json(state);
}
