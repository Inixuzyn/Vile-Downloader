import { NextRequest } from "next/server";
import scrapeTiktokV2 from "@/lib/scrape"; // your original file

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await scrapeTiktokV2(body.url);
  if (result?.error) return Response.json({ status: false, error: result.message }, { status: 500 });
  return Response.json({ status: true, data: result.data });
}
