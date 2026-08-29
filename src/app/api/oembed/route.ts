import { NextRequest, NextResponse } from "next/server";

const BASE_SITE_URL = "https://protippz.com";
const DEFAULT_SEO_TITLE = "ProTippz - Community Post";
const DEFAULT_OG_IMAGE = "https://protippz.com/assets/seo-banner.jpg";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url") || "";

    // Extract post ID or slug from URL path e.g. /community/post/slug
    let idOrSlug = "";
    if (targetUrl) {
      const match = targetUrl.match(/\/community\/post\/([^/?#]+)/);
      if (match && match[1]) {
        idOrSlug = decodeURIComponent(match[1]);
      } else {
        const urlObj = new URL(targetUrl, BASE_SITE_URL);
        idOrSlug = urlObj.searchParams.get("post") || "";
      }
    }

    if (!idOrSlug) {
      return NextResponse.json({
        version: "1.0",
        type: "link",
        title: DEFAULT_SEO_TITLE,
        provider_name: "ProTippz",
        provider_url: BASE_SITE_URL,
        thumbnail_url: DEFAULT_OG_IMAGE,
        thumbnail_width: 1200,
        thumbnail_height: 630,
      });
    }

    const res = await fetch(
      `https://api.protippz.com/community-post/get-single/${encodeURIComponent(idOrSlug)}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json({
        version: "1.0",
        type: "link",
        title: DEFAULT_SEO_TITLE,
        provider_name: "ProTippz",
        provider_url: BASE_SITE_URL,
        thumbnail_url: DEFAULT_OG_IMAGE,
        thumbnail_width: 1200,
        thumbnail_height: 630,
      });
    }

    const data = await res.json();
    const post = data?.data?.result || data?.data || data?.result;

    const title = post?.seoTitle || post?.title || DEFAULT_SEO_TITLE;
    const authorName = post?.user?.name || "ProTippz Team";

    let ogImageUrl =
      post?.ogImage ||
      (post?.images && post.images.length > 0 ? post.images[0] : null) ||
      DEFAULT_OG_IMAGE;

    if (ogImageUrl && !ogImageUrl.startsWith("http://") && !ogImageUrl.startsWith("https://")) {
      ogImageUrl = `${BASE_SITE_URL}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;
    }

    return NextResponse.json({
      version: "1.0",
      type: "link",
      title: title,
      author_name: authorName,
      author_url: BASE_SITE_URL,
      provider_name: "ProTippz",
      provider_url: BASE_SITE_URL,
      thumbnail_url: ogImageUrl,
      thumbnail_width: 1200,
      thumbnail_height: 630,
    });
  } catch (error) {
    console.error("Error generating oEmbed JSON:", error);
    return NextResponse.json({
      version: "1.0",
      type: "link",
      title: DEFAULT_SEO_TITLE,
      provider_name: "ProTippz",
      provider_url: BASE_SITE_URL,
      thumbnail_url: DEFAULT_OG_IMAGE,
      thumbnail_width: 1200,
      thumbnail_height: 630,
    });
  }
}
