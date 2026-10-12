"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Player } from "@/app/(default)/playerz/page";
import { imageUrl } from "@/ApisRequests/server";
import defaultPlayer from "@/Assets/playerDefult.jpg";
import {
  Search,
  X,
  Users,
  ArrowUpRight,
  DollarSign,
  UserX,
  List,
  LayoutGrid,
} from "lucide-react";
import SendTipsButton from "@/components/Playerz/Client/SendTipsButton";

interface TeamRosterSectionProps {
  roster: Player[];
  teamName: string;
  token?: string | null;
  accentColor?: string;
}

const TeamRosterSection: React.FC<TeamRosterSectionProps> = ({
  roster,
  teamName,
  token,
  accentColor = "#053697",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredRoster = useMemo(() => {
    if (!searchTerm.trim()) return roster;
    const term = searchTerm.toLowerCase().trim();
    return roster.filter((player) => {
      const name = player?.name?.toLowerCase() || "";
      const position = player?.position?.toLowerCase() || "";
      const jersey = String(player?.jerceyNumber || "").toLowerCase();
      const exp = player?.experience?.toLowerCase() || "";
      return (
        name.includes(term) ||
        position.includes(term) ||
        jersey.includes(term) ||
        exp.includes(term)
      );
    });
  }, [roster, searchTerm]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xs space-y-5">
      {/* Header, Search & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight">
              Official Team Roster
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {roster.length} Athletes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Support {teamName} collegiate student-athletes directly with digital tips.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search athlete, #, position..."
              className="w-full h-9.5 pl-9 pr-8 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#053697] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 shrink-0 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Official Roster Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">Roster</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roster Athletes Content */}
      {filteredRoster.length === 0 ? (
        roster.length === 0 ? (
          /* Empty Roster State */
          <div className="py-14 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#053697] mb-3">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Roster Information Updating
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Athletes for {teamName} are currently being onboarded to the NIL vault. Check back soon for updated player profiles.
            </p>
          </div>
        ) : (
          /* Search Empty State */
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              No athletes match &ldquo;{searchTerm}&rdquo;
            </h3>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Clear Search Filter
            </button>
          </div>
        )
      ) : viewMode === "list" ? (
        /* =========================================================
           OFFICIAL NCAA ROSTER TABLE LIST VIEW (MATCHING USER SCREENSHOT)
           ========================================================= */
        <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xs divide-y divide-slate-200">
          {filteredRoster.map((player, index) => {
            const playerImg = player.player_image
              ? imageUrl(player.player_image)
              : defaultPlayer;

            const jerseyDisplay =
              player.jerceyNumber !== undefined && player.jerceyNumber !== null && player.jerceyNumber !== ""
                ? String(player.jerceyNumber)
                : `${index}`;

            const positionDisplay = player.position || "Athlete";
            const expDisplay = player.experience || "Student-Athlete";
            const isEven = index % 2 === 0;

            return (
              <div
                key={player._id}
                className={`relative group transition-colors duration-150 p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isEven ? "bg-white hover:bg-slate-50/80" : "bg-[#f4f5f7] hover:bg-[#eaecee]"
                }`}
              >
                {/* Left Side: Headshot Photo + Position/Jersey/Name */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                  {/* Athlete Headshot Box */}
                  <Link
                    href={`/playerz/${player._id}`}
                    className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-slate-200/80 shadow-2xs group-hover:border-[#053697]/40 transition-colors"
                  >
                    <Image
                      src={playerImg}
                      alt={player.name}
                      fill
                      sizes="88px"
                      className="object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Player Metadata & Name */}
                  <div className="min-w-0 space-y-1">
                    {/* Top Line: Position / Stats */}
                    <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-600 font-medium truncate">
                      <span className="font-bold text-slate-900">{positionDisplay}</span>
                      <span className="text-slate-400 font-light">/</span>
                      <span className="text-slate-600 font-normal">
                        {player.league?.sport || "Collegiate"}
                      </span>
                    </div>

                    {/* Bottom Line: Jersey Number Box + Large Bold Athlete Name */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Jersey Badge Box */}
                      <span className="inline-flex items-center justify-center min-w-[24px] sm:min-w-[26px] h-6 px-1.5 rounded-[3px] bg-black text-[#F5B335] font-black text-xs sm:text-sm tracking-tight shadow-2xs select-none">
                        {jerseyDisplay}
                      </span>

                      {/* Athlete Full Name */}
                      <Link
                        href={`/playerz/${player._id}`}
                        className="font-black text-slate-900 hover:text-[#053697] text-base sm:text-lg lg:text-xl uppercase tracking-tight transition-colors truncate leading-tight"
                        title={player.name}
                      >
                        {player.name}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Side: Academic / Hometown Bio & Full Bio / Direct Tip Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-start lg:items-center justify-between md:justify-end gap-3 sm:gap-6 w-full md:w-auto shrink-0 pl-21 md:pl-0">
                  {/* Bio Line */}
                  <div className="space-y-1 text-left md:text-right">
                    <div className="text-xs sm:text-[13px] text-slate-600 truncate max-w-xs sm:max-w-md">
                      <span className="italic font-bold text-slate-800">{expDisplay}</span>
                      <span className="text-slate-400 font-light mx-1.5">/</span>
                      <span className="text-slate-600 font-medium">{teamName}</span>
                      <span className="text-slate-400 font-light mx-1.5">/</span>
                      <span className="text-slate-500">{player.league?.name || "NCAA"}</span>
                    </div>

                    {/* Links & Tip CTA */}
                    <div className="flex items-center justify-start md:justify-end gap-3 pt-0.5">
                      <Link
                        href={`/playerz/${player._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#053697] transition-colors group/bio"
                      >
                        <span className="text-[9px] text-slate-900 group-hover/bio:text-[#053697] transition-colors">
                          ▶
                        </span>
                        <span className="underline decoration-slate-300 group-hover/bio:decoration-[#053697]">
                          Full Bio
                        </span>
                      </Link>

                      <span className="text-slate-300">|</span>

                      <SendTipsButton item={player} token={token}>
                        {({ openTip }) => (
                          <button
                            type="button"
                            onClick={openTip}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#2FC191] hover:bg-[#28b887] text-[#053697] text-xs font-black uppercase tracking-wider transition-colors shadow-2xs cursor-pointer active:scale-95"
                          >
                            <DollarSign className="w-3 h-3" />
                            <span>Direct Tip</span>
                          </button>
                        )}
                      </SendTipsButton>

                      {player.totalTips ? (
                        <span className="text-[11px] font-extrabold text-[#053697] bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100">
                          ${player.totalTips.toLocaleString()} Raised
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Iconic Bottom-Right Corner Accent with `+` sign */}
                <div className="absolute right-0 bottom-0 pointer-events-none select-none">
                  <div className="w-0 h-0 border-b-[18px] border-b-slate-300/80 border-l-[18px] border-l-transparent" />
                  <span className="absolute bottom-0 right-[2px] text-[10px] font-black text-slate-700 leading-none">
                    +
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* =========================================================
           GRID CARDS VIEW
           ========================================================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRoster.map((player) => {
            const playerImg = player.player_image
              ? imageUrl(player.player_image)
              : defaultPlayer;

            const jerseyDisplay = player.jerceyNumber
              ? `#${player.jerceyNumber}`
              : "--";

            const positionDisplay = player.position || "Athlete";

            return (
              <div
                key={player._id}
                className="group relative bg-[#fafbfb] hover:bg-white border border-slate-200/90 hover:border-[#053697]/40 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link
                    href={`/playerz/${player._id}`}
                    className="relative block w-full h-48 bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={playerImg}
                      alt={player.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-black z-10">
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#053697] text-white">
                        {jerseyDisplay}
                      </span>
                      <span className="px-2 py-0.5 rounded-[4px] bg-white text-[#053697]">
                        {positionDisplay}
                      </span>
                    </div>
                  </Link>

                  <div className="p-3.5">
                    <Link
                      href={`/playerz/${player._id}`}
                      className="block font-black text-slate-900 hover:text-[#053697] text-base uppercase tracking-tight truncate transition-colors"
                      title={player.name}
                    >
                      {player.name}
                    </Link>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Direct Tips
                      </span>
                      <span className="font-extrabold text-[#053697]">
                        ${(player.totalTips || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 pt-0 flex items-center gap-2">
                  <Link
                    href={`/playerz/${player._id}`}
                    className="flex-1 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </Link>

                  <SendTipsButton item={player} token={token}>
                    {({ openTip }) => (
                      <button
                        type="button"
                        onClick={openTip}
                        className="h-9 px-3 rounded-xl bg-[#2FC191] hover:bg-[#28b887] text-[#053697] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title={`Tip ${player.name}`}
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Tip</span>
                      </button>
                    )}
                  </SendTipsButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamRosterSection;
