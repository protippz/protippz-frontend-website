import React from "react";
import Image from "next/image";
import Cards, { TippzStepItem } from "@/components/Tippz/Cards";
import PhoneMockup from "@/components/Tippz/PhoneMockup";
import Money from "@/Assets/Money.png";
import player from "@/Assets/player.webp";
import playstore from "@/Assets/playstore.png";
import qrCode from "@/Assets/qrcode.png";
import SeoPage from "@/components/seo/SeoPage";
import { getSEOMetadata } from "@/components/seo/seo";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Zap,
  Smartphone,
  Trophy,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "PROTIPPZ - TIPPZ | How Direct Athlete Tipping Works",
  description:
    "Learn how to tip your favorite collegiate and pro athletes, earn reward points, and win exclusive prizes on PROTIPPZ.",
};

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.coryrains.protppz&hl=en";

const cardData: TippzStepItem[] = [
  {
    _id: "1",
    stepNumber: "01",
    image: player,
    title: "Choose a Player or Team",
    description:
      "Select your favorite athlete or team across major collegiate and professional sports leagues.",
    linkHref: "/playerz",
    linkText: "Explore Playerz",
  },
  {
    _id: "2",
    stepNumber: "02",
    image: Money,
    title: "Send Them Tippz",
    description:
      "Show immediate support and back their game performance with secure, real-time micro-tips.",
    linkHref: "/teamz",
    linkText: "Explore Teamz",
  },
  {
    _id: "3",
    stepNumber: "03",
    videoUrl: "/videos/video.mp4",
    title: "Earn Rewards & Win Prizes",
    description:
      "Accumulate reward points with every tip sent and redeem for authentic sports merchandise, tickets, and weekly giveaways.",
    linkHref: "/rewardz",
    linkText: "Explore Rewardz",
  },
];

const TipsPage = () => {
  const seoMetadata = getSEOMetadata("sportsTipping");

  return (
    <>
      <SeoPage metadata={seoMetadata} />

      <div className="w-full bg-[#FAF9F6] min-h-screen py-8 md:py-12">
        <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-4">
          {/* ================= HEADER SECTION ================= */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#053697] leading-tight tracking-tight">
              TIPPZ
            </h1>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              Tip your favorite player/team, earn rewards, and win prizes.
            </p>
          </div>

          {/* ================= STEP CARDS GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {cardData.map((card) => (
              <Cards key={card._id} data={card} />
            ))}
          </div>

          {/* ================= DOWNLOAD APP BANNER (LIGHT BORDERED) ================= */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#1f8763] text-[11px] font-semibold">
                  <Smartphone className="w-3 h-3 text-[#2FC191]" />
                  Available on Android
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#053697] tracking-tight leading-snug">
                  Download the PROTIPPZ App Today
                </h2>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Tip athletes live during the game, track your transaction log,
                  save your favorite stars, and unlock exclusive rewards right
                  from your mobile phone.
                </p>

                {/* Feature Bullet List */}
                {/* <ul className="space-y-2 pt-1 text-left inline-block lg:block">
                  {appFeatures.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs sm:text-[13px] text-stone-700 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2FC191] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul> */}

                {/* QR Code and Store Badge */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  {/* <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200/90 px-3 py-2 rounded-xl">
                    <div className="bg-white p-1 rounded-lg border border-stone-200/60 shrink-0">
                      <Image
                        src={qrCode}
                        alt="QR Code"
                        width={44}
                        height={44}
                        className="w-11 h-11 object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-stone-500">Scan to get app</p>
                      <span className="text-[11px] font-bold text-[#053697]">
                        Instant Android Setup
                      </span>
                    </div>
                  </div> */}

                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    aria-label="Get on Google Play"
                  >
                    <Image
                      src={playstore}
                      alt="Google Play"
                      width={120}
                      height={36}
                    />
                  </a>
                </div>
              </div>

              {/* Right Phone Mockup Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TipsPage;
