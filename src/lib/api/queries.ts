import "server-only";
import { cache } from "react";
import { serverFetch } from "./server";
import type { Paginated, PaginationMeta, QueryParams } from "@/types/api";
import type {
  Faq,
  League,
  ManagedContent,
  Player,
  Reward,
  RewardCategory,
  Team,
} from "@/types/models";
import type { CommunityPostBackendItem } from "@/types/community";

/**
 * Server-side data loaders used by React Server Components.
 *
 * Wrapped in React `cache()` so `generateMetadata` and the page component share
 * a single backend request per render.
 */

export interface ListResult<T> {
  result: T[];
  meta?: PaginationMeta;
}

const toList = <T>(data: Paginated<T> | null | undefined): ListResult<T> => ({
  result: Array.isArray(data?.result) ? data.result : [],
  meta: data?.meta,
});

// ---- Players ----------------------------------------------------------------

export const getPlayers = cache(async (params: QueryParams): Promise<ListResult<Player>> => {
  const res = await serverFetch<Paginated<Player>>("/player/get-all", { params });
  return toList(res.data);
});

export const getPlayerById = cache(async (id: string): Promise<Player | null> => {
  if (!id) return null;
  const res = await serverFetch<Player>(`/player/get-single/${encodeURIComponent(id)}`);
  return res.success && res.data ? res.data : null;
});

// ---- Teams / leagues ----------------------------------------------------------

export const getTeams = cache(async (params: QueryParams): Promise<ListResult<Team>> => {
  const res = await serverFetch<Paginated<Team>>("/team/get-all", { params });
  return toList(res.data);
});

export const getTeamById = cache(async (id: string): Promise<Team | null> => {
  if (!id) return null;
  const res = await serverFetch<Team>(`/team/get-single/${encodeURIComponent(id)}`);
  return res.success && res.data ? res.data : null;
});

export const getLeagues = cache(async (params: QueryParams): Promise<ListResult<League>> => {
  const res = await serverFetch<Paginated<League>>("/league/get-all", { params, auth: false });
  return toList(res.data);
});

// ---- Rewards --------------------------------------------------------------------

export const getRewards = cache(async (params: QueryParams): Promise<ListResult<Reward>> => {
  const res = await serverFetch<Paginated<Reward>>("/reward/get-all", { params });
  return toList(res.data);
});

export const getRewardCategories = cache(
  async (params: QueryParams): Promise<ListResult<RewardCategory>> => {
    const res = await serverFetch<Paginated<RewardCategory>>("/reward-category/get-all", {
      params,
      auth: false,
    });
    return toList(res.data);
  },
);

// ---- CMS content ------------------------------------------------------------------

export const getPrivacyPolicy = cache(async () =>
  serverFetch<ManagedContent>("/manage/get-privacy-policy", { auth: false, revalidate: 3600 }),
);

export const getFaqs = cache(async (): Promise<Faq[]> => {
  const res = await serverFetch<Faq[]>("/manage/get-faq", { auth: false, revalidate: 3600 });
  return Array.isArray(res.data) ? res.data : [];
});

export const getTermsConditions = cache(async () =>
  serverFetch<ManagedContent>("/manage/get-terms-conditions", { auth: false, revalidate: 3600 }),
);

// ---- Community ----------------------------------------------------------------------

export const getCommunityPost = cache(
  async (idOrSlug: string): Promise<CommunityPostBackendItem | null> => {
    if (!idOrSlug) return null;
    const res = await serverFetch<CommunityPostBackendItem | { result?: CommunityPostBackendItem }>(
      `/community-post/get-single/${encodeURIComponent(idOrSlug)}`,
      { auth: false, revalidate: 60 },
    );
    const data = res.data;
    if (!data) return null;
    // The backend has returned both `data` and `data.result` shapes historically.
    return "result" in data && data.result ? data.result : (data as CommunityPostBackendItem);
  },
);
