"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useTransition,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { get, imageUrl } from "@/ApisRequests/server";
import defaultCategory from "@/Assets/category.png";
import {
  Search,
  X,
  Gift,
  Layers,
  Check,
  ChevronRight,
  Filter,
  Loader2,
  RotateCcw,
  Mail,
  Package,
} from "lucide-react";

export interface CategoryItem {
  _id: string;
  name: string;
  image?: string;
  deliveryOption?: string;
}

export interface CategoriesMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

interface CategoryFilterHubProps {
  initialCategories?: CategoryItem[];
  initialMeta?: CategoriesMeta | null;
}

const CategoryLogoImage: React.FC<{
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}> = ({
  src,
  alt,
  width = 32,
  height = 32,
  className = "object-contain max-h-full max-w-full",
}) => {
  const [imgSrc, setImgSrc] = useState<any>(
    src ? imageUrl(src) : defaultCategory
  );

  useEffect(() => {
    setImgSrc(src ? imageUrl(src) : defaultCategory);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(defaultCategory)}
    />
  );
};

const CategoryFilterHub: React.FC<CategoryFilterHubProps> = ({
  initialCategories = [],
  initialMeta,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams?.get("category") || "";

  const [isPending, startTransition] = useTransition();
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Paginated & Search state for categories
  const [categories, setCategories] =
    useState<CategoryItem[]>(initialCategories);
  const [page, setPage] = useState<number>(initialMeta?.page || 1);
  const [hasMore, setHasMore] = useState<boolean>(
    initialMeta?.totalPage ? initialMeta.totalPage > 1 : false
  );
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(
    initialMeta?.total || initialCategories.length
  );

  // Sentinel refs for infinite scrolling in sidebar and modal
  const sidebarObserverRef = useRef<IntersectionObserver | null>(null);
  const sidebarSentinelRef = useRef<HTMLDivElement | null>(null);
  const sidebarContainerRef = useRef<HTMLDivElement | null>(null);

  const drawerObserverRef = useRef<IntersectionObserver | null>(null);
  const drawerSentinelRef = useRef<HTMLDivElement | null>(null);
  const modalBodyRef = useRef<HTMLDivElement | null>(null);

  // Clear pending category id when transition completes
  useEffect(() => {
    if (!isPending) {
      setPendingCategoryId(null);
    }
  }, [isPending]);

  // Lock body scroll when side modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Handle live server-side search with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      const q = searchQuery.trim();

      if (!q) {
        setIsSearching(true);
        try {
          const res = await get("/reward-category/get-all?limit=30&page=1");
          const items = res.data?.result || [];
          const meta = res.data?.meta;
          setCategories(items);
          setPage(1);
          setHasMore(
            meta?.totalPage ? 1 < meta.totalPage : items.length >= 30
          );
          if (meta?.total !== undefined) setTotalCount(meta.total);
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          setIsSearching(false);
        }
        return;
      }

      setIsSearching(true);
      try {
        const res = await get(
          `/reward-category/get-all?searchTerm=${encodeURIComponent(
            q
          )}&limit=30&page=1`
        );
        const items = res.data?.result || [];
        const meta = res.data?.meta;
        setCategories(items);
        setPage(1);
        setHasMore(
          meta?.totalPage ? 1 < meta.totalPage : items.length >= 30
        );
        if (meta?.total !== undefined) setTotalCount(meta.total);
      } catch (error) {
        console.error("Error searching categories:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Infinite scroll loader
  const loadMoreCategories = useCallback(async () => {
    if (isLoadingMore || !hasMore || isSearching) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const q = searchQuery.trim();
    const searchParam = q ? `&searchTerm=${encodeURIComponent(q)}` : "";

    try {
      const res = await get(
        `/reward-category/get-all?limit=30&page=${nextPage}${searchParam}`
      );
      const newItems: CategoryItem[] = res.data?.result || [];
      const meta = res.data?.meta;

      if (Array.isArray(newItems) && newItems.length > 0) {
        setCategories((prev) => {
          const existingIds = new Set(prev.map((c) => c._id));
          const uniqueNewItems = newItems.filter(
            (c) => !existingIds.has(c._id)
          );
          return [...prev, ...uniqueNewItems];
        });
        setPage(nextPage);

        if (meta?.totalPage) {
          setHasMore(nextPage < meta.totalPage);
        } else {
          setHasMore(newItems.length >= 30);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more categories:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, isSearching, page, searchQuery]);

  // Observer for desktop sidebar scroll
  useEffect(() => {
    if (sidebarObserverRef.current) sidebarObserverRef.current.disconnect();

    sidebarObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isSearching
        ) {
          loadMoreCategories();
        }
      },
      {
        root: sidebarContainerRef.current,
        threshold: 0,
        rootMargin: "150px 0px",
      }
    );

    if (sidebarSentinelRef.current) {
      sidebarObserverRef.current.observe(sidebarSentinelRef.current);
    }

    return () => {
      if (sidebarObserverRef.current) sidebarObserverRef.current.disconnect();
    };
  }, [hasMore, isLoadingMore, isSearching, loadMoreCategories]);

  // Observer for mobile modal drawer
  useEffect(() => {
    if (!isModalOpen) return;

    if (drawerObserverRef.current) drawerObserverRef.current.disconnect();

    drawerObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isSearching
        ) {
          loadMoreCategories();
        }
      },
      {
        root: modalBodyRef.current,
        threshold: 0,
        rootMargin: "200px 0px",
      }
    );

    if (drawerSentinelRef.current) {
      drawerObserverRef.current.observe(drawerSentinelRef.current);
    }

    return () => {
      if (drawerObserverRef.current) drawerObserverRef.current.disconnect();
    };
  }, [isModalOpen, hasMore, isLoadingMore, isSearching, loadMoreCategories]);

  // Find active category
  const activeCategory = useMemo(() => {
    return categories.find((c) => c._id === activeCategoryId);
  }, [categories, activeCategoryId]);

  // Select category
  const handleSelectCategory = (categoryId: string) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || "");

    if (activeCategoryId === categoryId) {
      currentParams.delete("category");
    } else {
      currentParams.set("category", categoryId);
    }

    currentParams.set("page", "1");
    setPendingCategoryId(categoryId);

    startTransition(() => {
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    });

    setIsModalOpen(false);
  };

  const handleClearCategoryFilter = () => {
    const currentParams = new URLSearchParams(searchParams?.toString() || "");
    currentParams.delete("category");
    currentParams.set("page", "1");
    setPendingCategoryId("all");

    startTransition(() => {
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    });

    setIsModalOpen(false);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP ASIDE SIDEBAR (Visible on lg screens and up)   */}
      {/* ========================================================= */}
      <div className="hidden lg:flex flex-col bg-white h-full overflow-hidden">
        {/* Sidebar Header */}
        <div className="shrink-0 p-4 sm:p-4.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#053697] flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 text-[#053697]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Filter by Category
              </h2>
            </div>
          </div>

          {activeCategoryId ? (
            <button
              type="button"
              onClick={handleClearCategoryFilter}
              disabled={isPending}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-[#053697] hover:bg-blue-50 border border-blue-200/60 transition-colors cursor-pointer shrink-0"
              title="Clear category filter"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
              {totalCount}
            </span>
          )}
        </div>

        {/* Active Filter Pill Summary (if filtered) */}
        {activeCategory && (
          <div className="shrink-0 px-3 py-2 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs text-[#053697]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
                Active:
              </span>
              <span className="font-bold truncate">{activeCategory.name}</span>
            </div>
            <button
              type="button"
              onClick={handleClearCategoryFilter}
              className="p-1 hover:bg-blue-100 rounded text-[#053697] transition-colors cursor-pointer"
              title="Remove filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Category List */}
        <div
          ref={sidebarContainerRef}
          className="p-2 space-y-1 overflow-y-auto flex-1 min-h-0 custom-sidebar-scrollbar"
        >
          {/* "All Categories" Option */}
          <button
            type="button"
            onClick={handleClearCategoryFilter}
            disabled={isPending}
            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              !activeCategoryId
                ? "bg-[#053697] text-white border-[#053697] shadow-xs"
                : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  !activeCategoryId
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate leading-tight">
                  All Categories
                </p>
                <p
                  className={`text-[10px] truncate leading-tight mt-0.5 ${
                    !activeCategoryId ? "text-white/80" : "text-slate-400"
                  }`}
                >
                  View all rewards
                </p>
              </div>
            </div>

            {!activeCategoryId && (
              <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />
            )}
          </button>

          {/* Individual Category Rows */}
          {categories.map((catItem) => {
            const isSelected = activeCategoryId === catItem._id;
            const isThisCatLoading =
              isPending && pendingCategoryId === catItem._id;

            return (
              <button
                key={catItem._id}
                type="button"
                onClick={() => handleSelectCategory(catItem._id)}
                disabled={isPending}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                  isSelected
                    ? "bg-[#053697] text-white border-[#053697] shadow-xs"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`relative w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 p-1 ${
                      isSelected
                        ? "bg-white border-white/30"
                        : "bg-slate-50 border-slate-200 group-hover:bg-white"
                    }`}
                  >
                    <CategoryLogoImage
                      src={catItem.image}
                      alt={catItem.name}
                      width={22}
                      height={22}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold truncate leading-tight ${
                        isSelected
                          ? "text-white"
                          : "text-slate-800 group-hover:text-[#053697]"
                      }`}
                    >
                      {catItem.name}
                    </p>
                    {catItem.deliveryOption && (
                      <p
                        className={`text-[10px] uppercase tracking-wider truncate leading-tight mt-0.5 ${
                          isSelected ? "text-white/80" : "text-slate-400"
                        }`}
                      >
                        {catItem.deliveryOption}
                      </p>
                    )}
                  </div>
                </div>

                <div className="ml-2 shrink-0 flex items-center">
                  {isThisCatLoading ? (
                    <Loader2
                      className={`w-3.5 h-3.5 animate-spin ${
                        isSelected ? "text-white" : "text-[#053697]"
                      }`}
                    />
                  ) : isSelected ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  )}
                </div>
              </button>
            );
          })}

          {/* Empty Search Result */}
          {!isSearching && categories.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              <Gift className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-700">No categories found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No results for &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          )}

          {/* Loading more categories spinner */}
          {isLoadingMore && (
            <div className="w-full py-3 flex items-center justify-center gap-1.5 text-slate-500 text-[11px] font-semibold">
              <Loader2 className="w-3 h-3 animate-spin text-[#053697]" />
              <span>Loading more...</span>
            </div>
          )}

          {/* Sidebar Scroll Sentinel */}
          <div ref={sidebarSentinelRef} className="w-full h-2" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MOBILE & TABLET FILTER BAR (Visible below lg screens) */}
      {/* ========================================================= */}
      <div className="lg:hidden w-full bg-white px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2.5">
          {/* Main Filter by Category Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-white" />
            ) : (
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2FC191]" />
            )}
            <span>Filter by Category</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] sm:text-[11px] font-extrabold">
              {totalCount}
            </span>
          </button>

          {/* Active Category Indicator Chip or Browse Trigger */}
          {activeCategory ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#053697] text-xs font-bold truncate max-w-[180px] sm:max-w-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 hidden sm:inline">
                Active:
              </span>
              <span className="truncate">{activeCategory.name}</span>
              <button
                type="button"
                onClick={handleClearCategoryFilter}
                className="p-0.5 hover:bg-blue-100 rounded text-slate-400 hover:text-[#053697] transition-colors ml-0.5 cursor-pointer"
                title="Clear category filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold text-slate-500 hover:text-[#053697] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">
                Browse {totalCount} categories
              </span>
              <span className="sm:hidden text-[11px]">All categories</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE SLIDE-OVER DRAWER MODAL                         */}
      {/* ========================================================= */}
      {mounted &&
        isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Side Drawer Panel */}
            <div className="relative w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 divide-y divide-slate-200">
              {/* Modal Header */}
              <div className="p-5 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#053697] flex items-center justify-center">
                    <Gift className="w-4 h-4 text-[#053697]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Select a Category
                    </h2>
                    <p className="text-xs text-slate-500">
                      Filter rewards by category ({totalCount} total)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category List with Infinite Scroll */}
              <div
                ref={modalBodyRef}
                className="flex-1 overflow-y-auto p-4 sm:p-5"
              >
                {/* "All Categories" Option */}
                <button
                  type="button"
                  onClick={handleClearCategoryFilter}
                  className={`w-full p-3 mb-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    !activeCategoryId
                      ? "border-2 border-[#053697] bg-blue-50/60 text-[#053697]"
                      : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Layers className="w-4.5 h-4.5 text-slate-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-bold">
                        All Categories
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Show rewards from all categories
                      </p>
                    </div>
                  </div>

                  {!activeCategoryId && (
                    <Check className="w-4 h-4 text-[#053697] shrink-0" />
                  )}
                </button>

                {/* Grid of Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {categories.map((catItem) => {
                    const isSelected = activeCategoryId === catItem._id;
                    const isThisCatLoading =
                      isPending && pendingCategoryId === catItem._id;

                    return (
                      <button
                        key={catItem._id}
                        type="button"
                        onClick={() => handleSelectCategory(catItem._id)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer group ${
                          isSelected
                            ? "border-2 border-[#053697] bg-blue-50/60 text-[#053697]"
                            : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 p-1">
                            <CategoryLogoImage
                              src={catItem.image}
                              alt={catItem.name}
                              width={32}
                              height={32}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate group-hover:text-[#053697] transition-colors">
                              {catItem.name}
                            </p>
                            {catItem.deliveryOption && (
                              <p className="text-[10px] text-slate-400 capitalize truncate">
                                {catItem.deliveryOption}
                              </p>
                            )}
                          </div>
                        </div>

                        {isThisCatLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#053697] shrink-0 ml-2" />
                        ) : isSelected ? (
                          <Check className="w-4 h-4 text-[#053697] shrink-0 ml-2" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 ml-2 transition-colors" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Loading indicator */}
                {isLoadingMore && (
                  <div className="w-full py-4 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin text-[#053697]" />
                    <span>Loading more categories...</span>
                  </div>
                )}

                {/* Drawer sentinel */}
                <div ref={drawerSentinelRef} className="w-full h-4" />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleClearCategoryFilter}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#053697] hover:bg-[#042870] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
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

export default CategoryFilterHub;
