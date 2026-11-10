import { baseApi } from "../BaseUrl";

const gameStatsApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get all game stats for a specific player
    getPlayerGameStats: builder.query({
      query: ({
        playerId,
        page = 1,
        limit = 10,
        sort = "-gameDate",
        searchTerm,
        isHome,
        gameResult,
        fields,
      } = {}) => ({
        url: playerId
          ? `/player-game-stats/get-all/${playerId}`
          : `/player-game-stats/get-all`,
        params: {
          page,
          limit,
          sort,
          ...(searchTerm ? { searchTerm } : {}),
          ...(typeof isHome === "boolean" ? { isHome } : {}),
          ...(gameResult ? { gameResult } : {}),
          ...(fields ? { fields } : {}),
        },
      }),
      providesTags: (result, error, arg) => [
        { type: "playerGameStats", id: arg?.playerId || "LIST" },
      ],
    }),

    // 2. Get single player game stat
    getSinglePlayerGameStat: builder.query({
      query: (id) => ({
        url: `/player-game-stats/get-single/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "playerGameStats", id }],
    }),

    // 3. Create player game stat
    createPlayerGameStat: builder.mutation({
      query: (data) => ({
        url: `/player-game-stats/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "playerGameStats", id: "LIST" }],
    }),

    // 4. Update player game stat
    updatePlayerGameStat: builder.mutation({
      query: ({ id, data }) => ({
        url: `/player-game-stats/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "playerGameStats", id },
        { type: "playerGameStats", id: "LIST" },
      ],
    }),

    // 5. Delete player game stat
    deletePlayerGameStat: builder.mutation({
      query: (id) => ({
        url: `/player-game-stats/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "playerGameStats", id: "LIST" }],
    }),

    // 6. Get all game stats for a specific team
    getTeamGameStats: builder.query({
      query: ({
        teamId,
        page = 1,
        limit = 10,
        sort = "-gameDate",
        searchTerm,
        isHome,
        gameResult,
        fields,
      } = {}) => ({
        url: teamId
          ? `/team-game-stats/get-all/${teamId}`
          : `/team-game-stats/get-all`,
        params: {
          page,
          limit,
          sort,
          ...(searchTerm ? { searchTerm } : {}),
          ...(typeof isHome === "boolean" ? { isHome } : {}),
          ...(gameResult ? { gameResult } : {}),
          ...(fields ? { fields } : {}),
        },
      }),
      providesTags: (result, error, arg) => [
        { type: "teamGameStats", id: arg?.teamId || "LIST" },
      ],
    }),

    // 7. Get single team game stat
    getSingleTeamGameStat: builder.query({
      query: (id) => ({
        url: `/team-game-stats/get-single/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "teamGameStats", id }],
    }),

    // 8. Create team game stat
    createTeamGameStat: builder.mutation({
      query: (data) => ({
        url: `/team-game-stats/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "teamGameStats", id: "LIST" }],
    }),

    // 9. Update team game stat
    updateTeamGameStat: builder.mutation({
      query: ({ id, data }) => ({
        url: `/team-game-stats/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "teamGameStats", id },
        { type: "teamGameStats", id: "LIST" },
      ],
    }),

    // 10. Delete team game stat
    deleteTeamGameStat: builder.mutation({
      query: (id) => ({
        url: `/team-game-stats/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "teamGameStats", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPlayerGameStatsQuery,
  useGetSinglePlayerGameStatQuery,
  useCreatePlayerGameStatMutation,
  useUpdatePlayerGameStatMutation,
  useDeletePlayerGameStatMutation,
  useGetTeamGameStatsQuery,
  useGetSingleTeamGameStatQuery,
  useCreateTeamGameStatMutation,
  useUpdateTeamGameStatMutation,
  useDeleteTeamGameStatMutation,
} = gameStatsApis;

export default gameStatsApis;

