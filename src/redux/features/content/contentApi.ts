import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse } from "@/types/api";
import type { Faq } from "@/types/models";

/** CMS-style content and misc. public forms. */
export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<ApiResponse<Faq[]>, void>({
      query: () => ({ url: "/manage/get-faq" }),
      providesTags: [{ type: "Content", id: "FAQ" }],
      keepUnusedDataFor: 300,
    }),
    contactUs: builder.mutation<ApiResponse<unknown>, Record<string, unknown>>({
      query: (body) => ({ url: "/contact-us", method: "POST", body }),
    }),
    inviteFriend: builder.mutation<ApiResponse<unknown>, Record<string, unknown>>({
      query: (body) => ({ url: "/invite/invite-friend", method: "POST", body }),
    }),
  }),
});

export const { useGetFaqsQuery, useContactUsMutation, useInviteFriendMutation } = contentApi;
