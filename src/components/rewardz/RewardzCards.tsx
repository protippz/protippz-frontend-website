"use client";

import React, { memo } from "react";
import Image from "next/image";
import RedeemButton from "./Client/RedeemButton";
import { imageUrl } from "@/ApisRequests/server";
import { RewardInterface } from "@/app/(default)/rewardz/page";
import defaultPrize from "@/Assets/category.png";
import {
  Coins,
  Gift,
  Mail,
  Package,
  Share2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

interface RewardCardsProps {
  item: RewardInterface;
}

const RewardzCards: React.FC<RewardCardsProps> = ({ item }) => {
  const archiveId = item?._id ? item._id.slice(-3).toUpperCase() : "001";
  const categoryName = item?.category?.name || "Reward";
  const deliveryOption = item?.category?.deliveryOption || "Delivery";
  const isEmail = deliveryOption.toLowerCase() === "email";

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/rewardz?category=${
        item?.category?._id || ""
      }`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        toast.success("Reward link copied to clipboard!");
      } else {
        toast.success(`Reward: ${item?.name || "Reward"}`);
      }
    }
  };

  return (
    <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl hover:border-slate-300 transition-colors overflow-hidden mb-4 sm:mb-6">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Left Column: Reward Image Hero with Bottom Overlay Badges */}
        <div className="relative w-full md:w-[280px] lg:w-[320px] xl:w-[340px] h-[260px] md:h-auto min-h-[220px] md:min-h-[280px] bg-slate-900 shrink-0 overflow-hidden flex items-center justify-center p-6">
          <Image
            src={item?.reward_image ? imageUrl(item.reward_image) : defaultPrize}
            alt={item?.name || "Reward"}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className="object-contain p-4"
          />

          {/* Gradient vignette at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Badges Overlay at bottom of hero */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center gap-1.5 flex-wrap z-10">
            {/* Category Badge */}
            <span className="px-2.5 py-1 rounded-[4px] bg-[#053697] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
              {categoryName}
            </span>

            {/* Delivery Badge */}
            <span className="px-2.5 py-1 rounded-[4px] bg-white text-[#053697] border border-slate-200 text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
              {isEmail ? (
                <Mail className="w-3 h-3 text-[#053697]" />
              ) : (
                <Package className="w-3 h-3 text-[#053697]" />
              )}
              <span>{deliveryOption}</span>
            </span>

            {/* Verified Badge */}
            <span className="px-2.5 py-1 rounded-[4px] bg-[#2FC191] text-[#053697] text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#053697]" />
              <span>OFFICIAL REWARD</span>
            </span>
          </div>
        </div>

        {/* Right Column: Entity Overview & Actions */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 flex flex-col justify-between">
          <div>
            {/* Top Line: Archive Tag and Share Action */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 min-w-0 font-mono text-xs sm:text-[13px] truncate">
                <span className="font-bold text-[#053697]">
                  [REWARD ARCHIVE: {archiveId}]
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-500 font-medium truncate uppercase">
                  {categoryName}
                </span>
              </div>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#053697] hover:border-[#053697] hover:bg-slate-50 transition-colors cursor-pointer"
                title="Share reward"
                aria-label="Share reward"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reward Title */}
            <h3
              className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#053697] tracking-tight leading-none mt-2.5 sm:mt-3 hover:text-[#042870] transition-colors"
              title={item?.name || "Reward"}
            >
              {item?.name || "REWARD ITEM"}
            </h3>

            {/* Description Box */}
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 sm:p-4 mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {item?.description ||
                "Redeem your accumulated reward points to claim this exclusive prize."}
            </div>

            {/* Stats / Details Box (2 Columns) */}
            <div className="border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 grid grid-cols-2 divide-x divide-slate-200 bg-white mt-3.5 sm:mt-4">
              {/* Points Required */}
              <div className="pr-4 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  POINTS REQUIRED
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xl sm:text-2xl font-black text-[#053697]">
                    {item?.pointRequired !== undefined
                      ? item.pointRequired.toLocaleString()
                      : "0"}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                    PTS
                  </span>
                </div>
              </div>

              {/* Delivery Option */}
              <div className="pl-4 sm:pl-6 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  DELIVERY METHOD
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-800 capitalize">
                  {isEmail ? (
                    <Mail className="w-4 h-4 text-[#053697] shrink-0" />
                  ) : (
                    <Package className="w-4 h-4 text-[#053697] shrink-0" />
                  )}
                  <span>{deliveryOption}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5 sm:gap-3 mt-4 sm:mt-5 pt-1">
            <RedeemButton
              item={item}
              className="flex-1 min-w-0 h-11 sm:h-12 px-4 sm:px-6 rounded-xl bg-[#053697] hover:bg-[#042870] text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
              buttonText={
                <>
                  <Sparkles className="w-4 h-4 text-[#2FC191]" />
                  <span>REDEEM REWARD</span>
                  <ArrowRight className="w-4 h-4 text-white ml-0.5" />
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RewardzCards);
