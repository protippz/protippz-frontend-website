import { NextRequest, NextResponse } from "next/server";

/**
 * Google Places autocomplete proxy (keeps the API key on the server).
 * Migrated from `src/pages/api/places.ts` (Pages Router) to the App Router.
 *
 * Env: `ADDRESS_API_KEY` (preferred, server-only). `NEXT_PUBLIC_ADDRESS_API_KEY`
 * is still read for backwards compatibility with the current deployment.
 */
const MAX_QUERY_LENGTH = 200;

export async function GET(req: NextRequest) {
  const apiKey = process.env.ADDRESS_API_KEY || process.env.NEXT_PUBLIC_ADDRESS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Address lookup is not configured" }, { status: 500 });
  }

  const query = (req.nextUrl.searchParams.get("query") || "").trim();
  if (!query) return NextResponse.json({ predictions: [], status: "ZERO_RESULTS" });
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", query); // encoded – prevents parameter injection
  url.searchParams.set("types", "geocode");
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "private, max-age=60" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
