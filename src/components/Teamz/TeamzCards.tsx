import Image from "next/image";
import SendTipsButton from "./Client/SendTipsButton";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "../Shared/Client/BookmarkButton";
import leagueLogo from "@/Assets/PT Logo.png";
import { TeamInterface } from "@/app/(default)/teamz/page";
import MotionDiv from "../Playerz/Motion";
import { Sparkles } from "lucide-react";

interface TeamzCardsProps {
  item: TeamInterface;
  token: string | undefined | null;
}

const TeamzCards: React.FC<TeamzCardsProps> = ({ token, item }) => {
  const cardReveal = {
    hidden: { y: "6%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const sportName = item.league?.sport || "SPORTS";
  const leagueName = item.league?.name || "NCAA";

  return (
    <MotionDiv
      variants={cardReveal}
      initial="hidden"
      animate="visible"
      className="group relative bg-white rounded-2xl sm:rounded-[22px] border border-slate-200/85 hover:border-[#2FC191]/50 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_14px_34px_rgba(5,54,151,0.11)] transition-all duration-300 p-4 sm:p-5 lg:p-6 flex flex-col justify-between overflow-hidden"
    >

      {/* Top Background Team Image Overlay (If available, very subtle) */}
      {item?.team_bg_image && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] overflow-hidden">
          <Image
            src={imageUrl(item.team_bg_image)}
            alt={item.name}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/90 to-white" />
        </div>
      )}

      {/* Top Header: Sport/League Eyebrow + Favorite Button */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#2FC191]">
            {sportName}
          </span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {leagueName}
          </span>
        </div>

        {/* Favorite Button inside a refined circular container */}
        <div
          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-amber-50/80 border border-slate-200/70 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-105 shrink-0"
          title="Bookmark Team"
        >
          <BookmarkButton
            isBookmark={item?.isBookmark}
            type="team"
            _id={item?._id}
            className="text-base leading-none text-amber-400 hover:text-amber-500 select-none cursor-pointer flex items-center justify-center"
          />
        </div>
      </div>

      {/* Middle Main Section: Team Name & Integrated Squircle Logo */}
      <div className="relative z-10 flex items-center justify-between gap-4 my-auto py-2">
        {/* Left: Team Name */}
        <div className="flex-1 pr-2">
          <h3 className="text-xl sm:text-[22px] font-black text-[#053697] tracking-tight leading-tight group-hover:text-[#042870] transition-colors line-clamp-2">
            {item.name}
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Official Team Profile
          </p>
        </div>

        {/* Right: Integrated Logo Squircle */}
        <div className="w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100/90 border border-slate-200/80 p-2.5 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
          <Image
            src={item?.team_logo ? imageUrl(item.team_logo) : leagueLogo}
            alt={item.name}
            width={72}
            height={72}
            className="object-contain max-h-full max-w-full"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = leagueLogo.src;
            }}
            unoptimized
          />
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 w-full h-px bg-slate-100 my-4" />

      {/* Bottom Footer: Sport Pill + Send Tippz Action Button */}
      <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Sport Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/60 text-xs font-semibold text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2FC191]" />
          <span className="truncate max-w-[140px]">{sportName}</span>
        </div>

        {/* Primary Action Button */}
        <SendTipsButton
          token={token}
          item={item}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          buttonText={
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#2FC191]" />
              <span>Send Tippz</span>
            </>
          }
        />
      </div>
    </MotionDiv>
  );
};

export default TeamzCards;
