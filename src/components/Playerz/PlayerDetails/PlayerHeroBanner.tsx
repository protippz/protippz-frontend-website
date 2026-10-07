"use client";

import React from "react";
import Image from "next/image";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "../../Shared/Client/BookmarkButton";
import SendTipsButton from "../Client/SendTipsButton";
import defaultPlayer from "@/Assets/playerDefult.jpg";
import { DollarSign } from "lucide-react";
import { ExtractedColorTheme } from "@/lib/extractLogoColor";
import { PlayerDetailsData } from "../PlayerDetailsView";

interface PlayerHeroBannerProps {
  player: PlayerDetailsData;
  token?: string | null;
  theme: ExtractedColorTheme;
  playerItemForTipping: any;
}

const PlayerHeroBanner: React.FC<PlayerHeroBannerProps> = ({
  player,
  token,
  theme,
  playerItemForTipping,
}) => {
  const expLabel = player?.experience || "Jr.";
  const sportName = player?.league?.sport || "Basketball";
  const teamName = player?.team?.name || "Independent";
  const teamLogoUrl = player?.team?.team_logo
    ? imageUrl(player.team.team_logo)
    : "";

  // Split name for NBA-style stacked typography
  const nameParts = player.name ? player.name.trim().split(" ") : ["Athlete"];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden transition-colors duration-500 text-white"
        style={{ backgroundColor: theme.primary }}
      >
        {/* Subtle logo watermark silhouette in the background */}
        {teamLogoUrl && (
          <div
            className="absolute -top-12 -left-12 sm:left-4 w-72 h-72 sm:w-96 sm:h-96 opacity-[0.09] pointer-events-none select-none mix-blend-screen"
            style={{
              backgroundImage: `url(${teamLogoUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* MAIN HERO HEADER ROW */}
        <div className="relative max-w-355 mx-auto px-2 py-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 min-h-[300px] sm:min-h-[360px]">
          {/* Left Top: Team Logo Badge */}
          {teamLogoUrl && (
            <div className="absolute top-4 sm:top-6 left-4 sm:left-8 z-10">
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 drop-shadow-md">
                <Image
                  src={teamLogoUrl}
                  alt={teamName}
                  fill
                  sizes="80px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}

          {/* Middle Left: Player Cutout emerging from the bottom */}
          <div className="relative z-10 w-48 h-48 shrink-0 flex items-end justify-center mt-6 md:mt-0">
            <div className="relative w-full h-full">
              <Image
                src={
                  player?.player_image
                    ? imageUrl(player.player_image)
                    : defaultPlayer
                }
                alt={player.name}
                fill
                sizes="(max-width: 640px) 192px, 304px"
                className="object-contain object-bottom drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Middle & Right: Player Details & Follow Action */}
          <div className="relative z-10 flex-1 w-full flex flex-col md:flex-row items-center md:items-end justify-between pb-6 sm:pb-8 gap-6 text-center md:text-left">
            <div className="space-y-1 sm:space-y-1.5">
              {/* Team | #Jersey | Position Line */}
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
                <span>{teamName}</span>
                {player?.jerceyNumber && (
                  <>
                    <span className="mx-2 text-white/60">|</span>
                    <span>#{player.jerceyNumber}</span>
                  </>
                )}
                {player?.position && (
                  <>
                    <span className="mx-2 text-white/60">|</span>
                    <span>{player.position}</span>
                  </>
                )}
              </p>

              {/* Big Bold Stacked Athlete Name */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-[0.92]">
                <span className="block">{firstName}</span>
                {lastName && <span className="block">{lastName}</span>}
              </h1>
            </div>

            {/* Right Side: Follow & Tip Actions */}
            <div className="shrink-0 flex flex-wrap md:flex-col lg:flex-row items-center gap-3">
              <BookmarkButton
                isBookmark={!!player.isBookmark}
                type="player"
                _id={player._id}
                className="rounded-full bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider px-5 sm:px-6 py-2.5 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="text-base">
                  {player.isBookmark ? "★" : "☆"}
                </span>
                <span className="text-base">
                  {player.isBookmark ? "FOLLOWING" : "FOLLOW"}
                </span>
              </BookmarkButton>

              <SendTipsButton item={playerItemForTipping} token={token}>
                {({ openTip }) => (
                  <button
                    type="button"
                    onClick={openTip}
                    className="rounded-full bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider px-5 sm:px-6 py-2.5 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4 stroke-[3]" />
                    <span className="text-base">SEND TIPPZ</span>
                  </button>
                )}
              </SendTipsButton>
            </div>
          </div>
        </div>

        {/* ATTACHED BOTTOM STATS & DETAILS STRIP */}
        <div
          className="w-full border-t border-white/20 text-white"
          style={{ backgroundColor: theme.darker }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Section: 3 Large Core Stats Columns */}
            <div className="grid grid-cols-3 divide-x divide-white/20 shrink-0 lg:w-[380px] xl:w-[420px]">
              {/* Stat 1: Total Tips */}
              <div className="p-3 sm:p-4 text-center">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/75">
                  TOTAL TIPS
                </span>
                <span className="block text-base sm:text-xl font-black text-emerald-400 mt-1">
                  ${(player.totalTips || 0).toLocaleString()}
                </span>
              </div>

              {/* Stat 2: Class */}
              <div className="p-3 sm:p-4 text-center">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/75">
                  CLASS
                </span>
                <span className="block text-base sm:text-xl font-black text-white mt-1">
                  {expLabel}
                </span>
              </div>

              {/* Stat 3: Position */}
              <div className="p-3 sm:p-4 text-center">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/75">
                  POS
                </span>
                <span className="block text-base sm:text-xl font-black text-white mt-1 truncate">
                  {player?.position || "ATHLETE"}
                </span>
              </div>
            </div>

            {/* Right Section: 2-Row Multi-Column Specs Table */}
            <div className="flex-1 border-t lg:border-t-0 lg:border-l border-white/20 divide-y divide-white/20 text-xs sm:text-[13px]">
              {/* Row 1 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/20">
                <div className="p-2.5 sm:p-3 text-center">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
                    JERSEY
                  </span>
                  <span className="font-extrabold text-white">
                    {player?.jerceyNumber ? `#${player.jerceyNumber}` : "—"}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 text-center">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
                    SPORT
                  </span>
                  <span className="font-extrabold text-white truncate block">
                    {sportName}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 text-center">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
                    CONFERENCE
                  </span>
                  <span className="font-extrabold text-white truncate block">
                    {player?.league?.name || "Independent"}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 text-center">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
                    TEAM
                  </span>
                  <span className="font-extrabold text-white truncate block">
                    {teamName}
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/20">
                <div className="p-2.5 sm:p-3 text-center">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
                    STATUS
                  </span>
                  <span className="font-extrabold text-emerald-300">
                    Active Athlete
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 text-center">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
                    EXPERIENCE
                  </span>
                  <span className="font-extrabold text-white">
                    {expLabel} Year
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 text-center">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70">
                    FAN TIPPING
                  </span>
                  <span className="font-extrabold text-white">
                    Direct Payout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHeroBanner;
