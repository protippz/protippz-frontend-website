import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, ListParams, PaginatedResponse } from "@/types/api";
import type { Player } from "@/types/models";

export interface GetPlayersParams extends ListParams {
  team?: string;
  league?: string;
}

export const playerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlayers: builder.query<PaginatedResponse<Player>, GetPlayersParams | void>({
      query: (params) => ({ url: "/player/get-all", params: params ?? undefined }),
      providesTags: (result) => [
        { type: "Player", id: "LIST" },
        ...(result?.data?.result ?? []).map((p) => ({ type: "Player" as const, id: p._id })),
      ],
    }),
    getPlayer: builder.query<ApiResponse<Player>, string>({
      query: (id) => ({ url: `/player/get-single/${encodeURIComponent(id)}` }),
      providesTags: (_result, _error, id) => [{ type: "Player", id }],
    }),
  }),
});

export const { useGetPlayersQuery, useLazyGetPlayersQuery, useGetPlayerQuery, useLazyGetPlayerQuery } =
  playerApi;
