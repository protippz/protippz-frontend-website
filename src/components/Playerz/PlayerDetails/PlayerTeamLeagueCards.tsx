"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/ApisRequests/server";
import { PlayerDetailsData } from "../PlayerDetailsView";

interface PlayerTeamLeagueCardsProps {
  player: PlayerDetailsData;
  teamName: string;
  sportName: string;
  teamLogoUrl: string;
}

const PlayerTeamLeagueCards: React.FC<PlayerTeamLeagueCardsProps> = ({
  player,
  teamName,
  sportName,
  teamLogoUrl,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Team Card */}
      <div className="bg-white border p-5 flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Team Information
          </span>
          <div className="flex items-center gap-3.5 mb-3">
            {teamLogoUrl ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 p-1">
                <Image
                  src={teamLogoUrl}
                  alt={teamName}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#053697] flex items-center justify-center font-black text-lg shrink-0">
                T
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                {teamName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {player.team?.email || "Official Athletic Program"}
              </p>
            </div>
          </div>
        </div>

        {player.team?._id && (
          <Link
            href={`/playerz?team=${player.team._id}`}
            className="mt-3 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-[#053697] bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <span>View All Teammates</span>
          </Link>
        )}
      </div>

      {/* League Card */}
      <div className="bg-white border p-5 flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            League & Conference
          </span>
          <div className="flex items-center gap-3.5 mb-3">
            {player?.league?.league_image ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 p-1">
                <Image
                  src={imageUrl(player.league.league_image)}
                  alt={player.league.name || "League"}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg shrink-0">
                L
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                {player.league?.name || "Athletic Conference"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                Sport: {sportName}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 text-center">
          Official Conference
        </div>
      </div>
    </div>
  );
};

export default PlayerTeamLeagueCards;
