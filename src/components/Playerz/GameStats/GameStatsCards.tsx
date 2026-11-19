"use client";

import React, { useId, useState } from "react";
import { ChevronDown, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { GameLogEntry } from "./types";
import {
  formatPct,
  formatSigned,
  gameKey,
  plusMinusTone,
  shootingLine,
  splitMatchup,
} from "./format";

interface StatProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}

const DetailStat: React.FC<StatProps> = ({ label, value, sub, className }) => (
  <div className="min-w-0 rounded-xl border border-slate-200/70 bg-white px-2.5 py-2">
    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
    <div className={cn("text-sm font-black tabular-nums text-slate-900", className)}>{value}</div>
    {sub && <div className="text-[10.5px] font-medium tabular-nums text-slate-400">{sub}</div>}
  </div>
);

const GameCard: React.FC<{ game: GameLogEntry; isTop: boolean }> = ({ game, isTop }) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { tag, opponent } = splitMatchup(game);
  const isWin = game.wl === "W";

  return (
    <li className="rounded-[22px] border border-slate-200/80 bg-white">
      <div className="p-3.5">
        {/* Matchup + result */}
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black uppercase",
              tag === "@" ? "bg-slate-100 text-slate-500" : "bg-[#053697]/8 text-[#053697]",
            )}
            aria-label={tag === "@" ? "Away game" : "Home game"}
          >
            {tag}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-slate-900">{opponent}</div>
            <div className="text-[11px] font-medium text-slate-400">{game.gameDate}</div>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black tabular-nums",
              isWin
                ? "border-emerald-200/80 bg-emerald-50 text-emerald-700"
                : "border-rose-200/80 bg-rose-50 text-rose-700",
            )}
          >
            {game.wl}
            <span className="font-semibold text-slate-500">{game.score}</span>
          </span>
        </div>

        {/* Headline numbers */}
        <div className="mt-3 grid grid-cols-3 divide-x divide-slate-200/70 rounded-2xl border border-slate-200/70 bg-slate-50/70 py-2.5">
          {[
            { label: "PTS", value: game.pts, accent: true },
            { label: "REB", value: game.reb },
            { label: "AST", value: game.ast },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className={cn(
                  "flex items-center justify-center gap-1 text-[22px] font-black leading-none tabular-nums tracking-tight",
                  s.accent ? "text-[#053697]" : "text-slate-900",
                )}
              >
                {s.accent && isTop && <Flame className="h-4 w-4 text-amber-500" aria-label="Top scoring game" />}
                {s.value}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick line */}
        <dl className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] tabular-nums text-slate-500">
          <div className="flex gap-1">
            <dt className="font-semibold text-slate-400">MIN</dt>
            <dd className="font-bold text-slate-700">{game.min}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-semibold text-slate-400">FG</dt>
            <dd className="font-bold text-slate-700">{shootingLine(game.fgm, game.fga)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-semibold text-slate-400">3P</dt>
            <dd className="font-bold text-slate-700">{shootingLine(game.threePm, game.threePa)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-semibold text-slate-400">+/-</dt>
            <dd className={cn("font-bold", plusMinusTone(game.plusMinus))}>{formatSigned(game.plusMinus)}</dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 border-t border-slate-100 py-2.5 text-xs font-bold text-[#053697] transition-colors hover:bg-slate-50 active:bg-slate-100 rounded-b-[22px]"
      >
        {open ? "Hide box score" : "Full box score"}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-slate-100 bg-slate-50/60 p-3.5 rounded-b-[22px]">
            <section>
              <h4 className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Shooting</h4>
              <div className="grid grid-cols-3 gap-1.5">
                <DetailStat label="FG" value={formatPct(game.fgPct, game.fga)} sub={shootingLine(game.fgm, game.fga)} />
                <DetailStat label="3P" value={formatPct(game.threePct, game.threePa)} sub={shootingLine(game.threePm, game.threePa)} />
                <DetailStat label="FT" value={formatPct(game.ftPct, game.fta)} sub={shootingLine(game.ftm, game.fta)} />
              </div>
            </section>
            <section>
              <h4 className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rebounds</h4>
              <div className="grid grid-cols-3 gap-1.5">
                <DetailStat label="Off" value={game.oreb} />
                <DetailStat label="Def" value={game.dreb} />
                <DetailStat label="Total" value={game.reb} />
              </div>
            </section>
            <section>
              <h4 className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Defense & Other</h4>
              <div className="grid grid-cols-3 gap-1.5">
                <DetailStat label="STL" value={game.stl} />
                <DetailStat label="BLK" value={game.blk} />
                <DetailStat label="TOV" value={game.tov} />
                <DetailStat label="PF" value={game.pf} />
                <DetailStat label="MIN" value={game.min} />
                <DetailStat label="+/-" value={formatSigned(game.plusMinus)} className={plusMinusTone(game.plusMinus)} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </li>
  );
};

interface GameStatsCardsProps {
  data: GameLogEntry[];
  topGameKey: string | number | null;
}

export const GameStatsCards: React.FC<GameStatsCardsProps> = ({ data, topGameKey }) => (
  <ul className="space-y-2.5 bg-slate-50/40 p-3" aria-label="Per-game box scores">
    {data.map((game, idx) => {
      const key = gameKey(game, idx);
      return <GameCard key={key} game={game} isTop={key === topGameKey} />;
    })}
  </ul>
);
