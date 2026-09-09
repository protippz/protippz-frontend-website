"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  X,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  BookOpen,
  Users,
  Newspaper,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  Link as LinkIcon,
  Flame,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import OptimizedPostImage from "./OptimizedPostImage";
import { getEmbedVideoUrl, sharePostLink } from "./helpers";
import { categoryStyles } from "./data/mockData";
import { Post, ContentCategory, mapBackendItemToPost } from "@/types/community";
import { useGetAllCommunityPostsQuery } from "@/Redux/Apis/communityApis";

interface BlogArticleModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (postId: string) => void;
  onCommentClick: (post: Post) => void;
  onSelectPost?: (post: Post) => void;
}

const CATEGORIES: ContentCategory[] = [
  "All",
  "Blog Article",
  "Press Release",
  "Company News",
  "Promotional Content",
  "Community Update",
  "Product Announcement",
];

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onCommentClick,
  onSelectPost,
}) => {
  // Fetch all blog articles for recommendation grid
  const { data: blogPostsResponse, isLoading: isBlogPostsLoading } =
    useGetAllCommunityPostsQuery(
      { limit: 20, status: "Published" },
      { skip: !isOpen },
    );

  const sidebarBlogs: Post[] = useMemo(() => {
    const rawList =
      blogPostsResponse?.data?.result ||
      blogPostsResponse?.data ||
      blogPostsResponse?.result ||
      [];

    if (!Array.isArray(rawList)) return post ? [post] : [];
    const mapped = rawList.map(mapBackendItemToPost);
    if (post && !mapped.some((p) => p.id === post?.id)) {
      return [post, ...mapped];
    }
    return mapped;
  }, [blogPostsResponse, post]);

  // Lock background scrolling when full screen blog modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const catStyle = post?.category ? categoryStyles[post?.category] : null;
  const userName = post?.user?.name || "ProTippz Editorial";
  const videoEmbedSrc = getEmbedVideoUrl(post?.videoUrl, post?.videoEmbedCode);

  const handleShare = async () => {
    await sharePostLink({
      postId: post?.id,
      title: post?.title,
      seoTitle: post?.seoTitle,
      summary: post?.summary,
      metaDescription: post?.metaDescription,
      ogImage: post?.ogImage || post?.image,
      content: post?.content,
      slug: post?.slug,
      category: post?.category,
    });
  };

  const recentStories = sidebarBlogs
    .filter((p) => p.id !== post?.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#FAFBFB] overflow-y-auto flex flex-col text-slate-800 animate-in fade-in duration-200">
      {/* 1. Sticky Editorial Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-xs px-4 sm:px-8 py-3 transition-all shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#053697] font-semibold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#2FC191]" />
            <span className="hidden sm:inline">Back to Community</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Center Title Indicator */}
          <div className="hidden md:flex items-center gap-2.5 max-w-lg truncate text-center">
            {post?.title && (
              <span className="text-xs font-bold text-[#053697] truncate">
                {post?.title}
              </span>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onLike(post?.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                post?.isLiked
                  ? "bg-[#2FC191] text-white shadow-xs"
                  : "bg-gray-100 text-[#053697] hover:bg-gray-200"
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={post?.isLiked ? "white" : "none"}
              />
              <span>{post?.likes}</span>
            </button>

            <button
              type="button"
              onClick={() => onCommentClick(post)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100 text-[#053697] hover:bg-gray-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post?.comments}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100 text-[#053697] hover:bg-gray-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Top Full-Width Featured Hero Header Banner (White & #2FC191 Theme) */}
      <div className="relative w-full bg-gradient-to-b from-[#053697]/10 via-[#FAFBFB] to-[#FAFBFB] border-b border-gray-200/80 overflow-hidden py-10 sm:py-16 px-4 sm:px-8 min-h-[320px] sm:min-h-[520px] flex items-center justify-center">
        {/* Featured Image Background with Gradient Tint */}
        {post?.image ? (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={post?.image}
              alt={post?.title || "Hero banner"}
              fill
              className="object-cover object-center opacity-15 blur-[1px]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFBFB] via-[#FAFBFB]/80 to-transparent" />
          </div>
        ) : null}

        {/* Ambient Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#2FC191]/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3.5 px-2">
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#2FC191] text-white shadow-xs">
              <Flame className="w-3.5 h-3.5" />
              {post?.category || "Sports Article"}
            </span>

            {post?.readTime && (
              <span className="flex items-center gap-1 text-[#053697] font-semibold bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-gray-200/80 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#2FC191]" />
                {post?.readTime}
              </span>
            )}
          </div>

          {/* Full-Width Large Title Overlay */}
          {post?.title && (
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#053697] tracking-tight leading-tight sm:leading-tight max-w-3xl mx-auto">
              {post?.title}
            </h1>
          )}

          {/* Subtitle Meta */}
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-500 font-medium pt-1">
            <span>{post?.timestamp || "Updated Today"}</span>
            <span>•</span>
            <span className="text-[#053697] font-bold">By {userName}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Editorial Content & Layout */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Floating Social Bar (Desktop Left Margin) */}
          <aside className="hidden lg:flex lg:col-span-1 flex-col items-center gap-3 sticky top-28 z-20">
            <button
              type="button"
              onClick={() => onLike(post?.id)}
              className={`p-3 rounded-full border transition-all cursor-pointer ${
                post?.isLiked
                  ? "bg-[#2FC191] text-white border-[#2FC191] shadow-md scale-105"
                  : "bg-white border-gray-200 text-slate-500 hover:text-[#053697] hover:border-[#2FC191]"
              }`}
              title="Like Article"
            >
              <Heart
                className="w-5 h-5"
                fill={post?.isLiked ? "white" : "none"}
              />
            </button>

            <button
              type="button"
              onClick={() => onCommentClick(post)}
              className="p-3 rounded-full bg-white border border-gray-200 text-slate-500 hover:text-[#053697] hover:border-[#2FC191] transition-all cursor-pointer"
              title="Comments"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-3 rounded-full bg-white border border-gray-200 text-slate-500 hover:text-[#053697] hover:border-[#2FC191] transition-all cursor-pointer"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-3 rounded-full bg-white border border-gray-200 text-slate-500 hover:text-[#053697] hover:border-[#2FC191] transition-all cursor-pointer"
              title="Copy Link"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
          </aside>

          {/* Central Editorial Content Column - Single Unified White Box */}
          <div className="lg:col-span-11 min-w-0 space-y-6">
            <article className="bg-white border border-gray-200/90 rounded-xl p-5 sm:p-8 space-y-6 shadow-2xs">
              {/* 1. Overview Header Banner */}
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-[#2FC191]/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#2FC191] text-white flex items-center justify-center font-black shrink-0 shadow-2xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#053697]">
                    ProTippz Editorial Research & Analysis
                  </h4>
                  <p className="text-xs text-slate-600">
                    Comprehensive sports analysis, player predictions, and
                    statistical insights.
                  </p>
                </div>
              </div>

              {/* 2. Executive Summary & Context */}
              {post?.summary && (
                <div className="space-y-1.5 pt-1">
                  <p className="font-extrabold text-[#2FC191] text-xs uppercase tracking-wider">
                    Executive Summary & Context
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                    {post?.summary}
                  </p>
                </div>
              )}

              {/* Divider Line */}
              <div className="border-t border-gray-200/80" />

              {/* 3. Featured Image / Video Media Container */}
              {post?.videoEmbedCode ? (
                <div
                  className="overflow-hidden border border-gray-200/80 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: post?.videoEmbedCode }}
                />
              ) : videoEmbedSrc ? (
                <div className="overflow-hidden bg-black aspect-video relative border border-gray-200/80 rounded-lg">
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
                <div className="overflow-hidden border border-gray-200/80 bg-gray-50 rounded-lg">
                  <OptimizedPostImage
                    src={post?.image}
                    alt={post?.title || "Article media image"}
                    width={1200}
                    height={675}
                    priority={true}
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    maxHeightClass="max-h-[460px]"
                    enableLightbox={true}
                  />
                </div>
              ) : null}

              {/* 4. Editorial Rich Text Body (Safe from explicit color overriding HTML content) */}
              <div className="rich-text-content rich-text-content-article leading-relaxed text-slate-800 text-sm sm:text-base space-y-4 pt-1">
                <div dangerouslySetInnerHTML={{ __html: post?.content }} />
              </div>

              {/* Divider Line */}
              <div className="border-t border-gray-200/80" />

              {/* 5. Featured Recommendation / Projection Subsection */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#2FC191] text-white text-[11px] font-black uppercase">
                      FEATURED INSIGHT
                    </span>
                    <span className="text-xs font-bold text-[#053697]">
                      ProTippz Editorial Projection
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#2FC191] bg-[#2FC191]/15 px-2 py-0.5 rounded-full border border-[#2FC191]/30">
                    High Confidence
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-xl font-extrabold text-[#053697]">
                    {post?.title
                      ? post?.title
                      : "Recommended Prediction & Analysis"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Based on statistical matchup modeling, historical trends,
                    and expert review.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#2FC191]">
                  <CheckCircle2 className="w-4 h-4 text-[#2FC191]" />
                  <span>Verified Sports Insight</span>
                </div>
              </div>

              {/* Divider Line */}
              <div className="border-t border-gray-200/80" />

              {/* 6. Author Bio Subsection */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                <Avatar className="w-12 h-12 border-2 border-[#2FC191] shrink-0 shadow-2xs">
                  <AvatarImage src={post?.user?.avatar} alt={userName} />
                  <AvatarFallback>
                    <Users className="w-5 h-5 text-[#053697]" />
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-extrabold text-[#053697]">
                      {userName}
                    </h4>
                    {post?.authorRole && (
                      <span className="text-[10px] font-bold text-[#2FC191] bg-[#2FC191]/15 px-2 py-0.5 rounded-full border border-[#2FC191]/30">
                        {post?.authorRole}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sports analyst & editorial writer on ProTippz. Covering
                    breaking news, game predictions, and loyalty rewards.
                  </p>
                </div>
              </div>
            </article>

            {/* Bottom Section: "Keep Researching" Categories */}
            <div className="pt-2">
              <div className="p-5 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
                <h4 className="text-sm font-black text-[#053697] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#2FC191]" />
                  <span>Keep Researching</span>
                </h4>

                <div className="flex items-center gap-2 flex-wrap">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onClose()}
                      className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 hover:bg-[#2FC191] text-[#053697] hover:text-white transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* "Latest Stories" 3-Card Visual Grid */}
            {recentStories.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-gray-200/90 pb-3">
                  <h3 className="text-base font-black text-[#053697] flex items-center gap-2">
                    <Newspaper className="w-4.5 h-4.5 text-[#2FC191]" />
                    <span>Latest Sports Stories</span>
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs font-bold text-[#2FC191] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recentStories.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (onSelectPost) {
                          onSelectPost(item);
                        }
                      }}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#2FC191] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      {item.image ? (
                        <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title || "Story"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                          <BookOpen className="w-7 h-7 text-gray-400" />
                        </div>
                      )}

                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-[#2FC191] uppercase">
                            {item.category || "Article"}
                          </span>
                          <h4 className="text-xs font-bold text-[#053697] leading-snug line-clamp-2 mt-1 group-hover:text-[#2FC191] transition-colors">
                            {item.title || "Untitled Article"}
                          </h4>
                        </div>

                        <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-gray-100">
                          {item.timestamp || "Recently"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogArticleModal;
