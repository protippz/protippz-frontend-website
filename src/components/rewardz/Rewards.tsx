import { getRewardCategories } from "@/lib/api/queries";
import CategoryFilterHub, { type CategoryItem } from "./Client/CategoryFilterHub";
import SearchAndSortComponent from "./SearchAndSortComponent";

const Rewards = async () => {
  const { result, meta } = await getRewardCategories({ limit: 30, page: 1 });

  return (
    <div className="flex flex-col h-full min-h-0">
      <SearchAndSortComponent />
      <div className="flex-1 min-h-0 flex flex-col">
        <CategoryFilterHub initialCategories={result as CategoryItem[]} initialMeta={meta} />
      </div>
    </div>
  );
};

export default Rewards;
