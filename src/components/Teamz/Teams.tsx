import React from "react";
import { get } from "@/ApisRequests/server";
import LeagueFilterHub, { LeagueItem } from "./Client/LeagueFilterHub";
import SearchAndSortComponent from "./SearchAndSortComponent";

const League = async () => {
  const [data, meta] = await getLeagues();

  return (
    <div className="flex flex-col h-full min-h-0">
      <SearchAndSortComponent />
      <div className="flex-1 min-h-0 flex flex-col">
        <LeagueFilterHub
          initialLeagues={(data as LeagueItem[]) || []}
          initialMeta={meta}
        />
      </div>
    </div>
  );
};

export default League;

const getLeagues = async () => {
  try {
    const res = await get("/league/get-all?limit=30&page=1");
    return [res.data?.result, res.data?.meta];
  } catch (error) {
    console.error("Failed to load leagues:", error);
    return [[], null];
  }
};
