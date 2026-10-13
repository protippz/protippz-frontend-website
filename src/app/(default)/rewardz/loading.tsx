import React from "react";

function RewardCardSkeleton() {
  return (
    <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6 animate-pulse">
      <div className="flex flex-col md:flex-row items-stretch">
        <div className="relative w-full md:w-[280px] lg:w-[320px] xl:w-[340px] h-[260px] md:h-auto min-h-[220px] md:min-h-[280px] bg-slate-900 shrink-0 p-6 flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-24 h-24 bg-slate-800 rounded-2xl" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-2">
            <div className="w-20 h-6 bg-slate-800 rounded-[4px]" />
            <div className="w-16 h-6 bg-slate-800 rounded-[4px]" />
            <div className="w-28 h-6 bg-slate-800 rounded-[4px]" />
          </div>
        </div>
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="w-44 h-4 bg-slate-200 rounded" />
              <div className="w-8 h-8 rounded-full bg-slate-200" />
            </div>
            <div className="w-64 sm:w-80 h-8 sm:h-9 bg-slate-200 rounded-lg" />
            <div className="w-full h-14 bg-slate-100 rounded-xl" />
            <div className="border border-slate-200/90 rounded-2xl p-4 grid grid-cols-2 divide-x divide-slate-200 bg-white">
              <div className="pr-4 space-y-2">
                <div className="w-20 h-3 bg-slate-200 rounded" />
                <div className="w-24 h-7 bg-slate-200 rounded" />
              </div>
              <div className="pl-4 space-y-2">
                <div className="w-24 h-3 bg-slate-200 rounded" />
                <div className="w-20 h-7 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
          <div className="w-full h-11 sm:h-12 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col h-full min-h-0 divide-y divide-slate-100 animate-pulse">
      {/* Search & Sort Section */}
      <div className="hidden lg:block p-3 sm:p-4 space-y-2.5 bg-white">
        <div className="flex items-center justify-between">
          <div className="w-28 h-4 bg-slate-200 rounded" />
        </div>
        <div className="w-full h-9 bg-slate-100 rounded-xl" />
        <div className="space-y-1.5 pt-0.5">
          <div className="w-20 h-3 bg-slate-200 rounded" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-7 bg-slate-100 rounded-lg" />
            <div className="h-7 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Filter Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="w-32 h-4 bg-slate-200 rounded" />
        <div className="w-8 h-4 bg-slate-200 rounded-full" />
      </div>

      {/* Category List */}
      <div className="p-2 space-y-1 flex-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-full p-2.5 rounded-xl border border-slate-100 flex items-center justify-between bg-slate-50/40"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-200 shrink-0" />
              <div className="space-y-1">
                <div className="w-24 h-3 bg-slate-200 rounded" />
                <div className="w-14 h-2 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="w-3 h-3 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingRewardzPage() {
  return (
    <div className="max-w-355 mx-auto mt-2 sm:mt-3 px-2 sm:px-4 pb-14">
      {/* Unified Master Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200 lg:sticky lg:top-[64px] h-[calc(100dvh-120px)] sm:h-[calc(100dvh-125px)] lg:h-[calc(100vh-125px)] min-h-[460px] sm:min-h-[520px] lg:min-h-[550px]">
        {/* Left Column: Sidebar */}
        <aside className="w-full shrink-0 lg:w-72 xl:w-80 lg:shrink-0 bg-white lg:h-full flex flex-col overflow-hidden">
          <SidebarSkeleton />
        </aside>

        {/* Right Column: Cards in 1 Grid */}
        <main className="flex-1 min-w-0 flex flex-col h-full min-h-0 overflow-hidden bg-[#fafbfb]">
          <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar p-2.5 sm:p-4 min-h-0">
            <div className="w-full grid grid-cols-1 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <RewardCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
