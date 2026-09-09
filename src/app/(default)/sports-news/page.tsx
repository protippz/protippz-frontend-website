"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  ExternalLink,
  Clock,
  Flame,
  Newspaper,
  BookOpen,
  CheckCircle2,
  Share2,
  X,
  ArrowRight,
  Filter,
  ArrowUp,
  Loader2,
  Check,
} from "lucide-react";
import OptimizedPostImage from "@/components/community/OptimizedPostImage";
import { TickerHeadline } from "@/app/api/sports-news-ticker/route";
import { copyToClipboard } from "@/components/community/helpers";

const BADGE_CONFIGS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  WBB: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-600",
    border: "border-emerald-500/30",
  },
  WNBA: {
    bg: "bg-teal-500/15",
    text: "text-teal-600",
    border: "border-teal-500/30",
  },
  NWSL: {
    bg: "bg-purple-500/15",
    text: "text-purple-600",
    border: "border-purple-500/30",
  },
  HBCU: {
    bg: "bg-amber-500/15",
    text: "text-amber-700",
    border: "border-amber-500/30",
  },
  TENNIS: {
    bg: "bg-sky-500/15",
    text: "text-sky-600",
    border: "border-sky-500/30",
  },
  DEFAULT: {
    bg: "bg-[#2FC191]/15",
    text: "text-[#2FC191]",
    border: "border-[#2FC191]/30",
  },
};

function relativeTime(iso: string): string {
  if (!iso) return "recently";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATIC_BADGES = ["All", "WBB", "WNBA", "NWSL", "HBCU", "TENNIS"];

export default function SportsNewsPage() {
  const [headlines, setHeadlines] = useState<TickerHeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(20);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>("All");
  const [activeModalItem, setActiveModalItem] = useState<TickerHeadline | null>(
    null,
  );
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetchingRef = useRef(false);

  const openStoryModal = useCallback((item: TickerHeadline) => {
    setActiveModalItem(item);
    if (typeof window !== "undefined") {
      const newUrl = `/sports-news?story=${item.id}`;
      window.history.pushState({ storyId: item.id }, "", newUrl);
    }
  }, []);

  const closeStoryModal = useCallback(() => {
    setActiveModalItem(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/sports-news");
    }
  }, []);

  const fetchHeadlines = useCallback(
    async (
      currentLimit: number,
      category: string,
      query: string,
      isRefresh = false,
    ) => {
      if (fetchingRef.current && !isRefresh) return;
      fetchingRef.current = true;

      try {
        if (isRefresh) setRefreshing(true);
        else if (currentLimit > 20) setLoadingMore(true);

        const params = new URLSearchParams();
        params.set("limit", String(currentLimit));
        if (category !== "All") params.set("category", category);
        if (query.trim()) params.set("search", query.trim());

        const url = `/api/sports-news-ticker?${params.toString()}`;

        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        if (data.success && Array.isArray(data.headlines)) {
          setHeadlines(data.headlines);
          if (data.lastUpdated) setLastUpdated(data.lastUpdated);

          if (data.headlines.length < currentLimit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch sports news headlines:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        fetchingRef.current = false;
      }
    },
    [],
  );

  // Initial load, category change, or search query change
  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(true);
      setLimit(20);
      setHasMore(true);
      fetchHeadlines(20, selectedBadge, searchQuery, true);
    }, 300);

    return () => clearTimeout(handler);
  }, [selectedBadge, searchQuery, fetchHeadlines]);

  // Deep Link URL check (e.g. /sports-news?story=49807088)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const storyIdFromUrl = urlParams.get("story");

    if (storyIdFromUrl) {
      const existing = headlines.find(
        (h) => String(h.id) === String(storyIdFromUrl),
      );
      if (existing) {
        setActiveModalItem(existing);
      } else if (!loading && headlines.length > 0) {
        fetch(`/api/sports-news-ticker?limit=50`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.headlines)) {
              const matched = data.headlines.find(
                (h: TickerHeadline) => String(h.id) === String(storyIdFromUrl),
              );
              if (matched) setActiveModalItem(matched);
            }
          })
          .catch(() => {});
      }
    }
  }, [headlines, loading]);

  // IntersectionObserver for Infinite Scrolling near bottom of screen
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fetchingRef.current && hasMore) {
          setLimit((prev) => {
            const nextLimit = prev + 15;
            fetchHeadlines(nextLimit, selectedBadge, searchQuery);
            return nextLimit;
          });
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [
    hasMore,
    loading,
    loadingMore,
    fetchHeadlines,
    selectedBadge,
    searchQuery,
  ]);

  // Scroll position observer for "Back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard accessibility: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeStoryModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeStoryModal]);

  // Filter headlines based on search query
  const filteredHeadlines = useMemo(() => {
    return headlines.filter((item) => {
      const matchesBadge =
        selectedBadge === "All" || item.badge === selectedBadge;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.text && item.text.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q));

      return matchesBadge && matchesSearch;
    });
  }, [headlines, selectedBadge, searchQuery]);

  const handleShareItem = async (item: TickerHeadline, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/sports-news?story=${item.id}`
        : item.link || "";

    if (typeof navigator !== "undefined" && navigator.share) {
      const shareData = {
        title: item.text,
        text:
          item.description ||
          "Check out this live sports headline on ProTippz!",
        url: shareUrl,
      };

      try {
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (err) {
        const errorName = (err as Error)?.name;
        if (errorName === "AbortError") return;
      }
    }

    const copied = await copyToClipboard(shareUrl);
    if (copied) {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFBFB] text-slate-800 pb-20 [scrollbar-gutter:stable]">
      {/* Main Content Area */}
      <main className="max-w-355 mx-auto w-full px-4 sm:px-6 py-8 space-y-6 min-h-[75vh]">
        {/* Search & Category Filter Navigation Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search headlines, team names, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs sm:text-sm text-[#053697] placeholder-slate-400 focus:outline-none focus:border-[#2FC191] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Badge Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
            <span className="text-xs font-extrabold text-[#053697] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#2FC191]" />
              Filter:
            </span>
            {STATIC_BADGES.map((badge) => {
              const isActive = selectedBadge === badge;
              return (
                <button
                  key={badge}
                  type="button"
                  onClick={() => setSelectedBadge(badge)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-[#2FC191] text-white shadow-2xs"
                      : "bg-slate-100 text-[#053697] hover:bg-slate-200"
                  }`}
                >
                  {badge === "All" ? "All Sports" : badge}
                </button>
              );
            })}
          </div>
        </div>

        {/* Headlines Card Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[60vh] justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3 animate-pulse max-w-[355px] w-full mx-auto"
              >
                <div className="w-full h-44 bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filteredHeadlines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredHeadlines.map((item) => {
              const badgeStyle =
                BADGE_CONFIGS[item.badge] || BADGE_CONFIGS.DEFAULT;

              return (
                <article
                  key={item.id}
                  onClick={() => openStoryModal(item)}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer flex flex-col justify-between max-w-[355px] w-full mx-auto"
                >
                  <div className="space-y-3">
                    {/* Thumbnail Image Container */}
                    {item.imageUrl ? (
                      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                        <OptimizedPostImage
                          src={item.imageUrl}
                          alt={item.text}
                          width={600}
                          height={350}
                          objectFit="cover"
                          containerClassName="h-full w-full rounded-none"
                          maxHeightClass="h-48 max-h-48"
                          enableLightbox={false}
                        />
                        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-2xs backdrop-blur-md ${badgeStyle.bg} ${badgeStyle.text} bg-white/90 border ${badgeStyle.border}`}
                          >
                            {item.emoji} {item.badge}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50/50 p-4 flex flex-col justify-between border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${badgeStyle.bg} ${badgeStyle.text} border ${badgeStyle.border}`}
                          >
                            {item.emoji} {item.badge}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">
                            {relativeTime(item.publishedAt)}
                          </span>
                        </div>
                        <BookOpen className="w-8 h-8 text-[#2FC191]/40 self-end" />
                      </div>
                    )}

                    {/* Card Text Content */}
                    <div className="px-4.5 pt-1 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#2FC191]" />
                          {relativeTime(item.publishedAt)}
                        </span>
                        <span>ESPN Sports</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-[#053697] leading-snug line-clamp-2 group-hover:text-[#2FC191] transition-colors">
                        {item.text}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4.5 pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openStoryModal(item);
                      }}
                      className="inline-flex items-center gap-1 text-[#2FC191] hover:underline cursor-pointer"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleShareItem(item, e)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-600 transition-colors cursor-pointer"
                        title="Share story link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#053697]/10 hover:bg-[#053697] text-[#053697] hover:text-white transition-colors text-[11px]"
                          title="Open original story on ESPN"
                        >
                          <span>ESPN</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#053697]">
              No Sports Headlines Found
            </h3>
            <p className="text-xs text-slate-500">
              No headlines match your current search or category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedBadge("All");
              }}
              className="px-4 py-2 rounded-xl bg-[#2FC191] text-white font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Scroll Sentinel & Bottom Infinite Loading State */}
        <div
          ref={sentinelRef}
          className="py-6 text-center flex flex-col items-center justify-center min-h-[60px]"
        >
          {loadingMore && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-[#053697] shadow-xs animate-pulse">
              <Loader2 className="w-4 h-4 text-[#2FC191] animate-spin" />
              <span>Fetching more sports news...</span>
            </div>
          )}

          {!hasMore && headlines.length > 0 && !loading && (
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
              You&apos;ve reached the end of current sports headlines
            </span>
          )}
        </div>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-16 right-6 z-50 p-3 rounded-full bg-[#053697] hover:bg-[#2FC191] text-white shadow-xl transition-all duration-300 active:scale-90 cursor-pointer border border-white/20"
          title="Back to Top"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Copied Link Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[100000] bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <Check className="w-4 h-4 text-[#2FC191]" />
          <span>Story link copied to clipboard!</span>
        </div>
      )}

      {/* Story Detail Drawer Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeStoryModal}
        >
          <div
            className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#2FC191]/15 text-[#2FC191] border border-[#2FC191]/30">
                  {activeModalItem.emoji} {activeModalItem.badge}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Published {relativeTime(activeModalItem.publishedAt)}
                </span>
              </div>

              <button
                type="button"
                onClick={closeStoryModal}
                className="p-1.5 rounded-full hover:bg-gray-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {activeModalItem.imageUrl && (
                <div className="rounded-xl overflow-hidden shadow-xs border border-gray-200">
                  <OptimizedPostImage
                    src={activeModalItem.imageUrl}
                    alt={activeModalItem.text}
                    width={800}
                    height={450}
                    maxHeightClass="max-h-[340px]"
                    enableLightbox={true}
                  />
                </div>
              )}

              <h2 className="text-lg sm:text-2xl font-black text-[#053697] leading-snug">
                {activeModalItem.text}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {activeModalItem.description ||
                  "Full story breakdown available on source network."}
              </p>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-[#2FC191]/30 flex items-center gap-2 text-xs font-semibold text-[#053697]">
                <CheckCircle2 className="w-4 h-4 text-[#2FC191] shrink-0" />
                <span>Source verified coverage from ESPN Sports Network</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => handleShareItem(activeModalItem, e)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-[#053697] font-bold text-xs transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#2FC191]" />
                <span>Share Story</span>
              </button>

              {activeModalItem.link && (
                <a
                  href={activeModalItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#053697] hover:bg-[#053697]/90 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>Read Full Article on ESPN</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
