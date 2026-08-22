"use client";

import React from "react";

export const CommunityHeader: React.FC = () => {
  return (
    <div className="w-full px-3 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-3 sm:pb-6 bg-transparent">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#233A6C]">
              Media & Community
            </h1>
            <p className="text-xs sm:text-sm md:text-base mt-1 sm:mt-2 max-w-2xl text-[#233A6C80] leading-relaxed">
              Discover official company news, blog articles, press releases,
              product updates, and vibrant fan community discussions in one
              unified feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;
