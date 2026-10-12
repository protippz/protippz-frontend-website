"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import PlayerzCards from "@/components/Playerz/PlayerzCards";
import TeamzCards from "@/components/Teamz/TeamzCards";
import { Player } from "@/app/(default)/playerz/page";
import { TeamInterface } from "@/app/(default)/teamz/page";
import { get } from "@/ApisRequests/server";
import {
  Star,
  User,
  Shield,
  Search,
  X,
  ArrowUpRight,
  RotateCw,
  Sparkles,
  UserX,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

// Shimmering Skeleton for Horizontal Cards
function FavoriteCardSkeleton() {
  return (
    <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xs overflow-hidden mb-4 sm:mb-6 animate-pulse">
      <div className="flex flex-col md:flex-row items-stretch">
        <div className="relative w-full md:w-[280px] lg:w-[320px] xl:w-[340px] h-[300px] md:h-auto min-h-[260px] md:min-h-[300px] bg-slate-200 shrink-0 flex flex-col justify-end p-3.5 sm:p-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="w-20 h-5 bg-slate-300 rounded-[4px]" />
            <div className="w-16 h-5 bg-slate-300 rounded-[4px]" />
            <div className="w-24 h-5 bg-slate-300 rounded-[4px]" />
          </div>
        </div>
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="w-40 h-4 bg-slate-200 rounded" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="w-8 h-8 rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="w-56 sm:w-72 h-8 bg-slate-200 rounded-lg" />
            <div className="w-full h-12 bg-slate-100 rounded-xl" />
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 mt-4 pt-1">
            <div className="flex-1 h-11 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

const TabsComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"playerz" | "teamz">("playerz");
  const [token, setToken] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<TeamInterface[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState<boolean>(true);
  const [isLoadingTeams, setIsLoadingTeams] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  const fetchPlayers = useCallback(async (authToken: string | null) => {
    setIsLoadingPlayers(true);
    try {
      const res = await get("/player-bookmark/my-bookmark?limit=9999999", {
        headers: {
          Authorization: `${authToken || ""}`,
        },
      });
      const data =
        res?.data?.map((item: any) => ({
          ...item?.player,
          isBookmark: true,
        })) || [];
      setPlayers(data.filter((item: any) => item && item._id));
    } catch (err) {
      console.error("Failed to load favorite players:", err);
    } finally {
      setIsLoadingPlayers(false);
    }
  }, []);

  const fetchTeams = useCallback(async (authToken: string | null) => {
    setIsLoadingTeams(true);
    try {
      const res = await get("/team-bookmark/my-bookmark?limit=9999999", {
        headers: {
          Authorization: `${authToken || ""}`,
        },
      });
      const data =
        res?.data?.map((item: any) => ({
          ...item?.team,
          isBookmark: true,
        })) || [];
      setTeams(data.filter((item: any) => item && item._id));
    } catch (err) {
      console.error("Failed to load favorite teams:", err);
    } finally {
      setIsLoadingTeams(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchPlayers(token);
      fetchTeams(token);
    } else {
      setIsLoadingPlayers(false);
      setIsLoadingTeams(false);
    }
  }, [token, fetchPlayers, fetchTeams]);

  // Sync state in real-time when user un-bookmarks an item
  useEffect(() => {
    const handleBookmarkUpdate = (e: any) => {
      const { type, _id, action } = e.detail || {};
      if (action === "removed" && _id) {
        if (type === "team") {
          setTeams((prev) => prev.filter((t) => t._id !== _id));
        } else {
          setPlayers((prev) => prev.filter((p) => p._id !== _id));
        }
      } else if (token) {
        if (type === "team") fetchTeams(token);
        else fetchPlayers(token);
      }
    };

    window.addEventListener("bookmark-updated", handleBookmarkUpdate);
    return () => {
      window.removeEventListener("bookmark-updated", handleBookmarkUpdate);
    };
  }, [token, fetchPlayers, fetchTeams]);

  const handleManualRefresh = async () => {
    if (!token) return;
    setIsRefreshing(true);
    try {
      await Promise.all([fetchPlayers(token), fetchTeams(token)]);
      toast.success("Favorites refreshed");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Instant Search Filtering
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return players;
    const q = searchQuery.toLowerCase().trim();
    return players.filter((p) => {
      const name = p?.name?.toLowerCase() || "";
      const position = p?.position?.toLowerCase() || "";
      const teamName = p?.team?.name?.toLowerCase() || "";
      const sport = p?.league?.sport?.toLowerCase() || "";
      const league = p?.league?.name?.toLowerCase() || "";
      return (
        name.includes(q) ||
        position.includes(q) ||
        teamName.includes(q) ||
        sport.includes(q) ||
        league.includes(q)
      );
    });
  }, [players, searchQuery]);

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const q = searchQuery.toLowerCase().trim();
    return teams.filter((t) => {
      const name = t?.name?.toLowerCase() || "";
      const sport = t?.league?.sport?.toLowerCase() || "";
      const league = t?.league?.name?.toLowerCase() || "";
      return name.includes(q) || sport.includes(q) || league.includes(q);
    });
  }, [teams, searchQuery]);

  const totalBookmarks = players.length + teams.length;

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-xs font-bold text-[#053697]">
            <Star className="w-3.5 h-3.5 fill-[#2FC191] text-[#2FC191]" />
            <span>[NIL VAULT: SAVED BOOKMARKS]</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            My Favorites
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Manage and support your saved collegiate athletes and official teams. Track their achievements and tip them directly.
          </p>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            href="/playerz"
            className="inline-flex items-center justify-center gap-1.5 bg-[#053697] hover:bg-[#053697]/90 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>Explore Athletes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-200" />
          </Link>
          <Link
            href="/teamz"
            className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-[#053697] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Browse Teams</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 sm:mb-8 items-stretch">
        {/* Big Primary Card (Left Side) */}
        <div className="md:col-span-6 lg:col-span-7 bg-[#053697] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden border border-[#053697] shadow-xs min-h-[160px]">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-10 top-2 w-32 h-32 rounded-full bg-[#2FC191]/15 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2FC191]" />
              Total Saved Bookmarks
            </span>
            <div className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {totalBookmarks}
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
            <span>Direct collegiate roster in your vault</span>
            <span className="font-semibold text-[#2FC191] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2FC191] animate-pulse" />
              Live Synchronized
            </span>
          </div>
        </div>

        {/* Right Stacked Metric Cards */}
        <div className="md:col-span-6 lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Athletes Metric */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Athletes
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#053697] flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {players.length}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Saved collegiate stars
            </p>
          </div>

          {/* Teams Metric */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Teams
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {teams.length}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Official athletic programs
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Segmented Tabs + Search Filter + Refresh Button */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 mb-6 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Segmented Tab Controls */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("playerz")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "playerz"
                ? "bg-[#053697] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Athletes</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "playerz"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {players.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("teamz")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "teamz"
                ? "bg-[#053697] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Teams</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "teamz"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {teams.length}
            </span>
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex items-center gap-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "playerz"
                  ? "Search saved athletes..."
                  : "Search saved teams..."
              }
              className="w-full h-10 pl-9 pr-8 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#053697] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="h-10 w-10 shrink-0 border border-slate-200 hover:border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#053697] transition-colors cursor-pointer"
            title="Sync bookmarks"
          >
            <RotateCw
              className={`w-4 h-4 ${
                isRefreshing ? "animate-spin text-[#053697]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Cards Content Section */}
      {activeTab === "playerz" ? (
        // ATHLETES TAB CONTENT
        isLoadingPlayers ? (
          <div className="w-full">
            <FavoriteCardSkeleton />
            <FavoriteCardSkeleton />
          </div>
        ) : filteredPlayers.length === 0 ? (
          searchQuery ? (
            // Search Query No Results
            <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Athletes Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                No saved athletes matched &ldquo;{searchQuery}&rdquo;. Try another name, position, or team.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            // No Athletes Bookmarked
            <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#053697] mb-3">
                <UserX className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Favorite Athletes Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                You haven&apos;t saved any collegiate athletes yet. Star athletes on the roster to keep track of their performance, earn rewards, and send direct tips!
              </p>
              <Link
                href="/playerz"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#053697] hover:bg-[#053697]/90 text-white transition-colors shadow-xs"
              >
                <span>Discover Athletes</span>
                <ArrowUpRight className="w-4 h-4 text-blue-200" />
              </Link>
            </div>
          )
        ) : (
          <div className="w-full grid grid-cols-1">
            {filteredPlayers.map((player) => (
              <PlayerzCards item={player} key={player._id} token={token} />
            ))}
          </div>
        )
      ) : (
        // TEAMS TAB CONTENT
        isLoadingTeams ? (
          <div className="w-full">
            <FavoriteCardSkeleton />
            <FavoriteCardSkeleton />
          </div>
        ) : filteredTeams.length === 0 ? (
          searchQuery ? (
            // Search Query No Results
            <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Teams Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                No saved teams matched &ldquo;{searchQuery}&rdquo;. Try another team name, sport, or league.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            // No Teams Bookmarked
            <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Favorite Teams Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                You haven&apos;t saved any official collegiate teams yet. Follow your favorite programs across NCAA and college sports to support them directly.
              </p>
              <Link
                href="/teamz"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#053697] hover:bg-[#053697]/90 text-white transition-colors shadow-xs"
              >
                <span>Browse Teams</span>
                <ArrowUpRight className="w-4 h-4 text-blue-200" />
              </Link>
            </div>
          )
        ) : (
          <div className="w-full grid grid-cols-1">
            {filteredTeams.map((team) => (
              <TeamzCards item={team} key={team._id} token={token} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default TabsComponent;
