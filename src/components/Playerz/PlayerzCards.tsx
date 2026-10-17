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
} from "lucide-react";
import toast from "react-hot-toast";
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
    ? `JERSEY #${jerseyNumber.padStart(2, "0")}`
    : "JERSEY #00";

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
          <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-4 sm:mb-6 group">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Column: Player Photo with Team Badge & Bottom Overlay Badges */}
              <div
                onClick={openDetails}
                className="relative w-full md:w-[280px] lg:w-[320px] xl:w-[340px] h-[340px] md:h-auto min-h-[300px] md:min-h-[360px] bg-slate-900 shrink-0 overflow-hidden cursor-pointer"
                title={`View profile for ${item?.name || "Player"}`}
              >

                {/* Player Photo */}
                <Image
                  src={playerImgSrc}
                  alt={item?.name || "Player"}
                  fill
                  sizes="(max-width: 768px) 100vw, 340px"
                  className="object-contain object-top group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  onError={() => setPlayerImgSrc(defaultPlayer)}
                />

                {/* Subtle gradient vignette at bottom of photo to ensure badges pop */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

                {/* Badges Overlay at bottom of photo */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center gap-1.5 flex-wrap z-10">
                  {/* Jersey Badge */}
                  <span className="px-2.5 py-1 rounded-[4px] bg-[#053697] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                    {jerseyDisplay}
                  </span>

                  {/* Position Badge */}
                  <span className="px-2.5 py-1 rounded-[4px] bg-white text-[#053697] border border-slate-200 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                    {positionDisplay}
                  </span>

                  {/* Verification Badge */}
                  {item?.isStripeConnected !== false ? (
                    <span className="px-2.5 py-1 rounded-[4px] bg-[#2FC191] text-[#053697] text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#053697]" />
                      <span>STRIPE VERIFIED</span>
                    </span>
                  ) : item?.isProfileClaimed ? (
                    <span className="px-2.5 py-1 rounded-[4px] bg-amber-400 text-slate-900 text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                      <ShieldCheck className="w-3 h-3 text-slate-900" />
                      <span>CLAIMED</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-[4px] bg-slate-800 text-slate-200 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                      NIL ATHLETE
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Entity Overview & First-Look Information */}
              <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 flex flex-col justify-between">
                <div>
                  {/* Top Line: Team Badge, Archive Tag, and Action Icons */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Team Affiliation Micro-Pill & Handle */}
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/90 text-slate-800">
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
                        <span className="text-[11px] font-bold uppercase tracking-tight truncate max-w-[130px] sm:max-w-[170px]">
                          {teamName}
                        </span>
                        {sportDisplay && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {sportDisplay}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="hidden sm:flex items-center gap-1 font-mono text-xs text-slate-500 min-w-0 truncate">
                        <span className="font-bold text-[#053697]">
                          [ARCHIVE: {archiveId}]
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="truncate">@{usernameDisplay}</span>
                      </div>
                    </div>

                    {/* Action Icon Buttons: Share & Favorite */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#053697] hover:border-[#053697] hover:bg-slate-50 transition-colors cursor-pointer"
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
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-amber-500 hover:border-amber-400 hover:bg-amber-50/40 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              item?.isBookmark
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-500"
                            }`}
                          />
                        </BookmarkButton>
                      </div>
                    </div>
                  </div>

                  {/* Athlete Name & Identity */}
                  <div className="mt-2.5 sm:mt-3">
                    <h3
                      onClick={openDetails}
                      className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#053697] tracking-tight leading-tight hover:text-[#042870] transition-colors cursor-pointer"
                      title={item?.name || "Player"}
                    >
                      {item?.name || "ALEXIS ANDREWS"}
                    </h3>

                    {/* Subline on mobile for handle & archive */}
                    <div className="flex sm:hidden items-center gap-1.5 font-mono text-xs text-slate-500 mt-1">
                      <span className="font-bold text-[#053697]">
                        [NIL ARCHIVE: {archiveId}]
                      </span>
                      <span>•</span>
                      <span>@{usernameDisplay}</span>
                    </div>

                    {/* Metadata chips: Experience / Profile Claimed */}
                    {(item?.experience || item?.isProfileClaimed) && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {item?.experience && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#053697] border border-blue-200/60">
                            <Award className="w-3 h-3 text-[#053697]" />
                            <span>{item.experience}</span>
                          </span>
                        )}
                        {item?.isProfileClaimed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Claimed Athlete</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>


                  {/* Athlete Bio / NIL Mission Statement */}
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3 sm:p-3.5 mt-3 text-xs sm:text-[13px] text-slate-600 italic font-medium leading-relaxed line-clamp-2">
                    &ldquo;{bioText}&rdquo;
                  </div>

                  {/* Social Handles (clean, optional icon chips) */}
                  {(instagramHandle || twitterHandle || tiktokHandle) && (
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                        Connect:
                      </span>
                      {instagramHandle && (
                        <a
                          href={getSocialLink("ig", instagramHandle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors border border-pink-200/60"
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
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200/60"
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
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200/60"
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

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2.5 sm:gap-3 mt-4 sm:mt-5 pt-1">
                  <button
                    type="button"
                    onClick={openTip}
                    className="h-11 sm:h-12 px-4 sm:px-6 rounded-xl bg-[#2FC191] hover:bg-[#28ab80] active:scale-[0.99] text-[#053697] font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs hover:shadow shrink-0"
                    title={`Send direct tip to ${item?.name || "Player"}`}
                  >
                    <DollarSign className="w-4 h-4 text-[#053697]" />
                    <span>SEND TIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={openDetails}
                    className="flex-1 min-w-0 h-11 sm:h-12 px-4 sm:px-6 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.99] text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow"
                    title={`View profile for ${item?.name || "Player"}`}
                  >
                    <span className="truncate">VIEW PLAYER PROFILE</span>
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

