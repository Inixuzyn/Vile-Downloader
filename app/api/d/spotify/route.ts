import { NextRequest } from "next/server";
import { spotify } from "@/lib/scrape";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // spotifyv2 butuh turnstile token → untuk sementara pakai V1 (tanpa token)
    // bila ingin V2, panggil solveBypass di route ini atau pakai V1 dulu
    const result = await spotify(body.url); // V1
    if (!result) throw new Error("Failed");
    return Response.json({ status: true, data: result });
  } catch (e: any) {
    return Response.json({ status: false, error: e.message }, { status: 500 });
  }
}
