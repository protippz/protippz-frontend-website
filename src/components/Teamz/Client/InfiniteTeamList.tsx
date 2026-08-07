"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import TeamzCards from "@/components/Teamz/TeamzCards";
import { TeamInterface } from "@/app/(default)/teamz/page";
import { get } from "@/ApisRequests/server";
import { Empty, Spin } from "antd";

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
  limit = 12,
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

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  if (!teams || teams.length === 0) {
    return (
      <div className="col-span-3 py-20 flex justify-center items-center">
        <Empty description="No Results Found. Search Again." />
      </div>
    );
  }

  return (
    <div className="w-full px-2">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {teams.map((item: TeamInterface) => (
          <TeamzCards token={token} item={item} key={item?._id} />
        ))}
      </div>

      {/* Bottom Sentinel & Loading Spinner */}
      <div
        ref={sentinelRef}
        className="w-full flex justify-center items-center py-8 min-h-[60px]"
      >
        {loading && (
          <div className="flex items-center gap-2 text-blue-950 font-medium">
            <Spin size="default" />
            <span>Loading more teams...</span>
          </div>
        )}
        {!hasMore && teams.length > 0 && (
          <p className="text-gray-400 text-sm italic">
            No more teams to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default InfiniteTeamList;
