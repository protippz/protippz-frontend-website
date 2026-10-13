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
  sort?: string;
  category?: string;
  limit?: number;
}

const InfiniteRewardList: React.FC<InfiniteRewardListProps> = ({
  initialData = [],
  initialMeta,
  token,
  searchTerm,
  sort,
  category,
  limit = 20,
}) => {
  const [rewards, setRewards] = useState<RewardInterface[]>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(
    initialMeta?.totalPage ? initialMeta.totalPage > 1 : false
  );

  const pageRef = useRef<number>(1);
  const hasMoreRef = useRef<boolean>(
    initialMeta?.totalPage ? initialMeta.totalPage > 1 : false
  );
  const isFetchingRef = useRef<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync state whenever server props (filters / initial data) change
  useEffect(() => {
    setRewards(initialData);
    pageRef.current = 1;
    const canMore = initialMeta?.totalPage ? initialMeta.totalPage > 1 : false;
    setHasMore(canMore);
    hasMoreRef.current = canMore;
    isFetchingRef.current = false;
  }, [initialData, initialMeta, searchTerm, sort, category]);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    const nextPage = pageRef.current + 1;

    try {
      const param: Record<string, string | number | undefined> = {
        searchTerm,
        sort,
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

      const newItems: RewardInterface[] = res.data?.result || [];
      const meta = res.data?.meta;
      const totalPage = Number(meta?.totalPage);

      if (!Array.isArray(newItems) || newItems.length === 0) {
        setHasMore(false);
        hasMoreRef.current = false;
        return;
      }

      setRewards((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const uniqueNewItems = newItems.filter(
          (item) => !existingIds.has(item._id)
        );

        if (uniqueNewItems.length === 0) {
          return prev;
        }

        return [...prev, ...uniqueNewItems];
      });

      pageRef.current = nextPage;

      let canLoadMore = false;
      if (!isNaN(totalPage) && totalPage > 0) {
        canLoadMore = nextPage < totalPage;
      } else {
        canLoadMore = newItems.length >= limit;
      }

      setHasMore(canLoadMore);
      hasMoreRef.current = canLoadMore;
    } catch (err) {
      console.error("Error loading more rewards:", err);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [searchTerm, sort, category, limit, token]);

  // Robust IntersectionObserver
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
      { threshold: 0, rootMargin: "300px 0px" }
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  if (!rewards || rewards.length === 0) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-6">
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
      <div className="w-full grid grid-cols-1 gap-4 sm:gap-6">
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

      {/* Sentinel element: rendered in DOM only if more items are available */}
      {hasMore && <div ref={sentinelRef} className="w-full h-8" />}

      {/* End of results message: only shown when completely exhausted */}
      {!hasMore && rewards.length > 0 && (
        <div className="w-full py-8 text-center text-xs text-slate-400 font-medium">
          All {rewards.length} rewards loaded
        </div>
      )}
    </div>
  );
};

export default InfiniteRewardList;
