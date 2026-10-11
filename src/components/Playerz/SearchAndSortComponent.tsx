"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Check,
  RotateCcw,
} from "lucide-react";

const SearchAndSortComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("A to Z");
  const [search, setSearch] = useState("");
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state from current URL params
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

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (isMobileSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSheetOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileSheetOpen) {
        setIsMobileSheetOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileSheetOpen]);

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

  const handleMobileSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSearchSubmit();
    setIsMobileSheetOpen(false);
  };

  const handleClearSearch = () => {
    setSearch("");
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete("searchTerm");
    currentParams.set("page", "1");
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  const hasActiveSearch = Boolean(search && search.trim());
  const hasCustomSort = sortBy !== "name" || order !== "A to Z";
  const isFiltered = hasActiveSearch || hasCustomSort;

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP SIDEBAR VIEW (Visible only on lg screens and up) */}
      {/* ========================================================= */}
      <div className="hidden lg:block shrink-0 bg-white border-b border-slate-200 p-3 sm:p-4 space-y-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
            <Search className="w-3.5 h-3.5 text-[#053697]" />
            <span>Search &amp; Sort</span>
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

      {/* ========================================================= */}
      {/* 2. MOBILE BOTTOM FLOATING TRIGGER (Visible below lg screens) */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-[66px] sm:bottom-18 left-1/2 -translate-x-1/2 z-[100]">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#053697]/95 backdrop-blur-md border border-white/20 shadow-xl shadow-blue-950/30">
          <button
            type="button"
            onClick={() => setIsMobileSheetOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2FC191]" />
            <span>Search &amp; Sort</span>
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-[#2FC191]" />
            )}
          </button>

          {/* Quick Clear chip if a search query is active */}
          {hasActiveSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[11px] text-white font-medium transition-colors cursor-pointer"
              title="Clear search"
            >
              <span className="max-w-[70px] truncate">&ldquo;{search}&rdquo;</span>
              <X className="w-3 h-3 text-slate-300" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE SLIDE-UP BOTTOM SHEET DRAWER                   */}
      {/* ========================================================= */}
      {mounted &&
        isMobileSheetOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] lg:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setIsMobileSheetOpen(false)}
            />

            {/* Bottom Sheet Panel */}
            <div className="relative w-full bg-white rounded-t-3xl shadow-2xl p-5 z-10 animate-in slide-in-from-bottom duration-300 space-y-4 max-h-[85vh] overflow-y-auto">
              {/* Drag Handle */}
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

              {/* Sheet Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#053697]/10 text-[#053697] flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4 text-[#053697]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      Search &amp; Sort Athletes
                    </h3>
                    <p className="text-xs text-slate-500">
                      Filter players by name, position, or order
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Form inside Sheet */}
              <form
                onSubmit={handleMobileSearchSubmit}
                className="space-y-2 pt-1"
              >
                <label className="text-xs font-bold text-slate-700 block">
                  Athlete Name
                </label>
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search player name..."
                      autoFocus
                      className="w-full h-10 pl-9 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#053697] focus:ring-1 focus:ring-blue-100 outline-none"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-xl bg-[#053697] hover:bg-[#042870] text-white text-xs font-bold tracking-wide transition-colors shrink-0 cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Sort By Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Sort By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Name", value: "name" },
                    { label: "Position", value: "position" },
                  ].map((field) => {
                    const isSelected = sortBy === field.value;
                    return (
                      <button
                        key={field.value}
                        type="button"
                        onClick={() => {
                          setSortBy(field.value);
                          updateUrlParams(field.value, order);
                        }}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#053697] bg-blue-50/70 text-[#053697]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{field.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#053697]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Order Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Sort Order
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "A to Z (Ascending)", value: "A to Z" },
                    { label: "Z to A (Descending)", value: "Z to A" },
                  ].map((ord) => {
                    const isSelected = order === ord.value;
                    return (
                      <button
                        key={ord.value}
                        type="button"
                        onClick={() => {
                          setOrder(ord.value);
                          updateUrlParams(sortBy, ord.value);
                        }}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#053697] bg-blue-50/70 text-[#053697]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate">{ord.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#053697] shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleClearSearch();
                    setSortBy("name");
                    setOrder("A to Z");
                    updateUrlParams("name", "A to Z");
                  }}
                  disabled={!isFiltered}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMobileSheetOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#053697] hover:bg-[#042870] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SearchAndSortComponent;
