import React from "react";
import { Activity } from "lucide-react";

interface GameStatsEmptyStateProps {
  filterMode: string;
}

export const GameStatsEmptyState: React.FC<GameStatsEmptyStateProps> = ({
  filterMode,
}) => {
  return (
    <div className="py-14 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-center text-slate-400 mx-auto mb-3">
        <Activity className="w-5 h-5" />
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">
        {filterMode !== "ALL"
          ? `No ${filterMode === "HOME" ? "Home" : "Away"} Games Found`
          : "No Game Stats Recorded Yet"}
      </h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
        {filterMode !== "ALL"
          ? "There are currently no recorded game logs matching this filter."
          : "Official NCAA/league game breakdown and performance box scores will appear here as soon as games are recorded."}
      </p>
    </div>
  );
};

