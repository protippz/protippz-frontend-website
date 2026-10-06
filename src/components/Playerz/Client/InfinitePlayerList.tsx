"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import PlayerzCards from "@/components/Playerz/PlayerzCards";
import { Player } from "@/app/(default)/playerz/page";
import { get } from "@/ApisRequests/server";
import { UserX, Loader2 } from "lucide-react";

interface InfinitePlayerListProps {
  initialData: Player[];
  initialMeta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  token?: string;
  searchTerm?: string;
  sort?: string;
  team?: string;
  limit?: number;
}

const InfinitePlayerList: React.FC<InfinitePlayerListProps> = ({
  initialData = [],
  initialMeta,
  token,
  searchTerm,
  sort,
  team,
  limit = 20,
}) => {
  const [players, setPlayers] = useState<Player[]>(initialData);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(
    initialMeta?.totalPage ? initialMeta.totalPage > 1 : false,
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync state whenever server props (filters / initial data) change
  useEffect(() => {
    setPlayers(initialData);
    setPage(1);
    setHasMore(initialMeta?.totalPage ? initialMeta.totalPage > 1 : false);
  }, [initialData, initialMeta, searchTerm, sort, team]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const param: Record<string, string | number | undefined> = {
        searchTerm,
        sort,
        team,
        page: nextPage,
        limit,
      };

      const paramsUrl = Object.entries(param)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await get(`/player/get-all?${paramsUrl}`, {
        headers: token ? { Authorization: `${token}` } : {},
      });

      const newItems = res.data?.result || [];
      const meta = res.data?.meta;

      if (Array.isArray(newItems) && newItems.length > 0) {
        setPlayers((prev) => {
          // Exclude potential duplicates by _id
          const existingIds = new Set(prev.map((item) => item._id));
          const uniqueNewItems = newItems.filter(
            (item: Player) => !existingIds.has(item._id),
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
      console.error("Error loading more players:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, limit, searchTerm, sort, team, token]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const scrollContainer = sentinelRef.current?.closest(
      ".overflow-y-auto",
    ) as HTMLElement | null;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { root: scrollContainer, threshold: 0, rootMargin: "400px 0px" },
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
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, loading, loadMore]);

  if (!players || players.length === 0) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
          <UserX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          No Athletes Found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          We couldn&apos;t find any players matching your current filters. Try
          selecting another team or clearing your search.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 gap-4 sm:gap-5">
        {players.map((item: Player) => (
          <PlayerzCards token={token} item={item} key={item?._id} />
        ))}
      </div>

      {/* Loading more spinner */}
      {loading && (
        <div className="w-full py-8 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-[#053697]" />
          <span>Loading more players...</span>
        </div>
      )}

      {/* Invisible Bottom Sentinel for seamless background loading */}
      <div ref={sentinelRef} className="w-full h-4" />
    </div>
  );
};

export default InfinitePlayerList;
