"use client";

import React, { useMemo, useState } from "react";
import { useGetPlayerGameStatsQuery } from "@/redux/features/gameStats/gameStatsApi";
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
import { GameStatsCards } from "./GameStats/GameStatsCards";
import { topScoringGameKey } from "./GameStats/format";

export type { GameLogEntry, PlayerLastGamesTableProps };

/** Shape of one game-stat document returned by the API. */
interface RawGameStat {
  _id?: string;
  isHome?: boolean;
  opponent?: string;
  teamScore?: number;
  opponentScore?: number;
  gameResult?: string;
  gameDate?: string;
  minutesPlayed?: number | string;
  points?: number | string;
  fieldGoalsMade?: number | string;
  fieldGoalsAttempted?: number | string;
  threePointersMade?: number | string;
  threePointersAttempted?: number | string;
  freeThrowsMade?: number | string;
  freeThrowsAttempted?: number | string;
  offensiveRebounds?: number | string;
  defensiveRebounds?: number | string;
  totalRebounds?: number | string;
  assists?: number | string;
  steals?: number | string;
  blocks?: number | string;
  turnovers?: number | string;
  personalFouls?: number | string;
  plusMinus?: number | string;
}

const num = (value: unknown): number => Number(value) || 0;
const pct = (made: number, attempts: number) => (attempts > 0 ? (made / attempts) * 100 : 0);

const toGameLogEntry = (stat: RawGameStat): GameLogEntry => {
  const isHome = Boolean(stat.isHome);
  const opponent = stat.opponent || "Opponent";
  const teamScore = num(stat.teamScore);
  const oppScore = num(stat.opponentScore);
  const wl: "W" | "L" =
    stat.gameResult === "W" || stat.gameResult === "L"
      ? stat.gameResult
      : teamScore >= oppScore
        ? "W"
        : "L";

  const fgm = num(stat.fieldGoalsMade);
  const fga = num(stat.fieldGoalsAttempted);
  const threePm = num(stat.threePointersMade);
  const threePa = num(stat.threePointersAttempted);
  const ftm = num(stat.freeThrowsMade);
  const fta = num(stat.freeThrowsAttempted);
  const oreb = num(stat.offensiveRebounds);
  const dreb = num(stat.defensiveRebounds);

  return {
    id: stat._id,
    gameDate: stat.gameDate
      ? new Date(stat.gameDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : "Recent",
    matchup: isHome ? `vs ${opponent}` : `@ ${opponent}`,
    isHome,
    wl,
    score: `${teamScore}-${oppScore}`,
    min: num(stat.minutesPlayed),
    pts: num(stat.points),
    fgm,
    fga,
    fgPct: pct(fgm, fga),
    threePm,
    threePa,
    threePct: pct(threePm, threePa),
    ftm,
    fta,
    ftPct: pct(ftm, fta),
    oreb,
    dreb,
    reb: num(stat.totalRebounds ?? oreb + dreb),
    ast: num(stat.assists),
    stl: num(stat.steals),
    blk: num(stat.blocks),
    tov: num(stat.turnovers),
    pf: num(stat.personalFouls),
    plusMinus: num(stat.plusMinus),
  };
};

const PlayerLastGamesTable: React.FC<PlayerLastGamesTableProps> = ({
  playerId,
  games: propGames,
}) => {
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");

  const { data: apiResponse, isLoading } = useGetPlayerGameStatsQuery(
    { playerId: playerId as string, limit: 10, sort: "-gameDate" },
    { skip: !playerId || Boolean(propGames?.length) },
  );

  // Real data only: games passed as a prop win, otherwise the API result.
  const rawData = useMemo<GameLogEntry[]>(() => {
    if (propGames?.length) return propGames;
    const list = apiResponse?.data?.result;
    return Array.isArray(list) ? (list as RawGameStat[]).map(toGameLogEntry) : [];
  }, [propGames, apiResponse]);

  const data = useMemo(() => {
    if (filterMode === "HOME") return rawData.filter((g) => g.isHome);
    if (filterMode === "AWAY") return rawData.filter((g) => !g.isHome);
    return rawData;
  }, [rawData, filterMode]);

  const summary = useGameStatsSummary(data);
  const topGameKey = useMemo(() => topScoringGameKey(data), [data]);

  return (
    <section
      aria-label="Recent game logs"
      className="relative w-full overflow-hidden rounded-[24px] border border-slate-200/90 bg-white/95 backdrop-blur-xl sm:rounded-[30px]"
    >
      <GameStatsHeader
        summary={summary}
        filterMode={filterMode}
        onFilterChange={setFilterMode}
        totalGames={rawData.length}
        visibleGames={data.length}
      />

      {isLoading ? (
        <GameStatsSkeleton />
      ) : data.length === 0 ? (
        <GameStatsEmptyState filterMode={filterMode} onShowAll={() => setFilterMode("ALL")} />
      ) : (
        <>
          {/* Phones: one card per game */}
          <div className="md:hidden">
            <GameStatsCards data={data} topGameKey={topGameKey} />
          </div>
          {/* Tablet & desktop: full box-score table */}
          <div className="hidden md:block">
            <GameStatsTable data={data} summary={summary} topGameKey={topGameKey} />
          </div>
        </>
      )}
    </section>
  );
};

export default PlayerLastGamesTable;
