import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, ListParams, PaginatedResponse } from "@/types/api";
import type { Reward, RewardCategory } from "@/types/models";

export interface GetRewardsParams extends ListParams {
  category?: string;
}

export interface RedeemRequestResult {
  _id?: string;
  [key: string]: unknown;
}

export const rewardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRewards: builder.query<PaginatedResponse<Reward>, GetRewardsParams | void>({
      query: (params) => ({ url: "/reward/get-all", params: params ?? undefined }),
      providesTags: [{ type: "Reward", id: "LIST" }],
    }),
    getRewardCategories: builder.query<PaginatedResponse<RewardCategory>, ListParams | void>({
      query: (params) => ({ url: "/reward-category/get-all", params: params ?? undefined }),
      providesTags: [{ type: "RewardCategory", id: "LIST" }],
    }),
    createRedeemRequest: builder.mutation<ApiResponse<RedeemRequestResult>, Record<string, unknown>>({
      query: (body) => ({ url: "/redeem-request/create", method: "POST", body }),
      invalidatesTags: ["Profile"],
    }),
    verifyRedeemEmail: builder.mutation<
      ApiResponse<unknown>,
      { redeemId: string; body: Record<string, unknown> }
    >({
      query: ({ redeemId, body }) => ({
        url: `/redeem-request/verify-redeem-email/${encodeURIComponent(redeemId)}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetRewardsQuery,
  useLazyGetRewardsQuery,
  useGetRewardCategoriesQuery,
  useLazyGetRewardCategoriesQuery,
  useCreateRedeemRequestMutation,
  useVerifyRedeemEmailMutation,
} = rewardApi;
