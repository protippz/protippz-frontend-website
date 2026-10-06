"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";

const SearchAndSortComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("A to Z");
  const [search, setSearch] = useState("");

  // Sync initial state from current URL params
  useEffect(() => {
    const currentSort = searchParams?.get("sort") || "";
    const currentSearch = searchParams?.get("searchTerm") || "";

    setSearch(currentSearch);

    if (currentSort.startsWith("-")) {
      setOrder("Z to A");
      setSortBy(currentSort.replace("-", "") || "name");
    } else if (currentSort) {
      setOrder("A to Z");
      setSortBy(currentSort);
    } else {
      setSortBy("name");
      setOrder("A to Z");
    }
  }, [searchParams]);

  const updateUrlParams = (newSortBy: string, newOrder: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    const sortValue = newOrder === "Z to A" ? `-${newSortBy}` : newSortBy;
    currentParams.set("sort", sortValue);
    currentParams.set("page", "1");
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    updateUrlParams(newSortBy, order);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = e.target.value;
    setOrder(newOrder);
    updateUrlParams(sortBy, newOrder);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentParams = new URLSearchParams(window.location.search);
    const trimmed = search.trim();
    if (trimmed) {
      currentParams.set("searchTerm", trimmed);
    } else {
      currentParams.delete("searchTerm");
    }
    currentParams.set("page", "1");
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  const handleClearSearch = () => {
    setSearch("");
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete("searchTerm");
    currentParams.set("page", "1");
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full bg-white px-3 sm:px-4 py-2.5 sm:py-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
        {/* Left Side: Sort Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="flex items-center gap-1 text-[#053697] font-bold text-xs sm:text-sm shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2FC191]" />
            <span>Sort:</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
            {/* Sort Field Selector */}
            <div className="relative w-28 sm:w-32 md:w-36">
              <select
                value={sortBy}
                onChange={handleSortByChange}
                aria-label="Sort by field"
                className="w-full appearance-none bg-stone-50 hover:bg-white text-stone-800 text-xs sm:text-sm font-semibold rounded-lg border border-stone-200 hover:border-[#2FC191] focus:border-[#2FC191] focus:ring-1 focus:ring-[#2FC191] py-1.5 sm:py-2 pl-2.5 sm:pl-3 pr-7 outline-none transition-colors cursor-pointer"
              >
                <option value="name">Name</option>
                <option value="sport">Sports</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <ArrowUpDown className="w-3 h-3 text-stone-400" />
              </div>
            </div>

            {/* Sort Order Selector */}
            <div className="relative w-28 sm:w-32 md:w-36">
              <select
                value={order}
                onChange={handleOrderChange}
                aria-label="Sort order"
                className="w-full appearance-none bg-stone-50 hover:bg-white text-stone-800 text-xs sm:text-sm font-semibold rounded-lg border border-stone-200 hover:border-[#2FC191] focus:border-[#2FC191] focus:ring-1 focus:ring-[#2FC191] py-1.5 sm:py-2 pl-2.5 sm:pl-3 pr-7 outline-none transition-colors cursor-pointer"
              >
                <option value="A to Z">A to Z</option>
                <option value="Z to A">Z to A</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <ArrowUpDown className="w-3 h-3 text-stone-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 w-full md:w-auto min-w-0"
        >
          <div className="relative flex-1 md:w-48 lg:w-60 min-w-0">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team..."
              className="w-full bg-stone-50 hover:bg-white focus:bg-white text-stone-800 text-xs sm:text-sm font-medium rounded-lg border border-stone-200 hover:border-[#2FC191] focus:border-[#2FC191] focus:ring-1 focus:ring-[#2FC191] py-1.5 sm:py-2 pl-8 pr-7 outline-none transition-colors placeholder-stone-400"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#053697] hover:bg-[#042a78] text-white font-bold text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchAndSortComponent;
