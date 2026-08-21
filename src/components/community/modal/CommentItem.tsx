"use client";

import React from "react";
import {
  Heart,
  Users,
  Smile,
  CornerDownRight,
  Trash2,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { levelColors } from "../data/mockData";
import { Comment } from "@/types/community";

interface CommentItemProps {
  postId: string;
  comment: Comment;
  isReply?: boolean;
  likingCommentIds: Record<string, boolean>;
  activeReactionCommentId: string | null;
  onLikeCommentClick: (commentId: string) => void;
  onReplyClick: (commentId: string, userName: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onToggleReaction: (commentId: string, emoji: string) => void;
  setActiveReactionCommentId: React.Dispatch<React.SetStateAction<string | null>>;
}

const QUICK_REACTION_EMOJIS = ["👍", "❤️", "🔥", "😂", "👏", "🏆", "🚀"];

export const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  comment,
  isReply = false,
  likingCommentIds,
  activeReactionCommentId,
  onLikeCommentClick,
  onReplyClick,
  onDeleteComment,
  onToggleReaction,
  setActiveReactionCommentId,
}) => {
  const cmtLevelColor =
    levelColors[comment.user?.level || "Bronze"] || levelColors.Bronze;
  const isQuickReactionOpen = activeReactionCommentId === comment.id;
  const isLiking = Boolean(likingCommentIds[comment.id]);

  if (isReply) {
    return (
      <div className="flex items-start gap-2.5">
        <Avatar className="w-7 h-7 mt-0.5 border border-[#233A6C15] shrink-0 cursor-pointer">
          <AvatarImage
            src={comment.user?.avatar}
            alt={comment.user?.name}
          />
          <AvatarFallback>
            <Users className="w-3 h-3 text-[#233A6C60]" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="relative inline-block bg-[#F0F2F5] px-3.5 py-2 rounded-2xl max-w-full">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="text-xs font-bold text-[#233A6C] hover:underline cursor-pointer">
                {comment.user?.name || "User"}
              </span>
              <span
                className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold"
                style={{
                  backgroundColor: cmtLevelColor.bg,
                  color: cmtLevelColor.text,
                }}
              >
                {comment.user?.level || "Bronze"}
              </span>
            </div>

            <p className="text-xs text-[#233A6C] leading-relaxed whitespace-pre-line">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-[#233A6C70] font-semibold px-2 mt-0.5">
            <button
              type="button"
              disabled={isLiking}
              onClick={() => onLikeCommentClick(comment.id)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                comment.isLiked
                  ? "bg-[#308D6F18] text-[#308D6F] font-bold"
                  : "text-[#233A6C70] hover:text-[#308D6F] hover:bg-gray-100"
              }`}
            >
              {isLiking ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#308D6F] shrink-0" />
              ) : (
                <Heart
                  className="w-3 h-3 shrink-0"
                  fill={comment.isLiked ? "#308D6F" : "none"}
                  stroke={comment.isLiked ? "#308D6F" : "currentColor"}
                />
              )}
              <span>
                {isLiking ? "Liking..." : comment.isLiked ? "Liked" : "Like"}
              </span>
              {comment.likes > 0 && !isLiking && (
                <span className="text-[9px]">({comment.likes})</span>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onReplyClick(comment.parentId || comment.id, comment.user?.name || "User")
              }
              className="hover:underline hover:text-[#308D6F] cursor-pointer"
            >
              Reply
            </button>

            {onDeleteComment && (
              <button
                type="button"
                onClick={() => onDeleteComment(postId, comment.id)}
                className="hover:text-red-600 transition-colors flex items-center gap-0.5 cursor-pointer text-[#233A6C60]"
                title="Delete reply"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}

            <span>{comment.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Top-Level Parent Comment */}
      <div className="flex items-start gap-2.5 group/cmt">
        <Avatar className="w-8 h-8 mt-0.5 border border-[#233A6C15] shrink-0 cursor-pointer">
          <AvatarImage
            src={comment.user?.avatar}
            alt={comment.user?.name}
          />
          <AvatarFallback>
            <Users className="w-4 h-4 text-[#233A6C60]" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Comment Bubble */}
          <div className="relative inline-block bg-[#F0F2F5] px-3.5 py-2.5 rounded-2xl max-w-full">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="text-xs font-bold text-[#233A6C] hover:underline cursor-pointer">
                {comment.user?.name || "User"}
              </span>
              <span
                className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold"
                style={{
                  backgroundColor: cmtLevelColor.bg,
                  color: cmtLevelColor.text,
                }}
              >
                {comment.user?.level || "Bronze"}
              </span>
            </div>

            <p className="text-xs text-[#233A6C] leading-relaxed whitespace-pre-line">
              {comment.content}
            </p>

            {/* Floating Reaction Pill */}
            {comment.reactions && comment.reactions.length > 0 && (
              <div className="absolute -bottom-2 right-2 bg-white shadow-2xs border border-gray-200 px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer">
                {comment.reactions.map((r, idx) => (
                  <span key={idx}>{r.emoji}</span>
                ))}
                <span className="text-[9px] text-gray-500 font-bold ml-0.5">
                  {comment.reactions.reduce(
                    (acc, curr) => acc + curr.count,
                    0
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-3 text-[11px] text-[#233A6C70] font-semibold px-2 mt-1">
            <button
              type="button"
              disabled={isLiking}
              onClick={() => onLikeCommentClick(comment.id)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                comment.isLiked
                  ? "bg-[#308D6F18] text-[#308D6F] font-bold"
                  : "text-[#233A6C70] hover:text-[#308D6F] hover:bg-gray-100"
              }`}
            >
              {isLiking ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#308D6F] shrink-0" />
              ) : (
                <Heart
                  className="w-3 h-3 shrink-0"
                  fill={comment.isLiked ? "#308D6F" : "none"}
                  stroke={comment.isLiked ? "#308D6F" : "currentColor"}
                />
              )}
              <span>
                {isLiking ? "Liking..." : comment.isLiked ? "Liked" : "Like"}
              </span>
              {comment.likes > 0 && !isLiking && (
                <span className="text-[10px]">({comment.likes})</span>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onReplyClick(comment.id, comment.user?.name || "User")
              }
              className="hover:underline hover:text-[#308D6F] flex items-center gap-0.5 cursor-pointer"
            >
              <CornerDownRight className="w-3 h-3 inline" />
              Reply
            </button>

            {onDeleteComment && (
              <button
                type="button"
                onClick={() => onDeleteComment(postId, comment.id)}
                className="hover:text-red-600 transition-colors flex items-center gap-0.5 cursor-pointer text-gray-400"
                title="Delete comment"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}

            <span>{comment.timestamp}</span>

            {/* Quick Emoji Trigger */}
            <div className="relative inline-block ml-auto">
              <button
                type="button"
                onClick={() =>
                  setActiveReactionCommentId(
                    isQuickReactionOpen ? null : comment.id
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
                      onClick={() => onToggleReaction(comment.id, emoji)}
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

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-[#233A6C15] pl-3.5 sm:pl-4 ml-4 space-y-3 pt-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              postId={postId}
              comment={reply}
              isReply={true}
              likingCommentIds={likingCommentIds}
              activeReactionCommentId={activeReactionCommentId}
              onLikeCommentClick={onLikeCommentClick}
              onReplyClick={onReplyClick}
              onDeleteComment={onDeleteComment}
              onToggleReaction={onToggleReaction}
              setActiveReactionCommentId={setActiveReactionCommentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
