"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { get, patch } from "@/ApisRequests/server";
import GoToTop from "@/components/ui/GoToTop";
import {
  Bell,
  BellOff,
  DollarSign,
  Star,
  Trophy,
  User,
  Clock,
  Check,
  CheckCheck,
  RotateCw,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface NotificationsType {
  _id: string;
  title: string;
  message: string;
  seen: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "Recently";
  }
}

function getNotificationMeta(notification: NotificationsType) {
  const content = `${notification.title || ""} ${notification.message || ""}`.toLowerCase();

  if (
    content.includes("tip") ||
    content.includes("$") ||
    content.includes("sent") ||
    content.includes("deposit") ||
    content.includes("withdraw") ||
    content.includes("payment") ||
    content.includes("amount")
  ) {
    return {
      type: "tip",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      icon: DollarSign,
      iconContainer: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
      tag: "Tippz Activity",
    };
  }

  if (
    content.includes("bookmark") ||
    content.includes("favorite") ||
    content.includes("star")
  ) {
    return {
      type: "bookmark",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
      icon: Star,
      iconContainer: "bg-amber-50 text-amber-500 border border-amber-200/60",
      tag: "Favorite Saved",
    };
  }

  if (
    content.includes("reward") ||
    content.includes("point") ||
    content.includes("badge") ||
    content.includes("level") ||
    content.includes("achievement") ||
    content.includes("milestone")
  ) {
    return {
      type: "reward",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
      icon: Trophy,
      iconContainer: "bg-purple-50 text-purple-600 border border-purple-200/60",
      tag: "Reward Milestone",
    };
  }

  if (
    content.includes("player") ||
    content.includes("team") ||
    content.includes("roster") ||
    content.includes("athlete") ||
    content.includes("coach")
  ) {
    return {
      type: "athlete",
      badgeColor: "bg-blue-50 text-[#053697] border-blue-200/80",
      icon: User,
      iconContainer: "bg-blue-50 text-[#053697] border border-blue-200/60",
      tag: "Athlete Update",
    };
  }

  return {
    type: "general",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Bell,
    iconContainer: "bg-slate-100 text-[#053697] border border-slate-200",
    tag: "System Notification",
  };
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<NotificationsType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchNotifications = useCallback(
    async (targetPage = 1, isManual = false) => {
      if (isManual) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const token =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("token")
            : "";

        const res = await get(
          `/notification/get-notifications?page=${targetPage}&limit=15`,
          {
            headers: {
              Authorization: `${token || ""}`,
            },
          }
        );

        if (res?.data?.result) {
          setNotifications(res.data.result);
          if (res.data.meta) {
            setPagination(res.data.meta);
          }
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNotifications(page);
  }, [page, fetchNotifications]);

  const handleManualRefresh = () => {
    fetchNotifications(page, true);
    toast.success("Inbox refreshed");
  };

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
    );
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token")
        : "";
    patch(`/notification/see/${id}`, {}, {
      headers: { Authorization: token || "" },
    }).catch(() => {});
  };

  const markAllAsRead = () => {
    const hasUnread = notifications.some((n) => !n.seen);
    if (!hasUnread) {
      toast("All notifications are already marked as read");
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    toast.success("All notifications marked as read");

    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token")
        : "";
    patch("/notification/see-all", {}, {
      headers: { Authorization: token || "" },
    }).catch(() => {});
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.seen).length,
    [notifications]
  );

  const readCount = useMemo(
    () => notifications.filter((n) => n.seen).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    let list = notifications;

    if (activeTab === "unread") {
      list = list.filter((n) => !n.seen);
    } else if (activeTab === "read") {
      list = list.filter((n) => n.seen);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.message?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [notifications, activeTab, searchTerm]);

  return (
    <div className="w-full max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-16">
      <GoToTop />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-xs font-bold text-[#053697]">
            <Bell className="w-3.5 h-3.5 text-[#2FC191]" />
            <span>[ACTIVITY LOG: NOTIFICATION INBOX]</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Stay updated on your sent tips, earned rewards, favorited athletes, and official collegiate athletic news.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#053697] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-[#2FC191]" />
            <span>Mark All as Read</span>
          </button>

          <Link
            href="/playerz"
            className="inline-flex items-center justify-center gap-1.5 bg-[#053697] hover:bg-[#053697]/90 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>Explore Athletes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-200" />
          </Link>
        </div>
      </div>

      {/* Metric Cards: Matching Brand Design System */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 sm:mb-8 items-stretch">
        {/* Big Primary Card (Left Side) */}
        <div className="md:col-span-6 lg:col-span-7 bg-[#053697] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden border border-[#053697] shadow-xs min-h-[160px]">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-10 top-2 w-32 h-32 rounded-full bg-[#2FC191]/15 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2FC191]" />
              Total Recorded Notifications
            </span>
            <div className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {pagination?.total || notifications.length}
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
            <span>Real-time platform activity log</span>
            <span className="font-semibold text-[#2FC191] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2FC191] animate-pulse" />
              Live Inbox
            </span>
          </div>
        </div>

        {/* Right Stacked Metric Cards */}
        <div className="md:col-span-6 lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Unread Alerts Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Unread Alerts
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{unreadCount}</span>
              {unreadCount > 0 && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Actionable
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Requires your attention
            </p>
          </div>

          {/* Read & Archived Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Read History
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="my-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {readCount}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Archived notifications
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar: Segmented Tabs + Search Filter + Refresh Button */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 mb-6 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Segmented Filter Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#053697] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {notifications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "unread"
                ? "bg-[#053697] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <span>Unread</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "unread"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {unreadCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("read")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "read"
                ? "bg-[#053697] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <span>Read</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "read"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {readCount}
            </span>
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex items-center gap-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications by title or message..."
              className="w-full h-10 pl-9 pr-8 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#053697] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
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
            title="Refresh notifications"
          >
            <RotateCw
              className={`w-4 h-4 ${
                isRefreshing ? "animate-spin text-[#053697]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Notifications Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xs overflow-hidden">
        {isLoading ? (
          /* Shimmering Skeleton Loader */
          <div className="divide-y divide-slate-100">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 animate-pulse"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="w-40 sm:w-60 h-4 bg-slate-200 rounded" />
                    <div className="w-20 h-3 bg-slate-200 rounded" />
                  </div>
                  <div className="w-5/6 h-3 bg-slate-200 rounded" />
                  <div className="w-2/3 h-3 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          searchTerm ? (
            /* Search Empty State */
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Notifications Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                No notifications match &ldquo;{searchTerm}&rdquo;. Try another keyword or clear your search filter.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : activeTab !== "all" ? (
            /* Filter Empty State */
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <BellOff className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No {activeTab === "unread" ? "Unread" : "Read"} Notifications
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                You have caught up with all {activeTab === "unread" ? "new" : "archived"} alerts.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                View All Notifications
              </button>
            </div>
          ) : (
            /* General Empty State */
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#053697] mb-3.5 shadow-2xs">
                <BellOff className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                No Notifications Yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 leading-relaxed">
                When you send tips, bookmark collegiate athletes, earn rewards, or receive program updates, all your notifications will appear right here.
              </p>
              <Link
                href="/playerz"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#053697] hover:bg-[#053697]/90 text-white transition-colors shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Discover Athletes</span>
                <ArrowUpRight className="w-4 h-4 text-blue-200" />
              </Link>
            </div>
          )
        ) : (
          /* Notifications List Items */
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notification) => {
              const meta = getNotificationMeta(notification);
              const IconComponent = meta.icon;
              const isUnread = !notification.seen;

              return (
                <div
                  key={notification._id}
                  onClick={() => {
                    if (isUnread) markAsRead(notification._id);
                  }}
                  className={`relative p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 transition-colors cursor-pointer group ${
                    isUnread
                      ? "bg-blue-50/20 hover:bg-blue-50/40"
                      : "bg-white hover:bg-slate-50/80"
                  }`}
                >
                  {/* Left Unread Accent Indicator */}
                  {isUnread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#053697] rounded-r" />
                  )}

                  {/* Icon Avatar */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0 flex items-center justify-center shadow-2xs ${meta.iconContainer}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] border text-[10px] font-black uppercase tracking-wider ${meta.badgeColor}`}
                        >
                          {meta.tag}
                        </span>

                        {isUnread && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-[#053697] text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2FC191] animate-pulse" />
                            NEW
                          </span>
                        )}

                        <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#053697] transition-colors truncate">
                          {notification.title || "Notification Alert"}
                        </h2>
                      </div>

                      {/* Timestamp with Clock */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span title={new Date(notification.createdAt).toLocaleString()}>
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
                      {notification.message}
                    </p>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
                      <div className="text-[11px] text-slate-400 font-medium">
                        {new Date(notification.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>

                      {isUnread ? (
                        <button
                          type="button"
                          onClick={(e) => markAsRead(notification._id, e)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#053697] hover:underline cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-[#2FC191]" />
                          <span>Mark as read</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500" />
                          Seen
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Pure-Tailwind Pagination Controls (NO ANTD) */}
        {pagination && pagination.totalPage > 1 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500 font-medium">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {(page - 1) * (pagination.limit || 15) + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(page * (pagination.limit || 15), pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {pagination.total}
              </span>{" "}
              notifications
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1 px-2 text-xs font-bold text-slate-700">
                <span>{page}</span>
                <span className="text-slate-400 font-normal">/</span>
                <span className="text-slate-400 font-normal">
                  {pagination.totalPage}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPage, p + 1))
                }
                disabled={page >= pagination.totalPage || isLoading}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
