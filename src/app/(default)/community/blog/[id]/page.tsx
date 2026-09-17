import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CommunityPostBackendItem, mapBackendItemToPost } from "@/types/community";
import BlogArticleView from "@/components/community/BlogArticleView";

interface PageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_SEO_TITLE = "ProTippz - Blog Article";
const DEFAULT_SEO_DESCRIPTION =
  "Read the latest sports tipping articles, news, and insights on ProTippz!";
const DEFAULT_OG_IMAGE = "https://protippz.com/assets/seo-banner.jpg";
const BASE_SITE_URL = "https://protippz.com";

/**
 * Fetch blog article details on the server to populate Open Graph, Twitter Card, and oEmbed tags
 * for social media bots across all platforms.
 */
async function getPostData(idOrSlug: string): Promise<CommunityPostBackendItem | null> {
  try {
    const res = await fetch(
      `https://api.protippz.com/community-post/get-single/${encodeURIComponent(idOrSlug)}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const item = data?.data?.result || data?.data || data?.result;
    return item || null;
  } catch (error) {
    console.error("Failed to fetch blog post data for metadata:", error);
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

  // 3. Open Graph Image URL
  let ogImageUrl =
    post.ogImage ||
    (post.images && post.images.length > 0 ? post.images[0] : null) ||
    DEFAULT_OG_IMAGE;

  if (ogImageUrl && !ogImageUrl.startsWith("http://") && !ogImageUrl.startsWith("https://")) {
    ogImageUrl = `${BASE_SITE_URL}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;
  }

  const blogUrl = `${BASE_SITE_URL}/community/blog/${encodeURIComponent(id)}`;
  const authorName = post.user?.name || "Douglas Reyner";
  const isPng = ogImageUrl.toLowerCase().endsWith(".png");
  const imageMime = isPng ? "image/png" : "image/jpeg";
  const oembedUrl = `${BASE_SITE_URL}/api/oembed?url=${encodeURIComponent(blogUrl)}`;

  return {
    title: `${title} - ProTippz`,
    description: metaDescription,
    keywords: [
      "ProTippz",
      "CEO Times",
      "Sports Economy",
      "NIL Deals",
      "Fan Engagement",
      "Blog Article",
      post.category || "Sports",
      authorName,
      "Sports Community",
    ],
    authors: [{ name: authorName }],
    publisher: "ProTippz",
    themeColor: "#2FC191",
    alternates: {
      canonical: blogUrl,
      types: {
        "application/json+oembed": oembedUrl,
      },
    },
    openGraph: {
      type: "article",
      url: blogUrl,
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
      "article:section": post.category || "Blog Article",
      "article:author": authorName,
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawPost = await getPostData(resolvedParams.id);

  if (!rawPost) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
        <p className="text-slate-500 text-sm max-w-md">
          The sports article you are looking for might have been moved or is currently unavailable.
        </p>
        <Link
          href="/community"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2FC191] text-[#053697] font-bold text-sm shadow-sm hover:bg-[#28ad81] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore ProTippz Community</span>
        </Link>
      </div>
    );
  }

  const mappedPost = mapBackendItemToPost(rawPost);

  const title = mappedPost.seoTitle || mappedPost.title || DEFAULT_SEO_TITLE;
  const rawDescription = mappedPost.content
    ? mappedPost.content.replace(/<[^>]*>?/gm, "").trim()
    : "";
  const metaDescription =
    mappedPost.metaDescription ||
    (rawDescription.length > 0
      ? rawDescription.slice(0, 160)
      : DEFAULT_SEO_DESCRIPTION);
  let ogImageUrl =
    mappedPost.ogImage || mappedPost.image || DEFAULT_OG_IMAGE;

  if (ogImageUrl && !ogImageUrl.startsWith("http://") && !ogImageUrl.startsWith("https://")) {
    ogImageUrl = `${BASE_SITE_URL}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;
  }

  const blogUrl = `${BASE_SITE_URL}/community/blog/${encodeURIComponent(resolvedParams.id)}`;
  const authorName = mappedPost.user?.name || "Douglas Reyner";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: metaDescription,
    image: [ogImageUrl],
    datePublished: rawPost.createdAt,
    dateModified: rawPost.updatedAt,
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
        url: `${BASE_SITE_URL}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticleView post={mappedPost} />
    </>
  );
}
