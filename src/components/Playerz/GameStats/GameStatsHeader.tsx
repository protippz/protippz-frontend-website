"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FilterMode, GameStatsSummary } from "./types";

interface GameStatsHeaderProps {
  summary: GameStatsSummary | null;
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  totalGames: number;
  visibleGames: number;
}

const FILTERS: { mode: FilterMode; label: string }[] = [
  { mode: "ALL", label: "All" },
  { mode: "HOME", label: "Home" },
  { mode: "AWAY", label: "Away" },
];

export const GameStatsHeader: React.FC<GameStatsHeaderProps> = ({
  summary,
  filterMode,
  onFilterChange,
  totalGames,
  visibleGames,
}) => {
  const tiles = summary
    ? [
      { label: "Record", value: summary.record, hint: `${summary.winPct}% wins` },
      { label: "PPG", value: summary.avgPts, hint: "Points", accent: true },
      { label: "RPG", value: summary.avgReb, hint: "Rebounds" },
      { label: "APG", value: summary.avgAst, hint: "Assists" },
      { label: "FG%", value: `${summary.fgPct}`, hint: "Field goal" },
    ]
    : [];

  return (
    <div className="border-b border-slate-200/80 bg-slate-50/50 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
            Recent Game Logs
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {totalGames > 0
              ? `Box scores from the last ${totalGames} game${totalGames === 1 ? "" : "s"}`
              : "Box scores appear here once games are recorded"}
          </p>
        </div>

        {totalGames > 0 && (
          <div
            role="tablist"
            aria-label="Filter games"
            className="grid w-full grid-cols-3 rounded-full border border-slate-200/80 bg-slate-100/80 p-1 sm:w-auto"
          >
            {FILTERS.map(({ mode, label }) => {
              const active = filterMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onFilterChange(mode)}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-colors active:scale-[0.98]",
                    active ? "bg-[#053697] text-white" : "text-slate-600 hover:bg-white hover:text-slate-900",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {summary && (
        <div className="mt-4">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
            {tiles.map((tile) => (
              <div
                key={tile.label}
                className={cn(
                  "min-w-0 rounded-2xl border px-1.5 py-2.5 text-center sm:px-3 sm:py-3 sm:text-left",
                  tile.accent
                    ? "border-[#053697]/15 bg-[#053697]/5"
                    : "border-slate-200/80 bg-white",
                )}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {tile.label}
                </div>
                <div
                  className={cn(
                    "mt-0.5 truncate text-[15px] font-black tabular-nums tracking-tight sm:text-xl",
                    tile.accent ? "text-[#053697]" : "text-slate-900",
                  )}
                >
                  {tile.value}
                </div>
                <div className="hidden truncate text-[11px] font-medium text-slate-400 sm:block">
                  {tile.hint}
                </div>
              </div>
            ))}
          </div>
          {visibleGames !== totalGames && (
            <p className="mt-2 text-[11px] font-medium text-slate-400">
              Averages from {visibleGames} {filterMode === "HOME" ? "home" : "away"} game
              {visibleGames === 1 ? "" : "s"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
