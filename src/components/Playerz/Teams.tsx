import React from "react";
import { get } from "@/ApisRequests/server";
import TeamFilterHub, { TeamItem } from "./Client/TeamFilterHub";

const Teams = async () => {
  const [data, meta] = await getTeam();

  return (
    <TeamFilterHub
      initialTeams={(data as TeamItem[]) || []}
      initialMeta={meta}
    />
  );
};

export default Teams;

const getTeam = async () => {
  try {
    const res = await get("/team/get-all?limit=20&page=1");
    return [res.data?.result, res.data?.meta];
  } catch (error) {
    console.error("Failed to load teams:", error);
    return [[], null];
  }
};
