"use client";

import React, { memo } from "react";
import Image from "next/image";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "../Shared/Client/BookmarkButton";
import ptLogo from "@/Assets/PT Logo.png";
import { TeamInterface } from "@/app/(default)/teamz/page";
import SendTipsButton from "./Client/SendTipsButton";
import { Share2, Star, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface TeamzCardsProps {
  item: TeamInterface;
  token: string | undefined | null;
}

const TeamzCards: React.FC<TeamzCardsProps> = ({ token, item }) => {
  const archiveId = item?._id ? item._id.slice(-3).toUpperCase() : "001";
  const handle = item?.name
    ? item.name.toLowerCase().replace(/[^a-z0-9]/g, "")
    : "wildcats";

  const sportDisplay = item?.league?.sport
    ? item.league.sport.toUpperCase()
    : "SPORTS";

  const leagueDisplay = item?.league?.name
    ? item.league.name.toUpperCase()
    : "NCAA";

  const totalTipsDisplay = item?.totalTips
    ? item.totalTips.toLocaleString()
    : "185";

  const communityRaisedDisplay = item?.paidAmount
    ? `$${item.paidAmount.toLocaleString()}`
    : item?.totalTips
    ? `$${(item.totalTips * 15).toLocaleString()}`
    : "$2,650";

  const teamImage = item?.team_bg_image
    ? imageUrl(item.team_bg_image)
    : item?.team_logo
    ? imageUrl(item.team_logo)
    : ptLogo;

  const [imgSrc, setImgSrc] = React.useState<any>(teamImage);

  React.useEffect(() => {
    setImgSrc(
      item?.team_bg_image
        ? imageUrl(item.team_bg_image)
        : item?.team_logo
        ? imageUrl(item.team_logo)
        : ptLogo
    );
  }, [item?.team_bg_image, item?.team_logo]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/teamz/${item?._id || ""}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        toast.success("Team link copied to clipboard!");
      } else {
        toast.success(`Team: ${item?.name || "Team"}`);
      }
    }
  };

  return (
    <SendTipsButton item={item} token={token}>
      {({ openTip, openDetails }) => {
        return (
          <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden mb-4 sm:mb-6">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Column: Team Image with Bottom Overlay Badges */}
              <div
                onClick={openDetails}
                className="relative w-full md:w-[280px] lg:w-[320px] xl:w-[340px] h-[340px] md:h-auto min-h-[300px] md:min-h-[360px] bg-slate-900 shrink-0 overflow-hidden cursor-pointer"
                title={`View profile for ${item?.name || "Team"}`}
              >
                <Image
                  src={imgSrc}
                  alt={item?.name || "Team"}
                  fill
                  sizes="(max-width: 768px) 100vw, 340px"
                  className="object-contain object-center"
                  onError={() => setImgSrc(ptLogo)}
                />

                {/* Subtle gradient vignette at bottom of photo to ensure badges pop */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                {/* Badges Overlay at bottom of hero */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center gap-1.5 flex-wrap z-10">
                  {/* Sport Badge */}
                  <span className="px-2.5 py-1 rounded-[4px] bg-[#053697] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                    {sportDisplay}
                  </span>

                  {/* League Badge */}
                  <span className="px-2.5 py-1 rounded-[4px] bg-white text-[#053697] border border-slate-200 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                    {leagueDisplay}
                  </span>

                  {/* Verification Badge */}
                  <span className="px-2.5 py-1 rounded-[4px] bg-[#2FC191] text-[#053697] text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#053697]" />
                    <span>OFFICIAL TEAM</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Entity Overview & Actions */}
              <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 flex flex-col justify-between">
                <div>
                  {/* Top Line: Archive Tag, Handle, and Action Icons */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 min-w-0 font-mono text-xs sm:text-[13px] truncate">
                      <span className="font-bold text-[#053697]">
                        [NIL ARCHIVE: {archiveId}]
                      </span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-500 font-medium truncate">
                        @{handle}
                      </span>
                    </div>

                    {/* Action Icon Buttons: Share & Favorite */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#053697] hover:border-[#053697] hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Share team profile"
                        aria-label="Share team profile"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center"
                      >
                        <BookmarkButton
                          isBookmark={item?.isBookmark}
                          type="team"
                          _id={item?._id}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-amber-500 hover:border-amber-400 hover:bg-amber-50/40 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              item?.isBookmark
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-500"
                            }`}
                          />
                        </BookmarkButton>
                      </div>
                    </div>
                  </div>

                  {/* Team Name */}
                  <h3
                    onClick={openDetails}
                    className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#053697] tracking-tight leading-none mt-2.5 sm:mt-3 hover:text-[#042870] transition-colors cursor-pointer"
                    title={item?.name || "Team"}
                  >
                    {item?.name || "OFFICIAL TEAM"}
                  </h3>

                  {/* Statement / Bio Box */}
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 sm:p-4 mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 italic font-medium leading-relaxed">
                    &ldquo;Official collegiate team program supporting student-athlete
                    development, training, nutrition, and season travel.&rdquo;
                  </div>

                  {/* Stats Box */}
                  {/* <div className="border border-slate-200/90 rounded-2xl p-4 sm:p-5 mt-3 sm:mt-4 grid grid-cols-2 divide-x divide-slate-200 relative overflow-hidden bg-white">
                    <span className="absolute right-3 -bottom-2 text-6xl sm:text-7xl font-black text-slate-100 select-none pointer-events-none opacity-60 tracking-tighter leading-none">
                      NIL
                    </span>

                    
                    <div className="pr-3 sm:pr-4">
                      <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                        TOTAL DIRECT TIPS
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-1 sm:mt-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-[#053697] leading-none">
                          {totalTipsDisplay}
                        </span>
                        <span className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase">
                          TIPS
                        </span>
                      </div>
                    </div>

                    
                    <div className="pl-4 sm:pl-6 relative z-10">
                      <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                        COMMUNITY RAISED
                      </p>
                      <div className="mt-1 sm:mt-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-[#00684a] leading-none">
                          {communityRaisedDisplay}
                        </span>
                      </div>
                    </div>
                  </div> */}
                </div>

                
                <div className="flex items-center gap-2.5 sm:gap-3 mt-4 sm:mt-5 pt-1">
                  
                  <button
                    type="button"
                    onClick={openTip}
                    className="flex-1 min-w-0 h-11 sm:h-12 px-4 sm:px-6 rounded-xl bg-[#2FC191] hover:bg-[#28b887] active:scale-[0.99] text-[#053697] font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow"
                  >
                    <span>DIRECT TIP TEAM</span>
                    <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#053697]" />
                  </button>

                  
                  {/* <div className="h-11 sm:h-12 px-3.5 sm:px-5 rounded-xl bg-white border border-slate-200 text-slate-700 font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center shrink-0">
                    MIN $5.00
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </SendTipsButton>
  );
};

export default memo(TeamzCards);
