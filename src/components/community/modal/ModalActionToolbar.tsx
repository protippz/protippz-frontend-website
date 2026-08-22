"use client";

import React from "react";
import { Heart, Share2 } from "lucide-react";
import { sharePostLink } from "../helpers";

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
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await sharePostLink({
      postId,
      title,
      summary,
      content,
      slug,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2 py-0.5 ">
      <button
        type="button"
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
        type="button"
        onClick={handleShare}
        className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-[#233A6C] transition-colors cursor-pointer active:scale-95"
      >
        <Share2 className="w-4 h-4 shrink-0" />
        <span>Share</span>
      </button>
    </div>
  );
};
