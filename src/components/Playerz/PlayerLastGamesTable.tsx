"use client";

import React, { useMemo, useState } from "react";
import { useGetPlayerGameStatsQuery } from "@/Redux/Apis/gameStatsApis";
import {
  GameLogEntry,
  FilterMode,
  PlayerLastGamesTableProps,
} from "./GameStats/types";
import { useGameStatsSummary } from "./GameStats/useGameStatsSummary";
import { GameStatsHeader } from "./GameStats/GameStatsHeader";
import { GameStatsSkeleton } from "./GameStats/GameStatsSkeleton";
import { GameStatsEmptyState } from "./GameStats/GameStatsEmptyState";
import { GameStatsTable } from "./GameStats/GameStatsTable";

export type { GameLogEntry, PlayerLastGamesTableProps };

const PlayerLastGamesTable: React.FC<PlayerLastGamesTableProps> = ({
  playerId,
  games: propGames,
}) => {
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");

  // Fetch real game stats from RTK Query
  const {
    data: apiResponse,
    isLoading,
  } = useGetPlayerGameStatsQuery(
    {
      playerId: playerId as string,
      limit: 10,
      sort: "-gameDate",
    },
    {
      skip: !playerId,
    }
  );

  // Map backend response to GameLogEntry format (No dummy or fallback data!)
  const apiGames = useMemo<GameLogEntry[] | null>(() => {
    const rawList = apiResponse?.data?.result;
    if (!Array.isArray(rawList) || rawList.length === 0) return null;

    return rawList.map((stat: any) => {
      const isHome = Boolean(stat.isHome);
      const opponent = stat.opponent || "Opponent";
      const matchup = isHome ? `vs ${opponent}` : `@ ${opponent}`;
      const teamScore = stat.teamScore ?? 0;
      const oppScore = stat.opponentScore ?? 0;
      const score = `${teamScore}-${oppScore}`;
      const wl: "W" | "L" =
        stat.gameResult === "W" || stat.gameResult === "L"
          ? stat.gameResult
          : teamScore >= oppScore
            ? "W"
            : "L";

      const fgm = Number(stat.fieldGoalsMade) || 0;
      const fga = Number(stat.fieldGoalsAttempted) || 0;
      const fgPct = fga > 0 ? (fgm / fga) * 100 : 0;

      const threePm = Number(stat.threePointersMade) || 0;
      const threePa = Number(stat.threePointersAttempted) || 0;
      const threePct = threePa > 0 ? (threePm / threePa) * 100 : 0;

      const ftm = Number(stat.freeThrowsMade) || 0;
      const fta = Number(stat.freeThrowsAttempted) || 0;
      const ftPct = fta > 0 ? (ftm / fta) * 100 : 0;

      const oreb = Number(stat.offensiveRebounds) || 0;
      const dreb = Number(stat.defensiveRebounds) || 0;
      const reb = Number(stat.totalRebounds ?? oreb + dreb) || 0;

      const formattedDate = stat.gameDate
        ? new Date(stat.gameDate).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        : "Recent";

      return {
        id: stat._id,
        gameDate: formattedDate,
        matchup,
        isHome,
        wl,
        score,
        min: Number(stat.minutesPlayed) || 0,
        pts: Number(stat.points) || 0,
        fgm,
        fga,
        fgPct,
        threePm,
        threePa,
        threePct,
        ftm,
        fta,
        ftPct,
        oreb,
        dreb,
        reb,
        ast: Number(stat.assists) || 0,
        stl: Number(stat.steals) || 0,
        blk: Number(stat.blocks) || 0,
        tov: Number(stat.turnovers) || 0,
        pf: Number(stat.personalFouls) || 0,
        plusMinus: Number(stat.plusMinus) || 0,
      };
    });
  }, [apiResponse]);

  // Active dataset: strictly real data from prop or API (no fallback mock data!)
  const rawData = useMemo(() => {
    if (propGames && propGames.length > 0) return propGames;
    if (apiGames && apiGames.length > 0) return apiGames;
    return [];
  }, [propGames, apiGames]);

  // Filtered dataset
  const data = useMemo(() => {
    if (filterMode === "HOME") return rawData.filter((g) => g.isHome);
    if (filterMode === "AWAY") return rawData.filter((g) => !g.isHome);
    return rawData;
  }, [rawData, filterMode]);

  // Summary statistics computed via split hook
  const summary = useGameStatsSummary(data);

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[26px] sm:rounded-[30px] overflow-hidden  relative transition-all">
      {/* Header with Title, Live Sync Badge & Filters */}
      <GameStatsHeader
        summary={summary}
        hasApiGames={Boolean(apiGames && apiGames.length > 0)}
        filterMode={filterMode}
        onFilterChange={setFilterMode}
        totalGames={rawData.length}
      />

      {/* Horizontal Scroll Prompt for Mobile/Tablet */}
      {data.length > 0 && (
        <div className="xl:hidden bg-blue-50/60 border-b border-blue-100/60 px-4 py-1.5 text-[11px] text-[#053697] flex items-center justify-between font-medium">
          <span>← Scroll horizontally for full 23-category box score →</span>
          <span className="font-bold">Date pinned</span>
        </div>
      )}

      {/* Content State: Loading, Empty, or Data Table */}
      {isLoading ? (
        <GameStatsSkeleton />
      ) : data.length === 0 ? (
        <GameStatsEmptyState filterMode={filterMode} />
      ) : (
        <GameStatsTable data={data} summary={summary} />
      )}
    </div>
  );
};

export default PlayerLastGamesTable;
