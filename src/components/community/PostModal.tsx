"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn } from "lucide-react";
import { useAuth } from "@/provider/ContextProvider";
import { Post, User, mapBackendCommentToComment } from "@/types/community";
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
  const router = useRouter();
  const { userData } = useAuth();
  const isLoggedIn = Boolean(userData?._id);

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

  const currentUser: User = useMemo(() => {
    if (userData) {
      return {
        id: userData._id || "curr_user",
        name: userData.name || "User",
        avatar: userData.profile_image || mockUsers[0].avatar,
        level: "Gold" as const,
        xp: 100,
        badges: [],
      };
    }
    return mockUsers[0];
  }, [userData]);

  const handleGoToLogin = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/sign-in?redirect=${encodeURIComponent(currentUrl)}`);
    }
  };

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
    if (!isLoggedIn) {
      handleGoToLogin();
      return;
    }
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
    if (!isLoggedIn) {
      handleGoToLogin();
      return;
    }
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
    if (!isLoggedIn) {
      handleGoToLogin();
      return;
    }
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
    if (!isLoggedIn) {
      handleGoToLogin();
      return;
    }
    if (onLikeComment) {
      handleCommentLikeClick(commentId);
    } else if (onCommentReaction) {
      onCommentReaction(post.id, commentId, emoji);
    }
    setActiveReactionCommentId(null);
  };

  const handleReplyClick = (commentId: string, userName: string) => {
    if (!isLoggedIn) {
      handleGoToLogin();
      return;
    }
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
            isLoggedIn={isLoggedIn}
            onRequireLogin={handleGoToLogin}
          />

          {/* Comments Section Container */}
          <div className="relative min-h-[220px]">
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

            {!isLoggedIn && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-gray-200/80 shadow-md animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-[#308D6F]/10 flex items-center justify-center mb-3 text-[#308D6F] shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#233A6C] mb-1">
                  Log in to join the discussion
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mb-4 leading-relaxed">
                  You need to be signed in to post comments, reply to existing comments, or like posts.
                </p>
                <button
                  type="button"
                  onClick={handleGoToLogin}
                  className="px-5 py-2.5 rounded-xl bg-[#308D6F] hover:bg-[#257259] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Go to Login</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Comment Footer */}
        {isLoggedIn ? (
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
        ) : (
          <div className="p-3 sm:p-4 bg-gray-50/90 border-t text-center text-xs text-gray-600 font-medium flex items-center justify-center gap-2 shrink-0">
            <Lock className="w-4 h-4 text-[#308D6F]" />
            <span>
              Please{" "}
              <button
                type="button"
                onClick={handleGoToLogin}
                className="text-[#308D6F] font-bold hover:underline cursor-pointer"
              >
                sign in
              </button>{" "}
              to write a comment or reply.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal;
