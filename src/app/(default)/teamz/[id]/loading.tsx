import React from "react";

export default function TeamDetailsLoading() {
  return (
    <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
      {/* Back button & top bar skeleton */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <div className="w-32 h-8 bg-slate-200 rounded-lg"></div>
        <div className="w-24 h-8 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Hero Banner skeleton */}
      <div className="rounded-3xl p-6 sm:p-10 bg-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl bg-slate-300 shrink-0"></div>
        <div className="flex-1 w-full space-y-3">
          <div className="w-36 h-5 bg-slate-300 rounded-full"></div>
          <div className="w-64 sm:w-80 h-10 bg-slate-300 rounded-xl"></div>
          <div className="flex gap-2">
            <div className="w-20 h-6 bg-slate-300 rounded-md"></div>
            <div className="w-24 h-6 bg-slate-300 rounded-md"></div>
          </div>
          <div className="w-44 h-11 bg-slate-300 rounded-xl mt-4"></div>
        </div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-2"
          >
            <div className="w-16 h-4 bg-slate-200 rounded"></div>
            <div className="w-24 h-7 bg-slate-200 rounded"></div>
            <div className="w-28 h-3 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>

      {/* Details skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Roster Skeleton */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="w-48 h-6 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-52 bg-slate-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 h-72"></div>
        </div>
      </div>
    </div>
  );
}
