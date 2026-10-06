import React from "react";
import { get } from "@/ApisRequests/server";
import LeagueFilterHub, { LeagueItem } from "./Client/LeagueFilterHub";

const League = async () => {
  const [data, meta] = await getLeagues();

  return (
    <LeagueFilterHub
      initialLeagues={(data as LeagueItem[]) || []}
      initialMeta={meta}
    />
  );
};

export default League;

const getLeagues = async () => {
  try {
    const res = await get("/league/get-all?limit=20&page=1");
    return [res.data?.result, res.data?.meta];
  } catch (error) {
    console.error("Failed to load leagues:", error);
    return [[], null];
  }
};
