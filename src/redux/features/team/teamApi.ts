import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, ListParams, PaginatedResponse } from "@/types/api";
import type { League, Team } from "@/types/models";

export interface GetTeamsParams extends ListParams {
  league?: string;
}

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query<PaginatedResponse<Team>, GetTeamsParams | void>({
      query: (params) => ({ url: "/team/get-all", params: params ?? undefined }),
      providesTags: (result) => [
        { type: "Team", id: "LIST" },
        ...(result?.data?.result ?? []).map((t) => ({ type: "Team" as const, id: t._id })),
      ],
    }),
    getTeam: builder.query<ApiResponse<Team>, string>({
      query: (id) => ({ url: `/team/get-single/${encodeURIComponent(id)}` }),
      providesTags: (_result, _error, id) => [{ type: "Team", id }],
    }),
    getLeagues: builder.query<PaginatedResponse<League>, ListParams | void>({
      query: (params) => ({ url: "/league/get-all", params: params ?? undefined }),
      providesTags: [{ type: "League", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useLazyGetTeamsQuery,
  useGetTeamQuery,
  useLazyGetTeamQuery,
  useGetLeaguesQuery,
  useLazyGetLeaguesQuery,
} = teamApi;
