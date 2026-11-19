import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { GameLogEntry, GameStatsSummary } from "./types";
import {
  formatPct,
  formatSigned,
  gameKey,
  plusMinusTone,
  shootingLine,
  splitMatchup,
} from "./format";

interface Column {
  key: string;
  label: string;
  /** Full name – shown as a tooltip and read by screen readers. */
  title: string;
  cell: (g: GameLogEntry) => React.ReactNode;
  avg: (s: GameStatsSummary) => React.ReactNode;
  strong?: boolean;
  tone?: (g: GameLogEntry) => string;
  avgTone?: (s: GameStatsSummary) => string;
}

interface ColumnGroup {
  label: string;
  columns: Column[];
}

const GROUPS: ColumnGroup[] = [
  {
    label: "Shooting",
    columns: [
      { key: "fg", label: "FG", title: "Field goals made-attempted", cell: (g) => shootingLine(g.fgm, g.fga), avg: (s) => `${s.fgm}-${s.fga}` },
      { key: "fgPct", label: "FG%", title: "Field goal percentage", strong: true, cell: (g) => formatPct(g.fgPct, g.fga), avg: (s) => `${s.fgPct}%` },
      { key: "3p", label: "3P", title: "3-pointers made-attempted", cell: (g) => shootingLine(g.threePm, g.threePa), avg: (s) => `${s.threePm}-${s.threePa}` },
      { key: "3pPct", label: "3P%", title: "3-point percentage", strong: true, cell: (g) => formatPct(g.threePct, g.threePa), avg: (s) => `${s.threePct}%` },
      { key: "ft", label: "FT", title: "Free throws made-attempted", cell: (g) => shootingLine(g.ftm, g.fta), avg: (s) => `${s.ftm}-${s.fta}` },
      { key: "ftPct", label: "FT%", title: "Free throw percentage", strong: true, cell: (g) => formatPct(g.ftPct, g.fta), avg: (s) => `${s.ftPct}%` },
    ],
  },
  {
    label: "Rebounds",
    columns: [
      { key: "oreb", label: "OREB", title: "Offensive rebounds", cell: (g) => g.oreb, avg: (s) => s.oreb },
      { key: "dreb", label: "DREB", title: "Defensive rebounds", cell: (g) => g.dreb, avg: (s) => s.dreb },
      { key: "reb", label: "REB", title: "Total rebounds", strong: true, cell: (g) => g.reb, avg: (s) => s.reb },
    ],
  },
  {
    label: "Playmaking & Defense",
    columns: [
      { key: "ast", label: "AST", title: "Assists", strong: true, cell: (g) => g.ast, avg: (s) => s.ast },
      { key: "stl", label: "STL", title: "Steals", cell: (g) => g.stl, avg: (s) => s.stl },
      { key: "blk", label: "BLK", title: "Blocks", cell: (g) => g.blk, avg: (s) => s.blk },
    ],
  },
  {
    label: "Other",
    columns: [
      { key: "tov", label: "TOV", title: "Turnovers", cell: (g) => g.tov, avg: (s) => s.tov },
      { key: "pf", label: "PF", title: "Personal fouls", cell: (g) => g.pf, avg: (s) => s.pf },
      {
        key: "pm",
        label: "+/-",
        title: "Plus / minus",
        strong: true,
        cell: (g) => formatSigned(g.plusMinus),
        avg: (s) => s.plusMinus,
        tone: (g) => plusMinusTone(g.plusMinus),
        avgTone: (s) => plusMinusTone(s.plusMinus),
      },
    ],
  },
];

/** Every group starts with a hairline divider for scannability. */
const groupStart = "border-l border-slate-200/80";
const cellBase = "whitespace-nowrap px-3 py-3 text-right";

interface GameStatsTableProps {
  data: GameLogEntry[];
  summary: GameStatsSummary | null;
  topGameKey: string | number | null;
}

export const GameStatsTable: React.FC<GameStatsTableProps> = ({ data, summary, topGameKey }) => {
  return (
    <div className="relative">
      <div className="custom-sidebar-scrollbar w-full overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-[13px] tabular-nums">
          <caption className="sr-only">Per-game box scores</caption>
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <th
                rowSpan={2}
                scope="col"
                className="sticky left-0 z-20 min-w-[210px] border-b border-r border-slate-200/80 bg-white px-4 align-bottom pb-2.5 text-left text-[11px] tracking-wider text-slate-500"
              >
                Game
              </th>
              <th colSpan={3} className="px-3 pt-3 pb-1 text-center font-bold">
                Overview
              </th>
              {GROUPS.map((group) => (
                <th
                  key={group.label}
                  colSpan={group.columns.length}
                  scope="colgroup"
                  className={cn("px-3 pt-3 pb-1 text-center", groupStart)}
                >
                  {group.label}
                </th>
              ))}
            </tr>
            <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="px-3 pb-2.5 pt-1 text-center" title="Result and final score">
                Result
              </th>
              <th scope="col" className="px-3 pb-2.5 pt-1 text-right" title="Minutes played">
                MIN
              </th>
              <th scope="col" className="bg-[#053697]/4 px-3 pb-2.5 pt-1 text-right text-[#053697]" title="Points">
                PTS
              </th>
              {GROUPS.map((group) =>
                group.columns.map((col, i) => (
                  <th
                    key={col.key}
                    scope="col"
                    title={col.title}
                    className={cn("px-3 pb-2.5 pt-1 text-right", i === 0 && groupStart, col.strong && "text-slate-700")}
                  >
                    <abbr title={col.title} className="no-underline">
                      {col.label}
                    </abbr>
                  </th>
                )),
              )}
            </tr>
          </thead>

          <tbody className="text-slate-600">
            {data.map((row, idx) => {
              const key = gameKey(row, idx);
              const { tag, opponent } = splitMatchup(row);
              const isWin = row.wl === "W";
              const isTop = key === topGameKey;

              return (
                <tr key={key} className="group border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/80">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-slate-200/80 bg-white px-4 py-2.5 text-left font-normal transition-colors group-hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-black uppercase",
                          tag === "@" ? "bg-slate-100 text-slate-500" : "bg-[#053697]/8 text-[#053697]",
                        )}
                        title={tag === "@" ? "Away game" : "Home game"}
                      >
                        {tag}
                      </span>
                      <div className="min-w-0">
                        <div className="max-w-[150px] truncate text-[13px] font-bold text-slate-900" title={opponent}>
                          {opponent}
                        </div>
                        <div className="text-[11px] font-medium text-slate-400">{row.gameDate}</div>
                      </div>
                    </div>
                  </th>

                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-black",
                        isWin
                          ? "border-emerald-200/80 bg-emerald-50 text-emerald-700"
                          : "border-rose-200/80 bg-rose-50 text-rose-700",
                      )}
                    >
                      {row.wl}
                      <span className="font-semibold text-slate-500">{row.score}</span>
                    </span>
                  </td>
                  <td className={cellBase}>{row.min}</td>
                  <td className={cn(cellBase, "bg-[#053697]/4 text-[15px] font-black text-slate-900")}>
                    <span className="inline-flex items-center gap-1">
                      {isTop && <Flame className="h-3.5 w-3.5 text-amber-500" aria-label="Top scoring game" />}
                      {row.pts}
                    </span>
                  </td>

                  {GROUPS.map((group) =>
                    group.columns.map((col, i) => (
                      <td
                        key={col.key}
                        className={cn(
                          cellBase,
                          i === 0 && groupStart,
                          col.strong && "font-bold text-slate-900",
                          col.tone?.(row),
                        )}
                      >
                        {col.cell(row)}
                      </td>
                    )),
                  )}
                </tr>
              );
            })}
          </tbody>

          {summary && (
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50/90 font-bold text-slate-900">
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-r border-slate-200/80 bg-slate-50 px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500"
                >
                  Average
                </th>
                <td className="whitespace-nowrap px-3 py-3 text-center">
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-black text-slate-700">
                    {summary.record}
                  </span>
                </td>
                <td className={cellBase}>{summary.min}</td>
                <td className={cn(cellBase, "bg-[#053697]/6 text-[15px] font-black text-[#053697]")}>{summary.pts}</td>
                {GROUPS.map((group) =>
                  group.columns.map((col, i) => (
                    <td key={col.key} className={cn(cellBase, i === 0 && groupStart, col.avgTone?.(summary))}>
                      {col.avg(summary)}
                    </td>
                  )),
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {/* Right-edge fade hints there is more to scroll on narrower screens. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-white/90 to-transparent 2xl:hidden" />
    </div>
  );
};
