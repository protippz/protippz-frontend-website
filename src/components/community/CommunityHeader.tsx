'use client'

import React from 'react'
import { Newspaper, Megaphone, BookOpen } from 'lucide-react'

export const CommunityHeader: React.FC = () => {
  return (
    <div className="w-full px-3 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-3 sm:pb-6 bg-[#FAFBFB]">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <p className="text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-1 sm:mb-2 text-[#308D6F]">
          ProTippz Hub / Media & Community
        </p>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-6">
          <div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#233A6C]"
            >
              Media & Community 📰
            </h1>
            <p className="text-xs sm:text-sm md:text-base mt-1 sm:mt-2 max-w-2xl text-[#233A6C80] leading-relaxed">
              Discover official company news, blog articles, press releases, product updates, and vibrant fan community discussions in one unified feed.
            </p>
          </div>

          {/* Feature Highlights Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-[#233A6C15] text-[11px] sm:text-xs font-bold text-[#233A6C] shadow-sm">
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#137333]" /> Articles
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-[#233A6C15] text-[11px] sm:text-xs font-bold text-[#233A6C] shadow-sm">
              <Newspaper className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1A73E8]" /> Press Releases
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-[#233A6C15] text-[11px] sm:text-xs font-bold text-[#233A6C] shadow-sm">
              <Megaphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0369A1]" /> Product News
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityHeader
