"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Post, mapBackendCommentToComment } from "@/types/community";
import { mockUsers } from "./data/mockData";
import { useGetCommentsByPostQuery } from "@/Redux/Apis/commentApis";
import { ModalHeader } from "./modal/ModalHeader";
import { ModalPostContent } from "./modal/ModalPostContent";
import { ModalStatsBar } from "./modal/ModalStatsBar";
import { ModalActionToolbar } from "./modal/ModalActionToolbar";
import { CommentList } from "./modal/CommentList";
import { CommentFormFooter } from "./modal/CommentFormFooter";

interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (postId: string) => void;
  onAddComment: (
    postId: string,
    content: string,
    parentId?: string,
    imageFile?: File
  ) => void;
  onDeleteComment?: (postId: string, commentId: string) => Promise<any> | void;
  onLikeComment?: (postId: string, commentId: string) => Promise<any> | void;
  onCommentReaction?: (
    postId: string,
    commentId: string,
    emoji: string
  ) => void;
  isPostingComment?: boolean;
}

export const PostModal: React.FC<PostModalProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onAddComment,
  onDeleteComment,
  onLikeComment,
  onCommentReaction,
  isPostingComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [activeReactionCommentId, setActiveReactionCommentId] = useState<
    string | null
  >(null);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    userName: string;
  } | null>(null);

  // Track per-comment liking & deleting status independently
  const [likingCommentIds, setLikingCommentIds] = useState<
    Record<string, boolean>
  >({});
  const [deletingCommentIds, setDeletingCommentIds] = useState<
    Record<string, boolean>
  >({});

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = mockUsers[0];

  // Fetch comments for current post from API
  const { data: commentsApiResponse, isLoading: isCommentsLoading } =
    useGetCommentsByPostQuery(post?.id, {
      skip: !isOpen || !post?.id,
    }) as { data?: any; isLoading: boolean };

  // Transform raw API comment list into frontend Comment hierarchy
  const processedComments = useMemo(() => {
    const rawList =
      commentsApiResponse?.data?.result ||
      commentsApiResponse?.data ||
      commentsApiResponse?.result ||
      (Array.isArray(commentsApiResponse) ? commentsApiResponse : []);

    if (!Array.isArray(rawList)) return [];

    const mapped = rawList.map(mapBackendCommentToComment);

    const hasNested = mapped.some((c) => c.replies && c.replies.length > 0);
    if (hasNested) return mapped;

    const topLevel: any[] = [];
    const commentMap = new Map<string, any>();

    mapped.forEach((c) => {
      commentMap.set(c.id, { ...c, replies: [] });
    });

    mapped.forEach((c) => {
      const current = commentMap.get(c.id)!;
      if (c.parentId && commentMap.has(c.parentId)) {
        const parent = commentMap.get(c.parentId)!;
        parent.replies = parent.replies || [];
        parent.replies.push(current);
      } else {
        topLevel.push(current);
      }
    });

    return topLevel;
  }, [commentsApiResponse]);

  // Handle Comment Like with targeted loading state per comment
  const handleCommentLikeClick = async (commentId: string) => {
    if (!post?.id || likingCommentIds[commentId]) return;

    setLikingCommentIds((prev) => ({ ...prev, [commentId]: true }));

    if (onLikeComment) {
      try {
        await onLikeComment(post.id, commentId);
      } catch (err) {
        console.error("Failed to like comment:", err);
      } finally {
        setLikingCommentIds((prev) => ({ ...prev, [commentId]: false }));
      }
    } else {
      setLikingCommentIds((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  // Handle Comment Delete with targeted loading state per comment
  const handleDeleteCommentClick = async (
    postId: string,
    commentId: string
  ) => {
    if (!commentId || deletingCommentIds[commentId]) return;

    setDeletingCommentIds((prev) => ({ ...prev, [commentId]: true }));

    if (onDeleteComment) {
      try {
        await onDeleteComment(postId, commentId);
      } catch (err) {
        console.error("Failed to delete comment:", err);
      } finally {
        setDeletingCommentIds((prev) => ({ ...prev, [commentId]: false }));
      }
    } else {
      setDeletingCommentIds((prev) => ({ ...prev, [commentId]: false }));
    }
  };

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
      setSelectedImage(null);
      setImagePreview(null);
      setLikingCommentIds({});
      setDeletingCommentIds({});
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim() && !selectedImage) return;

    let finalContent = commentText.trim();
    if (replyingTo) {
      finalContent = `@${replyingTo.userName} ${finalContent}`;
    }

    onAddComment(
      post.id,
      finalContent,
      replyingTo?.id,
      selectedImage || undefined
    );
    setCommentText("");
    setSelectedImage(null);
    setImagePreview(null);
    setReplyingTo(null);
    setIsEmojiPickerOpen(false);
  };

  const handleToggleCommentReaction = (commentId: string, emoji: string) => {
    if (onLikeComment) {
      handleCommentLikeClick(commentId);
    } else if (onCommentReaction) {
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

  const activeComments = processedComments;
  const totalCommentCount = Math.max(post.comments || 0, activeComments.length);

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

      {/* Modal Container */}
      <div
        data-lenis-prevent
        className="relative bg-[#FAFBFB] w-full max-w-2xl max-h-[92dvh] sm:max-h-[88dvh] h-[92dvh] sm:h-auto rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border-t sm:border border-border z-10 animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Modal Header */}
        <ModalHeader
          user={post.user}
          timestamp={post.timestamp}
          isTrending={post.isTrending}
          onClose={onClose}
        />

        {/* Scrollable Modal Body */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar"
        >
          {/* Post Content */}
          <ModalPostContent
            title={post.title}
            summary={post.summary}
            content={post.content}
            tags={post.tags}
            image={post.image}
            videoUrl={post.videoUrl}
            videoEmbedCode={post.videoEmbedCode}
          />

          {/* Stats Bar */}
          <ModalStatsBar
            likes={post.likes}
            commentsCount={totalCommentCount}
          />

          {/* Action Toolbar */}
          <ModalActionToolbar
            postId={post.id}
            title={post.title}
            summary={post.summary}
            content={post.content}
            slug={post.slug}
            isLiked={post.isLiked}
            onLike={onLike}
          />

          {/* Comments Section */}
          <CommentList
            comments={activeComments}
            totalCommentCount={totalCommentCount}
            isLoading={isCommentsLoading}
            postId={post.id}
            likingCommentIds={likingCommentIds}
            deletingCommentIds={deletingCommentIds}
            activeReactionCommentId={activeReactionCommentId}
            onLikeCommentClick={handleCommentLikeClick}
            onReplyClick={handleReplyClick}
            onDeleteComment={handleDeleteCommentClick}
            onToggleReaction={handleToggleCommentReaction}
            setActiveReactionCommentId={setActiveReactionCommentId}
          />
        </div>

        {/* Sticky Comment Footer */}
        <CommentFormFooter
          commentText={commentText}
          setCommentText={setCommentText}
          selectedImage={selectedImage}
          imagePreview={imagePreview}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          isEmojiPickerOpen={isEmojiPickerOpen}
          setIsEmojiPickerOpen={setIsEmojiPickerOpen}
          onImageSelect={handleImageSelect}
          onRemoveImage={handleRemoveImage}
          onSubmit={handleSubmitComment}
          inputRef={inputRef}
          fileInputRef={fileInputRef}
          currentUser={currentUser}
          isPostingComment={isPostingComment}
        />
      </div>
    </div>
  );
};

export default PostModal;
