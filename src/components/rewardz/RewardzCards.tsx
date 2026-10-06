import React, { memo } from "react";
import Image from "next/image";
import SendTipsButton from "./Client/RedeemButton";
import { imageUrl } from "@/ApisRequests/server";
import { RewardInterface } from "@/app/(default)/rewardz/page";
import MotionDiv from "../Playerz/Motion";
import { Sparkles, Coins, Gift, Mail, Package } from "lucide-react";
import defaultPrize from "@/Assets/category.png";

interface RewardCardsProps {
  item: RewardInterface;
}

const cardReveal = {
  hidden: { y: "4%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const RewardzCards: React.FC<RewardCardsProps> = ({ item }) => {
  const categoryName = item?.category?.name || "Reward";
  const deliveryOption = item?.category?.deliveryOption || "Delivery";
  const isEmail = deliveryOption.toLowerCase() === "email";

  return (
    <MotionDiv
      variants={cardReveal}
      initial="hidden"
      animate="visible"
      className="group relative bg-white rounded-[22px] border border-slate-200/85 hover:border-[#2FC191]/50 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_14px_34px_rgba(5,54,151,0.11)] transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between overflow-hidden h-full"
    >
      {/* Top Header: Category Eyebrow & Delivery Method Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#2FC191]">
          {categoryName}
        </span>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/70 text-xs font-semibold text-slate-700">
          {isEmail ? (
            <Mail className="w-3.5 h-3.5 text-[#053697]" />
          ) : (
            <Package className="w-3.5 h-3.5 text-[#053697]" />
          )}
          <span className="text-[11px] font-bold text-slate-700 capitalize">
            {deliveryOption}
          </span>
        </div>
      </div>

      {/* Main Details: Reward Title & Description */}
      <div>
        <h3 className="text-xl sm:text-[22px] font-black tracking-tight text-[#053697] group-hover:text-[#042870] transition-colors line-clamp-1 mt-1 mb-1.5">
          {item?.name}
        </h3>

        <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {item?.description ||
            "Redeem your accumulated reward points to claim this exclusive prize."}
        </p>
      </div>

      {/* Subtle Divider */}
      <div className="w-full h-px bg-slate-200/60 mb-3.5" />

      {/* Visual & Points Row */}
      <div className="flex items-center justify-between gap-3 mb-2">
        {/* Left: Points Required */}
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">
            Points Required
          </span>
          <div className="inline-flex items-center gap-1.5 bg-[#f0f2f5] border border-slate-200/70 rounded-xl px-3 py-1.5">
            <Coins className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-base sm:text-lg font-black text-[#053697]">
              {item?.pointRequired !== undefined
                ? item.pointRequired.toLocaleString()
                : "0"}
            </span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">
              Pts
            </span>
          </div>
        </div>

        {/* Right: Reward Image Container */}
        <div className="relative w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100/90 border border-slate-200/80 p-2 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
          <Image
            src={item?.reward_image ? imageUrl(item.reward_image) : defaultPrize}
            alt={item?.name || "Reward"}
            fill
            className="object-contain p-1.5"
            sizes="(max-width: 640px) 84px, 92px"
          />
        </div>
      </div>

      {/* Bottom Separator */}
      <div className="w-full h-px bg-slate-100 my-3" />

      {/* Bottom Footer: Feature Tag & Redeem Button */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Gift className="w-3.5 h-3.5 text-[#2FC191]" />
          <span className="text-[11px]">Exclusive Reward</span>
        </div>

        <SendTipsButton
          item={item}
          className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          buttonText={
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#2FC191]" />
              <span>Redeem</span>
            </>
          }
        />
      </div>
    </MotionDiv>
  );
};

export default memo(RewardzCards);
