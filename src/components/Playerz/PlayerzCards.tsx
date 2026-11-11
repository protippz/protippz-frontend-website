"use client";

import React, { memo, useState, useEffect } from "react";
import Image from "next/image";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "../Shared/Client/BookmarkButton";
import defaultPlayer from "@/Assets/playerDefult.jpg";
import defaultTeamLogo from "@/Assets/team.webp";
import { Player } from "@/app/(default)/playerz/page";
import SendTipsButton from "./Client/SendTipsButton";
import {
  Share2,
  Star,
  ArrowRight,
  DollarSign,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";
import { shareUrl } from "@/lib/share";

interface PlayerzCardsProps {
  item: Player;
  token: string | undefined | null;
}

const PlayerzCards: React.FC<PlayerzCardsProps> = ({ token, item }) => {
  const archiveId = item?._id ? item._id.slice(-3).toUpperCase() : "001";

  // Handle / Username display
  const usernameDisplay = item?.username
    ? item.username.replace(/^@/, "")
    : item?.name
      ? item.name.toLowerCase().replace(/[^a-z0-9]/g, "")
      : "athlete";

  // Team extraction
  const teamObj = typeof item?.team === "object" ? item.team : null;
  const teamName = teamObj?.name || "Official Athletic Program";
  const teamLogoRaw = teamObj?.team_logo || "";

  // Team logo state with dummy image fallback
  const [teamLogoSrc, setTeamLogoSrc] = useState<any>(
    teamLogoRaw ? imageUrl(teamLogoRaw) : defaultTeamLogo
  );

  useEffect(() => {
    setTeamLogoSrc(teamLogoRaw ? imageUrl(teamLogoRaw) : defaultTeamLogo);
  }, [teamLogoRaw]);

  // Player image state with default fallback
  const playerImageRaw = item?.player_image || "";
  const [playerImgSrc, setPlayerImgSrc] = useState<any>(
    playerImageRaw ? imageUrl(playerImageRaw) : defaultPlayer
  );

  useEffect(() => {
    setPlayerImgSrc(playerImageRaw ? imageUrl(playerImageRaw) : defaultPlayer);
  }, [playerImageRaw]);

  // League & Sport
  const leagueObj = typeof item?.league === "object" ? item.league : null;
  const sportDisplay = teamObj?.sport || leagueObj?.sport || "NIL ATHLETE";

  // Jersey & Position display
  const jerseyNumber =
    item?.jerceyNumber !== undefined &&
      item?.jerceyNumber !== null &&
      item?.jerceyNumber !== ""
      ? String(item.jerceyNumber)
      : null;

  const jerseyDisplay = jerseyNumber
    ? `#${jerseyNumber.padStart(2, "0")}`
    : "#00";

  const positionDisplay = item?.position
    ? item.position.toUpperCase()
    : "ATHLETE";

  // Bio / NIL Statement
  const bioText =
    item?.bio && item.bio.trim().length > 0
      ? item.bio.trim()
      : "Direct digital tips support my off-season training, nutrition plans, and collegiate athletic equipment.";

  // Social handles (schema has 'intagram', support both spellings)
  const instagramHandle = (item?.intagram || item?.instagram || "").trim();
  const twitterHandle = (item?.twitter || "").trim();
  const tiktokHandle = (item?.tiktok || "").trim();

  const getSocialLink = (platform: "ig" | "tw" | "tt", handle: string) => {
    if (handle.startsWith("http://") || handle.startsWith("https://")) {
      return handle;
    }
    const clean = handle.replace(/^@/, "");
    if (platform === "ig") return `https://instagram.com/${clean}`;
    if (platform === "tw") return `https://x.com/${clean}`;
    if (platform === "tt") return `https://tiktok.com/@${clean}`;
    return "#";
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;

    const url = item?._id
      ? `${window.location.origin}/playerz/${item._id}`
      : `${window.location.origin}/playerz`;

    await shareUrl({
      title: `${item?.name || "Athlete"} | ProTippz`,
      text: `Support ${item?.name || "this athlete"} on ProTippz!`,
      url,
      fallbackSuccessMessage: "Player link copied to clipboard!",
    });
  };

  return (
    <SendTipsButton item={item} token={token}>
      {({ openTip, openDetails }) => {
        return (
          <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-slate-300 rounded-[24px] sm:rounded-[28px]  transition-colors duration-300 overflow-hidden mb-5 sm:mb-7">
            <div className="flex flex-col md:flex-row items-stretch p-3.5 sm:p-5 md:p-3 gap-2 sm:gap-2">
              <div
                onClick={openDetails}
                className="relative w-full md:w-[250px] lg:w-[310px] xl:w-[270px] h-[220px]  md:h-auto  self-stretch shrink-0 rounded-[20px] sm:rounded-[24px] overflow-hidden cursor-pointer border border-slate-200/60 shadow-inner"
                title={`View profile for ${item?.name || "Player"}`}
              >
                <Image
                  src={playerImgSrc}
                  alt={item?.name || "Player"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 310px, 330px"
                  className="object-cover object-top group-hover/photo:scale-[1.03] transition-transform duration-500 ease-out"
                  onError={() => setPlayerImgSrc(defaultPlayer)}
                />

                <div className="absolute top-3.5 right-3.5 z-10">
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-black tracking-wider">
                    {jerseyDisplay}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center gap-1.5 flex-wrap z-10">
                  <span className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#053697] border border-white/40 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                    {positionDisplay}
                  </span>

                  <span className="px-2.5 py-1 rounded-xl bg-[#053697]/90 backdrop-blur-md text-white border border-white/20 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                    {sportDisplay}
                  </span>

                  {item?.isStripeConnected !== false ? (
                    <span className="px-2.5 py-1 rounded-xl bg-[#2FC191]/95 backdrop-blur-md text-slate-900 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping" />
                      <span>STRIPE VERIFIED</span>
                    </span>
                  ) : item?.isProfileClaimed ? (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-400/95 backdrop-blur-md text-slate-900 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-slate-900" />
                      <span>CLAIMED</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-slate-800/90 backdrop-blur-md text-slate-200 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                      NIL ATHLETE
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between py-1 px-1 sm:px-2 md:py-1.5 md:pr-2">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 text-slate-800 transition-colors">
                        <div className="relative w-4 h-4 rounded-full overflow-hidden bg-white shrink-0 border border-slate-200">
                          <Image
                            src={teamLogoSrc}
                            alt={teamName}
                            fill
                            sizes="16px"
                            className="object-contain p-0.5"
                            onError={() => setTeamLogoSrc(defaultTeamLogo)}
                          />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-tight truncate max-w-[130px] sm:max-w-[180px]">
                          {teamName}
                        </span>
                      </div>

                      <div className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-slate-500">
                        <span className="font-bold text-[#053697]">
                          [ARCHIVE: {archiveId}]
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="truncate">@{usernameDisplay}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-[#053697] active:scale-95 transition-all cursor-pointer"
                        title="Share athlete profile"
                        aria-label="Share athlete profile"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center"
                      >
                        <BookmarkButton
                          isBookmark={Boolean(item?.isBookmark)}
                          type="player"
                          _id={item?._id}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-amber-500 active:scale-95 transition-all cursor-pointer"
                        >
                          {(bookmarked) => (
                            <Star
                              className={`w-3.5 h-3.5 transition-colors ${bookmarked
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-600 hover:text-amber-500"
                                }`}
                            />
                          )}
                        </BookmarkButton>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-3.5">
                    <h3
                      onClick={openDetails}
                      className="text-2xl sm:text-3xl lg:text-[34px] font-black uppercase text-[#053697] tracking-tight leading-tight hover:text-[#042870] transition-colors cursor-pointer"
                      title={item?.name || "Player"}
                    >
                      {item?.name || "ALEXIS ANDREWS"}
                    </h3>

                    <div className="flex sm:hidden items-center gap-1.5 font-mono text-xs text-slate-500 mt-1">
                      <span className="font-bold text-[#053697]">
                        [NIL ARCHIVE: {archiveId}]
                      </span>
                      <span>•</span>
                      <span>@{usernameDisplay}</span>
                    </div>

                    {(item?.experience || item?.isProfileClaimed) && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {item?.experience && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#053697] border border-blue-200/60">
                            <Award className="w-3 h-3 text-[#053697]" />
                            <span>{item.experience}</span>
                          </span>
                        )}
                        {item?.isProfileClaimed && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Claimed Athlete</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative mt-3.5 p-3.5 sm:p-4 rounded-md bg-slate-50/90 border border-slate-200/70 text-slate-700 text-xs sm:text-[13px] leading-relaxed">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      <span>NIL Statement</span>
                    </div>
                    <p className="italic font-medium line-clamp-2">
                      &ldquo;{bioText}&rdquo;
                    </p>
                  </div>

                  {(instagramHandle || twitterHandle || tiktokHandle) && (
                    <div className="flex items-center gap-2 mt-3.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-0.5">
                        Connect:
                      </span>
                      {instagramHandle && (
                        <a
                          href={getSocialLink("ig", instagramHandle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200/70 active:scale-95 transition-all"
                          title="Instagram"
                        >
                          <svg
                            className="w-3 h-3 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                          <span>Instagram</span>
                        </a>
                      )}
                      {twitterHandle && (
                        <a
                          href={getSocialLink("tw", twitterHandle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 active:scale-95 transition-all"
                          title="X / Twitter"
                        >
                          <svg
                            className="w-3 h-3 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          <span>X</span>
                        </a>
                      )}
                      {tiktokHandle && (
                        <a
                          href={getSocialLink("tt", tiktokHandle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 active:scale-95 transition-all"
                          title="TikTok"
                        >
                          <svg
                            className="w-3 h-3 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                          </svg>
                          <span>TikTok</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 sm:gap-2 mt-4 sm:mt-5 pt-2">
                  <button
                    type="button"
                    onClick={openTip}
                    className="h-9 px-5 rounded-md bg-[#2FC191] hover:bg-[#28b887] text-[#053697] font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer shrink-0"
                    title={`Send direct tip to ${item?.name || "Player"}`}
                  >
                    <DollarSign className="w-4 h-4 stroke-[2.5]" />
                    <span className="text-white">SEND TIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={openDetails}
                    className="flex-1 min-w-0 h-9 px-5 sm:px-6 rounded-md bg-[#053697] hover:bg-[#042870] text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                    title={`View profile for ${item?.name || "Player"}`}
                  >
                    <span className="truncate">VIEW ATHLETE PROFILE</span>
                    <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </SendTipsButton>
  );
};

export default memo(PlayerzCards);

