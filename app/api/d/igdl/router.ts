import { NextRequest } from "next/server";
import { igdl } from "@/lib/scrape";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await igdl(body.url);
    if (!result || result.length === 0)
      return Response.json({ status: false, error: "No media found" }, { status: 404 });
    return Response.json({ status: true, data: result });
  } catch (e: any) {
    return Response.json({ status: false, error: e.message }, { status: 500 });
  }
}
