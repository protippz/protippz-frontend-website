"use client";

import React, { memo, useState, useEffect } from "react";
import Image from "next/image";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "../Shared/Client/BookmarkButton";
import ptLogo from "@/Assets/PT Logo.png";
import defaultTeamLogo from "@/Assets/team.webp";
import { TeamInterface } from "@/app/(default)/teamz/page";
import SendTipsButton from "./Client/SendTipsButton";
import {
  Share2,
  Star,
  ArrowRight,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { shareUrl } from "@/lib/share";

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

  const teamImage = item?.team_logo
    ? imageUrl(item.team_logo)
    : ptLogo;

  const [imgSrc, setImgSrc] = useState<any>(teamImage);
  const [logoSrc, setLogoSrc] = useState<any>(
    item?.team_logo ? imageUrl(item.team_logo) : defaultTeamLogo
  );

  useEffect(() => {
    setImgSrc(
      item?.team_logo
        ? imageUrl(item.team_logo)
        : ptLogo
    );
    setLogoSrc(item?.team_logo ? imageUrl(item.team_logo) : defaultTeamLogo);
  }, [item?.team_logo]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;

    const url = item?._id
      ? `${window.location.origin}/teamz/${item._id}`
      : `${window.location.origin}/teamz`;

    await shareUrl({
      title: `${item?.name || "Team"} | ProTippz`,
      text: `Support ${item?.name || "this team"} on ProTippz!`,
      url,
      fallbackSuccessMessage: "Team link copied to clipboard!",
    });
  };

  return (
    <SendTipsButton item={item} token={token}>
      {({ openTip, openDetails }) => {
        return (
          <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-slate-300 rounded-[24px] sm:rounded-[28px]  transition-colors duration-300 overflow-hidden group">
            <div className="flex flex-col md:flex-row items-stretch p-3.5 sm:p-5 md:p-6 gap-2 sm:gap-2">
              {/* Left Column: Media Preview Pane with Perfect Continuous Curves */}
              <div
                onClick={openDetails}
                className="group/photo relative w-full md:w-[250px] lg:w-[310px] xl:w-[270px] h-[220px] md:h-[270px] self-stretch shrink-0 rounded-[20px] sm:rounded-[24px] overflow-hidden cursor-pointer border border-slate-200/60 shadow-inner"
                title={`View profile for ${item?.name || "Player"}`}
              >
                {/* Team Hero Image */}
                <Image
                  src={imgSrc}
                  alt={item?.name || "Team"}
                  fill
                  sizes="(max-width: 768px) 100vw, 330px"
                  className="object-contain object-center p-6 bg-slate-50 group-hover/photo:scale-[1.03] transition-transform duration-500 ease-out"
                  onError={() => setImgSrc(ptLogo)}
                />

                {/* Top-Right Quick Badge (League) with Mac Frosted Glass Style */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-black tracking-wider">
                    {leagueDisplay}
                  </div>
                </div>

                {/* Subtle vignette gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

                {/* Badges Overlay at bottom of hero in Smooth Capsule style */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center gap-1.5 flex-wrap z-10">
                  {/* Sport Capsule */}
                  <span className="px-2.5 py-1 rounded-xl bg-[#053697]/90 backdrop-blur-md text-white border border-white/20 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                    {sportDisplay}
                  </span>

                  {/* League Capsule */}
                  <span className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#053697] border border-white/40 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                    {leagueDisplay}
                  </span>
                </div>
              </div>

              {/* Right Column: Mac-Style Clean Content & Dashboard Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  {/* Top Bar: League Micro-Pill, Archive ID, and Action Icons */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">

                      {/* Archive & Handle */}
                      <div className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-slate-500">
                        <span className="font-bold text-[#053697]">
                          [ARCHIVE: {archiveId}]
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="truncate">@{handle}</span>
                      </div>
                    </div>

                    {/* Smooth Rounded Action Buttons: Share & Bookmark */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-[#053697] active:scale-95 transition-all cursor-pointer"
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
                          isBookmark={Boolean(item?.isBookmark)}
                          type="team"
                          _id={item?._id}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-amber-500 active:scale-95 transition-all cursor-pointer"
                        >
                          {(bookmarked) => (
                            <Star
                              className={`w-3.5 h-3.5 transition-colors ${bookmarked
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-600 hover:text-amber-500"
                                }`}
                            />
                          )}
                        </BookmarkButton>
                      </div>
                    </div>
                  </div>

                  {/* Team Name */}
                  <div className="mt-3 sm:mt-3.5">
                    <h3
                      onClick={openDetails}
                      className="text-2xl sm:text-3xl line-clamp-1 lg:text-[34px] font-black uppercase text-[#053697] tracking-tight leading-tight hover:text-[#042870] transition-colors cursor-pointer"
                      title={item?.name || "Team"}
                    >
                      {item?.name || "OFFICIAL TEAM"}
                    </h3>

                    {/* Subline on mobile for handle */}
                    <div className="flex sm:hidden items-center gap-1.5 font-mono text-xs text-slate-500 mt-1">
                      <span className="font-bold text-[#053697]">
                        [NIL ARCHIVE: {archiveId}]
                      </span>
                      <span>•</span>
                      <span>@{handle}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Push Buttons with Smooth Curvature and No Hover Shadow */}
                <div className="flex items-center gap-2.5 sm:gap-2 mt-4 sm:mt-5 pt-2">
                  <button
                    type="button"
                    onClick={openTip}
                    className="h-11 sm:h-12 px-5 sm:px-6 rounded-2xl text-white bg-[#2FC191] hover:bg-[#28b887] text-[#053697] font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer shrink-0"
                    title={`Send direct tip to ${item?.name || "Team"}`}
                  >
                    <DollarSign className="w-4 h-4 stroke-[2.5]" />
                    <span>SEND TIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={openDetails}
                    className="flex-1 min-w-0 h-11 sm:h-12 px-5 sm:px-6 rounded-2xl bg-[#053697] hover:bg-[#042870] text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                    title={`View profile for ${item?.name || "Team"}`}
                  >
                    <span className="truncate">VIEW TEAM PROFILE</span>
                    <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0" />
                  </button>
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
