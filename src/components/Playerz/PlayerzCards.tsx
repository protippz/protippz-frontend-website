import React, { memo } from "react";
import Image from "next/image";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "../Shared/Client/BookmarkButton";
import defaultPlayer from "@/Assets/playerDefult.jpg";
import leagueLogo from "@/Assets/PT Logo.png";
import { Player } from "@/app/(default)/playerz/page";
import SendTipsButton from "./Client/SendTipsButton";
import MotionDiv from "./Motion";

interface PlayerzCardsProps {
  item: Player;
  token: string | undefined | null;
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

const PlayerzCards: React.FC<PlayerzCardsProps> = ({ token, item }) => {
  const expLabel = item?.experience || "Jr.";

  return (
    <MotionDiv
      variants={cardReveal}
      initial="hidden"
      animate="visible"
      className="group relative bg-white rounded-[22px] border border-slate-200/85 hover:border-[#2FC191]/50 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_14px_34px_rgba(5,54,151,0.11)] transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header: Year/Exp on Left + Favorite Pill on Right */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-[13px] font-extrabold text-[#2FC191]">
          {expLabel}
        </span>

        <BookmarkButton
          isBookmark={item?.isBookmark}
          type="player"
          _id={item?._id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f3f6] hover:bg-amber-50/80 border border-slate-200/70 text-xs font-semibold text-slate-700 cursor-pointer transition-all duration-150 select-none"
        >
          <span
            className={`text-xs leading-none ${
              item?.isBookmark ? "text-amber-500 font-bold" : "text-slate-400"
            }`}
          >
            {item?.isBookmark ? "★" : "☆"}
          </span>
          <span className="text-[11px] font-bold text-slate-700">Favorite</span>
        </BookmarkButton>
      </div>

      {/* Player Name */}
      <h3 className="text-xl sm:text-[22px] font-black tracking-wide text-[#053697] uppercase mt-1 mb-2.5 line-clamp-1">
        {item.name}
      </h3>

      {/* Subtle Horizontal Divider */}
      <div className="w-full h-px bg-slate-200/60 mb-3" />

      {/* Main Content: Left Details & Right Photo Column */}
      <div className="flex items-end justify-between gap-4">
        {/* Left Column: Team & Stats */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          {/* Team Info */}
          <div>
            <span className="text-[11px] font-medium text-slate-400">Team</span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                <Image
                  src={leagueLogo}
                  alt="Team"
                  width={14}
                  height={14}
                  className="object-contain"
                />
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-[#053697] line-clamp-1">
                {item.team?.name || "Independent"}
              </span>
            </div>
          </div>

          {/* Stats: Position | Jersey | Exp */}
          <div className="flex items-center gap-2 sm:gap-2.5 pt-3">
            {/* Position */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium mb-1">
                Position
              </span>
              <div className="bg-[#f0f2f5] border border-slate-200/70 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-bold text-[#053697] whitespace-nowrap">
                {item?.position || "G (Point Guard)"}
              </div>
            </div>

            {/* Jersey */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium mb-1">
                Jersey
              </span>
              <div className="bg-[#f0f2f5] border border-slate-200/70 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-bold text-[#053697] whitespace-nowrap min-w-[32px] text-center">
                {item?.jerceyNumber ? `#${item.jerceyNumber}` : "--"}
              </div>
            </div>

            {/* Exp */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium mb-1">
                Exp.
              </span>
              <div className="bg-[#f0f2f5] border border-slate-200/70 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-bold text-[#053697] whitespace-nowrap min-w-[32px] text-center">
                {item?.experience || "Jr."}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Photo + Send Tip Button */}
        <div className="w-[115px] sm:w-[125px] shrink-0 flex flex-col items-center gap-2">
          {/* Athlete Photo Container */}
          <div className="relative w-full h-[115px] sm:h-[125px] rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/70 shadow-2xs">
            <Image
              src={
                item?.player_image ? imageUrl(item.player_image) : defaultPlayer
              }
              alt={item.name}
              fill
              className="object-cover object-top"
              unoptimized={false}
            />

            {/* Mini Team Icon on bottom-right of photo */}
            <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-0.5">
              <Image
                src={leagueLogo}
                alt="Logo"
                width={14}
                height={14}
                className="object-contain"
              />
            </div>
          </div>

          {/* Send Tip Button */}
          <SendTipsButton
            token={token}
            item={item}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointerw-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointerw-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointerw-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            buttonText="Send Tip"
          />
        </div>
      </div>
    </MotionDiv>
  );
};

export default memo(PlayerzCards);
