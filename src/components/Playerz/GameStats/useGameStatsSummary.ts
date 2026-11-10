import { useMemo } from "react";
import { GameLogEntry, GameStatsSummary } from "./types";

export const useGameStatsSummary = (
  data: GameLogEntry[]
): GameStatsSummary | null => {
  return useMemo(() => {
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
      threePct:
        sum.threePa > 0 ? ((sum.threePm / sum.threePa) * 100).toFixed(1) : "0.0",
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
        (sum.plusMinus / len > 0 ? "+" : "") + (sum.plusMinus / len).toFixed(1),
    };
  }, [data]);
};

