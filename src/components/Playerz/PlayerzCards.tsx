import React, { memo } from "react";
import Image from "next/image";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "../Shared/Client/BookmarkButton";
import defaultPlayer from "@/Assets/playerDefult.jpg";
import { Player } from "@/app/(default)/playerz/page";
import SendTipsButton from "./Client/SendTipsButton";

interface PlayerzCardsProps {
  item: Player;
  token: string | undefined | null;
}

const PlayerzCards: React.FC<PlayerzCardsProps> = ({ token, item }) => {
  const expLabel = item?.experience || "Jr.";

  return (
    <SendTipsButton item={item} token={token}>
      {({ openTip, openDetails }) => {


        return (
          <div className="relative bg-white border border-slate-200/90 rounded-xl overflow-hidden mb-4 sm:mb-5">
            {/* Top Primary Entity Section */}
            <div className="flex flex-col md:flex-row items-stretch p-2 gap-4">
              {/* Left Column: Player Photo */}
              <div
                onClick={openDetails}
                className="relative w-full md:w-[260px] lg:w-[290px] h-[190px] sm:h-[210px] md:h-auto min-h-[190px] shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer"
                title={`View profile for ${item.name}`}
              >
                <Image
                  src={
                    item?.player_image ? imageUrl(item.player_image) : defaultPlayer
                  }
                  alt={item.name || "Player"}
                  fill
                  sizes="(max-width: 768px) 100vw, 290px"
                  className="object-contain object-top"
                />
              </div>

              {/* Right Column: Entity Overview & Action */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  {/* Top Line: Title & Price + Select Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3
                        onClick={openDetails}
                        className="text-lg sm:text-[21px] font-bold text-[#0275d8] hover:text-[#0056b3] transition-colors cursor-pointer tracking-tight line-clamp-1"
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                    </div>

                    {/* Pricing & SELECT Action Button */}
                    <div className="shrink-0 flex flex-col items-end gap-1.5 ml-2">
                      <div className="text-right whitespace-nowrap text-xs text-slate-500 font-normal">
                        {item?.totalTips ? (
                          <>
                            total tips{" "}
                            <span className="text-base sm:text-lg font-bold text-slate-900">
                              ${item.totalTips.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <>
                            from{" "}
                            <span className="text-base sm:text-lg font-bold text-slate-900">
                              $5
                            </span>{" "}
                            / tip
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={openTip}
                        className="px-5 sm:px-6 py-2 rounded bg-[#053697] text-white text-xs sm:text-[13px] font-extrabold uppercase tracking-wider cursor-pointer"
                      >
                        SELECT
                      </button>
                    </div>
                  </div>

                  {/* Rating / Meta Line */}
                  <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 flex-wrap">
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-600 line-clamp-1">
                      {item.team?.name || "Independent"}
                    </span>

                    {/* Bookmark Favorite Button */}
                    <div className="ml-auto">
                      <BookmarkButton
                        isBookmark={item?.isBookmark}
                        type="player"
                        _id={item?._id}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-500 cursor-pointer transition-colors"
                      >
                        <span
                          className={
                            item?.isBookmark ? "text-amber-500" : "text-slate-400"
                          }
                        >
                          {item?.isBookmark ? "★" : "☆"}
                        </span>
                        <span className="text-[11px] font-semibold">
                          Favorite
                        </span>
                      </BookmarkButton>
                    </div>
                  </div>

                  {/* Amenity / Feature Tag Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3">
                    {item?.position && (
                      <span className="px-2.5 py-1 text-xs text-slate-700 bg-white border border-slate-300 rounded-[3px] font-medium">
                        Position: {item.position}
                      </span>
                    )}
                    {item?.jerceyNumber && (
                      <span className="px-2.5 py-1 text-xs text-slate-700 bg-white border border-slate-300 rounded-[3px] font-medium">
                        Jersey #{item.jerceyNumber}
                      </span>
                    )}
                    <span className="px-2.5 py-1 text-xs text-slate-700 bg-white border border-slate-300 rounded-[3px] font-medium">
                      Class: {expLabel}
                    </span>
                    {item?.league?.sport && (
                      <span className="px-2.5 py-1 text-xs text-slate-700 bg-white border border-slate-300 rounded-[3px] font-medium">
                        {item.league.sport}
                      </span>
                    )}
                    {item?.league?.name && (
                      <span className="px-2.5 py-1 text-xs text-slate-700 bg-white border border-slate-300 rounded-[3px] font-medium">
                        {item.league.name}
                      </span>
                    )}
                  </div>

                  {/* Description Paragraph */}
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mt-2.5 line-clamp-2">
                    {item?.name} plays{" "}
                    {item?.position ? `${item.position} for ` : ""}
                    {item?.team?.name || "Independent"}
                    {item?.league?.name ? ` in the ${item.league.name}` : ""}.
                    Support their athletic development, training, and season with
                    direct digital tips!
                  </p>
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
