import { baseApi } from "@/redux/api/baseApi";
import type { User } from "@/provider/ContextProvider";
import type { ApiResponse, RequestBody } from "@/types/api";

/**
 * Profile endpoints for the logged-in account (fan, player or team).
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<ApiResponse<User>, void>({
      query: () => ({ url: "/user/get-my-profile" }),
      providesTags: ["Profile"],
    }),

    /** Fan / normal user profile (multipart). */
    updateUserProfile: builder.mutation<ApiResponse<User>, FormData>({
      query: (body) => ({ url: "/normal-user/update-profile", method: "PATCH", body }),
      invalidatesTags: ["Profile"],
    }),

    /** Athlete profile – JSON or multipart (when images change). */
    updatePlayerProfile: builder.mutation<ApiResponse<User>, RequestBody>({
      query: (body) => ({ url: "/player/profile", method: "PATCH", body }),
      invalidatesTags: ["Profile", "Player"],
    }),

    /** Team profile – JSON or multipart (when images change). */
    updateTeamProfile: builder.mutation<ApiResponse<User>, RequestBody>({
      query: (body) => ({ url: "/team/profile", method: "PATCH", body }),
      invalidatesTags: ["Profile", "Team"],
    }),

    /** Athlete address & tax information. */
    updatePlayerAddressTax: builder.mutation<ApiResponse<User>, Record<string, unknown>>({
      query: (body) => ({ url: "/player/edit-address-tax", method: "PATCH", body }),
      invalidatesTags: ["Profile"],
    }),

    addEmailAddress: builder.mutation<ApiResponse<unknown>, { email: string }>({
      query: (body) => ({ url: "/user/add-email-address", method: "POST", body }),
    }),

    verifyAddEmail: builder.mutation<ApiResponse<unknown>, Record<string, unknown>>({
      query: (body) => ({ url: "/user/verify-add-email", method: "POST", body }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateUserProfileMutation,
  useUpdatePlayerProfileMutation,
  useUpdateTeamProfileMutation,
  useUpdatePlayerAddressTaxMutation,
  useAddEmailAddressMutation,
  useVerifyAddEmailMutation,
} = userApi;
