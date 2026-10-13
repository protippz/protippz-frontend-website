import React from "react";
import { get } from "@/ApisRequests/server";
import CategoryFilterHub, { CategoryItem } from "./Client/CategoryFilterHub";
import SearchAndSortComponent from "./SearchAndSortComponent";

const Rewards = async () => {
  const [data, meta] = await getCategory();

  return (
    <div className="flex flex-col h-full min-h-0">
      <SearchAndSortComponent />
      <div className="flex-1 min-h-0 flex flex-col">
        <CategoryFilterHub
          initialCategories={(data as CategoryItem[]) || []}
          initialMeta={meta}
        />
      </div>
    </div>
  );
};

export default Rewards;

const getCategory = async () => {
  try {
    const res = await get("/reward-category/get-all?limit=30&page=1");
    return [res?.data?.result, res?.data?.meta];
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [[], null];
  }
};
