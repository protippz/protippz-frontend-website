"use client";

import React from "react";
import Image from "next/image";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "@/components/Shared/Client/BookmarkButton";
import SendTipsButton from "../Client/SendTipsButton";
import ptLogo from "@/Assets/PT Logo.png";
import { Star, ArrowRight, Shield, Award, Users } from "lucide-react";
import { ExtractedColorTheme } from "@/lib/extractLogoColor";
import { TeamDetailsData } from "./TeamDetailsView";

interface TeamHeroBannerProps {
  team: TeamDetailsData;
  token?: string | null;
  theme: ExtractedColorTheme;
  rosterCount: number;
}

const TeamHeroBanner: React.FC<TeamHeroBannerProps> = ({
  team,
  token,
  theme,
  rosterCount,
}) => {
  const archiveId = team?._id ? team._id.slice(-3).toUpperCase() : "001";
  const handle = team?.name
    ? team.name.toLowerCase().replace(/[^a-z0-9]/g, "")
    : "team";

  const sportDisplay = team?.league?.sport
    ? team.league.sport.toUpperCase()
    : team?.sport
      ? team.sport.toUpperCase()
      : "SPORTS";

  const leagueDisplay = team?.league?.name
    ? team.league.name.toUpperCase()
    : "NCAA";

  const totalTipsDisplay = team?.totalTips
    ? team.totalTips.toLocaleString()
    : "185";

  const communityRaisedDisplay = team?.paidAmount
    ? `$${team.paidAmount.toLocaleString()}`
    : team?.totalTips
      ? `$${(team.totalTips * 15).toLocaleString()}`
      : "$2,650";

  const teamLogoUrl = team?.team_logo
    ? imageUrl(team.team_logo)
    : "";

  // Team item formatted for SendTipsButton
  const teamItemForTipping: any = {
    _id: team._id,
    name: team.name,
    team_logo: team.team_logo || "",
    league: team.league || { _id: "", name: "NCAA", sport: "Athletics" },
    totalTips: team.totalTips || 0,
    paidAmount: team.paidAmount || 0,
    dueAmount: team.dueAmount || 0,
    isBookmark: !!team.isBookmark,
  };

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden transition-colors duration-500 text-white"
        style={{ backgroundColor: theme.primary }}
      >
        {/* Subtle background ambient elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        {/* Team logo silhouette watermark in the background */}
        {teamLogoUrl && (
          <div
            className="absolute -top-10 -right-10 w-80 h-80 sm:w-96 sm:h-96 opacity-[0.08] pointer-events-none select-none mix-blend-screen"
            style={{
              backgroundImage: `url(${teamLogoUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* MAIN HERO CONTENT */}
        <div className="relative max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-2 min-h-[300px] sm:min-h-[340px]">
          {/* Left: Team Logo & Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-2 sm:gap-2 text-center sm:text-left z-10 w-full md:w-auto">
            {/* Logo Badge Container */}
            <div className="relative w-28 h-28 sm:w-44 sm:h-44 rounded-md sm:rounded-3xl bg-white border-2 border-white/20 shrink-0 flex items-center justify-center overflow-hidden">
              <Image
                src={teamLogoUrl || ptLogo}
                alt={team?.name || "Team Logo"}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-contain"
                priority
              />
            </div>

            {/* Entity Meta & Name */}
            <div className="space-y-2 max-w-xl">
              {/* Archive Tag & Handle */}
              <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-xs sm:text-sm text-white/80">
                <span className="font-bold text-[#2FC191]">
                  [NIL ARCHIVE: {archiveId}]
                </span>
                <span>/</span>
                <span className="text-white/60">@{handle}</span>
              </div>

              {/* Stacked Team Name */}
              <h1 className="text-3xl font-black uppercase text-white tracking-tight leading-[1.05]">
                {team?.name || "Official Team"}
              </h1>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2 shrink-0 z-10 w-full sm:w-auto justify-center sm:justify-end">
            <BookmarkButton
              isBookmark={!!team?.isBookmark}
              type="team"
              _id={team?._id}
              className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 flex items-center justify-center text-white hover:text-amber-300 transition-colors cursor-pointer backdrop-blur-xs"
            >
              {(bookmarked) => (
                <Star
                  className={`w-5 h-5 transition-colors ${bookmarked
                    ? "fill-amber-400 text-amber-400"
                    : "text-white"
                    }`}
                />
              )}
            </BookmarkButton>

            <SendTipsButton item={teamItemForTipping} token={token}>
              {({ openTip }) => (
                <button
                  type="button"
                  onClick={openTip}
                  className="h-11 sm:h-12 px-6 rounded-xl bg-[#2FC191] hover:bg-[#28b887] text-[#053697] font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer  active:scale-[0.99]"
                >
                  <span>DIRECT TIP TEAM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </SendTipsButton>
          </div>
        </div>

        {/* BOTTOM METRICS RIBBON */}
        <div
          className="w-full border-t border-white/15 backdrop-blur-md"
          style={{ backgroundColor: theme.darker || "rgba(0,0,0,0.4)" }}
        >
          <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
              {/* Metric 1 */}
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/60">
                  Total Direct Tips
                </span>
                <span className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {totalTipsDisplay}
                </span>
              </div>

              {/* Metric 2 */}
              <div className="flex flex-col sm:pl-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/60">
                  League Name
                </span>
                <span className="text-sm font-black mt-0.5">
                  {leagueDisplay}
                </span>
              </div>

              {/* Metric 3 */}
              <div className="flex flex-col pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#2FC191]" />
                  Roster Athletes
                </span>
                <span className="text-sm font-black text-white mt-0.5">
                  {rosterCount} Players
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamHeroBanner;
