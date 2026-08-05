"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Heart,
  Share2,
  Send,
  MessageCircle,
  Tag,
  Users,
  Smile,
  TrendingUp,
  CornerDownRight,
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
  onAddComment: (postId: string, content: string, parentId?: string) => void;
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
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    userName: string;
  } | null>(null);

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
      setReplyingTo(null);
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

    let finalContent = commentText.trim();
    if (replyingTo) {
      finalContent = `@${replyingTo.userName} ${finalContent}`;
    }

    onAddComment(post.id, finalContent, replyingTo?.id);
    setCommentText("");
    setReplyingTo(null);
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

  const handleReplyClick = (commentId: string, userName: string) => {
    setReplyingTo({ id: commentId, userName });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Click outside backdrop to close */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Facebook Style Modal Container */}
      <div
        data-lenis-prevent
        className="relative bg-[#FAFBFB] w-full max-w-2xl max-h-[92dvh] sm:max-h-[88dvh] h-[92dvh] sm:h-auto rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border-t sm:border border-border z-10 animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Facebook Style Header */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0 bg-white"
          style={{ borderColor: "#233A6C0B" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border border-[#233A6C15] shrink-0 cursor-pointer">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#233A6C60]" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-xs sm:text-base text-[#233A6C] truncate cursor-pointer hover:underline">
                  {post.user.name}
                </h3>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold shrink-0 cursor-default"
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
                    Hot
                  </div>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-[#233A6C60]">
                {post.timestamp}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800 shrink-0 cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar"
        >
          {/* Post Text & Meta */}
          <div className="space-y-2">
            {post.title && (
              <h2 className="text-base sm:text-xl font-bold text-[#233A6C] leading-snug">
                {post.title}
              </h2>
            )}

            {post.summary && (
              <p className="text-xs sm:text-sm font-medium text-[#233A6C75] leading-relaxed">
                {post.summary}
              </p>
            )}

            <p className="text-xs sm:text-sm leading-relaxed text-[#233A6C90] whitespace-pre-line">
              {post.content}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold text-[#308D6F] hover:underline cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Post Video or Image Media */}
          {videoEmbedSrc ? (
            <div className="rounded-xl overflow-hidden bg-black aspect-video relative border border-border shadow-2xs">
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
            <div className="rounded-xl overflow-hidden bg-black/5 border border-border">
              <Image
                src={post.image}
                alt="Post Attachment"
                width={700}
                height={400}
                className="w-full h-auto max-h-[280px] sm:max-h-[380px] object-cover rounded-xl"
              />
            </div>
          ) : null}

          {/* Facebook Style Stats Summary Bar */}
          <div
            className="flex items-center justify-between pt-2 pb-2.5 border-b text-xs text-[#233A6C70]"
            style={{ borderColor: "#233A6C0B" }}
          >
            <div className="flex items-center gap-1.5 font-medium">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#308D6F] text-white text-[10px]">
                ❤️
              </span>
              <span className="font-semibold text-[#233A6C]">{post.likes}</span>
            </div>
            <div className="flex items-center gap-3 font-medium">
              <span>{post.comments} comments</span>
            </div>
          </div>

          {/* Facebook Style Action Toolbar (Like / Comment / Share) */}
          <div className="grid grid-cols-2 gap-2 py-0.5 border-b border-border">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                post.isLiked
                  ? "bg-[#308D6F] text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-[#233A6C]"
              }`}
            >
              <Heart
                className="w-4 h-4 shrink-0"
                fill={post.isLiked ? "white" : "none"}
              />
              <span>{post.isLiked ? "Liked" : "Like"}</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined" && navigator.share) {
                  navigator.share({
                    title: post.title || post.content,
                    text: post.summary || post.content,
                    url: window.location.href,
                  });
                }
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-[#233A6C] transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span>Share</span>
            </button>
          </div>

          {/* Facebook Style Comments & Threaded Replies Section */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#233A6C] uppercase tracking-wider">
              Comments ({post.comments})
            </h4>

            {post.commentsList && post.commentsList.length > 0 ? (
              <div className="space-y-4">
                {post.commentsList.map((cmt) => {
                  const cmtLevelColor =
                    levelColors[cmt.user.level] || levelColors.Bronze;
                  const isQuickReactionOpen =
                    activeReactionCommentId === cmt.id;

                  return (
                    <div key={cmt.id} className="space-y-2">
                      {/* Top-Level Parent Comment */}
                      <div className="flex items-start gap-2.5">
                        <Avatar className="w-8 h-8 mt-0.5 border border-[#233A6C15] shrink-0 cursor-pointer">
                          <AvatarImage
                            src={cmt.user.avatar}
                            alt={cmt.user.name}
                          />
                          <AvatarFallback>
                            <Users className="w-4 h-4 text-[#233A6C60]" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* Facebook Style Rounded Comment Bubble */}
                          <div className="relative inline-block bg-[#F0F2F5] px-3.5 py-2.5 rounded-2xl max-w-full">
                            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                              <span className="text-xs font-bold text-[#233A6C] hover:underline cursor-pointer">
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
                            </div>

                            <p className="text-xs text-[#233A6C] leading-relaxed whitespace-pre-line">
                              {cmt.content}
                            </p>

                            {/* Floating Reaction Pill Badge */}
                            {cmt.reactions && cmt.reactions.length > 0 && (
                              <div className="absolute -bottom-2 right-2 bg-white shadow-2xs border border-gray-200 px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer">
                                {cmt.reactions.map((r, idx) => (
                                  <span key={idx}>{r.emoji}</span>
                                ))}
                                <span className="text-[9px] text-gray-500 font-bold ml-0.5">
                                  {cmt.reactions.reduce(
                                    (acc, curr) => acc + curr.count,
                                    0,
                                  )}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Facebook Style Comment Action Links */}
                          <div className="flex items-center gap-3 text-[11px] text-[#233A6C70] font-semibold px-2 mt-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleCommentReaction(cmt.id, "👍")
                              }
                              className="hover:underline hover:text-[#308D6F] cursor-pointer"
                            >
                              Like
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleReplyClick(cmt.id, cmt.user.name)
                              }
                              className="hover:underline hover:text-[#308D6F] flex items-center gap-0.5 cursor-pointer"
                            >
                              <CornerDownRight className="w-3 h-3 inline" />
                              Reply
                            </button>

                            <span>{cmt.timestamp}</span>

                            {/* Quick Emoji Reaction Trigger */}
                            <div className="relative inline-block ml-auto">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveReactionCommentId(
                                    isQuickReactionOpen ? null : cmt.id,
                                  )
                                }
                                className="p-1 text-gray-400 hover:text-[#308D6F] transition-colors cursor-pointer"
                                title="React"
                              >
                                <Smile className="w-3.5 h-3.5" />
                              </button>

                              {isQuickReactionOpen && (
                                <div className="absolute bottom-full right-0 mb-1 z-30 bg-white shadow-xl rounded-full px-2 py-1 border border-gray-200 flex items-center gap-1 animate-in fade-in duration-150">
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
                                      className="p-1 hover:bg-gray-100 rounded-lg text-base cursor-pointer"
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

                      {/* Facebook Style Threaded Nested Replies */}
                      {cmt.replies && cmt.replies.length > 0 && (
                        <div className="border-l-2 border-[#233A6C15] pl-3.5 sm:pl-4 ml-4 space-y-3 pt-1">
                          {cmt.replies.map((reply) => {
                            const replyLevelColor =
                              levelColors[reply.user.level] ||
                              levelColors.Bronze;
                            return (
                              <div
                                key={reply.id}
                                className="flex items-start gap-2.5"
                              >
                                <Avatar className="w-7 h-7 mt-0.5 border border-[#233A6C15] shrink-0 cursor-pointer">
                                  <AvatarImage
                                    src={reply.user.avatar}
                                    alt={reply.user.name}
                                  />
                                  <AvatarFallback>
                                    <Users className="w-3 h-3 text-[#233A6C60]" />
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <div className="relative inline-block bg-[#F0F2F5] px-3.5 py-2 rounded-2xl max-w-full">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                      <span className="text-xs font-bold text-[#233A6C] hover:underline cursor-pointer">
                                        {reply.user.name}
                                      </span>
                                      <span
                                        className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold"
                                        style={{
                                          backgroundColor: replyLevelColor.bg,
                                          color: replyLevelColor.text,
                                        }}
                                      >
                                        {reply.user.level}
                                      </span>
                                    </div>

                                    <p className="text-xs text-[#233A6C] leading-relaxed whitespace-pre-line">
                                      {reply.content}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-3 text-[10px] text-[#233A6C70] font-semibold px-2 mt-0.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleToggleCommentReaction(
                                          reply.id,
                                          "👍",
                                        )
                                      }
                                      className="hover:underline hover:text-[#308D6F] cursor-pointer"
                                    >
                                      Like
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleReplyClick(
                                          cmt.id,
                                          reply.user.name,
                                        )
                                      }
                                      className="hover:underline hover:text-[#308D6F] cursor-pointer"
                                    >
                                      Reply
                                    </button>

                                    <span>{reply.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-white rounded-xl border border-dashed border-gray-200">
                <MessageCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  No comments yet. Be the first to start the thread!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Facebook Style Sticky Comment Footer */}
        <div className="relative border-t bg-white shrink-0">
          {/* Replying Banner Indicator */}
          {replyingTo && (
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#308D6F12] border-b border-[#308D6F25] text-xs">
              <span className="text-[#308D6F] font-semibold flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5" />
                Replying to{" "}
                <span className="font-bold">@{replyingTo.userName}</span>
              </span>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="p-0.5 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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
                placeholder={
                  replyingTo
                    ? `Reply to @${replyingTo.userName}...`
                    : "Write a comment..."
                }
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
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors cursor-pointer ${
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
              className="p-2 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5 cursor-pointer"
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
