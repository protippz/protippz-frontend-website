"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface CommunitySearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function CommunitySearchBar({
  searchQuery,
  setSearchQuery,
}: CommunitySearchBarProps) {
  return (
    <div className="sticky top-[0px] z-30 py-3 bg-[#FAFBFB]">
      <div className="container mx-auto px-4  flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#233A6C60]" />
          <input
            type="text"
            placeholder="Search posts, users, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-sm rounded-xl outline-none bg-white border border-[#233A6C20] text-[#233A6C] focus:ring-2 focus:ring-[#308D6F] transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#233A6C60] hover:text-[#233A6C] hover:bg-gray-100 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
