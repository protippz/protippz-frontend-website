"use client";

import React from "react";
import { PlayerDetailsData } from "../PlayerDetailsView";

interface PlayerAboutCardProps {
  player: PlayerDetailsData;
  teamName: string;
}

const PlayerAboutCard: React.FC<PlayerAboutCardProps> = ({
  player,
  teamName,
}) => {
  return (
    <div className="bg-white border p-6 sm:p-7 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          About {player.name}
        </h2>
        <span className="text-xs font-semibold text-[#053697] bg-blue-50 px-2.5 py-1 rounded-md">
          Official Athlete Profile
        </span>
      </div>

      <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
        <strong>{player.name}</strong> represents <strong>{teamName}</strong>
        {player.position ? ` as a ${player.position}` : ""}
        {player.league?.name ? ` in the ${player.league.name}` : ""}.
      </p>

      <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
        Direct fan tips on ProTippz empower collegiate and independent athletes
        to cover athletic training, nutrition, conditioning, equipment, and
        academic development. Show your appreciation and fuel their season!
      </p>
    </div>
  );
};

export default PlayerAboutCard;
