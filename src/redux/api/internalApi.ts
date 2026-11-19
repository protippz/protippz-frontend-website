import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * API slice for this Next.js app's own route handlers (`/api/*`).
 * Kept separate from `baseApi` because it has a different origin and must never
 * receive the user's backend auth token.
 */
export const internalApi = createApi({
  reducerPath: "internalApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["SportsNews", "Places"],
  endpoints: () => ({}),
});
