"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import TeamzCards from "@/components/Teamz/TeamzCards";
import { TeamInterface } from "@/app/(default)/teamz/page";
import { get } from "@/ApisRequests/server";
import { ShieldAlert, Loader2 } from "lucide-react";

interface InfiniteTeamListProps {
  initialData: TeamInterface[];
  initialMeta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  token?: string;
  searchTerm?: string;
  sort?: string;
  league?: string;
  limit?: number;
}

const InfiniteTeamList: React.FC<InfiniteTeamListProps> = ({
  initialData = [],
  initialMeta,
  token,
  searchTerm,
  sort,
  league,
  limit = 20,
}) => {
  const [teams, setTeams] = useState<TeamInterface[]>(initialData);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(
    initialMeta?.totalPage ? initialMeta.totalPage > 1 : false
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync state whenever server props (filters / initial data) change
  useEffect(() => {
    setTeams(initialData);
    setPage(1);
    setHasMore(initialMeta?.totalPage ? initialMeta.totalPage > 1 : false);
  }, [initialData, initialMeta, searchTerm, sort, league]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const param: Record<string, string | number | undefined> = {
        searchTerm,
        sort,
        league,
        page: nextPage,
        limit,
      };

      const paramsUrl = Object.entries(param)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await get(`/team/get-all?${paramsUrl}`, {
        headers: token ? { Authorization: `${token}` } : {},
      });

      const newItems = res.data?.result || [];
      const meta = res.data?.meta;

      if (Array.isArray(newItems) && newItems.length > 0) {
        setTeams((prev) => {
          // Exclude potential duplicates by _id
          const existingIds = new Set(prev.map((item) => item._id));
          const uniqueNewItems = newItems.filter(
            (item: TeamInterface) => !existingIds.has(item._id)
          );
          return [...prev, ...uniqueNewItems];
        });
        setPage(nextPage);

        if (meta?.totalPage) {
          setHasMore(nextPage < meta.totalPage);
        } else {
          setHasMore(newItems.length >= limit);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more teams:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, limit, searchTerm, sort, league, token]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const scrollContainer =
      sentinelRef.current?.closest(".overflow-y-auto") as HTMLElement | null;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { root: scrollContainer, threshold: 0, rootMargin: "400px 0px" }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    const handleScroll = () => {
      if (!scrollContainer || loading || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      if (scrollHeight - scrollTop - clientHeight < 600) {
        loadMore();
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, loading, loadMore]);

  if (!teams || teams.length === 0) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Teams Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          We couldn&apos;t find any teams matching your current filters. Try selecting another league or clearing your search.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 gap-4">
        {teams.map((item: TeamInterface) => (
          <TeamzCards token={token} item={item} key={item?._id} />
        ))}
      </div>

      {/* Loading more spinner */}
      {loading && (
        <div className="w-full py-8 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-[#053697]" />
          <span>Loading more teams...</span>
        </div>
      )}

      {/* Invisible Bottom Sentinel for seamless background loading */}
      <div ref={sentinelRef} className="w-full h-4" />
    </div>
  );
};

export default InfiniteTeamList;
