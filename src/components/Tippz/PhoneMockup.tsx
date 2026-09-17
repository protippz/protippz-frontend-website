"use client";

import React from "react";
import { Send } from "lucide-react";

export default function PhoneMockup() {
  return (
    <div className="flex flex-col items-center select-none">
      {/* Top Handle */}
      <span className="text-xs font-semibold text-stone-500 mb-2 tracking-wide">
        @protippz
      </span>

      {/* Phone Outer Shell with side hardware accents */}
      <div className="relative">
        {/* Left Side Volume Buttons */}
        <div className="absolute -left-1 top-20 w-1 h-7 bg-stone-700 rounded-l-xs" />
        <div className="absolute -left-1 top-30 w-1 h-7 bg-stone-700 rounded-l-xs" />
        {/* Right Side Power Button */}
        <div className="absolute -right-1 top-24 w-1 h-10 bg-stone-700 rounded-r-xs" />

        <div className="relative w-[240px] sm:w-[260px] bg-stone-900 rounded-[2.5rem] p-2.5 border-4 border-stone-800 shadow-sm">
          {/* Speaker / Camera Cutout */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-900 rounded-full z-20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-stone-700/80 mr-2" />
            <div className="w-6 h-1 rounded-full bg-stone-800" />
          </div>

        {/* Screen Content */}
        <div className="relative w-full bg-[#2FC191] rounded-[2rem] overflow-hidden flex flex-col justify-between pt-7 pb-3 px-3 min-h-[440px] sm:min-h-[470px]">
          {/* In-App Header */}
          <div className="bg-white rounded-xl py-2 px-3 flex items-center justify-center border border-emerald-600/20">
            <span className="text-sm font-black tracking-widest text-[#053697]">
              PRO<span className="text-[#2FC191]">TIPPZ</span>
            </span>
          </div>

          {/* Chat Messages */}
          <div className="space-y-2.5 my-auto py-2">
            {/* User Message 1 */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-[#053697] text-white text-[11px] sm:text-xs font-medium rounded-2xl rounded-br-xs px-3 py-2 leading-snug">
                I&apos;m interested in learning more. How does PROTIPPZ work?
              </div>
            </div>

            {/* Support Message 1 */}
            <div className="flex justify-start">
              <div className="max-w-[88%] bg-white text-stone-800 text-[11px] sm:text-xs font-medium rounded-2xl rounded-bl-xs px-3 py-2 leading-snug border border-stone-100">
                PROTIPPZ allows fans to tip their fave players/teams, earn rewards, and win exclusive prizes.
              </div>
            </div>

            {/* User Message 2 */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-[#053697] text-white text-[11px] sm:text-xs font-medium rounded-2xl rounded-br-xs px-3 py-2 leading-snug">
                That all sounds great. How can I sign up?
              </div>
            </div>

            {/* Support Message 2 */}
            <div className="flex justify-start">
              <div className="max-w-[88%] bg-white text-stone-800 text-[11px] sm:text-xs font-medium rounded-2xl rounded-bl-xs px-3 py-2 leading-snug border border-stone-100">
                PROTIPPZ is free to download on the Google Play Store.
              </div>
            </div>
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="bg-white rounded-xl p-1.5 flex items-center justify-between gap-1.5 border border-emerald-600/20">
            <div className="bg-[#053697] text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg flex-1 truncate">
              Downloading now. Thx.
            </div>
            <div className="p-1 text-[#053697] shrink-0">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Bottom Website Link */}
      <span className="text-xs font-bold text-[#053697] mt-2.5 tracking-wide">
        www.protippz.com
      </span>
    </div>
  );
}
