import type { Metadata } from "next";
import CommunityPage from "../../page";
import { CommunityPostBackendItem } from "@/types/community";

interface PageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_SEO_TITLE = "ProTippz - Community Post";
const DEFAULT_SEO_DESCRIPTION =
  "Join the discussion on ProTippz, earn rewards, and connect with sports tipping fans!";
const DEFAULT_OG_IMAGE = "https://protippz.com/assets/seo-banner.jpg";
const BASE_SITE_URL = "https://protippz.com";

/**
 * Fetch post details on the server to populate Open Graph and Twitter Card tags
 * for social media bots (Facebook, X, LinkedIn, WhatsApp, etc.).
 */
async function getPostData(idOrSlug: string): Promise<CommunityPostBackendItem | null> {
  try {
    const res = await fetch(
      `https://api.protippz.com/community-post/get-single/${encodeURIComponent(idOrSlug)}`,
      {
        next: { revalidate: 60 }, // Cache response for 60 seconds
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const item = data?.data?.result || data?.data || data?.result;
    return item || null;
  } catch (error) {
    console.error("Failed to fetch post data for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return {
      title: DEFAULT_SEO_TITLE,
      description: DEFAULT_SEO_DESCRIPTION,
    };
  }

  const post = await getPostData(id);

  if (!post) {
    return {
      title: DEFAULT_SEO_TITLE,
      description: DEFAULT_SEO_DESCRIPTION,
    };
  }

  // 1. SEO Title
  const title = post.seoTitle || post.title || DEFAULT_SEO_TITLE;

  // 2. Meta Description
  const rawDescription = post.description
    ? post.description.replace(/<[^>]*>?/gm, "").trim()
    : "";
  const metaDescription =
    post.metaDescription ||
    (rawDescription.length > 0
      ? rawDescription.slice(0, 160)
      : DEFAULT_SEO_DESCRIPTION);

  // 3. Open Graph Image
  let ogImageUrl =
    post.ogImage ||
    (post.images && post.images.length > 0 ? post.images[0] : null) ||
    DEFAULT_OG_IMAGE;

  if (ogImageUrl && !ogImageUrl.startsWith("http://") && !ogImageUrl.startsWith("https://")) {
    ogImageUrl = `${BASE_SITE_URL}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;
  }

  const postUrl = `${BASE_SITE_URL}/community/post/${encodeURIComponent(id)}`;

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title,
      description: metaDescription,
      siteName: "ProTippz",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CommunityPage initialPostId={resolvedParams.id} />;
}
