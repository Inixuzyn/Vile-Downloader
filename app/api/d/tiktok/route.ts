import { NextRequest } from "next/server";
import { tiktok } from "@/lib/scrape";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await tiktok(body.url);

    if (!result) {
      return Response.json({ status: false, error: "Failed to scrape TikTok" }, { status: 500 });
    }

    return Response.json({ status: true, data: result });
  } catch (e: any) {
    return Response.json({ status: false, error: e.message }, { status: 500 });
  }
}
