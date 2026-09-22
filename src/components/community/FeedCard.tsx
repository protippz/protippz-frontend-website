"use client";

import React, { useState, memo } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Clock,
  BookOpen,
  Newspaper,
  Building,
  Sparkles,
  Radio,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import OptimizedPostImage from "./OptimizedPostImage";
import { getEmbedVideoUrl, sharePostLink } from "./helpers";
import { levelColors, categoryStyles } from "./data/mockData";
import { Post, ContentCategory } from "@/types/community";

interface FeedCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onCommentClick: (
    post: Post,
    openBlogReader?: boolean,
    scrollToComments?: boolean,
  ) => void;
}

const getCategoryIcon = (category?: ContentCategory) => {
  switch (category) {
    case "Blog Article":
      return <BookOpen className="w-3 h-3" />;
    case "Press Release":
      return <Newspaper className="w-3 h-3" />;
    case "Company News":
      return <Building className="w-3 h-3" />;
    case "Promotional Content":
      return <Sparkles className="w-3 h-3" />;
    case "Community Update":
      return <Radio className="w-3 h-3" />;
    case "Product Announcement":
      return <Megaphone className="w-3 h-3" />;
    default:
      return null;
  }
};

export const FeedCard: React.FC<FeedCardProps> = memo(function FeedCard({
  post,
  onLike,
  onCommentClick,
}) {
  const [isExpandedText, setIsExpandedText] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imageRatio, setImageRatio] = useState<number | null>(null);
  const [isVerticalImage, setIsVerticalImage] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      setImageRatio(ratio);
      setIsVerticalImage(ratio < 0.95);
    }
  };

  const isBlogArticle =
    post?.category?.toLowerCase() === "blog article" ||
    post?.category?.toLowerCase() === "blog" ||
    post?.category === "Blog Article";

  const userLevel = post?.user?.level || "Bronze";
  const levelColor = levelColors[userLevel] || levelColors.Bronze;
  const catStyle = post?.category ? categoryStyles[post?.category] : null;
  const postContent = post?.content || "";
  const isLongText = postContent.length > 110;
  const videoEmbedSrc = getEmbedVideoUrl(post?.videoUrl, post?.videoEmbedCode);

  const handleSeeMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpandedText((prev) => !prev);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await sharePostLink({
      postId: post?.id,
      title: post?.title,
      seoTitle: post?.seoTitle,
      summary: post?.summary,
      metaDescription: post?.metaDescription,
      ogImage: post?.ogImage || post?.image,
      content: postContent,
      slug: post?.slug,
      category: post?.category,
    });
  };

  const userName = post?.user?.name || "User";

  // Dedicated popular sports blog card layout (inspired by ESPN / The Athletic / BBC Sport / Al Jazeera)
  if (isBlogArticle) {
    const cleanSummary =
      post?.summary ||
      postContent
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160)
        .trim() + (postContent.length > 160 ? "..." : "");

    const hasMedia = (post?.image && !imgError) || !!videoEmbedSrc;

    return (
      <article
        onClick={() => onCommentClick(post, true)}
        className="p-3.5 sm:p-5 rounded-lg bg-white border border-border hover:border-[#2FC19145] cursor-pointer group"
      >
        {/* Top Header Meta */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <Avatar
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 sm:w-9 sm:h-9 border border-[#05369715] shrink-0"
            >
              <AvatarImage src={post?.user?.avatar} alt={userName} />
              <AvatarFallback>
                <Users className="w-4 h-4 text-[#05369760]" />
              </AvatarFallback>
            </Avatar>

            <span
              onClick={(e) => e.stopPropagation()}
              className="text-sm sm:text-[15px] font-semibold text-[#053697] group-hover:text-[#2FC191] transition-colors"
            >
              {userName.replace(/\s+/g, "")}
            </span>

            {post?.authorRole && (
              <span className="text-[10px] sm:text-xs font-bold text-[#2FC191] bg-[#2FC19112] px-2 py-0.5 rounded cursor-default">
                {post?.authorRole}
              </span>
            )}

            <span className="text-[#05369740]">•</span>
            <span className="text-xs sm:text-[12px] text-[#05369760]">
              {post?.timestamp}
            </span>

            {post?.category && catStyle && (
              <>
                <span className="text-[#05369740]">•</span>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
                  style={{
                    backgroundColor: catStyle.bg,
                    color: catStyle.text,
                    border: `1px solid ${catStyle.border}`,
                  }}
                >
                  {getCategoryIcon(post?.category)}
                  {post?.category}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {post?.readTime && (
              <span className="flex items-center gap-1 text-xs sm:text-[12px] text-[#05369760] font-medium">
                <Clock className="w-3.5 h-3.5" />
                {post?.readTime}
              </span>
            )}
            {post?.isTrending && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
                style={{ backgroundColor: "#F6E05E20", color: "#D69E2E" }}
              >
                <TrendingUp className="w-3 h-3" />
                Hot
              </span>
            )}
          </div>
        </div>

        {/* Popular Sports Blog Card Main Layout */}
        <div className="flex flex-row gap-3.5 sm:gap-5 md:gap-6 items-start justify-between mb-3">
          {/* Left Column: Title, Excerpt, Date/Meta */}
          <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
            <div>
              {post?.title && (
                <h2 className="text-lg sm:text-xl md:text-[22px] lg:text-2xl font-bold text-slate-900 group-hover:text-[#053697] transition-colors leading-snug sm:leading-tight line-clamp-2 mb-2">
                  {post?.title}
                </h2>
              )}

              {cleanSummary && (
                <p className="text-sm sm:text-base md:text-[16px] font-normal text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-3">
                  {cleanSummary}
                </p>
              )}
            </div>

            <div className="mt-auto pt-1 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                {post?.timestamp}
              </span>

              {/* Tags */}
              {post?.tags && post?.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {post?.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold text-[#2FC191] hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Thumbnail with Adaptive Aspect Ratio */}
          {hasMedia && (
            <div
              className={`shrink-0 relative rounded-sm sm:rounded-sm overflow-hidden bg-slate-100 border border-slate-100 ${
                isVerticalImage
                  ? "h-28 xs:h-32 sm:h-40 md:h-44 max-w-[130px] sm:max-w-[170px] md:max-w-[190px]"
                  : "w-28 xs:w-36 sm:w-48 md:w-56 lg:w-60 aspect-[16/10]"
              }`}
              style={
                imageRatio
                  ? {
                      aspectRatio: isVerticalImage
                        ? `${Math.max(imageRatio, 0.5)}`
                        : `${Math.min(imageRatio, 2.2)}`,
                    }
                  : undefined
              }
            >
              {post?.image && !imgError ? (
                <Image
                  src={post.image}
                  alt={post?.title || "Blog post media"}
                  fill
                  sizes={
                    isVerticalImage
                      ? "(max-width: 640px) 120px, 190px"
                      : "(max-width: 640px) 140px, (max-width: 1024px) 240px, 260px"
                  }
                  className="object-cover"
                  onLoad={handleImageLoad}
                  onError={() => setImgError(true)}
                />
              ) : videoEmbedSrc ? (
                <iframe
                  src={videoEmbedSrc}
                  title={post?.title || "Embedded Video"}
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  tabIndex={-1}
                />
              ) : null}
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 pt-3 border-t border-border text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (post?.id) onLike(post?.id);
            }}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-colors cursor-pointer ${
              post?.isLiked
                ? "bg-[#2FC191] text-white"
                : "bg-gray-100/80 text-[#053697] hover:bg-gray-200"
            }`}
          >
            <Heart
              className="w-4 h-4"
              fill={post?.isLiked ? "white" : "none"}
            />
            <span>{post?.likes ?? 0}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCommentClick(post, false);
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-gray-100/80 text-[#053697] hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post?.comments ?? 0} Comments</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCommentClick(post, true);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2FC191] hover:text-[#28a77d] transition-colors ml-2 cursor-pointer"
          >
            Read Article <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-gray-100/80 text-[#053697] hover:bg-gray-200 transition-colors ml-auto cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </article>
    );
  }

  // Regular Non-Blog Feed Card
  return (
    <article
      onClick={() => onCommentClick(post, false)}
      className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-border hover:border-[#2FC19135] transition-colors cursor-pointer group"
    >
      {/* Header Meta Info */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
          <Avatar className="w-12 h-12 border border-[#05369715] shrink-0 cursor-pointer">
            <AvatarImage src={post?.user?.avatar} alt={userName} />
            <AvatarFallback>
              <Users className="w-6 h-6 text-[#05369760]" />
            </AvatarFallback>
          </Avatar>

          <span className="text-base text-[#053697] group-hover:text-[#2FC191] transition-colors cursor-pointer">
            {userName.replace(/\s+/g, "")}
          </span>

          {post?.authorRole && (
            <span className="text-[9px] sm:text-[10px] font-bold text-[#2FC191] bg-[#2FC19112] px-1.5 py-0.5 rounded cursor-default">
              {post?.authorRole}
            </span>
          )}

          <span className="text-[#05369740]">•</span>
          <span className="text-[10px] sm:text-[11px] text-[#05369760]">
            {post?.timestamp}
          </span>

          {post?.category && catStyle && (
            <>
              <span className="text-[#05369740]">•</span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold cursor-pointer"
                style={{
                  backgroundColor: catStyle.bg,
                  color: catStyle.text,
                  border: `1px solid ${catStyle.border}`,
                }}
              >
                {getCategoryIcon(post?.category)}
                {post?.category}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {post?.readTime && (
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#05369760] font-medium">
              <Clock className="w-3 h-3" />
              {post?.readTime}
            </span>
          )}
          {post?.isTrending && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold"
              style={{ backgroundColor: "#F6E05E20", color: "#D69E2E" }}
            >
              <TrendingUp className="w-2.5 h-2.5" />
              Hot
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mb-2.5">
        {post?.title && (
          <h2 className="text-xl font-bold transition-colors leading-snug cursor-pointer hover:text-[#2FC191]">
            {post?.title}
          </h2>
        )}

        {post?.summary && (
          <p className="text-base font-medium line-clamp-3 mb-1.5 leading-relaxed cursor-pointer text-slate-600">
            {post?.summary}
          </p>
        )}

        {/* Text with See More / See Less Toggle */}
        <div className="rich-text-content rich-text-content-preview text-[#334155] mb-3 leading-relaxed cursor-pointer">
          {isExpandedText || !isLongText ? (
            <div dangerouslySetInnerHTML={{ __html: postContent }} />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  postContent.slice(0, 110).trim() + (isLongText ? "..." : ""),
              }}
            />
          )}
          {isLongText && (
            <button
              type="button"
              onClick={handleSeeMoreClick}
              className="text-xs font-bold text-[#2FC191] hover:underline cursor-pointer ml-1 inline-block"
            >
              {isExpandedText ? "See less" : "See more"}
            </button>
          )}
        </div>

        {/* Tags */}
        {post?.tags && post?.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            {post?.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-[11px] font-semibold text-[#2FC191] hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media Content (Video or Image) */}
      {videoEmbedSrc ? (
        <div
          className="mb-2.5 rounded-2xl overflow-hidden bg-black aspect-video relative border border-border w-full!"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={videoEmbedSrc}
            title={post?.title || "Embedded Video"}
            className="absolute inset-0 h-full border-0 aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : post?.image ? (
        <div className="mb-2.5">
          <OptimizedPostImage
            src={post?.image}
            alt={post?.title || "Post media preview"}
            width={700}
            height={360}
            enableLightbox={true}
          />
        </div>
      ) : null}

      {/* Action Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-border text-xs font-semibold">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (post?.id) onLike(post?.id);
          }}
          className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full transition-colors cursor-pointer ${
            post?.isLiked
              ? "bg-[#2FC191] text-white"
              : "bg-gray-100/80 text-[#053697] hover:bg-gray-200"
          }`}
        >
          <Heart
            className="w-3.5 h-3.5"
            fill={post?.isLiked ? "white" : "none"}
          />
          <span>{post?.likes ?? 0}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick(post, false);
          }}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-gray-100/80 text-[#053697] hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{post?.comments ?? 0} Comments</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-gray-100/80 text-[#053697] hover:bg-gray-200 transition-colors ml-auto cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </article>
  );
});

export default FeedCard;
