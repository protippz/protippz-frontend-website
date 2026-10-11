"use server";

import { get } from "@/ApisRequests/server";
import { cookies } from "next/headers";

interface FetchPlayersParams {
  searchTerm?: string;
  sort?: string;
  team?: string;
  page: number;
  limit?: number;
}

export async function fetchMorePlayers(params: FetchPlayersParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const paramObj: Record<string, string | number | undefined> = {
      searchTerm: params.searchTerm,
      sort: params.sort,
      team: params.team,
      page: params.page,
      limit: params.limit || 20,
    };

    const paramsUrl = Object.entries(paramObj)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const res = await get(`/player/get-all?${paramsUrl}`, {
      headers: token ? { Authorization: `${token}` } : {},
    });

    return {
      success: true,
      result: res.data?.result || [],
      meta: res.data?.meta || null,
    };
  } catch (error) {
    console.error("Error in fetchMorePlayers server action:", error);
    return {
      success: false,
      result: [],
      meta: null,
      error: String(error),
    };
  }
}
