"use client";

import React from "react";
import { X, Users, TrendingUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getLevelIcon } from "../helpers";
import { levelColors } from "../data/mockData";
import { User } from "@/types/community";

interface ModalHeaderProps {
  user?: User;
  timestamp: string;
  isTrending?: boolean;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  user,
  timestamp,
  isTrending,
  onClose,
}) => {
  const levelColor =
    levelColors[user?.level || "Bronze"] || levelColors.Bronze;

  return (
    <div
      className="flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0 bg-white"
      style={{ borderColor: "#233A6C0B" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border border-[#233A6C15] shrink-0 cursor-pointer">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback>
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#233A6C60]" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-xs sm:text-base text-[#233A6C] truncate cursor-pointer hover:underline">
              {user?.name || "User"}
            </h3>
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold shrink-0 cursor-default"
              style={{
                backgroundColor: levelColor.bg,
                color: levelColor.text,
                border: `1px solid ${levelColor.border}`,
              }}
            >
              {getLevelIcon(user?.level || "Bronze")}
              {user?.level || "Bronze"}
            </div>
            {isTrending && (
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold shrink-0"
                style={{ backgroundColor: "#F6E05E20", color: "#D69E2E" }}
              >
                <TrendingUp className="w-3 h-3" />
                Hot
              </div>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-[#233A6C60]">{timestamp}</p>
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
  );
};
