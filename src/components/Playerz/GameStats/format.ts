import type { GameLogEntry } from "./types";

/** "41.7%" – or "—" when there were no attempts (0/0 is not 0%). */
export const formatPct = (pct: number, attempts: number): string =>
  attempts > 0 && Number.isFinite(pct) ? `${pct.toFixed(1)}%` : "—";

/** Made-attempted shooting line, e.g. "9-15". */
export const shootingLine = (made: number, attempts: number): string => `${made}-${attempts}`;

/** "+12", "-4", "0". */
export const formatSigned = (value: number): string => (value > 0 ? `+${value}` : `${value}`);

export const plusMinusTone = (value: number | string): string => {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  if (n > 0) return "text-emerald-600";
  if (n < 0) return "text-rose-600";
  return "text-slate-400";
};

/** Splits "vs Duke" / "@ Duke" into a location tag and opponent name. */
export const splitMatchup = (game: GameLogEntry): { tag: "vs" | "@"; opponent: string } => {
  const match = /^(vs\.?|@)\s*(.+)$/i.exec(game.matchup.trim());
  if (match) return { tag: match[1].startsWith("@") ? "@" : "vs", opponent: match[2] };
  return { tag: game.isHome === false ? "@" : "vs", opponent: game.matchup };
};

/** Id of the highest-scoring game (only meaningful with 2+ games). */
export const topScoringGameKey = (games: GameLogEntry[]): string | number | null => {
  if (games.length < 2) return null;
  let best = 0;
  games.forEach((g, i) => {
    if (g.pts > games[best].pts) best = i;
  });
  return games[best].pts > 0 ? gameKey(games[best], best) : null;
};

export const gameKey = (game: GameLogEntry, index: number): string | number =>
  game.id ?? `${game.gameDate}-${game.matchup}-${index}`;
