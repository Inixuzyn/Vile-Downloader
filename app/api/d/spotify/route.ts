import { NextRequest } from "next/server";
import { spotify } from "@/lib/scrape";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // spotifyv2 butuh turnstile token → untuk sementara pakai V1 (tanpa token)
    // bila ingin V2, panggil solveBypass di route ini atau pakai V1 dulu
    // contoh pakai solver (kalau kamu sudah punya)
const bypass = await solveBypass();
const token  = await bypass.solveTurnstileMin(
  'https://spotimate.io/',
  '0x4AAAAAAA_b5m4iQN755mZw'
);
    const result = await spotify(body.url, token);
    if (!result) throw new Error("Failed");
    return Response.json({ status: true, data: result });
  } catch (e: any) {
    return Response.json({ status: false, error: e.message }, { status: 500 });
  }
}
