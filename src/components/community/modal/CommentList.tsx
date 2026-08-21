"use client";

import React from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { Comment } from "@/types/community";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  totalCommentCount: number;
  isLoading: boolean;
  postId: string;
  likingCommentIds: Record<string, boolean>;
  activeReactionCommentId: string | null;
  onLikeCommentClick: (commentId: string) => void;
  onReplyClick: (commentId: string, userName: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onToggleReaction: (commentId: string, emoji: string) => void;
  setActiveReactionCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  isDeleting?: boolean;
  isLiking?: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  totalCommentCount,
  isLoading,
  postId,
  likingCommentIds,
  activeReactionCommentId,
  onLikeCommentClick,
  onReplyClick,
  onDeleteComment,
  onToggleReaction,
  setActiveReactionCommentId,
  isDeleting,
  isLiking,
}) => {
  return (
    <div className="space-y-4 pt-2">
      <h4 className="text-xs font-bold text-[#233A6C] uppercase tracking-wider">
        Comments ({totalCommentCount})
      </h4>

      {isLoading && comments.length === 0 ? (
        <div className="py-8 flex items-center justify-center gap-2 text-xs font-semibold text-[#308D6F]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading comments...</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((cmt) => (
            <CommentItem
              key={cmt.id}
              postId={postId}
              comment={cmt}
              likingCommentIds={likingCommentIds}
              activeReactionCommentId={activeReactionCommentId}
              onLikeCommentClick={onLikeCommentClick}
              onReplyClick={onReplyClick}
              onDeleteComment={onDeleteComment}
              onToggleReaction={onToggleReaction}
              setActiveReactionCommentId={setActiveReactionCommentId}
              isDeleting={isDeleting}
              isLiking={isLiking}
            />
          ))}
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
  );
};
