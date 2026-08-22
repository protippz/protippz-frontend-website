"use client";

import React, { memo } from "react";
import { Search, X } from "lucide-react";
import { ContentCategory } from "@/types/community";

interface CommunitySearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory?: ContentCategory;
  onSelectCategory?: (category: ContentCategory) => void;
}

const CATEGORY_OPTIONS: ContentCategory[] = [
  "All",
  "Blog Article",
  "Press Release",
  "Company News",
  "Promotional Content",
  "Community Update",
  "Product Announcement",
];

const CommunitySearchBar = memo(function CommunitySearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory = "All",
  onSelectCategory,
}: CommunitySearchBarProps) {
  return (
    <div className="sticky top-0 z-30 py-2 sm:py-3 backdrop-blur-md transition-all w-full border-b border-border/50 bg-white/90">
      <div className="container mx-auto px-3 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
        {/* Search Bar Input */}
        <div className="relative w-full md:max-w-xs shrink-0 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#233A6C60] pointer-events-none" />
          <input
            type="text"
            placeholder="Search news, articles, releases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl outline-none bg-white border border-[#233A6C15] text-[#233A6C] focus:ring-2 focus:ring-[#308D6F] transition-all shadow-2xs box-border cursor-text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#233A6C60] hover:text-[#233A6C] hover:bg-gray-100 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Horizontal Category Selector (lg:hidden) */}
        {onSelectCategory && (
          <div className="lg:hidden flex items-center gap-2 max-w-screen w-screen overflow-x-auto no-scrollbar py-1 min-w-0 px-2 scroll-smooth">
            {CATEGORY_OPTIONS.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#308D6F] text-white shadow-2xs"
                      : "bg-gray-100 text-[#233A6C] hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export default CommunitySearchBar;
