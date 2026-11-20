import { NextResponse } from "next/server";
import { getRadio } from "@/lib/radio";

/** What is on air right now, for the live badge (polled by the page; cached 15 s). */
export async function GET() {
  const r = await getRadio(15);
  return NextResponse.json(r.live, { headers: { "Cache-Control": "public, max-age=15" } });
}
