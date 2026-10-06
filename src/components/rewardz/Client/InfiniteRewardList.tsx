"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import RewardzCards from "@/components/rewardz/RewardzCards";
import { RewardInterface } from "@/app/(default)/rewardz/page";
import { get } from "@/ApisRequests/server";
import { Gift, Loader2 } from "lucide-react";

interface InfiniteRewardListProps {
  initialData: RewardInterface[];
  initialMeta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPage?: number;
  };
  token?: string;
  searchTerm?: string;
  category?: string;
  limit?: number;
}

const InfiniteRewardList: React.FC<InfiniteRewardListProps> = ({
  initialData = [],
  initialMeta,
  token,
  searchTerm,
  category,
  limit = 20,
}) => {
  const [rewards, setRewards] = useState<RewardInterface[]>(initialData);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(
    initialMeta?.totalPage ? initialMeta.totalPage > 1 : false
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync state whenever server props (filters / initial data) change
  useEffect(() => {
    setRewards(initialData);
    setPage(1);
    setHasMore(initialMeta?.totalPage ? initialMeta.totalPage > 1 : false);
  }, [initialData, initialMeta, searchTerm, category]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const param: Record<string, string | number | undefined> = {
        searchTerm,
        category,
        page: nextPage,
        limit,
      };

      const paramsUrl = Object.entries(param)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await get(`/reward/get-all?${paramsUrl}`, {
        headers: token ? { Authorization: `${token}` } : {},
      });

      const newItems = res.data?.result || [];
      const meta = res.data?.meta;

      if (Array.isArray(newItems) && newItems.length > 0) {
        setRewards((prev) => {
          // Exclude potential duplicates by _id
          const existingIds = new Set(prev.map((item) => item._id));
          const uniqueNewItems = newItems.filter(
            (item: RewardInterface) => !existingIds.has(item._id)
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
      console.error("Error loading more rewards:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, limit, searchTerm, category, token]);

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

  if (!rewards || rewards.length === 0) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
          <Gift className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Rewards Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          We couldn&apos;t find any rewards matching your current filters. Try selecting another category or clearing your search.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {rewards.map((item: RewardInterface) => (
          <RewardzCards item={item} key={item?._id} />
        ))}
      </div>

      {/* Loading more spinner */}
      {loading && (
        <div className="w-full py-8 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-[#053697]" />
          <span>Loading more rewards...</span>
        </div>
      )}

      {/* Invisible Bottom Sentinel for seamless background loading */}
      <div ref={sentinelRef} className="w-full h-4" />
    </div>
  );
};

export default InfiniteRewardList;
