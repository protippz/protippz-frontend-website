import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, QueryParams } from "@/types/api";
import type { CommunityPostBackendItem, MetaPagination } from "@/types/community";

export interface CommunityPostsData {
  meta?: MetaPagination;
  result: CommunityPostBackendItem[];
}

export const communityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCommunityPosts: builder.query<ApiResponse<CommunityPostsData>, QueryParams | void>({
      query: (params) => ({ url: "/community-post/get-all", params: params ?? undefined }),
      providesTags: [{ type: "CommunityPost", id: "LIST" }],
    }),
    getSingleCommunityPost: builder.query<ApiResponse<CommunityPostBackendItem>, string>({
      query: (idOrSlug) => ({
        url: `/community-post/get-single/${encodeURIComponent(idOrSlug)}`,
      }),
      providesTags: (_r, _e, idOrSlug) => [{ type: "CommunityPost", id: idOrSlug }],
    }),
    likeCommunityPost: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/community-post/like/${encodeURIComponent(id)}`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "CommunityPost", id: "LIST" },
        { type: "CommunityPost", id },
      ],
    }),
  }),
});

export const {
  useGetAllCommunityPostsQuery,
  useLazyGetAllCommunityPostsQuery,
  useGetSingleCommunityPostQuery,
  useLazyGetSingleCommunityPostQuery,
  useLikeCommunityPostMutation,
} = communityApi;
