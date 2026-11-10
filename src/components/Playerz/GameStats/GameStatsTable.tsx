import React from "react";
import { GameLogEntry, GameStatsSummary } from "./types";

interface GameStatsTableProps {
  data: GameLogEntry[];
  summary: GameStatsSummary | null;
}

export const GameStatsTable: React.FC<GameStatsTableProps> = ({
  data,
  summary,
}) => {
  return (
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
            <th colSpan={3} className="py-1.5 px-3 border-r border-slate-200">
              Matchup Info
            </th>
            <th
              colSpan={5}
              className="py-1.5 px-3 border-r border-slate-200 bg-amber-50/50 text-amber-900"
            >
              Scoring & Field Goals
            </th>
            <th colSpan={3} className="py-1.5 px-3 border-r border-slate-200">
              3-Point Shooting
            </th>
            <th colSpan={3} className="py-1.5 px-3 border-r border-slate-200">
              Free Throws
            </th>
            <th colSpan={3} className="py-1.5 px-3 border-r border-slate-200">
              Rebounds
            </th>
            <th colSpan={3} className="py-1.5 px-3 border-r border-slate-200">
              Playmaking & Defense
            </th>
            <th colSpan={3} className="py-1.5 px-3">
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
                className="group hover:bg-blue-50/40 even:bg-slate-50/40 transition-colors"
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
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black ${
                      isWin
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                    title={`${row.wl} ${row.score}`}
                  >
                    <span>{row.wl}</span>
                    <span className="text-[10px] font-semibold text-slate-500 font-mono">
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
                <span className="text-[11px] tracking-wider">AVERAGE</span>
              </td>

              <td className="py-3.5 px-3.5 whitespace-nowrap text-slate-400">
                —
              </td>
              <td className="py-3.5 px-3 whitespace-nowrap text-center">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-200/90 text-slate-800 font-mono">
                  {summary.record}
                </span>
              </td>
              <td className="py-3.5 px-3 whitespace-nowrap text-right border-r border-slate-200 font-bold">
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
              <td className="py-3.5 px-3 whitespace-nowrap text-right border-r border-slate-200 font-bold">
                {summary.fgPct}%
              </td>

              <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                {summary.threePm}
              </td>
              <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                {summary.threePa}
              </td>
              <td className="py-3.5 px-3 whitespace-nowrap text-right border-r border-slate-200 font-bold">
                {summary.threePct}%
              </td>

              <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                {summary.ftm}
              </td>
              <td className="py-3.5 px-2.5 whitespace-nowrap text-right">
                {summary.fta}
              </td>
              <td className="py-3.5 px-3 whitespace-nowrap text-right border-r border-slate-200 font-bold">
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
  );
};

