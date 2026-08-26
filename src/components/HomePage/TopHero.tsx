"use client";

import { useRef, useState, useCallback } from "react";
import { VIDEO } from "../../../public/video/video.index";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface Player {
  player_name: string;
  player_image: string;
  player_video_url: string | StaticImport;
}

function PlayerCard({ player }: { player: Player }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative shrink-0 w-64 md:w-72 aspect-9/14 border-zero rounded-2xl overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static image */}
      <Image
        width={288}
        height={448}
        src={player.player_image}
        alt={player.player_name}
        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}
      />

      {/* Video on hover */}
      <video
        ref={videoRef}
        src={
          typeof player.player_video_url === "string"
            ? player.player_video_url
            : ""
        }
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

      {/* Hover ring */}
      <div
        className={`absolute inset-0 rounded-2xl ring-2 ring-white/60 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
      />

      {/* Player info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-bold text-sm leading-tight">
          {player.player_name}
        </p>
      </div>
    </div>
  );
}

function TopHero() {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const data: Player[] = [
    {
      player_name: "Caitlin Clark",
      player_image:
        "https://i.pinimg.com/736x/8c/c7/6d/8cc76d1fea2a62335f0d0af26e459a6b.jpg",
      player_video_url: VIDEO.caitlinClark,
    },
    {
      player_name: "Aryna Sabalenka",
      player_image:
        "https://i.pinimg.com/736x/a8/da/84/a8da84c09d96da859c38c38073ccc5e3.jpg",
      player_video_url: VIDEO.arynaSabalenka,
    },
    {
      player_name: "Valentina Shevchenko",
      player_image:
        "https://i.pinimg.com/736x/79/b3/d3/79b3d3edc8c3418dcf73d8911e90080a.jpg",
      player_video_url: VIDEO.valentinaShevchenko,
    },
    {
      player_name: "Jyothi Surekha Vennam",
      player_image:
        "https://i.pinimg.com/736x/7d/2c/9c/7d2c9c50481e51c9db7d6370044125c7.jpg",
      player_video_url: VIDEO.jyothiSurekhaVennam,
    },
    {
      player_name: "Smriti Mandhana",
      player_image:
        "https://i.pinimg.com/736x/cb/99/3c/cb993c2fa15ef1172c944bbeffdb712b.jpg",
      player_video_url: VIDEO.smritiMandhana,
    },
    {
      player_name: "Mikaela Shiffrin",
      player_image:
        "https://mediacenter.longines.com/wp-content/uploads/2025/09/8deee3e763b4ac9fdbfda3e3aff3b1aa-2080x3120.jpg.webp",
      player_video_url: VIDEO.mikaelaShiffrin,
    },
  ];

  const getActiveRef = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return mobileScrollRef.current;
    }
    return desktopScrollRef.current || mobileScrollRef.current;
  };

  const onMouseDown = useCallback(
    (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return;
      setIsDragging(true);
      setStartX(e.pageX - ref.current.offsetLeft);
      setScrollLeftState(ref.current.scrollLeft);
    },
    [],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
      if (!isDragging || !ref.current) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 1.2;
      ref.current.scrollLeft = scrollLeftState - walk;
    },
    [isDragging, startX, scrollLeftState],
  );

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  const scroll = (dir: "left" | "right") => {
    const activeContainer = getActiveRef();
    if (!activeContainer) return;
    activeContainer.scrollBy({
      left: dir === "left" ? -480 : 480,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full max-w-full select-none overflow-hidden">
      {/* ─── MOBILE: stacked layout (visible below md) ─── */}
      <div className="flex flex-col md:hidden">
        {/* Text block   always visible on mobile, sits above cards */}
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-white font-e text-3xl font-black tracking-tight leading-tight">
            The Faces of
            <br />
            Women&apos;s Basketball
          </h1>
          <p className="text-white/70 text-sm mt-3 leading-relaxed max-w-sm">
            Elite athletes redefining the game. Explore the stars shaping the
            WNBA from rising rookies to all-time legends.
          </p>
        </div>

        {/* Scroll buttons on mobile */}
        <div className="flex gap-2 px-6 pb-4">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full bg-[#228c6b]/15 hover:bg-[#228c6b]/25 active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer"
            aria-label="Scroll left"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full bg-[#228c6b]/15 hover:bg-[#228c6b]/25 active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer"
            aria-label="Scroll right"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Cards row   scrollable only */}
        <div
          ref={mobileScrollRef}
          className={`flex gap-3 px-6 pb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={(e) => onMouseDown(e, mobileScrollRef)}
          onMouseMove={(e) => onMouseMove(e, mobileScrollRef)}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {data.map((player, i) => (
            <PlayerCard key={i} player={player} />
          ))}
        </div>
      </div>

      {/* ─── DESKTOP: side-by-side layout (visible from md up) ─── */}
      <div className="hidden md:flex  bg-[#228c6b]/20 rounded-3xl items-stretch py-8 w-full overflow-hidden max-w-355 mx-auto">
        {/* Left panel   fixed width, never scrolls */}
        <div className="shrink-0 w-80 lg:w-96 flex flex-col justify-center px-8 pb-2 gap-4">
          <div>
            <h1 className="text-[#228c6b] font-e text-4xl font-black tracking-tight leading-tight">
              The Faces of
              <br />
              Women&apos;s Athletes
            </h1>
            <p className="text-[#228c6b] text-sm mt-3 leading-relaxed">
              Elite athletes redefining the game. Explore the stars shaping the
              WNBA from rising rookies to all-time legends.
            </p>
          </div>

          {/* Scroll buttons   stay put */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full bg-[#228c6b]/15 hover:bg-[#228c6b]/25 active:scale-95 transition-all flex items-center justify-center text-[#228c6b] cursor-pointer"
              aria-label="Scroll left"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  d="M10 3L5 8l5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full bg-[#228c6b]/15 hover:bg-[#228c6b]/25 active:scale-95 transition-all flex items-center justify-center text-[#228c6b] cursor-pointer"
              aria-label="Scroll right"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right panel   only this area scrolls */}
        <div
          ref={desktopScrollRef}
          className={`flex-1 min-w-0 flex gap-4 pr-8 overflow-x-auto items-end [&::-webkit-scrollbar]:hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={(e) => onMouseDown(e, desktopScrollRef)}
          onMouseMove={(e) => onMouseMove(e, desktopScrollRef)}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {data.map((player, i) => (
            <PlayerCard key={i} player={player} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopHero;
