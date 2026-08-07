import React from "react";

export default function PlayerzLoading() {
  return (
    <div className="container mx-auto mt-10 px-2 animate-pulse">
      {/* Teams Skeleton */}
      <div className="w-full flex gap-4 overflow-hidden py-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"
          ></div>
        ))}
      </div>

      {/* Heading Skeleton */}
      <div className="flex flex-col items-center my-8 gap-2">
        <div className="w-48 h-8 bg-gray-200 rounded"></div>
        <div className="w-32 h-4 bg-gray-100 rounded"></div>
      </div>

      {/* Search & Sort Skeleton */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 my-6">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="w-48 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-200 rounded-lg border border-gray-200 p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
                <div className="w-32 h-5 bg-gray-300 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 rounded mt-2"></div>
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="w-20 h-24 bg-gray-300 rounded-md"></div>
            </div>
            <div className="flex justify-end">
              <div className="w-24 h-8 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
