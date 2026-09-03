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
  Sparkles,
  Newspaper,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getEmbedVideoUrl, sharePostLink } from "./helpers";
import { categoryStyles } from "./data/mockData";
import { Post, mapBackendItemToPost } from "@/types/community";
import { useGetAllCommunityPostsQuery } from "@/Redux/Apis/communityApis";

interface BlogArticleModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (postId: string) => void;
  onCommentClick: (post: Post) => void;
  onSelectPost?: (post: Post) => void;
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onCommentClick,
  onSelectPost,
}) => {
  // Fetch all blog articles for sidebar list
  const { data: blogPostsResponse, isLoading: isBlogPostsLoading } =
    useGetAllCommunityPostsQuery(
      { category: "Blog Article", limit: 20, status: "Published" },
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
    if (post && !mapped.some((p) => p.id === post.id)) {
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

  const catStyle = post.category ? categoryStyles[post.category] : null;
  const userName = post.user?.name || "ProTippz Author";
  const videoEmbedSrc = getEmbedVideoUrl(post.videoUrl, post.videoEmbedCode);

  const handleShare = async () => {
    await sharePostLink({
      postId: post.id,
      title: post.title,
      seoTitle: post.seoTitle,
      summary: post.summary,
      metaDescription: post.metaDescription,
      ogImage: post.ogImage || post.image,
      content: post.content,
      slug: post.slug,
      category: post.category,
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#FAFBFB] overflow-y-auto flex flex-col animate-in fade-in duration-200">
      {/* Sticky Header Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border shadow-xs px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-355 mx-auto w-full flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#053697] font-semibold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Feed</span>
          </button>

          {/* Center Category & Reading Indicator */}
          <div className="hidden sm:flex items-center gap-2 max-w-md truncate text-center">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0"
              style={{
                backgroundColor: catStyle?.bg || "#2FC19115",
                color: catStyle?.text || "#2FC191",
                border: `1px solid ${catStyle?.border || "#2FC19130"}`,
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {post.category || "Blog Article"}
            </span>
            {post.title && (
              <span className="text-xs font-semibold text-[#053697] truncate">
                {post.title}
              </span>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onLike(post.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                post.isLiked
                  ? "bg-[#2FC191] text-white shadow-xs"
                  : "bg-gray-100 text-[#053697] hover:bg-gray-200"
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={post.isLiked ? "white" : "none"}
              />
              <span>{post.likes}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onCommentClick(post);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 text-[#053697] hover:bg-gray-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 text-[#053697] hover:bg-gray-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
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

      {/* Main Fullscreen Article Layout with Right Sidebar */}
      <main className="flex-1 w-full max-w-355 mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Column: Active Blog Article Detail */}
          <div className="lg:col-span-8 xl:col-span-8 order-1 min-w-0 space-y-3">
            {/* Article Meta Header */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: catStyle?.bg || "#2FC19115",
                    color: catStyle?.text || "#2FC191",
                    border: `1px solid ${catStyle?.border || "#2FC19130"}`,
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {post.category || "Blog Article"}
                </span>

                {post.readTime && (
                  <span className="flex items-center gap-1 text-[#05369780] font-medium bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#2FC191]" />
                    {post.readTime}
                  </span>
                )}

                <span className="text-[#05369740]">•</span>
                <span className="text-[#05369770] font-medium">
                  {post.timestamp}
                </span>
              </div>

              {/* Main Title */}
              {post.title && (
                <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#053697] tracking-tight leading-snug">
                  {post.title}
                </h1>
              )}

              {/* Summary / Subtitle */}
              {post.summary && (
                <p className="text-xs sm:text-base font-medium text-slate-600 leading-relaxed border-l-3 border-[#2FC191] pl-3 py-0.5 bg-[#2FC1910a] rounded-r-lg">
                  {post.summary}
                </p>
              )}

              {/* Author Card Header */}
              <div className="flex items-center justify-between gap-3 border-t border-b border-border/80 py-2">
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-9 h-9 border-2 border-[#2FC19130] shrink-0">
                    <AvatarImage src={post.user?.avatar} alt={userName} />
                    <AvatarFallback>
                      <Users className="w-4 h-4 text-[#053697]" />
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-[#053697]">
                        {userName}
                      </span>
                      {post.authorRole && (
                        <span className="text-[10px] font-bold text-[#2FC191] bg-[#2FC19115] px-1.5 py-0.2 rounded-full">
                          {post.authorRole}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      u/{userName.replace(/\s+/g, "")}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#05369720] hover:border-[#2FC191] text-[#053697] hover:text-[#2FC191] text-xs font-semibold transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Article</span>
                </button>
              </div>
            </div>

            {/* Featured Media Container */}
            {post.videoEmbedCode ? (
              <div
                className="mb-3"
                dangerouslySetInnerHTML={{ __html: post.videoEmbedCode }}
              />
            ) : videoEmbedSrc ? (
              <div className="mb-3">
                <iframe
                  src={videoEmbedSrc}
                  title={post.title || "Embedded Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : post.image ? (
              <div className="mb-3 rounded-xl overflow-hidden bg-gray-100 border border-border shadow-xs">
                <Image
                  src={post.image}
                  alt={post.title || "Article media image"}
                  width={1200}
                  height={675}
                  className="w-full h-auto max-h-[420px] object-contain rounded-xl"
                  priority
                />
              </div>
            ) : null}

            {/* Rich Text Main Article Body */}
            <article className="rich-text-content rich-text-content-article bg-white p-3.5 sm:p-5 rounded-xl border border-border/80 shadow-2xs mb-3">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Article Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                <span className="text-xs font-bold text-[#053697]">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-[#2FC191] bg-[#2FC19112] hover:bg-[#2FC19125] px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article Bottom Engagement & Comments CTA */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-linear-to-br from-[#053697]/5 via-white to-[#2FC191]/10 border border-[#2FC19130] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="space-y-1 max-w-lg">
                <h3 className="text-lg font-bold text-[#053697] flex items-center justify-center sm:justify-start gap-2">
                  Enjoyed this article?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Join the conversation! Leave a reply, share your thoughts, or
                  ask the author a question.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onLike(post.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 shadow-sm ${
                    post.isLiked
                      ? "bg-[#2FC191] text-white"
                      : "bg-white text-[#053697] border border-border hover:border-[#2FC191]"
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={post.isLiked ? "white" : "none"}
                  />
                  <span>{post.isLiked ? "Liked" : "Like Article"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onCommentClick(post);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#053697] hover:bg-[#053697]/90 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comments ({post.comments})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: More Blog Articles List */}
          <aside className="lg:col-span-4 xl:col-span-4 order-2 sticky top-20 z-20">
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="p-3.5 sm:p-4 border-b border-gray-200/80 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-extrabold text-sm sm:text-base text-[#053697] flex items-center gap-2">
                  <Newspaper className="w-4.5 h-4.5 text-[#2FC191]" />
                  <span>More Articles</span>
                </h3>
                <span className="text-[10px] font-bold text-[#2FC191] bg-[#2FC19115] px-2 py-0.5 rounded-full">
                  {sidebarBlogs.length} Stories
                </span>
              </div>

              {/* Sidebar Scrollable Divided Article List */}
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto custom-sidebar-scrollbar divide-y divide-gray-100">
                {isBlogPostsLoading && sidebarBlogs.length === 0 ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse space-y-2 py-2">
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    ))}
                  </div>
                ) : (
                  sidebarBlogs.map((item) => {
                    const isActive = item.id === post.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (onSelectPost && !isActive) {
                            onSelectPost(item);
                          }
                        }}
                        className={`relative px-4 py-3.5 transition-colors cursor-pointer group border-l-4 ${
                          isActive
                            ? "bg-slate-50/90 border-[#2FC191]"
                            : "bg-white hover:bg-slate-50/60 border-transparent"
                        }`}
                      >
                        <h4
                          className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 transition-colors ${
                            isActive
                              ? "text-[#053697]"
                              : "text-slate-800 group-hover:text-[#2FC191]"
                          }`}
                        >
                          {item.title || "Untitled Article"}
                        </h4>

                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                          {item.timestamp || "Recently"} • u/
                          {(item.user?.name || "Author").replace(/\s+/g, "")}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BlogArticleModal;
