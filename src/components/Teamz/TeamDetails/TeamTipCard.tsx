"use client";

import React from "react";
import { DollarSign, ShieldCheck, HeartHandshake, Zap } from "lucide-react";
import SendTipsButton from "../Client/SendTipsButton";
import { ExtractedColorTheme } from "@/lib/extractLogoColor";
import { TeamDetailsData } from "./TeamDetailsView";

interface TeamTipCardProps {
  team: TeamDetailsData;
  token?: string | null;
  theme: ExtractedColorTheme;
}

const TeamTipCard: React.FC<TeamTipCardProps> = ({
  team,
  token,
  theme,
}) => {
  const teamItemForTipping: any = {
    _id: team._id,
    name: team.name,
    team_logo: team.team_logo || "",
    team_bg_image: team.team_bg_image || "",
    league: team.league || { _id: "", name: "NCAA", sport: "Athletics" },
    totalTips: team.totalTips || 0,
    paidAmount: team.paidAmount || 0,
    dueAmount: team.dueAmount || 0,
    isBookmark: !!team.isBookmark,
  };

  const communityRaised = team?.paidAmount
    ? `$${team.paidAmount.toLocaleString()}`
    : team?.totalTips
    ? `$${(team.totalTips * 15).toLocaleString()}`
    : "$2,650";

  return (
    <div className="bg-white border border-[#053697]/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5 sticky top-20">
    

      {/* Raised Stats Box */}
      <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">Community Raised:</span>
          <span className="font-black text-emerald-600 text-base">
            {communityRaised}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">Recorded Tips:</span>
          <span className="font-black text-[#053697]">
            {(team.totalTips || 0).toLocaleString()} Tips
          </span>
        </div>
        <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60">
          <span className="text-slate-500 text-[11px]">Processing Speed:</span>
          <span className="font-semibold text-slate-700 text-[11px] flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Instant Digital Payout
          </span>
        </div>
      </div>

      {/* Tip Action Button */}
      <SendTipsButton item={teamItemForTipping} token={token}>
        {({ openTip }) => (
          <button
            type="button"
            onClick={openTip}
            className="w-full py-4 px-5 rounded-2xl text-white font-black text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
            style={{ backgroundColor: theme.primary }}
          >
            <DollarSign className="w-4 h-4" />
            <span>Send Direct Team Tip</span>
          </button>
        )}
      </SendTipsButton>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#2FC191]" />
        <span>Stripe Verified & NIL Compliance Audited</span>
      </div>
    </div>
  );
};

export default TeamTipCard;
