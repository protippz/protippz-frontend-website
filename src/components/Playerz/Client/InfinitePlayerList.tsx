"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import PlayerzCards from "@/components/Playerz/PlayerzCards";
import { Player } from "@/app/(default)/playerz/page";
import { get } from "@/ApisRequests/server";
import { Empty, Spin } from "antd";

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
    initialMeta?.totalPage ? initialMeta.totalPage > 1 : false
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
            (item: Player) => !existingIds.has(item._id)
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

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0, rootMargin: "600px 0px" }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  if (!players || players.length === 0) {
    return (
      <div className="col-span-3 py-20 flex justify-center items-center">
        <Empty description="No Results Found. Search Again." />
      </div>
    );
  }

  return (
    <div className="w-full px-2">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {players.map((item: Player) => (
          <PlayerzCards token={token} item={item} key={item?._id} />
        ))}
      </div>

      {/* Invisible Bottom Sentinel for seamless background loading */}
      <div ref={sentinelRef} className="w-full h-4" />
    </div>
  );
};

export default InfinitePlayerList;
