import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type { Tip } from "@/types/models";

export interface CreateTipRequest {
  entityId: string;
  entityType: "Player" | "Team" | string;
  amount: number;
  [key: string]: unknown;
}

export const tipApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTip: builder.mutation<ApiResponse<unknown>, CreateTipRequest>({
      query: (body) => ({ url: "/tip/create", method: "POST", body }),
      invalidatesTags: [
        { type: "Tip", id: "LIST" },
        { type: "Transaction", id: "LIST" },
        "Profile",
        "Player",
        "Team",
      ],
    }),
    getMyTips: builder.query<PaginatedResponse<Tip>, PaginationParams | void>({
      query: (params) => ({ url: "/tip/my-tips", params: params ?? undefined }),
      providesTags: [{ type: "Tip", id: "LIST" }],
    }),
  }),
});

export const { useCreateTipMutation, useGetMyTipsQuery } = tipApi;
