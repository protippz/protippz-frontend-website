"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const SearchAndSortComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const currentSearch = searchParams?.get("searchTerm") || "";
    setSearch(currentSearch);
  }, [searchParams]);

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
    <div className="w-full bg-white border border-stone-200/90 rounded-xl p-3 sm:p-3.5 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3.5">
        {/* Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type here to search..."
              className="w-full bg-stone-50 hover:bg-white focus:bg-white text-stone-800 text-xs sm:text-sm font-medium rounded-lg border border-stone-200 hover:border-[#2FC191] focus:border-[#2FC191] focus:ring-1 focus:ring-[#2FC191] py-2 pl-8.5 pr-8 outline-none transition-colors placeholder-stone-400"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#053697] hover:bg-[#042a78] text-white font-bold text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
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
