import { NextRequest, NextResponse } from "next/server";
import { imageUrl, SITE_URL } from "@/lib/api/config";
import { getCommunityPost } from "@/lib/api/queries";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const DEFAULT_SEO_TITLE = "ProTippz - Community Post";
const DEFAULT_THUMBNAIL = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

const baseResponse = {
  version: "1.0",
  type: "link",
  provider_name: "ProTippz",
  provider_url: SITE_URL,
  thumbnail_width: 1200,
  thumbnail_height: 630,
} as const;

const fallback = () =>
  NextResponse.json({ ...baseResponse, title: DEFAULT_SEO_TITLE, thumbnail_url: DEFAULT_THUMBNAIL });

/** Extracts the post id/slug from `/community/post/:id`, `/community/blog/:id` or `?post=`. */
function extractIdOrSlug(targetUrl: string): string {
  if (!targetUrl) return "";
  const match = targetUrl.match(/\/community\/(?:post|blog)\/([^/?#]+)/);
  if (match?.[1]) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return "";
    }
  }
  try {
    return new URL(targetUrl, SITE_URL).searchParams.get("post") || "";
  } catch {
    return "";
  }
}

export async function GET(req: NextRequest) {
  try {
    const idOrSlug = extractIdOrSlug(req.nextUrl.searchParams.get("url") || "");
    if (!idOrSlug || idOrSlug.length > 200) return fallback();

    const post = await getCommunityPost(idOrSlug);
    if (!post) return fallback();

    const thumbnail = post.ogImage || post.images?.[0];

    return NextResponse.json({
      ...baseResponse,
      title: post.seoTitle || post.title || DEFAULT_SEO_TITLE,
      author_name: post.user?.name || "ProTippz Team",
      author_url: SITE_URL,
      thumbnail_url: thumbnail ? imageUrl(thumbnail) : DEFAULT_THUMBNAIL,
    });
  } catch (error) {
    console.error("Error generating oEmbed JSON:", error);
    return fallback();
  }
}
