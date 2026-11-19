import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/api/config";
import { getAuthToken } from "@/lib/auth/token";

/**
 * Cache tags shared by every feature slice.
 * Feature APIs are added with `baseApi.injectEndpoints(...)` under `src/redux/features`.
 */
export const TAG_TYPES = [
  "Profile",
  "Player",
  "Team",
  "League",
  "Reward",
  "RewardCategory",
  "Tip",
  "Transaction",
  "Withdraw",
  "Notification",
  "Bookmark",
  "CommunityPost",
  "Comment",
  "PlayerGameStats",
  "TeamGameStats",
  "Content",
] as const;

export type TagType = (typeof TAG_TYPES)[number];

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Respect an explicit Authorization header set by an endpoint.
      if (!headers.has("authorization")) {
        const token = getAuthToken();
        if (token) headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: TAG_TYPES,
  // Avoid hammering the API when the same component remounts quickly.
  keepUnusedDataFor: 60,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
