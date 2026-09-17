import React from "react";
import Image from "next/image";
import Link from "next/link";
import rewardsArt from "@/../public/new/rewards-special.jpg";

export const metadata = {
  title: "PROTIPPZ - Send Tippz, Earn Rewardz, Win Prizes",
  description:
    "When you send Tippz you will earn reward points that can be redeemed for exclusive prizes and you will be entered into weekly drawings.",
};

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.coryrains.protppz&hl=en";

const items = ["Sports Merchandise", "Cash Prizes", "Tickets & More"];

export default function ProtippzSpecialPage() {
  return (
    <div className="w-full bg-slate-50 min-h-[78vh] flex items-center justify-center py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-355 w-full mx-auto">
        <div className="relative rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 lg:p-16 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            {/* Left Content Side */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#053697] leading-tight tracking-tight">
                Send Tippz.{" "}
                <span className="text-[#2FC191]">Earn Rewardz!</span>
                <br />
                Win Prizes!!
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                When you send Tippz you will earn reward points that can be
                redeemed for exclusive prizes and you will be entered into
                weekly drawings.
              </p>

              {/* Items List */}
              <ul className="space-y-3 pt-2">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-center lg:justify-start gap-3 text-slate-700 font-semibold text-sm sm:text-base"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#2FC191] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Action Links & Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/sign-in"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#053697] hover:bg-[#042a78] text-white font-bold text-sm sm:text-base transition-colors text-center"
                >
                  Sign In Now
                </Link>

                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-50 hover:bg-[#2FC191]/10 border border-slate-200 hover:border-[#2FC191] text-[#053697] hover:text-[#2FC191] font-bold text-sm sm:text-base transition-colors text-center"
                >
                  Download Today &rarr;
                </a>
              </div>
            </div>

            {/* Right Generated Artwork Side */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <Image
                  src={rewardsArt}
                  alt="Send Tippz, Earn Rewardz, Win Prizes"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
