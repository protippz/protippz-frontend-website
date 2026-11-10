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

export interface GameStatsSummary {
  record: string;
  winPct: string;
  avgPts: string;
  avgReb: string;
  avgAst: string;
  min: string;
  pts: string;
  fgm: string;
  fga: string;
  fgPct: string;
  threePm: string;
  threePa: string;
  threePct: string;
  ftm: string;
  fta: string;
  ftPct: string;
  oreb: string;
  dreb: string;
  reb: string;
  ast: string;
  stl: string;
  blk: string;
  tov: string;
  pf: string;
  plusMinus: string;
}

export type FilterMode = "ALL" | "HOME" | "AWAY";

export interface PlayerLastGamesTableProps {
  playerId?: string;
  games?: GameLogEntry[];
  teamName?: string;
  position?: string;
  accentColor?: string;
}

