"use client";

import React from "react";
import { Activity } from "lucide-react";
import { FilterMode, GameStatsSummary } from "./types";

interface GameStatsHeaderProps {
  summary: GameStatsSummary | null;
  hasApiGames: boolean;
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  totalGames: number;
}

export const GameStatsHeader: React.FC<GameStatsHeaderProps> = ({
  summary,
  hasApiGames,
  filterMode,
  onFilterChange,
  totalGames,
}) => {
  return (
    <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-md bg-[#053697]/10 flex items-center justify-center text-[#053697] shrink-0">
          <Activity className="w-5 h-5 text-[#053697]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Recent Game Logs & Box Scores
            </h2>
            {hasApiGames && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official NCAA/league game breakdown & performance metrics
          </p>
        </div>
      </div>

      {/* Quick Highlights & Filter Pills */}
      {totalGames > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {summary && (
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <div className="px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-bold text-slate-700 font-mono">
                <span className="text-slate-400 font-medium mr-1">PPG</span>
                <span>{summary.avgPts}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-bold text-slate-700 font-mono">
                <span className="text-slate-400 font-medium mr-1">RPG</span>
                <span>{summary.avgReb}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-bold text-slate-700 font-mono">
                <span className="text-slate-400 font-medium mr-1">APG</span>
                <span>{summary.avgAst}</span>
              </div>
            </div>
          )}

          {/* Filter Pills */}
          {/* <div className="inline-flex p-1 bg-slate-200/70 rounded-full text-xs font-bold">
            {(["ALL", "HOME", "AWAY"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onFilterChange(mode)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer text-[11px] font-bold ${filterMode === mode
                  ? "bg-[#053697] text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                {mode === "ALL"
                  ? "All Games"
                  : mode === "HOME"
                    ? "Home"
                    : "Away"}
              </button>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
};

