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
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  post,
  isOpen,
  onClose,
  onSelectPost,
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

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-white overflow-y-auto flex flex-col text-slate-900 animate-in fade-in duration-200">
      <BlogArticleView
        post={post}
        isModal={true}
        onClose={onClose}
        onSelectPost={onSelectPost}
      />
    </div>
  );
};

export default BlogArticleModal;
