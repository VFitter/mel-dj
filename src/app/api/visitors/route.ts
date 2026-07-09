import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listVisitors } from "@/lib/visitors";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const visitors = listVisitors();
  return NextResponse.json(visitors);
}
