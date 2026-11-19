import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type { Transaction, Withdraw } from "@/types/models";

export interface CreateDepositIntentRequest {
  amount: number;
  paymentBy: string;
}

export interface CreateWithdrawRequest {
  amount: number;
  withdrawOption?: string;
  [key: string]: unknown;
}

/**
 * Stripe-connect onboarding endpoints return a hosted onboarding URL, either as
 * a plain string or as `{ link }`. Use `getStripeLink()` to read it.
 */
export type StripeLinkResult = string | { link?: string; url?: string } | null;

export const getStripeLink = (data: StripeLinkResult | undefined): string | null => {
  if (!data) return null;
  if (typeof data === "string") return data;
  return data.link || data.url || null;
};

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---- Deposits -------------------------------------------------------
    createDepositIntent: builder.mutation<ApiResponse<unknown>, CreateDepositIntentRequest>({
      query: (body) => ({ url: "/deposit/create-deposit-intent", method: "POST", body }),
    }),

    // ---- Stripe Connect -------------------------------------------------
    connectStripe: builder.mutation<ApiResponse<StripeLinkResult>, Record<string, unknown> | void>({
      query: (body) => ({ url: "/stripe/connect-stripe", method: "POST", body: body ?? {} }),
      invalidatesTags: ["Profile"],
    }),
    updateConnectedAccount: builder.mutation<
      ApiResponse<StripeLinkResult>,
      Record<string, unknown> | void
    >({
      query: (body) => ({
        url: "/stripe/update-connected-account",
        method: "POST",
        body: body ?? {},
      }),
      invalidatesTags: ["Profile"],
    }),

    // ---- Withdrawals ----------------------------------------------------
    createWithdraw: builder.mutation<ApiResponse<unknown>, CreateWithdrawRequest>({
      query: (body) => ({ url: "/withdraw/create", method: "POST", body }),
      invalidatesTags: [
        { type: "Withdraw", id: "LIST" },
        { type: "Transaction", id: "LIST" },
        "Profile",
      ],
    }),
    getMyWithdraws: builder.query<PaginatedResponse<Withdraw>, PaginationParams | void>({
      query: (params) => ({ url: "/withdraw/my", params: params ?? undefined }),
      providesTags: [{ type: "Withdraw", id: "LIST" }],
    }),

    // ---- Transactions ---------------------------------------------------
    getMyTransactions: builder.query<PaginatedResponse<Transaction>, PaginationParams | void>({
      query: (params) => ({ url: "/transaction/my-transactions", params: params ?? undefined }),
      providesTags: [{ type: "Transaction", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateDepositIntentMutation,
  useConnectStripeMutation,
  useUpdateConnectedAccountMutation,
  useCreateWithdrawMutation,
  useGetMyWithdrawsQuery,
  useGetMyTransactionsQuery,
} = paymentApi;
