import { getLeagues } from "@/lib/api/queries";
import LeagueFilterHub, { type LeagueItem } from "./Client/LeagueFilterHub";
import SearchAndSortComponent from "./SearchAndSortComponent";

const Leagues = async () => {
  const { result, meta } = await getLeagues({ limit: 30, page: 1 });

  return (
    <div className="flex flex-col h-full min-h-0">
      <SearchAndSortComponent />
      <div className="flex-1 min-h-0 flex flex-col">
        <LeagueFilterHub initialLeagues={result as LeagueItem[]} initialMeta={meta} />
      </div>
    </div>
  );
};

export default Leagues;
