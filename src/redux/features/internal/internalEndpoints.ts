import { internalApi } from "@/redux/api/internalApi";
import type { TickerHeadline } from "@/app/api/sports-news-ticker/route";

export interface SportsNewsParams {
  limit?: number;
  category?: string;
  search?: string;
}

export interface SportsNewsResponse {
  success: boolean;
  headlines: TickerHeadline[];
  lastUpdated: string;
  count: number;
  limit?: number;
  fallback?: boolean;
}

export interface PlacePrediction {
  description: string;
  place_id: string;
  [key: string]: unknown;
}

export interface PlacesResponse {
  predictions?: PlacePrediction[];
  status?: string;
  error?: string;
}

/** Endpoints served by this Next.js app under `/api/*`. */
export const internalEndpoints = internalApi.injectEndpoints({
  endpoints: (builder) => ({
    getSportsNews: builder.query<SportsNewsResponse, SportsNewsParams | void>({
      query: (params) => ({ url: "/sports-news-ticker", params: params ?? undefined }),
      providesTags: ["SportsNews"],
      keepUnusedDataFor: 300,
    }),
    searchPlaces: builder.query<PlacesResponse, string>({
      query: (query) => ({ url: "/places", params: { query } }),
      providesTags: ["Places"],
    }),
  }),
});

export const {
  useGetSportsNewsQuery,
  useLazyGetSportsNewsQuery,
  useSearchPlacesQuery,
  useLazySearchPlacesQuery,
} = internalEndpoints;
