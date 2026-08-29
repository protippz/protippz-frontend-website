"use client";

import React from "react";

interface ModalStatsBarProps {
  likes: number;
  commentsCount: number;
}

export const ModalStatsBar: React.FC<ModalStatsBarProps> = ({
  likes,
  commentsCount,
}) => {
  return (
    <div
      className="flex items-center justify-between pt-2 pb-2.5 border-b text-xs text-[#05369770]"
      style={{ borderColor: "#0536970B" }}
    >
      <div className="flex items-center gap-1.5 font-medium">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2FC191] text-white text-[10px]">
          ❤️
        </span>
        <span className="font-semibold text-[#053697]">{likes}</span>
      </div>
      <div className="flex items-center gap-3 font-medium">
        <span>{commentsCount} comments</span>
      </div>
    </div>
  );
};
