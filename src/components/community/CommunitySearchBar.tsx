"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { ContentCategory } from "@/types/community";

interface CommunitySearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ContentCategory;
  setSelectedCategory: (category: ContentCategory) => void;
}

const CATEGORIES: ContentCategory[] = [
  "All",
  "Blog Article",
  "Press Release",
  "Company News",
  "Promotional Content",
  "Community Update",
  "Product Announcement",
];

export default function CommunitySearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: CommunitySearchBarProps) {
  return (
    <div className="sticky top-0 z-30 py-2 sm:py-3 bg-[#FAFBFB] border-b border-[#233A6C12] transition-all w-full overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
        {/* Search Bar Input */}
        <div className="relative w-full md:max-w-xs shrink-0 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#233A6C60] pointer-events-none" />
          <input
            type="text"
            placeholder="Search news, articles, releases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl outline-none bg-white border border-[#233A6C20] text-[#233A6C] focus:ring-2 focus:ring-[#308D6F] transition-all shadow-sm box-border"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#233A6C60] hover:text-[#233A6C] hover:bg-gray-100 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Tabs Container */}
        <div className="w-full min-w-0 overflow-x-auto touch-pan-x py-0.5 scroll-smooth [&::-webkit-scrollbar]:hidden [ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center gap-1.5 w-max min-w-full">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? "bg-[#308D6F] text-white shadow-sm"
                      : "bg-white text-[#233A6C80] hover:text-[#233A6C] border border-[#233A6C15] hover:border-[#308D6F50]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
