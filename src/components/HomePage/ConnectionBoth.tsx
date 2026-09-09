import { IMAGE } from "@/constant/image.index";
import Image from "next/image";
import React from "react";

function ConnectionBoth() {
  return (
    <section className="relative w-full">
      {/* Silk top border */}
      {/* <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#D0D7DE] to-transparent" /> */}

      <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Badge + Heading */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border"
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
              For Fan
            </span>
          </div>

          <h2 className="text-4xl font-e sm:text-5xl font-black text-[#053697] mb-4 leading-[1.1] tracking-[-0.03em]">
            Why fans love <span className="text-[#2FC191]">PROTIPPZ</span>
          </h2>

          <p className="text-[#57606A] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Tip and earn rewards our fan rewards program recognizes your
            contributions. From exclusive gifts to personalized recognition,
            keep supporting our favorite female athletes.
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-2xl border overflow-hidden bg-[#F0F5F4]"
          style={{ borderColor: "#D0D7DE" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left   Content */}
            <div className="flex flex-col justify-center px-8 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
              {/* Eyebrow */}
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#2FC191] mb-4">
                A trusted platform
              </p>

              <h3 className="text-2xl font-e sm:text-3xl lg:text-[2.15rem] font-black text-[#053697] leading-[1.15] tracking-[-0.025em] mb-4">
                Connecting fans with the{" "}
                <span className="text-[#2FC191]">athletes</span> they love
              </h3>

              <p className="text-[#57606A] text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                Where fan passion meets athlete support. PROTIPPZ makes it easy
                to show your support, make a real difference, and earn exclusive
                rewards along the way.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "#2FC191" }}
                >
                  Start tipping
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6h8M6 2.5L9.5 6 6 9.5"
                      stroke="white"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border transition-all duration-150 hover:bg-[#F6F8FA] active:scale-[0.98]"
                  style={{ borderColor: "#D0D7DE", color: "#053697" }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#053697]"
                  >
                    <path d="M3.18 23.76C3.656 24 4.24 24 5.407 24h13.186c1.168 0 1.752 0 2.228-.24a2.4 2.4 0 0 0 1.05-1.05c.129-.253.188-.547.212-.965C22 21.5 22 20.5 22 19V5c0-1.5 0-2.5-.116-2.745a2.4 2.4 0 0 0-1.05-1.05C20.358 1 19.774 1 18.607 1H5.407c-1.168 0-1.752 0-2.228.24a2.4 2.4 0 0 0-1.05 1.05C2 2.766 2 3.35 2 4.517v14.966c0 1.168 0 1.752.24 2.228a2.4 2.4 0 0 0 .94.05zM8.5 18.5v-13l9 6.5-9 6.5z" />
                  </svg>
                  Get on Play Store
                </button>
              </div>
            </div>

            {/* Right   Image */}
            <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[540px] bg-[#F6F8FA]">
              <Image
                src={IMAGE.tippz}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-90 object-center"
                alt="Female athlete supported by PROTIPPZ fans"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-l to-[#F0F5F4] via-transparent from-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Silk bottom border */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#D0D7DE] to-transparent" /> */}
    </section>
  );
}

export default ConnectionBoth;
