"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import TeamzCards from "@/components/Teamz/TeamzCards";
import { TeamInterface } from "@/app/(default)/teamz/page";
import { fetchMoreTeams } from "@/app/actions/teams";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(() => {
    const totalP = Number(initialMeta?.totalPage);
    if (!isNaN(totalP) && totalP > 0) return totalP > 1;
    return (initialData?.length || 0) >= limit;
  });

  // Synchronous lock refs to guarantee no duplicate or concurrent requests
  const isFetchingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(hasMore);
  const pageRef = useRef<number>(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Sync state ONLY when filter parameters change (search, sort, league)
  const prevFilterKey = useRef(
    `${searchTerm || ""}|${sort || ""}|${league || ""}`
  );
  useEffect(() => {
    const currentKey = `${searchTerm || ""}|${sort || ""}|${league || ""}`;
    if (prevFilterKey.current !== currentKey) {
      prevFilterKey.current = currentKey;
      setTeams(initialData);
      pageRef.current = 1;
      const totalP = Number(initialMeta?.totalPage);
      const canMore =
        !isNaN(totalP) && totalP > 0
          ? totalP > 1
          : (initialData?.length || 0) >= limit;
      setHasMore(canMore);
      hasMoreRef.current = canMore;
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [initialData, initialMeta, searchTerm, sort, league, limit]);

  const loadMore = useCallback(async () => {
    // Strictly block if already fetching or if all items are exhausted
    if (isFetchingRef.current || !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    const nextPage = pageRef.current + 1;

    try {
      // Use Next.js Server Action to avoid browser cross-origin CORS limitations
      const res = await fetchMoreTeams({
        searchTerm,
        sort,
        league,
        page: nextPage,
        limit,
      });

      if (!res.success) {
        console.error("fetchMoreTeams server action error:", res.error);
        setHasMore(false);
        hasMoreRef.current = false;
        return;
      }

      const newItems: TeamInterface[] = res.result || [];
      const meta = res.meta;
      const totalPage = Number(meta?.totalPage);

      if (!Array.isArray(newItems) || newItems.length === 0) {
        // No items returned: reached the end
        setHasMore(false);
        hasMoreRef.current = false;
        return;
      }

      // Append items, filtering out any existing IDs
      setTeams((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const uniqueNewItems = newItems.filter(
          (item: TeamInterface) => !existingIds.has(item._id)
        );

        if (uniqueNewItems.length === 0) {
          setHasMore(false);
          hasMoreRef.current = false;
          return prev;
        }

        return [...prev, ...uniqueNewItems];
      });

      pageRef.current = nextPage;

      // Determine if more pages exist
      let canLoadMore = false;
      if (!isNaN(totalPage) && totalPage > 0) {
        canLoadMore = nextPage < totalPage;
      } else {
        canLoadMore = newItems.length >= limit;
      }

      setHasMore(canLoadMore);
      hasMoreRef.current = canLoadMore;
    } catch (err) {
      console.error("Error loading more teams:", err);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [searchTerm, sort, league, limit]);

  // Robust IntersectionObserver: uses viewport (root: null) so both mobile page scroll
  // and desktop container scroll trigger seamlessly
  useEffect(() => {
    if (!hasMore) return;

    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !isFetchingRef.current
        ) {
          loadMore();
        }
      },
      {
        root: null, // Viewport root handles both mobile window scroll and desktop container scroll
        rootMargin: "350px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  if (!teams || teams.length === 0) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Teams Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          We couldn&apos;t find any teams matching your current filters. Try
          selecting another league or clearing your search.
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

      {/* Loading spinner: only shown while actively fetching next page */}
      {loading && (
        <div className="w-full py-8 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-[#053697]" />
          <span>Loading more teams...</span>
        </div>
      )}

      {/* Sentinel element: rendered in DOM ONLY if more items are available */}
      {hasMore && <div ref={sentinelRef} className="w-full h-8" />}

      {/* End of results message: only shown when completely exhausted */}
      {!hasMore && teams.length > 0 && (
        <div className="w-full py-8 text-center text-xs text-slate-400 font-medium">
          All {teams.length} teams loaded
        </div>
      )}
    </div>
  );
};

export default InfiniteTeamList;
