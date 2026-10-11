import React from "react";
import { get } from "@/ApisRequests/server";
import TeamFilterHub, { TeamItem } from "./Client/TeamFilterHub";
import SearchAndSortComponent from "./SearchAndSortComponent";

const Teams = async () => {
  const [data, meta] = await getTeam();

  return (
    <div className="flex flex-col h-full min-h-0">
      <SearchAndSortComponent />
      <div className="flex-1 min-h-0 flex flex-col">
        <TeamFilterHub
          initialTeams={(data as TeamItem[]) || []}
          initialMeta={meta}
        />
      </div>
    </div>
  );
};

export default Teams;

const getTeam = async () => {
  try {
    const res = await get("/team/get-all?limit=30&page=1");
    return [res.data?.result, res.data?.meta];
  } catch (error) {
    console.error("Failed to load teams:", error);
    return [[], null];
  }
};
