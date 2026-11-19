import { baseApi } from "@/redux/api/baseApi";
import type { PaginatedResponse } from "@/types/api";
import type { GameLogEntry } from "@/components/Playerz/GameStats/types";

export interface GameStatsParams {
  page?: number;
  limit?: number;
  sort?: string;
  searchTerm?: string;
  isHome?: boolean;
  gameResult?: string;
  fields?: string;
}

const toParams = ({
  page = 1,
  limit = 10,
  sort = "-gameDate",
  searchTerm,
  isHome,
  gameResult,
  fields,
}: GameStatsParams) => ({
  page,
  limit,
  sort,
  ...(searchTerm ? { searchTerm } : {}),
  ...(typeof isHome === "boolean" ? { isHome } : {}),
  ...(gameResult ? { gameResult } : {}),
  ...(fields ? { fields } : {}),
});

export const gameStatsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlayerGameStats: builder.query<
      PaginatedResponse<GameLogEntry>,
      GameStatsParams & { playerId?: string }
    >({
      query: ({ playerId, ...rest } = {}) => ({
        url: playerId
          ? `/player-game-stats/get-all/${encodeURIComponent(playerId)}`
          : "/player-game-stats/get-all",
        params: toParams(rest),
      }),
      providesTags: (_r, _e, arg) => [{ type: "PlayerGameStats", id: arg?.playerId || "LIST" }],
    }),
    getTeamGameStats: builder.query<
      PaginatedResponse<GameLogEntry>,
      GameStatsParams & { teamId?: string }
    >({
      query: ({ teamId, ...rest } = {}) => ({
        url: teamId
          ? `/team-game-stats/get-all/${encodeURIComponent(teamId)}`
          : "/team-game-stats/get-all",
        params: toParams(rest),
      }),
      providesTags: (_r, _e, arg) => [{ type: "TeamGameStats", id: arg?.teamId || "LIST" }],
    }),
  }),
});

export const { useGetPlayerGameStatsQuery, useGetTeamGameStatsQuery } = gameStatsApi;
