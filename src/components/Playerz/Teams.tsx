import { getTeams } from "@/lib/api/queries";
import TeamFilterHub, { type TeamItem } from "./Client/TeamFilterHub";
import SearchAndSortComponent from "./SearchAndSortComponent";

const Teams = async () => {
  const { result, meta } = await getTeams({ limit: 30, page: 1 });

  return (
    <div className="flex flex-col h-full min-h-0">
      <SearchAndSortComponent />
      <div className="flex-1 min-h-0 flex flex-col">
        <TeamFilterHub initialTeams={result as TeamItem[]} initialMeta={meta} />
      </div>
    </div>
  );
};

export default Teams;
