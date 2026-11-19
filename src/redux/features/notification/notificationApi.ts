import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type { AppNotification } from "@/types/models";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PaginatedResponse<AppNotification>, PaginationParams | void>({
      query: (params) => ({ url: "/notification/get-notifications", params: params ?? undefined }),
      providesTags: [{ type: "Notification", id: "LIST" }],
    }),
    markNotificationSeen: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/notification/see-notification/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: {},
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
    markAllNotificationsSeen: builder.mutation<ApiResponse<unknown>, void>({
      query: () => ({ url: "/notification/see-notifications", method: "PATCH", body: {} }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useMarkNotificationSeenMutation,
  useMarkAllNotificationsSeenMutation,
} = notificationApi;
