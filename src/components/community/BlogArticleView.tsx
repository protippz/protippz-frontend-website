"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Send,
  User as UserIcon,
  Search,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post, Comment, mapBackendItemToPost, mapBackendCommentToComment } from "@/types/community";
import { useAuth } from "@/provider/ContextProvider";
import {
  useLikeCommunityPostMutation,
  useGetAllCommunityPostsQuery,
} from "@/Redux/Apis/communityApis";
import {
  useGetCommentsByPostQuery,
  useCreateCommentMutation,
} from "@/Redux/Apis/commentApis";
import toast from "react-hot-toast";
import { getEmbedVideoUrl } from "./helpers";

interface BlogArticleViewProps {
  post: Post;
  isModal?: boolean;
  onClose?: () => void;
  onSelectPost?: (post: Post) => void;
}

export const BlogArticleView: React.FC<BlogArticleViewProps> = ({
  post,
  isModal = false,
  onClose,
  onSelectPost,
}) => {
  const router = useRouter();
  const { userData } = useAuth();
  const [likePostApi] = useLikeCommunityPostMutation();
  const [createCommentApi, { isLoading: isPostingComment }] = useCreateCommentMutation();
  const [commentInput, setCommentInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Local likes count and status
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  // Fetch real blog posts matching: category="Blog Article", status="Published", page=1, limit=10
  const { data: blogPostsData, isLoading: isPostsLoading } = useGetAllCommunityPostsQuery(
    { page: 1, limit: 10, status: "Published", category: "Blog Article" },
    { skip: false }
  );

  const recentStories: Post[] = useMemo(() => {
    const rawList =
      blogPostsData?.data?.result ||
      blogPostsData?.data ||
      blogPostsData?.result ||
      [];
    if (!Array.isArray(rawList)) return [];

    const mapped = rawList.map(mapBackendItemToPost);
    // Exclude current active article by matching ID or slug
    return mapped
      .filter((p) => p.id !== post.id && (!post.slug || p.slug !== post.slug))
      .slice(0, 5);
  }, [blogPostsData, post.id, post.slug]);

  // Fetch comments for this post
  const { data: commentsResponse, refetch: refetchComments } = useGetCommentsByPostQuery(
    { postId: post.id, page: 1, limit: 20 },
    { skip: !post.id }
  );

  const commentsList: Comment[] = useMemo(() => {
    const raw =
      commentsResponse?.data?.result ||
      commentsResponse?.data ||
      commentsResponse?.result ||
      [];
    if (!Array.isArray(raw)) return [];
    return raw.map(mapBackendCommentToComment);
  }, [commentsResponse]);

  const handleLike = async () => {
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      await likePostApi(post.id).unwrap();
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Unable to update like.");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (!userData?._id) {
      toast.error("Please sign in to leave a comment.");
      router.push("/sign-in");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("communityPost", post.id);
      formData.append("text", commentInput.trim());

      await createCommentApi(formData).unwrap();
      setCommentInput("");
      refetchComments();
      toast.success("Comment posted successfully!");
    } catch (error) {
      toast.error("Failed to post comment.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/community?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://protippz.com/community/blog/${post.id}`;
  const shareTitle = post.title || "PROTIPPZ Article";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const authorName = post.user?.name || "Douglas Reyner";
  const authorRole = post.authorRole || "Contributor Content";
  const categoryName = post.category || "GLOBAL BUSINESS TRENDS";
  const videoEmbedSrc = getEmbedVideoUrl(post.videoUrl, post.videoEmbedCode);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* Optional Top Bar for Navigation / Back when in modal or page */}
      {isModal && onClose && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#053697] bg-slate-100 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2FC191]" />
            <span>Close Article</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isLiked
                  ? "bg-[#2FC191] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Heart className="w-3.5 h-3.5" fill={isLiked ? "white" : "none"} />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
              title="Copy Link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ================= LEFT / MAIN EDITORIAL ARTICLE (8 Cols) ================= */}
          <article className="lg:col-span-8 min-w-0">
            {/* 1. Category Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 bg-[#2FC191] text-white text-[11px] font-bold uppercase tracking-wider rounded-xs">
                {categoryName}
              </span>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium tracking-wide rounded-xs">
                {authorRole}
              </span>
            </div>

            {/* 2. Main Article Title (H1) */}
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#111827] tracking-tight leading-[1.25] mb-4">
              {post.title || "PROTIPPZ Revolutionizes Sports Economy with Fan-Powered Athlete Support"}
            </h1>

            {/* 3. Author Byline Row */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-200 flex-wrap">
              <Avatar className="w-5 h-5 border border-slate-300">
                <AvatarImage src={post.user?.avatar} alt={authorName} />
                <AvatarFallback className="bg-slate-200 text-slate-700 text-[9px] font-bold">
                  {authorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-bold text-slate-800 hover:underline cursor-pointer">
                {authorName}
              </span>
              <span>•</span>
              <span>{post.timestamp || "September 17, 2026"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {post.readTime || "4 Min Read"}
              </span>
            </div>

            {/* 4. Featured Hero Image / Video Media Container */}
            {post.videoEmbedCode ? (
              <div
                className="overflow-hidden border border-slate-200 rounded-xs my-5"
                dangerouslySetInnerHTML={{ __html: post.videoEmbedCode }}
              />
            ) : videoEmbedSrc ? (
              <div className="overflow-hidden bg-black aspect-video relative border border-slate-200 rounded-xs my-5">
                <iframe
                  src={videoEmbedSrc}
                  title={post.title || "Embedded Video"}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : post.image ? (
              <div className="relative w-full h-[300px] sm:h-[420px] mb-5 overflow-hidden bg-slate-100 rounded-xs">
                <Image
                  src={post.image}
                  alt={post.title || "Featured article image"}
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            ) : null}

            {/* 5. Subheadline / Lead Paragraph Deck (Italic Text directly below Image) */}
            {post.summary && (
              <p className="text-[15px] sm:text-[16px] text-[#333333] italic leading-[1.7] mb-6">
                {post.summary}
              </p>
            )}

            {/* 6. Editorial Rich Text Article Body */}
            <div className="rich-text-content rich-text-content-article text-[#222222] text-[15px] sm:text-[16px] leading-[1.8] space-y-5">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* 7. Bottom Social Share & Like Strip */}
            <div className="pt-6 mt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Share:
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-sm bg-slate-100 hover:bg-[#1877F2] hover:text-white text-slate-600 flex items-center justify-center transition-all"
                    title="Share on Facebook"
                  >
                    <FaFacebookF className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-sm bg-slate-100 hover:bg-black hover:text-white text-slate-600 flex items-center justify-center transition-all"
                    title="Share on X"
                  >
                    <FaTwitter className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-sm bg-slate-100 hover:bg-[#0A66C2] hover:text-white text-slate-600 flex items-center justify-center transition-all"
                    title="Share on LinkedIn"
                  >
                    <FaLinkedinIn className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-sm bg-slate-100 hover:bg-[#25D366] hover:text-white text-slate-600 flex items-center justify-center transition-all"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="w-8 h-8 rounded-sm bg-slate-100 hover:bg-[#2FC191] hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                    title="Copy Link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isLiked
                      ? "bg-[#2FC191] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" fill={isLiked ? "white" : "none"} />
                  <span>{isLiked ? "Liked" : "Like"} ({likesCount})</span>
                </button>
              </div>
            </div>

            {/* 8. Author / Contributor Bio Box */}
            <div className="mt-8 p-5 bg-slate-50 border border-slate-200/80 rounded-sm space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                CEO Times Contributor
              </span>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-slate-300">
                  <AvatarImage src={post.user?.avatar} alt={authorName} />
                  <AvatarFallback className="bg-emerald-100 text-[#053697] font-bold">
                    {authorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{authorName}</h4>
                  <p className="text-xs text-slate-500">
                    Covers global markets, corporate finance, and executive leadership.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-200">
                This article features partner, contributor, or branded content from a third party. Members of the CEO Times editorial staff were not involved in the creation of this content. All views and opinions are those of the contributor alone.
              </p>
            </div>

            {/* 9. Discussion & Comments */}
            <div className="mt-10 pt-6 border-t border-slate-200 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#2FC191]" />
                <span>Comments ({commentsList.length})</span>
              </h3>

              <form onSubmit={handleAddComment} className="flex gap-2.5">
                <Avatar className="w-8 h-8 border border-slate-200 shrink-0">
                  <AvatarImage src={userData?.profile_image} alt="You" />
                  <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-bold">
                    {userData?.name ? userData.name[0] : <UserIcon className="w-3.5 h-3.5" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={
                      userData?._id
                        ? "Leave a comment..."
                        : "Sign in to leave a comment..."
                    }
                    rows={2}
                    className="w-full p-2.5 pr-20 rounded-sm border border-slate-300 focus:outline-none focus:border-[#2FC191] text-xs placeholder-slate-400 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isPostingComment || !commentInput.trim()}
                    className="absolute right-2 bottom-3 px-3 py-1 bg-[#2FC191] hover:bg-[#28ad81] disabled:opacity-50 text-white font-bold text-[11px] rounded-xs cursor-pointer shadow-2xs transition-all"
                  >
                    Submit
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-2.5">
                {commentsList.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {c.user?.name || "Reader"}
                      </span>
                      <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>

          </article>

          {/* ================= RIGHT / EDITORIAL SIDEBAR (4 Cols) ================= */}
          <aside className="lg:col-span-4 space-y-8 lg:pl-2 sticky top-20 self-start">
            
            {/* 1. SEARCH WIDGET */}
            {/* <div className="space-y-2">
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider pb-1 border-b-2 border-slate-800">
                SEARCH
              </h4>
              <form onSubmit={handleSearch} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-none text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer rounded-none"
                >
                  SEARCH
                </button>
              </form>
            </div> */}

            {/* 2. RECENT POSTS (Text Links) */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900 pb-1 border-b border-slate-200">
                Recent Posts
              </h4>
              <ul className="space-y-2.5 text-[13px]">
                {isPostsLoading ? (
                  <div className="space-y-2 py-1">
                    <div className="h-3.5 bg-slate-200 animate-pulse rounded-xs w-3/4" />
                    <div className="h-3.5 bg-slate-200 animate-pulse rounded-xs w-5/6" />
                    <div className="h-3.5 bg-slate-200 animate-pulse rounded-xs w-2/3" />
                  </div>
                ) : recentStories.length > 0 ? (
                  recentStories.map((item) => {
                    const blogUrl = `/community/blog/${encodeURIComponent(item.slug || item.id)}`;
                    return (
                      <li key={item.id} className="leading-snug">
                        <Link
                          href={blogUrl}
                          onClick={() => {
                            if (onSelectPost) onSelectPost(item);
                          }}
                          className="text-[#053697] hover:text-[#2FC191] hover:underline transition-colors block font-medium"
                        >
                          {item.title || "Featured Sports Article"}
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-xs text-slate-400 py-1">
                    No other recent articles found.
                  </li>
                )}
              </ul>
            </div>

            {/* 3. RECENT POSTS (Thumbnail List with Grey Header Bar) */}
            <div className="space-y-3 pt-2">
              <div className="bg-[#f0f1f2] px-3 py-1.5 border-l-3 border-[#2FC191]">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  RECENT POSTS
                </h4>
              </div>

              <div className="space-y-3.5">
                {isPostsLoading ? (
                  <div className="space-y-3 py-1">
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 bg-slate-200 animate-pulse rounded-xs shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 bg-slate-200 animate-pulse rounded-xs w-5/6" />
                        <div className="h-2.5 bg-slate-200 animate-pulse rounded-xs w-1/2" />
                      </div>
                    </div>
                  </div>
                ) : recentStories.length > 0 ? (
                  recentStories.map((item) => {
                    const blogUrl = `/community/blog/${encodeURIComponent(item.slug || item.id)}`;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (onSelectPost) {
                            onSelectPost(item);
                          } else {
                            router.push(blogUrl);
                          }
                        }}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        {item.image ? (
                          <div className="relative w-14 h-14 bg-slate-100 shrink-0 border border-slate-200 overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title || "Story thumbnail"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
                            PT
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h5 className="text-xs font-bold text-[#053697] group-hover:text-[#2FC191] leading-snug line-clamp-2 transition-colors">
                            {item.title || "Featured Sports Article"}
                          </h5>
                          <span className="text-[11px] text-slate-400 block">
                            {item.timestamp || "Recently"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 py-1">
                    No other stories available.
                  </p>
                )}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default BlogArticleView;
