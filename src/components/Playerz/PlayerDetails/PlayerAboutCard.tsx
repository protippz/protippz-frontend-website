"use client";

import React from "react";
import { PlayerDetailsData } from "../PlayerDetailsView";
import PlayerSocialButtons from "./PlayerSocialButtons";
import { GraduationCap, MapPin, Award, ShieldCheck } from "lucide-react";

interface PlayerAboutCardProps {
  player: PlayerDetailsData;
  teamName: string;
}

const PlayerAboutCard: React.FC<PlayerAboutCardProps> = ({
  player,
  teamName,
}) => {
  const hometown = [player.city, player.state, player.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white rounded-[26px] border border-slate-200/90 p-6 sm:p-7 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          About {player.name}
        </h2>
        <div className="flex items-center gap-2">
          {player.isProfileClaimed && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Claimed</span>
            </span>
          )}
          <span className="text-xs font-semibold text-[#053697] bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full">
            Official Athlete Profile
          </span>
        </div>
      </div>

      {/* Bio / NIL Statement */}
      {player.bio ? (
        <div className="p-4 rounded-md bg-slate-50/90 border border-slate-200/70 text-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#053697] block mb-1">
            Athlete Bio & NIL Statement
          </span>
          <p className="italic font-medium text-sm sm:text-[15px] leading-relaxed text-slate-700">
            &ldquo;{player.bio}&rdquo;
          </p>
        </div>
      ) : null}

      {/* Athlete Specs & Tags */}
      {(player.school || hometown || player.experience || player.classYear) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {player.school && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
              <GraduationCap className="w-3.5 h-3.5 text-[#053697]" />
              <span>{player.school}</span>
            </div>
          )}
          {hometown && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{hometown}</span>
            </div>
          )}
          {(player.classYear || player.experience) && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{player.classYear || player.experience}</span>
            </div>
          )}
        </div>
      )}

      {/* Narrative Story */}
      <div className="space-y-2 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
        <p>
          <strong>{player.name}</strong> represents <strong>{teamName}</strong>
          {player.position ? ` as a ${player.position}` : ""}
          {player.league?.name ? ` in the ${player.league.name}` : ""}.
        </p>

        <p className="text-slate-600 text-xs sm:text-sm">
          Direct fan tips on ProTippz empower collegiate and independent athletes
          to cover athletic training, nutrition, conditioning, equipment, and
          academic development. Show your appreciation and fuel their season!
        </p>
      </div>

      {/* Social Media & NIL Connect Buttons */}
      <div className="pt-2 border-t border-slate-100">
        <PlayerSocialButtons
          playerName={player.name}
          instagram={player.instagram}
          intagram={player.intagram}
          twitter={player.twitter}
          tiktok={player.tiktok}
          variant="card"
        />
      </div>
    </div>
  );
};

export default PlayerAboutCard;
