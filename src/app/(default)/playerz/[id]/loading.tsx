import React from "react";

export default function PlayerDetailsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
      {/* Back button & top bar skeleton */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <div className="w-32 h-8 bg-slate-200 rounded-lg"></div>
        <div className="w-24 h-8 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Hero Banner skeleton */}
      <div className="rounded-2xl p-6 sm:p-10 bg-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-slate-300 shrink-0"></div>
        <div className="flex-1 w-full space-y-3">
          <div className="w-28 h-5 bg-slate-300 rounded-full"></div>
          <div className="w-64 h-8 bg-slate-300 rounded-lg"></div>
          <div className="w-48 h-5 bg-slate-300 rounded-md"></div>
          <div className="w-full max-w-xl h-16 bg-slate-300 rounded-lg"></div>
          <div className="w-40 h-10 bg-slate-300 rounded-xl mt-4"></div>
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="w-40 h-6 bg-slate-200 rounded"></div>
            <div className="w-full h-20 bg-slate-100 rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 h-36"></div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 h-36"></div>
          </div>
        </div>
        <div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 h-64"></div>
        </div>
      </div>
    </div>
  );
}
