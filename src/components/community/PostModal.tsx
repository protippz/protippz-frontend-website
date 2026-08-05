"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Heart,
  DollarSign,
  Share2,
  Send,
  MessageCircle,
  Tag,
  Users,
  Smile,
  TrendingUp,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getLevelIcon, getEmbedVideoUrl } from "./helpers";
import { levelColors, mockUsers } from "./data/mockData";
import { Post } from "@/types/community";
import EmojiPicker from "./EmojiPicker";

interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onCommentReaction?: (
    postId: string,
    commentId: string,
    emoji: string,
  ) => void;
}

const QUICK_REACTION_EMOJIS = ["👍", "❤️", "🔥", "😂", "👏", "🏆", "🚀"];

export const PostModal: React.FC<PostModalProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onAddComment,
  onCommentReaction,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [activeReactionCommentId, setActiveReactionCommentId] = useState<
    string | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = mockUsers[0];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      setIsEmojiPickerOpen(false);
      setActiveReactionCommentId(null);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  const levelColor = levelColors[post.user.level] || levelColors.Bronze;
  const videoEmbedSrc = getEmbedVideoUrl(post.videoUrl, post.videoEmbedCode);

  const handleSubmitComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(post.id, commentText.trim());
    setCommentText("");
    setIsEmojiPickerOpen(false);
  };

  const handleInsertEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleToggleCommentReaction = (commentId: string, emoji: string) => {
    if (onCommentReaction) {
      onCommentReaction(post.id, commentId, emoji);
    }
    setActiveReactionCommentId(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card Container (Bottom Sheet on Mobile, Centered Dialog on Desktop) */}
      <div
        data-lenis-prevent
        className="relative bg-[#FAFBFB] w-full max-w-2xl max-h-[92dvh] sm:max-h-[88dvh] h-[92dvh] sm:h-auto rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border-t sm:border border-[#233A6C1A] z-10 animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0"
          style={{ borderColor: "#233A6C12", backgroundColor: "#FAFBFB" }}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border border-[#233A6C15] shrink-0">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#233A6C60]" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3
                  className="font-semibold text-xs sm:text-base truncate"
                  style={{ color: "#233A6C" }}
                >
                  {post.user.name}
                </h3>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold shrink-0"
                  style={{
                    backgroundColor: levelColor.bg,
                    color: levelColor.text,
                    border: `1px solid ${levelColor.border}`,
                  }}
                >
                  {getLevelIcon(post.user.level)}
                  {post.user.level}
                </div>
                {post.isTrending && (
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold shrink-0"
                    style={{ backgroundColor: "#F6E05E20", color: "#D69E2E" }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                )}
              </div>
              <p
                className="text-[10px] sm:text-xs mt-0.5"
                style={{ color: "#233A6C60" }}
              >
                {post.timestamp}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-gray-200/60 transition-colors text-gray-500 hover:text-gray-800 shrink-0"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar"
        >
          {/* Post Title & Text */}
          <div className="space-y-2">
            {post.title && (
              <h2 className="text-lg sm:text-2xl font-bold text-[#233A6C] leading-snug">
                {post.title}
              </h2>
            )}

            {post.summary && (
              <p className="text-xs sm:text-sm font-medium text-[#233A6C75] italic leading-relaxed">
                {post.summary}
              </p>
            )}

            <p className="text-xs sm:text-base leading-relaxed text-slate-800 whitespace-pre-line">
              {post.content}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold text-[#308D6F]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {post.taggedPlayer && (
              <div className="flex items-center gap-1.5 mt-2.5">
                <Tag className="w-3.5 h-3.5" style={{ color: "#308D6F" }} />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#308D6F" }}
                >
                  {post.taggedPlayer}
                </span>
              </div>
            )}
          </div>

          {/* Post Video or Image */}
          {videoEmbedSrc ? (
            <div className="rounded-xl overflow-hidden bg-black aspect-video relative border border-gray-100 shadow-sm">
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
            <div className="rounded-xl overflow-hidden bg-black/5 border border-gray-100">
              <Image
                src={post.image}
                alt="Post Attachment"
                width={700}
                height={400}
                className="w-full h-auto max-h-[280px] sm:max-h-[420px] object-cover rounded-xl"
              />
            </div>
          ) : null}

          {/* Stats Summary Bar */}
          <div
            className="flex items-center justify-between pt-2 pb-3 border-b"
            style={{ borderColor: "#233A6C0F" }}
          >
            <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[#233A6C]">
                  {post.likes}
                </span>
                <span style={{ color: "#233A6C60" }}>likes</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[#233A6C]">
                  {post.comments}
                </span>
                <span style={{ color: "#233A6C60" }}>comments</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[#308D6F]">
                  ${post.tips}
                </span>
                <span style={{ color: "#233A6C60" }}>tips</span>
              </div>
            </div>
          </div>

          {/* Action Buttons inside Modal */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-1">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold transition-colors ${
                post.isLiked ? "text-white" : ""
              }`}
              style={{
                backgroundColor: post.isLiked ? "#308D6F" : "#233A6C0F",
                color: post.isLiked ? "#fff" : "#233A6C",
              }}
            >
              <Heart
                className="w-4 h-4 shrink-0"
                fill={post.isLiked ? "white" : "none"}
              />
              <span>Like</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined" && navigator.share) {
                  navigator.share({
                    title: post.content,
                    text: post.content,
                    url: window.location.href,
                  });
                }
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold transition-colors hover:bg-[#233A6C0B]"
              style={{ backgroundColor: "#233A6C0F", color: "#233A6C" }}
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span>Share</span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-[#233A6C0F] my-2" />

          {/* Comments List Section */}
          <div className="space-y-4 pt-1">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#233A6C80] mb-3">
              Comments ({post.comments})
            </h4>

            {post.commentsList && post.commentsList.length > 0 ? (
              <div className="space-y-3">
                {post.commentsList.map((cmt) => {
                  const cmtLevelColor =
                    levelColors[cmt.user.level] || levelColors.Bronze;
                  const isQuickReactionOpen =
                    activeReactionCommentId === cmt.id;

                  return (
                    <div
                      key={cmt.id}
                      className="relative p-3 rounded-2xl bg-white border border-[#233A6C0F] shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <Avatar className="w-8 h-8 mt-0.5 border border-[#233A6C15] shrink-0">
                          <AvatarImage
                            src={cmt.user.avatar}
                            alt={cmt.user.name}
                          />
                          <AvatarFallback>
                            <Users className="w-4 h-4 text-[#233A6C60]" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-[#233A6C]">
                              {cmt.user.name}
                            </span>
                            <span
                              className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold"
                              style={{
                                backgroundColor: cmtLevelColor.bg,
                                color: cmtLevelColor.text,
                              }}
                            >
                              {cmt.user.level}
                            </span>
                            <span className="text-[10px] text-gray-400 ml-auto">
                              {cmt.timestamp}
                            </span>
                          </div>

                          <p className="text-xs mt-1 text-slate-700 leading-relaxed whitespace-pre-line">
                            {cmt.content}
                          </p>

                          {/* Reaction Badges & Reaction Picker Trigger */}
                          <div className="flex items-center gap-1.5 flex-wrap mt-2.5 pt-1">
                            {/* Render Active Emoji Reactions */}
                            {cmt.reactions && cmt.reactions.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap">
                                {cmt.reactions.map((r, i) => (
                                  <button
                                    key={`${r.emoji}-${i}`}
                                    type="button"
                                    onClick={() =>
                                      handleToggleCommentReaction(
                                        cmt.id,
                                        r.emoji,
                                      )
                                    }
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                                      r.isReacted
                                        ? "bg-[#308D6F15] text-[#308D6F] border border-[#308D6F40]"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200/70 border border-transparent"
                                    }`}
                                  >
                                    <span>{r.emoji}</span>
                                    <span>{r.count}</span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* React Popover Trigger Button */}
                            <div className="relative inline-block">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveReactionCommentId(
                                    isQuickReactionOpen ? null : cmt.id,
                                  )
                                }
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-500 hover:text-[#308D6F] hover:bg-gray-100 transition-colors"
                                title="React to comment"
                              >
                                <Smile className="w-3.5 h-3.5" />
                                <Plus className="w-2.5 h-2.5 -ml-1" />
                              </button>

                              {/* Floating Quick Emoji Bar for Comment */}
                              {isQuickReactionOpen && (
                                <div className="absolute bottom-full left-0 mb-1 z-30 bg-white shadow-xl rounded-full px-2 py-1 border border-gray-200 flex items-center gap-1 animate-in fade-in duration-150">
                                  {QUICK_REACTION_EMOJIS.map((emoji) => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() =>
                                        handleToggleCommentReaction(
                                          cmt.id,
                                          emoji,
                                        )
                                      }
                                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-base"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-white rounded-xl border border-dashed border-gray-200">
                <MessageCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  No comments yet. Start the conversation!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Comment Form Footer */}
        <div
          className="relative border-t bg-white shrink-0"
          style={{ borderColor: "#233A6C12" }}
        >
          {/* Emoji Picker Popover */}
          <EmojiPicker
            isOpen={isEmojiPickerOpen}
            onClose={() => setIsEmojiPickerOpen(false)}
            onSelectEmoji={handleInsertEmoji}
            align="right"
          />

          <form
            onSubmit={handleSubmitComment}
            className="p-3 sm:p-4 pb-safe flex items-center gap-2 sm:gap-3"
          >
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>
                <Users className="w-4 h-4 text-[#233A6C60]" />
              </AvatarFallback>
            </Avatar>

            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Write a comment with emoji..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full pl-3 pr-9 py-2 text-xs sm:text-sm rounded-xl outline-none border transition-colors focus:border-[#308D6F]"
                style={{
                  backgroundColor: "#F0F2F5",
                  borderColor: "#233A6C15",
                  color: "#233A6C",
                }}
              />
              <button
                type="button"
                onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                  isEmojiPickerOpen
                    ? "text-[#308D6F]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="Choose an emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5"
              style={{ backgroundColor: "#308D6F" }}
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
