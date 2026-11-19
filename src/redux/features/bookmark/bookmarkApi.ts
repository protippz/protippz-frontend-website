import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type { Bookmark, Player, Team } from "@/types/models";

export type BookmarkType = "player" | "team";

const basePath = (type: BookmarkType) => (type === "team" ? "/team-bookmark" : "/player-bookmark");

export const bookmarkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyPlayerBookmarks: builder.query<PaginatedResponse<Bookmark<Player>>, PaginationParams | void>({
      query: (params) => ({ url: "/player-bookmark/my-bookmark", params: params ?? undefined }),
      providesTags: [{ type: "Bookmark", id: "player" }],
    }),
    getMyTeamBookmarks: builder.query<PaginatedResponse<Bookmark<Team>>, PaginationParams | void>({
      query: (params) => ({ url: "/team-bookmark/my-bookmark", params: params ?? undefined }),
      providesTags: [{ type: "Bookmark", id: "team" }],
    }),
    createBookmark: builder.mutation<
      ApiResponse<unknown>,
      { type: BookmarkType; body: Record<string, unknown> }
    >({
      query: ({ type, body }) => ({ url: `${basePath(type)}/create`, method: "POST", body }),
      invalidatesTags: (_r, _e, { type }) => [
        { type: "Bookmark", id: type },
        { type: type === "team" ? "Team" : "Player", id: "LIST" },
      ],
    }),
    deleteBookmark: builder.mutation<ApiResponse<unknown>, { type: BookmarkType; id: string }>({
      query: ({ type, id }) => ({
        url: `${basePath(type)}/delete/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { type }) => [
        { type: "Bookmark", id: type },
        { type: type === "team" ? "Team" : "Player", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMyPlayerBookmarksQuery,
  useGetMyTeamBookmarksQuery,
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
} = bookmarkApi;
