import { NextRequest } from "next/server";
import { spotify } from "@/lib/scrape";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // spotifyv2 butuh turnstile token → untuk sementara pakai V1 (tanpa token)
    // bila ingin V2, panggil solveBypass di route ini atau pakai V1 dulu
    // contoh pakai solver (kalau kamu sudah puny
    const result = await spotify(body.url, '');
    if (!result) throw new Error("Failed");
    return Response.json({ status: true, data: result });
  } catch (e: any) {
    return Response.json({ status: false, error: e.message }, { status: 500 });
  }
}
