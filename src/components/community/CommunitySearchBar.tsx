"use client";

import React, { memo, useState } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Check,
  Globe,
  BookOpen,
  Newspaper,
  Building,
  Sparkles,
  Radio,
  Megaphone,
} from "lucide-react";
import { Drawer } from "antd";
import { ContentCategory } from "@/types/community";

interface CommunitySearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory?: ContentCategory;
  onSelectCategory?: (category: ContentCategory) => void;
}

const CATEGORY_ITEMS: {
  name: ContentCategory;
  icon: React.ReactNode;
}[] = [
  {
    name: "All",
    icon: <Globe className="w-4 h-4 text-teal-600" />,
  },
  {
    name: "Blog Article",
    icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
  },
  {
    name: "Press Release",
    icon: <Newspaper className="w-4 h-4 text-blue-600" />,
  },
  {
    name: "Company News",
    icon: <Building className="w-4 h-4 text-amber-600" />,
  },
  {
    name: "Promotional Content",
    icon: <Sparkles className="w-4 h-4 text-rose-600" />,
  },
  {
    name: "Community Update",
    icon: <Radio className="w-4 h-4 text-purple-600" />,
  },
  {
    name: "Product Announcement",
    icon: <Megaphone className="w-4 h-4 text-sky-600" />,
  },
];

const CommunitySearchBar = memo(function CommunitySearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory = "All",
  onSelectCategory,
}: CommunitySearchBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="sticky top-14 z-30 py-2 sm:py-3 backdrop-blur-md transition-all w-full border-b border-border/50">
      <div className="max-w-355 mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
        {/* Search Bar Input */}
        <div className="relative flex-1 md:max-w-xs min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#05369760] pointer-events-none" />
          <input
            type="text"
            placeholder="Search news, articles, releases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl outline-none bg-white border border-[#05369715] text-[#053697] focus:ring-2 focus:ring-[#2FC191] transition-all shadow-2xs box-border cursor-text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#05369760] hover:text-[#053697] hover:bg-gray-100 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Button (lg:hidden) */}
        {onSelectCategory && (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#05369715] text-[#053697] text-xs font-semibold hover:bg-slate-50 transition-all shadow-2xs shrink-0 cursor-pointer active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2FC191]" />
            <span className="hidden sm:inline">Filter</span>
            {selectedCategory !== "All" ? (
              <span className="px-2 py-0.5 rounded-full bg-[#2FC191] text-white text-[10px] font-bold truncate max-w-[90px]">
                {selectedCategory}
              </span>
            ) : (
              <span className="sm:hidden text-xs text-slate-600 font-medium">
                Filter
              </span>
            )}
          </button>
        )}
      </div>

      {/* Mobile Category Sidebar Drawer */}
      {onSelectCategory && (
        <Drawer
          title={
            <div className="flex items-center gap-2 text-[#053697] font-bold text-sm sm:text-base z-999!!">
              <SlidersHorizontal className="w-4 h-4 text-[#2FC191]" />
              <span>Filter Categories</span>
            </div>
          }
          placement="right"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={300}
        >
          <div className="flex flex-col h-full justify-between pb-4">
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Select a category to filter feed posts:
              </p>
              <div className="space-y-1.5">
                {CATEGORY_ITEMS.map((item) => {
                  const isActive = selectedCategory === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onSelectCategory(item.name);
                        setIsDrawerOpen(false);
                      }}
                      style={
                        isActive
                          ? { backgroundColor: "#2FC191", color: "#ffffff" }
                          : undefined
                      }
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left text-xs font-semibold cursor-pointer ${
                        isActive
                          ? "shadow-xs text-white font-bold"
                          : "bg-slate-50 text-[#053697] hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? "text-white" : ""}>
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <Check className="w-4 h-4 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => {
                  onSelectCategory("All");
                  setIsDrawerOpen(false);
                }}
                className="w-full mt-4 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer text-center"
              >
                Reset Filter (Show All)
              </button>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
});

export default CommunitySearchBar;
