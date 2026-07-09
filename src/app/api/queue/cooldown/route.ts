import { NextRequest, NextResponse } from "next/server";
import { getCooldownStatus } from "@/lib/cooldown";
import { resolveRequestIdentity } from "@/lib/request-identity";

export async function GET(req: NextRequest) {
  const identity = await resolveRequestIdentity(req);
  if (!identity) {
    return NextResponse.json({ error: "Device not registered" }, { status: 401 });
  }

  const status = getCooldownStatus(identity.deviceId, identity.ipHash);
  return NextResponse.json(status);
}
