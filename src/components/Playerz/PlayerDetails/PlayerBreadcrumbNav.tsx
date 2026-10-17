"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { shareUrl } from "@/lib/share";

interface PlayerBreadcrumbNavProps {
  playerName: string;
}

const PlayerBreadcrumbNav: React.FC<PlayerBreadcrumbNavProps> = ({
  playerName,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;

    await shareUrl({
      title: `${playerName} | ProTippz`,
      text: `Support ${playerName} on ProTippz!`,
      url,
      fallbackSuccessMessage: "Profile link copied to clipboard!",
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-1 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/playerz");
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#053697] transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Playerz</span>
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/playerz"
            className="hover:text-slate-800 transition-colors"
          >
            Playerz
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate max-w-[200px]">
            {playerName}
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
          )}
          <span>{copied ? "Copied!" : "Share Profile"}</span>
        </button>
      </div>
    </div>
  );
};

export default PlayerBreadcrumbNav;
