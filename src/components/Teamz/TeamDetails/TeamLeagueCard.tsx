"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/ApisRequests/server";
import { Trophy, Calendar, Mail, ArrowUpRight } from "lucide-react";
import { TeamDetailsData } from "./TeamDetailsView";

interface TeamLeagueCardProps {
  team: TeamDetailsData;
}

const TeamLeagueCard: React.FC<TeamLeagueCardProps> = ({ team }) => {
  const leagueName = team?.league?.name || "NCAA Collegiate Athletics";
  const sportName = team?.league?.sport || team?.sport || "Collegiate Sports";
  const leagueImg = team?.league?.league_image
    ? imageUrl(team.league.league_image)
    : "";

  const memberSince = team?.createdAt
    ? new Date(team.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : "Charter Member";

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xs space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg sm:text-xl font-black uppercase text-slate-900 tracking-tight">
          League & Conference
        </h3>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        {leagueImg ? (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 p-1">
            <Image
              src={leagueImg}
              alt={leagueName}
              fill
              sizes="56px"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl shrink-0">
            {leagueName.slice(0, 1)}
          </div>
        )}

        <div className="min-w-0">
          <h4 className="font-extrabold text-slate-900 text-base leading-snug truncate">
            {leagueName}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Sport: <span className="font-semibold text-slate-700">{sportName}</span>
          </p>
        </div>
      </div>

      {/* Meta details */}
      <div className="space-y-2.5 pt-1 text-xs">
        <div className="flex items-center justify-between py-2 border-b border-slate-100 text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            Member Since
          </span>
          <span className="font-bold text-slate-800">{memberSince}</span>
        </div>

        {team?.email && (
          <div className="flex items-center justify-between py-2 border-b border-slate-100 text-slate-600">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Mail className="w-3.5 h-3.5" />
              Contact
            </span>
            <span className="font-medium text-slate-800 truncate max-w-[180px]">
              {team.email}
            </span>
          </div>
        )}
      </div>

      <Link
        href={`/teamz?league=${team?.league?._id || ""}`}
        className="mt-2 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>View Conference Standings</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
      </Link>
    </div>
  );
};

export default TeamLeagueCard;
