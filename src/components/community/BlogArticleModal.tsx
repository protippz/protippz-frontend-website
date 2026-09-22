"use client";

import React, { useEffect } from "react";
import { Post } from "@/types/community";
import BlogArticleView from "./BlogArticleView";

interface BlogArticleModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (postId: string) => void;
  onCommentClick?: (post: Post) => void;
  onSelectPost?: (post: Post) => void;
  scrollToComments?: boolean;
  onDeleteComment?: (postId: string, commentId: string) => Promise<any> | void;
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  post,
  isOpen,
  onClose,
  onSelectPost,
  scrollToComments = false,
  onDeleteComment,
}) => {
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

  // Scroll to top when selected blog post changes (unless opening directly to comments)
  useEffect(() => {
    if (!scrollToComments) {
      const container = document.getElementById("blog-modal-container");
      if (container) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [post?.id, post?.slug, scrollToComments]);

  if (!isOpen || !post) return null;

  return (
    <div
      id="blog-modal-container"
      className="fixed inset-0 z-[99999] bg-white overflow-y-auto flex flex-col text-slate-900 animate-in fade-in duration-200"
    >
      <BlogArticleView
        key={post.id || post.slug}
        post={post}
        isModal={true}
        onClose={onClose}
        onSelectPost={onSelectPost}
        scrollToComments={scrollToComments}
        onDeleteComment={onDeleteComment}
      />
    </div>
  );
};

export default BlogArticleModal;
