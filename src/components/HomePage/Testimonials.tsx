"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Star, Quote } from "lucide-react";
import "./testimonial.css";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../ui/avatar";

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  fan_type: string;
  description: string;
}

interface MarqueeColumnProps {
  testimonials: Testimonial[];
  direction: "up" | "down";
  speed?: number;
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Single Card ──────────────────────────────────────────────────────────────
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => (
  <div className="testimonial-card bg-[#2B8E70]/10!">
    <div className="card-glow" />

    {/* Top row: quote icon + stars */}
    <div className="card-header">
      <div className="quote-badge">
        <Quote color="#2B8E70" size={14} />
      </div>
      <div className="stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < testimonial.rating ? "star-filled" : "star-empty"}
          />
        ))}
      </div>
    </div>

    {/* Description */}
    <p className="card-description">{testimonial.description}</p>

    {/* Profile with Name Letter Avatar */}
    <div className="card-profile">
      <div className="avatar-wrap">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2FC191] to-[#053697] text-white flex items-center justify-center font-extrabold text-xs shadow-xs border-2 border-white shrink-0">
          {getInitials(testimonial.name)}
        </div>
        <span className="online-dot" />
      </div>
      <div>
        <p className="profile-name">{testimonial.name}</p>
        <p className="profile-type">{testimonial.fan_type} Fan</p>
      </div>
    </div>
  </div>
);

// ─── Infinite Marquee Column ──────────────────────────────────────────────────
const MarqueeColumn: React.FC<MarqueeColumnProps> = ({
  testimonials,
  direction,
  speed = 40,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pauseRef = useRef(false);
  const animateRef = useRef<(() => void) | null>(null);

  // We render two identical sets so the loop is seamless
  const doubled = [...testimonials, ...testimonials];

  const animate = useCallback(() => {
    const track = trackRef.current;
    if (!track || pauseRef.current) {
      rafRef.current = requestAnimationFrame(animateRef.current!);
      return;
    }

    const halfH = track.scrollHeight / 2;
    const step = speed / 60; // px per frame at 60 fps

    if (direction === "up") {
      posRef.current -= step;
      if (posRef.current <= -halfH) posRef.current += halfH;
    } else {
      posRef.current += step;
      if (posRef.current >= 0) posRef.current -= halfH;
    }

    track.style.transform = `translateY(${posRef.current}px)`;
    rafRef.current = requestAnimationFrame(animateRef.current!);
  }, [direction, speed]);

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  useEffect(() => {
    // seed initial offset for 'down' direction so it starts mid-set
    if (direction === "down" && trackRef.current) {
      const halfH = trackRef.current.scrollHeight / 2;
      posRef.current = -halfH;
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, direction]);

  return (
    <div className="marquee-column">
      <div ref={trackRef} className="marquee-track">
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Testimonials: React.FC = () => {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const update = () => {
      setColumns(
        window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3,
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const testimonialData: Testimonial[] = [
    {
      id: 1,
      name: "Alex Thompson",
      rating: 5,
      fan_type: "Soccer",
      description:
        "This platform completely transformed how I follow my favorite teams. The real-time updates and community features are absolutely incredible. I've connected with so many fellow fans!",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      rating: 5,
      fan_type: "Cricket",
      description:
        "As a cricket enthusiast, I've never found a better platform. The insights, statistics, and match analysis are top-notch. Highly recommend to all sports fans!",
    },
    {
      id: 3,
      name: "Michael Chen",
      rating: 4,
      fan_type: "Basketball",
      description:
        "The basketball coverage is phenomenal. Love the player stats and game predictions. The mobile app makes it easy to stay updated on the go.",
    },
    {
      id: 4,
      name: "Emma Wilson",
      rating: 5,
      fan_type: "Tennis",
      description:
        "Finally, a platform that gives tennis the attention it deserves! Grand slam coverage is amazing, and the analysis really helps understand the game better.",
    },
    {
      id: 5,
      name: "David Martinez",
      rating: 4,
      fan_type: "Football",
      description:
        "The football community here is incredible. Great discussions, live match threads, and fantasy league integration. Makes every game day more exciting!",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      rating: 5,
      fan_type: "Volleyball",
      description:
        "Volleyball coverage has never been better! The player profiles and match highlights are fantastic. Love the beach volleyball section especially.",
    },
    {
      id: 7,
      name: "James Taylor",
      rating: 4,
      fan_type: "Swimming",
      description:
        "As a competitive swimmer, I appreciate the detailed coverage of swimming events. The technique analysis and race predictions are spot on.",
    },
    {
      id: 8,
      name: "Robert Brown",
      rating: 5,
      fan_type: "Baseball",
      description:
        "Baseball statistics and analysis are second to none. The historical data and player comparisons help me understand the game on a deeper level.",
    },
    {
      id: 9,
      name: "Maria Garcia",
      rating: 4,
      fan_type: "Rugby",
      description:
        "Rugby coverage is comprehensive and passionate. The international tournament analysis and player interviews are absolutely brilliant!",
    },
    {
      id: 10,
      name: "Thomas Lee",
      rating: 5,
      fan_type: "Golf",
      description:
        "The golf section is exceptional. Course guides, player statistics, and tournament coverage make this a golfer's paradise. Absolutely love it!",
    },
    {
      id: 11,
      name: "Jennifer White",
      rating: 4,
      fan_type: "Hockey",
      description:
        "Hockey coverage is intense and detailed. Love the real-time game updates and post-match analysis. The community discussions are amazing!",
    },
    {
      id: 12,
      name: "Christopher Moore",
      rating: 5,
      fan_type: "Boxing",
      description:
        "Boxing analysis and fight predictions are incredibly accurate. The fighter profiles and match breakdowns help me understand the sport better.",
    },
  ];

  // Distribute cards round-robin into columns
  const colData: Testimonial[][] = Array.from({ length: columns }, (_, ci) =>
    testimonialData.filter((_, i) => i % columns === ci),
  );

  // Snake direction: even cols go up, odd cols go down
  const directionFor = (ci: number): "up" | "down" =>
    ci % 2 === 0 ? "up" : "down";

  return (
    <>
      <section className="testimonials-root w-full!  px-2">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border"
            style={{
              background: "rgba(47,193,145,0.06)",
              borderColor: "rgba(47,193,145,0.22)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#2FC191] animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#2FC191]">
              Trusted by thousands
            </span>
          </div>
          <h1 className="text-2xl font-e sm:text-4xl md:text-5xl font-bold text-[#053697] mb-4">
            Fans & Athletes Already Making{" "}
            <span className="text-[#2FC191]">an impact</span>
          </h1>

          <p className="text-black/40 max-w-2xl text-sm md:text-base mx-auto">
            Hear from the growing community of fans and athletes discovering the
            power of PROTIPPZ and what it means to be part of a new way to
            support the athletes you love.
          </p>
        </div>

        {/* Marquee scene */}
        <div className="marquee-scene">
          <div className={`marquee-grid pointer-events-none cols-${columns}`}>
            {colData.map((col, ci) => (
              <MarqueeColumn
                key={ci}
                testimonials={col}
                direction={directionFor(ci)}
                speed={columns === 1 ? 32 : 36 + ci * 4}
              />
            ))}
          </div>
        </div>

        <div className="w-full flex items-center justify-center mt-6">
          <AvatarGroup className="**:grayscale **:hover:grayscale-0 transition-all">
            <Avatar className="w-9 h-9 border-2 border-white ring-1 ring-[#2FC191]/30">
              <AvatarImage src="" alt="@shadcn" />
              <AvatarFallback className="text-xs bg-[#2FC191]/20 text-[#2FC191]">
                CN
              </AvatarFallback>
            </Avatar>
            <Avatar className="w-9 h-9 border-2 border-white ring-1 ring-[#2FC191]/30">
              <AvatarImage src="" alt="@maxleiter" />
              <AvatarFallback className="text-xs bg-[#2FC191]/20 text-[#2FC191]">
                ML
              </AvatarFallback>
            </Avatar>
            <Avatar className="w-9 h-9 border-2 border-white ring-1 ring-[#2FC191]/30">
              <AvatarImage src="" alt="@evilrabbit" />
              <AvatarFallback className="text-xs bg-[#2FC191]/20 text-[#2FC191]">
                ER
              </AvatarFallback>
            </Avatar>
            <AvatarGroupCount className="w-9 h-9 text-xs border-2 border-white bg-[#2FC191]/20 text-[#2FC191] font-semibold">
              +3
            </AvatarGroupCount>
          </AvatarGroup>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
