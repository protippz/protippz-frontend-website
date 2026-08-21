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
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getEmbedVideoUrl } from "./helpers";
import { levelColors, categoryStyles } from "./data/mockData";
import { Post, ContentCategory } from "@/types/community";

interface FeedCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onCommentClick: (post: Post) => void;
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
  const userLevel = post?.user?.level || "Bronze";
  const levelColor = levelColors[userLevel] || levelColors.Bronze;
  const catStyle = post?.category ? categoryStyles[post.category] : null;
  const postContent = post?.content || "";
  const isLongText = postContent.length > 110;
  const videoEmbedSrc = getEmbedVideoUrl(post?.videoUrl, post?.videoEmbedCode);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: post?.title || postContent,
          text: post?.summary || postContent,
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing:", err));
    }
  };

  const userName = post?.user?.name || "User";

  return (
    <article
      onClick={() => onCommentClick(post)}
      className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-border hover:border-[#308D6F35] transition-colors cursor-pointer group"
    >
      {/* Header Meta Info */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
          <Avatar className="w-6.5 h-6.5 sm:w-7 sm:h-7 border border-[#233A6C15] shrink-0 cursor-pointer">
            <AvatarImage src={post?.user?.avatar} alt={userName} />
            <AvatarFallback>
              <Users className="w-3 h-3 text-[#233A6C60]" />
            </AvatarFallback>
          </Avatar>

          <span className="font-semibold text-xs text-[#233A6C] group-hover:text-[#308D6F] transition-colors cursor-pointer">
            u/{userName.replace(/\s+/g, "")}
          </span>

          {post?.authorRole && (
            <span className="text-[9px] sm:text-[10px] font-bold text-[#308D6F] bg-[#308D6F12] px-1.5 py-0.5 rounded cursor-default">
              {post.authorRole}
            </span>
          )}

          <span className="text-[#233A6C40]">•</span>
          <span className="text-[10px] sm:text-[11px] text-[#233A6C60]">
            {post?.timestamp}
          </span>

          {post?.category && catStyle && (
            <>
              <span className="text-[#233A6C40]">•</span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold cursor-pointer"
                style={{
                  backgroundColor: catStyle.bg,
                  color: catStyle.text,
                  border: `1px solid ${catStyle.border}`,
                }}
              >
                {getCategoryIcon(post.category)}
                {post.category}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {post?.readTime && (
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#233A6C60] font-medium">
              <Clock className="w-3 h-3" />
              {post.readTime}
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
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#233A6C] mb-1 group-hover:text-[#308D6F] transition-colors leading-snug cursor-pointer">
            {post.title}
          </h2>
        )}

        {post?.summary && (
          <p className="text-[11px] sm:text-xs font-medium text-[#233A6C75] mb-1.5 leading-relaxed cursor-pointer">
            {post.summary}
          </p>
        )}

        {/* Text with See More / See Less Toggle */}
        <div className="text-[11px] sm:text-xs leading-relaxed text-[#233A6C90] whitespace-pre-wrap cursor-pointer">
          {isExpandedText || !isLongText ? (
            postContent
          ) : (
            <>{postContent.slice(0, 110).trim()}... </>
          )}
          {isLongText && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpandedText((prev) => !prev);
              }}
              className="text-[11px] font-bold text-[#308D6F] hover:underline cursor-pointer ml-1 inline-block"
            >
              {isExpandedText ? "See less" : "See more"}
            </button>
          )}
        </div>

        {/* Tags */}
        {post?.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-[11px] font-semibold text-[#308D6F] hover:underline cursor-pointer"
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
          className="mb-2.5 rounded-xl overflow-hidden bg-black aspect-video relative border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={videoEmbedSrc}
            title={post?.title || "Embedded Video"}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : post?.image ? (
        <div className="mb-2.5 rounded-xl overflow-hidden bg-black/5 border border-border cursor-pointer">
          <Image
            src={post.image}
            alt="Post media preview"
            width={700}
            height={360}
            className="w-full h-auto max-h-[260px] sm:max-h-[340px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.005]"
          />
        </div>
      ) : null}

      {/* Action Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-border text-xs font-semibold">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (post?.id) onLike(post.id);
          }}
          className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full transition-colors cursor-pointer ${
            post?.isLiked
              ? "bg-[#308D6F] text-white"
              : "bg-gray-100/80 text-[#233A6C] hover:bg-gray-200"
          }`}
        >
          <Heart
            className="w-3.5 h-3.5"
            fill={post?.isLiked ? "white" : "none"}
          />
          <span>{post?.likes ?? 0}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick(post);
          }}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-gray-100/80 text-[#233A6C] hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{post?.comments ?? 0} Comments</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-gray-100/80 text-[#233A6C] hover:bg-gray-200 transition-colors ml-auto cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </article>
  );
});

export default FeedCard;
