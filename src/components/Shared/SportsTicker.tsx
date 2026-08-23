// 'use client'

// import { usePathname } from 'next/navigation'
// import { useCallback, useEffect, useRef, useState } from 'react'
// import Marquee from "react-fast-marquee"

// interface TickerHeadline {
//   id: number
//   text: string
//   description: string
//   emoji: string
//   badge: string
//   badgeType: 'womens' | 'hbcu' | 'default'
//   imageUrl?: string
//   link?: string
//   publishedAt: string
// }

// const badgeStyles: Record<string, string> = {
//   womens: 'bg-[#2EC292] text-white',
//   hbcu: 'bg-[#2EC292] text-white',
//   default: 'bg-[#2EC292] text-white',
// }

// function relativeTime(iso: string): string {
//   const diff = Date.now() - new Date(iso).getTime()
//   const mins = Math.floor(diff / 60000)
//   if (mins < 1) return 'just now'
//   if (mins < 60) return `${mins}m ago`
//   const hrs = Math.floor(mins / 60)
//   if (hrs < 24) return `${hrs}h ago`
//   return `${Math.floor(hrs / 24)}d ago`
// }

// function TickerItem({ item }: { item: TickerHeadline }) {
//   const inner = (
//     <span className="flex items-center gap-3 px-8 border-r border-border cursor-default group-hover:text-foreground transition-colors duration-200">
//       <span className="text-lg leading-none select-none" aria-hidden="true">{item.emoji}</span>
//       <span
//         className={`shrink-0 text-xs font-semibold tracking-wide uppercase px-2 py-1 rounded-full ${badgeStyles[item.badgeType] ?? badgeStyles.default}`}
//       >
//         {item.badge}
//       </span>
//       <span className="text-xs italic font-medium text-white whitespace-nowrap leading-none">
//         {item.text}
//       </span>
//       <span className="text-xs text-white/60 whitespace-nowrap ml-1 tabular-nums">
//         {relativeTime(item.publishedAt)}
//       </span>
//     </span>
//   )

//   if (item.link) {
//     return (
//       <a
//         href={item.link}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="group flex items-center"
//         aria-label={item.text}
//       >
//         {inner}
//       </a>
//     )
//   }

//   return <span className="group flex items-center">{inner}</span>
// }

// export default function SportsTicker() {
//   const [headlines, setHeadlines] = useState<TickerHeadline[]>([])
//   const [paused, setPaused] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(false)
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
//   const pathname = usePathname()

//   const fetchHeadlines = useCallback(async () => {
//     try {
//       const res = await fetch('/api/sports-news-ticker')
//       const data = await res.json()
//       if (data.success && data.headlines?.length) {
//         setHeadlines(data.headlines)
//         setError(false)
//       }
//     } catch {
//       setError(true)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchHeadlines()
//     intervalRef.current = setInterval(fetchHeadlines, 5 * 60 * 1000)
//     return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
//   }, [fetchHeadlines])

//   if (pathname === '/rewards') {
//     return null
//   }

//   return (
//     <>
//       <div
//         className="fixed bottom-0 bg-[#043697] left-0 right-0 z-9999! h-12 flex items-center overflow-hidden border-t border-border"
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//         role="marquee"
//         aria-live="off"
//         aria-label="Live sports news ticker"
//       >
//         {/* Left label */}
//         <div
//           className="relative z-10 shrink-0 flex items-center gap-2 h-full px-4 border-r border-border bg-[#2EC292]"
//           style={{ minWidth: '120px' }}
//         >
//           {/* Pulse dot */}
//           <span className="relative flex h-2 w-2 shrink-0">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
//             <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
//           </span>
//           <span className="text-base font-black tracking-widest uppercase font-e text-white select-none">
//             Live
//           </span>
//         </div>

//         {/* Scrolling content */}
//         <div className="overflow-hidden flex-1">
//           {loading ? (
//             <div className="flex items-center gap-3 px-6">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="h-3 rounded-full bg-muted animate-pulse"
//                   style={{ width: `${120 + i * 40}px` }} />
//               ))}
//             </div>
//           ) : error && headlines.length === 0 ? (
//             <span className="text-sm text-muted-foreground/60 px-6">Unable to load news — try again shortly.</span>
//           ) : (
//             <Marquee
//               pauseOnHover={paused}
//               speed={40}
//               gradient={false}
//               direction='right'
//               play={!paused}
//             >
//               {headlines.map((item) => (
//                 <TickerItem key={item.id} item={item} />
//               ))}
//             </Marquee>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import Marquee from "react-fast-marquee";

interface TickerHeadline {
  id: number;
  text: string;
  description: string;
  emoji: string;
  badge: string;
  badgeType: "womens" | "hbcu" | "default";
  imageUrl?: string;
  link?: string;
  publishedAt: string;
}

const badgeStyles: Record<string, string> = {
  womens: "bg-[var(--brand)] text-white",
  hbcu: "bg-[var(--muted-foreground)] text-white",
  default: "bg-[var(--brand)] text-white",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function TickerItem({ item }: { item: TickerHeadline }) {
  const inner = (
    <span className="flex items-center gap-3 px-8 border-r border-border cursor-default group-hover:text-foreground transition-colors duration-200">
      <span className="text-lg leading-none select-none" aria-hidden="true">
        {item.emoji}
      </span>
      <span
        className={`shrink-0 text-xs font-semibold tracking-wide uppercase px-2 py-1 rounded-full ${badgeStyles[item.badgeType] ?? badgeStyles.default}`}
      >
        {item.badge}
      </span>
      <span className="text-xs italic font-medium text-muted-foreground whitespace-nowrap leading-none">
        {item.text}
      </span>
      <span className="text-xs text-muted-foreground/60 whitespace-nowrap ml-1 tabular-nums">
        {relativeTime(item.publishedAt)}
      </span>
    </span>
  );

  if (item.link) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center"
        aria-label={item.text}
      >
        {inner}
      </a>
    );
  }

  return <span className="group flex items-center">{inner}</span>;
}

export default function SportsTicker() {
  const [headlines, setHeadlines] = useState<TickerHeadline[]>([]);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pathname = usePathname();

  const fetchHeadlines = useCallback(async () => {
    try {
      const res = await fetch("/api/sports-news-ticker");
      const data = await res.json();
      if (data.success && data.headlines?.length) {
        setHeadlines(data.headlines);
        setError(false);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeadlines();
    intervalRef.current = setInterval(fetchHeadlines, 5 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchHeadlines]);

  if (pathname === "/rewards") {
    return null;
  }

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-99 h-12 flex items-center overflow-hidden border-t border-border bg-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="marquee"
        aria-live="off"
        aria-label="Live sports news ticker"
      >
        {/* Left label */}
        <div
          className="relative z-10 shrink-0 flex items-center gap-2 h-full px-4 border-r border-border bg-(--brand)"
          style={{ minWidth: "120px" }}
        >
          {/* Pulse dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="text-base font-black tracking-widest uppercase font-e text-white select-none">
            Live
          </span>
        </div>

        {/* Scrolling content */}
        <div className="overflow-hidden flex-1">
          {loading ? (
            <div className="flex items-center gap-3 px-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full bg-muted animate-pulse"
                  style={{ width: `${120 + i * 40}px` }}
                />
              ))}
            </div>
          ) : error && headlines.length === 0 ? (
            <span className="text-sm text-muted-foreground/60 px-6">
              Unable to load news — try again shortly.
            </span>
          ) : (
            <Marquee
              pauseOnHover={paused}
              speed={40}
              gradient={false}
              direction="right"
              play={!paused}
            >
              {headlines.map((item) => (
                <TickerItem key={item.id} item={item} />
              ))}
            </Marquee>
          )}
        </div>

        {/* Pause / play button */}
        <button
          onClick={() => setPaused((p) => !p)}
          className="shrink-0 flex items-center justify-center w-12 h-full border-l border-border hover:bg-muted/50 transition-colors duration-200"
          aria-label={paused ? "Resume ticker" : "Pause ticker"}
          title={paused ? "Resume" : "Pause"}
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 2.5l7 3.5-7 3.5V2.5z"
                fill="currentColor"
                className="text-muted-foreground"
              />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect
                x="3"
                y="2"
                width="3"
                height="10"
                rx="1"
                fill="currentColor"
                className="text-muted-foreground"
              />
              <rect
                x="8"
                y="2"
                width="3"
                height="10"
                rx="1"
                fill="currentColor"
                className="text-muted-foreground"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
