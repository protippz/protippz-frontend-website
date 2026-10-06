"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback, useTransition } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { get, imageUrl } from "@/ApisRequests/server";
import ptLogo from "@/Assets/PT Logo.png";
import {
  Search,
  X,
  Shield,
  Layers,
  Check,
  ChevronRight,
  Filter,
  Loader2,
} from "lucide-react";

export interface TeamItem {
  _id: string;
  name: string;
  team_logo: string;
  sport?: string;
}

export interface TeamsMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

interface TeamFilterHubProps {
  initialTeams?: TeamItem[];
  initialMeta?: TeamsMeta | null;
}

const TeamLogoImage: React.FC<{
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}> = ({ src, alt, width = 32, height = 32, className = "object-contain max-h-full max-w-full" }) => {
  const [imgSrc, setImgSrc] = useState<any>(src ? imageUrl(src) : ptLogo);

  useEffect(() => {
    setImgSrc(src ? imageUrl(src) : ptLogo);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(ptLogo)}
    />
  );
};

const TeamFilterHub: React.FC<TeamFilterHubProps> = ({
  initialTeams = [],
  initialMeta,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTeamId = searchParams?.get("team") || "";

  const [isPending, startTransition] = useTransition();
  const [pendingTeamId, setPendingTeamId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Paginated & Search state for teams inside the modal
  const [teams, setTeams] = useState<TeamItem[]>(initialTeams);
  const [page, setPage] = useState<number>(initialMeta?.page || 1);
  const [hasMore, setHasMore] = useState<boolean>(
    initialMeta?.totalPage ? initialMeta.totalPage > 1 : false
  );
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(
    initialMeta?.total || initialTeams.length
  );

  // Sentinel for infinite scrolling inside the drawer modal
  const drawerObserverRef = useRef<IntersectionObserver | null>(null);
  const drawerSentinelRef = useRef<HTMLDivElement | null>(null);
  const modalBodyRef = useRef<HTMLDivElement | null>(null);

  // Clear pending team id when transition completes
  useEffect(() => {
    if (!isPending) {
      setPendingTeamId(null);
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
      const q = modalSearch.trim();

      if (!q) {
        // If search is cleared, reset to initial first page
        setIsSearching(true);
        try {
          const res = await get("/team/get-all?limit=20&page=1");
          const items = res.data?.result || [];
          const meta = res.data?.meta;
          setTeams(items);
          setPage(1);
          setHasMore(meta?.totalPage ? 1 < meta.totalPage : items.length >= 20);
          if (meta?.total !== undefined) setTotalCount(meta.total);
        } catch (error) {
          console.error("Error fetching teams:", error);
        } finally {
          setIsSearching(false);
        }
        return;
      }

      setIsSearching(true);
      try {
        const res = await get(
          `/team/get-all?searchTerm=${encodeURIComponent(q)}&limit=20&page=1`
        );
        const items = res.data?.result || [];
        const meta = res.data?.meta;
        setTeams(items);
        setPage(1);
        setHasMore(meta?.totalPage ? 1 < meta.totalPage : items.length >= 20);
        if (meta?.total !== undefined) setTotalCount(meta.total);
      } catch (error) {
        console.error("Error searching teams:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [modalSearch]);

  // Infinite scroll loader inside the side drawer modal
  const loadMoreTeams = useCallback(async () => {
    if (isLoadingMore || !hasMore || isSearching) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const q = modalSearch.trim();
    const searchParam = q ? `&searchTerm=${encodeURIComponent(q)}` : "";

    try {
      const res = await get(`/team/get-all?limit=20&page=${nextPage}${searchParam}`);
      const newItems: TeamItem[] = res.data?.result || [];
      const meta = res.data?.meta;

      if (Array.isArray(newItems) && newItems.length > 0) {
        setTeams((prev) => {
          const existingIds = new Set(prev.map((t) => t._id));
          const uniqueNewItems = newItems.filter((t) => !existingIds.has(t._id));
          return [...prev, ...uniqueNewItems];
        });
        setPage(nextPage);

        if (meta?.totalPage) {
          setHasMore(nextPage < meta.totalPage);
        } else {
          setHasMore(newItems.length >= 20);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more teams:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, isSearching, page, modalSearch]);

  // Setup IntersectionObserver for modal drawer scrolling
  useEffect(() => {
    if (!isModalOpen) return;

    if (drawerObserverRef.current) drawerObserverRef.current.disconnect();

    drawerObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isSearching) {
          loadMoreTeams();
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
  }, [isModalOpen, hasMore, isLoadingMore, isSearching, loadMoreTeams]);

  // Find active team object if selected
  const activeTeam = useMemo(() => {
    return teams.find((t) => t._id === activeTeamId);
  }, [teams, activeTeamId]);

  // Select team & trigger navigation with loader
  const handleSelectTeam = (teamId: string) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || "");

    if (activeTeamId === teamId) {
      currentParams.delete("team");
    } else {
      currentParams.set("team", teamId);
    }

    currentParams.set("page", "1");
    setPendingTeamId(teamId);

    startTransition(() => {
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    });

    setIsModalOpen(false);
  };

  const handleClearTeamFilter = () => {
    const currentParams = new URLSearchParams(searchParams?.toString() || "");
    currentParams.delete("team");
    currentParams.set("page", "1");
    setPendingTeamId("all");

    startTransition(() => {
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    });

    setIsModalOpen(false);
  };

  // Top quick teams pills (first 6 teams from initial list)
  const quickTeams = useMemo(() => teams.slice(0, 6), [teams]);

  return (
    <>
      {/* 1. Sleek Compact Team Filter Bar on the Page */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Filter Trigger Button & Active Team Tag */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#053697] hover:bg-[#053697]/90 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Filter className="w-3.5 h-3.5" />
              )}
              <span>Filter by Team</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                {totalCount}
              </span>
            </button>
          </div>

          {/* Right: Quick Team Pills (Desktop / Tablet view) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 sm:pt-0">
            <button
              type="button"
              onClick={handleClearTeamFilter}
              disabled={isPending}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors border ${
                !activeTeamId
                  ? "bg-[#053697] text-white border-[#053697]"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              All
            </button>

            {quickTeams.map((team) => {
              const isSelected = activeTeamId === team._id;
              const isThisTeamLoading = isPending && pendingTeamId === team._id;

              return (
                <button
                  key={team._id}
                  type="button"
                  onClick={() => handleSelectTeam(team._id)}
                  disabled={isPending}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors border ${
                    isSelected
                      ? "bg-[#053697] text-white border-[#053697]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                    {isThisTeamLoading ? (
                      <Loader2
                        className={`w-3.5 h-3.5 animate-spin ${
                          isSelected ? "text-white" : "text-[#053697]"
                        }`}
                      />
                    ) : (
                      <TeamLogoImage
                        src={team.team_logo}
                        alt={team.name}
                        width={16}
                        height={16}
                      />
                    )}
                  </div>
                  <span className="truncate max-w-[100px]">{team.name}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#053697] hover:bg-blue-50 shrink-0 transition-colors flex items-center gap-1"
            >
              <span>Explore all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Slide-Over Side Modal (Rendered via Portal to escape parent overflow/backdrop-filter constraints) */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end animate-in fade-in duration-200">
          {/* Backdrop Blur */}
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
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Select a Team
                  </h2>
                  <p className="text-xs text-slate-500">
                    Filter athletes by collegiate team ({totalCount} total)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Server-Side Search Bar inside Modal */}
            <div className="p-4 bg-slate-50/70">
              <div className="relative">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-[#053697] animate-spin absolute left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Search team by name..."
                  autoFocus
                  className="w-full h-10 pl-9 pr-8 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#053697] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                />
                {modalSearch && (
                  <button
                    type="button"
                    onClick={() => setModalSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Team List with Infinite Scroll */}
            <div
              ref={modalBodyRef}
              className="flex-1 overflow-y-auto p-4 sm:p-5"
            >
              {/* "All Teams" Option */}
              <button
                type="button"
                onClick={handleClearTeamFilter}
                className={`w-full p-3 mb-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  !activeTeamId
                    ? "border-2 border-[#053697] bg-blue-50/60 text-[#053697]"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Layers className="w-4.5 h-4.5 text-slate-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-bold">All Teams</p>
                    <p className="text-[11px] text-slate-500">
                      Show athletes from all teams
                    </p>
                  </div>
                </div>

                {!activeTeamId && (
                  <Check className="w-4 h-4 text-[#053697] shrink-0" />
                )}
              </button>

              {/* Grid of Teams */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {teams.map((team) => {
                  const isSelected = activeTeamId === team._id;
                  const isThisTeamLoading =
                    isPending && pendingTeamId === team._id;

                  return (
                    <button
                      key={team._id}
                      type="button"
                      onClick={() => handleSelectTeam(team._id)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer group ${
                        isSelected
                          ? "border-2 border-[#053697] bg-blue-50/60 text-[#053697]"
                          : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 p-1">
                          <TeamLogoImage
                            src={team.team_logo}
                            alt={team.name}
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate group-hover:text-[#053697] transition-colors">
                            {team.name}
                          </p>
                          {team.sport && (
                            <p className="text-[10px] text-slate-400 capitalize truncate">
                              {team.sport}
                            </p>
                          )}
                        </div>
                      </div>

                      {isThisTeamLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#053697] shrink-0 ml-2" />
                      ) : isSelected ? (
                        <Check className="w-4 h-4 text-[#053697] shrink-0 ml-2" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Empty Search Result */}
              {!isSearching && teams.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-500">
                  <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No teams found</p>
                  <p className="text-slate-400 mt-0.5">
                    No results for &ldquo;{modalSearch}&rdquo;
                  </p>
                </div>
              )}

              {/* Loading more teams spinner */}
              {isLoadingMore && (
                <div className="w-full py-4 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#053697]" />
                  <span>Loading more teams...</span>
                </div>
              )}

              {/* Scroll Sentinel */}
              <div ref={drawerSentinelRef} className="w-full h-4" />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClearTeamFilter}
                disabled={!activeTeamId || isPending}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Reset Filter
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#053697] hover:bg-[#053697]/90 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default TeamFilterHub;
