import React from "react";

const Bar = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-full bg-slate-200/70 ${className}`} />
);

/** Shape-matched placeholder: cards on mobile, rows on desktop. */
export const GameStatsSkeleton: React.FC = () => (
  <div aria-busy="true" aria-label="Loading game stats">
    <ul className="space-y-2.5 p-3 md:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="rounded-[22px] border border-slate-200/80 bg-white p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200/70" />
            <div className="flex-1 space-y-1.5">
              <Bar className="h-3.5 w-28" />
              <Bar className="h-2.5 w-20" />
            </div>
            <Bar className="h-6 w-16" />
          </div>
          <div className="mt-3 h-16 animate-pulse rounded-2xl bg-slate-100" />
        </li>
      ))}
    </ul>

    <div className="hidden divide-y divide-slate-100 px-4 py-2 md:block">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <div className="h-8 w-8 animate-pulse rounded-xl bg-slate-200/70" />
          <div className="w-40 space-y-1.5">
            <Bar className="h-3 w-32" />
            <Bar className="h-2.5 w-20" />
          </div>
          <Bar className="h-5 w-16" />
          <div className="flex flex-1 justify-end gap-5">
            {Array.from({ length: 8 }).map((__, j) => (
              <Bar key={j} className="h-3 w-8" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
