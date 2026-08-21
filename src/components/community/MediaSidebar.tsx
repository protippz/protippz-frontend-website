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
    <aside className="sticky top-17.5 space-y-4">
      {/* 1. Media & Publishing Categories Card */}
      <div className="p-5 rounded-2xl bg-white border border-border shadow-2xs">
        <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-border">
          <FileText className="w-4 h-4 text-[#308D6F]" />
          <h3 className="text-xs font-bold text-[#233A6C] uppercase tracking-wider">
            Media Categories
          </h3>
        </div>

        <div className="space-y-1.5">
          {CATEGORY_ITEMS.map((item) => {
            const isActive = selectedCategory === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setSelectedCategory(item.name)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#308D6F] text-white font-bold shadow-2xs"
                    : "hover:bg-[#233A6C08] text-[#233A6C]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isActive ? "bg-white/20" : "bg-gray-100"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{item.name}</p>
                    <p
                      className={`text-[10px] truncate ${
                        isActive ? "text-white/80" : "text-[#233A6C60]"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? "text-white" : "text-[#233A6C40]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Trending Topics / Tags Card */}
      <div className="p-5 rounded-2xl bg-white border border-border shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
          <TrendingUp className="w-4 h-4 text-[#308D6F]" />
          <h3 className="text-xs font-bold text-[#233A6C] uppercase tracking-wider">
            Popular Topics
          </h3>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {POPULAR_TAGS.map((tag) => {
            const isActive = selectedCategory === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedCategory(tag as ContentCategory)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? "bg-[#308D6F] text-white shadow-2xs"
                    : "text-[#308D6F] bg-[#308D6F12] hover:bg-[#308D6F22]"
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
