"use client";

import React from "react";
import { DollarSign } from "lucide-react";
import SendTipsButton from "../Client/SendTipsButton";
import { ExtractedColorTheme } from "@/lib/extractLogoColor";
import { PlayerDetailsData } from "../PlayerDetailsView";

interface PlayerTipCardProps {
  player: PlayerDetailsData;
  token?: string | null;
  theme: ExtractedColorTheme;
  playerItemForTipping: any;
}

const PlayerTipCard: React.FC<PlayerTipCardProps> = ({
  player,
  token,
  theme,
  playerItemForTipping,
}) => {
  return (
    <div className="bg-white border border-[#053697]/20 p-6">
      <div className="flex items-center gap-2 mb-2 pt-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#053697]">
          Support This Athlete
        </span>
      </div>

      <h3 className="text-lg font-extrabold text-slate-900">
        Send Tippz to {player.name}
      </h3>

      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
        Show your support directly! Select an amount or enter a custom tip to
        fuel their athletic journey.
      </p>

      <div className="my-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600">Total Tips Raised:</span>
          <span className="font-extrabold text-emerald-600 text-sm">
            ${(player.totalTips || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600">Processing:</span>
          <span className="font-semibold text-slate-800">Direct Payout</span>
        </div>
      </div>

      <SendTipsButton item={playerItemForTipping} token={token}>
        {({ openTip }) => (
          <button
            type="button"
            onClick={openTip}
            className="w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.primary }}
          >
            <DollarSign className="w-4 h-4" />
            <span>Choose Tip Amount</span>
          </button>
        )}
      </SendTipsButton>
    </div>
  );
};

export default PlayerTipCard;
