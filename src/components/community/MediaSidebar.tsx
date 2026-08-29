"use client";

import React, { memo } from "react";
import {
  BookOpen,
  Newspaper,
  Building,
  Sparkles,
  Radio,
  Megaphone,
  FileText,
  ChevronRight,
  TrendingUp,
  Globe,
} from "lucide-react";
import { ContentCategory } from "@/types/community";

interface MediaSidebarProps {
  selectedCategory: ContentCategory;
  setSelectedCategory: (category: ContentCategory) => void;
}

const CATEGORY_ITEMS: {
  name: ContentCategory;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    name: "All",
    icon: <Globe className="w-4 h-4 text-teal-600" />,
    desc: "View all articles & announcements",
  },
  {
    name: "Blog Article",
    icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
    desc: "In-depth insights & sports economics",
  },
  {
    name: "Press Release",
    icon: <Newspaper className="w-4 h-4 text-blue-600" />,
    desc: "Official corporate announcements",
  },
  {
    name: "Company News",
    icon: <Building className="w-4 h-4 text-amber-600" />,
    desc: "Milestones & platform updates",
  },
  {
    name: "Promotional Content",
    icon: <Sparkles className="w-4 h-4 text-rose-600" />,
    desc: "Special offers & double XP events",
  },
  {
    name: "Community Update",
    icon: <Radio className="w-4 h-4 text-purple-600" />,
    desc: "Spotlights & fan highlights",
  },
  {
    name: "Product Announcement",
    icon: <Megaphone className="w-4 h-4 text-sky-600" />,
    desc: "New features & releases",
  },
];

const POPULAR_TAGS = [
  "All",
  "Blog Article",
  "Press Release",
  "Company News",
  "Promotional Content",
  "Community Update",
  "Product Announcement",
];

const MediaSidebar = memo(function MediaSidebar({
  selectedCategory,
  setSelectedCategory,
}: MediaSidebarProps) {
  return (
    <aside className="w-full min-w-0 max-w-full lg:sticky lg:top-20 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto custom-sidebar-scrollbar space-y-4 sm:space-y-5">
      {/* 1. Media & Publishing Categories Card */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-border shadow-2xs w-full max-w-full min-w-0 overflow-hidden box-border">
        <div className="flex items-center gap-2 mb-3 sm:mb-3.5 pb-2.5 border-b border-border min-w-0">
          <FileText className="w-4 h-4 text-[#2FC191] shrink-0" />
          <h3 className="text-xs font-bold text-[#053697] uppercase tracking-wider truncate min-w-0 flex-1">
            Media Categories
          </h3>
        </div>

        {/* On mobile: overflow-x-auto horizontal scroll track. On desktop: vertical stack */}
        <div className="flex lg:flex-col items-center lg:items-stretch gap-2 lg:gap-1.5 overflow-x-auto lg:overflow-x-visible no-scrollbar py-0.5 w-full min-w-0 max-w-full scroll-smooth">
          {CATEGORY_ITEMS.map((item) => {
            const isActive = selectedCategory === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setSelectedCategory(item.name)}
                className={`flex-1 lg:flex-none min-w-[200px] lg:min-w-0 lg:w-full shrink-0 flex items-center justify-between p-2 sm:p-2.5 rounded-xl text-xs text-left transition-all cursor-pointer box-border overflow-hidden ${
                  isActive
                    ? "bg-[#2FC191] text-white font-bold shadow-2xs"
                    : "hover:bg-[#05369708] text-[#053697] bg-gray-50/50 lg:bg-transparent"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 mr-1.5 overflow-hidden">
                  <div
                    className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${
                      isActive ? "bg-white/20" : "bg-gray-100"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="font-semibold truncate text-xs leading-tight block w-full">
                      {item.name}
                    </p>
                    <p
                      className={`text-[10px] sm:text-[11px] truncate leading-tight mt-0.5 block w-full ${
                        isActive ? "text-white/80" : "text-[#05369760]"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? "text-white" : "text-[#05369740]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Trending Topics / Tags Card */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-border shadow-2xs w-full max-w-full min-w-0 overflow-hidden box-border">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border min-w-0">
          <TrendingUp className="w-4 h-4 text-[#2FC191] shrink-0" />
          <h3 className="text-xs font-bold text-[#053697] uppercase tracking-wider truncate min-w-0 flex-1">
            Popular Topics
          </h3>
        </div>

        {/* On mobile: overflow-x-auto horizontal tag scrolling track */}
        <div className="flex items-center gap-1.5 overflow-x-auto lg:overflow-x-visible lg:flex-wrap no-scrollbar py-0.5 w-full max-w-full min-w-0 scroll-smooth">
          {POPULAR_TAGS.map((tag) => {
            const isActive = selectedCategory === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedCategory(tag as ContentCategory)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#2FC191] text-white shadow-2xs"
                    : "text-[#2FC191] bg-[#2FC19112] hover:bg-[#2FC19122]"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
});

export default MediaSidebar;
