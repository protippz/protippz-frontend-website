"use client";

import React from "react";
import { FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import { ExternalLink, Link2Off } from "lucide-react";
import toast from "react-hot-toast";

interface PlayerSocialButtonsProps {
  playerName?: string;
  instagram?: string;
  intagram?: string;
  twitter?: string;
  tiktok?: string;
  variant?: "hero" | "card";
  className?: string;
}

interface SocialItem {
  id: "instagram" | "twitter" | "tiktok";
  name: string;
  shortName: string;
  handle: string;
  url: string | null;
  displayHandle: string;
  icon: React.ReactNode;
  brandColor: string;
  accentBg: string;
}

/**
 * Format raw handle or URL into valid platform URL
 */
function normalizeSocialUrl(
  platform: "instagram" | "twitter" | "tiktok",
  raw?: string,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const clean = trimmed.replace(/^@+/, "").trim();
  if (!clean) return null;

  switch (platform) {
    case "instagram":
      return `https://www.instagram.com/${clean}/`;
    case "twitter":
      return `https://x.com/${clean}`;
    case "tiktok":
      return `https://www.tiktok.com/@${clean}`;
    default:
      return null;
  }
}

/**
 * Extract clean display handle (e.g. @cooperflagg)
 */
function extractDisplayHandle(raw?: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const segments = url.pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        return `@${segments[segments.length - 1].replace(/^@+/, "")}`;
      }
    } catch {
      // ignore
    }
  }

  return `@${trimmed.replace(/^@+/, "")}`;
}

const PlayerSocialButtons: React.FC<PlayerSocialButtonsProps> = ({
  playerName = "Athlete",
  instagram,
  intagram,
  twitter,
  tiktok,
  variant = "hero",
  className = "",
}) => {
  const igValue = (instagram || intagram || "").trim();
  const twValue = (twitter || "").trim();
  const ttValue = (tiktok || "").trim();

  const socials: SocialItem[] = [
    {
      id: "instagram",
      name: "Instagram",
      shortName: "Instagram",
      handle: igValue,
      url: normalizeSocialUrl("instagram", igValue),
      displayHandle: extractDisplayHandle(igValue),
      icon: <FaInstagram className="w-4 h-4 shrink-0" />,
      brandColor: "#E1306C",
      accentBg: "hover:bg-[#E1306C]/15 hover:border-[#E1306C]/40",
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      shortName: "X / Twitter",
      handle: twValue,
      url: normalizeSocialUrl("twitter", twValue),
      displayHandle: extractDisplayHandle(twValue),
      icon: <FaXTwitter className="w-3.5 h-3.5 shrink-0" />,
      brandColor: "#000000",
      accentBg: "hover:bg-black/15 hover:border-black/40",
    },
    {
      id: "tiktok",
      name: "TikTok",
      shortName: "TikTok",
      handle: ttValue,
      url: normalizeSocialUrl("tiktok", ttValue),
      displayHandle: extractDisplayHandle(ttValue),
      icon: <FaTiktok className="w-3.5 h-3.5 shrink-0" />,
      brandColor: "#00f2fe",
      accentBg: "hover:bg-[#00f2fe]/15 hover:border-[#00f2fe]/40",
    },
  ];

  const handleClick = (item: SocialItem, e: React.MouseEvent) => {
    if (!item.url) {
      e.preventDefault();
      toast(
        `${playerName} has not linked their ${item.name} profile yet.`,
        {
          icon: "🔗",
          style: {
            borderRadius: "16px",
            background: "#1e293b",
            color: "#fff",
            fontSize: "13px",
          },
        },
      );
    }
  };

  if (variant === "card") {
    return (
      <div className={`space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Social Media & NIL Connect
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {socials.filter((s) => Boolean(s.url)).length} of 3 linked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {socials.map((item) => {
            const isLinked = Boolean(item.url);

            return isLinked ? (
              <a
                key={item.id}
                href={item.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-2xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer"
                title={`Visit ${playerName}'s ${item.name} profile`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 group-hover:text-[#053697] transition-colors shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                      {item.shortName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {item.displayHandle || "Connected"}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#053697] transition-colors shrink-0 ml-1.5" />
              </a>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleClick(item, e)}
                className="flex items-center justify-between p-3 rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer text-left"
                title={`${item.name} not linked yet`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400 shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-600 leading-tight truncate">
                      {item.shortName}
                    </p>
                    <p className="text-[11px] text-slate-400 italic truncate">
                      Not linked
                    </p>
                  </div>
                </div>
                <Link2Off className="w-3.5 h-3.5 text-slate-300 shrink-0 ml-1.5" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Hero Banner Variant (Translucent Mac-Style Pills)
  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {socials.map((item) => {
        const isLinked = Boolean(item.url);

        return isLinked ? (
          <a
            key={item.id}
            href={item.url!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/25 text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
            title={`Follow ${playerName} on ${item.name}`}
          >
            {item.icon}
            <span className="truncate max-w-[120px]">
              {item.displayHandle || item.shortName}
            </span>
            <ExternalLink className="w-3 h-3 text-white/70" />
          </a>
        ) : (
          <button
            key={item.id}
            type="button"
            onClick={(e) => handleClick(item, e)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/15 hover:bg-black/25 active:scale-95 backdrop-blur-md border border-white/15 text-white/75 hover:text-white text-xs font-medium tracking-wide transition-all cursor-pointer"
            title={`${item.name} not connected (Click for info)`}
          >
            {item.icon}
            <span>{item.shortName}</span>
            <span className="text-[10px] text-white/50">• Unlinked</span>
          </button>
        );
      })}
    </div>
  );
};

export default PlayerSocialButtons;

