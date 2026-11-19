import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { imageUrl, SITE_URL } from "@/lib/api/config";
import { getCommunityPost } from "@/lib/api/queries";
import { DEFAULT_OG_IMAGE as SEO_DEFAULT_OG_IMAGE } from "@/lib/seo";
import CommunityPage from "../../page";

interface PageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_SEO_TITLE = "ProTippz - Community Post";
const DEFAULT_SEO_DESCRIPTION =
  "Join the discussion on ProTippz, earn rewards, and connect with sports tipping fans!";
const BASE_SITE_URL = SITE_URL;
const DEFAULT_OG_IMAGE = `${SITE_URL}${SEO_DEFAULT_OG_IMAGE}`;

const getPostData = getCommunityPost;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
      robots: { index: false, follow: true },
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

  // 3. Open Graph Image URL
  let ogImageUrl =
    post.ogImage ||
    (post.images && post.images.length > 0 ? post.images[0] : null) ||
    DEFAULT_OG_IMAGE;

  if (
    ogImageUrl &&
    !ogImageUrl.startsWith("http://") &&
    !ogImageUrl.startsWith("https://")
  ) {
    ogImageUrl = imageUrl(ogImageUrl);
  }

  const postUrl = `${BASE_SITE_URL}/community/post/${encodeURIComponent(id)}`;
  const authorName = post.user?.name || "ProTippz Member";
  const isPng = ogImageUrl.toLowerCase().endsWith(".png");
  const imageMime = isPng ? "image/png" : "image/jpeg";
  const oembedUrl = `${BASE_SITE_URL}/api/oembed?url=${encodeURIComponent(postUrl)}`;

  return {
    title,
    description: metaDescription,
    keywords: [
      "ProTippz",
      "Sports Tipping",
      post.category || "Community",
      authorName,
      "Sports Community",
    ],
    authors: [{ name: authorName }],
    publisher: "ProTippz",
    alternates: {
      canonical: postUrl,
      types: {
        "application/json+oembed": oembedUrl,
      },
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title,
      description: metaDescription,
      siteName: "ProTippz",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [authorName],
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || title,
          type: imageMime,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      site: "@ProTippz",
      creator: authorName,
      images: [ogImageUrl],
    },
    other: {
      image: ogImageUrl,
      thumbnail: ogImageUrl,
      "twitter:image:src": ogImageUrl,
      "twitter:domain": "protippz.com",
      "article:published_time": post.createdAt || "",
      "article:modified_time": post.updatedAt || "",
      "article:section": post.category || "Sports",
      "article:author": authorName,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.id);

  const title = post?.seoTitle || post?.title || DEFAULT_SEO_TITLE;
  const rawDescription = post?.description
    ? post.description.replace(/<[^>]*>?/gm, "").trim()
    : "";
  const metaDescription =
    post?.metaDescription ||
    (rawDescription.length > 0
      ? rawDescription.slice(0, 160)
      : DEFAULT_SEO_DESCRIPTION);
  let ogImageUrl =
    post?.ogImage ||
    (post?.images && post.images.length > 0 ? post.images[0] : null) ||
    DEFAULT_OG_IMAGE;

  if (
    ogImageUrl &&
    !ogImageUrl.startsWith("http://") &&
    !ogImageUrl.startsWith("https://")
  ) {
    ogImageUrl = imageUrl(ogImageUrl);
  }

  const postUrl = `${BASE_SITE_URL}/community/post/${encodeURIComponent(resolvedParams.id)}`;
  const authorName = post?.user?.name || "ProTippz Member";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    headline: title,
    description: metaDescription,
    image: [ogImageUrl],
    datePublished: post?.createdAt,
    dateModified: post?.updatedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "ProTippz",
      url: BASE_SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_SITE_URL}/new/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <CommunityPage initialPostId={resolvedParams.id} />
    </>
  );
}
