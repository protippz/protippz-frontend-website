"use client";

import React from "react";
import { Heart, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface ModalActionToolbarProps {
  postId: string;
  title?: string;
  summary?: string;
  content: string;
  slug?: string;
  isLiked: boolean;
  onLike: (postId: string) => void;
}

export const ModalActionToolbar: React.FC<ModalActionToolbarProps> = ({
  postId,
  title,
  summary,
  content,
  slug,
  isLiked,
  onLike,
}) => {
  const handleShare = async () => {
    const postSlug = slug || postId;
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}?post=${postSlug}`
        : "";

    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title || content,
          text: summary || content,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard!");
          } catch (e) {
            console.error("Failed to copy link:", e);
          }
        }
      }
    } else if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch (e) {
        console.error("Failed to copy link:", e);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 py-0.5 border-b border-border">
      <button
        onClick={() => onLike(postId)}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
          isLiked
            ? "bg-[#308D6F] text-white"
            : "bg-gray-100 hover:bg-gray-200 text-[#233A6C]"
        }`}
      >
        <Heart className="w-4 h-4 shrink-0" fill={isLiked ? "white" : "none"} />
        <span>{isLiked ? "Liked" : "Like"}</span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-[#233A6C] transition-colors cursor-pointer"
      >
        <Share2 className="w-4 h-4 shrink-0" />
        <span>Share</span>
      </button>
    </div>
  );
};
