"use client";

import { useRef } from "react";
import { IMAGE } from "@/constant/image.index";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Find a player",
    description:
      "Discover and support your favourite female athletes from around the world. Search by sport, country, or team.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="6.5" cy="6.5" r="4" stroke="#fff" strokeWidth="1.25" />
        <path
          d="M10 10L13.5 13.5"
          stroke="#fff"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Send a tip",
    description:
      "Female athletes struggle to secure sponsorships. Your direct tip reaches them instantly — no middlemen, no delays.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 8h10M8 4l4 4-4 4"
          stroke="#fff"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Earn rewards",
    description:
      "Every tip earns you points and unlocks exclusive fan rewards — merch, meet-and-greets, and VIP fan experiences.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 2l1.5 3.5H13l-2.75 2 1 3.5L8 9.25 4.75 11l1-3.5L3 5.5h3.5L8 2z"
          stroke="#fff"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function WhyProtippzExist() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      aria-labelledby="why-protippz-heading"
    >
      <div className="relative w-full container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-6xl mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border"
            style={{
              background: "rgba(42,146,109,0.06)",
              borderColor: "rgba(42,146,109,0.22)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#308D6F] animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#308D6F]">
              Why PROTIPPZ Exists
            </span>
          </div>

          <h2
            id="why-protippz-heading"
            className="text-2xl font-e sm:text-5xl font-black text-[#154098] mb-5 leading-[1.1] tracking-[-0.03em]"
          >
            Female athletes are{" "}
            <span className="text-[#308D6F]">underpaid,</span>{" "}
            <span className="text-[#308D6F]">undervalued,</span>{" "}
            <span className="text-[#308D6F]">and overlooked</span>
          </h2>

          <p className="text-[#57606A] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Despite the talent, passion, and fans behind them — female athletes
            face a massive pay gap. PROTIPPZ turns fan support into real income
            and real impact.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start lg:items-center">
          {/* Image — full width on mobile/tablet, spans 2 rows on desktop */}
          <div
            className="relative rounded-2xl overflow-hidden border bg-white col-span-1 lg:row-span-2"
            style={{ borderColor: "#D0D7DE" }}
          >
            <Image
              priority
              placeholder="blur"
              blurDataURL={IMAGE.protippzWorkflow.blurDataURL}
              src={IMAGE.protippzWorkflow}
              alt="Protippz Workflow"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Steps — 2-col on tablet, individual cols on desktop */}
          <div className="col-span-1 lg:contents grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={cn(
                  "group relative h-full bg-[#308D6F] rounded-xl border px-5 py-5 flex items-start gap-4 transition-all duration-200",
                  // On desktop only: step 3 spans 2 columns
                  i === 2 ? "sm:col-span-2 lg:col-span-2" : "col-span-1",
                )}
              >
                {/* Connector line — desktop only */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute left-[2.35rem] top-17 w-px h-[calc(100%+0.75rem)] z-0"
                    style={{ background: "rgba(42,146,109,0.15)" }}
                    aria-hidden="true"
                  />
                )}

                <div
                  className="relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider border"
                  style={{
                    background: "#fff",
                    borderColor: "#fff",
                    color: "#308D6F",
                  }}
                >
                  {step.number}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    {step.icon}
                    <h3 className="text-white font-semibold text-xl leading-snug">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div
                  className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7h8M7 3.5L10.5 7 7 10.5"
                      stroke="#308D6F"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-8 items-center">

          
          <div
            className="relative rounded-2xl overflow-hidden border bg-white"
            style={{ borderColor: '#D0D7DE' }}
          >
            
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent z-10" />

            <Image
              priority
              placeholder="blur"
              blurDataURL={IMAGE.protippzWorkflow.blurDataURL}
              src={IMAGE.protippzWorkflow}
              alt="Protippz Workflow"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          
          <div className="flex flex-col h-full gap-3">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="group relative h-full bg-[#308D6F] rounded-xl border px-5 py-5 flex items-start gap-4 transition-all duration-200"
              >
                
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-[2.35rem] top-[4.25rem] w-px h-[calc(100%+0.75rem)] z-0"
                    style={{ background: 'rgba(42,146,109,0.15)' }}
                    aria-hidden="true"
                  />
                )}

                
                <div
                  className="relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider border"
                  style={{
                    background: '#fff',
                    borderColor: '#fff',
                    color: '#308D6F',
                  }}
                >
                  {step.number}
                </div>

                
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    {step.icon}
                    <h3 className="text-white font-semibold text-[15px] leading-snug">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                
                <div
                  className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7h8M7 3.5L10.5 7 7 10.5"
                      stroke="#308D6F"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

        </div> */}
      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#D0D7DE] to-transparent" />
    </section>
  );
}

export default WhyProtippzExist;
