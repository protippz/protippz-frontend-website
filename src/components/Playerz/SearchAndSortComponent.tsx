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
    <div className="shrink-0 bg-white border-b border-slate-200 p-3 sm:p-4 space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#053697]/10 text-[#053697] flex items-center justify-center shrink-0">
            <Search className="w-3.5 h-3.5 text-[#053697]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              Search &amp; Sort
            </h3>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">
              Find and filter athletes
            </p>
          </div>
        </div>

        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-[11px] font-semibold text-[#053697] hover:underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center gap-1.5 w-full"
      >
        <div className="relative flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player..."
            className="w-full h-9 pl-8 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#053697] focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="h-9 px-3 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline lg:hidden xl:inline">Search</span>
        </button>
      </form>

      {/* Sort Controls */}
      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center gap-1 text-[#053697] font-bold text-[11px]">
          <SlidersHorizontal className="w-3 h-3 text-[#2FC191]" />
          <span>Sort Athletes</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Sort Field Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={handleSortByChange}
              aria-label="Sort by field"
              className="w-full appearance-none bg-slate-50 hover:bg-white text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 hover:border-[#2FC191] focus:border-[#2FC191] focus:ring-1 focus:ring-[#2FC191] py-1.5 pl-2.5 pr-6 outline-none transition-colors cursor-pointer truncate"
            >
              <option value="name">Name</option>
              <option value="position">Position</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3 h-3" />
            </div>
          </div>

          {/* Sort Order Selector */}
          <div className="relative">
            <select
              value={order}
              onChange={handleOrderChange}
              aria-label="Sort order"
              className="w-full appearance-none bg-slate-50 hover:bg-white text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 hover:border-[#2FC191] focus:border-[#2FC191] focus:ring-1 focus:ring-[#2FC191] py-1.5 pl-2.5 pr-6 outline-none transition-colors cursor-pointer truncate"
            >
              <option value="A to Z">A to Z</option>
              <option value="Z to A">Z to A</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndSortComponent;
