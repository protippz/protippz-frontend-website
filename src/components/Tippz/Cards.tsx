"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface TippzStepItem {
  _id: string;
  stepNumber: string;
  title: string;
  description: string;
  image?: StaticImageData | string;
  videoUrl?: string;
  linkHref?: string;
  linkText?: string;
}

interface Props {
  data: TippzStepItem;
}

const Cards: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden flex flex-col justify-between transition-colors">
      <div>
        {/* Media Container */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100/70 border-b border-stone-100">
          {data?.image ? (
            <Image
              src={data.image}
              alt={data.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={data.stepNumber === "01"}
            />
          ) : data?.videoUrl ? (
            <video
              className="w-full h-full object-cover"
              src={data.videoUrl}
              controls={false}
              muted
              autoPlay
              loop
              playsInline
            />
          ) : null}

          {/* Step Pill */}
          <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-white/95 border border-stone-200/90 flex items-center gap-1.5 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2FC191]" />
            <span className="text-[11px] font-bold text-stone-700 tracking-wider uppercase">
              Step {data.stepNumber}
            </span>
          </div>
        </div>

        {/* Text Content Section */}
        <div className="p-4 sm:p-5 space-y-1.5">
          <h3 className="text-sm sm:text-base font-bold text-[#053697] leading-snug">
            {data.title}
          </h3>
          <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>

      {/* Action Link Footer */}
      {data.linkHref && data.linkText && (
        <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-stone-100/80">
          <Link
            href={data.linkHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#053697] hover:text-[#2FC191] transition-colors"
          >
            <span>{data.linkText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2FC191]" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cards;
