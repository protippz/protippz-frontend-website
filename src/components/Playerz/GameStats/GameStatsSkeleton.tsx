import React from "react";
import { Loader2 } from "lucide-react";

export const GameStatsSkeleton: React.FC = () => {
  return (
    <div className="p-8 text-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-[#053697]">
        <Loader2 className="w-6 h-6 animate-spin text-[#053697]" />
        <span className="text-xs font-bold uppercase tracking-wider font-mono">
          Loading Official Game Stats...
        </span>
      </div>
      <div className="w-full max-w-md mx-auto space-y-2">
        <div className="h-4 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-4 bg-slate-100/70 rounded-full animate-pulse w-3/4 mx-auto" />
      </div>
    </div>
  );
};

