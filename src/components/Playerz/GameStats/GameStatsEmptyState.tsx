import React from "react";
import { Activity } from "lucide-react";
import { FilterMode } from "./types";

interface GameStatsEmptyStateProps {
  filterMode: FilterMode;
  onShowAll?: () => void;
}

export const GameStatsEmptyState: React.FC<GameStatsEmptyStateProps> = ({ filterMode, onShowAll }) => {
  const filtered = filterMode !== "ALL";
  const where = filterMode === "HOME" ? "home" : "away";

  return (
    <div className="px-4 py-12 text-center sm:py-14">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/90 bg-slate-50 text-slate-400">
        <Activity className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold tracking-tight text-slate-900">
        {filtered ? `No ${where} games yet` : "No game stats recorded yet"}
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
        {filtered
          ? `None of the recent games were played ${where === "home" ? "at home" : "away"}.`
          : "Official box scores will appear here as soon as games are recorded."}
      </p>
      {filtered && onShowAll && (
        <button
          type="button"
          onClick={onShowAll}
          className="mt-4 cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-[#053697] transition-colors hover:border-[#053697]/30 hover:bg-slate-50 active:scale-[0.98]"
        >
          Show all games
        </button>
      )}
    </div>
  );
};
