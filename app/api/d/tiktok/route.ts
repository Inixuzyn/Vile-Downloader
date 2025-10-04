import { NextRequest } from "next/server";
import { tiktok } from '@/lib/scrape';   // ← named export
 // your original file

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await tiktok(body.url);
  if (!result) {
  return Response.json({ status: false, error: "Failed to scrape TikTok" }, { status: 500 });
}
  return Response.json({ status: true, data: result.data });
}
