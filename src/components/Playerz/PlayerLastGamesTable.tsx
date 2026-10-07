"use client";

import React, { useMemo } from "react";
import { Trophy, Calendar, ArrowRightLeft, TrendingUp } from "lucide-react";

export interface GameLogEntry {
  id?: string | number;
  gameDate: string;
  matchup: string;
  isHome?: boolean;
  wl: "W" | "L";
  score: string;
  min: number;
  pts: number;
  fgm: number;
  fga: number;
  fgPct: number;
  threePm: number;
  threePa: number;
  threePct: number;
  ftm: number;
  fta: number;
  ftPct: number;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  pf: number;
  plusMinus: number;
}

interface PlayerLastGamesTableProps {
  games?: GameLogEntry[];
  teamName?: string;
  position?: string;
  accentColor?: string;
}

// Generate realistic default recent games if none provided
const getDefaultGames = (teamName?: string): GameLogEntry[] => {
  return [
    {
      id: 1,
      gameDate: "Oct 04, 2026",
      matchup: "vs BOS",
      isHome: true,
      wl: "W",
      score: "114-106",
      min: 34,
      pts: 24,
      fgm: 9,
      fga: 16,
      fgPct: 56.3,
      threePm: 2,
      threePa: 5,
      threePct: 40.0,
      ftm: 4,
      fta: 5,
      ftPct: 80.0,
      oreb: 2,
      dreb: 7,
      reb: 9,
      ast: 6,
      stl: 2,
      blk: 1,
      tov: 2,
      pf: 2,
      plusMinus: 12,
    },
    {
      id: 2,
      gameDate: "Oct 01, 2026",
      matchup: "@ MIL",
      isHome: false,
      wl: "L",
      score: "98-102",
      min: 31,
      pts: 18,
      fgm: 7,
      fga: 14,
      fgPct: 50.0,
      threePm: 1,
      threePa: 4,
      threePct: 25.0,
      ftm: 3,
      fta: 4,
      ftPct: 75.0,
      oreb: 1,
      dreb: 5,
      reb: 6,
      ast: 4,
      stl: 1,
      blk: 2,
      tov: 3,
      pf: 3,
      plusMinus: -4,
    },
    {
      id: 3,
      gameDate: "Sep 28, 2026",
      matchup: "vs NYK",
      isHome: true,
      wl: "W",
      score: "120-111",
      min: 36,
      pts: 28,
      fgm: 11,
      fga: 18,
      fgPct: 61.1,
      threePm: 3,
      threePa: 6,
      threePct: 50.0,
      ftm: 3,
      fta: 4,
      ftPct: 75.0,
      oreb: 3,
      dreb: 8,
      reb: 11,
      ast: 7,
      stl: 1,
      blk: 1,
      tov: 1,
      pf: 1,
      plusMinus: 18,
    },
    {
      id: 4,
      gameDate: "Sep 25, 2026",
      matchup: "@ PHI",
      isHome: false,
      wl: "W",
      score: "105-99",
      min: 29,
      pts: 16,
      fgm: 6,
      fga: 12,
      fgPct: 50.0,
      threePm: 0,
      threePa: 2,
      threePct: 0.0,
      ftm: 4,
      fta: 4,
      ftPct: 100.0,
      oreb: 1,
      dreb: 4,
      reb: 5,
      ast: 3,
      stl: 2,
      blk: 0,
      tov: 2,
      pf: 4,
      plusMinus: 7,
    },
    {
      id: 5,
      gameDate: "Sep 22, 2026",
      matchup: "vs MIA",
      isHome: true,
      wl: "L",
      score: "110-115",
      min: 35,
      pts: 22,
      fgm: 8,
      fga: 15,
      fgPct: 53.3,
      threePm: 2,
      threePa: 5,
      threePct: 40.0,
      ftm: 4,
      fta: 6,
      ftPct: 66.7,
      oreb: 2,
      dreb: 6,
      reb: 8,
      ast: 5,
      stl: 0,
      blk: 2,
      tov: 3,
      pf: 2,
      plusMinus: -2,
    },
  ];
};

const PlayerLastGamesTable: React.FC<PlayerLastGamesTableProps> = ({
  games,
  teamName,
  accentColor = "#053697",
}) => {
  const data = useMemo(() => {
    return games && games.length > 0 ? games : getDefaultGames(teamName);
  }, [games, teamName]);

  // Compute averages for footer summary row & top stats chips
  const summary = useMemo(() => {
    if (!data.length) return null;
    const len = data.length;
    let wins = 0;
    const sum = data.reduce(
      (acc, g) => {
        if (g.wl === "W") wins++;
        return {
          min: acc.min + g.min,
          pts: acc.pts + g.pts,
          fgm: acc.fgm + g.fgm,
          fga: acc.fga + g.fga,
          threePm: acc.threePm + g.threePm,
          threePa: acc.threePa + g.threePa,
          ftm: acc.ftm + g.ftm,
          fta: acc.fta + g.fta,
          oreb: acc.oreb + g.oreb,
          dreb: acc.dreb + g.dreb,
          reb: acc.reb + g.reb,
          ast: acc.ast + g.ast,
          stl: acc.stl + g.stl,
          blk: acc.blk + g.blk,
          tov: acc.tov + g.tov,
          pf: acc.pf + g.pf,
          plusMinus: acc.plusMinus + g.plusMinus,
        };
      },
      {
        min: 0,
        pts: 0,
        fgm: 0,
        fga: 0,
        threePm: 0,
        threePa: 0,
        ftm: 0,
        fta: 0,
        oreb: 0,
        dreb: 0,
        reb: 0,
        ast: 0,
        stl: 0,
        blk: 0,
        tov: 0,
        pf: 0,
        plusMinus: 0,
      }
    );

    return {
      record: `${wins}-${len - wins}`,
      winPct: ((wins / len) * 100).toFixed(0),
      avgPts: (sum.pts / len).toFixed(1),
      avgReb: (sum.reb / len).toFixed(1),
      avgAst: (sum.ast / len).toFixed(1),
      min: (sum.min / len).toFixed(1),
      pts: (sum.pts / len).toFixed(1),
      fgm: (sum.fgm / len).toFixed(1),
      fga: (sum.fga / len).toFixed(1),
      fgPct: sum.fga > 0 ? ((sum.fgm / sum.fga) * 100).toFixed(1) : "0.0",
      threePm: (sum.threePm / len).toFixed(1),
      threePa: (sum.threePa / len).toFixed(1),
      threePct: sum.threePa > 0 ? ((sum.threePm / sum.threePa) * 100).toFixed(1) : "0.0",
      ftm: (sum.ftm / len).toFixed(1),
      fta: (sum.fta / len).toFixed(1),
      ftPct: sum.fta > 0 ? ((sum.ftm / sum.fta) * 100).toFixed(1) : "0.0",
      oreb: (sum.oreb / len).toFixed(1),
      dreb: (sum.dreb / len).toFixed(1),
      reb: (sum.reb / len).toFixed(1),
      ast: (sum.ast / len).toFixed(1),
      stl: (sum.stl / len).toFixed(1),
      blk: (sum.blk / len).toFixed(1),
      tov: (sum.tov / len).toFixed(1),
      pf: (sum.pf / len).toFixed(1),
      plusMinus:
        (sum.plusMinus / len > 0 ? "+" : "") +
        (sum.plusMinus / len).toFixed(1),
    };
  }, [data]);

  return (
    <div className="w-full bg-white border border-slate-200 overflow-hidden">
      {/* Table Header Section with Quick Stats Chips */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Last 5 Games
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Notification for Mobile/Tablet */}
      <div className="xl:hidden bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
        <span>← Scroll horizontally for all 23 box score categories →</span>
        <span className="font-bold text-slate-700">Date stays pinned</span>
      </div>

      {/* Responsive Horizontal Scroll Container with Sticky Date Column */}
      <div className="w-full overflow-x-auto custom-sidebar-scrollbar relative">
        <table className="w-full min-w-[1100px] text-left border-collapse text-xs tabular-nums">
          <thead>
            {/* Top Category Grouping Header */}
            <tr className="bg-slate-100/90 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">
              {/* STICKY Game Date Header Top */}
              <th
                rowSpan={2}
                className="sticky left-0 z-30 bg-slate-100 py-3.5 px-4 whitespace-nowrap text-left border-r border-slate-300 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)] font-black text-slate-900 text-xs uppercase tracking-wider min-w-[120px]"
              >
                Game Date
              </th>
              <th colSpan={3} className="py-1 px-3 border-r border-slate-200">
                Matchup Info
              </th>
              <th
                colSpan={5}
                className="py-1 px-3 border-r border-slate-200 bg-amber-50/40 text-amber-900"
              >
                Scoring & Field Goals
              </th>
              <th colSpan={3} className="py-1 px-3 border-r border-slate-200">
                3-Point Shooting
              </th>
              <th colSpan={3} className="py-1 px-3 border-r border-slate-200">
                Free Throws
              </th>
              <th colSpan={3} className="py-1 px-3 border-r border-slate-200">
                Rebounds
              </th>
              <th colSpan={3} className="py-1 px-3 border-r border-slate-200">
                Playmaking & Defense
              </th>
              <th colSpan={3} className="py-1 px-3">
                Discipline & Impact
              </th>
            </tr>

            {/* Individual Columns Header */}
            <tr className="bg-slate-50 border-b border-slate-300 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              {/* Matchup */}
              <th className="py-3 px-3.5 whitespace-nowrap">Matchup</th>
              {/* W/L */}
              <th className="py-3 px-3 whitespace-nowrap text-center">W/L</th>
              {/* MIN */}
              <th className="py-3 px-3 whitespace-nowrap text-right border-r border-slate-200">
                MIN
              </th>

              {/* PTS (Highlighted Column) */}
              <th className="py-3 px-3.5 whitespace-nowrap text-right font-black text-slate-950 bg-amber-50/60 text-xs">
                PTS
              </th>
              {/* FGM */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">FGM</th>
              {/* FGA */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">FGA</th>
              {/* FG% */}
              <th className="py-3 px-3 whitespace-nowrap text-right font-bold border-r border-slate-200">
                FG%
              </th>

              {/* 3PM */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">3PM</th>
              {/* 3PA */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">3PA</th>
              {/* 3P% */}
              <th className="py-3 px-3 whitespace-nowrap text-right font-bold border-r border-slate-200">
                3P%
              </th>

              {/* FTM */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">FTM</th>
              {/* FTA */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">FTA</th>
              {/* FT% */}
              <th className="py-3 px-3 whitespace-nowrap text-right font-bold border-r border-slate-200">
                FT%
              </th>

              {/* OREB */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">OREB</th>
              {/* DREB */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">DREB</th>
              {/* REB */}
              <th className="py-3 px-3 whitespace-nowrap text-right font-black text-slate-900 border-r border-slate-200">
                REB
              </th>

              {/* AST */}
              <th className="py-3 px-3 whitespace-nowrap text-right font-black text-slate-900">
                AST
              </th>
              {/* STL */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">STL</th>
              {/* BLK */}
              <th className="py-3 px-3 whitespace-nowrap text-right border-r border-slate-200">
                BLK
              </th>

              {/* TOV */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">TOV</th>
              {/* PF */}
              <th className="py-3 px-2.5 whitespace-nowrap text-right">PF</th>
              {/* +/- */}
              <th className="py-3 px-3.5 whitespace-nowrap text-right font-black">
                +/-
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {data.map((row, idx) => {
              const isWin = row.wl === "W";
              const isPlus = row.plusMinus > 0;
              const isMinus = row.plusMinus < 0;

              return (
                <tr
                  key={row.id || idx}
                  className="group hover:bg-blue-50/50 even:bg-slate-50/40 transition-colors"
                >
                  {/* STICKY Game Date Cell */}
                  <td className="sticky left-0 z-20 bg-white group-even:bg-slate-50/90 group-hover:bg-blue-50 py-3.5 px-4 whitespace-nowrap font-bold text-slate-900 border-r border-slate-300 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#053697] shrink-0" />
                      <span>{row.gameDate}</span>
                    </div>
                  </td>

                  {/* Matchup */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap font-semibold text-slate-800">
                    {row.matchup}
                  </td>

                  {/* W/L Badge */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold ${
                        isWin
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                      title={`${row.wl} ${row.score}`}
                    >
                      <span>{row.wl}</span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {row.score}
                      </span>
                    </span>
                  </td>

                  {/* MIN */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-right text-slate-600 border-r border-slate-200 font-semibold">
                    {row.min}
                  </td>

                  {/* PTS (Highlighted Column) */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap text-right font-black text-slate-950 text-sm bg-amber-50/30 group-hover:bg-amber-100/40">
                    {row.pts}
                  </td>

                  {/* FGM */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.fgm}
                  </td>

                  {/* FGA */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.fga}
                  </td>

                  {/* FG% */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-right font-bold text-slate-800 border-r border-slate-200">
                    {row.fgPct.toFixed(1)}%
                  </td>

                  {/* 3PM */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.threePm}
                  </td>

                  {/* 3PA */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.threePa}
                  </td>

                  {/* 3P% */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-right font-bold text-slate-800 border-r border-slate-200">
                    {row.threePct.toFixed(1)}%
                  </td>

                  {/* FTM */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.ftm}
                  </td>

                  {/* FTA */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.fta}
                  </td>

                  {/* FT% */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-right font-bold text-slate-800 border-r border-slate-200">
                    {row.ftPct.toFixed(1)}%
                  </td>

                  {/* OREB */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.oreb}
                  </td>

                  {/* DREB */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.dreb}
                  </td>

                  {/* REB */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-right font-black text-slate-900 border-r border-slate-200">
                    {row.reb}
                  </td>

                  {/* AST */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-right font-black text-slate-900">
                    {row.ast}
                  </td>

                  {/* STL */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.stl}
                  </td>

                  {/* BLK */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-right text-slate-600 border-r border-slate-200">
                    {row.blk}
                  </td>

                  {/* TOV */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.tov}
                  </td>

                  {/* PF */}
                  <td className="py-3.5 px-2.5 whitespace-nowrap text-right text-slate-600">
                    {row.pf}
                  </td>

                  {/* +/- */}
                  <td
                    className={`py-3.5 px-3.5 whitespace-nowrap text-right font-black ${
                      isPlus
                        ? "text-emerald-600"
                        : isMinus
                        ? "text-rose-600"
                        : "text-slate-400"
                    }`}
                  >
                    {isPlus ? `+${row.plusMinus}` : row.plusMinus}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer: Average Row with STICKY Date cell */}
          {summary && (
            <tfoot>
              <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-extrabold text-slate-900 text-xs">
                {/* STICKY Average Cell */}
                <td className="sticky left-0 z-20 bg-slate-100 py-3.5 px-4 whitespace-nowrap font-black uppercase text-slate-950 border-r border-slate-300 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)]">
                  <span className="text-[11px] tracking-wider">
                    AVG (Last 5)
                  </span>
                </td>

                <td className="py-3.5 px-3.5 whitespace-nowrap text-slate-400">
                  —
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap text-center">
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-slate-200/80 text-slate-800">
                    {summary.record}
                  </span>
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap text-right border-r border-slate-200">
                  {summary.min}
                </td>

                {/* PTS Average */}
                <td className="py-3.5 px-3.5 whitespace-nowrap text-right text-sm font-black text-slate-950 bg-amber-100/50">
                  {summary.pts}
                </td>

                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.fgm}
                </td>
                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.fga}
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap text-right border-r border-slate-200">
                  {summary.fgPct}%
                </td>

                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.threePm}
                </td>
                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.threePa}
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap text-right border-r border-slate-200">
                  {summary.threePct}%
                </td>

                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.ftm}
                </td>
                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.fta}
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap text-right border-r border-slate-200">
                  {summary.ftPct}%
                </td>

                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.oreb}
                </td>
                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.dreb}
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap text-right font-black border-r border-slate-200">
                  {summary.reb}
                </td>

                <td className="py-3.5 px-3 whitespace-nowrap text-right font-black">
                  {summary.ast}
                </td>
                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.stl}
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap text-right border-r border-slate-200">
                  {summary.blk}
                </td>

                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.tov}
                </td>
                <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                  {summary.pf}
                </td>
                <td className="py-3.5 px-3.5 whitespace-nowrap text-right text-emerald-700 font-black">
                  {summary.plusMinus}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default PlayerLastGamesTable;
