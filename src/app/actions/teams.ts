"use server";

import { get } from "@/ApisRequests/server";
import { cookies } from "next/headers";

interface FetchTeamsParams {
  searchTerm?: string;
  sort?: string;
  league?: string;
  page: number;
  limit?: number;
}

export async function fetchMoreTeams(params: FetchTeamsParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const paramObj: Record<string, string | number | undefined> = {
      searchTerm: params.searchTerm,
      sort: params.sort,
      league: params.league,
      page: params.page,
      limit: params.limit || 20,
    };

    const paramsUrl = Object.entries(paramObj)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const res = await get(`/team/get-all?${paramsUrl}`, {
      headers: token ? { Authorization: `${token}` } : {},
    });

    return {
      success: true,
      result: res.data?.result || [],
      meta: res.data?.meta || null,
    };
  } catch (error) {
    console.error("Error in fetchMoreTeams server action:", error);
    return {
      success: false,
      result: [],
      meta: null,
      error: String(error),
    };
  }
}
